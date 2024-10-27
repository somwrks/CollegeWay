import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Define the type for the expected request body
interface ApplicationRequest {
  applicationId: string;
  userid: string;
  title: string;
  date: string;
  type: string;
  data: any;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: ApplicationRequest = await request.json();

    // Validate required fields
    if (!body.userid || !body.title || !body.date || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert the application into the database
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          applicationid : body.applicationId,
          userid: body.userid,
          title: body.title,
          date: body.date,
          type: body.type,
          data: body.data
        }
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      );
    }

    // Return the created application
    return NextResponse.json(
      { message: 'Application created successfully', application: data[0] },
      { status: 201 }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

