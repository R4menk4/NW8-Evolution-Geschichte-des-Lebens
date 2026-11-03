(()=>{'use strict';const board=document.getElementById('fossilvergleich');if(!board)return;
const key='evolution-vergleich-v4',bank=board.querySelector('.card-bank'),cards=[...board.querySelectorAll('[data-card]')],cells=[...board.querySelectorAll('[data-slot]')],out=board.querySelector('#compare-feedback'),transfer=board.querySelector('#compare-transfer');
let selected='',state={slots:{},checked:false};try{const old=JSON.parse(localStorage.getItem(key)||'null');if(old?.slots)state=old;}catch{}
const names=Object.fromEntries(cards.map(c=>[c.dataset.card,c.textContent]));
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch{}};
const correct=()=>cells.every(c=>state.slots[c.dataset.slot]===c.dataset.expected);
function render(){cards.forEach(c=>{c.hidden=Object.values(state.slots).includes(c.dataset.card);c.classList.toggle('selected',selected===c.dataset.card);c.setAttribute('aria-pressed',String(selected===c.dataset.card));});cells.forEach(c=>{const id=state.slots[c.dataset.slot];c.querySelector('span').textContent=id?names[id]:'Karte hier ablegen';c.draggable=Boolean(id);c.classList.toggle('filled',Boolean(id));c.classList.toggle('wrong',state.checked&&id!==c.dataset.expected);c.classList.toggle('right',state.checked&&id===c.dataset.expected);c.setAttribute('aria-invalid',String(state.checked&&id!==c.dataset.expected));});transfer.hidden=!(state.checked&&correct());}
function move(id,cell){if(!names[id])return;for(const s in state.slots)if(state.slots[s]===id)delete state.slots[s];state.slots[cell.dataset.slot]=id;selected='';state.checked=false;out.textContent='';save();render();}
cards.forEach(c=>{c.onclick=()=>{selected=c.dataset.card;render();out.textContent='Karte ausgewählt. Klicke jetzt auf das passende Tabellenfeld.';};c.ondragstart=e=>{selected=c.dataset.card;e.dataTransfer.setData('text/plain',selected);e.dataTransfer.effectAllowed='move';};});
cells.forEach(c=>{c.onclick=()=>{if(selected)move(selected,c);else if(state.slots[c.dataset.slot]){delete state.slots[c.dataset.slot];state.checked=false;out.textContent='Die Karte liegt wieder bei den Auswahlkarten.';save();render();}};c.ondragover=e=>{e.preventDefault();e.dataTransfer.dropEffect='move';};c.ondrop=e=>{e.preventDefault();move(e.dataTransfer.getData('text/plain'),c);};c.ondragstart=e=>{const id=state.slots[c.dataset.slot];if(!id){e.preventDefault();return;}e.dataTransfer.setData('text/plain',id);e.dataTransfer.effectAllowed='move';};});
bank.ondragover=e=>e.preventDefault();bank.ondrop=e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');for(const s in state.slots)if(state.slots[s]===id)delete state.slots[s];selected='';state.checked=false;out.textContent='';save();render();};
board.querySelector('#compare-check').onclick=()=>{state.checked=true;const good=cells.filter(c=>state.slots[c.dataset.slot]===c.dataset.expected).length;out.textContent=good===9?'✓ Alle neun Angaben passen. Übertrage die Tabelle jetzt auf dein Arbeitsblatt.':good+' von 9 Feldern passen. Prüfe die markierten oder noch leeren Felder.';out.className='feedback '+(good===9?'correct':'incorrect');save();render();};
board.querySelector('#compare-reset').onclick=()=>{selected='';state={slots:{},checked:false};out.textContent='Die Tabelle ist wieder leer.';save();render();};
// Pointer handling also supports touch screens and embedded browsers.
let pointerDrag=null,suppressClick=false;
board.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);
[...cards,...cells].forEach(el=>el.addEventListener('pointerdown',e=>{
 const id=el.dataset.card||state.slots[el.dataset.slot];if(!id||e.button!==0)return;
 pointerDrag={id,x:e.clientX,y:e.clientY,el,moved:false};
 el.setPointerCapture(e.pointerId);e.preventDefault();
}));
board.addEventListener('pointermove',e=>{
 if(!pointerDrag)return;
 if(Math.hypot(e.clientX-pointerDrag.x,e.clientY-pointerDrag.y)>6)pointerDrag.moved=true;
 if(pointerDrag.moved){pointerDrag.el.classList.add('dragging');if(e.clientY>innerHeight-45)window.scrollBy(0,15);else if(e.clientY<45)window.scrollBy(0,-15);}
});
board.addEventListener('pointerup',e=>{
 if(!pointerDrag)return;const drag=pointerDrag;pointerDrag=null;drag.el.classList.remove('dragging');
 if(drag.el.hasPointerCapture(e.pointerId))drag.el.releasePointerCapture(e.pointerId);
 if(!drag.moved)return;
 suppressClick=true;setTimeout(()=>suppressClick=false,100);
 const target=document.elementFromPoint(e.clientX,e.clientY),cell=target?.closest('[data-slot]');
 if(cell&&board.contains(cell))move(drag.id,cell);
 else if(target&&bank.contains(target)){for(const s in state.slots)if(state.slots[s]===drag.id)delete state.slots[s];selected='';state.checked=false;out.textContent='';save();render();}
});
board.addEventListener('pointercancel',()=>{if(pointerDrag)pointerDrag.el.classList.remove('dragging');pointerDrag=null;});
render();if(state.checked)out.textContent=correct()?'✓ Die geprüfte Tabelle ist vollständig. Du kannst sie auf dein Arbeitsblatt übertragen.':'Prüfe die markierten oder noch leeren Felder.';
})();
