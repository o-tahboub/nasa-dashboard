const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const defaultFlightNumber = 100;

async function getFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return defaultFlightNumber;
    }

    return latestLaunch.flightNumber + 1;
}

async function launchTargetExists(launch) {
    const target = await planets.findOne(
        {
            keplerName: launch.target
        }
    );

    if (!target) {
        return false;
    }
    return true;
}

async function launchIdExists(id) {
    const launchWithId = await launches.findOne(
        {
            flightNumber: id
        }
    );

    if (!launchWithId) {
        return false;
    }
    return true;
}

async function getLaunches() {
    return await launches.find(
        {},
        { '_id': 0, '__v': 0 }
    );
}

async function createNewLaunch(launch) {
    const targetIsValid = await launchTargetExists(launch);
    if (targetIsValid) {
        let flightNumber = await getFlightNumber();
        launch = Object.assign(launch, {
            flightNumber: flightNumber,
            upcoming: true,
            success: true,
            customers: ['Zero To Mastery', 'NASA']
        })
        return await launches.create(launch);
    }
}

async function abortLaunch(id) {

    const res = await launches.updateOne(
        {
            flightNumber: id
        },
        {
            upcoming: false
        }
    )

    if (res.acknowledged === true &&
        res.modifiedCount === 1) {
        return res;
    }
}

module.exports = {
    getLaunches,
    createNewLaunch,
    launchIdExists,
    abortLaunch
}