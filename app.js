const exercises=[
["Liegestütze","8–15 Wdh.","Körper gerade halten, Brust Richtung Boden senken und wieder hochdrücken.","liegestuetze.jpg"],
["Kniebeugen","15–20 Wdh.","Hüfte nach hinten, Rücken gerade halten.","kniebeugen.jpg"],
["Unterarmstütz / Plank","30–60 Sek.","Bauch und Gesäß anspannen, Körperlinie halten.","plank.jpg"],
["Glute Bridge","12–20 Wdh.","Hüfte kontrolliert nach oben drücken.","glute_bridge.jpg"],
["Ausfallschritte","10–12 je Bein","Großen Schritt nach vorne, Knie stabil halten.","ausfallschritte.jpg"],
["Superman","12–15 Wdh.","Arme und Beine anheben, kurz halten.","superman.jpg"],
["Mountain Climbers","30 Sek.","Knie abwechselnd schnell zur Brust ziehen.","mountain_climbers.jpg"],
["Dips am Stuhl","8–15 Wdh.","Ellenbogen beugen und wieder hochdrücken.","dips.jpg"]
];

const key="calisthenicsPosterPWA"; 
const today=new Date().toISOString().slice(0,10);

function get(){return JSON.parse(localStorage.getItem(key)||"{}")}
function set(d){localStorage.setItem(key,JSON.stringify(d))}
function ensure(){let d=get(); if(!d[today]) d[today]={done:false,ex:{}}; set(d); return d}

document.getElementById("dateText").textContent=new Date().toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab,.page").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  document.getElementById(b.dataset.page).classList.add("active");
  render();
});

function renderExercises(){
 let d=ensure(), wrap=document.getElementById("exerciseList");
 wrap.innerHTML="";
 exercises.forEach((e,i)=>{
  let v=d[today].ex[i]||{};
  let el=document.createElement("article");
  el.className="exercise";
  el.innerHTML=`<div class="art"><img src="${e[3]}" alt="${e[0]}"></div>
  <div class="body">
    <h3>${i+1}. ${e[0]}</h3>
    <div class="amount">${e[1]}</div>
    <p class="info">${e[2]}</p>
    <div class="inputs">
      <input placeholder="Wdh./Zeit" data-i="${i}" data-f="value" value="${v.value||""}">
      <input placeholder="Sätze" data-i="${i}" data-f="sets" value="${v.sets||""}">
      <textarea placeholder="Notizen" data-i="${i}" data-f="note">${v.note||""}</textarea>
    </div>
    <label class="check">Erledigt <input type="checkbox" data-i="${i}" ${v.done?"checked":""}></label>
  </div>`;
  wrap.appendChild(el);
 });

 wrap.querySelectorAll("input:not([type=checkbox]),textarea").forEach(x=>x.oninput=e=>{
  let d=ensure(),i=e.target.dataset.i,f=e.target.dataset.f;
  if(!d[today].ex[i])d[today].ex[i]={};
  d[today].ex[i][f]=e.target.value;
  set(d);
  stats();
 });

 wrap.querySelectorAll("input[type=checkbox]").forEach(x=>x.onchange=e=>{
  let d=ensure(),i=e.target.dataset.i;
  if(!d[today].ex[i])d[today].ex[i]={};
  d[today].ex[i].done=e.target.checked;
  set(d);
  stats();
 });
}

document.getElementById("completeBtn").onclick=()=>{
 let d=ensure();
 d[today].done=!d[today].done;
 set(d);
 render();
};

function stats(){
 let d=get(), t=d[today]||{ex:{}};
 let c=Object.values(t.ex||{}).filter(x=>x.done).length;
 document.getElementById("todayCount").textContent=c+"/8";
 document.getElementById("total").textContent=Object.values(d).filter(x=>x.done).length;
 document.getElementById("completeBtn").classList.toggle("done",!!t.done);
 document.getElementById("completeBtn").textContent=t.done?"Heute erledigt ✓":"Training heute erledigt ✓";
 streak(d);
}

