module.exports = function(){
  window.ec = function(className) {
      return document.getElementsByClassName(className);
  }
  window.en = function(name) {
      return document.getElementsByName(name);
  }
  window.ei = function(id) {
      return document.getElementById(id);
  }


  window.activateRange = function(range){
    var track = range.firstElementChild;
    var outerThumb = track.firstElementChild;
    var thump = outerThumb.firstElementChild;

    range.addEventListener('mousedown',function(e){
      var pageX = e.pageX;
      var outerX = parseInt(getComputedStyle(outerThumb).left,10);
      var thumpX = pageX - outerX -8;
      //thump.style.left=thumpX;
      outerThumb.style.left=outerX+thumpX-16;
      console.log('click enabled')
    });
    range.addEventListener('mouseup',function(e){
      //thump.style.left=e.offsetX;
    });
    range.addEventListener('oncontextmenu',function(e){
      e.preventDefault();
    })
    
  }

}
