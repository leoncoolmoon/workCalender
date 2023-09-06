var languages = {
    en: {
        "title": "Create an event",
        "start": "Start",
        "end": "End",
        "summary": "Summary",
        "alarm": "Alarm",
        "description": "Description",
        "create": "Create",
        "cancel": "Cancel",
        "reminder": "Reminder",
        "reminderAt": "Reminder at",
        "reminderIn": "Reminder in",
        "reminderAtSummary": "Reminder at {0}",
        "reminderInSummary": "Reminder in {0}",
        "alarmAudio": "Alarm audio",
        "alarmAudioSummary": "Alarm audio {0}",
        "alarmAudioNone": "None",
        "alarmAudioDefault": "Default",
        "alarmAudioCustom": "Custom",
        "shiftNotFound": "No such shift type",
        "none": "None shift type",
        "addShiftType": "Add shift type",
        "editShiftType": "Edit",
        "removeShiftType": "Remove"
    },
    zh: {
        "title": "创建一个事件",
        "start": "开始",
        "end": "结束",
        "summary": "摘要",
        "alarm": "闹钟",
        "description": "描述",
        "create": "创建",
        "cancel": "取消",
        "reminder": "提醒",
        "reminderAt": "提醒在",
        "reminderIn": "提醒在",
        "reminderAtSummary": "提醒在 {0}",
        "reminderInSummary": "提醒在 {0}",
        "alarmAudio": "闹钟音频",
        "alarmAudioSummary": "闹钟音频 {0}",
        "alarmAudioNone": "无",
        "alarmAudioDefault": "默认",
        "alarmAudioCustom": "自定义",
        "shiftNotFound": "没有该shift类型",
        "none": "没有班次类型",
        "addShiftType": "添加班次类型",
        "editShiftType": "编辑",
        "removeShiftType": "删除"


    }
};

var weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var shifts = [];//班表
var shiftTypeTable = [];//存放可选的shift类型
var audioFile = null;//alarm的音频文件
var lang = navigator.language || navigator.userLanguage;
var language = languages[lang] || languages.en;
var monthModeHeight = "10vh";
//var adjustHeight = "inherit";
var displayMonthMode = false;
var landscape = true;
var oldLandscape = true;
var calendarDiv, operateDiv, operateBoxDiv, topDiv, middleDiv, shiftTypeDiv, shiftEditBoxDiv;
var addShiftTypeDiv, removeShiftTypeDiv, editShiftTypeDiv;
var selectedDate = null;
window.onresize = function () {
    checkLandscape();
    if (oldLandscape != landscape) {
        adjustUI();
    }
}
window.onload = function () {
    checkLandscape();
    //用来展示图例的div
    topDiv = document.createElement("div");
    topDiv.id = "topDiv";
    topDiv.style.display = "block";
    topDiv.style.zIndex = "100";
    topDiv.style.position = "fixed";
    topDiv.style.top = "0";
    topDiv.style.left = "0";
    topDiv.style.width = "100vw";
    topDiv.style.height = "5vh";

    document.body.appendChild(topDiv);
    //用来展示日历和操作的div
    middleDiv = document.createElement("div");
    middleDiv.id = "middleDiv";
    middleDiv.style.display = "block";
    middleDiv.style.left = "0";
    middleDiv.style.top = "5vh";
    middleDiv.style.position = "relative";
    document.body.appendChild(middleDiv);
    //用来展示日历的div
    calendarDiv = document.createElement("div");
    calendarDiv.id = "calendarDiv";
    calendarDiv.style.display = "block";
    calendarDiv.style.height = "93vh";
    calendarDiv.style.width = "98vw";
    calendarDiv.style.top = "0";
    calendarDiv.style.left = "0";
    calendarDiv.addEventListener("click", function (event) {
        if (event.target.id == "calendarDiv") {
            generateCalendar(0);
        }
    });
    middleDiv.appendChild(calendarDiv);
    //用来展示操作的div
    operateBoxDiv = document.createElement("div");
    operateBoxDiv.id = "operateBoxDiv";
    operateBoxDiv.style.display = "none";
    operateBoxDiv.style.height = "100vh";
    operateBoxDiv.style.width = "100vw";
    operateBoxDiv.style.top = "5vh";
    operateBoxDiv.style.left = "0";
    operateBoxDiv.style.position = "fixed";
    operateBoxDiv.style.zIndex = "99";
    operateBoxDiv.style.backgroundColor = "rgba(20,20,20,0.5)";
    middleDiv.appendChild(operateBoxDiv);
    operateDiv = document.createElement("div");
    operateDiv.id = "operateDiv";
    operateDiv.style.display = "block";
    operateDiv.style.position = "fixed";
    operateDiv.style.zIndex = "100";
    operateDiv.style.top = "0px";
    operateDiv.style.left = "0px";
    operateDiv.style.width = "70vw";
    operateDiv.style.height = "70vh";
    operateDiv.style.transformOrigin = "center";
    //   border-radius: 1vw;box-shadow: rgb(0 0 0 / 75%) 2vw 2vh 2vh;
    operateDiv.style.borderRadius = "1vw";
    operateDiv.style.boxShadow = "rgb(0 0 0 / 75%) 2vw 2vh 2vh";
    operateDiv.style.transform = "translate(15%, 15%)";
    operateBoxDiv.appendChild(operateDiv);
    operateBoxDiv.addEventListener("click", function (event) {
        if (event.target.id == "operateBoxDiv") {
            operateBoxDiv.style.display = "none";
            selectedDate.style.border = "";
            topDiv.innerHTML = "";
        }
    });
    shiftTypeDiv = document.createElement("div");
    shiftTypeDiv.id = "shiftTypeDiv";
    //shiftTypeDiv.style.display = "block";
    shiftTypeDiv.style.position = "fixed";
    //addShiftTypeDiv, removeShiftTypeDiv, editShiftTypeDiv;
    if (shiftTypeTable === undefined) {
        shiftTypeDiv.innerHTML = language.none;
    } else {
        shiftTypeDiv.innerHTML = "";
        for (var i = 0; i < shiftTypeTable.length; i++) {

            var shiftType = document.createElement("div");
            shiftType.id = shiftTypeTable[i].summary;
            shiftType.innerHTML = shiftTypeTable[i].summary;
            shiftType.style.backgroundColor = shiftTypeTable[i].color;
            shiftType.style.color = "white";
            shiftType.style.borderRadius = "1vw";
            shiftType.style.margin = "1vw";
            shiftType.style.padding = "1vw";
            shiftType.style.display = "inline-block";
            shiftType.style.fontSize = "5vh";
            shiftType.style.textAlign = "center";
            shiftType.style.alignItems = "center";
            shiftType.style.width = "20vw";
            shiftType.style.height = "10vh";
            shiftType.style.lineHeight = "10vh";
            shiftType.style.verticalAlign = "middle";
            shiftType.style.cursor = "pointer";
            shiftType.style.textShadow = "gray 0.2em 0.1em 0.2em";
            shiftType.addEventListener("click", function (event) {
                if (event.target.id == "shiftTypeDiv") {
                    generateCalendar(0);
                } else {
                    shiftEditBoxDiv.style.display = "block";
                    selectedShiftType = event.target;
                    selectedShiftType.style.border = "0.2vw solid black";
                    topDiv.innerHTML = selectedShiftType.innerHTML;
                }
            });
            editShiftTypeDiv = document.createElement("div");
            editShiftTypeDiv.style.backgroundColor = "gray";
            editShiftTypeDiv.style.color = "white";
            editShiftTypeDiv.style.borderRadius = "1vw";
            editShiftTypeDiv.style.margin = "1vw";
            editShiftTypeDiv.style.padding = "1vw";
            editShiftTypeDiv.style.display = "inline-block";
            editShiftTypeDiv.style.fontSize = "5vh";
            editShiftTypeDiv.style.textAlign = "center";
            editShiftTypeDiv.style.alignItems = "center";
            editShiftTypeDiv.style.width = "20vw";
            editShiftTypeDiv.style.height = "10vh";
            editShiftTypeDiv.style.lineHeight = "10vh";
            editShiftTypeDiv.style.verticalAlign = "middle";
            editShiftTypeDiv.style.cursor = "pointer";
            editShiftTypeDiv.id = "editShiftTypeDiv";
            removeShiftTypeDiv = editShiftTypeDiv.cloneNode(true);
            editShiftTypeDiv.innerHTML = language.editShiftType;
            editShiftTypeDiv.addEventListener("click", function (event) {
                editShift(event.target.id);
            });
            shiftType.appendChild(editShiftTypeDiv);

            removeShiftTypeDiv.id = "removeShiftTypeDiv";
            removeShiftTypeDiv.innerHTML = language.removeShiftType;
            removeShiftTypeDiv.addEventListener("click", function (event) {
                removeShiftType(event.target.id);
            });
            shiftType.appendChild(removeShiftTypeDiv);
            shiftTypeDiv.appendChild(shiftType);
        }
    }
    addShiftTypeDiv = document.createElement("div");
    addShiftTypeDiv.id = "addShiftTypeDiv";
    addShiftTypeDiv.innerHTML = language.addShiftType;
    addShiftTypeDiv.style.backgroundColor = "gray";
    addShiftTypeDiv.style.color = "white";
    addShiftTypeDiv.style.borderRadius = "1vw";
    addShiftTypeDiv.style.margin = "1vw";
    addShiftTypeDiv.style.padding = "1vw";
    addShiftTypeDiv.style.display = "inline-block";
    addShiftTypeDiv.style.fontSize = "5vh";
    addShiftTypeDiv.style.textAlign = "center";
    addShiftTypeDiv.style.alignItems = "center";
    addShiftTypeDiv.style.width = "20vw";
    addShiftTypeDiv.style.height = "10vh";
    addShiftTypeDiv.style.lineHeight = "10vh";
    addShiftTypeDiv.style.verticalAlign = "middle";
    addShiftTypeDiv.style.cursor = "pointer";
    addShiftTypeDiv.addEventListener("click", function (event) {
        shiftEditBoxDiv.style.display = "block";
        selectedShiftType = event.target;
        selectedShiftType.style.border = "0.2vw solid black";
        topDiv.innerHTML = selectedShiftType.innerHTML;
    });
    shiftTypeDiv.appendChild(addShiftTypeDiv);

    shiftTypeDiv.style.width = "100%";
    shiftTypeDiv.style.height = "100%";
    shiftTypeDiv.style.display = " grid";

    shiftTypeDiv.style.fontSize = "5vh";
    shiftTypeDiv.style.textAlign = "center";
    shiftTypeDiv.style.alignItems = "center";

    operateDiv.appendChild(shiftTypeDiv);
    shiftEditBoxDiv = document.createElement("div");
    shiftEditBoxDiv.id = "shiftEditBoxDiv";
    shiftEditBoxDiv.style.display = "none";
    shiftEditBoxDiv.style.position = "fixed";
    operateDiv.appendChild(shiftTypeDiv);
    //用来展示班次类别的div
    if (oldLandscape != landscape) {
        adjustUI();
    }
    generateCalendar(0);
}
function checkLandscape() {
    oldLandscape = landscape;
    if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
        landscape = true;
    } else {
        landscape = false;
    }
}
function adjustUI() {

    //移动div到中间
    operateDiv.style.transform = "translate(-50%,-50%)";

    if (landscape) {

    } else {

    }
}


