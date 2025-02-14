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
    return NextResponse.json({ 
      error: 'Failed to create container',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}