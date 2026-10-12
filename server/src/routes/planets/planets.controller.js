const { getHabitablePlanets } = require('../../models/planets.models.js')

async function httpGetHabitablePlanets(req, res) {
    return res.status(200).json( await getHabitablePlanets());
}

module.exports = {
    httpGetHabitablePlanets
}