var languages = {
    en: {
        "title": "Create an event",
        "start": "Start",
        "end": "End",
        "summary": "Shift type",
        "alarm": "Alarm time",
        "description": "Description",
        "create": "OK",
        "cancel": "Cancel",
        "clear": "Clear",
        "clearAll": "Clear all shifts",
        "import": "Import ICS file",
        "notCompatible": "Your ICS file is incompatible with this app.",
        "save": "Save",
        "reminder": "Reminder",
        "alarmAudio": "Alarm audio",
        "alarmAudioNone": "None",
        "alarmAudioDefault": "Default",
        "selectShiftColor": "Custom color",
        "shiftNotFound": "No such shift type",
        "none": "None shift type",
        "addShiftType": "Add shift type",
        "clearShift": "Clear shift for this day",
        "removeShiftType": "Remove shift type",
        "editShiftType": "Edit shift type",
        "add": "Add",
        "remove": "Remove",
        "edit": "Edit",
        "selectAbleTimes": ["no alarm ", "5 minutes before", "10 minutes before", "15 minutes before", "20 minutes before", "30 minutes before", "45 minutes before", "1 hour before", "1.5 hours before", "2 hours before"],
        "weekNames": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "openFile": "Open file",
        "download": "Download roster",
        "downloadNew": "Download updated roster"
    },
    zhCN: {
        "title": "创建一个事件",
        "start": "开始",
        "end": "结束",
        "summary": "班次类型",
        "alarm": "闹铃时间",
        "description": "描述",
        "create": "确认",
        "cancel": "取消",
        "clear": "清空",
        "clearAll": "清空所有班次",
        "import": "导入ICS文件",
        "notCompatible": "您的ICS文件与此应用不兼容。",
        "save": "保存",
        "reminder": "提醒",
        "alarmAudio": "闹钟音频",
        "alarmAudioNone": "无",
        "alarmAudioDefault": "默认",
        "selectShiftColor": "自定义颜色",
        "shiftNotFound": "没有该shift类型",
        "none": "没有班次类型",
        "addShiftType": "添加班次类型",
        "clearShift": "清空当天班次",
        "editShiftType": "编辑班次类型",
        "removeShiftType": "删除班次类型",
        "add": "添加",
        "remove": "删除",
        "edit": "编辑",
        "selectAbleTimes": ["无提醒", "提前5分钟", "提前10分钟", "提前15分钟", "提前20分钟", "提前30分钟", "提前45分钟", "提前1小时", "提前1个半小时", "提前2小时"],
        "weekNames": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "openFile": "打开文件",
        "download": "下载班表",
        "downloadNew": "下载更新的班表"

    }
};

var selectAbleTimesValue = ["", "-PT5M", "-PT10M", "-PT15M", "-PT20M", "-PT30M", "-PT45M", "-PT1H", "-PT1H30M", "-PT2H"];

var shifts = [];//班表
var oldShifts = [];//旧班表
var shiftTypeTable = [];//存放可选的shift类型
var downloaded = true;//是否已经下载了班表
var audioFile = null;//alarm的音频文件
var lang = (navigator.language || navigator.userLanguage).replace("-", "");
var language = languages[lang] || languages.en;
var monthModeHeight = "10vh";
//var adjustHeight = "inherit";
var displayMonthMode = false;
var landscape = true;
var oldLandscape = true;
// 日历div，操作div，操作div的背景遮罩，顶部信息div，中间日历显示div，班次信息编辑用div，班次类型信息编辑用div
var calendarDiv, operateDiv, operateBoxDiv, topDiv, middleDiv, shiftEditerDiv, shiftTypeEditBoxDiv;
var shiftTypeListDiv;
var addShiftTypeBt, clearShiftBt, removeShiftTypeBt, editShiftTypeBt;
var leftDiv, centerDiv, rightDiv;
var selectedDate = null;
var selectedDateD = null;
var cMonth = null;

var date = new Date();
var year = date.getFullYear();

window.onresize = function () {
    checkLandscape();
    //if (oldLandscape != landscape) {
    adjustUI();
    //}
}
//关闭前调用保存shifts和shifttable到cookie
window.onbeforeunload = function () {
    //保存shifts和shifttable到cookie
    saveRoster();
    if (shifts.length > 0 && !downloaded) {
        downloadRoster(shifts);
    }
}


