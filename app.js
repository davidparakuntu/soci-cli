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
                instance.navbar=ec('navigation-bar')[0];
                instance.toolbar=ec('tool-area')[0];
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
    instance.initialize = function() {
        instance.openMenu.addEventListener('click',instance.openMenuBar);
        instance.menubar.addEventListener('click',instance.closeMenuBar);
        instance.openNav.addEventListener('click',instance.openNavBar);
        instance.navbar.addEventListener('click',instance.closeNavBar);

        instance.openTool.addEventListener('click',instance.openToolBar);
        instance.toolbar.addEventListener('click',instance.closeToolBar);
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
