export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { APPOINTMENTS, SETTINGS } = context.env;
    const url = new URL(context.request.url);
    
    switch (context.request.method) {
      case "GET": {
        // List appointments for a date range
        const startDate = url.searchParams.get('start');
        const endDate = url.searchParams.get('end');
        
        // Get all appointments (you might want to implement pagination)
        const appointments = await APPOINTMENTS.list();
        const appointmentData = await Promise.all(
          appointments.keys.map(async key => {
            const data = await APPOINTMENTS.get(key);
            return JSON.parse(data);
          })
        );
        
        // Filter by date range if provided
        const filtered = startDate && endDate ? 
          appointmentData.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
          }) : appointmentData;
        
        return new Response(JSON.stringify(filtered), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      case "PUT": {
        const body = await context.request.json();
        const { appointmentId, status, sendNotification } = body;
        
        const appointment = await APPOINTMENTS.get(appointmentId);
        if (!appointment) {
          throw new Error('Appointment not found');
        }
        
        const updatedAppointment = {
          ...JSON.parse(appointment),
          status,
          lastUpdated: new Date().toISOString()
        };
        
        await APPOINTMENTS.put(appointmentId, JSON.stringify(updatedAppointment));
        
        // Send notification if requested
        if (sendNotification && updatedAppointment.email) {
          const config = JSON.parse(await SETTINGS.get('businessConfig'));
          
          // Send status update via Brevo
          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'api-key': context.env.BREVO_API_KEY,
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              sender: {
                name: config.notifications.senderName,
                email: config.notifications.senderEmail
              },
              to: [{
                email: updatedAppointment.email,
                name: updatedAppointment.name
              }],
              templateId: config.notifications.updateTemplateId,
              params: {
                name: updatedAppointment.name,
                status: status,
                appointment_id: appointmentId,
                date: new Date(updatedAppointment.date).toLocaleDateString(),
                time: updatedAppointment.time
              }
            })
          });
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: "Appointment updated"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      default:
        return new Response("Method not allowed", { status: 405 });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to manage appointments",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}