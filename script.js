var languages = {
    en: {
        "title": "Create an event",
        "start": "Start",
        "end": "End",
        "summary": "Shift type",
        "alarm": "Alarm time",
        "description": "Description",
        "create": "Create",
        "cancel": "Cancel",
        "clear": "Clear",
        "save": "Save",
        "reminder": "Reminder",
        "alarmAudio": "Alarm audio",
        "alarmAudioNone": "None",
        "alarmAudioDefault": "Default",
        "selectShiftColor": "Custom color",
        "shiftNotFound": "No such shift type",
        "none": "None shift type",
        "addShiftType": "Add shift type",
        "removeShiftType": "Remove shift type",
        "editShiftType": "Edit shift type",
        "add": "Add",
        "remove": "Remove",
        "edit": "Edit",
        "selectAbleTimes": ["5 minutes before", "10 minutes before", "15 minutes before", "20 minutes before", "30 minutes before", "45 minutes before", "1 hour before", "1.5 hours before", "2 hours before"],
        "weekNames": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "openFile": "Open file"
    },
    zh: {
        "title": "创建一个事件",
        "start": "开始",
        "end": "结束",
        "summary": "班次类型",
        "alarm": "闹铃时间",
        "description": "描述",
        "create": "创建",
        "cancel": "取消",
        "clear": "清空",
        "save": "保存",
        "reminder": "提醒",
        "alarmAudio": "闹钟音频",
        "alarmAudioNone": "无",
        "alarmAudioDefault": "默认",
        "selectShiftColor": "自定义颜色",
        "shiftNotFound": "没有该shift类型",
        "none": "没有班次类型",
        "addShiftType": "添加班次类型",
        "editShiftType": "编辑班次类型",
        "removeShiftType": "删除班次类型",
        "add": "添加",
        "remove": "删除",
        "edit": "编辑",
        "selectAbleTimes": ["提前5分钟", "提前10分钟", "提前15分钟", "提前20分钟", "提前30分钟", "提前45分钟", "提前1小时", "提前1个半小时", "提前2小时"],
        "weekNames": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二"],
        "openFile": "打开文件"
    }
};