//初始化
window.onload = function () {
    checkLandscape();
    //用来展示图例的div
    //读取cookie
    loadRoster();
    topDiv = document.createElement("div");
    topDiv.id = "topDiv";
    topDiv.style.display = "grid";

    topDiv.style.zIndex = "100";
    topDiv.style.position = "fixed";
    topDiv.style.top = "0";
    topDiv.style.left = "0";
    topDiv.style.width = "100vw";
    topDiv.style.height = "5vh";
    topDiv.style.gridTemplateColumns = "1fr 1fr 1fr";
    topDiv.style.gridTemplateAreas = "'left center right'";
    topDiv.style.justifyContent = "space-around";
    leftDiv = document.createElement("div");
    leftDiv.id = "leftDiv";
    leftDiv.style.gridArea = "left";
    leftDiv.style.textAlign = "left";
    leftDiv.style.alignItems = "center";
    leftDiv.style.display = "flex";
    leftDiv.style.verticalAlign = "middle";
    leftDiv.style.paddingLeft = "0.5vw";
    leftDiv.style.textShadow = "gray 0.2em 0.1em 0.2em";
    topDiv.appendChild(leftDiv);
    centerDiv = document.createElement("div");
    centerDiv.id = "centerDiv";
    centerDiv.style.gridArea = "center";
    centerDiv.style.textAlign = "center";
    centerDiv.style.alignItems = "center";
    centerDiv.style.verticalAlign = "middle";
    centerDiv.style.width = "max-content";
    centerDiv.style.textShadow = "gray 0.2em 0.1em 0.2em";
    topDiv.appendChild(centerDiv);
    rightDiv = document.createElement("div");
    rightDiv.id = "rightDiv";
    rightDiv.style.display = "flex";
    rightDiv.style.gridArea = "right";
    rightDiv.style.textAlign = "right";
    rightDiv.style.alignItems = "center";
    rightDiv.style.justifyContent = "flex-end";
    rightDiv.style.verticalAlign = "middle";
    rightDiv.style.paddingRight = "0.5vw";
    rightDiv.style.textShadow = "gray 0.2em 0.1em 0.2em";
    topDiv.appendChild(rightDiv);





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
    operateDiv.style.padding = "3vw";
    // operateDiv.style.transformOrigin = "center";
    //   border-radius: 1vw;box-shadow: rgb(0 0 0 / 75%) 2vw 2vh 2vh;
    operateDiv.style.borderRadius = "1vw";
    operateDiv.style.boxShadow = "rgb(0 0 0 / 75%) 2vw 2vh 2vh";
    operateDiv.style.transform = "translate(17.5%, 17.5%)";
    operateBoxDiv.appendChild(operateDiv);
    operateBoxDiv.addEventListener("click", function (event) {
        if (event.target.id == "operateBoxDiv") {
            operateBoxDiv.style.display = "none";
            selectedDate.style.border = "";
            centerDiv.innerHTML = "";
            pushNotes(selectedDateD.toISOString(), document.getElementById("shiftNote").value);
        }
    });
    //---------------------------------------------------------
    //构建班次信息编辑器
    shiftEditerDiv = document.createElement("div");
    shiftEditerDiv.id = "shiftEditerDiv";//用来编辑当日班次，列出所有班次类型，可以添加班次类型，删除班次类型，编辑班次类型
    shiftEditerDiv.style.position = "fixed";
    shiftEditerDiv.style.width = "inherit";
    shiftEditerDiv.style.height = "90%";
    shiftEditerDiv.style.display = " grid";
    shiftEditerDiv.style.fontSize = "5vh";
    shiftEditerDiv.style.textAlign = "center";
    // shiftEditerDiv.style.alignItems = "center";

    shiftTypeListDiv = document.createElement("div");
    shiftTypeListDiv.id = "shiftTypeListDiv";//用来列出所有班次类型
    // shiftTypeListDiv.style.display = "block";
    // shiftTypeListDiv.style.position = "fixed";
    // shiftTypeListDiv.style.zIndex = "100";
    shiftTypeListDiv.style.top = "0px";
    shiftTypeListDiv.style.left = "0px";
    shiftTypeListDiv.style.width = "inherit";
    shiftTypeListDiv.style.overflowY = "auto";
    shiftTypeListDiv.style.height = "75%";
    shiftEditerDiv.appendChild(shiftTypeListDiv);

    //addShiftTypeDiv, removeShiftTypeBt, editShiftTypeBt;
    if (shiftTypeTable === undefined) {
        shiftEditerDiv.innerHTML = language.none;
    } else {
        loadShiftType();
    }
    var shiftInfoDiv = document.createElement("div");
    // shiftInfoDiv.id = "shiftInfoDiv";  
    shiftInfoDiv.style.display = "block";
    shiftInfoDiv.style.position = "absolute";
    shiftInfoDiv.style.bottom = "0";
    //shiftInfoDiv.style.justifyContent = "space-around";
    //最小高度为5vh
    shiftInfoDiv.style.minHeight = "20vh";
    // shiftInfoDiv.style.justifyContent = "space-around";
    // shiftInfoDiv.style.alignItems = "center";
    shiftInfoDiv.style.width = "100%";
    // shiftInfoDiv.style.height = "10%";
    shiftEditerDiv.appendChild(shiftInfoDiv);
    var shiftBtDiv = shiftInfoDiv.cloneNode(true);
    var shiftNoteDiv = shiftInfoDiv.cloneNode(true);
    shiftBtDiv.style.display = "flex";
    shiftBtDiv.style.justifyContent = "space-around";
    shiftBtDiv.style.minHeight = "5vh";
    shiftBtDiv.style.top = "0";
    shiftBtDiv.style.bottom = "auto";
    shiftNoteDiv.style.top = "auto";
    shiftNoteDiv.style.minHeight = "10vh";
    shiftNoteDiv.style.display = "flex";
    shiftNoteDiv.style.justifyContent = "space-around";
    shiftInfoDiv.appendChild(shiftBtDiv);
    shiftInfoDiv.appendChild(shiftNoteDiv);
    var shiftNote = document.createElement("textarea");
    var shiftNoteLabel = document.createElement("div");
    shiftNoteLabel.innerHTML = language.description;
    shiftNoteLabel.style.textAlign = "right";
    shiftNoteLabel.style.alignItems = "center";
    shiftNoteLabel.style.verticalAlign = "middle";
    shiftNoteLabel.style.paddingLeft = "1.5vw";
    shiftNoteLabel.style.textShadow = "gray 0.2em 0.1em 0.2em";
    shiftNoteLabel.style.fontSize = "5vh";
    shiftNoteLabel.style.display = "inline-block";
    shiftNoteLabel.style.width = "15%";
    shiftNoteLabel.style.height = "auto";
    shiftNoteLabel.style.lineHeight = "10vh";
    shiftNoteDiv.appendChild(shiftNoteLabel);
    shiftNote.id = "shiftNote";
    shiftNote.style.width = "80%";
    // shiftNote.type = "text";
    shiftNoteDiv.appendChild(shiftNote);

    //添加班次类型按钮构造
    addShiftTypeBt = document.createElement("button");
    addShiftTypeBt.id = "addShiftTypeDiv";
    addShiftTypeBt.innerHTML = language.addShiftType;
    // addShiftTypeDiv.style.backgroundColor = "gray";
    // addShiftTypeDiv.style.color = "white";
    addShiftTypeBt.style.borderRadius = "1vw";
    addShiftTypeBt.style.margin = "1vw";
    addShiftTypeBt.style.padding = "1vw";
    addShiftTypeBt.style.display = "inline-block";
    addShiftTypeBt.style.textAlign = "center";
    addShiftTypeBt.style.alignItems = "center";
    // addShiftTypeDiv.style.width = "80%";
    addShiftTypeBt.style.verticalAlign = "middle";
    addShiftTypeBt.style.cursor = "pointer";
    addShiftTypeBt.style.height = "auto";
    clearShiftBt = addShiftTypeBt.cloneNode(true);

    addShiftTypeBt.addEventListener("click", function (event) {
        //添加班次类型
        shiftTypeEditBoxDiv.style.display = "block";
        centerDiv.innerHTML = language.addShiftType;
    });
    shiftBtDiv.appendChild(addShiftTypeBt);

    clearShiftBt.id = "clearShiftBt";
    clearShiftBt.innerHTML = language.clearShift;
    clearShiftBt.addEventListener("click", function (event) {
        //清空当天班次
        shifts.splice(shifts.findIndex(shift => shift.date == selectedDateD), 1);
        selectedDate.style.backgroundColor = "";
        selectedDate.style.border = "";
        operateBoxDiv.style.display = "none";
        centerDiv.innerHTML = "";
        document.getElementById("shiftNote").value = "";
    });
    shiftBtDiv.appendChild(clearShiftBt);

    operateDiv.appendChild(shiftEditerDiv);

    //--------------------------------------------------------------
    //构建班次类型编辑器
    shiftTypeEditBoxDiv = document.createElement("div");
    shiftTypeEditBoxDiv.id = "shiftTypeEditBoxDiv";//用来某个编辑班次类型具体的起止时间，颜色等内容
    shiftTypeEditBoxDiv.style.display = "none";
    shiftTypeEditBoxDiv.style.position = "fixed";
    shiftTypeEditBoxDiv.style.zIndex = "120";
    shiftTypeEditBoxDiv.style.width = "inherit";
    shiftTypeEditBoxDiv.style.height = "90%";
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
    startContainer.className = "row"
    //在start前增加一个language.start的标签
    var startLabel = document.createElement("div");
    startLabel.className = "label"
    startLabel.innerHTML = language.start;
    startContainer.appendChild(startLabel);
    //start 是一个时间选择器value 类似“08:00”
    var start = document.createElement("input");
    start.className = "content";
    start.type = "time";
    start.id = "start";
    startContainer.appendChild(start);
    contentDiv.appendChild(startContainer);

    var endContainer = document.createElement("div");
    endContainer.className = "row"
    //在end前增加一个language.end的标签
    var endLabel = document.createElement("div");
    endLabel.className = "label"
    endLabel.innerHTML = language.end;
    endContainer.appendChild(endLabel);
    //end 是一个时间选择器value 类似“17:00”
    var end = document.createElement("input");
    end.className = "content";
    end.type = "time";
    end.id = "end";
    endContainer.appendChild(end);
    contentDiv.appendChild(endContainer);

    var summaryContainer = document.createElement("div");
    summaryContainer.className = "row"
    //在summary前增加一个language.summary的标签
    var summaryLabel = document.createElement("div");
    summaryLabel.className = "label"
    summaryLabel.innerHTML = language.summary;
    summaryContainer.appendChild(summaryLabel);
    //summary 是一个文本输入框value 类似“早班”
    var summary = document.createElement("input");
    summary.className = "content";
    summary.type = "text";
    summary.id = "summary";
    summaryContainer.appendChild(summary);
    contentDiv.appendChild(summaryContainer);

    var alarmContainer = document.createElement("div");
    alarmContainer.className = "row"
    //在alarm前增加一个language.alarm的标签
    var alarmLabel = document.createElement("div");
    alarmLabel.className = "label"
    alarmLabel.innerHTML = language.alarm;
    alarmContainer.appendChild(alarmLabel);
    //alarm 是一个选择器 显示可供选择的内容 为language.selectAbleTimes。value为相应类似“-PT5M ，-PT10M ... ”
    var alarm = document.createElement("select");
    alarm.className = "content";
    alarm.id = "alarm";
    language.selectAbleTimes.forEach((time, i) => {
        const option = document.createElement("option");
        option.value = selectAbleTimesValue[i];
        option.text = time;
        alarm.appendChild(option);
    });
    alarm.value = "-PT1H";
    alarmContainer.appendChild(alarm);
    contentDiv.appendChild(alarmContainer);

    var contentForAlarmContainer = document.createElement("div");
    contentForAlarmContainer.className = "row"
    //在contentForAlarm前增加一个language.description的标签
    var contentForAlarmLabel = document.createElement("div");
    contentForAlarmLabel.className = "label"
    contentForAlarmLabel.innerHTML = language.description;
    contentForAlarmContainer.appendChild(contentForAlarmLabel);
    //contentForAlarm 是一个文本输入框value 类似“早班提醒”
    var contentForAlarm = document.createElement("input");
    contentForAlarm.className = "content";
    contentForAlarm.type = "text";
    contentForAlarm.id = "contentForAlarm";
    contentForAlarmContainer.appendChild(contentForAlarm);
    contentDiv.appendChild(contentForAlarmContainer);

    // var alarmFileContainer = document.createElement("div");
    // alarmFileContainer.className = "row"
    //在alarmFile前增加一个language.alarmAudio的标签
    // var alarmAudioLabel = document.createElement("div");
    // alarmAudioLabel.className = "label"
    // alarmAudioLabel.innerHTML = language.alarmAudio;
    // alarmFileContainer.appendChild(alarmAudioLabel);
    // //alarmSelector 是一个按钮，点击后弹出系统打开文件对话框，选择一个音频文件，返回文件名到alarmFile
    // var alarmSelector = document.createElement("button");
    // alarmSelector.className = "content";
    // alarmSelector.id = "alarmFile";
    // alarmSelector.innerHTML = language.openFile;
    // alarmSelector.addEventListener("click", function (event) {
    //     selectFile();
    // });
    // alarmFileContainer.appendChild(alarmSelector);
    // contentDiv.appendChild(alarmFileContainer);

    var colorContainer = document.createElement("div");
    colorContainer.className = "row"
    //在color前增加一个language.selectShiftColor的标签
    var colorLabel = document.createElement("div");
    colorLabel.className = "label"
    colorLabel.innerHTML = language.selectShiftColor;
    colorContainer.appendChild(colorLabel);
    //color 是一个文本框value 类似“#FF0000”，其背景色为该颜色，其文本为白色+阴影
    var color = document.createElement("input");
    color.className = "content";
    color.value = "#FF0000";
    // color.style.backgroundColor = "#FF0000";
    color.style.color = "white";
    color.style.textShadow = "gray 0.2em 0.1em 0.2em";
    color.type = "color";
    color.id = "color";
    colorContainer.appendChild(color);
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
    clear.style.width = "20%";
    clear.style.height = "70%";
    bottomDiv.appendChild(clear);

    //cancel 是一个按钮，点击后清空所有输入框，并更改shiftTypeEditBoxDiv.style.display = "none";
    var cancel = document.createElement("button");
    cancel.id = "cancel";
    cancel.innerHTML = language.cancel;
    cancel.addEventListener("click", function (event) {
        clearForm();
        shiftTypeEditBoxDiv.style.display = "none";
    });
    cancel.style.width = "20%";
    cancel.style.height = "70%";
    bottomDiv.appendChild(cancel);
    //save 是一个按钮，点击后调用函数addShiftType()，并更改shiftTypeEditBoxDiv.style.display = "none";
    var save = document.createElement("button");
    save.id = "save";
    save.innerHTML = language.create;
    save.addEventListener("click", function (event) {
        addShiftType();
        clearForm();
        shiftTypeEditBoxDiv.style.display = "none";
        loadShiftType();
    });
    save.style.width = "20%";
    save.style.height = "70%";
    bottomDiv.appendChild(save);
    operateDiv.appendChild(shiftTypeEditBoxDiv);



    //----------------------------------------------------------------
    //用来展示班次类别的div

    generateCalendar(0);
    //if (oldLandscape != landscape) {
    //adjustUI();
    // }
}
function clearForm() {
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("summary").value = "";
    document.getElementById("alarm").value = "-PT1H";
    document.getElementById("contentForAlarm").value = "";
    // document.getElementById("alarmFile").value = "";
    // document.getElementById("alarmFile").innerHTML = language.openFile;
    document.getElementById("color").value = "#ff0000";
    document.getElementById("contentDiv").dataset.id = undefined;
}
function pushNotes(date, note) {
    var existShift = shifts.find(shift => shift.date == date);
    if (existShift == undefined) {
        shifts.push({ date: date, uid: "", note: note });
        //downloaded = false;
    } else {
        existShift.note = note;
        downloaded = false;
    }
}

