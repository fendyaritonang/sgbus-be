const app = require('./app');
const port = 443; //process.env.PORT || 4000;

const https = require('https');
const fs = require('fs');
const keyLocation = process.env.SSLCERT_LOCATION;
const key = fs.readFileSync(process.env.SSLKEY_LOCATION);
const cert = fs.readFileSync(process.env.SSLCERT_LOCATION);
const server = https.createServer({ key: key, cert: cert }, app);
server.listen(port, () => {
  console.log('Server is up on port ' + port);
});
