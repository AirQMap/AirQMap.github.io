(() => {
    let form = document.getElementById("LoginForm");
    form.onsubmit = eval("return false");
    form.addEventListener("submit", e => {
        e.preventDefault();
        return false;
    });
})();