export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  // Used for handling updates to availability 
  try {
    // Steven: why isnt settings used? 
    const { AVAILABILITY, SETTINGS } = context.env;
    
    switch (context.request.method) {
      case "POST": {
        // Block specific dates/times
        const body = await context.request.json();
        const { date, times, reason } = body;
        
        for (const time of times) {
          const key = `${date}_${time}`;
          await AVAILABILITY.put(key, JSON.stringify({
            status: "blocked",
            reason,
            updatedAt: new Date().toISOString()
          }));
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: "Availability updated"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      case "DELETE": {
        // Unblock specific dates/times
        const body = await context.request.json();
        const { date, times } = body;
        
        for (const time of times) {
          const key = `${date}_${time}`;
          await AVAILABILITY.delete(key);
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: "Availability restored"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      default:
        return new Response("Method not allowed", { status: 405 });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to manage availability",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}