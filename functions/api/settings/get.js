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
    const { SETTINGS } = context.env;
    
    // Get the requested setting from query params
    const url = new URL(context.request.url);
    const settingKey = url.searchParams.get('key') || 'businessConfig';

    // Retrieve the settings
    const settings = await SETTINGS.get(settingKey);
    
    if (!settings) {
      return new Response(JSON.stringify({
        error: "Settings not found",
        message: "Business configuration has not been initialized"
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Parse the settings to validate JSON structure
    const parsedSettings = JSON.parse(settings);

    // Function to get current business status
    const getCurrentStatus = () => {
      const now = new Date();
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const dayConfig = parsedSettings.businessHours[dayOfWeek];

      if (!dayConfig.isOpen) {
        return { isOpen: false, nextOpenDay: getNextOpenDay(dayOfWeek) };
      }

      // Check if current time falls within business hours
      const isInMorningHours = dayConfig.start && dayConfig.end && 
        currentTime >= dayConfig.start && currentTime < (dayConfig.breakStart || dayConfig.end);
      
      const isInAfternoonHours = dayConfig.secondStart && dayConfig.secondEnd && 
        currentTime >= dayConfig.secondStart && currentTime < dayConfig.secondEnd;

      return {
        isOpen: isInMorningHours || isInAfternoonHours,
        currentSchedule: {
          morning: dayConfig.start ? {
            start: dayConfig.start,
            end: dayConfig.breakStart || dayConfig.end
          } : null,
          afternoon: dayConfig.secondStart ? {
            start: dayConfig.secondStart,
            end: dayConfig.secondEnd
          } : null
        }
      };
    };

    // Helper function to get next open day
    const getNextOpenDay = (currentDay) => {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      let currentIndex = days.indexOf(currentDay);
      
      for (let i = 1; i <= 7; i++) {
        const nextIndex = (currentIndex + i) % 7;
        const nextDay = days[nextIndex];
        if (parsedSettings.businessHours[nextDay].isOpen) {
          return {
            day: nextDay,
            hours: {
              morning: {
                start: parsedSettings.businessHours[nextDay].start,
                end: parsedSettings.businessHours[nextDay].breakStart || 
                     parsedSettings.businessHours[nextDay].end
              },
              afternoon: parsedSettings.businessHours[nextDay].secondStart ? {
                start: parsedSettings.businessHours[nextDay].secondStart,
                end: parsedSettings.businessHours[nextDay].secondEnd
              } : null
            }
          };
        }
      }
      return null;
    };

    // Add current status to the response
    const responseData = {
      ...parsedSettings,
      currentStatus: getCurrentStatus()
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to retrieve settings",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}