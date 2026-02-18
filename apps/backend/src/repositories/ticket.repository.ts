import { prisma } from '../../lib/prisma.js';
import type { TicketStatus } from '@prisma/client';
import type { TicketListFilters } from '../types/ticket.js';

const includeRequester = { requester: true };
const ALL_STATUSES: TicketStatus[] = ['NEW', 'OPEN', 'PENDING', 'RESOLVED', 'CLOSED'];

const buildWhere = (filters: TicketListFilters, includeStatus = true) => {
  const where: Record<string, unknown> = {};

  if (includeStatus && filters.status?.length) {
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
  const whereForStatusCounts = buildWhere(filters, false);

  const orderBy = {
    [filters.sortBy]: filters.sortOrder,
  };

  const skip = (filters.page - 1) * filters.pageSize;

  const [items, total, groupedStatusCounts] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take: filters.pageSize,
      include: includeRequester,
    }),
    prisma.ticket.count({ where }),
    prisma.ticket.groupBy({
      by: ['status'],
      where: whereForStatusCounts,
      _count: {
        status: true,
      },
    }),
  ]);

  const statusCounts = ALL_STATUSES.reduce(
    (accumulator, status) => {
      accumulator[status] = 0;
      return accumulator;
    },
    {} as Record<TicketStatus, number>,
  );

  for (const row of groupedStatusCounts) {
    statusCounts[row.status] = row._count.status;
  }

  return { items, total, statusCounts };
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
