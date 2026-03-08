"""
Security Configuration for Flask Server
This file contains security settings to control network access
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def _parse_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _parse_origins():
    local_origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    }

    configured = set()
    cors_origins = os.environ.get("CORS_ORIGINS", "")
    if cors_origins:
        configured.update(origin.strip() for origin in cors_origins.split(",") if origin.strip())

    frontend_url = os.environ.get("FRONTEND_URL", "").strip()
    if frontend_url:
        configured.add(frontend_url)

    return sorted(local_origins.union(configured))


_explicit_allow_external = os.environ.get("ALLOW_EXTERNAL_ACCESS")
_allow_external_access = (
    _parse_bool(_explicit_allow_external)
    if _explicit_allow_external is not None
    else bool(os.environ.get("RENDER")) or os.environ.get("FLASK_CONFIG", "").lower() == "production"
)
_server_port = int(os.environ.get("PORT", "5000"))
_server_host = "0.0.0.0" if _allow_external_access else "127.0.0.1"

# Network Security Configuration
NETWORK_SECURITY = {
    # Set to 'true' to allow external network access (NOT RECOMMENDED for development)
    'allow_external_access': _allow_external_access,
    
    # Allowed hosts (localhost variants)
    'allowed_hosts': [
        '127.0.0.1',      # IPv4 localhost
        'localhost',      # Hostname localhost
        '::1',           # IPv6 localhost
    ],
    
    # Blocked IP addresses (add IPs to block here)
    'blocked_ips': set(),
    
    # Require HTTPS (set to 'true' in production)
    'require_https': _parse_bool(os.environ.get('REQUIRE_HTTPS'), default=False),
    
    # Server binding configuration
    'host': _server_host,
    'port': _server_port,
    
    # CORS origins (only localhost variants)
    'allowed_origins': _parse_origins()
}

# Security Headers
SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' if NETWORK_SECURITY['require_https'] else None,
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
}

def get_server_config():
    """Get server configuration based on environment"""
    if NETWORK_SECURITY['allow_external_access']:
        print("⚠️  WARNING: External access is enabled. This is not recommended for development.")
        return {
            'host': '0.0.0.0',
            'port': NETWORK_SECURITY['port']
        }
    else:
        print("✅ Server configured for localhost-only access")
        return {
            'host': NETWORK_SECURITY['host'],
            'port': NETWORK_SECURITY['port']
        }

def print_security_status():
    """Print current security configuration"""
    print("\n🔒 Security Configuration:")
    print(f"   External Access: {'❌ BLOCKED' if not NETWORK_SECURITY['allow_external_access'] else '⚠️  ALLOWED'}")
    print(f"   Server Host: {NETWORK_SECURITY['host']}")
    print(f"   Server Port: {NETWORK_SECURITY['port']}")
    print(f"   HTTPS Required: {'✅ Yes' if NETWORK_SECURITY['require_https'] else '❌ No'}")
    print(f"   Allowed Origins: {NETWORK_SECURITY['allowed_origins']}")
    print() 
