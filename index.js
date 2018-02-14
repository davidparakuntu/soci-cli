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

window.app = require('./app.js');
window.addEventListener('load', function(event) {
    console.log(event);
    fetch('templates/login.hbs').then(function(res) {
        res.text().then(function(text) {
            let template = hb.compile(text);
            document.getElementById('app-content').innerHTML = template();
        }).then(function() {
            document.getElementsByClassName('register-button')[0].addEventListener('click', function() {
                //let obj = {"contact":{"mobileNumber":[1213213,343434],"emailIDs":["xx@yy.com"]},"name":{"firstName":"Dvd","lastName":"Mat","fullName":"Dvd Mat","displayName":"Hello Sir"}};
                let user = {};
                user.id = en('email-id')[0].value;
                user.contact = {};
                user.name = {};
                user.name.firstName = en('first-name')[0].value;
                user.name.lastName = en('last-name')[0].value;
                user.name.displayName = user.name.firstName + ' ' + user.name.lastName;
                user.name.fullName = user.name.displayName;
                user.contact.mobileNumber = [en('mobile-number')[0].value];
                user.contact.emailIDs = [user.id];
                fetch('http://localhost:7080/user', {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }).then(function() {
                    console.log('Posted the user');
                    window.myapp = app.init(user);
                    myapp.render('templates/home.hbs',{},ei('app-content'))
                }).catch(function() {
                    console.log('Issues');
                });
            })
        });
    });
}, false);
