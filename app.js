// ========== WHITECAP MORTGAGE NEWSLETTER SPA v2 ==========
// Tailored for Realtors — Niche Programs, Market Stats, Event Images, Weekly Video

const API = '/cgi-bin/api.py';
const ADMIN_PASSWORD = 'whitecap2026';
const CTA_URL = '#';
const PHONE = '302-535-7327';
const EMAIL = 'mark@whitecapmortgage.com';

// ---- Niche Programs (static, linkable) ----
const NICHE_PROGRAMS = [
  { tag:'0 Down Vacation Home', icon:'\uD83C\uDFD6\uFE0F', color:'#0d9488', desc:'Qualify your clients for a vacation home with zero down payment.' },
  { tag:'Bridge Loans', icon:'\uD83C\uDF09', color:'#6366f1', desc:'Help buyers purchase before their current home sells.' },
  { tag:'Construction Loans', icon:'\uD83C\uDFD7\uFE0F', color:'#ea580c', desc:'One-close and two-close options for ground-up builds.' },
  { tag:'Land Loans', icon:'\uD83C\uDF33', color:'#16a34a', desc:'Financing for vacant lots and acreage purchases.' },
  { tag:'Down Payment Assistance', icon:'\uD83D\uDCB0', color:'#ca8a04', desc:'Programs that cover part or all of the down payment.' },
  { tag:'Leased Land / Mobile', icon:'\uD83C\uDFE0', color:'#9333ea', desc:'Manufactured and mobile home financing on leased land.' }
];

// ---- Embedded seed data ----
const SEED_ISSUES = [{
  id: 'seed-wk-mar02',
  title: 'Week of March 2, 2026',
  date: '2026-03-02',
  rateSnapshot: '30-yr fixed near 6.50%, 15-yr at 5.85%. ARM products ticking down slightly.',
  commentary: 'Rates held mostly steady this week after the latest jobs report came in softer than expected. The Fed kept language cautious at its last meeting, signaling a possible cut in Q2 if inflation continues cooling. For buyers in the coastal DE/MD market, this is a solid window to lock \u2014 especially on conventional and FHA products.',
  rateDirection: 'Down',
  events: [
    {name:'Bethany Beach Farmers Market',date:'March 8, 2026',time:'9:00 AM \u2013 12:00 PM',location:'Bethany Beach, DE \u2013 Garfield Parkway',description:'Local produce, baked goods, and artisan vendors to kick off spring.',url:'',imageUrl:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=300&fit=crop'},
    {name:'Rehoboth Restaurant Week',date:'March 8\u201315, 2026',time:'Various',location:'Rehoboth Beach, DE \u2013 Multiple venues',description:'Prix fixe menus at top Rehoboth restaurants. Great date night options.',url:'https://rehobothrestaurantweek.com',imageUrl:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=300&fit=crop'},
    {name:"Ocean City St. Patrick\u2019s Parade",date:'March 14, 2026',time:'11:00 AM',location:'Ocean City, MD \u2013 Coastal Highway',description:'Annual parade with floats, bands, and festivities along the boardwalk area.',url:'',imageUrl:'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=300&fit=crop'},
    {name:'First-Time Homebuyer Seminar',date:'March 10, 2026',time:'6:30 PM',location:'Lewes, DE \u2013 Library',description:'Free seminar on buying your first home \u2014 down payment programs, credit tips, and more. Hosted by Whitecap Mortgage.',url:'',imageUrl:''}
  ],
  loanProgramTag: 'FHA',
  loanWhoFor: "First-time buyers and those with moderate credit scores (580+). FHA loans are a great fit for buyers who don\u2019t have 20% down but want to get into the market at today\u2019s rates. Popular choice for coastal condos and townhomes in the $250K\u2013$450K range.",
  loanBenefits: [
    'Down payment as low as 3.5% with a 580+ credit score',
    'More flexible underwriting \u2014 allows for higher debt-to-income ratios than conventional',
    'Seller can contribute up to 6% toward closing costs'
  ],
  loanWatchOut: "FHA loans require mortgage insurance (MIP) for the life of the loan if you put less than 10% down. Once you build equity, refinancing into a conventional loan can remove that cost.",
  nicheLinks: {
    '0 Down Vacation Home': '',
    'Bridge Loans': '',
    'Construction Loans': '',
    'Land Loans': '',
    'Down Payment Assistance': '',
    'Leased Land / Mobile': ''
  },
  marketStats: {
    sussexMedianPrice: '$480,000',
    sussexPriceChange: '+2.2%',
    sussexInventory: '1,863',
    sussexInventoryChange: '+10.9%',
    sussexDOM: '72 days',
    sussexDOMChange: '+29 days YoY',
    sussexMonthsSupply: '3.73',
    sussexNewConstPct: '40%',
    worcesterMedianPrice: '$407,500',
    worcesterPriceChange: '-8.7%',
    worcesterInventory: '646',
    worcesterInventoryChange: '+8.6%',
    worcesterDOM: '47 days',
    worcesterDOMChange: '+8 days YoY',
    worcesterMonthsSupply: '3.96',
    marketCommentary: 'Sussex County continues to see rising inventory with 40% attributed to new construction. Homes are taking longer to sell but prices remain stable. Worcester County is seeing modest price softening with increased showings (+12.9% YoY), suggesting buyer interest is strong even as negotiation power shifts. Del/Mar Coastal closed sales were down 7.4% YoY in January, but pending activity and showings are trending up \u2014 spring should bring renewed energy.',
    dataSource: 'Bright MLS / Square Feet Appraisals \u2013 January 2026'
  },
  videoUrl: '',
  videoCaption: '',
  createdAt: '2026-03-02T10:00:00'
}];

// ---- In-memory state ----
let _issues = [...SEED_ISSUES];
let _leads = [];
let _messages = [];
let _loggedIn = false;
let _apiAvailable = false;

// ---- API helpers (graceful fallback with fast timeout) ----
function _fetchTimeout(url,opts,ms){ms=ms||2000;return Promise.race([fetch(url,opts),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);}
async function apiGet(p){if(_skipApi)return null;try{const r=await _fetchTimeout(API+p,{},2000);if(r.ok){_apiAvailable=true;return await r.json();}}catch(e){_skipApi=true;}return null;}
async function apiPost(p,b){if(_skipApi)return null;try{const r=await _fetchTimeout(API+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)},2000);if(r.ok)return await r.json();}catch(e){}return null;}
async function apiPut(p,b){if(_skipApi)return null;try{const r=await _fetchTimeout(API+p,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)},2000);if(r.ok)return await r.json();}catch(e){}return null;}
async function apiDel(p){if(_skipApi)return null;try{const r=await _fetchTimeout(API+p,{method:'DELETE'},2000);if(r.ok)return await r.json();}catch(e){}return null;}
let _skipApi=false;

