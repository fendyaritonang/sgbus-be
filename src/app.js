const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const arrival = require('./utils/arrival');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(express.json());

// enabling CORS for all requests (not very secure)
app.use(cors());

// adding morgan to log HTTP requests
const dir = './log';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use(
  morgan('combined', {
    stream: fs.createWriteStream(`${dir}/access.log`, { flags: 'a' }),
  })
);

// express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.post('/arrival', (req, res) => {
  if (!req.query.buscode) {
    return res.status(404).send({
      error: 'You must provide bus stop code',
    });
  }

  arrival(req.query.buscode, (error, busService = {}) => {
    if (error) {
      return res.status(404).send({ error });
    }
    res.send(busService);
  });
});

module.exports = app;
