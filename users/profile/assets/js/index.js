if(window.location.search.substr(0, 15) === "?user=vidaimi12") window.location = "./old/"
let sessionID = localStorage.getItem("sessionID");
if(!sessionID) window.location = "../login/";
else setTimeout(() => load(), 1000); // TODO: FIX THIS LINE SOMEHOW

let getColor = val => {
    if (val < 50) return "#00bd00";
    else if (val > 100) return "red";
    else return "orange";
}

let load = () => {
    let session = `sessionID=${sessionID}`;
    fetch("https://airqmap.divaldo.hu/userdata/", {
        method: 'POST',
        body: session,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .then(res => res.json())
    .then(user => {
        if (user.image) {
            document.getElementById("picture--frame").style.backgroundImage = `url(${user.image})`;
        } else {
            document.getElementById("picture--frame").title = "No picture available...";
        }
        document.getElementById("user--name").innerText = `${user.fname} ${user.lname}`;
    }).catch(err => { console.error(err); });
}

    /* fetch(`
https://airqmap.divaldo.hu/odata/
?table=UserData INNER JOIN Users ON Users.id=UserData.user_id
&columns=timestamp;part_matter
&query=filter=substr(${GET.get("user")},uname) ORDER BY timestamp
`)
        .then(res => res.json())
        .then(userData => {
            let sum = 0;
            let min = max = parseInt(userData[0].part_matter);

            userData.forEach(elem => {
                elem.part_matter = parseInt(elem.part_matter);
                sum += elem.part_matter;
                if (elem.part_matter < min) min = elem.part_matter;
                else if (elem.part_matter > max) max = elem.part_matter;
            });
            let avg = sum / userData.length;
            let latest = userData[userData.length - 1].part_matter;

            // These values are all averages
            const breathingRate = 15; // /min
            const tidalVolume = .0005; // m^3 of air / breath
            const harmRate = .85; // 85% of the breathed particles can cause harm

            let latestDOM = document.getElementById("user--latest");
            latestDOM.innerHTML = latest + " μg/m<sup>3</sup>";
            latestDOM.style.setProperty("color", getColor(latest));
            document.getElementById("user--avg").innerHTML = avg + " μg/m<sup>3</sup>";
            document.getElementById("user--high").innerHTML = max + " μg/m<sup>3</sup>";
            document.getElementById("user--low").innerHTML = min + " μg/m<sup>3</sup>";
            document.getElementById("user--accml").innerText = sum * breathingRate * tidalVolume * harmRate / 1000000 + " g";

            // Chart
            new Chart(document.getElementById("chart").getContext("2d"), {
                type: 'line',
                data: {
                    labels: userData.map(x => x.timestamp),
                    datasets: [{
                        label: 'Grams of particulate matter < 10μm in one m³ of air',
                        data: userData.map(x => x.part_matter),
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
                                ticks: { beginAtZero: true }
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
        })
        .catch(err => { console.error(err); });
}; */

