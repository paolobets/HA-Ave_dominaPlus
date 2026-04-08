"""Shared test fixtures for AVE DOMINA Plus tests."""
import sys
import os
import pytest

# Insert homeassistant stubs so tests run without a full HA install.
_stubs_path = os.path.join(os.path.dirname(__file__), "..", "stubs")
if _stubs_path not in sys.path:
    sys.path.insert(0, os.path.abspath(_stubs_path))


@pytest.fixture
def ave_host():
    """Return a test AVE server host."""
    return "192.168.1.100"


@pytest.fixture
def ave_port():
    """Return a test AVE server port."""
    return 14001
