import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { studServiceQueries } from '@/features/stud-services/data/queries';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const serviceId = url.searchParams.get("serviceId");

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    // Get bookings for the stud service
    const bookings = await studServiceQueries.getStudBookings(serviceId);
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error in stud bookings API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const bookingData = await request.json();
    
    // Validate required fields
    if (!bookingData.studServiceId || !bookingData.femaleDogId) {
      return NextResponse.json({ 
        error: "Missing required fields: studServiceId and femaleDogId are required" 
      }, { status: 400 });
    }

    // Set the client ID to the current user
    bookingData.clientId = user.id;
    
    // Set default status if not provided
    if (!bookingData.status) {
      bookingData.status = "pending";
    }

    // Create the booking
    const booking = await studServiceQueries.createStudBooking(bookingData);
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error in create stud booking API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
