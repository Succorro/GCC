export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { AVAILABILITY, SETTINGS } = context.env;
    const url = new URL(context.request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      throw new Error('Date parameter is required');
    }

    // Get business hours from settings
    const businessHours = await SETTINGS.get('businessHours', { type: 'json' }) || {
      start: '09:00',
      end: '17:00',
      interval: 60
    };

    // Get blocked times for the date
    const blockedTimes = await AVAILABILITY.list({ prefix: `${date}_` });
    const blockedTimeSlots = new Set(blockedTimes.keys.map(key => key.split('_')[1]));

    // Generate all possible time slots
    const timeSlots = [];
    const [startHour] = businessHours.start.split(':').map(Number);
    const [endHour] = businessHours.end.split(':').map(Number);
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += businessHours.interval) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push({
          time: timeSlot,
          available: !blockedTimeSlots.has(timeSlot)
        });
      }
    }

    return new Response(JSON.stringify(timeSlots), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to get availability",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}