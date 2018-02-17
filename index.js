var hb = require('handlebars');
window.ec = function(className) {
    return document.getElementsByClassName(className);
}
window.en = function(name) {
    return document.getElementsByName(name);
}
window.ei = function(id) {
    return document.getElementById(id);
}

window.App = require('./app.js');
window.addEventListener('load', function(event) {
    window.app=App.init({});
    app.renderLogin();
}, false);
