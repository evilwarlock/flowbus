import json
import hashlib
import time
import redis
from typing import Optional, Any, Dict
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class CacheManager:
    """Cache manager for API responses using Redis."""
    
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                decode_responses=True
            )
            # Test connection
            self.redis_client.ping()
            logger.info("Redis connection established for caching")
            self.enabled = True
        except Exception as e:
            logger.warning(f"Redis not available, caching disabled: {e}")
            self.redis_client = None
            self.enabled = False
    
    def _generate_cache_key(self, block_id: str, request_data: Dict[str, Any]) -> str:
        """Generate a unique cache key based on block and request data."""
        # Create a hash of the request data for consistent keys
        request_str = json.dumps(request_data, sort_keys=True)
        request_hash = hashlib.md5(request_str.encode()).hexdigest()
        return f"cache:block:{block_id}:{request_hash}"
    
    def get_cached_response(self, block_id: str, request_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get cached response for a block invocation."""
        if not self.enabled:
            return None
        
        try:
            cache_key = self._generate_cache_key(block_id, request_data)
            cached_data = self.redis_client.get(cache_key)
            
            if cached_data:
                logger.info(f"Cache hit for block {block_id}")
                return json.loads(cached_data)
                
            logger.debug(f"Cache miss for block {block_id}")
            return None
            
        except Exception as e:
            logger.error(f"Error getting cached response: {e}")
            return None
    
    def cache_response(
        self, 
        block_id: str, 
        request_data: Dict[str, Any], 
        response_data: Dict[str, Any],
        ttl_seconds: int = 300  # 5 minutes default
    ) -> bool:
        """Cache a response for future use."""
        if not self.enabled:
            return False
        
        try:
            cache_key = self._generate_cache_key(block_id, request_data)
            cached_response = {
                "response_data": response_data,
                "cached_at": int(time.time()),
                "ttl": ttl_seconds
            }
            
            self.redis_client.setex(
                cache_key, 
                ttl_seconds, 
                json.dumps(cached_response)
            )
            
            logger.info(f"Cached response for block {block_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error caching response: {e}")
            return False
    
    def invalidate_block_cache(self, block_id: str) -> int:
        """Invalidate all cached responses for a specific block."""
        if not self.enabled:
            return 0
        
        try:
            pattern = f"cache:block:{block_id}:*"
            keys = self.redis_client.keys(pattern)
            
            if keys:
                deleted = self.redis_client.delete(*keys)
                logger.info(f"Invalidated {deleted} cache entries for block {block_id}")
                return deleted
            
            return 0
            
        except Exception as e:
            logger.error(f"Error invalidating cache: {e}")
            return 0
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        if not self.enabled:
            return {"enabled": False, "message": "Cache disabled"}
        
        try:
            info = self.redis_client.info()
            return {
                "enabled": True,
                "connected_clients": info.get('connected_clients', 0),
                "used_memory": info.get('used_memory_human', '0B'),
                "total_commands_processed": info.get('total_commands_processed', 0),
                "cache_hit_rate": "Available in Redis INFO command"
            }
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"enabled": True, "error": str(e)}

# Global cache manager instance
cache_manager = CacheManager()
