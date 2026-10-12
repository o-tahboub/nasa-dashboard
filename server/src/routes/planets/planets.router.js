const { Router} = require('express');

const { httpGetHabitablePlanets } = require('./planets.controller');

const planetsRouter = Router();

planetsRouter.get('/', httpGetHabitablePlanets )

module.exports = {
    planetsRouter
}