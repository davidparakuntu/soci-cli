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

    window.activateCalendar = function(calButtons) {
        var inst = {};
        inst.calendar = ec('calendar')[0];
        for (var i = 0; i < calButtons.length; i++) {
            var calButton = calButtons[i];
            calButton.addEventListener('click', function(event) {
                window.cal = showCalendar(ec('calendar-holder')[0]);
            });
            calButton.addEventListener('touchstart', function(event) {
               window.cal= showCalendar(ec('calendar-holder')[0]);
            });
            calButton.addEventListener('mousedown', function(event) {
                window.cal=showCalendar(ec('calendar-holder')[0]);
            });
        }

    }

    window.month = {
        month: "April",
        year: 2018,
        weekDays: [{
            name: "Sunday",
            shortName: "Sun"
        }, {
            name: "Monday",
            shortName: "Mon"
        }, {
            name: "Tuesday",
            shortName: "Tue"
        }, {
            name: "Wednesday",
            shortName: "Wed"
        }, {
            name: "Thursday",
            shortName: "Thu"
        }, {
            name: "Friday",
            shortName: "Fri"
        }, {
            name: "Saturday",
            shortName: "Sat"
        }],
        weeks: [[0, 0, 0, 0, 1, 2, 3], [5, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28], [29, 30, 31, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11]]
    };

    window.showCalendar = function(parentNode) {
        var calendar = {};
        calendar.parent = parentNode;
        var templateURL = "templates/calendar.html";
        fetch(templateURL).then(function(response) {
            response.text().then(function(text) {
                parentNode.innerHTML = hb.compile(text)(window.month);
                ec('calendar-holder')[0].style.display = "block";
                ec('calendar-cancel-button')[0].addEventListener('click', function() {
                    ec('calendar-holder')[0].style.display = "none";
                });
            });
        });
        calendar.showMonth = function() {
            var templateURL = "templates/calendar-week.html";
            fetch(templateURL).then(function(response) {
                response.text().then(function(text) {
                    ec('calendar-month')[0].innerHTML = hb.compile(text)(window.month);
                });
            });
        }
        calendar.showNextMonth = function() {
            
        }
        calendar.showPreviousMonth = function() {
        }

        calendar.getSelectedDate = function() {
        }
        return calendar;

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

            inst.outerThumb.style.left = pageX - 16;
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

        inst.removeAnimation = function() {
            if (inst.trackFill.classList.contains('track-fill-anim')) {
                inst.trackFill.classList.remove('track-fill-anim');
            }
            if (inst.outerThumb.classList.contains('thumb-anim')) {
                inst.outerThumb.classList.remove('thumb-anim');
            }
        }
        inst.addAnimation = function() {
            if (!inst.trackFill.classList.contains('track-fill-anim')) {
                inst.trackFill.classList.add('track-fill-anim');
            }
            if (!inst.outerThumb.classList.contains('thumb-anim')) {
                inst.outerThumb.classList.add('thumb-anim');
            }
        }

    }
}