function generateCalendar(displayM) {
    calendarDiv.innerHTML = "";
    // 创建 h1 元素
    const yearHeading = document.createElement("h1");
    yearHeading.id = "year";
    yearHeading.addEventListener("click", function () { if (displayMonthMode) { generateCalendar(0); } });

    // 创建 div 元素
    const monthContainer = document.createElement("div");
    monthContainer.className = "month-container";
    monthContainer.id = "monthContainer";

    // 将元素添加到页面中的适当位置
    calendarDiv.appendChild(yearHeading);
    calendarDiv.appendChild(monthContainer);

    var date = new Date();
    var year = date.getFullYear();
    yearHeading.innerHTML = year;

    if (displayM === 0) {
        displayMonthMode = false;
        for (var k = 0; k < 12; k++) {
            generateMonth(year, k, monthContainer);
        }
    } else if (displayM >= 1 && displayM <= 12) {
        displayMonthMode = true;
        generateMonth(year, displayM - 1, monthContainer);
        //yearHeading.innerHTML = year + " - " + monthNames[displayM - 1];
        monthContainer.style.display = "block";
        //monthContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(20vw, 1fr))";
    }
}

function generateMonth(year, month, container) {
    var monthDiv = document.createElement("div");
    var monthTitle = document.createElement("h2");
    monthTitle.innerHTML = monthNames[month];
    monthDiv.appendChild(monthTitle);
    monthDiv.id = month + 1;
    if (displayMonthMode) {
        monthDiv.style.height = monthModeHeight;
        monthDiv.style.fontSize = "5em";
    } else {
        monthDiv.className = "month";
        monthDiv.style.height = "inherit";
        monthDiv.style.fontSize = "1.5em";
        monthDiv.addEventListener("click", function () { if (!displayMonthMode) { generateCalendar(parseInt(this.id)) } });
    }
    var grid = document.createElement("div");
    grid.className = "grid-container";
    var firstDay = new Date(year, month, 1).getDay() - 1;
    if (firstDay === -1) firstDay = 6; // If first day is Sunday
    var daysInMonth = 32 - new Date(year, month, 32).getDate();
    var date = 1;

    for (var j = 0; j < 7; j++) {
        var cell = document.createElement("div");
        cell.className = "grid-item";
        cell.innerHTML = weekNames[j];
        if (displayMonthMode) {
            cell.style.height = monthModeHeight;
            cell.style.fontSize = "3em";
        } else {
            cell.style.height = "inherit";
            cell.style.fontSize = "1.5em";
        }
        cell.style.height = displayMonthMode ? monthModeHeight : "inherit";
        cell.classList.add("weekend");
        grid.appendChild(cell);
    }
    if (displayMonthMode) {
        grid.style.border = "0.2vw solid black";
        grid.style.borderRadius = "1vw";
    }
    else {
        grid.style.border = "";
    }
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
            var cell = document.createElement("div");
            cell.className = "grid-item";
            if (displayMonthMode) {
                cell.addEventListener("click", function (event) {
                    operateBoxDiv.style.display = "block";
                    selectedDate = event.target;
                    selectedDate.style.border = "0.2vw solid black";
                    topDiv.innerHTML = doubleNum(selectedDate.innerHTML) + "-" + monthNames[month] + "-" + year;
                });
                cell.style.height = monthModeHeight;
                cell.style.fontSize = "3em";
            } else {
                cell.style.height = "inherit";
                cell.style.fontSize = "1.5em";
            }
            if (i === 0 && j < firstDay) {
                cell.innerHTML = "";
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.innerHTML = date;
                if (j === 5 || j === 6) {
                    cell.classList.add("weekend");
                }
                date++;
            }
            grid.appendChild(cell);
        }
    }

    monthDiv.appendChild(grid);
    container.appendChild(monthDiv);
}

