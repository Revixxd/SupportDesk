import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller.js';

const ticketRouter: Router = Router();

ticketRouter.get('/', ticketController.listTickets);
ticketRouter.get('/tickets', ticketController.listTickets);
ticketRouter.get('/tickets/:id', ticketController.getTicketById);

export { ticketRouter };
