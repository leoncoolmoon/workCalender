// ═══════════════════════════════════════════════════
//  Roster / 班表管理  v4  ·  app.js
// ═══════════════════════════════════════════════════
'use strict';

// ── i18n ──────────────────────────────────────────
const STRINGS = {
  zh: {
    appTitle:'班表', palette:'班次颜料盘', eraser:'橡皮擦（清除班次）',
    addShift:'＋ 添加班次类型',
    selected:'已选', days:'天',
    applyShift:'应用班次', clearShift:'清除班次', addNote:'添加备注', deselect:'取消全选',
    shiftName:'班次名称', startTime:'开始时间', endTime:'结束时间',
    alarmMin:'提醒（分钟前）', color:'颜色', desc:'备注',
    cancel:'取消', save:'保存',
    addShiftTitle:'添加班次', editShiftTitle:'编辑班次',
    noteTitle:'添加备注', noteLabel:'备注（多行对应多天）',
    notePlaceholder:'每行对应一个选中日期',
    namePlaceholder:'如：早班、夜班、休息…', descPlaceholder:'可选',
    ctxSwitch:'改涂为…', ctxNote:'添加备注', ctxDel:'清除班次',
    yearAll:'全年', noShifts:'暂无班次',
    noIcs:'没有含提醒的班次可导出',
    importOk:'导入成功！', importIcsOk:'ICS导入完成',
    jsonErr:'JSON格式错误：',
    deleteConfirm:'删除该班次类型？\n（已安排的日期不受影响）',
    noShiftAlert:'请先在左侧选择班次类型',
    presets:'预设：',
    settingsTheme:'主题', settingsLang:'语言', settingsFont:'字体大小',
    themeAuto:'自动', themeDark:'深色', themeLight:'浅色',
    weekdays:['一','二','三','四','五','六','日'],
    weekdaysFull:['周一','周二','周三','周四','周五','周六','周日'],
    months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    presetList:[
      {name:'早班',start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'中班',start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'晚班',start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'夜班',start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'休息',start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'年假',start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'培训',start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'调休',start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  en: {
    appTitle:'Roster', palette:'Shift Palette', eraser:'Eraser (clear shift)',
    addShift:'+ Add Shift Type',
    selected:'Selected', days:'day(s)',
    applyShift:'Apply Shift', clearShift:'Clear Shift', addNote:'Add Note', deselect:'Deselect All',
    shiftName:'Shift Name', startTime:'Start Time', endTime:'End Time',
    alarmMin:'Reminder (min before)', color:'Color', desc:'Note',
    cancel:'Cancel', save:'Save',
    addShiftTitle:'Add Shift', editShiftTitle:'Edit Shift',
    noteTitle:'Add Note', noteLabel:'Note (one line per selected day)',
    notePlaceholder:'Each line maps to one selected date',
    namePlaceholder:'e.g. Morning, Night, Day off…', descPlaceholder:'Optional',
    ctxSwitch:'Change shift to…', ctxNote:'Add note', ctxDel:'Clear shift',
    yearAll:'Full Year', noShifts:'No shifts',
    noIcs:'No shifts with reminders to export',
    importOk:'Import successful!', importIcsOk:'ICS import complete',
    jsonErr:'JSON error: ',
    deleteConfirm:'Delete this shift type?\n(Scheduled dates are not affected)',
    noShiftAlert:'Please select a shift type on the left first',
    presets:'Presets: ',
    settingsTheme:'Theme', settingsLang:'Language', settingsFont:'Font Size',
    themeAuto:'Auto', themeDark:'Dark', themeLight:'Light',
    weekdays:['M','T','W','T','F','S','S'],
    weekdaysFull:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    presetList:[
      {name:'Morning', start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'Midday',  start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'Evening', start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'Night',   start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'Day Off', start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'Leave',   start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'Training',start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'Comp',    start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  de: {
    appTitle:'Dienstplan', palette:'Schicht-Palette', eraser:'Radierer (Schicht löschen)',
    addShift:'+ Schichttyp hinzufügen',
    selected:'Ausgewählt', days:'Tag(e)',
    applyShift:'Schicht anwenden', clearShift:'Schicht löschen', addNote:'Notiz hinzufügen', deselect:'Auswahl aufheben',
    shiftName:'Schichtname', startTime:'Startzeit', endTime:'Endzeit',
    alarmMin:'Erinnerung (Min. vorher)', color:'Farbe', desc:'Notiz',
    cancel:'Abbrechen', save:'Speichern',
    addShiftTitle:'Schicht hinzufügen', editShiftTitle:'Schicht bearbeiten',
    noteTitle:'Notiz hinzufügen', noteLabel:'Notiz (eine Zeile pro Tag)',
    notePlaceholder:'Jede Zeile entspricht einem ausgewählten Datum',
    namePlaceholder:'z. B. Früh, Spät, Nacht…', descPlaceholder:'Optional',
    ctxSwitch:'Schicht ändern zu…', ctxNote:'Notiz hinzufügen', ctxDel:'Schicht löschen',
    yearAll:'Ganzes Jahr', noShifts:'Keine Schichten',
    noIcs:'Keine Schichten mit Erinnerung zum Exportieren',
    importOk:'Import erfolgreich!', importIcsOk:'ICS-Import abgeschlossen',
    jsonErr:'JSON-Fehler: ',
    deleteConfirm:'Diesen Schichttyp löschen?\n(Geplante Termine sind nicht betroffen)',
    noShiftAlert:'Bitte zuerst einen Schichttyp links auswählen',
    presets:'Vorlagen: ',
    settingsTheme:'Design', settingsLang:'Sprache', settingsFont:'Schriftgröße',
    themeAuto:'Auto', themeDark:'Dunkel', themeLight:'Hell',
    weekdays:['Mo','Di','Mi','Do','Fr','Sa','So'],
    weekdaysFull:['Mo','Di','Mi','Do','Fr','Sa','So'],
    months:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
    presetList:[
      {name:'Frühschicht', start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'Spätschicht', start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'Abendschicht',start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'Nachtschicht',start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'Frei',        start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'Urlaub',      start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'Schulung',    start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'Freizeitausgleich',start:'00:00',end:'00:00',alarm:0,color:'#6dbfa8'},
    ],
  },
  ja: {
    appTitle:'シフト表', palette:'シフトパレット', eraser:'消しゴム（シフト削除）',
    addShift:'＋ シフト種別を追加',
    selected:'選択中', days:'日',
    applyShift:'シフトを適用', clearShift:'シフトを削除', addNote:'メモを追加', deselect:'選択解除',
    shiftName:'シフト名', startTime:'開始時刻', endTime:'終了時刻',
    alarmMin:'リマインダー（分前）', color:'色', desc:'メモ',
    cancel:'キャンセル', save:'保存',
    addShiftTitle:'シフトを追加', editShiftTitle:'シフトを編集',
    noteTitle:'メモを追加', noteLabel:'メモ（1行＝1日）',
    notePlaceholder:'各行が選択した日付に対応します',
    namePlaceholder:'例：早番、遅番、夜勤…', descPlaceholder:'任意',
    ctxSwitch:'シフトを変更…', ctxNote:'メモを追加', ctxDel:'シフトを削除',
    yearAll:'年間', noShifts:'シフトなし',
    noIcs:'リマインダー付きのシフトがありません',
    importOk:'インポート成功！', importIcsOk:'ICSインポート完了',
    jsonErr:'JSONエラー：',
    deleteConfirm:'このシフト種別を削除しますか？\n（予定済みの日付には影響しません）',
    noShiftAlert:'左側でシフト種別を選択してください',
    presets:'プリセット：',
    settingsTheme:'テーマ', settingsLang:'言語', settingsFont:'文字サイズ',
    themeAuto:'自動', themeDark:'ダーク', themeLight:'ライト',
    weekdays:['月','火','水','木','金','土','日'],
    weekdaysFull:['月曜','火曜','水曜','木曜','金曜','土曜','日曜'],
    months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    presetList:[
      {name:'早番',  start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'中番',  start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'遅番',  start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'夜勤',  start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'休日',  start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'有休',  start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'研修',  start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'代休',  start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  ko: {
    appTitle:'근무표', palette:'교대 팔레트', eraser:'지우개（교대 삭제）',
    addShift:'＋ 교대 유형 추가',
    selected:'선택됨', days:'일',
    applyShift:'교대 적용', clearShift:'교대 삭제', addNote:'메모 추가', deselect:'선택 해제',
    shiftName:'교대 이름', startTime:'시작 시간', endTime:'종료 시간',
    alarmMin:'알림（분 전）', color:'색상', desc:'메모',
    cancel:'취소', save:'저장',
    addShiftTitle:'교대 추가', editShiftTitle:'교대 편집',
    noteTitle:'메모 추가', noteLabel:'메모（한 줄 = 하루）',
    notePlaceholder:'각 줄은 선택한 날짜에 해당합니다',
    namePlaceholder:'예：오전, 오후, 야간…', descPlaceholder:'선택 사항',
    ctxSwitch:'교대 변경…', ctxNote:'메모 추가', ctxDel:'교대 삭제',
    yearAll:'연간', noShifts:'교대 없음',
    noIcs:'내보낼 알림이 있는 교대가 없습니다',
    importOk:'가져오기 성공！', importIcsOk:'ICS 가져오기 완료',
    jsonErr:'JSON 오류：',
    deleteConfirm:'이 교대 유형을 삭제하시겠습니까？\n（예약된 날짜에는 영향이 없습니다）',
    noShiftAlert:'왼쪽에서 교대 유형을 먼저 선택하세요',
    presets:'프리셋：',
    settingsTheme:'테마', settingsLang:'언어', settingsFont:'글자 크기',
    themeAuto:'자동', themeDark:'다크', themeLight:'라이트',
    weekdays:['월','화','수','목','금','토','일'],
    weekdaysFull:['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
    months:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    presetList:[
      {name:'오전 근무',start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'오후 근무',start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'저녁 근무',start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'야간 근무',start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'휴일',     start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'연차',     start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'교육',     start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'대체휴가', start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  fr: {
    appTitle:'Planning', palette:'Palette de postes', eraser:'Gomme (effacer le poste)',
    addShift:'+ Ajouter un type de poste',
    selected:'Sélectionné(s)', days:'jour(s)',
    applyShift:'Appliquer le poste', clearShift:'Effacer le poste', addNote:'Ajouter une note', deselect:'Tout désélectionner',
    shiftName:'Nom du poste', startTime:'Heure de début', endTime:'Heure de fin',
    alarmMin:'Rappel (min avant)', color:'Couleur', desc:'Note',
    cancel:'Annuler', save:'Enregistrer',
    addShiftTitle:'Ajouter un poste', editShiftTitle:'Modifier le poste',
    noteTitle:'Ajouter une note', noteLabel:'Note (une ligne par jour sélectionné)',
    notePlaceholder:'Chaque ligne correspond à une date sélectionnée',
    namePlaceholder:'ex : Matin, Soir, Nuit…', descPlaceholder:'Facultatif',
    ctxSwitch:'Changer le poste en…', ctxNote:'Ajouter une note', ctxDel:'Effacer le poste',
    yearAll:'Année entière', noShifts:'Aucun poste',
    noIcs:'Aucun poste avec rappel à exporter',
    importOk:'Importation réussie !', importIcsOk:'Importation ICS terminée',
    jsonErr:'Erreur JSON : ',
    deleteConfirm:'Supprimer ce type de poste ?\n(Les dates planifiées ne sont pas affectées)',
    noShiftAlert:'Veuillez d\'abord sélectionner un type de poste à gauche',
    presets:'Modèles : ',
    settingsTheme:'Thème', settingsLang:'Langue', settingsFont:'Taille police',
    themeAuto:'Auto', themeDark:'Sombre', themeLight:'Clair',
    weekdays:['L','M','M','J','V','S','D'],
    weekdaysFull:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    months:['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'],
    presetList:[
      {name:'Matin',   start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'Journée', start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'Soir',    start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'Nuit',    start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'Repos',   start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'Congé',   start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'Formation',start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'Récup',   start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  it: {
    appTitle:'Turni', palette:'Palette turni', eraser:'Gomma (cancella turno)',
    addShift:'+ Aggiungi tipo di turno',
    selected:'Selezionato/i', days:'giorno/i',
    applyShift:'Applica turno', clearShift:'Cancella turno', addNote:'Aggiungi nota', deselect:'Deseleziona tutto',
    shiftName:'Nome turno', startTime:'Ora inizio', endTime:'Ora fine',
    alarmMin:'Promemoria (min prima)', color:'Colore', desc:'Nota',
    cancel:'Annulla', save:'Salva',
    addShiftTitle:'Aggiungi turno', editShiftTitle:'Modifica turno',
    noteTitle:'Aggiungi nota', noteLabel:'Nota (una riga per giorno selezionato)',
    notePlaceholder:'Ogni riga corrisponde a una data selezionata',
    namePlaceholder:'es: Mattina, Sera, Notte…', descPlaceholder:'Facoltativo',
    ctxSwitch:'Cambia turno in…', ctxNote:'Aggiungi nota', ctxDel:'Cancella turno',
    yearAll:'Anno intero', noShifts:'Nessun turno',
    noIcs:'Nessun turno con promemoria da esportare',
    importOk:'Importazione riuscita!', importIcsOk:'Importazione ICS completata',
    jsonErr:'Errore JSON: ',
    deleteConfirm:'Eliminare questo tipo di turno?\n(Le date pianificate non sono interessate)',
    noShiftAlert:'Seleziona prima un tipo di turno a sinistra',
    presets:'Modelli: ',
    settingsTheme:'Tema', settingsLang:'Lingua', settingsFont:'Dimensione testo',
    themeAuto:'Auto', themeDark:'Scuro', themeLight:'Chiaro',
    weekdays:['L','M','M','G','V','S','D'],
    weekdaysFull:['Lun','Mar','Mer','Gio','Ven','Sab','Dom'],
    months:['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
    presetList:[
      {name:'Mattina', start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'Pomeriggio',start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'Sera',    start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'Notte',   start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'Riposo',  start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'Ferie',   start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'Formazione',start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'Recupero',start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  ru: {
    appTitle:'Расписание', palette:'Палитра смен', eraser:'Ластик (удалить смену)',
    addShift:'+ Добавить тип смены',
    selected:'Выбрано', days:'дн.',
    applyShift:'Применить смену', clearShift:'Удалить смену', addNote:'Добавить заметку', deselect:'Снять выделение',
    shiftName:'Название смены', startTime:'Время начала', endTime:'Время окончания',
    alarmMin:'Напоминание (мин до)', color:'Цвет', desc:'Заметка',
    cancel:'Отмена', save:'Сохранить',
    addShiftTitle:'Добавить смену', editShiftTitle:'Редактировать смену',
    noteTitle:'Добавить заметку', noteLabel:'Заметка (одна строка = один день)',
    notePlaceholder:'Каждая строка соответствует выбранной дате',
    namePlaceholder:'напр.: Утро, День, Ночь…', descPlaceholder:'Необязательно',
    ctxSwitch:'Изменить смену на…', ctxNote:'Добавить заметку', ctxDel:'Удалить смену',
    yearAll:'Весь год', noShifts:'Нет смен',
    noIcs:'Нет смен с напоминаниями для экспорта',
    importOk:'Импорт выполнен!', importIcsOk:'Импорт ICS завершён',
    jsonErr:'Ошибка JSON: ',
    deleteConfirm:'Удалить этот тип смены?\n(Запланированные даты не затронуты)',
    noShiftAlert:'Сначала выберите тип смены слева',
    presets:'Шаблоны: ',
    settingsTheme:'Тема', settingsLang:'Язык', settingsFont:'Размер шрифта',
    themeAuto:'Авто', themeDark:'Тёмная', themeLight:'Светлая',
    weekdays:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    weekdaysFull:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    months:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    presetList:[
      {name:'Утро',     start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'День',     start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'Вечер',    start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'Ночь',     start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'Выходной', start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'Отпуск',   start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
      {name:'Обучение', start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'Отгул',    start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
    ],
  },
  th: {
    appTitle:'ตารางเวร', palette:'จานสี', eraser:'ยางลบ (ลบเวร)',
    addShift:'+ เพิ่มประเภทเวร',
    selected:'เลือกแล้ว', days:'วัน',
    applyShift:'ใช้เวร', clearShift:'ลบเวร', addNote:'เพิ่มหมายเหตุ', deselect:'ยกเลิกการเลือก',
    shiftName:'ชื่อเวร', startTime:'เวลาเริ่ม', endTime:'เวลาสิ้นสุด',
    alarmMin:'แจ้งเตือน (นาทีก่อน)', color:'สี', desc:'หมายเหตุ',
    cancel:'ยกเลิก', save:'บันทึก',
    addShiftTitle:'เพิ่มเวร', editShiftTitle:'แก้ไขเวร',
    noteTitle:'เพิ่มหมายเหตุ', noteLabel:'หมายเหตุ (หนึ่งบรรทัดต่อหนึ่งวัน)',
    notePlaceholder:'แต่ละบรรทัดตรงกับวันที่เลือก',
    namePlaceholder:'เช่น เช้า บ่าย ดึก…', descPlaceholder:'ไม่บังคับ',
    ctxSwitch:'เปลี่ยนเวรเป็น…', ctxNote:'เพิ่มหมายเหตุ', ctxDel:'ลบเวร',
    yearAll:'ทั้งปี', noShifts:'ไม่มีเวร',
    noIcs:'ไม่มีเวรที่มีการแจ้งเตือนสำหรับส่งออก',
    importOk:'นำเข้าสำเร็จ!', importIcsOk:'นำเข้า ICS เสร็จสมบูรณ์',
    jsonErr:'ข้อผิดพลาด JSON: ',
    deleteConfirm:'ลบประเภทเวรนี้?\n(วันที่กำหนดไว้ไม่ได้รับผลกระทบ)',
    noShiftAlert:'กรุณาเลือกประเภทเวรทางด้านซ้ายก่อน',
    presets:'พรีเซต: ',
    settingsTheme:'ธีม', settingsLang:'ภาษา', settingsFont:'ขนาดตัวอักษร',
    themeAuto:'อัตโนมัติ', themeDark:'มืด', themeLight:'สว่าง',
    weekdays:['จ','อ','พ','พฤ','ศ','ส','อา'],
    weekdaysFull:['จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์','เสาร์','อาทิตย์'],
    months:['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'],
    presetList:[
      {name:'เวรเช้า',  start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
      {name:'เวรบ่าย', start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
      {name:'เวรเย็น', start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
      {name:'เวรดึก',  start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
      {name:'วันหยุด', start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
      {name:'ลาพักร้อน',start:'00:00',end:'00:00',alarm:0,color:'#e8c34f'},
      {name:'อบรม',    start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
      {name:'วันทดแทน',start:'00:00',end:'00:00',alarm:0,color:'#6dbfa8'},
    ],
  },
};

let lang = 'zh'; // set properly in init
function t(key) { return (STRINGS[lang] || STRINGS.zh)[key] ?? key; }

function applyI18n() {
  document.title = t('appTitle');
  document.documentElement.lang = lang;
  // data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  // Placeholders
  get('fName').placeholder = t('namePlaceholder');
  get('fDesc').placeholder = t('descPlaceholder');
  get('noteText').placeholder = t('notePlaceholder');
  // Eraser btn rebuilds its icon
  get('eraserIcon').textContent = eraserOn ? '◼' : '◻';
  // Refresh theme button label in current language
  applyTheme();
}

// ── Theme ─────────────────────────────────────────
let theme = 'auto'; // 'auto' | 'dark' | 'light'

function applyTheme() {
  const root = document.documentElement;
  if (theme === 'auto') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
  const isDark = theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const btn = get('themeBtn');
  if (btn) {
    const icon = isDark ? '☀️' : '🌙';
    const label = t(theme === 'dark' ? 'themeDark' : theme === 'light' ? 'themeLight' : 'themeAuto');
    btn.innerHTML = icon + ' <span id="themeBtnLabel">' + label + '</span>';
  }
  try { localStorage.setItem('wc3_theme', theme); } catch(e) {}
}

function cycleTheme() {
  // auto → dark → light → auto
  theme = theme === 'auto' ? 'dark' : theme === 'dark' ? 'light' : 'auto';
  applyTheme();
}

// ── State ──────────────────────────────────────────
let shifts   = [];   // [{uid,name,start,end,alarm,color,desc}]
let roster   = {};   // {'YYYY-MM-DD':{uid?,note?}}
let yr       = new Date().getFullYear();
let mo       = null; // null=year, 0-11=month
let brush    = null; // selected shift uid
let eraserOn = false;
let selDates = new Set();
let editUid  = null;
let ctxKey   = null;
let ptrDown  = false;
let didDrag  = false;

// ── Storage ────────────────────────────────────────
const save = () => {
  try {
    localStorage.setItem('wc3_shifts', JSON.stringify(shifts));
    localStorage.setItem('wc3_roster', JSON.stringify(roster));
  } catch(e) {}
};
const load = () => {
  try {
    const s = localStorage.getItem('wc3_shifts');
    const r = localStorage.getItem('wc3_roster');
    if (s) shifts = JSON.parse(s);
    if (r) roster = JSON.parse(r);
    // Theme
    const th = localStorage.getItem('wc3_theme');
    if (th) theme = th;
    // Language: saved preference > browser language
    const ln = localStorage.getItem('wc3_lang');
    if (ln) { lang = ln; }
    else {
      const bl = (navigator.language || 'zh').toLowerCase();
      const langMap = [
        ['zh', 'zh'], ['ja', 'ja'], ['ko', 'ko'],
        ['de', 'de'], ['fr', 'fr'], ['it', 'it'],
        ['ru', 'ru'], ['th', 'th'],
      ];
      lang = (langMap.find(([prefix]) => bl.startsWith(prefix)) || ['', 'en'])[1];
    }
  } catch(e) {}
};

// ── Utils ──────────────────────────────────────────
const genUid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const dk      = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const todayK  = () => { const t2=new Date(); return dk(t2.getFullYear(),t2.getMonth(),t2.getDate()); };
const byUid   = u => shifts.find(s=>s.uid===u);
const get     = id => document.getElementById(id);
const mk      = (tag,cls) => { const e=document.createElement(tag); if(cls)e.className=cls; return e; };
const esc     = s => { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; };
const alarmV  = min => {
  const map={0:'',5:'-PT5M',10:'-PT10M',15:'-PT15M',20:'-PT20M',30:'-PT30M',45:'-PT45M',60:'-PT1H',90:'-PT1H30M',120:'-PT2H'};
  const keys=Object.keys(map).map(Number).sort((a,b)=>a-b);
  let best=0; keys.forEach(k=>{ if(k<=Number(min)) best=k; });
  return map[best];
};

// ── Eraser / Brush ────────────────────────────────
function setEraser(on) {
  eraserOn=on; if(on) brush=null;
  get('eraserBtn').classList.toggle('on', eraserOn);
  get('eraserIcon').textContent = eraserOn ? '◼' : '◻';
  renderPalette();
}
function setBrush(uid) {
  if(eraserOn) setEraser(false);
  brush = (brush===uid) ? null : uid;
  renderPalette();
}

// ── Palette ───────────────────────────────────────
function renderPalette() {
  const list=get('shiftList'); list.innerHTML='';
  shifts.forEach(st=>{
    const chip=mk('div','chip'+(st.uid===brush&&!eraserOn?' on':''));
    chip.dataset.uid=st.uid;
    chip.innerHTML=`
      <div class="chip-dot" style="background:${st.color}"></div>
      <div style="flex:1;min-width:0">
        <div class="chip-name">${esc(st.name)}</div>
        <div class="chip-time">${st.start} – ${st.end}</div>
      </div>
      <div class="chip-acts">
        <button class="chip-act ed" title="Edit">✏</button>
        <button class="chip-act"    title="Delete">✕</button>
      </div>`;
    chip.addEventListener('click', e=>{
      if(e.target.closest('.chip-act.ed')){ openShiftModal(st.uid); return; }
      if(e.target.closest('.chip-act'))   { removeShift(st.uid); return; }
      setBrush(st.uid);
    });
    list.appendChild(chip);
  });
}

function removeShift(u) {
  if(!confirm(t('deleteConfirm'))) return;
  shifts=shifts.filter(s=>s.uid!==u);
  if(brush===u) brush=null;
  save(); renderPalette(); renderCalendar();
}

// ── Shift Modal ───────────────────────────────────
function openShiftModal(u) {
  editUid=u||null; const st=u?byUid(u):null;
  get('smTitle').textContent = st ? t('editShiftTitle') : t('addShiftTitle');
  get('fName').value  = st?.name  ?? '';
  get('fStart').value = st?.start ?? '08:00';
  get('fEnd').value   = st?.end   ?? '16:00';
  get('fAlarm').value = st?.alarm ?? 30;
  get('fColor').value = st?.color ?? '#4f8ef7';
  get('fDesc').value  = st?.desc  ?? '';
  buildTmpls();
  get('shiftModal').classList.add('open');
  setTimeout(()=>get('fName').focus(), 40);
}
function closeShiftModal(){ get('shiftModal').classList.remove('open'); editUid=null; }
function saveShiftModal(){
  const name=get('fName').value.trim(); if(!name){ get('fName').focus(); return; }
  const data={uid:editUid||genUid(), name,
    start:get('fStart').value, end:get('fEnd').value,
    alarm:Number(get('fAlarm').value), color:get('fColor').value, desc:get('fDesc').value.trim()};
  if(editUid){ const i=shifts.findIndex(s=>s.uid===editUid); if(i>=0) shifts[i]=data; }
  else { shifts.push(data); brush=data.uid; eraserOn=false; }
  save(); closeShiftModal(); renderPalette(); renderCalendar();
}
function buildTmpls(){
  const el2=get('tmplList'); el2.innerHTML=`<span style="font-size:10px;color:var(--text2)">${t('presets')}</span>`;
  t('presetList').forEach(p=>{
    const b=mk('button','tmpl'); b.textContent=p.name;
    b.onclick=()=>{ get('fName').value=p.name; get('fStart').value=p.start;
      get('fEnd').value=p.end; get('fAlarm').value=p.alarm; get('fColor').value=p.color; };
    el2.appendChild(b);
  });
}

// ── Selection ─────────────────────────────────────
function toggleSel(k,cell){
  if(selDates.has(k)){ selDates.delete(k); cell?.classList.remove('sel'); }
  else               { selDates.add(k);    cell?.classList.add('sel'); }
  updSelBar();
}
function addSel(k){
  selDates.add(k);
  document.querySelectorAll(`[data-key="${k}"]`).forEach(c=>c.classList.add('sel'));
  updSelBar();
}
function updSelBar(){
  const n=selDates.size; get('selCount').textContent=n;
  get('selBar').classList.toggle('vis', n>0);
}
function deselectAll(){
  selDates.clear();
  document.querySelectorAll('.sel').forEach(c=>c.classList.remove('sel'));
  updSelBar();
}
function applyToSel(){
  if(!brush){ alert(t('noShiftAlert')); return; }
  selDates.forEach(k=>paint(k));
  deselectAll(); save(); renderCalendar();
}
function clearSel(){
  selDates.forEach(k=>erase(k));
  deselectAll(); save(); renderCalendar();
}

// ── Paint / Erase ─────────────────────────────────
function paint(k){ if(!roster[k])roster[k]={}; roster[k].uid=brush; }
function erase(k){ if(!roster[k])return; delete roster[k].uid; if(!roster[k].note)delete roster[k]; }

function liveColor(cell, k) {
  const ro=roster[k], st=ro&&ro.uid?byUid(ro.uid):null;
  const big=cell.classList.contains('big');
  if(st){
    cell.style.background=st.color+(big?'cc':'bb');
    cell.classList.add('painted');
    if(big){
      cell.style.borderColor='transparent';
      const ns=cell.querySelector('.dc-shift');
      if(ns) ns.textContent=st.name;
      else { const n=mk('div','dc-shift'); n.textContent=st.name; cell.appendChild(n); }
    }
  } else {
    cell.style.background=''; cell.style.borderColor='';
    cell.classList.remove('painted');
    cell.querySelector('.dc-shift')?.remove();
  }
}

// ── Pointer Events ────────────────────────────────
function initPointerDrag(container) {
  let downKey=null;

  container.addEventListener('pointerdown', e=>{
    if(e.button!==0&&e.pointerType==='mouse') return;
    const cell=e.target.closest('[data-key]'); if(!cell) return;
    ptrDown=true; didDrag=false; downKey=cell.dataset.key;
    container.setPointerCapture(e.pointerId);
    e.preventDefault();
    // Act immediately on the start cell
    const k=downKey;
    if(eraserOn){ erase(k); liveColor(cell,k); }
    else if(brush){ paint(k); liveColor(cell,k); addSel(k); }
  });

  container.addEventListener('pointermove', e=>{
    if(!ptrDown) return;
    const el2=document.elementFromPoint(e.clientX,e.clientY);
    const cell=el2&&el2.closest('[data-key]'); if(!cell) return;
    const k=cell.dataset.key;
    if(k===downKey) return; // already handled in pointerdown
    didDrag=true;
    if(eraserOn){ erase(k); liveColor(cell,k); }
    else if(brush){ paint(k); liveColor(cell,k); addSel(k); }
  });

  container.addEventListener('pointerup', e=>{
    if(!ptrDown) return;
    ptrDown=false;
    if(didDrag){
      save(); renderCalendar();
    } else {
      const cell=e.target.closest('[data-key]'); if(!cell) return;
      const k=cell.dataset.key;
      if(eraserOn||brush){
        save(); renderCalendar();
      } else {
        toggleSel(k,cell);
      }
    }
    didDrag=false; downKey=null;
  });

  container.addEventListener('pointercancel',()=>{ ptrDown=false; didDrag=false; downKey=null; });
}

// ── Calendar ──────────────────────────────────────
function renderCalendar(){
  renderNav();
  const td=todayK();
  if(mo===null) renderYear(td);
  else          renderMonth(td);
  renderStats();
}

function renderNav(){
  get('yearLabel').textContent=yr;
  get('monthLabel').textContent = mo!==null ? t('months')[mo] : t('yearAll');
  const c=get('monthBtns'); c.innerHTML='';
  const ab=mk('button','mbtn'+(mo===null?' on':'')); ab.textContent=t('yearAll');
  ab.onclick=()=>{mo=null;renderCalendar();}; c.appendChild(ab);
  for(let i=0;i<12;i++){
    const b=mk('button','mbtn'+(mo===i?' on':''));
    b.textContent=t('months')[i]; b.onclick=()=>{mo=i;renderCalendar();}; c.appendChild(b);
  }
}

// ── Year view ─────────────────────────────────────
function renderYear(td){
  get('yearGrid').style.display='grid';
  get('singleMonth').style.display='none';
  const g=get('yearGrid'); g.innerHTML='';
  for(let m=0;m<12;m++) g.appendChild(buildMini(yr,m,td));
  g.querySelectorAll('.day-grid').forEach(dg=>initPointerDrag(dg));
  g.querySelectorAll('[data-key]').forEach(attachCtx);
}

function buildMini(y,m,td){
  const wrap=mk('div','mini-month');
  const hdr=mk('div','mini-hdr');
  hdr.innerHTML=`<span>${t('months')[m]}</span>`; hdr.appendChild(buildTally(y,m));
  hdr.onclick=()=>{mo=m;renderCalendar();}; wrap.appendChild(hdr);
  const wh=mk('div','wk-hdr');
  t('weekdays').forEach(w=>{ const s=document.createElement('span'); s.textContent=w; wh.appendChild(s); });
  wrap.appendChild(wh);
  const dg=mk('div','day-grid');
  const off=(new Date(y,m,1).getDay()+6)%7, dim=new Date(y,m+1,0).getDate();
  for(let i=0;i<off;i++) dg.appendChild(mk('div','dc other'));
  for(let d=1;d<=dim;d++) dg.appendChild(buildCell(y,m,d,td,false));
  wrap.appendChild(dg); return wrap;
}

function buildTally(y,m){
  const wrap=mk('div','tally'), cnts={}, pfx=`${y}-${String(m+1).padStart(2,'0')}-`;
  Object.entries(roster).forEach(([k,v])=>{ if(k.startsWith(pfx)&&v.uid) cnts[v.uid]=(cnts[v.uid]||0)+1; });
  Object.entries(cnts).forEach(([u,c])=>{
    const st=byUid(u); if(!st)return;
    const b=mk('span','tb'); b.style.background=st.color; b.textContent=`${st.name}×${c}`; wrap.appendChild(b);
  });
  return wrap;
}

// ── Month view ────────────────────────────────────
function renderMonth(td){
  get('yearGrid').style.display='none';
  get('singleMonth').style.display='block';
  const wh=get('bigWkHdr'); wh.innerHTML='';
  t('weekdaysFull').forEach(w=>{ const s=document.createElement('span'); s.textContent=w; wh.appendChild(s); });
  const g=get('bigDayGrid'); g.innerHTML='';
  const y=yr, m=mo;
  const off=(new Date(y,m,1).getDay()+6)%7, dim=new Date(y,m+1,0).getDate();
  for(let i=0;i<off;i++){ const c=mk('div','dc big other'); g.appendChild(c); }
  for(let d=1;d<=dim;d++) g.appendChild(buildCell(y,m,d,td,true));
  initPointerDrag(g);
  g.querySelectorAll('[data-key]').forEach(attachCtx);
}

// ── Unified cell builder ──────────────────────────
function buildCell(y,m,d,td,big){
  const k=dk(y,m,d), ro=roster[k], st=ro&&ro.uid?byUid(ro.uid):null;
  const wd=(new Date(y,m,d).getDay()+6)%7;
  const cls=['dc',
    big?'big':'', wd>=5?'wknd':'', k===td?'today':'',
    st?'painted':'', selDates.has(k)?'sel':'',
  ].filter(Boolean).join(' ');
  const c=mk('div',cls); c.dataset.key=k;
  if(st){ c.style.background=st.color+(big?'cc':'bb'); if(big)c.style.borderColor='transparent'; }
  const num=mk('div','dc-num'); num.textContent=d; c.appendChild(num);
  if(st&&big){ const n=mk('div','dc-shift'); n.textContent=st.name; c.appendChild(n); }
  if(ro?.note&&big){ const n=mk('div','dc-note'); n.textContent=ro.note; c.appendChild(n); }
  return c;
}

// ── Context menu ──────────────────────────────────
function attachCtx(cell){
  cell.addEventListener('contextmenu', e=>{
    e.preventDefault(); ctxKey=cell.dataset.key;
    buildCtxShifts();
    const ro=roster[ctxKey];
    get('ctxSwitch').style.display=(ro&&ro.uid)?'flex':'none';
    get('ctxShifts').style.display='none';
    showCtx(e.clientX, e.clientY);
  });
}
function buildCtxShifts(){
  const c=get('ctxShifts'); c.innerHTML='';
  shifts.forEach(st=>{
    const item=mk('div','ci');
    item.innerHTML=`<span style="width:8px;height:8px;border-radius:2px;background:${st.color};display:inline-block;flex-shrink:0"></span> ${esc(st.name)}`;
    item.onclick=()=>{
      if(ctxKey){ if(!roster[ctxKey])roster[ctxKey]={}; roster[ctxKey].uid=st.uid; save(); renderCalendar(); }
      hideCtx();
    };
    c.appendChild(item);
  });
}
function showCtx(x,y){
  const m=get('ctx');
  m.style.display='block';
  m.style.left=Math.min(x,window.innerWidth-170)+'px';
  m.style.top=Math.min(y,window.innerHeight-200)+'px';
}
function hideCtx(){ get('ctx').style.display='none'; }

// ── Stats ─────────────────────────────────────────
function renderStats(){
  const bar=get('statsBar'); bar.innerHTML='';
  const pfx=mo!==null?`${yr}-${String(mo+1).padStart(2,'0')}-`:`${yr}-`;
  const cnts={};
  Object.entries(roster).forEach(([k,v])=>{ if(k.startsWith(pfx)&&v.uid) cnts[v.uid]=(cnts[v.uid]||0)+1; });
  if(!Object.keys(cnts).length){
    const em=mk('span'); em.style.cssText='font-size:11px;color:var(--text2)';
    em.textContent=t('noShifts'); bar.appendChild(em); return;
  }
  Object.entries(cnts).forEach(([u,c])=>{
    const st=byUid(u); if(!st)return;
    const b=mk('div','stat');
    b.innerHTML=`<div class="stat-dot" style="background:${st.color}"></div><span>${esc(st.name)}: ${c} ${t('days')}</span>`;
    bar.appendChild(b);
  });
}

// ── Note modal ────────────────────────────────────
function openNote(){
  const dates=[...selDates]; if(!dates.length)return;
  get('noteText').value=dates.map(k=>(roster[k]&&roster[k].note)||'').join('\n');
  get('noteModal').classList.add('open'); setTimeout(()=>get('noteText').focus(),40);
}
function closeNote(){ get('noteModal').classList.remove('open'); }
function saveNote(){
  const lines=get('noteText').value.split('\n');
  [...selDates].forEach((k,i)=>{
    if(!roster[k])roster[k]={};
    roster[k].note=lines[i]!==undefined?lines[i]:'';
    if(!roster[k].uid&&!roster[k].note)delete roster[k];
  });
  save(); closeNote(); renderCalendar();
}

// ── JSON export / import ──────────────────────────
function exportJson(){
  const enriched={};
  Object.entries(roster).forEach(([k,v])=>{
    const st=v.uid?byUid(v.uid):null;
    enriched[k]={uid:v.uid||null,note:v.note||null,
      shiftName:st?st.name:null,shiftStart:st?st.start:null,
      shiftEnd:st?st.end:null,shiftColor:st?st.color:null};
  });
  dl(JSON.stringify({version:4,exportedAt:new Date().toISOString(),shifts,roster:enriched},null,2),
     'application/json','roster_'+todayK()+'.json');
}
// Convert any CSS color string to #rrggbb for <input type="color"> compatibility
function toHex(color) {
  if (!color) return '#4f8ef7';
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return color;
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    const c = ctx.fillStyle; // browser normalises to #rrggbb or rgb(...)
    return /^#/.test(c) ? c : color;
  } catch(e) { return color; }
}

function importJson(file){
  readF(file, txt=>{
    try{
      const data=JSON.parse(txt);
      if(data.shifts){
        // Merge shifts: keep existing definitions intact, only add truly new ones
        data.shifts.forEach(s=>{
          const existing = shifts.find(e=>e.uid===s.uid);
          if(!existing){
            // New shift uid — import it (normalize color for color-picker compat)
            shifts.push({
              uid:   s.uid   || genUid(),
              name:  s.name  || '?',
              start: s.start || '00:00',
              end:   s.end   || '00:00',
              alarm: s.alarm ?? 0,
              color: toHex(s.color),
              desc:  s.desc  || '',
            });
          }
          // Existing uid — silently skip; local definition (color, name…) wins
        });
      }
      if(data.roster){
        const clean={};
        Object.entries(data.roster).forEach(([k,v])=>{
          const entry={uid:v.uid||undefined, note:v.note||undefined};
          if(entry.uid||entry.note) clean[k]=entry;
        });
        Object.assign(roster, clean);
      }
      save(); renderPalette(); renderCalendar(); alert(t('importOk'));
    }catch(e){ alert(t('jsonErr')+e.message); }
  });
}

// ── ICS export ────────────────────────────────────
function exportIcs(){
  const pad=n=>n<10?'0'+n:''+n;
  const fmtLocal=(y,m,d,h,min)=>`${y}${pad(m+1)}${pad(d)}T${pad(h)}${pad(min)}00`;
  const fmtUTC=dt=>dt.getUTCFullYear()+pad(dt.getUTCMonth()+1)+pad(dt.getUTCDate())+
    'T'+pad(dt.getUTCHours())+pad(dt.getUTCMinutes())+'00Z';
  const ev=[];
  Object.entries(roster).forEach(([k,v])=>{
    if(!v.uid)return; const st=byUid(v.uid); if(!st||!st.alarm)return;
    const y=+k.slice(0,4), m=+k.slice(5,7)-1, d=+k.slice(8,10);
    const [sh,sm]=st.start.split(':').map(Number);
    const [eh,em]=st.end.split(':').map(Number);
    let ey=y, em2=m, ed=d;
    if(eh<sh||(eh===sh&&em<=sm)){
      const tmp=new Date(y,m,d+1); ey=tmp.getFullYear(); em2=tmp.getMonth(); ed=tmp.getDate();
    }
    const dtStart=fmtLocal(y,m,d,sh,sm), dtEnd=fmtLocal(ey,em2,ed,eh,em);
    const tr=alarmV(st.alarm), note=v.note?'-'+v.note:'';
    const alarm=tr?`BEGIN:VALARM\nTRIGGER:${tr}\nACTION:DISPLAY\nDESCRIPTION:${st.name}${note}\nEND:VALARM\n`:'';
    ev.push(`BEGIN:VEVENT\nUID:${genUid()}@workcal\nDTSTAMP:${fmtUTC(new Date())}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:${st.name}${note}\n${alarm}END:VEVENT`);
  });
  if(!ev.length){ alert(t('noIcs')); return; }
  dl('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WorkCal//v4//ZH\n'+ev.join('\n')+'\nEND:VCALENDAR',
     'text/calendar','roster_'+todayK()+'.ics');
}

// ── ICS import ────────────────────────────────────
function importIcs(file){
  readF(file, txt=>{
    const lines=txt.split(/\r?\n/); let inEv=false,dtstart=null,summary=null;
    lines.forEach(raw=>{
      const l=raw.trim();
      if(l==='BEGIN:VEVENT'){inEv=true;dtstart=null;summary=null;}
      else if(l==='END:VEVENT'){
        if(dtstart&&summary){
          const st=shifts.find(s=>s.name===summary||summary.startsWith(s.name));
          if(st){ if(!roster[dtstart])roster[dtstart]={}; roster[dtstart].uid=st.uid; }
        }
        inEv=false;
      } else if(inEv){
        if(l.startsWith('DTSTART:')){
          const p=l.slice(8).replace('Z','').replace('T','').slice(0,8);
          dtstart=`${p.slice(0,4)}-${p.slice(4,6)}-${p.slice(6,8)}`;
        } else if(l.startsWith('SUMMARY:')) summary=l.slice(8);
      }
    });
    save(); renderCalendar(); alert(t('importIcsOk'));
  });
}

// ── Helpers ───────────────────────────────────────
function dl(content,type,name){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),3000);
}
function readF(file,cb){ const r=new FileReader(); r.onload=()=>cb(r.result); r.readAsText(file); }

// ── Font size ─────────────────────────────────────
function applyFontSize(v) {
  document.documentElement.style.setProperty('--cell-fs', v);
  const sl = get('fsSlid'); if(sl) sl.value = v;
  try{ localStorage.setItem('wc3_fs', v); }catch(e){}
}

// ── Init ──────────────────────────────────────────
window.onload=()=>{
  load();

  // Apply theme & language immediately
  applyTheme();
  get('langSel').value=lang;
  applyI18n();

  // Theme button
  get('themeBtn').onclick=()=>{ cycleTheme(); };
  // Font size slider
  const fsSlid = get('fsSlid');
  const savedFs = localStorage.getItem('wc3_fs');
  if(savedFs) applyFontSize(savedFs); // sets both CSS var and slider value
  fsSlid.addEventListener('input', ()=>applyFontSize(fsSlid.value));

  // Settings panel toggle
  const settingsPanel = get('settingsPanel');
  get('settingsBtn').onclick = e => {
    e.stopPropagation();
    settingsPanel.classList.toggle('open');
  };
  // Close panel when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('#settingsPanel') && !e.target.closest('#settingsBtn')) {
      settingsPanel.classList.remove('open');
    }
  });

  // Watch system preference changes when in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ()=>{
    if(theme==='auto') applyTheme();
  });

  // Language selector
  get('langSel').onchange=e=>{
    lang=e.target.value;
    try{ localStorage.setItem('wc3_lang',lang); }catch(ex){}
    applyI18n();
    renderPalette();
    renderCalendar();
  };

  // Year nav
  get('prevYear').onclick=()=>{yr--;renderCalendar();};
  get('nextYear').onclick=()=>{yr++;renderCalendar();};
  get('yearLabel').onclick=()=>{mo=null;renderCalendar();};
  get('prevBtn').onclick=()=>{ if(mo===null)yr--; else if(mo===0){yr--;mo=11;}else mo--; renderCalendar(); };
  get('nextBtn').onclick=()=>{ if(mo===null)yr++; else if(mo===11){yr++;mo=0;}else mo++; renderCalendar(); };

  // Palette
  get('togglePal').onclick=()=>get('palette').classList.toggle('closed');
  get('eraserBtn').onclick=()=>setEraser(!eraserOn);
  get('addChipBtn').onclick=()=>openShiftModal(null);

  // Shift modal
  get('smClose').onclick=closeShiftModal; get('smCancel').onclick=closeShiftModal;
  get('smSave').onclick=saveShiftModal;
  get('shiftModal').onclick=e=>{ if(e.target===get('shiftModal'))closeShiftModal(); };

  // Note modal
  get('nmClose').onclick=closeNote; get('nmCancel').onclick=closeNote;
  get('nmSave').onclick=saveNote;
  get('noteModal').onclick=e=>{ if(e.target===get('noteModal'))closeNote(); };

  // Selection bar
  get('applyBtn').onclick=applyToSel;
  get('clearSelBtn').onclick=clearSel;
  get('noteBtn').onclick=openNote;
  get('deselBtn').onclick=deselectAll;

  // IO
  get('expJsonBtn').onclick=exportJson;
  get('impJsonBtn').onclick=()=>get('impJsonFile').click();
  get('impJsonFile').onchange=e=>{ if(e.target.files[0])importJson(e.target.files[0]); e.target.value=''; };
  get('expIcsBtn').onclick=exportIcs;
  get('impIcsBtn').onclick=()=>get('impIcsFile').click();
  get('impIcsFile').onchange=e=>{ if(e.target.files[0])importIcs(e.target.files[0]); e.target.value=''; };

  // Context menu
  get('ctxSwitch').addEventListener('click', e=>{
    e.stopPropagation();
    const cs=get('ctxShifts'); cs.style.display=cs.style.display==='none'?'flex':'none';
  });
  get('ctxNote').onclick=()=>{ hideCtx(); if(!selDates.has(ctxKey))addSel(ctxKey); openNote(); };
  get('ctxDel').onclick=()=>{ hideCtx(); if(ctxKey){erase(ctxKey);save();renderCalendar();} };
  document.addEventListener('click', e=>{ if(!e.target.closest('#ctx'))hideCtx(); });

  // Keyboard shortcuts
  document.addEventListener('keydown', e=>{
    const tag=document.activeElement.tagName;
    if(e.key==='Escape'){ closeShiftModal(); closeNote(); deselectAll(); hideCtx(); setEraser(false); }
    if(e.key==='Enter'){
      if(get('shiftModal').classList.contains('open'))saveShiftModal();
      if(get('noteModal').classList.contains('open'))saveNote();
    }
    if((e.key==='e'||e.key==='E')&&tag!=='INPUT'&&tag!=='TEXTAREA') setEraser(!eraserOn);
  });

  // File drag-drop
  document.addEventListener('dragover', e=>e.preventDefault());
  document.addEventListener('drop', e=>{
    e.preventDefault(); const f=e.dataTransfer.files[0]; if(!f)return;
    if(f.name.endsWith('.json'))importJson(f);
    else if(f.name.endsWith('.ics'))importIcs(f);
  });

  renderPalette();
  renderCalendar();
};

window.addEventListener('beforeunload', save);
