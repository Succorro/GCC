export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { APPOINTMENTS, AVAILABILITY, SETTINGS, BREVO_API_KEY } = context.env;
    
    if(!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not configurated correctly!');
    }

    // Information passed through component
    const body = await context.request.json();

    // Generate appointment ID and get timestamp
    const appointmentId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const appointmentDate = new Date(body.date);

    // Get business configuration
    const config = JSON.parse(await SETTINGS.get('businessConfig'));
    
    // Validate business hours
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayConfig = config.businessHours[dayOfWeek];
    
    if (!dayConfig.isOpen) {
      throw new Error('Selected date is not a business day');
    }

    // Create appointment data
    const appointmentData = {
      id: appointmentId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      vehicle: body.vehicle,
      service: body.service,
      duration: `${body.service.duration}minutes`,
      price: body.service.price,
      date: appointmentDate.toISOString(),
      time: body.time,
      address: body.address,
      status: "confirmed",
      createdAt: timestamp,
      lastUpdated: timestamp
    };

    // Store appointment
    await APPOINTMENTS.put(appointmentId, JSON.stringify(appointmentData));

    // Block the time slot
    const timeSlotKey = `${appointmentDate.toISOString().split('T')[0]}_${body.time}`;
    await AVAILABILITY.put(timeSlotKey, "blocked");

    // Send confirmation email via Brevo
    if (body.email) {
      const service = config.services.find(s => s.id === body.service);
      
      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: {
              name: "Gabriel Car Cleaning",
              email: "quote@gabrielcarcleaning.com"
            },
            to: [{
              email: appointmentData.email,
              name: appointmentData.name
            }],
            subject: "Appointment Confirmation",
            params: {
              name: appointmentData.name,
              status: appointmentData.status,
              appointment_id: appointmentData.id,
              date: appointmentData.date,
              time: appointmentData.time,
              vehicle: appointmentData.vehicle,
              service: service.name,
              duration: appointmentData.duration,
              price: appointmentData.price,
              address: appointmentData.address
            },
            templateId: config.notifications.confirmationTemplateId
        })
      });
      
      const emailResult = await brevoResponse.json();
  
      if(!brevoResponse.ok) {
        console.error('Brevo API error:', emailResult);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
  }

  return new Response(JSON.stringify({
    success: true,
    appointmentId,
    message: "Appointment created successfully"
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to create appointment",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}