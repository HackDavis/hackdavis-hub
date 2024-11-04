import { NextRequest, NextResponse } from 'next/server';
import { createUserToEvent } from '@datalib/user-to-event/createUserToEvent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await createUserToEvent(body); // Get the response from createUserToEvent
    return NextResponse.json(response); // Return the response
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred'; // Default error message

    // Check if the error is an instance of Error
    if (error instanceof Error) {
      errorMessage = error.message; // Use the message from the Error object
    }

    console.log('Error in POST handler:', errorMessage);
    return NextResponse.json(
      { ok: false, body: null, error: errorMessage },
      { status: 500 }
    );
  }
}
