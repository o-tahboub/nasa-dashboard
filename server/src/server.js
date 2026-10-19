const http = require('http');

require('dotenv').config();

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.models');
const { loadLaunchesData } = require('./models/launches.models')
const { connectMongo } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, async () => {
    await connectMongo();
    await loadPlanetsData();
    await loadLaunchesData();
    console.log(`server listening at ${PORT}`)
});