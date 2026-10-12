const API_URL = 'http://localhost:8000/v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  const res = await fetch(`${API_URL}/planets`);
  return res.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`);
  const launches = await res.json();
  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    const res = await fetch(`${API_URL}/launches`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(launch)
      }
    );
    return res;
  } catch (err) {
    const res = {
      ok: false
    };
    return res;
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    const res = await fetch(`${API_URL}/launches/${id}`,
      { method: "delete" }
    );
    return res;
  } catch (err) {
    const res = {
      ok: false
    };
    return res;
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};