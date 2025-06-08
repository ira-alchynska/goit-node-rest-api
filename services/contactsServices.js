import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const contactsPath = path.resolve(__dirname, "db", "contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find((c) => c.id === contactId) || null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const idx = contacts.findIndex((c) => c.id === contactId);
    if (idx === -1) return null;
    const [removed] = contacts.splice(idx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removed;
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = { id: randomUUID(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
}

async function updateContact(contactId, updates) {
    const contacts = await listContacts();
    const idx = contacts.findIndex((c) => c.id === contactId);
    if (idx === -1) return null;

    contacts[idx] = { ...contacts[idx], ...updates };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[idx];
}

export { listContacts, getContactById, removeContact, addContact, updateContact };