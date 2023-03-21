import { postcodeToCoords } from './postcodeFinder.js';
import { getBusesApiCall } from './getBuses.js';

async function nextBuses() {

    const coords = await postcodeToCoords();
    if (coords) {
        //first bus stop
        getBusesApiCall(coords, 0);
        //second bus stop
        getBusesApiCall(coords, 1);
    }
}
nextBuses();



