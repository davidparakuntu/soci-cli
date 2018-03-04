module.exports = function() {
    window.ec = function(className) {
        return document.getElementsByClassName(className);
    }
    window.en = function(name) {
        return document.getElementsByName(name);
    }
    window.ei = function(id) {
        return document.getElementById(id);
    }

    window.activateRange = function(range) {
        var inst = {};
        inst.track = range.firstElementChild;
        inst.outerThumb = inst.track.firstElementChild;
        inst.thump = inst.outerThumb.firstElementChild;
        inst.trackFill = range.lastElementChild;
        inst.dragFlag = false;
        range.addEventListener('click', function(e) {
            inst.outerThumb.style.backgroundColor = "rgba(185, 18, 18, .5)";
            inst.addAnimation();

            var pageX = e.layerX;

            inst.outerThumb.style.left = pageX-16;
            inst.trackFill.style.width = pageX;
            inst.outerThumb.style.backgroundColor = "transparent";

        });

        range.addEventListener('mouseup', function(e) {
            inst.outerThumb.style.backgroundColor = "transparent";
            inst.dragFlag = false;
        });
        range.addEventListener('mousedown', function(e) {
            inst.outerThumb.style.backgroundColor = "rgba(185, 18, 18, .5)";
            inst.dragFlag = true;
        });
        range.addEventListener('mousemove', function(e) {
            inst.removeAnimation();
            if (inst.dragFlag) {
                var pageX = e.layerX;
                inst.outerThumb.style.left = pageX - 16;
                inst.trackFill.style.width = pageX;
            }

        });
        range.addEventListener('oncontextmenu', function(e) {
            e.preventDefault();
        });
        range.addEventListener('touchstart', function(e) {
            inst.outerThumb.style.backgroundColor = "rgba(185, 18, 18, .5)";
        });
        range.addEventListener('touchmove', function(e) {
            inst.removeAnimation();
            var touch = e.touches[0];
            var pageX = touch.pageX - touch.target.getBoundingClientRect().x;
            inst.outerThumb.style.left = pageX - 16;
            inst.trackFill.style.width = pageX;
        });
        range.addEventListener('touchend', function(e) {
            inst.outerThumb.style.backgroundColor = "transparent";
        });

        inst.removeAnimation = function(){
            if (inst.trackFill.classList.contains('track-fill-anim')) {
                inst.trackFill.classList.remove('track-fill-anim');
            }
            if (inst.outerThumb.classList.contains('thumb-anim')) {
                inst.outerThumb.classList.remove('thumb-anim');
            }
        }
        inst.addAnimation = function(){
            if (!inst.trackFill.classList.contains('track-fill-anim')) {
                inst.trackFill.classList.add('track-fill-anim');
            }
            if (!inst.outerThumb.classList.contains('thumb-anim')) {
                inst.outerThumb.classList.add('thumb-anim');
            }
        }

    }
}
