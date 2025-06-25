import { Contact } from '../db/sequelize.js';
import HttpError from '../helpers/HttpError.js';

export async function getAllContactsService(ownerId) {
    return await Contact.findAll({ where: { owner: ownerId } });
}

export async function getContactByIdService(id) {
    const contact = await Contact.findByPk(id);
    if (!contact) {
        throw HttpError(404, 'Not found');
    }
    return contact;
}

export async function deleteContactService(id) {
    const contactToDelete = await Contact.findByPk(id);
    if (!contactToDelete) {
        throw HttpError(404, 'Not found');
    }
    await Contact.destroy({ where: { id } });
    return contactToDelete;
}

export async function createContactService(contactData) {
    return await Contact.create(contactData);
}

export async function updateContactByIdService(id, updates) {
    if (Object.keys(updates).length === 0) {
        throw HttpError(400, 'Body must have at least one field');
    }
    const [updated] = await Contact.update(updates, { where: { id } });
    if (!updated) {
        throw HttpError(404, 'Not found');
    }
    return await Contact.findByPk(id);
}

export async function updateStatusContactService(id, favorite) {
    if (typeof favorite !== 'boolean') {
        throw HttpError(400, 'Missing field favorite or invalid value');
    }
    const [updated] = await Contact.update({ favorite }, { where: { id } });
    if (!updated) {
        throw HttpError(404, 'Not found');
    }
    return await Contact.findByPk(id);
}
