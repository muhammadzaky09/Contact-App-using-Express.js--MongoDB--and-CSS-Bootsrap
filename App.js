// importing express.js module
const express = require('express');
const app = express();
// importing express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');
// importing internal modules
const { loadContact,loadDetail } = require('./utils/contactModules');

//port
const port = 3000;

// middleware
app.set('view engine','ejs');
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.render('index',{
        layout: 'layouts/main-layout',
        title: 'Home',
    });
    
});

app.get('/about', (req,res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About',
    });
});

app.get('/contact', (req,res) => {
    const contacts = loadContact();
    res.render('contact',{
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts
    })
});

app.get('/contact/:name', (req,res) => {
    const name = req.params.name;
    const contact = loadDetail(name);
    res.render('detail',{
        layout: 'layouts/main-layout',
        title: 'Contact Detail',
        contact
    })
});

app.use((req,res) => {
    res.send('<h1>404<h1>');
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})