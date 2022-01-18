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



app.post('/send', (req, res) => {

  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env_REDIRECT_URI)

  oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
  

  const output = `
    <p> You have a new contact request  </p>
    <h3> Contact Details </h3>
    <ul>
        <li> name: ${req.body.Name}</li>
        <li> People: ${req.body.People}</li>
        <li> Message: ${req.body.Message}</li>
        <li> Date: ${req.body.Date}</li>
    </ul>
        `


  async function sendMail(){
    try{
      const accessToken = await oAuth2Client.getAccessToken()
  
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
          type: 'OAUTH2',
          user: process.env.email,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
        },
        tls: { rejectUnauthorized: false }
      })
  
      const mailOptions = {
        from: 'satish <skthedev22@gmail.com>',
        to: 'skassanjee@gmail.com',
        subject: 'New Reservation!',
        text: 'hello fromm api text',
        html: output
      };

  
      const result = await transport.sendMail(mailOptions)
      return result
    }catch(error){
        return error
      }
    }
  


    
  sendMail().then((result) => console.log('email sent.......', result)
  ).catch((error) => console.log(error.message))
  

  
  res.render('main', {msg: 'email has been sent'})
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server started...'));