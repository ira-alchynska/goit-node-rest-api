import { listContacts, getContactById, removeContact, addContact, updateContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
}

async function getContact(req, res, next) {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
}

async function deleteContact(req, res, next) {
    try {
        const { id } = req.params;
        const removedContact = await removeContact(id);
        if (!removedContact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(removedContact);
    } catch (error) {
        next(error);
    }
}

async function createContact(req, res, next) {
    try {
        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
}

async function updateContactById(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (Object.keys(updates).length === 0) {
            throw HttpError(400, "Body must have at least one field");
        }

        const updatedContact = await updateContact(id, updates);
        if (!updatedContact) {
            throw HttpError(404, "Not found");
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
}

export { getAllContacts, getContact, deleteContact, createContact, updateContactById };
