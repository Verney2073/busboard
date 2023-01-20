import { postcodeToCoords } from './postcodeFinder.js';
//note readline below needs to be installed with npm on the command line before importing
import readline from 'readline-sync';

async function nextBuses() {

    const coords = await postcodeToCoords();

    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${coords[0]}&lon=${coords[1]}&stopTypes=NaptanPublicBusCoachTram`);
    const busBoard = await response.json();
    const stoppingPoints = busBoard.stopPoints.sort((stopA, stopB) => stopA.distance - stopB.distance);
    const closestStop = stoppingPoints[0];

    //const secondClosestStop = stoppingPoints[1];

    const busesServingStopResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/${closestStop.naptanId}/Arrivals`)
    const busesServingStopJSON = await busesServingStopResponse.json();

    //sort() must come before map() here as once map has outputted an array, the bus.timeToStation object key doesn't exist anymroe
    const busInfo = busesServingStopJSON
        .sort((busA, busB) => busA.timeToStation - busB.timeToStation)
        .map(bus => [bus.lineId, bus.towards, Math.round(bus.timeToStation / 60)]);

    const busesToDisplay = busInfo.length <= 5 ? busInfo.length : 5;
    console.log(`Your closest bus stop is ${closestStop.commonName}, stop letter ${closestStop.stopLetter}, which is ${Math.trunc(closestStop.distance)}m away.\nThe next buses are:`);

    if (busesToDisplay == 0 || busesToDisplay == undefined) {
        console.log("It seems there are no buses arriving right now;")
    } else {
        for (let i = 0; i < busesToDisplay; i++) {
            //setting the suffixes for counting, '1st', '2nd' etc
            let ordinalSuffix = 'th';
            switch (i) {
                case 0:
                    ordinalSuffix = 'st';
                    break;
                case 1:
                    ordinalSuffix = 'nd';
                    break;
                case 2:
                    ordinalSuffix = 'rd';
                    break;
                default:
                    ordinalSuffix = 'th'
            }
            //1st bus is at the 0th index, hence the +1 below
            console.log(`The ${i + 1}${ordinalSuffix} bus will be the ${busInfo[i][0]} towards ${busInfo[i][1]} which will arrive in ${busInfo[i][2]} minutes`)
        };
    }
}

nextBuses();



