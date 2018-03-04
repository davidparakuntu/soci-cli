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
        var track = range.firstElementChild;
        var outerThumb = track.firstElementChild;
        var thump = outerThumb.firstElementChild;
        var trackFill = range.lastElementChild;
        var dragFlag = false;
        range.addEventListener('click', function(e) {
            outerThumb.style.backgroundColor = "rgba(185, 18, 18, .5)";
            if (!trackFill.classList.contains('track-fill-anim')) {
                trackFill.classList.add('track-fill-anim');
            }
            if (!outerThumb.classList.contains('thumb-anim')) {
                outerThumb.classList.add('thumb-anim');
            }

            var pageX = e.layerX;
            var outerX = parseInt(getComputedStyle(outerThumb).left, 10);
            var thumpX = pageX - outerX - 8;
            //thump.style.left=thumpX;
            var newWidth = outerX + thumpX - 8;
            outerThumb.style.left = newWidth;
            trackFill.style.width = newWidth + 9;
            outerThumb.style.backgroundColor = "transparent";

        });

        range.addEventListener('mouseup', function(e) {
            outerThumb.style.backgroundColor = "transparent";
            dragFlag = false;
        });
        range.addEventListener('mousedown', function(e) {
            outerThumb.style.backgroundColor = "rgba(185, 18, 18, .5)";
            dragFlag = true;
        });
        range.addEventListener('mousemove', function(e) {
            if (trackFill.classList.contains('track-fill-anim')) {
                trackFill.classList.remove('track-fill-anim');
            }
            if (outerThumb.classList.contains('thumb-anim')) {
                outerThumb.classList.remove('thumb-anim');
            }
            if (dragFlag) {
                var pageX = e.layerX;
                var outerX = parseInt(getComputedStyle(outerThumb).left, 10);
                var thumpX = pageX - outerX - 8;
                outerThumb.style.left = outerX + thumpX - 16;
                trackFill.style.width = outerX + 8;
            }

        })
        range.addEventListener('oncontextmenu', function(e) {
            e.preventDefault();
        })
        range.addEventListener('touchstart', function(e) {
            outerThumb.style.backgroundColor = "rgba(185, 18, 18, .5)";
        })
        range.addEventListener('touchmove', function(e) {
            if (trackFill.classList.contains('track-fill-anim')) {
                trackFill.classList.remove('track-fill-anim');
            }
            if (outerThumb.classList.contains('thumb-anim')) {
                outerThumb.classList.remove('thumb-anim');
            }
            var touch = e.touches[0];
            var pageX = touch.pageX - touch.target.getBoundingClientRect().x;
            var outerX = parseInt(getComputedStyle(outerThumb).left, 10);
            var thumpX = pageX - outerX - 8;
            outerThumb.style.left = outerX + thumpX - 16;
            trackFill.style.width = outerX + 9;
        })
        range.addEventListener('touchend', function(e) {
            outerThumb.style.backgroundColor = "transparent";
        })

    }
}
