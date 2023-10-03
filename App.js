// importing express.js module
const express = require('express');
const app = express();
// importing express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');
// importing internal modules
const { loadContact,loadDetail, addContact, duplicateCheck, deleteContact, findContact, updateContacts } = require('./utils/contactModules');
// flash message modules
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
//port
const port = 3000;

// validator
const {body, validationResult} = require('express-validator');

// middleware
app.set('view engine','ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// flash msg middlewares
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge:6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
})
);
app.use(flash());

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
        contacts,
        msg: req.flash('msg'),
    })
});

app.post('/contact',
[
    body('email').isEmail().withMessage('Not valid e-mail'),
    body('noHP').isMobilePhone('id-ID').withMessage('Not valid Indonesian phone number'),
    body('nama').custom((value)=>{
        const duplicate = duplicateCheck(value);
        if(duplicate){
            throw new Error('Name is used');
        }
        return true;
    })
]
,(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('add-contact',
        {
            title: 'Add Contact',
            layout: 'layouts/main-layout',
            errors: errors.array()
        }
        );

    }
    else{
        addContact(req.body);
        req.flash('msg', 'Contact has been successfully added');
        res.redirect('/contact'); // return to /contact GET
    }
   

})

app.get('/contact/add', (req,res) => {
    res.render('add-contact',{
        layout: 'layouts/main-layout',
        title: 'Add Contact',
    })
});

app.get('/contact/delete/:name',((req,res) => {
    const contact = findContact(req.params.name);
    if(!contact){
    } else {
        deleteContact(req.params.name);
        req.flash('msg', 'Contact has been successfully deleted');
        res.redirect('/contact'); // return to /contact GET
    }
}));

app.get('/contact/edit/:name', (req,res) => {
    const contact = findContact(req.params.name);
    res.render('edit-contact',{
        layout: 'layouts/main-layout',
        title: 'Edit Contact',
        contact,
    })
});

app.post('/contact/update',
[
    body('email').isEmail().withMessage('Not valid e-mail'),
    body('noHP').isMobilePhone('id-ID').withMessage('Not valid Indonesian phone number'),
    body('nama').custom((value, { req })=>{
        const duplicate = duplicateCheck(value);
        if(value !== req.body.oldNama && duplicate){
            throw new Error('Name is used');
        }
        return true;
    })
]
,(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('edit-contact',
        {
            title: 'Edit Contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        }
        );

    }
    else{
        updateContacts(req.body);
        req.flash('msg', 'Contact has been successfully added');
        res.redirect('/contact'); // return to /contact GET
    }
   

})



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