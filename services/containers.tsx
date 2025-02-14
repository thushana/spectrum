import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { ShortnameService } from './shortnames';

const prisma = new PrismaClient();

type ContainerType = 'Post' | 'Photostrip';

export class ContainerService {
  static async create({ 
    title, 
    subtitle,
    type
  }: { 
    title: string; 
    subtitle?: string;
    type: ContainerType;
  }) {
    const entityId = crypto.randomUUID();
    const shortnameValue = await ShortnameService.generate(title);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create shortname first
        const shortname = await tx.shortname.create({
          data: {
            id: crypto.randomUUID(),
            value: shortnameValue,
            entityId,
            entityType: 'Container',
          },
        }).catch(error => {
          throw new Error(`Failed to create shortname: ${error.message}`);
        });

        // Then create container with matching ID
        const container = await tx.container.create({
          data: {
            id: entityId,  // This matches shortname's entityId
            title,
            subtitle: subtitle || null,
            type,
          },
        }).catch(error => {
          throw new Error(`Failed to create container: ${error.message}`);
        });

        return {
          container,
          shortname: shortname.value
        };
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Transaction failed: ${error.message}`);
      }
      throw new Error('Transaction failed with unknown error');
    }
  }
}