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

    window.monthArray = [[0, 'January'], [1, 'February'], [2, 'March'], [3, 'April'], [4, 'May'], [5, 'June'], [6, 'July'], [7, 'August'], [8, 'September'], [9, 'October'], [10, 'November'], [11, 'December']];
    window.monthMap = new Map(monthArray);
    window.dayArray = [[0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"]];
    window.dayMap = new Map(dayArray);

    window.activateCalendar = function(calButtons) {
        var inst = {};
        inst.calendar = ec('calendar')[0];
        for (var i = 0; i < calButtons.length; i++) {
            var calButton = calButtons[i];
            calButton.addEventListener('click', function(event) {
                window.cal = showCalendar(ec('calendar-holder')[0]);
                cal.showMonth();
            });
            calButton.addEventListener('touchstart', function(event) {
                window.cal = showCalendar(ec('calendar-holder')[0]);
                cal.showMonth();
            });
            calButton.addEventListener('mousedown', function(event) {
                window.cal = showCalendar(ec('calendar-holder')[0]);
                cal.showMonth();
            });
        }

    }

    window.getMonth = function(date) {
        date.setDate(1);
        var lastDay = new Date(date.getFullYear(),date.getMonth() + 1,0);
        var m = {
            day: dayMap.get(date.getDay()),
            month: monthMap.get(date.getMonth()),
            year: date.getFullYear(),
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
            }]
        }
        m.weeks = [];
        var firstWeek = [];
        for (var j = 0; j < date.getDay(); j++) {
            firstWeek.push(0);
        }
        var firstDay = date.getDay();
        for (var i = firstDay; i <= 6; i++) {
            var d = date.getDate();
            firstWeek.push(d);
            date.setDate(d + 1);
        }
        var month = date.getMonth();
        m.weeks.push(firstWeek);
        var week = [];
        var l = 1;
        for (var k = date.getDate(); (k <= lastDay.getDate()) && (month == date.getMonth()); k++) {
            week.push(k);
            if (l % 7 == 0) {
                m.weeks.push(week);
                week = [];
            }
            l++;
        }
        if (week.length > 0) {
            m.weeks.push(week);
        }
        for (var n = m.weeks.length; n < 6; n++) {
            m.weeks.push([0, 0, 0, 0, 0, 0, 0]);
        }
        return m;
    }
    window.showCalendar = function(parentNode) {
        var calendar = {};
        calendar.currentMonth = new Date();
        calendar.selectedDate = new Date();
        calendar.parent = parentNode;
        var templateURL = "templates/calendar.html";
        fetch(templateURL).then(function(response) {
            response.text().then(function(text) {
                var obj = window.getMonth(calendar.currentMonth);
                obj.left = "100%";
                parentNode.innerHTML = hb.compile(text)(obj);
                ec('calendar-holder')[0].style.display = "block";
                ec('calendar-cancel-button')[0].addEventListener('click', function() {
                    ec('calendar-holder')[0].style.display = "none";
                });
                calendar.cp = ec('calendar-page')[0];
                calendar.cp.addEventListener('touchstart', function(event) {
                    calendar.touchStartTime = new Date();
                    calendar.touchStartX = event.touches[0].pageX;
                    calendar.touchMove = false;
                });

                calendar.cp.addEventListener('touchmove', function(event) {
                    calendar.touchMove = true;
                    calendar.moveX = event.touches[0].pageX;
                });

                calendar.cp.addEventListener('touchend', function(event) {
                    let timeDiff = new Date() - calendar.touchStartTime;
                    if (timeDiff < 900 && calendar.touchMove) {
                        if (calendar.moveX < calendar.touchStartX) {
                            calendar.showNextMonth();
                        } else if (calendar.moveX > calendar.touchStartX) {
                            calendar.showPreviousMonth();
                        } else {
                            console.log('something wrong!!');
                        }
                    } else if (timeDiff < 500) {
                        if (event.target.classList.contains('calendar-day')) {
                            var selected = ec('selected-date');
                            for (var i = 0; i < selected.length; i++) {
                                selected[0].classList.remove('selected-date')
                            }
                            event.target.classList.add('selected-date');
                            calendar.selectedDate.setDate(event.target.innerText);
                            calendar.selectedDate.setFullYear(calendar.currentMonth.getFullYear());
                            calendar.selectedDate.setMonth(calendar.currentMonth.getMonth());

                            ec('selected-year')[0].innerText = "";
                            ec('selected-day-date-month')[0].innerText = "";
                            
                            ec('selected-year')[0].innerText = calendar.selectedDate.getFullYear();
                            ec('selected-day-date-month')[0].innerText = dayMap.get(calendar.selectedDate.getDay()).substr(0,3) + ", " + monthMap.get(calendar.selectedDate.getMonth()) + " " + calendar.selectedDate.getDate()
                        }

                    }
                });

            });
        });
        calendar.showMonth = function() {
            var templateURL = "templates/calendar-week.html";
            fetch(templateURL).then(function(response) {
                response.text().then(function(text) {
                    var cm = ec('calendar-month')[0];
                    cm.innerHTML = "";
                    var obj = window.getMonth(calendar.currentMonth);
                    obj.left = "100%";
                    cm.innerHTML = hb.compile(text)(obj);
                    ec('month-days')[0].style.left = "1%";
                    ec('selected-year')[0].innerText = calendar.selectedDate.getFullYear();
                    ec('selected-day-date-month')[0].innerText = dayMap.get(calendar.selectedDate.getDay()).substr(0,3) + ", " + monthMap.get(calendar.selectedDate.getMonth()) + " " + calendar.selectedDate.getDate()
                });
            });
        }
        calendar.showNextMonth = function() {
            var templateURL = "templates/calendar-week.html";
            fetch(templateURL).then(function(response) {
                response.text().then(function(text) {
                    var cm = ec('calendar-month')[0];
                    calendar.currentMonth.setMonth(calendar.currentMonth.getMonth() + 1);
                    var m = window.getMonth(calendar.currentMonth)
                    m.left = "100%";
                    cm.insertAdjacentHTML('beforeend', hb.compile(text)(m));
                    ec('calendar-nav-disp')[0].innerHTML = m.month + ' ' + m.year;
                }).then(function() {
                    var allNodes = ec('month-days');
                    if (allNodes.length == 3) {
                        ec('calendar-month')[0].removeChild(allNodes[0]);
                    }
                    allNodes = ec('month-days');
                    allNodes[0].style.left = "-100%";
                    setTimeout(function() {
                        allNodes[1].style.left = "1%";
                    }, 200);
                }).catch(function(e) {
                    console.log(e);
                });
            });

        }
        calendar.showPreviousMonth = function() {
            var templateURL = "templates/calendar-week.html";
            fetch(templateURL).then(function(response) {
                response.text().then(function(text) {
                    var cm = ec('calendar-month')[0];
                    calendar.currentMonth.setMonth(calendar.currentMonth.getMonth() - 1);
                    var m = window.getMonth(calendar.currentMonth)
                    m.left = "-100%";
                    cm.insertAdjacentHTML('beforeend', hb.compile(text)(m));
                    ec('calendar-nav-disp')[0].innerHTML = m.month + ' ' + m.year;
                }).then(function() {
                    var allNodes = ec('month-days');
                    if (allNodes.length == 3) {
                        ec('calendar-month')[0].removeChild(allNodes[0]);
                    }
                    allNodes = ec('month-days');
                    allNodes[0].style.left = "100%";
                    setTimeout(function() {
                        allNodes[1].style.left = "1%";
                    }, 200);
                }).catch(function(e) {
                    console.log(e);
                });
            });
        }

        calendar.getSelectedDate = function() {}
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
