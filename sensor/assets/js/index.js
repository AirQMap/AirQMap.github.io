<<<<<<< HEAD
let GET = new Map();
{
    let kv;
    try {
        kv = window.location.href.split('?')[1].split('&');
        for(let elem of kv) {
            let a = elem.split('=');
            GET.set(a[0], a[1]);
        }
    } catch (e) {};
}
let load;
if(GET.get("sensor")) {
    load = () => {
        document.getElementById("sensorProfile").style.setProperty("display", "block");
        // Sensor Details
        fetch(`
https://airqmap.divaldo.hu/odata/
?table=Devices
&columns=DeviceID;Sensors;Lat;Lon;Maintenance
&query=
filter=substr(${GET.get("sensor")},DeviceID)
`)
        .then(res => res.json())
        .then(res => {
            let sensorDetails = res[0];
            // Map
            if (sensorDetails.Lat && sensorDetails.Lon) {
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
            }
            // Table1 Data
            if (sensorDetails.picture) {
                document.getElementById("picture--frame").style.backgroundImage= `url(${sensorDetails.picture})`;
            } else {
                document.getElementById("picture--frame").title = "No picture available..."
            }
            document.getElementById("sensor--name").innerText = sensorDetails.DeviceID;
            document.getElementById("sensor--build").innerText = sensorDetails.Sensors;
            document.getElementById("sensor--location").innerHTML = `Lat: ${sensorDetails.Lat}<br>Long: ${sensorDetails.Lon}`;
            document.getElementById("sensor--maintenance").innerText = sensorDetails.Maintenance;    
        }).catch(err => {throw err});
        // Sensor Data
        let date = new Date(Date.now() - 172800000);
        let month = date.getMonth();
        if(10 > ++month) month = "0"+month.toString();
        fetch(`
https://airqmap.divaldo.hu/odata/
?table=AirQMap INNER JOIN Devices ON AirQMap.device_id=Devices.DeviceID
&columns=ROUND(AirQMap.part_matter*Devices.Multiplier) as value;timestamp
&query=
filter=substr(${GET.get("sensor")},DeviceID) AND timestamp gt '${date.getFullYear()}-${month}-${date.getDate()} 00:00:00'
`)
        .then(res => res.json())
        .then(sensorData => {
            // Table2 Data
            let last = sensorData[sensorData.length-1];
            document.getElementById("latest--collected").innerText = sensorData.length;
            document.getElementById("latest--PM").innerHTML = parseInt(last.value) + " μg/m<sup>3</sup>";
    
            // DECIMATION
            let newArr = new Array();
            for(let i = 0; i < sensorData.length; i+=10) newArr.push(sensorData[i]);
            sensorData = newArr;
            // Chart
            new Chart(document.getElementById("chart").getContext("2d"), {
                type: 'line',
                data: {
                    labels: sensorData.map(x=>x.timestamp),
                    datasets: [{
                        label: 'Grams of particulate matter < 10μm in one m³ of air',
                        data: sensorData.map(x=>parseInt(x.value)),
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
                    scales: {
                        yAxes: [
                            {
                                ticks: {beginAtZero:true,max:160}
                            }
                        ]
                    },
                    elements: {
                        line: {
                            tension: 0 // disables bezier curves
                        },
                        point: {
                            pointStyle: 'triangle',
                            radius: 1
                        }
                    }
                }
            });
        }).catch(err => {throw new Error("The Server Can't be reached.")});
        //TODO: NOSCRIPT + LOADER
    };
} else {
    load = () => {
        document.getElementById("sensorList").style.setProperty("display", "block");
        let search = document.getElementById("sensorSearch");
        let sensors = document.getElementById("sensors");
        let loadTable = e => {
            fetch(`
https://airqmap.divaldo.hu/odata/
?table=Devices
&columns=DeviceID;Sensors;Lat;Lon;Maintenance
&query=
filter=substr(${search.value},DeviceID)
`)
            .then(res=>res.json())
            .then(res=> {
                while(sensors.firstChild) sensors.removeChild(sensors.firstChild);
                let map = new Microsoft.Maps.Map("#map", {
                    credentials: "ArSyAqCFpDbMrF8monFxY9PomZbiBHLhUJ3sFFZeNBLI_b8Rr3J0TUDHSAjkc3AG",
                    //center: new Microsoft.Maps.Location(sensorDetails.Lat, sensorDetails.Lon),
                    zoom: 3,
                    enableClickableLogo: false,
                    mapTypeId: Microsoft.Maps.MapTypeId.aerial
                });
                res.forEach(elem => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><a href="?sensor=${elem.DeviceID}">${elem.DeviceID}</a></td>
                        <td>${elem.Lat}</td>
                        <td>${elem.Lon}</td>
                        <td>${elem.Sensors}</td>
                    `;
                    sensors.appendChild(tr);
                    if(elem.Lat && elem.Lon) {
                        let loc = new Microsoft.Maps.Location(elem.Lat, elem.Lon);
                        map.entities.push(new Microsoft.Maps.Pushpin(loc, {
                            title: elem.DeviceID
                        }));
                    }
                });
            });
        }
        loadTable();
        search.addEventListener("change", loadTable);
    }
}
setTimeout(()=>load(), 1000); // TODO: FIX THIS LINE SOMEHOW
=======
let GET = new Map();
{
    let kv;
    try {
        kv = window.location.href.split('?')[1].split('&');
        for(let elem of kv) {
            let a = elem.split('=');
            GET.set(a[0], a[1]);
        }
    } catch (e) {};
}
let load;
if(GET.get("sensor")) {
    load = () => {
        document.getElementById("sensorProfile").style.setProperty("display", "block");
        // Sensor Details
        fetch(`
https://airqmap.divaldo.hu/odata/
?table=Devices
&columns=DeviceID;Sensors;Lat;Lon;Maintenance;Image
&query=
filter=substr(${GET.get("sensor")},DeviceID)
`)
        .then(res => res.json())
        .then(res => {
            let sensorDetails = res[0];
            // Map
            if (sensorDetails.Lat && sensorDetails.Lon) {
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
            }
            // Table1 Data
            if (sensorDetails.Image) {
                document.getElementById("picture--frame").style.backgroundImage= `url(${sensorDetails.Image})`;
            } else {
                document.getElementById("picture--frame").title = "No picture available..."
            }
            document.getElementById("sensor--name").innerText = sensorDetails.DeviceID;
            document.getElementById("sensor--build").innerText = sensorDetails.Sensors;
            document.getElementById("sensor--location").innerHTML = `Lat: ${sensorDetails.Lat}<br>Long: ${sensorDetails.Lon}`;
            document.getElementById("sensor--maintenance").innerText = sensorDetails.Maintenance;    
        }).catch(err => {throw err});
        // Sensor Data
        let date = new Date(Date.now() - 172800000);
        let month = date.getMonth();
        if(10 > ++month) month = "0"+month.toString();
        fetch(`
https://airqmap.divaldo.hu/odata/
?table=AirQMap INNER JOIN Devices ON AirQMap.device_id=Devices.DeviceID
&columns=ROUND(AirQMap.part_matter*Devices.Multiplier) as value;timestamp
&query=
filter=substr(${GET.get("sensor")},DeviceID) AND timestamp gt '${date.getFullYear()}-${month}-${date.getDate()} 00:00:00'
`)
        .then(res => res.json())
        .then(sensorData => {
            // Table2 Data
            let last = sensorData[sensorData.length-1];
            document.getElementById("latest--collected").innerText = sensorData.length;
            document.getElementById("latest--PM").innerHTML = parseInt(last.value) + " μg/m<sup>3</sup>";
    
            // DECIMATION
            let newArr = new Array();
            for(let i = 0; i < sensorData.length; i+=10) newArr.push(sensorData[i]);
            sensorData = newArr;
            // Chart
            new Chart(document.getElementById("chart").getContext("2d"), {
                type: 'line',
                data: {
                    labels: sensorData.map(x=>x.timestamp),
                    datasets: [{
                        label: 'Grams of particulate matter < 10μm in one m³ of air',
                        data: sensorData.map(x=>parseInt(x.value)),
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
                    scales: {
                        yAxes: [
                            {
                                ticks: {beginAtZero:true,max:160}
                            }
                        ]
                    },
                    elements: {
                        line: {
                            tension: 0 // disables bezier curves
                        },
                        point: {
                            pointStyle: 'triangle',
                            radius: 1
                        }
                    }
                }
            });
        }).catch(err => {throw new Error("The Server Can't be reached.")});
        //TODO: NOSCRIPT + LOADER
    };
} else {
    load = () => {
        document.getElementById("sensorList").style.setProperty("display", "block");
        let search = document.getElementById("sensorSearch");
        let sensors = document.getElementById("sensors");
        let loadTable = e => {
            fetch(`
https://airqmap.divaldo.hu/odata/
?table=Devices
&columns=DeviceID;Sensors;Lat;Lon;Maintenance
&query=
filter=substr(${search.value},DeviceID)
`)
            .then(res=>res.json())
            .then(res=> {
                while(sensors.firstChild) sensors.removeChild(sensors.firstChild);
                let map = new Microsoft.Maps.Map("#map", {
                    credentials: "ArSyAqCFpDbMrF8monFxY9PomZbiBHLhUJ3sFFZeNBLI_b8Rr3J0TUDHSAjkc3AG",
                    //center: new Microsoft.Maps.Location(sensorDetails.Lat, sensorDetails.Lon),
                    zoom: 3,
                    enableClickableLogo: false,
                    mapTypeId: Microsoft.Maps.MapTypeId.aerial
                });
                res.forEach(elem => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><a href="?sensor=${elem.DeviceID}">${elem.DeviceID}</a></td>
                        <td>${elem.Lat}</td>
                        <td>${elem.Lon}</td>
                        <td>${elem.Sensors}</td>
                    `;
                    sensors.appendChild(tr);
                    if(elem.Lat && elem.Lon) {
                        let loc = new Microsoft.Maps.Location(elem.Lat, elem.Lon);
                        map.entities.push(new Microsoft.Maps.Pushpin(loc, {
                            title: elem.DeviceID
                        }));
                    }
                });
            });
        }
        loadTable();
        search.addEventListener("change", loadTable);
    }
}
setTimeout(()=>load(), 1000);
>>>>>>> 3bcbdd1e20e55ba1778265ff3677e25e71ae34dd
