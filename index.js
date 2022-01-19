const express = require('express')
const bodyParser = require('body-parser')
const exp = require('express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path');
const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const { gmail } = require('googleapis/build/src/apis/gmail');

require('dotenv').config()


const app = express()
//view engine setup
app.engine('handlebars', exp());
app.set('view engine', 'handlebars');
app.set('views',  'views')

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static('views/images')); 


//body parser middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('main')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server started...'));

  