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
    var trackFill = range.lastElementChild;
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
    range.addEventListener('touchstart',function(e){
      outerThumb.style.backgroundColor="rgba(185, 18, 18, .5)";
    })
    range.addEventListener('touchmove',function(e){
      var touch = e.touches[0];
      var pageX = touch.pageX;
      var outerX = parseInt(getComputedStyle(outerThumb).left,10);
      var thumpX = pageX - outerX -8;
      outerThumb.style.left=outerX+thumpX-16;
      trackFill.style.width=outerX + 9;
    })
    range.addEventListener('touchend',function(e){
      outerThumb.style.backgroundColor="transparent";
    })
    
  }

}
