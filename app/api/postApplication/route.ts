import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

interface ApplicationRequest {
  userid: any;
  applicationId: string;
  title: string;
  date: string;
  type: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body: ApplicationRequest = await request.json();

    // Validate required fields
    if (!body.applicationId || !body.title || !body.date || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert the application with empty arrays
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          userid:body.userid,
          applicationid: body.applicationId,
          title: body.title,
          date: body.date,
          type: body.type,
          answers: [],
          questions: []
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

    return NextResponse.json(data[0], { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}