// ═══════════════════════════════════════════════════
//  班表管理 v3  ·  app.js
// ═══════════════════════════════════════════════════
'use strict';

const WEEK  = ['一','二','三','四','五','六','日'];
const MONTH = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const PRESETS = [
  {name:'早班',start:'07:00',end:'15:00',alarm:30,color:'#e8834f'},
  {name:'中班',start:'11:00',end:'19:00',alarm:30,color:'#4fa6e8'},
  {name:'晚班',start:'15:00',end:'23:00',alarm:30,color:'#9b5fe8'},
  {name:'夜班',start:'23:00',end:'07:00',alarm:60,color:'#3a78d4'},
  {name:'休息',start:'00:00',end:'00:00',alarm:0, color:'#4fbb7c'},
  {name:'年假',start:'00:00',end:'00:00',alarm:0, color:'#e8c34f'},
  {name:'培训',start:'09:00',end:'17:00',alarm:30,color:'#e85a5a'},
  {name:'调休',start:'00:00',end:'00:00',alarm:0, color:'#6dbfa8'},
];

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
  try { localStorage.setItem('wc3_shifts',JSON.stringify(shifts)); localStorage.setItem('wc3_roster',JSON.stringify(roster)); } catch(e){}
};
const load = () => {
  try {
    const s=localStorage.getItem('wc3_shifts'), r=localStorage.getItem('wc3_roster');
    if(s) shifts=JSON.parse(s);
    if(r) roster=JSON.parse(r);
  } catch(e){}
};

// ── Utils ──────────────────────────────────────────
const genUid  = () => Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const dk      = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const todayK  = () => { const t=new Date(); return dk(t.getFullYear(),t.getMonth(),t.getDate()); };
const byUid   = u => shifts.find(s=>s.uid===u);
const get     = id => document.getElementById(id);
const mk      = (tag,cls) => { const e=document.createElement(tag); if(cls)e.className=cls; return e; };
const esc     = s => { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; };
const TZ      = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Brisbane';

const alarmV = min => {
  min = Number(min);
  if (min % 60 === 0) return `-PT${min/60}H`;
  if (min > 60) return `-PT${Math.floor(min/60)}H${min%60}M`;
  return `-PT${min}M`;
};