async function loadData(){
  const issues=await apiGet('/issues');
  if(issues&&issues.length){_issues=issues;}else{_issues=[...SEED_ISSUES];}
  const leads=await apiGet('/leads'); if(leads)_leads=leads;
  const msgs=await apiGet('/messages'); if(msgs)_messages=msgs;
}

// ---- Utility ----
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function uid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,8);}
function fmtDate(d){if(!d)return '';try{const dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});}catch(e){return d;}}

// ---- Router ----
async function route(){
  await loadData();
  const hash=window.location.hash||'#/';
  if(hash==='#/'||hash===''||hash==='#')return renderHome();
  if(hash.startsWith('#/issue/'))return renderIssue(hash.replace('#/issue/',''));
  if(hash==='#/admin/login')return renderAdminLogin();
  if(hash==='#/admin/issues')return requireAdmin(renderAdminIssues);
  if(hash==='#/admin/issues/new')return requireAdmin(renderAdminEditor);
  if(hash.startsWith('#/admin/issues/')&&hash.endsWith('/edit')){
    const id=hash.replace('#/admin/issues/','').replace('/edit','');
    return requireAdmin(()=>renderAdminEditor(id));
  }
  if(hash==='#/admin/leads')return requireAdmin(renderAdminLeads);
  if(hash==='#/admin/messages')return requireAdmin(renderAdminMessages);
  renderHome();
}
function requireAdmin(fn){if(!_loggedIn){window.location.hash='#/admin/login';return;}fn();}
window.addEventListener('hashchange',route);
document.addEventListener('DOMContentLoaded',route);

// ========== PUBLIC PAGES ==========

function renderHome(){
  const issues=[..._issues].sort((a,b)=>new Date(b.date)-new Date(a.date));
  let cards='';
  if(!issues.length){cards='<p class="empty-state">No issues published yet. Check back soon!</p>';}
  else{cards=issues.map(i=>{
    const dir=(i.rateDirection||'flat').toLowerCase();
    const snip=(i.rateSnapshot||'').substring(0,120);
    return `<div class="issue-card" onclick="location.hash='#/issue/${i.id}'">
      <div class="issue-card-date">${esc(fmtDate(i.date))}</div>
      <div class="issue-card-title">${esc(i.title)}</div>
      <div class="issue-card-snippet">${esc(snip)}${(i.rateSnapshot||'').length>120?'...':''}</div>
      <span class="rate-badge rate-${dir}">${esc(i.rateDirection||'Flat')}</span>
    </div>`;}).join('');}

  document.getElementById('app').innerHTML=`
    <header class="pub-header"><div class="container">
      <div class="logo-text">Whitecap Mortgage</div>
      <div class="tagline">Weekly Coastal Mortgage &amp; Events Update \u2014 For Realtors</div>
    </div></header>
    <main class="container" style="padding-top:28px;padding-bottom:40px;">
      <div class="flex-between" style="margin-bottom:18px">
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:var(--blue-800)">Recent Issues</h2>
        <a href="#/admin/login" class="btn btn-sm btn-outline" style="font-size:12px">Admin</a>
      </div>
      ${cards}
    </main>
    ${footerHTML()}`;
}

