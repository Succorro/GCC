import { SendGridApi } from '@sendgrid/mail';

export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { APPOINTMENTS, AVAILABILITY } = context.env;
    const body = await context.request.json();
    
    // Generate unique appointment ID
    const appointmentId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Format date and time for storage
    const appointmentDate = new Date(body.date);
    const timeSlot = body.time;
    
    // Check if the time slot is available
    const availabilityKey = `${appointmentDate.toISOString().split('T')[0]}_${timeSlot}`;
    const isAvailable = await AVAILABILITY.get(availabilityKey);
    
    if (isAvailable === "blocked") {
      return new Response(JSON.stringify({ 
        error: "This time slot is no longer available" 
      }), { 
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Store appointment data
    const appointmentData = {
      id: appointmentId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      vehicle: body.vehicle,
      service: body.service,
      date: appointmentDate.toISOString(),
      time: timeSlot,
      status: "pending",
      createdAt: timestamp
    };

    // Store in KV
    await APPOINTMENTS.put(appointmentId, JSON.stringify(appointmentData));
    
    // Mark time slot as taken
    await AVAILABILITY.put(availabilityKey, "blocked");

    // Send confirmation email if email provided
    if (body.email) {
      const sg = new SendGridApi();
      sg.setApiKey(context.env.SENDGRID_API_KEY);

      await sg.send({
        to: body.email,
        from: 'your-verified-sender@yourdomain.com',
        subject: 'Appointment Confirmation',
        text: `Thank you for booking with us! Your appointment is scheduled for ${appointmentDate.toLocaleDateString()} at ${timeSlot}.`,
        html: `
          <h2>Appointment Confirmation</h2>
          <p>Thank you for booking with us!</p>
          <p>Your appointment details:</p>
          <ul>
            <li>Date: ${appointmentDate.toLocaleDateString()}</li>
            <li>Time: ${timeSlot}</li>
            <li>Service: ${body.service}</li>
          </ul>
        `
      });
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