function doubleNum(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}

function addShift() {//添加班次
    var shift = {};
    shift.date = document.getElementById("date").value;//班次所对应的日期
    shift.type = document.getElementById("type").value;//班次所对应的类型
    shifts.push(shift);
}
function removeShift() {//删除班次

}
function editShift() {//编辑班次
    var shiftType = document.getElementById("shiftType").value;
    var i = findShiftType(shiftType);
    if (i == null) {
        alert(language.shiftNotFound);
        return;
    } else {
        document.getElementById("start").value = shiftTypeTable[i].start;
        document.getElementById("end").value = shiftTypeTable[i].end;
        document.getElementById("summary").value = shiftTypeTable[i].summary;
        document.getElementById("alarm").value = shiftTypeTable[i].trigger;
        document.getElementById("contentForAlarm").value = shiftTypeTable[i].description;
        audiodocument.getElementById("alarmFile").value = shiftTypeTable[i].audioFile;
        document.getElementById("color").value = shiftTypeTable[i].color;
    }
}


function findShiftType(shiftType) {//查找shift类型
    for (var i = 0; i < shiftTypeTable.length; i++) {
        if (shiftTypeTable[i].summary == shiftType) {
            return shiftTypeTable[i];
        }
    }
    return null;
}

function removeShiftType(shiftType) {//删除shift类型
    if (shiftType === undefined) {
        shiftType = document.getElementById("shiftType").value;
    }
    var i = findShiftType(shiftType);
    if (i == null) {
        alert(language.shiftNotFound);
        return;
    }
    shiftTypeTable.splice(i, 1);
}