function renderIssue(id){
  const issue=_issues.find(i=>i.id===id);
  if(!issue){document.getElementById('app').innerHTML='<div class="login-wrapper"><div class="login-box"><div class="login-logo">404</div><div class="login-sub">Issue not found</div><a href="#/" class="btn btn-primary" style="margin-top:16px">Back to Home</a></div></div>';return;}

  let dirArrow='\u2192',dirClass='flat';
  if(issue.rateDirection==='Up'){dirArrow='\u2191';dirClass='up';}
  else if(issue.rateDirection==='Down'){dirArrow='\u2193';dirClass='down';}

  // Events with images
  let eventsHTML='<p class="empty-state">No events listed this week.</p>';
  if(issue.events&&issue.events.length){
    eventsHTML=issue.events.map(ev=>{
      const link=ev.url?`<a href="${esc(ev.url)}" target="_blank" rel="noopener" class="event-link">More info \u2192</a>`:'';
      const img=ev.imageUrl?`<div class="event-image"><img src="${esc(ev.imageUrl)}" alt="${esc(ev.name)}" loading="lazy"></div>`:'';
      return `<div class="event-card-v2">
        ${img}
        <div class="event-card-body">
          <div class="event-name">${esc(ev.name)}</div>
          <div class="event-meta">${esc(ev.date)} \u00b7 ${esc(ev.time)} \u00b7 ${esc(ev.location)}</div>
          <div class="event-desc">${esc(ev.description)}</div>${link}
        </div></div>`;
    }).join('');
  }

  // Loan tip
  let benefitsHTML='';
  if(issue.loanBenefits&&issue.loanBenefits.length){
    benefitsHTML='<ul class="benefits-list">'+issue.loanBenefits.map(b=>`<li>${esc(b)}</li>`).join('')+'</ul>';
  }

  // Market stats
  const ms=issue.marketStats||{};
  let marketStatsHTML='';
  if(ms.sussexMedianPrice||ms.worcesterMedianPrice){
    marketStatsHTML=`
    <div class="section">
      <div class="section-title"><span class="section-icon icon-stats">\uD83D\uDCC8</span> Coastal Market Snapshot</div>
      <div class="stats-grid">
        <div class="stats-county">
          <h4 class="stats-county-title">Sussex County, DE</h4>
          <div class="stat-row"><span class="stat-label-sm">Median Sold Price</span><span class="stat-value">${esc(ms.sussexMedianPrice||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">YoY Price Change</span><span class="stat-value ${(ms.sussexPriceChange||'').startsWith('-')?'stat-neg':'stat-pos'}">${esc(ms.sussexPriceChange||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Active Listings</span><span class="stat-value">${esc(ms.sussexInventory||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Inventory Change</span><span class="stat-value">${esc(ms.sussexInventoryChange||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Median Days on Market</span><span class="stat-value">${esc(ms.sussexDOM||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">DOM Change</span><span class="stat-value">${esc(ms.sussexDOMChange||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Months of Supply</span><span class="stat-value">${esc(ms.sussexMonthsSupply||'--')}</span></div>
          ${ms.sussexNewConstPct?`<div class="stat-row"><span class="stat-label-sm">New Construction %</span><span class="stat-value">${esc(ms.sussexNewConstPct)}</span></div>`:''}
        </div>
        <div class="stats-county">
          <h4 class="stats-county-title">Worcester County, MD</h4>
          <div class="stat-row"><span class="stat-label-sm">Median Sold Price</span><span class="stat-value">${esc(ms.worcesterMedianPrice||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">YoY Price Change</span><span class="stat-value ${(ms.worcesterPriceChange||'').startsWith('-')?'stat-neg':'stat-pos'}">${esc(ms.worcesterPriceChange||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Active Listings</span><span class="stat-value">${esc(ms.worcesterInventory||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Inventory Change</span><span class="stat-value">${esc(ms.worcesterInventoryChange||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Median Days on Market</span><span class="stat-value">${esc(ms.worcesterDOM||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">DOM Change</span><span class="stat-value">${esc(ms.worcesterDOMChange||'--')}</span></div>
          <div class="stat-row"><span class="stat-label-sm">Months of Supply</span><span class="stat-value">${esc(ms.worcesterMonthsSupply||'--')}</span></div>
        </div>
      </div>
      ${ms.marketCommentary?`<div class="market-commentary">${esc(ms.marketCommentary)}</div>`:''}
      ${ms.dataSource?`<div class="data-source">Source: ${esc(ms.dataSource)}</div>`:''}
    </div>`;
  }

  // Weekly video
  let videoHTML='';
  if(issue.videoUrl){
    const embedUrl=getEmbedUrl(issue.videoUrl);
    if(embedUrl){
      videoHTML=`
      <div class="section">
        <div class="section-title"><span class="section-icon icon-video">\uD83C\uDFA5</span> This Week's Video Update</div>
        <div class="video-wrapper"><iframe src="${esc(embedUrl)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>
        ${issue.videoCaption?`<div class="video-caption">${esc(issue.videoCaption)}</div>`:''}
      </div>`;
    }
  }

  // Niche Programs
  const nl=issue.nicheLinks||{};
  let nicheHTML=NICHE_PROGRAMS.map(p=>{
    const link=nl[p.tag]||'';
    const inner=`<div class="niche-icon" style="background:${p.color}20;color:${p.color}">${p.icon}</div>
      <div class="niche-body"><div class="niche-tag" style="color:${p.color}">${esc(p.tag)}</div>
      <div class="niche-desc">${esc(p.desc)}</div></div>`;
    if(link) return `<a href="${esc(link)}" target="_blank" rel="noopener" class="niche-card niche-linked">${inner}<span class="niche-arrow">\u2192</span></a>`;
    return `<div class="niche-card">${inner}</div>`;
  }).join('');

  document.getElementById('app').innerHTML=`
    <header class="pub-header"><div class="container">
      <div class="logo-text">Whitecap Mortgage</div>
      <div class="tagline">Weekly Coastal Mortgage &amp; Events Update \u2014 For Realtors</div>
      <div class="issue-date">${esc(issue.title)} \u00b7 ${esc(fmtDate(issue.date))}</div>
    </div></header>
    <main class="container" style="padding-top:24px;padding-bottom:20px;">
      <div style="margin-bottom:16px"><a href="#/" style="font-size:13px;color:var(--blue-600);text-decoration:none;font-weight:500">\u2190 All Issues</a></div>

      ${videoHTML}

      <div class="section">
        <div class="section-title"><span class="section-icon icon-rates">\uD83D\uDCCA</span> Mortgage Market Update</div>
        <div class="rate-direction-badge ${dirClass}"><span class="arrow">${dirArrow}</span> Rates ${esc(issue.rateDirection||'Flat')}</div>
        <div class="rate-snapshot-box">${esc(issue.rateSnapshot)}</div>
        <div class="commentary">${esc(issue.commentary).replace(/\n/g,'<br>')}</div>
      </div>

      ${marketStatsHTML}

      <div class="section">
        <div class="section-title"><span class="section-icon icon-events">\uD83C\uDF89</span> Local Coastal Events</div>
        ${eventsHTML}
      </div>

      <div class="section">
        <div class="section-title"><span class="section-icon icon-tip">\uD83D\uDCA1</span> Loan Program Tip of the Week</div>
        <span class="loan-program-tag">${esc(issue.loanProgramTag)}</span>
        <div class="who-for">${esc(issue.loanWhoFor).replace(/\n/g,'<br>')}</div>
        ${benefitsHTML}
        <div class="watch-out-box"><strong>\u26A0 Watch out:</strong> ${esc(issue.loanWatchOut)}</div>
      </div>

      <div class="section">
        <div class="section-title"><span class="section-icon icon-niche">\uD83D\uDD11</span> Niche Programs Available</div>
        <p class="niche-intro">Have a client with a unique situation? These specialty programs can help close deals other lenders can't.</p>
        <div class="niche-grid">${nicheHTML}</div>
      </div>

      <div class="contact-section">
        <div class="section-title"><span class="section-icon icon-tip">\u2709\uFE0F</span> Ask a Mortgage Question</div>
        <form onsubmit="submitContact(event,'${id}')">
          <div class="form-group"><label class="form-label">Your Name</label><input class="form-input" type="text" id="cName" required></div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="cEmail" required></div>
          <div class="form-group"><label class="form-label">Your Question</label><textarea class="form-textarea" id="cQuestion" rows="3" required></textarea></div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Send Question</button>
          <div class="inline-success" id="contactSuccess">Message sent! Mark will get back to you shortly.</div>
        </form>
      </div>
    </main>
    ${footerHTML()}`;
  window._curIssue=id;
}