function loadShiftType() {

    shiftTypeListDiv.innerHTML = "";
    for (var i = 0; i < shiftTypeTable.length; i++) {
        //用来展示班次类型的div
        var shiftType = document.createElement("div");
        shiftType.id = shiftTypeTable[i].uid;
        shiftType.innerHTML = shiftTypeTable[i].summary;
        shiftType.style.backgroundColor = shiftTypeTable[i].color;
        shiftType.style.color = "white";
        // shiftType.style.borderRadius = "1vw";
        shiftType.style.margin = "1vw";
        // shiftType.style.padding = "1vw";
        // shiftType.style.display = "inline-block";
        shiftType.style.fontSize = "5vh";
        shiftType.style.textAlign = "center";
        shiftType.style.alignItems = "center";
        // shiftType.style.width = "inherit";
        // shiftType.style.height = "10vh";
        // shiftType.style.lineHeight = "10vh";
        shiftType.style.verticalAlign = "middle";
        shiftType.style.cursor = "pointer";
        shiftType.style.textShadow = "gray 0.2em 0.1em 0.2em";

        shiftType.addEventListener("click", function (event) {
            if (event.target.id == this.id) {
                //赋予当前选择日期当前的班次类型
                var existShift = shifts.find(shift => shift.date == selectedDateD.toISOString());
                //TODO:赋予当前选择日期当前的班次类型
                if (existShift == undefined) {
                    shifts.push({ date: selectedDateD.toISOString(), uid: this.id, note: document.getElementById("shiftNote").value });
                    downloaded = false;
                } else {
                    existShift.uid = this.id;
                }
                selectedDate.style.backgroundColor = this.style.backgroundColor;
                selectedDate.style.border = "";
                operateBoxDiv.style.display = "none";
                document.getElementById("shiftNote").value = "";
                centerDiv.innerHTML = "";
            }
        });
        //编辑当前的班次类型,或者删除当前的班次类型 按钮构造
        editShiftTypeBt = document.createElement("button");
        // editShiftTypeBt.style.backgroundColor = "gray";
        // editShiftTypeBt.style.color = "white";
        // editShiftTypeBt.style.borderRadius = "1vw";
        editShiftTypeBt.style.margin = "1vw";
        editShiftTypeBt.style.padding = "1vw";
        editShiftTypeBt.style.display = "inline-block";
        editShiftTypeBt.style.textAlign = "center";
        editShiftTypeBt.style.alignItems = "center";
        editShiftTypeBt.style.verticalAlign = "middle";
        editShiftTypeBt.style.cursor = "pointer";
        editShiftTypeBt.id = "editShiftTypeBt";
        removeShiftTypeBt = editShiftTypeBt.cloneNode(true);
        //编辑当前的班次类型
        editShiftTypeBt.innerHTML = language.edit;
        editShiftTypeBt.addEventListener("click", function (event) {
            editShiftTpye(event.target.parentNode.id);
            shiftTypeEditBoxDiv.style.display = "block";
            centerDiv.innerHTML = language.editShiftType;
        });
        shiftType.appendChild(editShiftTypeBt);
        //删除当前的班次类型
        removeShiftTypeBt.id = "removeShiftTypeBt";
        removeShiftTypeBt.innerHTML = language.remove;
        removeShiftTypeBt.addEventListener("click", function (event) {
            removeShiftType(shiftType.id);
            loadShiftType();
        });
        shiftType.appendChild(removeShiftTypeBt);
        shiftTypeListDiv.appendChild(shiftType);
    }
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
    //document.documentElement.clientWidth 
    // document.documentElement.clientHeight
    var whRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
    var availableRatio = [2 / 6, 3 / 4, 4 / 3, 6 / 2];
    //移动div到中间
    // operateDiv.style.transform = "translate(-50%,-50%)";
    /*  var grid = document.getElementsByClassName("grid-container");
  
      if (grid != null) {
          if (displayMonthMode) {
              grid.style.border = "0.2vw solid black";
              grid.style.borderRadius = "1vw";
              grid.style.fontSize = "XX-Large";
          } else {
              if (landscape) {
                  grid.style.fontSize = "small";
              } else {
                  grid.style.fontSize = "X-Large";
              }
          }
      }
  */
    if (whRatio < (availableRatio[0] + availableRatio[1]) / 2) {
        //2/6
        setGrid(2, 6);
    } else if (whRatio < (availableRatio[1] + availableRatio[2]) / 2) {
        //3/4
        setGrid(3, 4);
    } else if (whRatio < (availableRatio[2] + availableRatio[3] / 2)) {
        //4/3
        setGrid(4, 3);
    } else {
        //6/2
        setGrid(6, 2);
    }

}

