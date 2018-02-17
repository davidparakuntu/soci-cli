exports.init = function(user) {
    var instance = {
        "user": user
    };
    instance.hb = require('handlebars');
    instance.log = function(message) {
        console.log(message);
    }
    instance.render = function(templateURL, object, targetNode) {
        fetch(templateURL).then(function(response) {
            response.text().then(function(text) {
                targetNode.innerHTML = instance.hb.compile(text)(object);
            }).then(function() {
                instance.menubar = ec('menu-bar')[0];
                instance.navbar = ec('navigation-bar')[0];
                instance.toolbar = ec('tool-area')[0];
                instance.contextArea = ec('context-area')[0];
                instance.navIconArea = ec('nav-icon-area')[0];
                instance.openMenu = ec('open-menu')[0];
                instance.openTool = ec('open-tool')[0];
                instance.openNav = ec('open-nav')[0];
                instance.initialize();
            }).catch(function() {
                console.log('Unable to read template');
            })
        }).catch(function() {
            console.log("fetch " + templateURL + " failed")
        })
    }
    instance.renderRegister = function(templateURL, object, targetNode) {
        fetch(templateURL).then(function(response) {
            response.text().then(function(text) {
                targetNode.innerHTML = instance.hb.compile(text)(object);
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
                    let password = en('password-one')[0].value;
                    if (password === en('password-two')[0].value) {
                        user.password = password;
                        fetch('http://localhost:7080/user', {
                            method: "POST",
                            body: JSON.stringify(user),
                            headers: new Headers({
                                'Content-Type': 'application/json'
                            })
                        }).then(function() {
                            console.log('Posted the user');
                            app.renderLogin();
                        }).catch(function() {
                            console.log('Issues');
                        });
                    } else {
                        console.log('password did not match')
                    }
                });
            }).catch(function() {
                console.log('Unable to read template');
            })
        }).catch(function() {
            console.log("fetch " + templateURL + " failed")
        })

    }
    instance.renderLogin = function() {
        fetch('templates/login.html').then(function(res) {
            res.text().then(function(text) {
                let template = instance.hb.compile(text);
                document.getElementById('app-content').innerHTML = template();
            }).then(function() {
                ec('login-button')[0].addEventListener('click', function() {
                    //let obj = {"contact":{"mobileNumber":[1213213,343434],"emailIDs":["xx@yy.com"]},"name":{"firstName":"Dvd","lastName":"Mat","fullName":"Dvd Mat","displayName":"Hello Sir"}};
                    let user = {};
                    user.id = en('login-user-name')[0].value;
                    user.password = en('login-user-password')[0].value

                    fetch('http://localhost:7080/user/login', {
                        method: "POST",
                        body: JSON.stringify(user),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).then(function(response) {
                        if (response.status != 200) {
                            alert(response.statusText);
                        } else {
                            response.json().then(function(json) {
                                app.user = json;
                                app.render('templates/home.html', json, ei('app-content'));
                            });
                        }

                    }).catch(function() {
                        console.log("Fetching user failed");
                    });
                });

                ec('reg-link')[0].addEventListener('click', function() {
                    window.app.renderRegister('templates/register.html', {}, ei('app-content'));

                });
            });
        });
    }
    instance.initialize = function() {
        instance.openMenu.addEventListener('click', instance.openMenuBar);
        instance.menubar.addEventListener('click', instance.closeMenuBar);
        instance.openNav.addEventListener('click', instance.openNavBar);
        instance.navbar.addEventListener('click', instance.closeNavBar);

        instance.openTool.addEventListener('click', instance.openToolBar);
        instance.toolbar.addEventListener('click', instance.closeToolBar);
    }
    instance.openMenuBar = function() {
        instance.menubar.classList.add('menu-bar-open');
        instance.contextArea.classList.add('context-area-menu-open');
        instance.navIconArea.classList.add('nav-icon-area-open-menu');
    }
    instance.closeMenuBar = function() {
        instance.menubar.classList.remove('menu-bar-open');
        instance.contextArea.classList.remove('context-area-menu-open');
        instance.navIconArea.classList.remove('nav-icon-area-open-menu');
    }

    instance.openNavBar = function() {
        instance.navbar.classList.add('navigation-bar-open');
        instance.contextArea.classList.add('context-area-menu-open');
        instance.navIconArea.classList.add('nav-icon-area-open-nav');
    }
    instance.closeNavBar = function() {
        instance.navbar.classList.remove('navigation-bar-open');
        instance.contextArea.classList.remove('context-area-menu-open');
        instance.navIconArea.classList.remove('nav-icon-area-open-nav');
    }

    instance.openToolBar = function() {
        instance.toolbar.classList.add('tool-area-open');
        instance.contextArea.classList.add('context-area-menu-open');
        instance.navIconArea.classList.add('nav-icon-area-open-nav');
    }
    instance.closeToolBar = function() {
        instance.toolbar.classList.remove('tool-area-open');
        instance.contextArea.classList.remove('context-area-menu-open');
        instance.navIconArea.classList.remove('nav-icon-area-open-nav');
    }
    return instance;
}
