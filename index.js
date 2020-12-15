const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

require('dotenv').config();

//Websites to be status checked
const websites = [
  'https://minethenews.com',
  'https://thepetersweeney.com',
  'https://splitmytips.com',
  'https://usamahjannoun.co.uk',
  'https://londonfootandanklesurgery.co.uk',
  'https://www.podogo.com'
]


app.get('/', (req, res) => {
    console.log('getting')

    websites.map(async (website, i) => {//for each website launch puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const response = await page.goto(website);
      const status = await response._status;
      await page.screenshot({ path: (i + '.png') });

      return await browser.close();
    })

        const transporter = nodemailer.createTransport({
            service: process.env.APP_SERVICE,
            auth: {
              user: process.env.APP_EMAIL,
              pass: process.env.APP_PASSWORD
            }
          });

          const attachments = websites.map((file, i)=>{
            return { filename: (file + '.png'), path: i + '.png' };
          })
          
          const mailOptions = {
            from: process.env.APP_EMAIL,
            to: process.env.APP_EMAIL,
            subject: 'Today\'s Site Status Results',
            text: 'The attached websites have been logged and are online.',
            attachments: attachments
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

    res.send('finished')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})