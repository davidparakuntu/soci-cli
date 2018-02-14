exports.init = function(user){
    var instance = {"user":user};
    instance.hb = require('handlebars');
    instance.log = function(message){
        console.log(message);
    }
    instance.render=function(templateURL, object, targetNode){
        fetch(templateURL).then(function(response){
            response.text().then(function(text){
                targetNode.innerHTML = instance.hb.compile(text)(object);
            }).catch(function(){
                console.log('Unable to read template');
            })
        }).catch(function(){
            console.log("fetch "+templateURL+" failed")
        })
    }

    return instance;
}