// ---- Video embed helper ----
function getEmbedUrl(url){
  if(!url)return '';
  // YouTube
  let m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if(m)return 'https://www.youtube.com/embed/'+m[1];
  // Vimeo
  m=url.match(/vimeo\.com\/(\d+)/);
  if(m)return 'https://player.vimeo.com/video/'+m[1];
  // Loom
  m=url.match(/loom\.com\/share\/([\w-]+)/);
  if(m)return 'https://www.loom.com/embed/'+m[1];
  return '';
}

// ---- Contact ----
async function submitContact(e,issueId){
  e.preventDefault();
  const msg={id:uid(),name:document.getElementById('cName').value,email:document.getElementById('cEmail').value,question:document.getElementById('cQuestion').value,issueId:issueId||'',createdAt:new Date().toISOString()};
  _messages.push(msg); apiPost('/messages',msg);
  document.getElementById('cName').value='';document.getElementById('cEmail').value='';document.getElementById('cQuestion').value='';
  var s=document.getElementById('contactSuccess');if(s){s.style.display='block';setTimeout(()=>s.style.display='none',5000);}
}

// ========== ADMIN ==========
function adminNavHTML(act){
  return `<header class="admin-header"><div class="container-wide admin-header-inner">
    <a href="#/admin/issues" class="admin-logo">Whitecap Admin</a>
    <nav class="admin-nav">
      <a href="#/admin/issues" class="${act==='issues'?'active':''}">Issues</a>
      <a href="#/admin/leads" class="${act==='leads'?'active':''}">Leads</a>
      <a href="#/admin/messages" class="${act==='messages'?'active':''}">Messages</a>
      <a href="#/">View Site</a>
      <button onclick="_loggedIn=false;location.hash='#/admin/login'">Logout</button>
    </nav></div></header>`;
}

function renderAdminLogin(){
  if(_loggedIn){window.location.hash='#/admin/issues';return;}
  document.getElementById('app').innerHTML=`
    <div class="login-wrapper"><div class="login-box">
      <div class="login-logo">Whitecap Mortgage</div>
      <div class="login-sub">Newsletter Admin</div>
      <div id="loginError"></div>
      <form onsubmit="doLogin(event)">
        <div class="form-group"><label class="form-label">Admin Password</label>
          <input class="form-input" type="password" id="loginPw" required autofocus placeholder="Enter password"></div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Sign In</button>
      </form>
    </div></div>`;
}
async function doLogin(e){
  e.preventDefault();
  if(document.getElementById('loginPw').value===ADMIN_PASSWORD){
    _loggedIn=true;apiPost('/auth',{password:ADMIN_PASSWORD});
    window.location.hash='#/admin/issues';
  } else {
    document.getElementById('loginError').innerHTML='<div class="alert alert-error">Incorrect password. Try again.</div>';
  }
}

