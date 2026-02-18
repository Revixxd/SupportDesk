import '../lib/load-env.js';
import { prisma } from '../lib/prisma.js';
import {
  TicketChannel,
  TicketPriority,
  TicketStatus,
  type TicketChannel as TicketChannelType,
  type TicketPriority as TicketPriorityType,
  type TicketStatus as TicketStatusType,
} from '../generated/prisma/enums.js';

const requesterFirstNames = [
  'Anna',
  'Piotr',
  'Marta',
  'Krzysztof',
  'Ewa',
  'Tomasz',
  'Karolina',
  'Marek',
  'Alicja',
  'Jakub',
  'Natalia',
  'Michal',
  'Monika',
  'Pawel',
  'Magdalena',
  'Kamil',
  'Joanna',
  'Rafal',
  'Katarzyna',
  'Lukasz',
];

const requesterLastNames = [
  'Nowak',
  'Kowalski',
  'Wisniewska',
  'Wojcik',
  'Kowalczyk',
  'Kaminska',
  'Lewandowski',
  'Zielinska',
  'Szymanski',
  'Dabrowska',
];

const subjects = [
  'Brak dostepu do panelu klienta',
  'Bledny naliczony abonament',
  'Prosba o zmiane hasla',
  'Integracja API zwraca blad 401',
  'Brak potwierdzenia platnosci',
  'Nie dochodza e-maile powiadomien',
  'Aplikacja mobilna crashuje przy logowaniu',
  'Potrzeba resetu 2FA',
  'Problem z eksportem raportu',
  'Zamkniecie konta i usuniecie danych',
  'Niewidoczne faktury za poprzedni miesiac',
  'Nie dziala webhook dla zamowien',
  'Prosba o aktywacje funkcji premium',
  'Problem z importem CSV',
  'Bledna strefa czasowa w harmonogramie',
];

const descriptions = [
  'Klient zglasza, ze po zalogowaniu widzi pusty dashboard.',
  'Wystawiona faktura ma inna kwote niz uzgodniona w umowie.',
  'Uzytkownik utracil dostep do telefonu i nie moze przejsc 2FA.',
  'Integracja przestala dzialac po ostatniej rotacji klucza API.',
  'Powiadomienia sa wysylane nieregularnie, potrzebna diagnostyka.',
  'W trakcie eksportu raportu pojawia sie timeout po 30 sekundach.',
  'Klient potrzebuje pilnej odpowiedzi przed koncem dnia.',
];

const assignees = [
  { name: 'Agnieszka Support', email: 'agnieszka.support@helpdesk.local' },
  { name: 'Daniel Support', email: 'daniel.support@helpdesk.local' },
  { name: 'Iwona Support', email: 'iwona.support@helpdesk.local' },
  { name: 'Patryk Support', email: 'patryk.support@helpdesk.local' },
  { name: 'Sylwia Support', email: 'sylwia.support@helpdesk.local' },
];

const statuses: TicketStatusType[] = [
  TicketStatus.NEW,
  TicketStatus.OPEN,
  TicketStatus.PENDING,
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
];

const weightedStatuses: Array<{ status: TicketStatusType; weight: number }> = [
  { status: TicketStatus.NEW, weight: 0.15 },
  { status: TicketStatus.OPEN, weight: 0.33 },
  { status: TicketStatus.PENDING, weight: 0.22 },
  { status: TicketStatus.RESOLVED, weight: 0.2 },
  { status: TicketStatus.CLOSED, weight: 0.1 },
];

const priorities: TicketPriorityType[] = [
  TicketPriority.LOW,
  TicketPriority.NORMAL,
  TicketPriority.HIGH,
  TicketPriority.URGENT,
];

const channels: TicketChannelType[] = [
  TicketChannel.EMAIL,
  TicketChannel.WEB,
  TicketChannel.PHONE,
  TicketChannel.API,
];

const pick = <T>(items: readonly T[], index: number): T => {
  return items[index % items.length]!;
};

const seededRandom = (index: number): number => {
  const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const pickWeightedStatus = (index: number): TicketStatusType => {
  const randomValue = seededRandom(index);
  let cumulativeWeight = 0;

  for (const item of weightedStatuses) {
    cumulativeWeight += item.weight;
    if (randomValue <= cumulativeWeight) {
      return item.status;
    }
  }

  return statuses[statuses.length - 1]!;
};

const publicKeyFromIndex = (index: number): string => {
  return `HLP-2026-${String(index).padStart(6, '0')}`;
};

const seed = async () => {
  const requesterCount = 24;
  const ticketCount = 70;

  await prisma.ticket.deleteMany();
  await prisma.requester.deleteMany();

  const requesterData = Array.from({ length: requesterCount }, (_, index) => {
    const firstName = pick(requesterFirstNames, index);
    const lastName = pick(requesterLastNames, index * 2);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName}.${lastName}.${index + 1}@example.test`.toLowerCase();
    const phone = `+48 600 ${String(100000 + index).slice(-3)} ${String(200 + index)
      .slice(-3)
      .padStart(3, '0')}`;

    return {
      email,
      name: fullName,
      phone,
    };
  });

  const requesters = await prisma.requester.createManyAndReturn({
    data: requesterData,
    select: { id: true, email: true },
  });

  const now = Date.now();

  const ticketData = Array.from({ length: ticketCount }, (_, index) => {
    const requester = pick(requesters, index * 3);
    const assignee = pick(assignees, index);
    const createdAt = new Date(now - index * 6 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + (1 + (index % 8)) * 60 * 60 * 1000);

    return {
      publicKey: publicKeyFromIndex(index + 1),
      requesterId: requester.id,
      subject: pick(subjects, index),
      description: `${pick(descriptions, index)} (seed #${index + 1})`,
      status: pickWeightedStatus(index),
      priority: pick(priorities, index * 3),
      channel: pick(channels, index * 5),
      assigneeName: assignee.name,
      assigneeEmail: assignee.email,
      createdAt,
      updatedAt,
    };
  });

  await prisma.ticket.createMany({ data: ticketData });

  console.log(`Seed complete: ${requesterCount} requesters, ${ticketCount} tickets.`);
};

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
