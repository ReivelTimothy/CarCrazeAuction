// Simple JWT decoder utility for the frontend
// Note: This is NOT for verification, only for reading token payload

interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
  exp: number;
  iat: number;
}

export const decodeJWT = (token: string): JwtPayload | null => {
  try {
    // Split the token to get the payload part
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (base64url)
    const payload = parts[1];
    // Convert base64url to base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64
    const decoded = JSON.parse(atob(base64));
    
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000; // Convert to seconds
  return decoded.exp < currentTime;
};

export const getRoleFromToken = (token: string): 'user' | 'admin' | null => {
  const decoded = decodeJWT(token);
  return decoded?.role || null;
};
