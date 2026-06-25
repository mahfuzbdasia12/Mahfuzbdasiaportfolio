const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));

app.get('/analytics.js', (req, res) => {
  const gaId = process.env.GA_MEASUREMENT_ID;
  res.type('application/javascript');

  if (!gaId) {
    return res.send('// Analytics not configured. Set GA_MEASUREMENT_ID in .env.');
  }

  res.send(`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', { send_page_view: true });
  `);
});

const verificationFile = process.env.GOOGLE_SITE_VERIFICATION_FILE;
const verificationContent = process.env.GOOGLE_SITE_VERIFICATION_CONTENT;
if (verificationFile && verificationContent) {
  app.get(`/${verificationFile}`, (req, res) => {
    res.type('text/plain');
    res.send(verificationContent);
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
