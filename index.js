var hb = require('handlebars');
window.addEventListener('load',function(event){
  console.log(event);
  fetch('templates/login.hbs').then(function(res){
    res.text().then(function(text){
      let template = hb.compile(text);
      document.getElementById('app-content').innerHTML=template();
    });
  });
},false);