// ── Eraser / Brush ────────────────────────────────
function setEraser(on) {
  eraserOn=on; if(on) brush=null;
  get('eraserBtn').classList.toggle('on',eraserOn);
  get('eraserIcon').textContent=eraserOn?'◼':'◻';
  renderPalette();
}
function setBrush(uid) {
  if(eraserOn) setEraser(false);
  brush=(brush===uid)?null:uid;
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
        <button class="chip-act ed" title="编辑">✏</button>
        <button class="chip-act"    title="删除">✕</button>
      </div>`;
    chip.addEventListener('click',e=>{
      if(e.target.closest('.chip-act.ed')){ openShiftModal(st.uid); return; }
      if(e.target.closest('.chip-act'))   { removeShift(st.uid); return; }
      setBrush(st.uid);
    });
    list.appendChild(chip);
  });
}

function removeShift(u) {
  if(!confirm('删除该班次类型？\n（已安排的日期不受影响）')) return;
  shifts=shifts.filter(s=>s.uid!==u);
  if(brush===u) brush=null;
  save(); renderPalette(); renderCalendar();
}

// ── Shift Modal ───────────────────────────────────
function openShiftModal(u) {
  editUid=u||null; const st=u?byUid(u):null;
  get('smTitle').textContent=st?'编辑班次':'添加班次';
  get('fName').value  = st?st.name:'';
  get('fStart').value = st?st.start:'08:00';
  get('fEnd').value   = st?st.end:'16:00';
  get('fAlarm').value = st?st.alarm:30;
  get('fColor').value = st?st.color:'#4f8ef7';
  get('fDesc').value  = st?st.desc:'';
  buildTmpls();
  get('shiftModal').classList.add('open');
  setTimeout(()=>get('fName').focus(),40);
}
function closeShiftModal(){ get('shiftModal').classList.remove('open'); editUid=null; }
function saveShiftModal(){
  const name=get('fName').value.trim(); if(!name){get('fName').focus();return;}
  const data={uid:editUid||genUid(),name,start:get('fStart').value,end:get('fEnd').value,
              alarm:Number(get('fAlarm').value),color:get('fColor').value,desc:get('fDesc').value.trim()};
  if(editUid){ const i=shifts.findIndex(s=>s.uid===editUid); if(i>=0)shifts[i]=data; }
  else { shifts.push(data); brush=data.uid; eraserOn=false; }
  save(); closeShiftModal(); renderPalette(); renderCalendar();
}
function buildTmpls(){
  const el2=get('tmplList'); el2.innerHTML='<span style="font-size:10px;color:var(--text2)">预设：</span>';
  PRESETS.forEach(t=>{
    const b=mk('button','tmpl'); b.textContent=t.name;
    b.onclick=()=>{ get('fName').value=t.name;get('fStart').value=t.start;
      get('fEnd').value=t.end;get('fAlarm').value=t.alarm;get('fColor').value=t.color; };
    el2.appendChild(b);
  });
}

// ── Selection ─────────────────────────────────────
function toggleSel(k,cell){
  if(selDates.has(k)){selDates.delete(k);cell&&cell.classList.remove('sel');}
  else{selDates.add(k);cell&&cell.classList.add('sel');}
  updSelBar();
}
function addSel(k){
  selDates.add(k);
  document.querySelectorAll(`[data-key="${k}"]`).forEach(c=>c.classList.add('sel'));
  updSelBar();
}
function updSelBar(){
  const n=selDates.size; get('selCount').textContent=n;
  get('selBar').classList.toggle('vis',n>0);
}
function deselectAll(){
  selDates.clear();
  document.querySelectorAll('.sel').forEach(c=>c.classList.remove('sel'));
  updSelBar();
}
function applyToSel(){
  if(!brush){alert('请先在左侧选择班次类型');return;}
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

// Live cell repaint (avoids full re-render during drag)
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
    cell.querySelector('.dc-shift')&&cell.querySelector('.dc-shift').remove();
  }
}

// ── Pointer Events (unified mouse + touch) ────────
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
    // No-tool: selection is toggled on pointerup (so user can still drag-deselect)
  });

  container.addEventListener('pointermove', e=>{
    if(!ptrDown) return;
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const cell=el&&el.closest('[data-key]'); if(!cell) return;
    const k=cell.dataset.key;
    if(k===downKey) return; // still on origin cell — already handled by pointerdown
    didDrag=true;           // we have left the origin cell: this is a real drag
    if(eraserOn){ erase(k); liveColor(cell,k); }
    else if(brush){ paint(k); liveColor(cell,k); addSel(k); }
  });

  container.addEventListener('pointerup', e=>{
    if(!ptrDown) return;
    ptrDown=false;
    if(didDrag){
      // Drag across multiple cells: save & re-render to sync state
      save(); renderCalendar();
    } else {
      // Released on the same cell as pointerdown
      const cell=e.target.closest('[data-key]'); if(!cell) return;
      const k=cell.dataset.key;
      if(eraserOn||brush){
        // Already painted/erased in pointerdown; just save
        save(); renderCalendar();
      } else {
        // No tool: toggle selection
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
  get('monthLabel').textContent=mo!==null?MONTH[mo]:'全年';
  const c=get('monthBtns'); c.innerHTML='';
  const ab=mk('button','mbtn'+(mo===null?' on':'')); ab.textContent='全年';
  ab.onclick=()=>{mo=null;renderCalendar();}; c.appendChild(ab);
  for(let i=0;i<12;i++){
    const b=mk('button','mbtn'+(mo===i?' on':''));
    b.textContent=(i+1)+'月'; b.onclick=()=>{mo=i;renderCalendar();}; c.appendChild(b);
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
  hdr.innerHTML=`<span>${MONTH[m]}</span>`; hdr.appendChild(buildTally(y,m));
  hdr.onclick=()=>{mo=m;renderCalendar();}; wrap.appendChild(hdr);
  const wh=mk('div','wk-hdr');
  WEEK.forEach(w=>{const s=document.createElement('span');s.textContent=w;wh.appendChild(s);});
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
  WEEK.forEach(w=>{const s=document.createElement('span');s.textContent='周'+w;wh.appendChild(s);});
  const g=get('bigDayGrid'); g.innerHTML='';
  const y=yr,m=mo;
  const off=(new Date(y,m,1).getDay()+6)%7, dim=new Date(y,m+1,0).getDate();
  for(let i=0;i<off;i++){const c=mk('div','dc big other');g.appendChild(c);}
  for(let d=1;d<=dim;d++) g.appendChild(buildCell(y,m,d,td,true));
  initPointerDrag(g);
  g.querySelectorAll('[data-key]').forEach(attachCtx);
}

// ── Unified cell builder ──────────────────────────
function buildCell(y,m,d,td,big){
  const k=dk(y,m,d), ro=roster[k], st=ro&&ro.uid?byUid(ro.uid):null;
  const wd=(new Date(y,m,d).getDay()+6)%7;
  const cls=['dc',
    big?'big':'',
    wd>=5?'wknd':'',
    k===td?'today':'',
    st?'painted':'',
    selDates.has(k)?'sel':'',
  ].filter(Boolean).join(' ');
  const c=mk('div',cls); c.dataset.key=k;
  if(st){ c.style.background=st.color+(big?'cc':'bb'); if(big)c.style.borderColor='transparent'; }
  const num=mk('div','dc-num'); num.textContent=d; c.appendChild(num);
  if(st&&big){const n=mk('div','dc-shift');n.textContent=st.name;c.appendChild(n);}
  if(ro&&ro.note&&big){const n=mk('div','dc-note');n.textContent=ro.note;c.appendChild(n);}
  return c;
}

// ── Context menu ──────────────────────────────────
function attachCtx(cell){
  cell.addEventListener('contextmenu',e=>{
    e.preventDefault(); ctxKey=cell.dataset.key;
    buildCtxShifts();
    const ro=roster[ctxKey];
    get('ctxSwitch').style.display=(ro&&ro.uid)?'flex':'none';
    get('ctxShifts').style.display='none';
    showCtx(e.clientX,e.clientY);
  });
}
function buildCtxShifts(){
  const c=get('ctxShifts'); c.innerHTML='';
  shifts.forEach(st=>{
    const item=mk('div','ci');
    item.innerHTML=`<span style="width:8px;height:8px;border-radius:2px;background:${st.color};display:inline-block;flex-shrink:0"></span> ${esc(st.name)}`;
    item.onclick=()=>{
      if(ctxKey){if(!roster[ctxKey])roster[ctxKey]={};roster[ctxKey].uid=st.uid;save();renderCalendar();}
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
    em.textContent=mo!==null?'本月暂无班次':'本年暂无班次'; bar.appendChild(em); return;
  }
  Object.entries(cnts).forEach(([u,c])=>{
    const st=byUid(u); if(!st)return;
    const b=mk('div','stat');
    b.innerHTML=`<div class="stat-dot" style="background:${st.color}"></div><span>${esc(st.name)}: ${c}天</span>`;
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
      shiftName:st?st.name:null, shiftStart:st?st.start:null,
      shiftEnd:st?st.end:null,   shiftColor:st?st.color:null};
  });
  dl(JSON.stringify({version:3,exportedAt:new Date().toISOString(),shifts,roster:enriched},null,2),
     'application/json',`roster_${todayK()}.json`);
}
function importJson(file){
  readF(file,txt=>{
    try{
      const data=JSON.parse(txt);
      if(data.shifts) shifts=data.shifts;
      if(data.roster){
        const clean={};
        Object.entries(data.roster).forEach(([k,v])=>{
          const entry={uid:v.uid||undefined,note:v.note||undefined};
          if(entry.uid||entry.note) clean[k]=entry;
        });
        Object.assign(roster,clean);
      }
      save(); renderPalette(); renderCalendar(); alert('导入成功！');
    }catch(e){alert('JSON格式错误：'+e.message);}
  });
}

const buildVtimezone = tz => {
  if (tz === 'Australia/Brisbane') {
    return `BEGIN:VTIMEZONE
TZID:Australia/Brisbane
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+1000
TZOFFSETTO:+1000
TZNAME:AEST
END:STANDARD
END:VTIMEZONE
`;
  }

  // fallback（其他时区简单处理）
  return `BEGIN:VTIMEZONE
TZID:${tz}
END:VTIMEZONE
`;
};

// ── ICS export ────────────────────────────────────
function exportIcs(){
  const pad = n => n<10?'0'+n:''+n;

  // Floating local time: no Z, no TZID — calendar app uses device timezone
  const fmtLocal = (y,m,d,h,min) =>
    `${y}${pad(m+1)}${pad(d)}T${pad(h)}${pad(min)}00`;

  // DTSTAMP must be UTC per RFC 5545
  const fmtUTC = dt =>
    dt.getUTCFullYear()+pad(dt.getUTCMonth()+1)+pad(dt.getUTCDate())+
    'T'+pad(dt.getUTCHours())+pad(dt.getUTCMinutes())+'00Z';

  const ev=[];
  Object.entries(roster).forEach(([k,v])=>{
    if(!v.uid)return; const st=byUid(v.uid); if(!st||!st.alarm)return;
    const y=+k.slice(0,4), m=+k.slice(5,7)-1, d=+k.slice(8,10);
    const [sh,sm]=st.start.split(':').map(Number);
    const [eh,em]=st.end.split(':').map(Number);
    // Midnight-crossing shift: end date is next day
    let ey=y, em2=m, ed=d;
    if(eh<sh||(eh===sh&&em<=sm)){
      const tmp=new Date(y,m,d+1);
      ey=tmp.getFullYear(); em2=tmp.getMonth(); ed=tmp.getDate();
    }
    const dtStart=fmtLocal(y,m,d,sh,sm), dtEnd=fmtLocal(ey,em2,ed,eh,em);
    const tr=alarmV(st.alarm), note=v.note?'-'+v.note:'';
    const alarm=tr?`BEGIN:VALARM
TRIGGER:${tr}
ACTION:DISPLAY
DESCRIPTION:${st.name}${note}
END:VALARM
`:'';
    ev.push(`BEGIN:VEVENT
UID:${genUid()}@workcal
DTSTAMP:${fmtUTC(new Date())}
DTSTART;TZID=${TZ}:${dtStart}
DTEND;TZID=${TZ}:${dtEnd}
SUMMARY:${st.name}${note}
${alarm}END:VEVENT`);
  });
  if(!ev.length){alert('\u6ca1\u6709\u542b\u63d0\u9192\u7684\u73ed\u6b21\u53ef\u5bfc\u51fa');return;}
  //dl('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WorkCal//v3//ZH\n'+ev.join('\n')+'\nEND:VCALENDAR','text/calendar','roster_'+todayK()+'.ics');


  dl(
    'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WorkCal//v3//ZH\n' +
    buildVtimezone(TZ) +
    ev.join('\n') +
    '\nEND:VCALENDAR',
    'text/calendar',
    'roster_'+todayK()+'.ics'
  );

}

// ── ICS import ────────────────────────────────────
function importIcs(file){
  readF(file,txt=>{
    const lines=txt.split(/\r?\n/); let inEv=false,dtstart=null,summary=null;
    lines.forEach(raw=>{
      const l=raw.trim();
      if(l==='BEGIN:VEVENT'){inEv=true;dtstart=null;summary=null;}
      else if(l==='END:VEVENT'){
        if(dtstart&&summary){
          const st=shifts.find(s=>s.name===summary||summary.startsWith(s.name));
          if(st){if(!roster[dtstart])roster[dtstart]={};roster[dtstart].uid=st.uid;}
        }
        inEv=false;
      } else if(inEv){
      if(l.startsWith('DTSTART')){
        const idx = l.indexOf(':');
        if(idx === -1) return;
        const v = l.slice(idx + 1);
        const p = v.replace('Z','').replace('T','').slice(0,8);
        dtstart = `${p.slice(0,4)}-${p.slice(4,6)}-${p.slice(6,8)}`;
      }
        else if(l.startsWith('SUMMARY:'))summary=l.slice(8);
      }
    });
    save(); renderCalendar(); alert('ICS导入完成');
  });
}

// ── Helpers ───────────────────────────────────────
function dl(content,type,name){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),3000);
}
function readF(file,cb){const r=new FileReader();r.onload=()=>cb(r.result);r.readAsText(file);}

// ── Init ──────────────────────────────────────────
window.onload=()=>{
  load();
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
  get('shiftModal').onclick=e=>{if(e.target===get('shiftModal'))closeShiftModal();};
  // Note modal
  get('nmClose').onclick=closeNote; get('nmCancel').onclick=closeNote;
  get('nmSave').onclick=saveNote;
  get('noteModal').onclick=e=>{if(e.target===get('noteModal'))closeNote();};
  // Selection bar
  get('applyBtn').onclick=applyToSel;
  get('clearSelBtn').onclick=clearSel;
  get('noteBtn').onclick=openNote;
  get('deselBtn').onclick=deselectAll;
  // IO
  get('expJsonBtn').onclick=exportJson;
  get('impJsonBtn').onclick=()=>get('impJsonFile').click();
  get('impJsonFile').onchange=e=>{if(e.target.files[0])importJson(e.target.files[0]);e.target.value='';};
  get('expIcsBtn').onclick=exportIcs;
  get('impIcsFile').onchange=e=>{if(e.target.files[0])importIcs(e.target.files[0]);e.target.value='';};
  // Context menu
  get('ctxSwitch').addEventListener('click',e=>{
    e.stopPropagation();
    const cs=get('ctxShifts'); cs.style.display=cs.style.display==='none'?'flex':'none';
  });
  get('ctxNote').onclick=()=>{ hideCtx(); if(!selDates.has(ctxKey))addSel(ctxKey); openNote(); };
  get('ctxDel').onclick=()=>{ hideCtx(); if(ctxKey){erase(ctxKey);save();renderCalendar();} };
  document.addEventListener('click',e=>{ if(!e.target.closest('#ctx'))hideCtx(); });
  // Keyboard shortcuts
  document.addEventListener('keydown',e=>{
    const tag=document.activeElement.tagName;
    if(e.key==='Escape'){ closeShiftModal();closeNote();deselectAll();hideCtx();setEraser(false); }
    if(e.key==='Enter'){
      if(get('shiftModal').classList.contains('open'))saveShiftModal();
      if(get('noteModal').classList.contains('open'))saveNote();
    }
    if((e.key==='e'||e.key==='E')&&tag!=='INPUT'&&tag!=='TEXTAREA') setEraser(!eraserOn);
  });
  // File drag-drop
  document.addEventListener('dragover',e=>e.preventDefault());
  document.addEventListener('drop',e=>{
    e.preventDefault(); const f=e.dataTransfer.files[0]; if(!f)return;
    if(f.name.endsWith('.json'))importJson(f);
    else if(f.name.endsWith('.ics'))importIcs(f);
  });
  renderPalette();
  renderCalendar();
};
window.addEventListener('beforeunload',save);
