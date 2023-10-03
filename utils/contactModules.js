const fs = require('fs');
const validator = require('validator');

const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json','utf-8');
    return JSON.parse(fileBuffer);
}

const loadDetail = (nama) => {
    const contacts = loadContact();
    return contacts.find(contact => contact.nama.toLowerCase() === nama.toLowerCase());
}

const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))

}

const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

const duplicateCheck = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama.toLowerCase() == nama.toLowerCase());
}

const deleteContact = (nama) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
    saveContacts(filteredContacts);
}

const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;

}

const updateContacts = (newContact) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.nama !== newContact.oldNama);
    delete newContact.oldNama;
    filteredContacts.push(newContact);
    saveContacts(filteredContacts)

}

module.exports = {loadContact,loadDetail,addContact,duplicateCheck, findContact, deleteContact,updateContacts};