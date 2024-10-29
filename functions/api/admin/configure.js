export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { SETTINGS } = context.env;
    
    const defaultSettings = {
      businessHours: {
        monday: { 
          isOpen: false 
        },
        tuesday: { 
          start: '08:00', 
          end: '12:00', 
          breakStart: '12:00',
          breakEnd: '15:00',
          secondStart: '15:00',
          secondEnd: '18:00',
          isOpen: true 
        },
        wednesday: { 
          start: '08:00', 
          end: '12:00',
          breakStart: '12:00',
          breakEnd: '15:00',
          secondStart: '15:00',
          secondEnd: '18:00',
          isOpen: true 
        },
        thursday: { 
          isOpen: false 
        },
        friday: { 
          isOpen: false 
        },
        saturday: { 
          start: '10:00', 
          end: '16:00', 
          isOpen: true 
        },
        sunday: { 
          start: '10:00', 
          end: '16:00', 
          isOpen: true 
        }
      },
      appointmentDuration: 30, // minutes
      bufferTime: 0, // removed buffer time as requested
      services: [
        { id: 'single', name: 'Single Headlight', duration: 30, price: 30 },
        { id: 'double', name: 'Full Headlight', duration: 60, price: 60 }
      ],
      notifications: {
        confirmationTemplateId: 2, // Using template 2 as specified
        senderEmail: "quote@gabrielcarcleaning.com",
        senderName: "Gabriel Car Cleaning"
      }
    };

    await SETTINGS.put('businessConfig', JSON.stringify(defaultSettings));

    return new Response(JSON.stringify({
      success: true,
      message: "Initial configuration completed"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to configure settings",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}