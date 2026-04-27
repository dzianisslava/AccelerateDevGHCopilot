"""
Example: Using the OAuth2 + JWT system in Python
"""

import requests
import json
from typing import Dict, Optional

class OAuthClient:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.token: Optional[str] = None
    
    def set_token(self, token: str) -> None:
        """Store JWT token for authenticated requests"""
        self.token = token
    
    def get_headers(self) -> Dict[str, str]:
        """Get headers with JWT token"""
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def login_redirect_url(self, provider: str) -> str:
        """Get OAuth login URL"""
        if provider not in ["google", "github", "microsoft"]:
            raise ValueError(f"Unknown provider: {provider}")
        return f"{self.base_url}/auth/{provider}"
    
    def get_profile(self) -> Dict:
        """Fetch user profile from protected endpoint"""
        if not self.token:
            raise ValueError("No token set. Please authenticate first.")
        
        response = requests.get(
            f"{self.base_url}/api/profile",
            headers=self.get_headers()
        )
        response.raise_for_status()
        return response.json()
    
    def get_protected_data(self) -> Dict:
        """Fetch protected data"""
        if not self.token:
            raise ValueError("No token set. Please authenticate first.")
        
        response = requests.get(
            f"{self.base_url}/api/protected-data",
            headers=self.get_headers()
        )
        response.raise_for_status()
        return response.json()
    
    def refresh_token(self) -> Dict:
        """Refresh JWT token"""
        if not self.token:
            raise ValueError("No token set. Please authenticate first.")
        
        response = requests.post(
            f"{self.base_url}/api/refresh-token",
            headers=self.get_headers()
        )
        response.raise_for_status()
        data = response.json()
        
        # Update token if new one is provided
        if 'token' in data:
            self.set_token(data['token'])
        
        return data
    
    def logout(self) -> None:
        """Clear token"""
        self.token = None
        print("Logged out")


# Usage Example:
if __name__ == "__main__":
    client = OAuthClient()
    
    # 1. Direct user to login page in browser
    print("Google OAuth URL:", client.login_redirect_url("google"))
    print("GitHub OAuth URL:", client.login_redirect_url("github"))
    print("Microsoft OAuth URL:", client.login_redirect_url("microsoft"))
    
    # 2. After user logs in and gets token (from auth-success page):
    token = input("Enter your JWT token: ").strip()
    client.set_token(token)
    
    # 3. Make authenticated requests
    try:
        profile = client.get_profile()
        print("\nUser Profile:")
        print(json.dumps(profile, indent=2))
        
        data = client.get_protected_data()
        print("\nProtected Data:")
        print(json.dumps(data, indent=2))
        
        # 4. Refresh token
        refresh_response = client.refresh_token()
        print("\nToken Refresh Response:")
        print(json.dumps(refresh_response, indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    # 5. Logout
    client.logout()
