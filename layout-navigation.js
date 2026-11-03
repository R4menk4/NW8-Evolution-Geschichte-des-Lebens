(()=>{
const home=document.querySelector('.landing'),lesson=document.querySelector('.lesson-area');
const open=()=>{home.hidden=true;lesson.hidden=false;};
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',open));
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{open();document.querySelector('[data-page="'+b.dataset.open+'"]').click();window.scrollTo(0,0);});
document.querySelector('#home').onclick=()=>{home.hidden=false;lesson.hidden=true;window.scrollTo(0,0);};
})();
