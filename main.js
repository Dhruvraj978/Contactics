//imports
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const app = express();
app.set('view engine', 'ejs');

//if 5000 port failed this is another case
const PORT = process.env.PORT || 1000;

//passport

//databse connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to database"));


//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUniinitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

app.use(express.static('uploads'));

//set template engine


// app.get('/', (req, res) => {
//     res.send('Hello world');
// });

//route prefix
app.use("", require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`server started ${PORT}`);
})