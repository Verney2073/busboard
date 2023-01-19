

export async function postcodeToCoords(postcode) {
    const postCodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const postCodeJSON = await postCodeResponse.json();
    const latitude = postCodeJSON.result.latitude;
    const longitude = postCodeJSON.result.longitude;
    const coords = [latitude, longitude]
    return coords
}

postcodeToCoords('sw12 8jn');