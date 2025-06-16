require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const app = require('./app');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'dietdeli.vn-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl','dietdeli.vn-crt.pem')),
    ca: fs.readFileSync(path.join(__dirname, 'ssl','dietdeli.vn-chain.pem'))
  };

  https.createServer(options, app).listen(443, () => {
    console.log('🚀 HTTPS (production) server at https://dietdeli.vn');
  });

  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(80);
} else {
  const port = process.env.PORT || 2000;
  app.listen(port, () => {
    console.log(`🚧 Dev server at http://localhost:${port}`);
  });
}