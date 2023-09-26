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

module.exports = {loadContact,loadDetail};