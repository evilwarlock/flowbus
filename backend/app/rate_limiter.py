import time
import redis
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    """Rate limiter using Redis with sliding window algorithm."""
    
    def __init__(self):
        try:
            # Initialize Redis connection
            self.redis_client = redis.Redis(
                host=getattr(settings, 'REDIS_HOST', 'localhost'),
                port=getattr(settings, 'REDIS_PORT', 6379),
                db=getattr(settings, 'REDIS_DB', 0),
                decode_responses=True
            )
            # Test connection
            self.redis_client.ping()
            logger.info("Redis connection established for rate limiting")
        except Exception as e:
            logger.warning(f"Redis not available, using in-memory rate limiting: {e}")
            self.redis_client = None
            self._memory_store: Dict[str, Dict[str, Any]] = {}
    
    def check_rate_limit(
        self, 
        key: str, 
        limit: int, 
        window_seconds: int = 60
    ) -> Dict[str, Any]:
        """
        Check if a key has exceeded its rate limit.
        
        Args:
            key: Unique identifier for the rate limit (e.g., "user:123" or "block:456")
            limit: Maximum number of requests allowed
            window_seconds: Time window in seconds
            
        Returns:
            Dict with allowed status and remaining count
        """
        current_time = int(time.time())
        window_start = current_time - window_seconds
        
        if self.redis_client:
            return self._check_redis_rate_limit(key, limit, window_start, current_time)
        else:
            return self._check_memory_rate_limit(key, limit, window_start, current_time)

    def _check_redis_rate_limit(self, key: str, limit: int, window_start: int, current_time: int) -> Dict[str, Any]:
        """Redis-based rate limiting using sorted sets."""
        try:
            pipe = self.redis_client.pipeline()

            # Remove old entries outside the window
            pipe.zremrangebyscore(key, 0, window_start)

            # Count current requests in window
            pipe.zcard(key)

            # Add current request
            pipe.zadd(key, {str(current_time): current_time})

            # Set expiration for cleanup.
            # ``expire`` expects a TTL in seconds, but the previous implementation
            # mistakenly passed an absolute timestamp which resulted in keys
            # sticking around for years.  Use the actual window size as the TTL so
            # old rate limit data is cleaned up promptly.
            window_seconds = current_time - window_start
            pipe.expire(key, window_seconds)

            results = pipe.execute()
            current_count = results[1] + 1  # +1 for the request we just added

            allowed = current_count <= limit
            remaining = max(0, limit - current_count)

            return {
                "allowed": allowed,
                "remaining": remaining,
                "limit": limit,
                "reset_time": current_time + window_seconds
            }
        except Exception as e:
            logger.error(f"Redis rate limit check failed: {e}")
            # Fallback to allowing the request
            window_seconds = current_time - window_start
            return {"allowed": True, "remaining": limit - 1, "limit": limit, "reset_time": current_time + window_seconds}

    def _check_memory_rate_limit(self, key: str, limit: int, window_start: int, current_time: int) -> Dict[str, Any]:
        """In-memory rate limiting fallback."""
        if key not in self._memory_store:
            self._memory_store[key] = {"requests": []}

        # Clean old requests
        requests = self._memory_store[key]["requests"]
        requests = [req_time for req_time in requests if req_time > window_start]

        # Add current request
        requests.append(current_time)
        self._memory_store[key]["requests"] = requests

        current_count = len(requests)
        allowed = current_count <= limit
        remaining = max(0, limit - current_count)

        window_seconds = current_time - window_start
        # The rate limit window resets when the earliest request in the window
        # expires.  After cleaning, ``requests`` is ordered chronologically, so
        # ``requests[0]`` holds the oldest timestamp.
        reset_time = requests[0] + window_seconds if requests else current_time + window_seconds

        return {
            "allowed": allowed,
            "remaining": remaining,
            "limit": limit,
            "reset_time": reset_time
        }

# Global rate limiter instance
rate_limiter = RateLimiter()

def check_user_rate_limit(user_id: str, requests_per_minute: int = 60) -> Dict[str, Any]:
    """Check rate limit for a specific user."""
    return rate_limiter.check_rate_limit(f"user:{user_id}", requests_per_minute, 60)

def check_block_rate_limit(block_id: str, requests_per_minute: int = 100) -> Dict[str, Any]:
    """Check rate limit for a specific block."""
    return rate_limiter.check_rate_limit(f"block:{block_id}", requests_per_minute, 60)

def check_combined_rate_limit(user_id: str, block_id: str) -> Dict[str, Any]:
    """Check combined rate limit for user + block combination."""
    user_limit = check_user_rate_limit(user_id)
    block_limit = check_block_rate_limit(block_id)
    
    # Return the most restrictive limit
    if not user_limit["allowed"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"User rate limit exceeded. Try again in {user_limit['reset_time'] - int(time.time())} seconds.",
            headers={"Retry-After": str(user_limit["reset_time"] - int(time.time()))}
        )
    
    if not block_limit["allowed"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Block rate limit exceeded. Try again in {block_limit['reset_time'] - int(time.time())} seconds.",
            headers={"Retry-After": str(block_limit["reset_time"] - int(time.time()))}
        )
    
    return {
        "allowed": True,
        "user_remaining": user_limit["remaining"],
        "block_remaining": block_limit["remaining"]
    }
