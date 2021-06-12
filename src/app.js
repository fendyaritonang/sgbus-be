const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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
app.use(morgan('combined'));

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