function renderAdminIssues(){
  const issues=[..._issues].sort((a,b)=>new Date(b.date)-new Date(a.date));
  let rows=!issues.length?'<tr><td colspan="4" class="empty-state">No issues yet. Create your first one!</td></tr>':
    issues.map(i=>`<tr>
      <td>${esc(fmtDate(i.date))}</td>
      <td><a href="#/issue/${i.id}">${esc(i.title)}</a></td>
      <td><span class="rate-badge rate-${(i.rateDirection||'flat').toLowerCase()}">${esc(i.rateDirection||'Flat')}</span></td>
      <td class="actions-cell"><a href="#/admin/issues/${i.id}/edit" class="btn btn-sm btn-outline">Edit</a>
        <button class="btn btn-sm btn-danger" onclick="deleteIssue('${i.id}')">Delete</button></td>
    </tr>`).join('');

  document.getElementById('app').innerHTML=`
    ${adminNavHTML('issues')}
    <div class="container-wide admin-body">
      <div class="flex-between" style="margin-bottom:24px">
        <div><h1 class="admin-page-title">Newsletter Issues</h1><p class="admin-subtitle">Create, edit, and manage your weekly updates.</p></div>
        <a href="#/admin/issues/new" class="btn btn-primary">+ New Issue</a>
      </div>
      <div class="admin-stats">
        <div class="stat-card"><div class="stat-num">${_issues.length}</div><div class="stat-label">Total Issues</div></div>
        <div class="stat-card"><div class="stat-num">${_leads.length}</div><div class="stat-label">Total Leads</div></div>
        <div class="stat-card"><div class="stat-num">${_messages.length}</div><div class="stat-label">Messages</div></div>
      </div>
      <div class="admin-table-wrapper"><table class="admin-table">
        <thead><tr><th>Date</th><th>Title</th><th>Rates</th><th>Actions</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`;
}

async function deleteIssue(id){
  if(!confirm('Delete this issue?'))return;
  _issues=_issues.filter(i=>i.id!==id);apiDel('/issues/'+id);
  if(window.location.hash.includes('/admin/issues')&&!window.location.hash.includes('/edit'))renderAdminIssues();
  else window.location.hash='#/admin/issues';
}

// ---- Editor ----
let editorEvents=[];

