import { prisma } from '../../lib/prisma.js';
import type { TicketListFilters } from '../types/ticket.js';

const includeRequester = { requester: true };

const buildWhere = (filters: TicketListFilters) => {
  const where: Record<string, unknown> = {};

  if (filters.status?.length) {
    where.status = { in: filters.status };
  }

  if (filters.priority?.length) {
    where.priority = { in: filters.priority };
  }

  if (filters.channel?.length) {
    where.channel = { in: filters.channel };
  }

  if (filters.requesterId) {
    where.requesterId = filters.requesterId;
  }

  if (filters.requesterEmail) {
    where.requester = {
      email: {
        contains: filters.requesterEmail,
        mode: 'insensitive',
      },
    };
  }

  if (filters.assigneeEmail) {
    where.assigneeEmail = {
      contains: filters.assigneeEmail,
      mode: 'insensitive',
    };
  }

  if (filters.search) {
    where.OR = [
      {
        publicKey: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        subject: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        requester: {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      },
      {
        requester: {
          email: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  return where;
};

const list = async (filters: TicketListFilters) => {
  const where = buildWhere(filters);

  const orderBy = {
    [filters.sortBy]: filters.sortOrder,
  };

  const skip = (filters.page - 1) * filters.pageSize;

  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take: filters.pageSize,
      include: includeRequester,
    }),
    prisma.ticket.count({ where }),
  ]);

  return { items, total };
};

const getById = async (id: string) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      OR: [{ id }, { publicKey: id }],
    },
    include: includeRequester,
  });

  return ticket;
};

export const ticketRepository = {
  list,
  getById,
};
