import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { ShortnameService } from './shortnames';

const prisma = new PrismaClient();

type ContainerType = 'Post' | 'Photostrip';

export class ContainerService {
  static async create({
    title,
    subtitle,
    type,
  }: {
    title: string;
    subtitle?: string;
    type: ContainerType;
  }) {
    const entityId = crypto.randomUUID();
    const shortnameValue = await ShortnameService.generate(title);

    try {
      const result = await prisma.$transaction(async (tx) => {
        const shortname = await tx.shortname.create({
          data: {
            id: crypto.randomUUID(),
            value: shortnameValue,
            entityId,
            entityType: 'Container',
          },
        });

        const container = await tx.container.create({
          data: {
            id: entityId,
            title,
            subtitle: subtitle || null,
            type,
          },
        });

        return {
          container,
          shortname: shortname.value,
        };
      });

      return result;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to create container');
    }
  }
}
