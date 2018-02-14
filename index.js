var hb = require('handlebars');
window.addEventListener('load',function(event){
  console.log(event);
  fetch('templates/login.hbs').then(function(res){
    res.text().then(function(text){
      let template = hb.compile(text);
      document.getElementById('app-content').innerHTML=template();
    }).then(function(){
      document.getElementsByClassName('register-button')[0].addEventListener('click',function(){
        alert('clicked');
        let obj = {"contact":{"mobileNumber":[1213213,343434],"emailIDs":["xx@yy.com"]},"name":{"firstName":"Dvd","lastName":"Mat","fullName":"Dvd Mat","displayName":"Hello Sir"}};
        fetch('http://localhost:7080/user',{method:"POST",body:JSON.stringify(obj),headers:new Headers({'Content-Type': 'application/json'})}).then(function(){console.log('Done');}).catch(function(){console.log('Issues');});
      })
    });
  });
},false);