function renderAdminEditor(editId){
  const isEdit=!!editId;
  let issue={title:'',date:new Date().toISOString().split('T')[0],rateSnapshot:'',commentary:'',rateDirection:'Flat',events:[],loanProgramTag:'FHA',loanWhoFor:'',loanBenefits:['','',''],loanWatchOut:'',nicheLinks:{},marketStats:{sussexMedianPrice:'',sussexPriceChange:'',sussexInventory:'',sussexInventoryChange:'',sussexDOM:'',sussexDOMChange:'',sussexMonthsSupply:'',sussexNewConstPct:'',worcesterMedianPrice:'',worcesterPriceChange:'',worcesterInventory:'',worcesterInventoryChange:'',worcesterDOM:'',worcesterDOMChange:'',worcesterMonthsSupply:'',marketCommentary:'',dataSource:''},videoUrl:'',videoCaption:''};
  if(isEdit){
    const f=_issues.find(i=>i.id===editId);
    if(!f){window.location.hash='#/admin/issues';return;}
    issue={...issue,...f,loanBenefits:[...(f.loanBenefits||[]),'','',''].slice(0,3),marketStats:{...issue.marketStats,...(f.marketStats||{})},nicheLinks:{...issue.nicheLinks,...(f.nicheLinks||{})}};
  }
  editorEvents=[...(issue.events||[])].map(e=>({...e}));
  const ms=issue.marketStats||{};
  const nl=issue.nicheLinks||{};

  const progs=['FHA','VA','USDA','Conventional','Jumbo','DSCR','Bank Statement','Reverse Mortgage','Construction','HELOC','0 Down Vacation Home','Bridge Loan','Land Loan','Leased Land / Mobile'];
  const opts=progs.map(p=>`<option value="${p}" ${issue.loanProgramTag===p?'selected':''}>${p}</option>`).join('');

  // Niche link inputs
  const nicheInputs=NICHE_PROGRAMS.map(p=>`
    <div class="form-group"><label class="form-label">${esc(p.tag)} \u2014 Blog URL</label>
      <input class="form-input niche-link-input" type="url" data-niche="${esc(p.tag)}" value="${esc(nl[p.tag]||'')}" placeholder="https://yourblog.com/..."></div>`).join('');

  document.getElementById('app').innerHTML=`
    ${adminNavHTML('issues')}
    <div class="container-wide admin-body">
      <h1 class="admin-page-title">${isEdit?'Edit Issue':'Create New Issue'}</h1>
      <p class="admin-subtitle">Fill out each section, then save to publish.</p>

      <div class="editor-section">
        <div class="editor-section-title">\uD83D\uDCCB Issue Details</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="form-group"><label class="form-label">Issue Title / Week Label</label>
            <input class="form-input" type="text" id="ed_title" value="${esc(issue.title)}" placeholder="e.g. Week of March 2, 2026" required></div>
          <div class="form-group"><label class="form-label">Date</label>
            <input class="form-input" type="date" id="ed_date" value="${issue.date}" required></div>
        </div>
      </div>

      <div class="editor-section">
        <div class="editor-section-title">\uD83C\uDFA5 Weekly Video</div>
        <div class="form-group"><label class="form-label">Video URL (YouTube, Vimeo, or Loom)</label>
          <input class="form-input" type="url" id="ed_videoUrl" value="${esc(issue.videoUrl||'')}" placeholder="https://www.youtube.com/watch?v=..."></div>
        <div class="form-group"><label class="form-label">Video Caption (optional)</label>
          <input class="form-input" type="text" id="ed_videoCaption" value="${esc(issue.videoCaption||'')}" placeholder="e.g. This week I cover rate trends and a new bridge loan product..."></div>
      </div>

      <div class="editor-section">
        <div class="editor-section-title">\uD83D\uDCCA Mortgage Market Update</div>
        <div class="form-group"><label class="form-label">Rate Snapshot</label>
          <input class="form-input" type="text" id="ed_rateSnapshot" value="${esc(issue.rateSnapshot)}" placeholder="e.g. 30-yr fixed at 6.5%, 15-yr at 5.85%..."></div>
        <div class="form-group"><label class="form-label">Commentary (2\u20134 sentences)</label>
          <textarea class="form-textarea" id="ed_commentary" rows="4" placeholder="Your take on this week's rate trends...">${esc(issue.commentary)}</textarea></div>
        <div class="form-group"><label class="form-label">Rate Direction</label>
          <select class="form-select" id="ed_rateDirection">
            <option value="Up" ${issue.rateDirection==='Up'?'selected':''}>Up</option>
            <option value="Down" ${issue.rateDirection==='Down'?'selected':''}>Down</option>
            <option value="Flat" ${issue.rateDirection==='Flat'?'selected':''}>Flat</option>
          </select></div>
      </div>

      <div class="editor-section">
        <div class="editor-section-title">\uD83D\uDCC8 Coastal Market Stats</div>
        <h4 style="font-size:14px;color:var(--blue-700);margin-bottom:10px">Sussex County, DE</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="form-group"><label class="form-label">Median Sold Price</label><input class="form-input" type="text" id="ms_sussexMedianPrice" value="${esc(ms.sussexMedianPrice)}" placeholder="$480,000"></div>
          <div class="form-group"><label class="form-label">YoY Price Change</label><input class="form-input" type="text" id="ms_sussexPriceChange" value="${esc(ms.sussexPriceChange)}" placeholder="+2.2%"></div>
          <div class="form-group"><label class="form-label">Active Listings</label><input class="form-input" type="text" id="ms_sussexInventory" value="${esc(ms.sussexInventory)}" placeholder="1,863"></div>
          <div class="form-group"><label class="form-label">Inventory Change</label><input class="form-input" type="text" id="ms_sussexInventoryChange" value="${esc(ms.sussexInventoryChange)}" placeholder="+10.9%"></div>
          <div class="form-group"><label class="form-label">Median DOM</label><input class="form-input" type="text" id="ms_sussexDOM" value="${esc(ms.sussexDOM)}" placeholder="72 days"></div>
          <div class="form-group"><label class="form-label">DOM Change</label><input class="form-input" type="text" id="ms_sussexDOMChange" value="${esc(ms.sussexDOMChange)}" placeholder="+29 days YoY"></div>
          <div class="form-group"><label class="form-label">Months of Supply</label><input class="form-input" type="text" id="ms_sussexMonthsSupply" value="${esc(ms.sussexMonthsSupply)}" placeholder="3.73"></div>
          <div class="form-group"><label class="form-label">New Construction %</label><input class="form-input" type="text" id="ms_sussexNewConstPct" value="${esc(ms.sussexNewConstPct||'')}" placeholder="40%"></div>
        </div>
        <h4 style="font-size:14px;color:var(--blue-700);margin:16px 0 10px">Worcester County, MD</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="form-group"><label class="form-label">Median Sold Price</label><input class="form-input" type="text" id="ms_worcesterMedianPrice" value="${esc(ms.worcesterMedianPrice)}" placeholder="$407,500"></div>
          <div class="form-group"><label class="form-label">YoY Price Change</label><input class="form-input" type="text" id="ms_worcesterPriceChange" value="${esc(ms.worcesterPriceChange)}" placeholder="-8.7%"></div>
          <div class="form-group"><label class="form-label">Active Listings</label><input class="form-input" type="text" id="ms_worcesterInventory" value="${esc(ms.worcesterInventory)}" placeholder="646"></div>
          <div class="form-group"><label class="form-label">Inventory Change</label><input class="form-input" type="text" id="ms_worcesterInventoryChange" value="${esc(ms.worcesterInventoryChange)}" placeholder="+8.6%"></div>
          <div class="form-group"><label class="form-label">Median DOM</label><input class="form-input" type="text" id="ms_worcesterDOM" value="${esc(ms.worcesterDOM)}" placeholder="47 days"></div>
          <div class="form-group"><label class="form-label">DOM Change</label><input class="form-input" type="text" id="ms_worcesterDOMChange" value="${esc(ms.worcesterDOMChange)}" placeholder="+8 days YoY"></div>
          <div class="form-group"><label class="form-label">Months of Supply</label><input class="form-input" type="text" id="ms_worcesterMonthsSupply" value="${esc(ms.worcesterMonthsSupply)}" placeholder="3.96"></div>
        </div>
        <div class="form-group" style="margin-top:14px"><label class="form-label">Market Commentary</label>
          <textarea class="form-textarea" id="ms_marketCommentary" rows="3" placeholder="Summary for realtors...">${esc(ms.marketCommentary||'')}</textarea></div>
        <div class="form-group"><label class="form-label">Data Source</label>
          <input class="form-input" type="text" id="ms_dataSource" value="${esc(ms.dataSource||'')}" placeholder="Bright MLS \u2013 January 2026"></div>
      </div>

      <div class="editor-section">
        <div class="editor-section-title">\uD83C\uDF89 Local Coastal Events</div>
        <div id="eventsContainer"></div>
        <button type="button" class="btn btn-outline" style="margin-top:12px" onclick="addEditorEvent()">+ Add Event</button>
      </div>

      <div class="editor-section">
        <div class="editor-section-title">\uD83D\uDCA1 Loan Program Tip of the Week</div>
        <div class="form-group"><label class="form-label">Program Type</label>
          <select class="form-select" id="ed_loanTag">${opts}</select></div>
        <div class="form-group"><label class="form-label">Who This Is Great For</label>
          <textarea class="form-textarea" id="ed_loanWhoFor" rows="3" placeholder="Describe the ideal borrower...">${esc(issue.loanWhoFor)}</textarea></div>
        <div class="form-group"><label class="form-label">Key Benefit 1</label>
          <input class="form-input" type="text" id="ed_b1" value="${esc(issue.loanBenefits[0])}" placeholder="e.g. Down payment as low as 3.5%"></div>
        <div class="form-group"><label class="form-label">Key Benefit 2</label>
          <input class="form-input" type="text" id="ed_b2" value="${esc(issue.loanBenefits[1])}" placeholder="e.g. Flexible underwriting guidelines"></div>
        <div class="form-group"><label class="form-label">Key Benefit 3</label>
          <input class="form-input" type="text" id="ed_b3" value="${esc(issue.loanBenefits[2])}" placeholder="e.g. Seller concession up to 6%"></div>
        <div class="form-group"><label class="form-label">What to Watch Out For</label>
          <textarea class="form-textarea" id="ed_loanWatchOut" rows="2" placeholder="Common misconception or gotcha...">${esc(issue.loanWatchOut)}</textarea></div>
      </div>

      <div class="editor-section">
        <div class="editor-section-title">\uD83D\uDD11 Niche Program Links</div>
        <p style="font-size:13px;color:var(--gray-500);margin-bottom:14px">Paste the blog URL for each niche program. Leave blank if no blog exists yet.</p>
        ${nicheInputs}
      </div>

      <div class="editor-actions">
        <button class="btn btn-primary btn-lg" onclick="saveIssueFromEditor('${editId||''}')">Save &amp; Publish</button>
        <a href="#/admin/issues" class="btn btn-secondary">Cancel</a>
        ${isEdit?`<button class="btn btn-danger" onclick="deleteIssue('${editId}')">Delete Issue</button>`:''}
      </div>
    </div>`;
  renderEditorEvents();
}