function setGrid(col, row) {
    // monthContainer
    var mthctner = document.getElementById("monthContainer");
    if (mthctner != null) {
        mthctner.style.gridTemplateColumns = "repeat(" + col + ", 1fr)";
        mthctner.style.gridTemplateRows = "repeat(" + row + ", 1fr)";
        // mthctner.style.height=" 80%";
    }
}
function generateCalendar(displayM) {
    calendarDiv.innerHTML = "";
    // 创建 h1 元素
    const yearHeading = document.createElement("h1");
    yearHeading.id = "year";
    yearHeading.addEventListener("click", function () { if (displayMonthMode) { generateCalendar(0); } });
    // yearHeading.innerHTML = year;

    // 创建 div 元素
    const monthContainer = document.createElement("div");
    monthContainer.className = "month-container";
    monthContainer.id = "monthContainer";

    // 将元素添加到页面中的适当位置
    calendarDiv.appendChild(yearHeading);
    calendarDiv.appendChild(monthContainer);


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
    } else if (displayM === 13 && displayMonthMode) {
        if (cMonth === 11) { year++; cMonth = 0; } else { cMonth++; }
        generateMonth(year, cMonth, monthContainer);
        //yearHeading.innerHTML = year + " - " + monthNames[displayM - 1];
        monthContainer.style.display = "block";
        //monthContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(20vw, 1fr))";
    } else if (displayM === 14 && displayMonthMode) {
        if (cMonth === 0) { year--; cMonth = 11; } else { cMonth--; }
        generateMonth(year, cMonth, monthContainer);
        //yearHeading.innerHTML = year + " - " + monthNames[displayM - 1];
        monthContainer.style.display = "block";
        //monthContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(20vw, 1fr))";
    }
    //下载班表按钮
    var downloadButton = document.createElement("button");
    downloadButton.id = "downloadButton";
    downloadButton.innerHTML = language.download;
    // downloadButton.style.backgroundColor = "gray";
    // downloadButton.style.color = "white";
    // downloadButton.style.borderRadius = "1vw";
    // downloadButton.style.margin = "1vw";
    // downloadButton.style.padding = "1vw";
    downloadButton.style.display = "inline-block";
    downloadButton.style.textAlign = "center";
    downloadButton.style.alignItems = "center";
    downloadButton.style.verticalAlign = "middle";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.textShadow = "gray 0.2em 0.1em 0.2em";
    var clearButton = downloadButton.cloneNode(true);
    var importButton = downloadButton.cloneNode(true);
    downloadButton.addEventListener("click", function (event) {//仅下载当前
        downloadRoster(shifts);
    });
    downloadButton.addEventListener("dblclick", function (event) {//下载所有
        downloadRoster([...oldShifts, ...shifts]);
    });
    downloadButton.addEventListener("contextmenu", function (event) {//下载shiftType为json文件
        event.preventDefault();
        downloadShiftType(shiftTypeTable);
    });
    rightDiv.innerHTML = "";
    rightDiv.appendChild(downloadButton);
    centerDiv.innerHTML = year;
    clearButton.id = "clearButton";
    clearButton.innerHTML = language.clearAll;
    clearButton.addEventListener("click", function (event) {//clear current
        shifts = [];
        generateCalendar(0);
    });
    clearButton.addEventListener("dblclick", function (event) {//all clear
        shifts = [];
        oldShifts = [];
        generateCalendar(0);
    });
    clearButton.addEventListener("contextmenu", function (event) {//shiftType as well
        event.preventDefault();
        shiftTypeTable = [];
        shifts = [];
        oldShifts = [];
        generateCalendar(0);
    });

    leftDiv.innerHTML = "";
    leftDiv.appendChild(clearButton);
    importButton.id = "importButton";
    importButton.innerHTML = language.import;
    importButton.addEventListener("click", function (event) {//导入ics班表文件
        //打开文件对话框，只接受ics文件
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.ics';
        fileInput.onchange = function () {
            importRoster(fileInput.files[0]);
        };
        fileInput.click();

        //打开后把文件内容发给importRoster(fileContent)

    });

    importButton.addEventListener("contextmenu", function (event) {//导入json班次文件
        event.preventDefault();
        //打开文件对话框，只接受json文件
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = function () {
            importShiftType(fileInput.files[0]);
        };
        fileInput.click();
    });

    leftDiv.appendChild(importButton);
    adjustUI();

}
//拖放文件到浏览器窗口

