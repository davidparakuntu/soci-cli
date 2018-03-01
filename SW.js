self.config = {};
var initDB = function(name, osName, keypath){
    var request = indexedDB.open(name,1);
    console.log(name+" is created with version 1");
    var db;
    request.onsuccess=function(event){
        self.config.db=event.target.result;
    }
    request.onupgradeneeded=function(event){
        db = event.target.result;
        var ds = db.createObjectStore(osName,{KeyPath:keypath});
        console.log(osName+" Created");
        self.config.db=db;
        self.config.ds=ds;
    }
    return db;
}

self.addEventListener('message',function(event){
  switch (event.data.message){
      case 'insertUser':
            self.insertUser(event.data.user,event.data.user.id);
            break;
      case 'login':
            console.log(event.data);
            var trObjectStore = self.config.db.transaction("users","readwrite").objectStore("users");
            var userRequest = trObjectStore.get(event.data.user.id);
            userRequest.onsuccess = function(evt){
                self.postToClient(event.source,evt.result);
            }
            break;
      default:
            console.log('Action is not defined for '+event.data.message);
        }
 });

self.postToClient = function(client,message){
    client.postMessage(message);
}
self.insertUser = function(user,key){
    console.log(self);
    console.log(self.config);
    console.log("Inserting "+user);
    var trObjectStore = self.config.db.transaction("users","readwrite").objectStore("users");
    trObjectStore.add(user,key);
}
self.addEventListener('activate', function(event) {
    event.waitUntil(function() {
        caches.open("dd1").then(function(cache) {
            console.log('installing cache');
            return cache.addAll(['images/gate-large.png', 'images/gate-medium.png', 'images/gate-small.png', 'images/gate.png', 'images/register-large.png', 'images/register-medium.png', 'images/register-small.png', 'images/register-small.png', 'images/register.png', 'templates/home.html', 'templates/login.html', 'templates/register.html', 'templates/test.hbs', 'index.html', 'main.js', 'myweb.css','/']).then(function() {
                console.log('Successfully cached..')
            }).catch(function() {
                console.log('Cache failed');
            });
        }).catch(function(err) {
            console.log("Unable to install cache..");
            console.log(err);
        });
        initDB("mydb",'users',"id");
    }());
});
self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
            if(response){
              return response.clone();
            }else{
              return fetch(event.request);
            }
        }).catch(function(){
          console.log('No match')
          return fetch(event.request);
        }));
});
