exports.init = function(user) {
    navigator.serviceWorker.register('SW.js').then(function(reg) {
        window.srg = reg;
    });
    var instance = {
        "user": user
    };
    instance.hb = window.hb;
    instance.hb.registerHelper('eq', function(arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    });

    instance.hb.registerHelper('neq', function(arg1, arg2, options) {
        return arg1 != arg2 ? options.fn(this) : options.inverse(this);
    });
    instance.hb.registerHelper('ttype', function(arg1, options) {
        if (arg1 == 'text' || arg1 == 'email' || arg1 == 'tel' || arg1 == 'number' || arg1 == 'password') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    instance.log = function(message) {
        console.log(message);
    }
    instance.hb.register
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

    instance.showForm = function(object, actionclassMap, targetNode) {
        var templateURL = "templates/form.html";
        fetch(templateURL).then(function(response) {
            response.text().then(function(text) {
                targetNode.innerHTML = instance.hb.compile(text)(object);
                var rangeList = ec('range');
                if (rangeList && rangeList.length > 0) {
                    for (var i = 0; i < rangeList.length; i++) {
                        activateRange(rangeList[i]);
                    }
                }

                activateCalendar(ec('calendar-trigger'));
                console.log('reading template success');
            }).then(function(msg) {
                var inputs = et('input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].addEventListener('blur', function(event) {
                        if (event.target.value != '') {
                            event.target.parentElement.children[3].classList.add('filled-label');
                            if (!event.target.checkValidity()) {
                                event.target.classList.add('text-input-invalid');
                                event.target.parentElement.children[3].classList.add('input-invalid');
                                event.target.parentElement.children[1].classList.add('input-invalid');
                                event.target.parentElement.children[3].classList.add('red');
                                event.target.parentElement.children[1].style.display = "block";
                                setTimeout(function() {
                                    event.target.parentElement.children[3].classList.remove('input-invalid');
                                }, 500);
                            }
                        } else {
                            event.target.parentElement.children[3].classList.remove('filled-label');
                        }
                    });
                    inputs[i].addEventListener('focus', function(event) {
                        event.target.parentElement.children[3].classList.remove('red');
                        event.target.classList.remove('text-input-invalid');
                        event.target.parentElement.children[1].classList.remove('input-invalid');
                    });
                }

                actionclassMap.forEach(function(actionClass) {
                    ec(actionClass.actionClass)[0].addEventListener('click', actionClass.action);
                });

            }).catch(function(msg) {
                console.log(msg)
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
                                srg.active.postMessage({
                                    "message": "insertUser",
                                    "user": json
                                });
                                app.render('templates/home.html', json, ei('app-content'));
                            });
                        }

                    }).catch(function() {
                        console.log("Fetching user failed");
                        navigator.serviceWorker.addEventListener('message', function(event) {
                            app.user = event.data;
                            if (app.user.id) {
                                app.render('templates/home.html', event.data, ei('app-content'));
                            } else {
                                console.log('Login failed..');
                            }

                        });
                        srg.active.postMessage({
                            "message": "login",
                            "user": user
                        });

                    });
                });

                ec('reg-link')[0].addEventListener('click', function() {
                    //window.app.renderRegister('templates/register.html', {}, ei('app-content'));
                    let user = {};
                    user.contact = {};
                    user.name = {};
                    var formObj = {
                        "user": user
                    };
                    formObj.fields = instance.page1Form;
                    var actionMap = [{
                        "actionClass": "submit-button",
                        "action": function(event) {
                            if (instance.fillUser(user)) {
                                instance.submitReg(user);
                            }
                        }
                    }, {
                        "actionClass": "reset-button",
                        "action": function(event) {
                            if (instance.fillUser(user)) {
                                formObj.fields = instance.page2Form;
                                instance.showForm(formObj, actionMap, ei('app-content'));
                            }
                        }
                    }];
                    instance.showForm(formObj, actionMap, ei('app-content'));

                });
            });
        });
        navigator.serviceWorker.getRegistration().then(function(registration) {
            window.sw = registration.active
        });
    }
    instance.fillUser = function(user) {
        user.id = en('emailId')[0].value;
        user.name.fullName = en('fullName')[0].value;
        user.name.displayName = user.name.firstName + ' ' + user.name.lastName;
        user.contact.mobileNumber = [en('mobileNumber')[0].value];
        user.contact.emailIDs = [user.id];
        user.password = en('password')[0].value;
        return user;
    }
    instance.page1Form = [{
        "type": "text",
        "name": "fullName",
        "label": "Full Name",
        "error": "Not valid Name",
        "pattern": "[A-Za-z\\s]*"
    }, {
        "type": "tel",
        "name": "mobileNumber",
        "label": "Mobile Number",
        "error": "Mobile number is not valid",
        "pattern": "[0-9]{10}"
    }, {
        "type": "date",
        "name": "dateOfBirth",
        "label": "Date of Birth",
        "error": "Invalid"
    }, {
        "type": "email",
        "name": "emailId",
        "label": "E-Mail ID",
        "error": "Not valid email",
        "pattern": "[a-z]*(@)[a-z]*(\.)[a-z]*"
    }, {
        "type": "password",
        "name": "password",
        "label": "Password",
        "error": "Not valid",
        "pattern": ".*"
    }, {
        "type": "action",
        "actionClass": "reset-button",
        "label": "Reset"
    }, {
        "type": "action",
        "actionClass": "submit-button",
        "label": "Register"
    }]

    instance.submitReg = function(user) {
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