// var weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//"selectAbleTimes": "5 minutes before|10 minutes before|15 minutes before|20 minutes before|30 minutes before|45 minutes before|1 hour before|1.5 hours before|2 hours before|"
// selectAbleTimesValue =["-PT5M" ，"-PT10M"...]
var selectAbleTimesValue = ["-PT5M", "-PT10M", "-PT15M", "-PT20M", "-PT30M", "-PT45M", "-PT1H", "-PT1H30M", "-PT2H"];

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
// 日历div，操作div，操作div的背景遮罩，顶部信息div，中间日历显示div，班次信息编辑用div，班次类型信息编辑用div
var calendarDiv, operateDiv, operateBoxDiv, topDiv, middleDiv, shiftEditerDiv, shiftTypeEditBoxDiv;
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
    //---------------------------------------------------------
    //构建班次信息编辑器
    shiftEditerDiv = document.createElement("div");
    shiftEditerDiv.id = "shiftEditerDiv";//用来编辑当日班次，列出所有班次类型，可以添加班次类型，删除班次类型，编辑班次类型
    shiftEditerDiv.style.position = "fixed";
    //addShiftTypeDiv, removeShiftTypeDiv, editShiftTypeDiv;
    if (shiftTypeTable === undefined) {
        shiftEditerDiv.innerHTML = language.none;
    } else {
        shiftEditerDiv.innerHTML = "";
        for (var i = 0; i < shiftTypeTable.length; i++) {
            //用来展示班次类型的div
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
                if (event.target.id == this.id) {
                    //赋予当前选择日期当前的班次类型
                    //TODO:赋予当前选择日期当前的班次类型
                }
            });
            //编辑当前的班次类型,或者删除当前的班次类型 按钮构造
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
            //编辑当前的班次类型
            editShiftTypeDiv.innerHTML = language.edit;
            editShiftTypeDiv.addEventListener("click", function (event) {
                editShiftTpye(shiftType.id);
                shiftTypeEditBoxDiv.style.display = "block";
                topDiv.innerHTML = language.editShiftType;
            });
            shiftType.appendChild(editShiftTypeDiv);
            //删除当前的班次类型
            removeShiftTypeDiv.id = "removeShiftTypeDiv";
            removeShiftTypeDiv.innerHTML = language.remove;
            removeShiftTypeDiv.addEventListener("click", function (event) {
                removeShiftType(shiftType.id);
            });
            shiftType.appendChild(removeShiftTypeDiv);
            shiftEditerDiv.appendChild(shiftType);
        }
    }
    //添加班次类型按钮构造
    addShiftTypeDiv = document.createElement("div");
    addShiftTypeDiv.id = "addShiftTypeDiv";
    addShiftTypeDiv.innerHTML = language.add;
    addShiftTypeDiv.style.backgroundColor = "gray";
    addShiftTypeDiv.style.color = "white";
    addShiftTypeDiv.style.borderRadius = "1vw";
    addShiftTypeDiv.style.margin = "1vw";
    addShiftTypeDiv.style.padding = "1vw";
    addShiftTypeDiv.style.display = "inline-block";
    addShiftTypeDiv.style.fontSize = "5vh";
    addShiftTypeDiv.style.textAlign = "center";
    addShiftTypeDiv.style.alignItems = "center";
    addShiftTypeDiv.style.width = "80%";
    addShiftTypeDiv.style.height = "10vh";
    addShiftTypeDiv.style.lineHeight = "10vh";
    addShiftTypeDiv.style.verticalAlign = "middle";
    addShiftTypeDiv.style.cursor = "pointer";
    addShiftTypeDiv.addEventListener("click", function (event) {
        //添加班次类型
        shiftTypeEditBoxDiv.style.display = "block";
        topDiv.innerHTML = language.addShiftType;
    });
    shiftEditerDiv.appendChild(addShiftTypeDiv);

    shiftEditerDiv.style.width = "100%";
    shiftEditerDiv.style.height = "100%";
    shiftEditerDiv.style.display = " grid";
    shiftEditerDiv.style.fontSize = "5vh";
    shiftEditerDiv.style.textAlign = "center";
    shiftEditerDiv.style.alignItems = "center";
    operateDiv.appendChild(shiftEditerDiv);

    //--------------------------------------------------------------
    //构建班次类型编辑器
    shiftTypeEditBoxDiv = document.createElement("div");
    shiftTypeEditBoxDiv.id = "shiftTypeEditBoxDiv";//用来某个编辑班次类型具体的起止时间，颜色等内容
    shiftTypeEditBoxDiv.style.display = "none";
    shiftTypeEditBoxDiv.style.position = "fixed";
    shiftTypeEditBoxDiv.style.zIndex = "120";
    shiftTypeEditBoxDiv.style.width = "100%";
    shiftTypeEditBoxDiv.style.height = "100%";
    shiftTypeEditBoxDiv.style.fontSize = "5vh";
    shiftTypeEditBoxDiv.style.textAlign = "center";
    shiftTypeEditBoxDiv.style.alignItems = "center";
    shiftTypeEditBoxDiv.style.backgroundColor = "white";
    //插入一个div容纳start, end, summary, created, alarm,contentForAlarm,alarmFile,color
    
    var contentDiv = document.createElement("div");
    contentDiv.id = "contentDiv";
    contentDiv.style.width = "100%";
    contentDiv.style.height = "80%";
    contentDiv.style.display = "flex";
    contentDiv.style.flexDirection = "column";
    contentDiv.style.justifyContent = "space-around";
    contentDiv.style.alignItems = "center";
    shiftTypeEditBoxDiv.appendChild(contentDiv);

    var startContainer = document.createElement("div");
    startContainer.className="row"
    //在start前增加一个language.start的标签
    var startLabel = document.createElement("div");
    startLabel.className="label"
    startLabel.innerHTML = language.start;
    startContainer.appendChild(startLabel);
    //start 是一个时间选择器value 类似“08:00”
    var start = document.createElement("input");
    start.className="content";
    start.type = "time";
    start.id = "start";
    startContainer.appendChild(start);
    contentDiv.appendChild(startContainer);

    var endContainer = document.createElement("div");
    endContainer.className="row"
    //在end前增加一个language.end的标签
    var endLabel = document.createElement("div");
    endLabel.className="label"
    endLabel.innerHTML = language.end;
    endContainer.appendChild(endLabel);
    //end 是一个时间选择器value 类似“17:00”
    var end = document.createElement("input");
    end.className="content";
    end.type = "time";
    end.id = "end";
    endContainer.appendChild(end);
    contentDiv.appendChild(endContainer);

    var summaryContainer = document.createElement("div");
    summaryContainer.className="row"
    //在summary前增加一个language.summary的标签
    var summaryLabel = document.createElement("div");
    summaryLabel.className="label"
    summaryLabel.innerHTML = language.summary;
    summaryContainer.appendChild(summaryLabel);
    //summary 是一个文本输入框value 类似“早班”
    var summary = document.createElement("input");
    summary.className="content";
    summary.type = "text";
    summary.id = "summary";
    summaryContainer.appendChild(summary);
    contentDiv.appendChild(summaryContainer);

    var alarmContainer = document.createElement("div");
    alarmContainer.className="row"
    //在alarm前增加一个language.alarm的标签
    var alarmLabel = document.createElement("div");
    alarmLabel.className="label"
    alarmLabel.innerHTML = language.alarm;
    alarmContainer.appendChild(alarmLabel);
    //alarm 是一个选择器 显示可供选择的内容 为language.selectAbleTimes。value为相应类似“-PT5M ，-PT10M ... ”
    var alarm = document.createElement("select");
    alarm.className="content";
    alarm.id = "alarm";
    language.selectAbleTimes.forEach((time, i) => {
        const option = document.createElement("option");
        option.value = selectAbleTimesValue[i];
        option.text = time;
        alarm.appendChild(option);
    });
    alarmContainer.appendChild(alarm);
    contentDiv.appendChild(alarmContainer);

    var contentForAlarmContainer = document.createElement("div");
    contentForAlarmContainer.className="row"
    //在contentForAlarm前增加一个language.description的标签
    var contentForAlarmLabel = document.createElement("div");
    contentForAlarmLabel.className="label"
    contentForAlarmLabel.innerHTML = language.description;
    contentForAlarmContainer.appendChild(contentForAlarmLabel);
    //contentForAlarm 是一个文本输入框value 类似“早班提醒”
    var contentForAlarm = document.createElement("input");
    contentForAlarm.className="content";
    contentForAlarm.type = "text";
    contentForAlarm.id = "contentForAlarm";
    contentForAlarmContainer.appendChild(contentForAlarm);
    contentDiv.appendChild(contentForAlarmContainer);

    var alarmFileContainer = document.createElement("div");
    alarmFileContainer.className="row"
    //在alarmFile前增加一个language.alarmAudio的标签
    var alarmAudioLabel = document.createElement("div");
    alarmAudioLabel.className="label"
    alarmAudioLabel.innerHTML = language.alarmAudio;
    alarmFileContainer.appendChild(alarmAudioLabel);
    //alarmFile 是一个文本输入框value 类似“/sdcard/notifications/notification.mp3”
    var alarmFile = document.createElement("input");
    alarmFile.className="content";
    alarmFile.type = "text";
    alarmFile.id = "alarmFile";
    alarmFileContainer.appendChild(alarmFile);
    //alarmSelector 是一个按钮，点击后弹出系统打开文件对话框，选择一个音频文件，返回文件名到alarmFile
    var alarmSelector = document.createElement("button");
    alarmSelector.className="content";
    alarmSelector.id = "alarmSelector";
    alarmSelector.innerHTML = language.openFile;
    alarmSelector.addEventListener("click", function (event) {
        selectFile();
    });
    alarmFileContainer.appendChild(alarmSelector);
    contentDiv.appendChild(alarmFileContainer);

    var colorContainer = document.createElement("div");
    colorContainer.className="row"
    //color 是一个文本框value 类似“#FF0000”，其背景色为该颜色，其文本为白色+阴影
    var color = document.createElement("input");
    color.className="label";
    color.value = "#FF0000";
    color.style.backgroundColor = "#FF0000";
    color.style.color = "white";
    color.style.textShadow = "gray 0.2em 0.1em 0.2em";
    color.type = "color";
    color.id = "color";
    colorContainer.appendChild(color);
    //colorSelector 是一个按钮，点击后弹出系统颜色选择器，选择一个颜色，返回颜色值到color
    var colorSelector = document.createElement("button");
    colorSelector.className="content";
    colorSelector.id = "colorSelector";
    colorSelector.innerHTML = language.selectShiftColor;
    colorSelector.addEventListener("click", function (event) {
        color.click();
    });
    colorContainer.appendChild(colorSelector);
    contentDiv.appendChild(colorContainer);

    //插入一个底部div来容纳clear，cancel，save按钮
    var bottomDiv = document.createElement("div");
    bottomDiv.id = "bottomDiv";
    bottomDiv.style.width = "100%";
    bottomDiv.style.display = "flex";
    bottomDiv.style.justifyContent = "space-around";
    bottomDiv.style.alignItems = "center";
    shiftTypeEditBoxDiv.appendChild(bottomDiv);

    //clear 是一个按钮，点击后清空所有输入框
    var clear = document.createElement("button");
    clear.id = "clear";
    clear.innerHTML = language.clear;
    clear.addEventListener("click", clearForm);
    bottomDiv.appendChild(clear);
       
    //cancel 是一个按钮，点击后清空所有输入框，并更改shiftTypeEditBoxDiv.style.display = "none";
    var cancel = document.createElement("button");
    cancel.id = "cancel";
    cancel.innerHTML = language.cancel;
    cancel.addEventListener("click", function (event) {
        clearForm();
        shiftTypeEditBoxDiv.style.display = "none";
    });
    //save 是一个按钮，点击后调用函数addShiftType()，并更改shiftTypeEditBoxDiv.style.display = "none";
    var save = document.createElement("button");
    save.id = "save";
    save.innerHTML = language.create;
    save.addEventListener("click", function (event) {
        addShiftType();
        clearForm();
        shiftTypeEditBoxDiv.style.display = "none";
    });

    operateDiv.appendChild(shiftTypeEditBoxDiv);



    //----------------------------------------------------------------
    //用来展示班次类别的div
    if (oldLandscape != landscape) {
        adjustUI();
    }
    generateCalendar(0);
}
function clearForm(){
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("summary").value = "";
    document.getElementById("alarm").value = "";
    document.getElementById("contentForAlarm").value = "";
    document.getElementById("alarmFile").value = "";
    document.getElementById("color").value = "";

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
    monthTitle.innerHTML = language.monthNames[month];
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
        cell.innerHTML = language.weekNames[j];
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
                    topDiv.innerHTML = doubleNum(selectedDate.innerHTML) + "-" + language.monthNames[month] + "-" + year;
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
//班次类型操作 编辑，查找，删除，添加
function editShiftTpye(shiftType) {//编辑班次类型
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
//班次类型操作 编辑，查找，删除，添加

function selectFile() {//打开 打开文件对话框来从本地选择一个文件 返回文件名

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    //接受音频文件
    fileInput.accept = 'audio/*';
    //fileInput.accept = plainTextFile;//+ "," + STL;
    fileInput.onchange = function (event) {
        audioFile = event.target.files[0];
        document.getElementById("alarmFile").value = audioFile.name;

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