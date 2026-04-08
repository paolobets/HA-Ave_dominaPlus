"""Shared test fixtures for AVE DOMINA Plus tests."""
import pytest


@pytest.fixture
def ave_host():
    """Return a test AVE server host."""
    return "192.168.1.100"


@pytest.fixture
def ave_port():
    """Return a test AVE server port."""
    return 14001
