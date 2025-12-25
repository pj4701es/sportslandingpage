// app.js - contains UI interactions, form validation, and talent rendering

const state = {
  talents: [],
  filters: { sport: 'all', district: 'all', gender: 'all' }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  initUI();
  initChatBot();
  loadSampleTalents();
  renderTalents();
});

/* --- Chat Bot (lightweight, client-side) --- */
function initChatBot(){
  const toggle = document.getElementById('botToggle');
  const panel = document.getElementById('botPanel');
  const close = document.getElementById('botClose');
  const form = document.getElementById('botForm');
  const messages = document.getElementById('botMessages');
  const input = document.getElementById('botInput');

  // Restore conversation
  const conv = JSON.parse(localStorage.getItem('chatConv') || '[]');
  conv.forEach(m=>appendBotMessage(m.text, m.sender));

  toggle.addEventListener('click', ()=>{
    const open = panel.getAttribute('aria-hidden') === 'true';
    panel.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    if(open) input.focus();
  });
  close.addEventListener('click', ()=>{ panel.setAttribute('aria-hidden','true'); toggle.setAttribute('aria-expanded','false'); });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = input.value.trim();
    if(!v) return;
    pushConv({ sender:'user', text:v });
    appendBotMessage(v,'user');
    input.value='';
    // simple canned response logic
    setTimeout(()=>{
      const reply = botReplyFor(v);
      pushConv({ sender:'bot', text:reply });
      appendBotMessage(reply,'bot');
    }, 600 + Math.random()*600);
  });
}

function appendBotMessage(text, sender){
  const container = document.getElementById('botMessages');
  const el = document.createElement('div');
  el.className = 'bot-bubble ' + (sender==='user' ? 'user' : 'bot');
  el.textContent = text;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function pushConv(msg){
  const cur = JSON.parse(localStorage.getItem('chatConv') || '[]');
  cur.push(msg);
  // keep last 60 messages
  localStorage.setItem('chatConv', JSON.stringify(cur.slice(-60)));
}

function botReplyFor(text){
  const t = text.toLowerCase();
  if(t.includes('login')||t.includes('sign')) return 'To login, click the Login button on the header or open the full login page.';
  if(t.includes('nominate')||t.includes('nomination')) return 'Use the "Nominate Talent" button in the Bihar Talent Spotlight section to submit a nomination.';
  if(t.includes('program')||t.includes('train')) return 'We offer training camps, scouting, mentorship, and events. See the Programs section for details.';
  if(t.includes('contact')||t.includes('reach')) return 'Use the Contact form near the bottom or email us at hello@sportslaunch.example (placeholder).';
  const fallbacks = [
    'Great question — could you share a bit more?',
    'I can help with programs, nominations, and account setup. What would you like?',
    'If you want to nominate someone, say "nominate" and I will guide you.'
  ];
  return fallbacks[Math.floor(Math.random()*fallbacks.length)];
}

// Future hook for server-side integration
function sendToServerForReply(message){
  // Example: fetch('/api/chat', {method:'POST', body: JSON.stringify({message})})
}

function initUI(){
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const modalClose = document.querySelector('.modal-close');
  const menuToggle = document.getElementById('menuToggle');
  const themeToggle = document.getElementById('themeToggle');

  loginBtn.addEventListener('click', () => openModal());
  modalClose.addEventListener('click', () => closeModal());
  loginModal.addEventListener('click', (e) => { if(e.target === loginModal) closeModal(); });

  document.getElementById('loginForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    handleLogin();
  });

  menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    nav.style.display = (nav.style.display === 'block') ? 'none' : 'block';
  });

  // theme init and toggle
  const saved = localStorage.getItem('theme');
  if(saved === 'light') document.body.classList.add('light');
  updateThemeButton();
  themeToggle.addEventListener('click', ()=>{
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeButton();
  });