function addShiftType() {//添加shift类型
    var shiftTpye = {};
    shiftTpye.start = document.getElementById("start").value;//shift类型所对应的开始时间
    shiftTpye.end = document.getElementById("end").value;//shift类型所对应的结束时间
    shiftTpye.summary = document.getElementById("summary").value;//shift类型：从am，pm，night，dayoff，vacation，sick，holiday中选择或者自己输入
    shiftTpye.trigger = document.getElementById("alarm").value;//shift类型所对应的提醒时间
    shiftTpye.description = document.getElementById("contentForAlarm").value;//shift类型所对应的提醒内容
    shiftTpye.audioFile = audiodocument.getElementById("alarmFile").value;//shift类型所对应的提醒音频文件
    shiftTpye.color = document.getElementById("color").value;//shift类型所对应的颜色
    //移除重复的shift类型
    removeShiftType(shiftTpye.summary);
    //添加shift类型    
    shiftTypeTable.push(shiftTpye);
    //清空输入框    
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("summary").value = "";
    document.getElementById("alarm").value = "";
    document.getElementById("contentForAlarm").value = "";
    audiodocument.getElementById("alarmFile").value = "";
    document.getElementById("color").value = white;
}

function selectFile() {//打开 打开文件对话框来从本地选择一个文件 返回文件名

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    //接受音频文件
    fileInput.accept = 'audio/*';
    //fileInput.accept = plainTextFile;//+ "," + STL;
    fileInput.onchange = function (event) {
        audioFile = event.target.files[0];
    };
    fileInput.click();

}

function creatVALARM(trigger, description) {
    if (trigger == null) {
        trigger = "-PT15M";
    }
    if (description == null) {
        description = "Reminder";
    }
    var alarm = "BEGIN:VALARM\n"
        + "TRIGGER:" + trigger + "\n"
        + "ACTION:DISPLAY\n"
        + "DESCRIPTION:" + description + "\n"
        + "END:VALARM";
    if (audioFile != null) {
        alarm = alarm + "\n"
            + "BEGIN:VALARM\n"
            + "TRIGGER:" + trigger + "\n"
            + "ACTION:AUDIO\n"
            + "ATTACH;VALUE=URI:file://" + audioFile + "\n"
            + "END:VALARM";
    }
    //ATTACH;FMTTYPE=audio/basic:file:///sdcard/notifications/notification.mp3
    return alarm;
}

function createVEvent(start, end, summary, created, alarm) {
    // 创建一个随机的 UID
    var uid = Math.random().toString(36).substring(2) + "@example.com";

    // 将 JavaScript 日期对象转换为 iCalendar 日期时间格式
    function formatDateTime(date) {
        function pad(n) { return n < 10 ? '0' + n : n }
        return date.getUTCFullYear()
            + pad(date.getUTCMonth() + 1)
            + pad(date.getUTCDate())
            + 'T' + pad(date.getUTCHours())
            + pad(date.getUTCMinutes())
            + pad(date.getUTCSeconds())
            + 'Z';
    }
    var dtstart = formatDateTime(new Date(start));
    var dtend = formatDateTime(new Date(end));
    var dtstamp = formatDateTime(new Date(created));

    // 创建 VEVENT 组件
    var vevent = "BEGIN:VEVENT\n"
        + "UID:" + uid + "\n"
        + "DTSTAMP:" + dtstamp + "\n"
        + "DTSTART:" + dtstart + "\n"
        + "DTEND:" + dtend + "\n"
        + "SUMMARY:" + summary + "\n"
        + alarm + "\n"
        + "END:VEVENT";

    return vevent;
}
function createVCalendar(vevents) {
    // 创建 VCALENDAR 组件
    var vcalendar = "BEGIN:VCALENDAR\n"
        + "VERSION:2.0\n"
        + "PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n"
        + vevents.join("\n")
        + "\nEND:VCALENDAR";

    return vcalendar;
}
function downloadVCalendar(vcalendar) {
    // 创建一个下载链接
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(vcalendar));
    link.setAttribute('download', 'event.ics');
    link.click();
}
