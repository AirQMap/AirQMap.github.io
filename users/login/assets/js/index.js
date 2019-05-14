(() => {
    let form = document.getElementById("LoginForm");
    let loader = document.getElementById("loader");
    let error = document.getElementById("error");
    if(localStorage.getItem("sessionID")) {
        localStorage.removeItem("sessionID");
    }
    form.addEventListener("submit", e => {
        loader.style.height = "0.25vmax";
        setTimeout(()=> {
            let formData = `uname=${form.uname.value}&password=${form.password.value}`;
            fetch('https://airqmap.divaldo.hu/login/', {
                method: 'POST',
                body: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => res.json())
            .then(res => {
                console.log(res.error);
                
                if (res.sessionID) {
                    localStorage.setItem("sessionID", res.sessionID);
                    window.location = "../profile/";
                } else {
                    loader.style.height = "0";
                    error.innerHTML = res.error;
                }
            }).catch(err => {
                loader.style.height = "0";
                console.log(err);
                
                error.innerText = "Couldn't connect to login service...🙄";
            });
        }, 1000);
    });
})();