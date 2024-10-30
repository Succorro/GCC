export const onRequest = async (context) => {
  const origin = context.request.headers.get('Origin') || '';
  const ALLOWED_ORIGINS = ['http://localhost:8788', 'https://gabrielcarcleaning.com', 'http://localhost:5173'];
  
  // CORS and security headers
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
  if (context.request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Get the authorization header
    const authHeader = context.request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization header' }),
        { status: 401, headers }
      );
    }

    // You could optionally blacklist the token here by storing it in AUTH_STORE
    // with an expiration time matching the original token expiration
    
    return new Response(
      JSON.stringify({ message: 'Logged out successfully' }),
      { status: 200, headers }
    );
    
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
};