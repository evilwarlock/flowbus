import time
import sys
from pathlib import Path

# Make the backend package importable
sys.path.append(str(Path(__file__).resolve().parents[1] / "backend"))
from app.rate_limiter import RateLimiter


def test_reset_time_respects_window():
    limiter = RateLimiter()
    # Use a unique key each test run
    key = f"test:{time.time()}"
    limit = 1
    window = 10

    result1 = limiter.check_rate_limit(key, limit, window_seconds=window)
    assert result1["allowed"] is True

    result2 = limiter.check_rate_limit(key, limit, window_seconds=window)
    assert result2["allowed"] is False

    # Reset time should be roughly ``window`` seconds in the future
    reset_diff = result2["reset_time"] - int(time.time())
    assert 0 < reset_diff <= window
