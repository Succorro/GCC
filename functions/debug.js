export async function onRequestGet(context) {
  const { env } = context;
  const { AUTH_STORE } = env;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    // Test direct KV access
    const username = await AUTH_STORE.get('ADMIN_USERNAME');
    const hasPassword = await AUTH_STORE.get('HASHED_PASSWORD');
    const hasJwtSecret = await AUTH_STORE.get('JWT_SECRET');

    // Get wrangler config info
    const configInfo = {
      isPreview: env.WORKER_ENVIRONMENT === 'preview',
      environment: env.WORKER_ENVIRONMENT,
      kvBinding: !!AUTH_STORE,
    };

    // List all KV keys
    let keys;
    try {
      keys = await AUTH_STORE.list();
    } catch (e) {
      keys = { error: e.message };
    }

    const debug = {
      timestamp: new Date().toISOString(),
      config: configInfo,
      kvStatus: {
        hasUsernameValue: !!username,
        actualUsername: username, // safe to show for debugging
        hasPasswordHash: !!hasPassword,
        hasJwtSecret: !!hasJwtSecret,
      },
      availableKeys: keys
    };

    return new Response(
      JSON.stringify(debug, null, 2),
      { headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        type: error.constructor.name
      }, null, 2),
      { 
        status: 500,
        headers 
      }
    );
  }
}