document.addEventListener("dragenter", function (event) {
    //阻止默认动作
    event.preventDefault();
}, false);
document.addEventListener("dragover", function (event) {
    //阻止默认动作
    event.preventDefault();
}, false);
document.addEventListener("drop", function (event) {
    //阻止默认动作
    event.preventDefault();
    importRoster(event.dataTransfer.files[0]);
}, false);

//shifts = [{date: "2021-01-01T00:00:00.000Z", uid: "1"}, {date: "2021-01-02T00:00:00.000Z", uid: "2"}];
function importRoster(file) {
    //解析ics文件内容，把里面的班次信息提取出来，放到shifts里面
    var reader = new FileReader();
    reader.onload = function () {
        var content = reader.result;
        var lines = content.split("\n");
        let shift = {};
        var uidSwitch = false;
        var alarmTime = undefined;
        // 遍历每一行
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === 'BEGIN:VEVENT') { // 开始一个新的班
                shift = {};
            } else if (line === 'END:VEVENT') {// 结束当前班，将其添加到班数列中
                shifts.push(shift);
            } else if (line.startsWith('DTSTART:')) { // 提取班日期
                //提取日期并转成本地日期格式文本
                //从line的第8个字符开始取8个字符
                alarmTime = parseICSDateTime(line.substring(8));
            } else if (line.startsWith('UID:')) {// 提取班次UID
                if (uidSwitch) {
                    shift.uid = line.substring(4);
                    uidSwitch = false;
                    //fix next line:
                    var tm = shiftTypeTable.find(shiftType => shiftType.uid == shift.uid).start;
                    if (tm == undefined) return;
                    shift.date = minusTime(alarmTime, tm);
                }
            } else if (line.startsWith('BEGIN:VALARM')) {// 提取班次UID控制
                uidSwitch = true;
            } else if (line.startsWith('END:VALARM')) {// 提取班次UID控制
                uidSwitch = false;
            } else if (line.startsWith('PRODID:')) {//判断是否兼容
                if (line.substring(7) != "-//leoncoolmoon/workCalender//workCalender v1.0//EN") {
                    alert(language.notCompatible);
                    return;
                }
            } else if (line.startsWith('DESCRIPTION:')) {
                shift.note = line.substring(12);
                //去掉第一行
                var pos = shift.note.indexOf("-")
                if (pos != -1) {
                    shift.note = shift.note.substring(pos + 1);
                } else {
                    shift.note = "";
                };
            }
        }
        generateCalendar(0);
    };
    reader.readAsText(file);
}
function parseICSDateTime(dateTimeString) {
    //有bug，时间转换后不能还原原来的时间

    // 移除"T"和"Z"字符
    dateTimeString = dateTimeString.replace("T", "").replace("Z", "");

    // 将ICS日期时间字符串转换为JavaScript的Date对象
    const year = dateTimeString.substring(0, 4);
    const month = dateTimeString.substring(4, 6) - 1; // 月份从0开始，需要减去1
    const day = dateTimeString.substring(6, 8);
    const hour = dateTimeString.substring(8, 10);
    const minute = dateTimeString.substring(10, 12);
    const second = dateTimeString.substring(12, 14);

    const date = new Date(year, month, day, hour, minute, second);
    // 获取本地时区与UTC的分钟差异
    const timezoneOffset = date.getTimezoneOffset();

    // 调整时间偏移
    date.setMinutes(date.getMinutes() - timezoneOffset);
    // 返回JavaScript本地时间的ISO字符串

    return date.toISOString();
}

