import './postcodeFinder.js';
import { postcodeToCoords } from './postcodeFinder.js';
//note below import needs to be installed with npm first
import readline from 'readline-sync';


async function nextBuses() {

    console.log("enter your postcode:");
    let postcode = readline.prompt();

    const coords = await postcodeToCoords(postcode);
    console.log(typeof (coords[0]), coords[0])

    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${coords[0]}&lon=${coords[1]}&stopTypes=NaptanPublicBusCoachTram`);
    const busBoard = await response.json();
    const stoppingPoints = busBoard.stopPoints.sort((stopA, stopB) => stopA.distance - stopB.distance);

    const busesServingStopResponse = await fetch('https://api.tfl.gov.uk/StopPoint/490008660S/Arrivals')
    const busesServingStopJSON = await busesServingStopResponse.json();
    console.log(busesServingStopJSON)

    //console.log(stoppingPoints.map(points => console.log(`Bus stop' ${points.commonName} is ${points.distance}m away`)));

    const closestStop = stoppingPoints[0];
    const secondClosestStop = stoppingPoints[1];

    console.log(`the closest stop is ${closestStop.commonName} which is ${Math.trunc(closestStop.distance)}m away`);
    console.log(`the second closest stop is ${closestStop.commonName} which is ${Math.trunc(secondClosestStop.distance)}m away`);

    //console.log(closestStop)

    const busInfo = busesServingStopJSON.map(bus => [bus.lineId, bus.towards, Math.round(bus.timeToStation / 60)])


    console.log(`Closest bus stop is ${closestStop.commonName}.\nThe next buses are:`)
    console.log(`The 1st bus ${busInfo[0][0]} with direction ${busInfo[0][1]} will arrive in ${busInfo[0][2]} minutes`)
    console.log(`The 1st bus ${busInfo[1][0]} with direction ${busInfo[1][1]} will arrive in ${busInfo[1][2]} minutes`)
    console.log(`The 1st bus ${busInfo[2][0]} with direction ${busInfo[2][1]} will arrive in ${busInfo[2][2]} minutes`)
}

nextBuses('sw12 8jn');



//All steps for busboard
/* 0. Prompt the user to provide a postcode (optional)  JAMES 
 1. Turn a postcode we receive into latitude and longitude - need a separate API call to a different site PATRICIA
2. Use that lat and long to make an API call to TFL for all nearby bus stops DONE 
3. Use the received data to find distances of all bus stops DONE
4. Order by distance 
5. Show the first two */