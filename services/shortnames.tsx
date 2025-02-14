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
    // First check if base slug is available
    const existingBase = await prisma.shortname.findFirst({
      where: { value: baseSlug },
    });

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

    if (existing.length === 0) {
      return 2; // First numbered version
    }

    // Extract number from the last one and increment
    const lastValue = existing[0].value;
    const match = lastValue.match(/-(\d+)$/);
    if (!match) return 2;

    return parseInt(match[1]) + 1;
  }

  static async generate(title: string): Promise<string> {
    const baseSlug = this.toSlug(title);
    const nextNumber = await this.findNextAvailableNumber(baseSlug);
    return nextNumber ? `${baseSlug}-${nextNumber}` : baseSlug;
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
    return prisma.shortname.create({
      data: {
        id: crypto.randomUUID(),
        value,
        entityId,
        entityType,
      },
    });
  }
}