function updateThemeButton(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  const isLight = document.body.classList.contains('light');
  btn.setAttribute('aria-pressed', String(isLight));
  btn.textContent = isLight ? '☀️' : '🌙';
}
  // contact form
  document.getElementById('contactForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const formMsg = document.getElementById('formMsg');
    if(!name.value.trim() || !validateEmail(email.value) || !message.value.trim()){
      formMsg.textContent = 'Please complete all fields with valid info.';
      formMsg.style.color = 'tomato';
      return;
    }
    formMsg.textContent = 'Thanks — we received your message.';
    formMsg.style.color = 'var(--accent)';
    e.target.reset();
  });

  // filters
  document.getElementById('filterSport').addEventListener('change', (e)=>{ state.filters.sport = e.target.value; renderTalents(); });
  document.getElementById('filterDistrict').addEventListener('change', (e)=>{ state.filters.district = e.target.value; renderTalents(); });
  document.getElementById('filterGender').addEventListener('change', (e)=>{ state.filters.gender = e.target.value; renderTalents(); });
  document.getElementById('clearFilters').addEventListener('click', ()=>{
    state.filters = { sport: 'all', district: 'all', gender: 'all' };
    document.getElementById('filterSport').value='all';
    document.getElementById('filterDistrict').value='all';
    document.getElementById('filterGender').value='all';
    renderTalents();
  });
}

function openModal(){
  const m = document.getElementById('loginModal');
  m.setAttribute('aria-hidden','false');
}
function closeModal(){
  const m = document.getElementById('loginModal');
  m.setAttribute('aria-hidden','true');
}

function handleLogin(){
  const email = document.getElementById('loginEmail');
  const pass = document.getElementById('loginPass');
  if(!validateEmail(email.value)) return showLoginError('Enter a valid email');
  if(pass.value.length < 6) return showLoginError('Password must be 6+ chars');
  // placeholder success
  showLoginSuccess('Signed in successfully — welcome!');
  setTimeout(closeModal, 700);
}
function showLoginError(msg){
  alert(msg); // minimal UI - replace with styled message placeholder
}
function showLoginSuccess(msg){
  alert(msg);
}

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sample Bihar talent data (placeholder) — ready for API integration
function loadSampleTalents(){
  state.talents = [
    { id:1, name:'Rahul Kumar', sport:'Cricket', district:'Patna', gender:'male', bio:'Right-handed batter with strong technique.', achievements:'District U19 captain', twitter:'https://twitter.com/' },
    { id:2, name:'Anjali Devi', sport:'Athletics', district:'Gaya', gender:'female', bio:'Sprinter with explosive starts.', achievements:'State 100m silver', twitter:'https://twitter.com/' },
    { id:3, name:'Suresh Yadav', sport:'Kabaddi', district:'Nalanda', gender:'male', bio:'Aggressive raider with great stamina.', achievements:'Club MVP 2024', twitter:'https://twitter.com/' },
    { id:4, name:'Priya Singh', sport:'Hockey', district:'Patna', gender:'female', bio:'Midfield playmaker with vision.', achievements:'U21 national camp', twitter:'https://twitter.com/' }
  ];
  populateFilterOptions();
}

function populateFilterOptions(){
  const sports = new Set();
  const districts = new Set();
  state.talents.forEach(t=>{ sports.add(t.sport); districts.add(t.district); });
  const sportSel = document.getElementById('filterSport');
  const distSel = document.getElementById('filterDistrict');
  sports.forEach(s=>{ const o=document.createElement('option'); o.value=s; o.textContent=s; sportSel.appendChild(o); });
  districts.forEach(d=>{ const o=document.createElement('option'); o.value=d; o.textContent=d; distSel.appendChild(o); });
}

function renderTalents(){
  const container = document.getElementById('talentList');
  container.innerHTML = '';
  const filtered = state.talents.filter(t=>{
    if(state.filters.sport !== 'all' && t.sport !== state.filters.sport) return false;
    if(state.filters.district !== 'all' && t.district !== state.filters.district) return false;
    if(state.filters.gender !== 'all' && t.gender !== state.filters.gender) return false;
    return true;
  });
  if(filtered.length === 0){ container.innerHTML = '<p class="muted">No matching athletes. Try clearing filters.</p>'; return; }
  filtered.forEach(t=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="card-head">
        <h3>${t.name} <span class="badge">${t.sport}</span></h3>
        <p class="muted">${t.district} — ${t.gender}</p>
      </div>
      <p>${t.bio}</p>
      <p class="achieve"><strong>Achievements:</strong> ${t.achievements}</p>
      <div class="card-actions">
        <a class="btn btn-ghost" href="${t.twitter}" target="_blank">View</a>
        <button class="btn btn-primary" onclick="nominate(${t.id})">Nominate</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function nominate(id){
  const t = state.talents.find(x=>x.id===id);
  alert('Nomination sent for ' + (t? t.name : 'athlete'));
}

// Expose for inline use
window.nominate = nominate;

