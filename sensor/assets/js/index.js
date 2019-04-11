let GET = new Map();
{
    let kv;
    try {
        kv = window.location.href.split('?')[1].split('&');
    } catch (e) {console.log("Invalid URL")};
    for(let elem of kv) {
        let a = elem.split('=');
        GET.set(a[0], a[1]);
    }
}

loadMap = async () => {
    let sensorDetails, sensorData;
    let proxyUrl = "https://cors-anywhere.herokuapp.com/";

    await fetch(proxyUrl + `https://airqmap.divaldo.hu/sqlGetSensor.php?sensor=${GET.get("sensor")}`)
    .then(res=>res.json())
    .then(res=>sensorDetails = res[0])
    .catch(err=> {throw new Error("The Server Can't be reached.")});

    // Map
    new Microsoft.Maps.Map("#map", {
        credentials: "ArSyAqCFpDbMrF8monFxY9PomZbiBHLhUJ3sFFZeNBLI_b8Rr3J0TUDHSAjkc3AG",
        center: new Microsoft.Maps.Location(sensorDetails.Lat, sensorDetails.Lon),
        zoom: 15,
        enableClickableLogo: false,
        disablePanning: true,
        disableZooming: true,
        supportedMapTypes: [ Microsoft.Maps.MapTypeId.canvasDark, Microsoft.Maps.MapTypeId.grayscale ],
        mapTypeId: Microsoft.Maps.MapTypeId.aerial
    });

    // Table Data
    if (sensorDetails.picture) {
        document.getElementById("picture--frame").style.backgroundImage= `url(${sensorDetails.picture})`;
    }
    document.getElementById("sensor--name").innerText = sensorDetails.DeviceID;
    document.getElementById("sensor--build").innerText = sensorDetails.Sensors;
    document.getElementById("sensor--location").innerHTML = `Lat: ${sensorDetails.Lat}<br>Long: ${sensorDetails.Lon}`;
    document.getElementById("sensor--maintenance").innerText = sensorDetails.Maintenance;
    delete sensorDetails;
    await fetch(proxyUrl + `https://airqmap.divaldo.hu/sqlGetSensor.php?sensorData=${GET.get("sensor")}`)
    .then(res=>res.json())
    .then(res=>sensorData = res)
    .catch(err=> {throw new Error("The Server Can't be reached.")});
    document.getElementById("sensor--collected").innerText = sensorData.length;

    // Chart
    new Chart(document.getElementById("chart").getContext("2d"), {
        type: 'line',
        data: {
            labels: sensorData.map(x=>x.timestamp),
            datasets: [{
                label: 'Grams of particulate matter < 10μm in one m³ of air',
                data: sensorData.map(x=>Number(x.part_matter)),
                backgroundColor: [
                    'rgba(215, 187, 103, .2)'
                ],
                borderColor: [
                    'rgba(215, 187, 103, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            animation: { duration: 1 }, // general animation time
            hover: { animationDuration: 0 },
            responsiveAnimationDuration: 0, // animation duration after a resize
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                },
                point: {
                    pointStyle: 'triangle',
                    radius: 0
                }
            }
        }
    });
    //TODO: NOSCRIPT + LOADER
};
