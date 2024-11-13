export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    const { APPOINTMENTS } = context.env;
    const url = new URL(context.request.url);
    const startDate = url.searchParams.get('start');
    const endDate = url.searchParams.get('end');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 9;
    const sortField = url.searchParams.get('sortField') || 'date';
    const sortDirection = url.searchParams.get('sortDirection') || 'asc';
    
    // Get all appointments
    const appointments = await APPOINTMENTS.list();
    const appointmentData = await Promise.all(
      appointments.keys.map(async key => {
        const data = await APPOINTMENTS.get(key);
        return JSON.parse(data);
      })
    );
    
    // Filter by date range if provided
    let filtered = startDate && endDate ? 
      appointmentData.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
      }) : appointmentData;
    
    // Sort the data
    filtered.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated data
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    return new Response(JSON.stringify({
      appointments: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to get appointments",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}