function renderEditorEvents(){
  const c=document.getElementById('eventsContainer');if(!c)return;
  c.innerHTML=editorEvents.map((ev,i)=>`
    <div class="event-row">
      <button type="button" class="remove-event" onclick="removeEditorEvent(${i})">\u2715</button>
      <div class="event-grid">
        <div class="form-group"><label class="form-label">Event Name</label>
          <input class="form-input" type="text" value="${esc(ev.name)}" onchange="editorEvents[${i}].name=this.value"></div>
        <div class="form-group"><label class="form-label">Date</label>
          <input class="form-input" type="text" value="${esc(ev.date)}" onchange="editorEvents[${i}].date=this.value" placeholder="e.g. March 8, 2026"></div>
        <div class="form-group"><label class="form-label">Time</label>
          <input class="form-input" type="text" value="${esc(ev.time)}" onchange="editorEvents[${i}].time=this.value" placeholder="e.g. 9:00 AM"></div>
        <div class="form-group"><label class="form-label">Location</label>
          <input class="form-input" type="text" value="${esc(ev.location)}" onchange="editorEvents[${i}].location=this.value" placeholder="Town + Venue"></div>
        <div class="form-group full-width"><label class="form-label">Description</label>
          <input class="form-input" type="text" value="${esc(ev.description)}" onchange="editorEvents[${i}].description=this.value" placeholder="One-line description"></div>
        <div class="form-group full-width"><label class="form-label">URL (optional)</label>
          <input class="form-input" type="url" value="${esc(ev.url||'')}" onchange="editorEvents[${i}].url=this.value" placeholder="https://..."></div>
        <div class="form-group full-width"><label class="form-label">Image URL (optional)</label>
          <input class="form-input" type="url" value="${esc(ev.imageUrl||'')}" onchange="editorEvents[${i}].imageUrl=this.value" placeholder="https://...image.jpg"></div>
      </div>
    </div>`).join('');
}
function addEditorEvent(){if(editorEvents.length>=6){alert('Maximum 6 events.');return;}editorEvents.push({name:'',date:'',time:'',location:'',description:'',url:'',imageUrl:''});renderEditorEvents();}
function removeEditorEvent(i){editorEvents.splice(i,1);renderEditorEvents();}

