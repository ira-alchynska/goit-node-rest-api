import { Contact } from "../db/sequelize.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
    try {
        const contacts = await Contact.findAll({ where: { owner: req.user.id } });
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
}

async function getContact(req, res, next) {
    try {
        const { id } = req.params;
        const contact = await Contact.findByPk(id);
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
        const contactToDelete = await Contact.findByPk(id);
        if (!contactToDelete) {
            throw HttpError(404, "Not found");
        }

        await Contact.destroy({ where: { id } });
        res.status(200).json(contactToDelete);
    } catch (error) {
        next(error);
    }
}

async function createContact(req, res, next) {
    try {
        const { name, email, phone, favorite } = req.body;
        const newContact = await Contact.create({ name, email, phone, favorite, owner: req.user.id });
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

        const [updated] = await Contact.update(updates, { where: { id } });
        if (!updated) {
            throw HttpError(404, "Not found");
        }

        const updatedContact = await Contact.findByPk(id);
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
}

async function updateStatusContact(req, res, next) {
    try {
        const { id } = req.params;
        const { favorite } = req.body;

        if (typeof favorite !== "boolean") {
            throw HttpError(400, "Missing field favorite or invalid value");
        }

        const [updated] = await Contact.update({ favorite }, { where: { id } });
        if (!updated) {
            throw HttpError(404, "Not found");
        }

        const updatedContact = await Contact.findByPk(id);

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error("Error in updateStatusContact:", error);
        next(error);
    }
}

export { getAllContacts, getContact, deleteContact, createContact, updateContactById, updateStatusContact };
