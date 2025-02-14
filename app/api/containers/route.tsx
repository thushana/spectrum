import { NextResponse } from 'next/server';
import { ContainerService } from '@/services/containers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!body.type || !['Post', 'Photostrip'].includes(body.type)) {
      return NextResponse.json({ error: 'Valid type is required' }, { status: 400 });
    }

    const result = await ContainerService.create({
      title: body.title,
      subtitle: body.subtitle,
      type: body.type,
    });

    return NextResponse.json({ shortname: result.shortname });
    
  } catch (error) {
    // Properly structure the error response
    const errorResponse = {
      error: 'Failed to create container',
      details: error instanceof Error ? error.message : 'Unknown error',
      // Include stack trace in development
      ...(process.env.NODE_ENV === 'development' && error instanceof Error && {
        stack: error.stack,
        name: error.name
      })
    };

    // Use console.error for server-side logging
    console.error(JSON.stringify(errorResponse, null, 2));

    return NextResponse.json(errorResponse, { status: 500 });
  }
}