async function saveIssueFromEditor(editId){
  const title=document.getElementById('ed_title').value.trim();
  const date=document.getElementById('ed_date').value;
  if(!title||!date){alert('Title and date are required.');return;}

  // Collect niche links
  const nicheLinks={};
  document.querySelectorAll('.niche-link-input').forEach(el=>{nicheLinks[el.dataset.niche]=el.value.trim();});

  // Collect market stats
  const msFields=['sussexMedianPrice','sussexPriceChange','sussexInventory','sussexInventoryChange','sussexDOM','sussexDOMChange','sussexMonthsSupply','sussexNewConstPct','worcesterMedianPrice','worcesterPriceChange','worcesterInventory','worcesterInventoryChange','worcesterDOM','worcesterDOMChange','worcesterMonthsSupply','marketCommentary','dataSource'];
  const marketStats={};
  msFields.forEach(f=>{const el=document.getElementById('ms_'+f);if(el)marketStats[f]=el.value.trim();});

  const d={
    title,date,
    rateSnapshot:document.getElementById('ed_rateSnapshot').value.trim(),
    commentary:document.getElementById('ed_commentary').value.trim(),
    rateDirection:document.getElementById('ed_rateDirection').value,
    events:editorEvents.filter(ev=>ev.name.trim()),
    loanProgramTag:document.getElementById('ed_loanTag').value,
    loanWhoFor:document.getElementById('ed_loanWhoFor').value.trim(),
    loanBenefits:[document.getElementById('ed_b1').value.trim(),document.getElementById('ed_b2').value.trim(),document.getElementById('ed_b3').value.trim()].filter(Boolean),
    loanWatchOut:document.getElementById('ed_loanWatchOut').value.trim(),
    nicheLinks,
    marketStats,
    videoUrl:document.getElementById('ed_videoUrl').value.trim(),
    videoCaption:document.getElementById('ed_videoCaption').value.trim()
  };
  if(editId){
    const idx=_issues.findIndex(i=>i.id===editId);
    if(idx!==-1){_issues[idx]={..._issues[idx],...d,updatedAt:new Date().toISOString()};}
    apiPut('/issues/'+editId,d);
  }else{
    d.id=uid();d.createdAt=new Date().toISOString();
    _issues.push(d);apiPost('/issues',d);
  }
  window.location.hash='#/admin/issues';
}

// ---- Admin Leads ----
function renderAdminLeads(){
  const leads=[..._leads].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  let rows=!leads.length?'<tr><td colspan="5" class="empty-state">No leads captured yet.</td></tr>':
    leads.map(l=>`<tr><td>${esc(l.name)}</td><td>${esc(l.email)}</td><td>${esc(l.journey||l.question||'')}</td><td>${esc((l.createdAt||'').split('T')[0])}</td><td>${esc((l.issueId||'').substring(0,8)||'N/A')}</td></tr>`).join('');
  document.getElementById('app').innerHTML=`
    ${adminNavHTML('leads')}
    <div class="container-wide admin-body">
      <div class="flex-between" style="margin-bottom:24px">
        <div><h1 class="admin-page-title">Captured Leads</h1><p class="admin-subtitle">Contacts collected from the newsletter.</p></div>
        <button class="btn btn-outline" onclick="exportLeadsCSV()">Export CSV</button>
      </div>
      <div class="admin-table-wrapper"><table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Info</th><th>Date</th><th>Issue</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`;
}

function renderAdminMessages(){
  const msgs=[..._messages].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  let rows=!msgs.length?'<tr><td colspan="4" class="empty-state">No messages yet.</td></tr>':
    msgs.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.email)}</td><td>${esc(m.question)}</td><td>${esc((m.createdAt||'').split('T')[0])}</td></tr>`).join('');
  document.getElementById('app').innerHTML=`
    ${adminNavHTML('messages')}
    <div class="container-wide admin-body">
      <div class="flex-between" style="margin-bottom:24px">
        <div><h1 class="admin-page-title">Messages</h1><p class="admin-subtitle">Questions submitted through the contact form.</p></div>
        <button class="btn btn-outline" onclick="exportMessagesCSV()">Export CSV</button>
      </div>
      <div class="admin-table-wrapper"><table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Question</th><th>Date</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`;
}

// ---- CSV ----
function dlCSV(fn,csv){const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;document.body.appendChild(a);a.click();document.body.removeChild(a);}
function ce(s){return '"'+String(s||'').replace(/"/g,'""')+'"';}
function exportLeadsCSV(){let c='Name,Email,Info,Date,Issue ID\n';_leads.forEach(l=>{c+=[ce(l.name),ce(l.email),ce(l.journey||l.question||''),ce((l.createdAt||'').split('T')[0]),ce(l.issueId)].join(',')+'\n';});dlCSV('whitecap-leads.csv',c);}
function exportMessagesCSV(){let c='Name,Email,Question,Date\n';_messages.forEach(m=>{c+=[ce(m.name),ce(m.email),ce(m.question),ce((m.createdAt||'').split('T')[0])].join(',')+'\n';});dlCSV('whitecap-messages.csv',c);}

function footerHTML(){
  return `<footer class="pub-footer"><div class="container">
    <div class="footer-name">Mark Succarote</div>
    <div class="footer-role">Mortgage Broker</div>
    <div class="footer-company">Whitecap Mortgage \u2013 Serving DE, MD, and PA</div>
    <div class="footer-contact"><a href="mailto:${EMAIL}">${EMAIL}</a> \u00b7 <a href="tel:${PHONE}">${PHONE}</a></div>
    <div style="margin-top:20px"><a href="${CTA_URL}" class="cta-button">Request a Rate Quote</a></div>
  </div></footer>`;
}
