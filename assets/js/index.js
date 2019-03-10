window.location.hash = "";
for(var button of document.getElementsByClassName("link")) {
  button.addEventListener("click", e => (window.location.hash = e.srcElement.dataset.href));
}