function streak(d){
 let s=0, cur=new Date();
 while(true){
  let k=cur.toISOString().slice(0,10);
  if(d[k]?.done){s++;cur.setDate(cur.getDate()-1)}
  else break;
 }
 document.getElementById("streak").textContent=s;
}

function week(){
 let d=get(), labels=["Mo","Di","Mi","Do","Fr","Sa","So"], now=new Date(), off=now.getDay()===0?6:now.getDay()-1, mon=new Date(now);
 mon.setDate(now.getDate()-off);
 let w=document.getElementById("week");
 w.innerHTML="";
 for(let i=0;i<7;i++){
  let x=new Date(mon);
  x.setDate(mon.getDate()+i);
  let k=x.toISOString().slice(0,10);
  let div=document.createElement("div");
  div.className="day"+(d[k]?.done?" done":"");
  div.innerHTML=labels[i]+"<br>"+(d[k]?.done?"✓":"□");
  w.appendChild(div);
 }
}

function history(){
 let d=get(), h=document.getElementById("history");
 h.innerHTML="";
 Object.keys(d).sort().reverse().forEach(k=>{
  let c=Object.values(d[k].ex||{}).filter(x=>x.done).length;
  h.innerHTML+=`<tr><td>${k}</td><td>${d[k].done?"✓":"-"}</td><td>${c}/8</td></tr>`;
 });
}

function chart(){
 let c=document.getElementById("chart"), ctx=c.getContext("2d"), d=get(), keys=Object.keys(d).sort().slice(-7);
 ctx.clearRect(0,0,c.width,c.height);
 ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,c.width,c.height);
 ctx.strokeStyle="#155eae";ctx.lineWidth=3;ctx.beginPath();
 keys.forEach((k,i)=>{
  let val=Object.values(d[k].ex||{}).filter(x=>x.done).length;
  let x=25+i*((c.width-50)/6||1), y=c.height-25-(val/8)*(c.height-55);
  i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  ctx.fillStyle="#061525";ctx.fillText(k.slice(5),x-15,c.height-8);
 });
 ctx.stroke();
 keys.forEach((k,i)=>{
  let val=Object.values(d[k].ex||{}).filter(x=>x.done).length;
  let x=25+i*((c.width-50)/6||1), y=c.height-25-(val/8)*(c.height-55);
  ctx.fillStyle="#16a34a";ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
 });
}

let duration=30, rem=30, interval=null, running=false;
function draw(){document.getElementById("timerDisplay").textContent=String(Math.floor(rem/60)).padStart(2,"0")+":"+String(rem%60).padStart(2,"0")}
document.querySelectorAll("[data-sec]").forEach(b=>b.onclick=()=>{
 duration=+b.dataset.sec;
 rem=duration;
 clearInterval(interval);
 running=false;
 document.getElementById("timerStatus").textContent="Bereit";
 draw();
});
document.getElementById("startTimer").onclick=()=>{
 if(running)return;
 running=true;
 document.getElementById("timerStatus").textContent="Läuft";
 interval=setInterval(()=>{
  rem--;
  draw();
  if(rem<=0){
   clearInterval(interval);
   running=false;
   document.getElementById("timerStatus").textContent="Fertig";
   if(navigator.vibrate)navigator.vibrate([200,100,200]);
   alert("Zeit ist um!");
  }
 },1000);
};
document.getElementById("pauseTimer").onclick=()=>{
 clearInterval(interval);
 running=false;
 document.getElementById("timerStatus").textContent="Pausiert";
};
document.getElementById("resetTimer").onclick=()=>{
 clearInterval(interval);
 running=false;
 rem=duration;
 document.getElementById("timerStatus").textContent="Zurückgesetzt";
 draw();
};
document.getElementById("clearBtn").onclick=()=>{
 if(confirm("Alle Daten löschen?")){
  localStorage.removeItem(key);
  render();
 }
};
document.getElementById("exportBtn").onclick=()=>{
 let blob=new Blob([JSON.stringify(get(),null,2)],{type:"application/json"}),a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="calisthenics-daten.json";
 a.click();
};

function render(){ensure();renderExercises();stats();week();history();chart();draw()}
render();

if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js")}
