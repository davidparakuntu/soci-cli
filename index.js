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
    fetch('templates/login.html').then(function(res) {
        res.text().then(function(text) {
            let template = hb.compile(text);
            document.getElementById('app-content').innerHTML = template();
        }).then(function() {
            ec('register-button')[0].addEventListener('click', function() {
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
                    myapp.render('templates/home.html', {}, ei('app-content'))
                }).catch(function() {
                    console.log('Issues');
                });
            });

            ec('login-button')[0].addEventListener('click', function() {
                //let obj = {"contact":{"mobileNumber":[1213213,343434],"emailIDs":["xx@yy.com"]},"name":{"firstName":"Dvd","lastName":"Mat","fullName":"Dvd Mat","displayName":"Hello Sir"}};
                let id = en('login-user-name')[0].value;
                fetch('http://localhost:7080/user/' + id).then(function(response) {
                    response.json().then(function(json) {
                        window.myapp = app.init(json);
                        myapp.render('templates/home.html', {}, ei('app-content'));
                    });
                }).catch(function(){
                    console.log("Fetching user failed");
                });
            });
        });
    });
}, false);
