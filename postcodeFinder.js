//note readline below needs to be installed with npm on the command line before importing
import readline from 'readline-sync';


export async function postcodeToCoords() {

    console.log("Please enter your postcode:");
    let postcode = readline.prompt();

    try {
        const postCodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const postCodeJSON = await postCodeResponse.json();
        const latitude = postCodeJSON.result.latitude;
        const longitude = postCodeJSON.result.longitude;
        const coords = [latitude, longitude]
        return coords;
    }
    catch {
        console.log("It looks like you didn't enter a valid postcode!");
    }
};

