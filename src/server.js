const express=require('express');
const handlebar=require('express-handlebars');
const path=require('path');
const cors=require('cors');
const hbsHelpers = require('./hbsHelper.js');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;


const app=express();

const hbs = handlebar.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/pieces'),
    helpers: hbsHelpers
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.enable('view cache');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = process.env.GOOGLE_CALLBACK_URL;
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

app.listen(3000);
console.log("Server running on 3000")

module.exports ={
    app,
    oauth2Client
}