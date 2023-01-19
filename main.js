// optional extras: [&radius][&useStopPointHierarchy][&modes][&categories][&returnLines]

const response = await fetch('https://api.tfl.gov.uk/StopPoint/?lat=51.553935&lon=-0.144754&stopTypes=NaptanPublicBusCoachTram');
const busBoard = await response.json();
const stoppingPoints = busBoard.stopPoints.sort((stopA, stopB) => stopA.distance - stopB.distance);

//console.log(stoppingPoints.map(points => console.log(`Bus stop' ${points.commonName} is ${points.distance}m away`)));

const closestStop = stoppingPoints[0];
const secondClosestStop = stoppingPoints[1];

console.log(`the closest stop is ${closestStop.commonName} which is ${Math.trunc(closestStop.distance)}m away`);
console.log(`the second closest stop is ${closestStop.commonName} which is ${Math.trunc(secondClosestStop.distance)}m away`);

//All steps for busboard
/* 0. Prompt the user to provide a postcode (optional)  JAMES 
 1. Turn a postcode we receive into latitude and longitude - need a separate API call to a different site PATRICIA
2. Use that lat and long to make an API call to TFL for all nearby bus stops DONE 
3. Use the received data to find distances of all bus stops DONE
4. Order by distance 
5. Show the first two */
