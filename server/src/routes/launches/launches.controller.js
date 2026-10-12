const { getLaunches, createNewLaunch, launchIdExists, abortLaunch } = require('../../models/launches.models');

async function httpGetLaunches(req, res) {
    return res.status(200).json(await getLaunches());
}

async function httpAddNewLaunch(req, res) {
    let launch = req.body;
    if (!launch.launchDate || !launch.target || !launch.mission || !launch.rocket) {
        return res.status(400).json(
            {
                error: "required property missing"
            }
        )
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json(
            {
                error: "invalid date"
            }
        )
    }
    
    const createdLaunch = await createNewLaunch(launch);
    if(!createdLaunch) {
        return res.status(400).json({ error: "couldn't create launch" });
    }
    
    return res.status(201).json({
        ok: 1,
        flightNumber: createdLaunch.flightNumber
    });
}

async function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);

    if (!launchIdExists(id)) {
        return res.status(404).json({ error: "cannot find launch" });
    }

    const abort = await abortLaunch(id);

    if (!abort) {
        return res.status(400).json({ error: "couldn't abort launch" });
    }
    return res.status(200).json({
        ok: 1,
        flightNumber: id
    });
}

module.exports = {
    httpGetLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}