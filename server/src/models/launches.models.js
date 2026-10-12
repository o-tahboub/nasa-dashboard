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

async function loadLaunchesData() {
    let response;
    try {
        response = await fetch('https://odziem.github.io/nasa-project/spacex-launches-query.json')
            .then(res => {
                if (res.status != 200) {
                    throw new Error('failed to fetch spacex data');
                }
                return res;
            })
            .then(r => r.json());
    } catch (error) {
        console.error(error);
    }

    if (!response.docs) {
        return;
    }

    for (let i = 0; i < response.docs.length; i++) {
        const spacexLaunch = response.docs[i];
        if (await getLaunch(spacexLaunch.flight_number)) {
            continue;
        }

        const launch = {
            "flightNumber": spacexLaunch.flight_number,
            "mission": spacexLaunch.name,
            "rocket": spacexLaunch.rocket.name,
            "launchDate": spacexLaunch.date_utc,
            "upcoming": spacexLaunch.upcoming,
            "success": spacexLaunch.success,
            "customers": spacexLaunch.payloads.flatMap(payload => payload.customers)
        }

        await upsertLaunch(launch);
    }
}

async function getLaunch(flightNumber) {
    return await launches.findOne(
        {
            flightNumber: flightNumber
        },
        { '_id': 0, '__v': 0 }
    );
}

async function getLaunches() {
    return await launches.find({}, { '_id': 0, '__v': 0 })
}

async function upsertLaunch(launch) {
    const upsert = await launches.updateOne(
        {
            flightNumber: launch.flightNumber
        },
        launch,
        {
            upsert: true
        }
    )

    if(upsert) {
        return launch;
    }
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
        return await upsertLaunch(launch);
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