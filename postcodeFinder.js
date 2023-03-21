//note readline below needs to be installed with npm on the command line before importing
import readline from 'readline-sync';

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
        const coords = [latitude, longitude];
        console.log(`${postCodeJSON.result.region}`)
        if (postCodeJSON.result.region == "London") {
            return coords;
        }
        else {
            console.log("Busboard only works for the London region. Please enter a London postcode")
            return null;
        }
    }
    catch {
        console.log("The API returned no results. Is this a valid postcode?");
    }
}

