import type { Request, Response } from 'express';
import { BadRequestError, ticketService } from '../services/ticket.service.js';

const listTickets = async (req: Request, res: Response) => {
  try {
    const response = await ticketService.listTickets(req);
    res.json(response);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTicketById = async (req: Request, res: Response) => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!idParam) {
      res.status(400).json({ error: 'Ticket id is required' });
      return;
    }

    const ticket = await ticketService.getTicketDetails(idParam);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!idParam) {
      res.status(400).json({ error: 'Ticket id is required' });
      return;
    }

    const ticket = await ticketService.updateTicketStatus(
      idParam,
      (req.body as { status?: string } | undefined)?.status,
    );

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const ticketController = {
  listTickets,
  getTicketById,
  updateTicketStatus,
};
