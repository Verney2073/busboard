//note readline below needs to be installed with npm on the command line before importing
import readline from 'readline-sync';

// OPTION 1 - Create a function to package up checking the formatting of the postcode 
//function postCodeFormatter (postcode) {}

// OPTION 2 - Create a do/while loop and handle the console log being different the first time the user inputs;


export async function postcodeToCoords() {
    let postcodeCheck = false;
    let postcodeNoWS;


    console.log("Please enter your postcode:");
    do {
        let postcode = readline.prompt();
        postcodeNoWS = postcode.replace(/\s/g, "");
        postcodeCheck = /^[a-z0-9]{5,7}$/i.test(postcodeNoWS);
        if (!postcodeCheck) console.log("You entered an invalid postcode! Please try again or type 'exit' to exit");
    } while (!postcodeCheck);

    try {
        const postCodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcodeNoWS}`);
        const postCodeJSON = await postCodeResponse.json();
        const latitude = postCodeJSON.result.latitude;
        const longitude = postCodeJSON.result.longitude;
        const coords = [latitude, longitude]
        return coords;
    }
    catch {
        console.log("The API returned no results. Is this a valid postcode?");
    }
}

