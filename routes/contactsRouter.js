import express from "express";
import {
  getAllContacts,
  getContact,
  deleteContact,
  createContact,
  updateContactById,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import authMiddleware from '../helpers/authMiddleware.js';

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContactById);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateFavoriteSchema),
  async (req, res, next) => {
    try {
      await updateStatusContact(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default contactsRouter;
