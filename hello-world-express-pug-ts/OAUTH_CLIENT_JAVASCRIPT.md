// Example: Using the JWT token in JavaScript/Fetch

// 1. After login, you'll have a token. Store it:
const token = 'your-jwt-token-here';
localStorage.setItem('jwtToken', token);

// 2. Make authenticated API calls:
async function fetchProtectedData() {
  const token = localStorage.getItem('jwtToken');
  
  try {
    const response = await fetch('http://localhost:3000/api/protected-data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Protected data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching protected data:', error);
  }
}

// 3. Get user profile:
async function getUserProfile() {
  const token = localStorage.getItem('jwtToken');
  
  try {
    const response = await fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const profile = await response.json();
    console.log('User profile:', profile);
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

// 4. Refresh token (when expired):
async function refreshAuthToken() {
  const token = localStorage.getItem('jwtToken');
  
  try {
    const response = await fetch('http://localhost:3000/api/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const newTokenData = await response.json();
    localStorage.setItem('jwtToken', newTokenData.token);
    console.log('Token refreshed');
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}

// 5. Logout:
function logout() {
  localStorage.removeItem('jwtToken');
  window.location.href = 'http://localhost:3000/auth/logout';
}

// Example usage:
fetchProtectedData();
getUserProfile();
