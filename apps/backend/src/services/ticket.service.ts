import type { Request } from 'express';
import type {
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from '@prisma/client';
import { ticketRepository } from '../repositories/ticket.repository.js';
import type { TicketListFilters, TicketSortBy } from '../types/ticket.js';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

const TICKET_STATUSES: TicketStatus[] = [
  'NEW',
  'OPEN',
  'PENDING',
  'RESOLVED',
  'CLOSED',
];

const TICKET_PRIORITIES: TicketPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

const TICKET_CHANNELS: TicketChannel[] = ['EMAIL', 'WEB', 'PHONE', 'API'];

const SORT_FIELDS: TicketSortBy[] = [
  'createdAt',
  'updatedAt',
  'priority',
  'status',
  'publicKey',
];

const parseString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(value)) {
    return parseString(value[0]);
  }

  return undefined;
};

const parseEnumList = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  name: string,
): T[] | undefined => {
  const parsed = parseString(value);

  if (!parsed) {
    return undefined;
  }

  const values = parsed
    .split(',')
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean) as T[];

  if (values.length === 0) {
    return undefined;
  }

  const invalid = values.filter((entry) => !allowed.includes(entry));

  if (invalid.length > 0) {
    throw new BadRequestError(
      `Invalid ${name}: ${invalid.join(', ')}. Allowed values: ${allowed.join(', ')}`,
    );
  }

  return values;
};

const parsePage = (value: unknown, defaultValue: number): number => {
  const parsed = parseString(value);
  if (!parsed) {
    return defaultValue;
  }

  const numberValue = Number(parsed);
  if (!Number.isInteger(numberValue) || numberValue < 1) {
    throw new BadRequestError('page and pageSize must be positive integers');
  }

  return numberValue;
};

const parseSortField = (value: unknown): TicketSortBy => {
  const parsed = parseString(value);
  if (!parsed) {
    return 'createdAt';
  }

  if (!SORT_FIELDS.includes(parsed as TicketSortBy)) {
    throw new BadRequestError(
      `Invalid sortBy: ${parsed}. Allowed values: ${SORT_FIELDS.join(', ')}`,
    );
  }

  return parsed as TicketSortBy;
};

const parseSortOrder = (value: unknown): 'asc' | 'desc' => {
  const parsed = parseString(value)?.toLowerCase();
  if (!parsed) {
    return 'desc';
  }

  if (parsed !== 'asc' && parsed !== 'desc') {
    throw new BadRequestError('sortOrder must be asc or desc');
  }

  return parsed;
};

const buildFilters = (request: Request): TicketListFilters => {
  const page = parsePage(request.query.page, 1);
  const pageSize = Math.min(parsePage(request.query.pageSize, 50), 200);

  return {
    status: parseEnumList(request.query.status, TICKET_STATUSES, 'status'),
    priority: parseEnumList(request.query.priority, TICKET_PRIORITIES, 'priority'),
    channel: parseEnumList(request.query.channel, TICKET_CHANNELS, 'channel'),
    requesterId: parseString(request.query.requesterId),
    requesterEmail: parseString(request.query.requesterEmail),
    assigneeEmail: parseString(request.query.assigneeEmail),
    search: parseString(request.query.search),
    sortBy: parseSortField(request.query.sortBy),
    sortOrder: parseSortOrder(request.query.sortOrder),
    page,
    pageSize,
  };
};

const listTickets = async (request: Request) => {
  const filters = buildFilters(request);
  const result = await ticketRepository.list(filters);

  return {
    data: result.items,
    meta: {
      page: filters.page,
      pageSize: filters.pageSize,
      total: result.total,
      totalPages: Math.max(1, Math.ceil(result.total / filters.pageSize)),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      statusCounts: result.statusCounts,
    },
  };
};

const getTicketDetails = async (id: string) => {
  return ticketRepository.getById(id);
};

export { BadRequestError, buildFilters };

export const ticketService = {
  listTickets,
  getTicketDetails,
};
