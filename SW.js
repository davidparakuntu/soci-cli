self.config = {};
var initDB = function(name, osName, keypath){
    var request = indexedDB.open(name,1);
    console.log(name+" is created with version 1");
    var db;
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
  console.log(self.config);
});
self.addEventListener('activate', function(event) {
    event.waitUntil(function() {
        caches.open("dd1").then(function(cache) {
            console.log('installing cache');
            return cache.addAll(['images/gate-large.png', 'images/gate-medium.png', 'images/gate-small.png', 'images/gate.png', 'images/register-large.png', 'images/register-medium.png', 'images/register-small.png', 'images/register-small.png', 'images/register.png', 'templates/home.html', 'templates/login.html', 'templates/register.html', 'templates/test.hbs', 'index.html', 'main.js', 'myweb.css']).then(function() {
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
