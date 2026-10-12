const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planets = require('./planets.mongo');
const dataPath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

async function loadPlanetsData() {
    const promise = await new Promise((resolve, reject) => {
        fs.createReadStream(dataPath)
            .pipe(parse(
                {
                    comment: '#',
                    columns: true
                }
            ))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    upsertPlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject();
            })
            .on('end', () => {
                resolve();
            })
    });

}

async function getHabitablePlanets() {
    return await planets.find(
        {},
        { '_id': 0, '__v': 0 }
    );
}

async function upsertPlanet(planet) {
    await planets.updateOne({
        keplerName: planet.kepler_name
    },
        {
            keplerName: planet.kepler_name
        },
        {
            upsert: true
        });
}

module.exports = {
    getHabitablePlanets,
    loadPlanetsData
}
