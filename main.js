import { postcodeToCoords } from './postcodeFinder.js';
//note readline below needs to be installed with npm on the command line before importing
import readline from 'readline-sync';


async function nextBuses() {

    console.log("Please enter your postcode:");
    let postcode = readline.prompt();

    const coords = await postcodeToCoords(postcode);
    //console.log(typeof (coords[0]), coords[0])

    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${coords[0]}&lon=${coords[1]}&stopTypes=NaptanPublicBusCoachTram`);
    const busBoard = await response.json();
    const stoppingPoints = busBoard.stopPoints.sort((stopA, stopB) => stopA.distance - stopB.distance);

    //console.log(stoppingPoints.map(points => console.log(`Bus stop' ${points.commonName} is ${points.distance}m away`)));

    const closestStop = stoppingPoints[0];
    const secondClosestStop = stoppingPoints[1];

    const busesServingStopResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/${closestStop.naptanId}/Arrivals`)
    const busesServingStopJSON = await busesServingStopResponse.json();

    //console.log(`the closest stop is ${closestStop.commonName}, stop letter ${closestStop.stopLetter}, which is ${Math.trunc(closestStop.distance)}m away`);
    //console.log(`the second closest stop is ${closestStop.commonName} which is ${Math.trunc(secondClosestStop.distance)}m away`);

    //sort() must come before map() here as once map has outputted an array, the bus.timeToStation object key doesn't exist anymroe
    const busInfo = busesServingStopJSON
        .sort((busA, busB) => busA.timeToStation - busB.timeToStation)
        .map(bus => [bus.lineId, bus.towards, Math.round(bus.timeToStation / 60)]);

    const busesToDisplay = busInfo.length <= 5 ? busInfo.length : 5;

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
            console.log(`The ${i + 1}${ordinalSuffix} bus will be the ${busInfo[i][0]} towards ${busInfo[i][1]} which will arrive in ${busInfo[i][2]} minutes`)
        };
    }

    // console.log(`Your closest bus stop is ${closestStop.commonName}, stop letter ${closestStop.stopLetter}, which is ${Math.trunc(closestStop.distance)}m away.\nThe next buses are:`)
    // console.log(`The 1st bus ${busInfo[0][0]} with direction ${busInfo[0][1]} will arrive in ${busInfo[0][2]} minutes`)
    // console.log(`The 2nd bus ${busInfo[1][0]} with direction ${busInfo[1][1]} will arrive in ${busInfo[1][2]} minutes`)
    // console.log(`The 3rd bus ${busInfo[2][0]} with direction ${busInfo[2][1]} will arrive in ${busInfo[2][2]} minutes`)
}

nextBuses();



//All steps for busboard
/* 0. Prompt the user to provide a postcode (optional)  JAMES 
 1. Turn a postcode we receive into latitude and longitude - need a separate API call to a different site PATRICIA
2. Use that lat and long to make an API call to TFL for all nearby bus stops DONE 
3. Use the received data to find distances of all bus stops DONE
4. Order by distance 
5. Show the first two */