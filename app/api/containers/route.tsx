import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Starting request with body:', body);
    
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate IDs and values first
    const entityId = crypto.randomUUID();
    const shortnameValue = `${body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${Date.now()}`;

    try {
      // Create both in a transaction with the same entityId
      const result = await prisma.$transaction(async (tx) => {
        // Create shortname first
        const shortname = await tx.shortname.create({
          data: {
            id: crypto.randomUUID(),
            value: shortnameValue,
            entityId: entityId,  // This will be Container's id
            entityType: 'Container',
          },
        });
        console.log('Shortname created:', shortname);

        // Create container with id matching shortname's entityId
        const container = await tx.container.create({
          data: {
            id: entityId,  // Using the same ID
            title: body.title,
            subtitle: body.subtitle || null,
            type: body.type || 'Post',
          },
        });
        console.log('Container created:', container);

        return shortname.value;
      });

      return NextResponse.json({ shortname: result });

    } catch (dbError) {
      console.log('Database error:', {
        name: dbError.name,
        message: dbError.message,
        code: dbError.code
      });
      throw dbError;
    }
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create container', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}