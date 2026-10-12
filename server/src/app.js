const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { logStream } = require('./services/logs.js')
const apiRouter = require('./routes/api');

const CLIENT_URL = process.env.CLIENt_URL;
const app = express();

app.use(morgan('combined', { stream: logStream }))
app.use(cors({
    origin: CLIENT_URL
}));
app.use(express.json());
app.use('/v1', apiRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/{*all}', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;