function generateMonth(year, month, container) {
    cMonth = month;
    var monthDiv = document.createElement("div");
    var monthTitle = document.createElement("h2");
    monthTitle.innerHTML = language.monthNames[month];
    if (displayMonthMode) {
        var next = document.createElement("button");
        next.id = "next";
        next.innerHTML = ">";
        next.style.float = "right";
        next.style.fontSize = "1.5em";
        next.style.borderRadius = "1vw";
        next.style.margin = "1vw";
        next.style.padding = "1vw";
        next.style.display = "inline-block";
        next.style.textAlign = "center";
        next.style.alignItems = "center";
        next.style.verticalAlign = "middle";
        next.style.cursor = "pointer";
        next.style.textShadow = "gray 0.2em 0.1em 0.2em";
        var previous = next.cloneNode(true);
        previous.innerHTML = "<";
        previous.id = "previous";
        previous.style.float = "left";
        monthTitle.insertAdjacentHTML('beforeend', next.outerHTML.replace("<button", "<button onclick = 'generateCalendar(13)' "));
        monthTitle.insertAdjacentHTML('afterbegin', previous.outerHTML.replace("<button", "<button onclick = 'generateCalendar(14)' "));
        // document.getElementById("previous").addEventListener("click", function (event) {
        //     if (event.target.id == "previous") {
        //         generateCalendar(month);
        //     }
        // });
        // document.getElementById("next").addEventListener("click", function (event) {
        //     if (event.target.id == "next") {
        //         generateCalendar(month + 2);
        //     }
        //});
    }

    monthDiv.appendChild(monthTitle);
    monthDiv.id = month + 1;
    if (displayMonthMode) {
        monthDiv.style.height = monthModeHeight;
        monthDiv.style.fontSize = "5em";
    } else {
        monthDiv.className = "month";
        monthDiv.style.height = "inherit";
        monthDiv.style.fontSize = "1.5em";
        monthDiv.addEventListener("click", function (event) {
            if (!displayMonthMode) {
                // if (event.target.id == this.id) {
                generateCalendar(parseInt(this.id))
                // }
            }
        });
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
        if (j == 5 || j == 6) cell.classList.add("weekend");
        if (displayMonthMode) {
            cell.style.height = monthModeHeight;
            //cell.style.fontSize = "3em";
        } else {
            cell.style.height = "inherit";
            // cell.style.fontSize = "1.5em";
        }
        cell.style.height = displayMonthMode ? monthModeHeight : "inherit";
        //cell.classList.add("weekend");
        grid.appendChild(cell);
    }
    if (displayMonthMode) {
        grid.style.border = "0.2vw solid black";
        grid.style.borderRadius = "1vw";
        grid.style.fontSize = "XX-Large";
    }
    else {
        grid.style.border = "";
        if (!landscape) {
            grid.style.fontSize = "X-Large";
        } else {
            grid.style.fontSize = "small";
        }
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
                    centerDiv.innerHTML = doubleNum(selectedDate.innerHTML) + "-" + language.monthNames[month] + "-" + year;
                    selectedDateD = new Date(year, month, parseInt(selectedDate.innerHTML));
                    document.getElementById("shiftNote").value = "";
                    var existShift = shifts.find(shift => shift.date == selectedDateD.toISOString());
                    if (existShift != undefined && existShift != -1) {
                        document.getElementById("shiftNote").value = existShift.note;
                    }
                });
                cell.style.height = monthModeHeight;
                //cell.style.fontSize = "3em";
            } else {
                cell.style.height = "inherit";
                //cell.style.fontSize = "1.5em";
            }
            if (i === 0 && j < firstDay) {
                cell.innerHTML = "";
            } else if (date > daysInMonth) {
                break;
            } else {
                var d = new Date(year, month, date).toISOString().substring(0, 10);
                var n = [...oldShifts, ...shifts].find(shift => shift.date.substring(0, 10) === d);
                var s = (n != undefined && n != -1) ? shiftTypeTable.find(shift => shift.uid == n.uid) : undefined;
                cell.style.backgroundColor = (s != undefined && s != -1) ? s.color : "";
                // if(date == 16) {
                //     cell.style.color = "red";
                // }
                if (displayMonthMode && n != undefined && n != -1 && n.note != undefined && n.note != "") {
                    cell.innerHTML = date + "<br>" + n.note;
                } else {
                    cell.innerHTML = date;
                }
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

//班次类型操作 编辑，查找，删除，添加
function editShiftTpye(uid) {//编辑班次类型
    var i = findShiftType(uid);
    if (i == undefined) {
        alert(language.shiftNotFound);
        return;
    } else {
        document.getElementById("start").value = shiftTypeTable[i].start;
        document.getElementById("end").value = rm24(shiftTypeTable[i].end);
        document.getElementById("summary").value = shiftTypeTable[i].summary;
        document.getElementById("alarm").value = shiftTypeTable[i].trigger;
        document.getElementById("contentForAlarm").value = shiftTypeTable[i].description;
        // document.getElementById("alarmFile").value = shiftTypeTable[i].audioFile;
        // document.getElementById("alarmFile").innerHTML = getName(shiftTypeTable[i].audioFile);
        document.getElementById("color").value = shiftTypeTable[i].color;
        document.getElementById("contentDiv").dataset.id = shiftTypeTable[i].uid;
    }
}

function findShiftType(uid) {//查找shift类型的index
    return shiftTypeTable.findIndex(shiftType => shiftType.uid == uid);
}

function removeShiftType(uid) {//删除shift类型
    var i = findShiftType(uid);
    if (i == undefined) {
        //alert(language.shiftNotFound);
        return;
    }
    shiftTypeTable.splice(i, 1);
}
function updateShiftType(shiftType) {//修改shift类型
    var i = findShiftType(shiftType.uid);
    if (i == undefined) {
        //alert(language.shiftNotFound);
        return;
    }
    shiftTypeTable.splice(i, 1, shiftType);
}
function add24(time) {
    var hour = parseInt(time.substring(0, 2));
    hour = hour + 24;
    return hour + time.substring(2, 5);
}
function rm24(time) {
    var hour = parseInt(time.substring(0, 2));
    if (hour < 24)
        return time;
    hour = hour - 24;
    return doubleNum(hour) + time.substring(2, 5);
}
function addShiftType() {//添加shift类型
    var shiftTpye = {};

    shiftTpye.start = document.getElementById("start").value;//shift类型所对应的开始时间
    shiftTpye.end = document.getElementById("end").value;//shift类型所对应的结束时间
    if (shiftTpye.end < shiftTpye.start) {
        shiftTpye.end = add24(shiftTpye.end);
    }
    shiftTpye.summary = document.getElementById("summary").value;//shift类型：从am，pm，night，dayoff，vacation，sick，holiday中选择或者自己输入
    shiftTpye.trigger = document.getElementById("alarm").value;//shift类型所对应的提醒时间
    shiftTpye.description = document.getElementById("contentForAlarm").value;//shift类型所对应的提醒内容
    // shiftTpye.audioFile = document.getElementById("alarmFile").value;//shift类型所对应的提醒音频文件
    shiftTpye.color = document.getElementById("color").value;//shift类型所对应的颜色
    shiftTpye.uid = document.getElementById("contentDiv").dataset.id;
    if (shiftTpye.uid == undefined || shiftTpye.uid == "" || shiftTpye.uid == null || shiftTpye.uid == "undefined") {
        shiftTpye.uid = generateUUID();
        //添加shift类型    
        shiftTypeTable.push(shiftTpye);
    } else {
        //更新shift类型
        updateShiftType(shiftTpye);
    }

}
//班次类型操作 编辑，查找，删除，添加

function selectFile() {//打开 打开文件对话框来从本地选择一个文件 返回文件名

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = "audioInput";
    //接受音频文件
    fileInput.accept = 'audio/*';
    //fileInput.accept = plainTextFile;//+ "," + STL;
    fileInput.onchange = function (event) {
        audioFile = event.target.files[0];
        var button = document.getElementById("alarmFile");
        var path = (window.URL || window.webkitURL).createObjectURL(audioFile);
        console.log('path', path);
        button.value = this.value;//系统阻止了获取文件名
        button.innerHTML = audioFile.name;

    };
    fileInput.click();

}
function getName(path) {
    var index = path.lastIndexOf("\\");
    return path.substring(index + 1, path.length);
}


function creatVALARM(trigger, description, audioFile, uid) {
    if (trigger == null || trigger == undefined || trigger == "") {
        return "";
    }
    if (description == null) {
        description = "Reminder";
    }
    var alarm = "BEGIN:VALARM\n"
        + "UID:" + uid + "\n"
        + "TRIGGER:" + trigger + "\n"
        + "ACTION:DISPLAY\n"
        + "DESCRIPTION:" + description + "\n"
        + "END:VALARM\n";
    if (audioFile != null) {
        alarm = alarm
            + "BEGIN:VALARM\n"
            + "TRIGGER:" + trigger + "\n"
            + "ACTION:AUDIO\n"
            + "ATTACH;VALUE=URI:file://" + audioFile + "\n"
            + "END:VALARM\n";
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

    // 将 符合ISO 8601标准的格式 日期对象转换为 iCalendar 日期格式
    // function formatDate(date) {
    //     function pad(n) { return n < 10 ? '0' + n : n }
    //     return date.getUTCFullYear()
    //         + pad(date.getUTCMonth() + 1)
    //         + pad(date.getUTCDate());
    // }
    // var dtstart = formatDate(start);
    // var dtend = formatDate(end);
    // var dtstamp = formatDate(created);

    // 创建 VEVENT 组件
    var vevent = "BEGIN:VEVENT\n"
        + "UID:" + uid + "\n"
        + "DTSTAMP:" + dtstamp + "\n"
        + "DTSTART:" + dtstart + "\n"
        + "DTEND:" + dtend + "\n"
        + "SUMMARY:" + summary + "\n"
        + alarm
        + "END:VEVENT";

    return vevent;
}
function createVCalendar(vevents) {
    // 创建 VCALENDAR 组件
    var vcalendar = "BEGIN:VCALENDAR\n"
        + "VERSION:2.0\n"
        + "PRODID:-//leoncoolmoon/workCalender//workCalender v1.0//EN\n"
        + vevents.join("\n")
        + "\nEND:VCALENDAR";

    return vcalendar;
}
function downloadVCalendar(vcalendar) {
    // 创建一个下载链接
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(vcalendar));
    var timeStemp = new Date().getTime();
    link.setAttribute('download', 'myShift' + timeStemp + '.ics');
    link.click();
}
function downloadShiftType(shiftTypeTable) {
    // 创建一个下载链接
    var link = document.createElement('a');
    var shiftTypeString = JSON.stringify(shiftTypeTable);
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(shiftTypeString));
    var timeStemp = new Date().getTime();
    link.setAttribute('download', 'shiftType' + timeStemp + '.json');
    link.click();
}
function importShiftType(file) {
    //解析json文件内容，把里面的班次信息提取出来，放到shiftTypeTable里面
    var reader = new FileReader();
    reader.onload = function () {
        var content = reader.result;
        var shiftTypeTableA = JSON.parse(content);
        shiftTypeTableA.forEach(shiftType => {
            var i = findShiftType(shiftType.uid);
            if (i == undefined || i == -1) {
                shiftTypeTable.push(shiftType);
            } else {
                shiftTypeTable.splice(i, 1, shiftType);
            }
        });
        loadShiftType();
    };
    reader.readAsText(file);
}

