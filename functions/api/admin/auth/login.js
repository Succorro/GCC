import bcrypt from 'bcryptjs';

// Configuration
const ALLOWED_ORIGINS = ['http://localhost:8788', 'https://gabrielcarcleaning.com', 'http://localhost:5173', 'https://gabrielcarcleaning1.pages.dev'];
const MAX_ATTEMPTS = 5;
const WINDOW_TIME = 15 * 60;  // 15 minutes

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function createHmacSignature(input, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(input)
  );

  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

async function createJWT(username, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iss: 'gabriel-car-cleaning',
    aud: 'admin-panel'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const signature = await createHmacSignature(
    `${encodedHeader}.${encodedPayload}`,
    secret
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function onRequestPost(context) {
  const { AUTH_STORE } = context.env;
  const origin = context.request.headers.get('Origin') || '';
  
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  try {
    // Get client IP
    const clientIP = context.request.headers.get('CF-Connecting-IP') ||
                    context.request.headers.get('X-Real-IP') || 
                    'unknown';
    
                    // Check rate limiting
    const rateLimitKey = `ratelimit:${clientIP}`;
    const rateLimitData = await AUTH_STORE.get(rateLimitKey, { type: 'json' });
    
    // if (rateLimitData) {
    //   const now = Math.floor(Date.now() / 1000);
    //   if (rateLimitData.count >= MAX_ATTEMPTS && 
    //       (now - rateLimitData.timestamp) < WINDOW_TIME) {
    //     const remainingTime = WINDOW_TIME - (now - rateLimitData.timestamp);
    //     return new Response(
    //       JSON.stringify({ 
    //         error: 'Too many login attempts',
    //         remainingTime 
    //       }),
    //       { status: 429, headers }
    //     );
    //   }
    // }

    // Parse request body
    const body = await context.request.text();
    let credentials;
    try {
      credentials = JSON.parse(body);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers }
      );
    }

    const { username, password } = credentials;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Username and password required' }),
        { status: 400, headers }
      );
    }

    // Fetch stored credentials
    const [storedUsername, storedPassword, jwtSecret] = await Promise.all([
      AUTH_STORE.get('ADMIN_USERNAME'),
      AUTH_STORE.get('HASHED_PASSWORD'),
      AUTH_STORE.get('JWT_SECRET')
    ]);

    if (!storedUsername || !storedPassword || !jwtSecret) {
      console.error('Missing required credentials in KV store');
      return new Response(
        JSON.stringify({ 
          error: 'Authentication configuration error',
          details: {
            missingUsername: !storedUsername,
            missingPassword: !storedPassword,
            missingJWTSecret: !jwtSecret
          }
        }),
        { status: 500, headers }
      );
    }

    // Verify credentials
    const isValidUsername = username === storedUsername;
    const isValidPassword = await bcrypt.compare(password, storedPassword);

    console.log('Auth check:', {
      usernameValid: isValidUsername,
      passwordValid: isValidPassword,
      attemptedUsername: username
    });

    if (!isValidUsername || !isValidPassword) {
      // Handle failed attempt
      
      await AUTH_STORE.put(rateLimitKey, JSON.stringify({
        count: (rateLimitData?.count || 0) + 1,
        timestamp: Math.floor(Date.now() / 1000)
      }), { expirationTtl: WINDOW_TIME });

      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers }
      );
    }

    // Create JWT token
    const token = await createJWT(username, jwtSecret);

    // Reset failed attempts on success
    await AUTH_STORE.delete(rateLimitKey);

    return new Response(
      JSON.stringify({
        token,
        user: { username },
        message: 'Login successful'
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
}


// Handle OPTIONS request
export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, {
    status: 204,
    headers
  });
}
