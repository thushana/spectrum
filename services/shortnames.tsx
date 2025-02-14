import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class ShortnameService {
  private static toSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private static async findNextAvailableNumber(baseSlug: string): Promise<number | null> {
    try {
      console.log('Checking availability for slug:', baseSlug);
      
      // First check if base slug is available
      const existingBase = await prisma.shortname.findFirst({
        where: { value: baseSlug },
      });
      console.log('Existing base:', existingBase);

      if (!existingBase) {
        return null; // Base slug is available
      }

      // Find all numbered versions of this slug
      const existing = await prisma.shortname.findMany({
        where: {
          value: {
            startsWith: baseSlug + '-',
          },
        },
        orderBy: {
          value: 'desc',
        },
        take: 1,
      });
      console.log('Existing numbered versions:', existing);

      if (existing.length === 0) {
        return 2; // First numbered version
      }

      // Extract number from the last one and increment
      const lastValue = existing[0].value;
      const match = lastValue.match(/-(\d+)$/);
      if (!match) return 2;

      return parseInt(match[1]) + 1;
    } catch (error) {
      console.error('Error in findNextAvailableNumber:', error);
      throw error;
    }
  }

  static async generate(title: string): Promise<string> {
    try {
      console.log('Generating shortname for title:', title);
      
      const baseSlug = this.toSlug(title);
      console.log('Base slug:', baseSlug);
      
      const nextNumber = await this.findNextAvailableNumber(baseSlug);
      console.log('Next number:', nextNumber);

      const finalSlug = nextNumber ? `${baseSlug}-${nextNumber}` : baseSlug;
      console.log('Final slug:', finalSlug);
      
      return finalSlug;
    } catch (error) {
      console.error('Error generating shortname:', error);
      throw error;
    }
  }

  static async create({ 
    value,
    entityId,
    entityType 
  }: { 
    value: string;
    entityId: string;
    entityType: 'Container' | 'Primitive';
  }) {
    try {
      console.log('Creating shortname:', { value, entityId, entityType });
      
      const result = await prisma.shortname.create({
        data: {
          id: crypto.randomUUID(),
          value,
          entityId,
          entityType,
        },
      });
      
      console.log('Created shortname:', result);
      return result;
    } catch (error) {
      console.error('Error creating shortname:', error);
      throw error;
    }
  }
}