function downloadRoster(shiftsA) {
    if (shiftsA === shifts) {
        downloaded = true;
    }
    var vevents = [];
    shiftsA.forEach(shift => {
        var shiftType = shiftTypeTable.find(shiftType => shiftType.uid == shift.uid);
        if (shiftType != undefined && shiftType != -1) {
            //用shift.date和shiftType.start合成ISO 8601标准的格式字符串 
            var start = addTime(shift.date, shiftType.start);
            var end = addTime(shift.date, shiftType.end);
            var t = typeof (shiftType.start);
            //now
            var created = new Date().toISOString();
            var note = "";
            if (shift.note != undefined && shift.note != "") {
                note = "-" + shift.note;
            }
            var valarm = creatVALARM(shiftType.trigger, shiftType.description + note, shiftType.audioFile, shiftType.uid);
            if (valarm != "") {//不带提醒的班次不导出
                vevents.push(createVEvent(start, end, shiftType.summary, created, valarm));
            }
        }
    });
    var vcalendar = createVCalendar(vevents);
    downloadVCalendar(vcalendar);
}

function addTime(dateStr, timeStr) {
    // 将日期字符串解析为 Date 对象
    var date = new Date(dateStr);

    // 将时间段字符串分解为小时和分钟
    var timeParts = timeStr.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);

    // 将时间段添加到日期上
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);

    // 将新的日期对象转换回字符串
    return date.toISOString();
}
function minusTime(dateStr, timeStr) {
    // 将日期字符串解析为 Date 对象
    var date = new Date(dateStr);

    // 将时间段字符串分解为小时和分钟
    var timeParts = timeStr.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);

    // 将时间段添加到日期上
    date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() - minutes);

    // 将新的日期对象转换回字符串
    return date.toISOString();
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// 保存shifts[] 和 shiftTypeTable[]到localStorage
function saveRoster() {
    var shiftString = JSON.stringify([...oldShifts, ...shifts]);
    localStorage.setItem("shifts", shiftString);
    var shiftTypeString = JSON.stringify(shiftTypeTable);
    localStorage.setItem("shiftTypeTable", shiftTypeString);
}

// 从localStorage中读取shifts[] 和 shiftTypeTable[]
function loadRoster() {
    var shiftString = localStorage.getItem("shifts");
    if (shiftString != null) {
        oldShifts = JSON.parse(shiftString);
    }
    var shiftTypeString = localStorage.getItem("shiftTypeTable");
    if (shiftTypeString != null) {
        shiftTypeTable = JSON.parse(shiftTypeString);
    }
}
