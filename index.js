window.hb = require('handlebars');
window.Router = require('./Router.js');
require('./dui.js')();
window.App = require('./app.js');
window.addEventListener('load', function(event) {
    window.app = App.init({});
    app.renderLogin();
}, false);
