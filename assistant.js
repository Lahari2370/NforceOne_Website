/* NForceOne persistent website assistant ("NF1 AI").
   Deterministic, front-end only, grounded in approved on-site content.
   No external API calls, no keys, no data transmission. */
(function(){
'use strict';
if(window.__nf1AssistantBooted) return;
window.__nf1AssistantBooted = true;

var path = location.pathname.toLowerCase();
var inPages = path.indexOf('/pages/') !== -1;

function pageUrl(name){
  if(name === 'index.html' || name.indexOf('index.html#') === 0){
    return inPages ? '../' + name : name;
  }
  return inPages ? name : '../pages/' + name;
}
function siteAsset(name){ return inPages ? '../' + name : name; }

function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c];
  });
}

/* ---------- Analytics-ready event hooks (no external calls) ---------- */
window.NForceAssistantEvents = window.NForceAssistantEvents || [];
function trackEvent(name, data){
  var evt = { name: name, data: data || {}, ts: Date.now(), page: location.pathname };
  window.NForceAssistantEvents.push(evt);
  if(window.dataLayer && typeof window.dataLayer.push === 'function'){
    var payload = { event: name };
    for(var k in (data||{})){ payload[k] = data[k]; }
    window.dataLayer.push(payload);
  }
}

/* ---------- Grounded knowledge base (approved site content only) ---------- */
var KB_ORDER = ['capabilities','ai','qa','digitalEngineering','dataCloud','telecom','engagement',
  'products','caseStudies','testimonials','careers','nf1Tool','qaDemo','apiDemo','contact'];

var KB = {
  capabilities: {
    keywords: ['capabilities','what does nforceone do','what do you do','pillars','services'],
    response: "NForceOne is an enterprise technology and engineering partner delivering AI, Quality Engineering and Digital Transformation at scale, organized around four capability pillars: AI & Agentic Solutions, Quality Engineering & AI Assurance, Digital Engineering, and Data, Cloud & Enterprise Platforms.",
    link: { href: 'index.html#services', label: 'Explore Our Capabilities' }
  },
  ai: {
    keywords: ['ai','agentic','generative ai','rag','conversational ai','voice ai','ai agent','ai application development'],
    response: "Our AI & Agentic Solutions capability covers Agentic AI, Generative AI, AI Agents, RAG, Intelligent Automation, Conversational AI, Voice AI, AI-enabled Enterprise Workflows and AI Application Development — engineered end to end, not just prototyped.",
    link: { href: 'ai.html', label: 'AI & Agentic Solutions' }
  },
  qa: {
    keywords: ['quality engineering','qa','automation testing','api testing','performance testing','llm evaluation','prompt regression','ai security testing','functional testing','end-to-end testing','agentic ai testing'],
    response: "Quality Engineering & AI Assurance spans Functional/End-to-End Testing, Test Automation, API Testing and Performance Testing, plus AI Assurance areas like Agentic AI Testing, LLM Evaluation, RAG/Hallucination Testing, Prompt Regression Testing, Voice/IVR Testing, Model Evaluation & Benchmarking and AI Security Testing.",
    link: { href: 'qa.html', label: 'Quality Engineering & AI Assurance' }
  },
  digitalEngineering: {
    keywords: ['digital engineering','application development','modernization','microservices','web and mobile','api development','product engineering','application support','enterprise applications'],
    response: "Digital Engineering covers Application Development, Application Modernization, Web & Mobile Development, API Development, Microservices, Enterprise Applications, Product Engineering and Application Support.",
    link: { href: 'engineering.html', label: 'Digital Engineering' }
  },
  dataCloud: {
    keywords: ['data engineering','cloud transformation','aws','azure','gcp','devops','analytics','sap','pega','digital transformation','enterprise integration','cloud'],
    response: "Data, Cloud & Enterprise Platforms includes Data Engineering, Cloud Transformation across AWS/Azure/GCP, DevOps, Analytics, Enterprise Integration, SAP and PEGA — the platform foundation for Digital Transformation.",
    link: { href: 'data.html', label: 'Data, Cloud & Enterprise Platforms' }
  },
  telecom: {
    keywords: ['telecom','oss','bss','billing','provisioning','ivr','network operations','field service','order management','service activation'],
    response: "Telecom is a strategic domain for NForceOne, covering OSS/BSS Transformation, Telecom Quality Engineering, AI & Customer Experience (virtual agents, Voice AI, IVR), Network & Field Operations, and Telecom Data & Automation.",
    link: { href: 'industry.html?industry=telecommunication', label: 'Telecom Industry' }
  },
  engagement: {
    keywords: ['engagement model','onshore','offshore','hybrid delivery','staff augmentation','managed delivery','sow','t&m'],
    response: "We engage flexibly — Onshore, Offshore, Hybrid, Managed Delivery, Project/SOW, or T&M/Staff Augmentation — depending on what fits your team and outcomes.",
    link: { href: 'contact.html', label: 'Discuss Engagement Options' }
  },
  products: {
    keywords: ['product','qforce','aiktra','onehr','nforce arena','pulse','sync','tracktion','flightops','auraface','nforce identity','modozo','ask navi','retailops','innovation'],
    response: "NForceOne builds internal products and accelerators — including QForce AI, AIKTRA, OneHR, NForce Arena, Pulse, Sync, Tracktion, FlightOps, AuraFace / NForce Identity, Modozo, Ask Navi and NForce RetailOps. I can help you explore NForceOne's product portfolio — detailed product information can be provided through approved product profiles.",
    link: { href: 'products.html', label: 'Innovation & Products' }
  },
  caseStudies: {
    keywords: ['case stud','client result','metric','client name','success story','proof point'],
    response: "Approved case-study information is available through our Case Studies section. Specific client names, metrics or results are only shared once approved for publication — or I can connect you with our team for more detail.",
    link: { href: 'case-studies.html', label: 'Case Studies' }
  },
  testimonials: {
    keywords: ['testimonial','review','client feedback','what do clients say'],
    response: "We don't publish testimonials until they're approved by the client. Approved testimonials and case studies will appear in our Case Studies section as they become available.",
    link: { href: 'case-studies.html', label: 'Case Studies' }
  },
  careers: {
    keywords: ['career','job','hiring','join nforceone','opportunit'],
    response: "NForceOne is a people-first technology team focused on engineering, quality and continuous learning. You can explore open opportunities on our Careers page.",
    link: { href: 'careers.html', label: 'Careers' }
  },
  nf1Tool: {
    keywords: ['test scenario','scenario generator','generate test cases','nf1 ai tool'],
    response: "For hands-on test-scenario generation, try our NF1 AI tool — describe a feature or requirement and get structured testing ideas.",
    link: { href: 'nf1.html', label: 'Open NF1 AI' }
  },
  qaDemo: {
    keywords: ['qa control center','run qa checks','quality dashboard demo'],
    response: "You can run our live QA Control Center to see automated browser-based quality checks in action.",
    link: { href: 'qa.html', label: 'Open QA Control Center' }
  },
  apiDemo: {
    keywords: ['api testing lab','api demo','mock api'],
    response: "Try our API Testing Lab — a hands-on demo of request/response validation and assertions.",
    link: { href: 'api.html', label: 'Open API Testing Lab' }
  },
  contact: {
    keywords: ['contact','get in touch','who do i talk to'],
    response: "I can connect you with our team.",
    link: { href: 'contact.html', label: 'Talk to an Expert' }
  }
};

function matchKeyword(text, kw){
  if(kw.length <= 3){
    return new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(text);
  }
  return text.toLowerCase().indexOf(kw.toLowerCase()) !== -1;
}
function findAnswer(text){
  for(var i=0;i<KB_ORDER.length;i++){
    var key = KB_ORDER[i], item = KB[key];
    for(var j=0;j<item.keywords.length;j++){
      if(matchKeyword(text, item.keywords[j])) return { key:key, item:item };
    }
  }
  return null;
}
/* ---------- Guardrails ---------- */
var CONFIDENTIAL_WORDS = ['revenue','pricing','price list','salary','how many employees',
  'employee count','confidential','proprietary','client name','customer name','client list'];
function isConfidential(text){
  var t = text.toLowerCase();
  for(var i=0;i<CONFIDENTIAL_WORDS.length;i++){ if(t.indexOf(CONFIDENTIAL_WORDS[i]) !== -1) return true; }
  return false;
}

var LEAD_PATTERNS = [
  { re: /\b(request(ing)?\s+an?\s+)?assessment\b/i, kind: 'assessment' },
  { re: /\brequest(ing)?\s+a\s+demo\b|\bproduct\s+demo\b/i, kind: 'demo' },
  { re: /talk\s+to\s+(someone|an?\s*expert|a\s*person|a\s*human)|speak\s+(with|to)\s+(someone|a\s*person|your\s*team)/i, kind: 'handoff' },
  { re: /discuss\s+(my|your|a)?\s*project|contact\s+(nforceone|you|the\s*team)/i, kind: 'contact' }
];
function classifyIntent(text){
  for(var i=0;i<LEAD_PATTERNS.length;i++){ if(LEAD_PATTERNS[i].re.test(text)) return LEAD_PATTERNS[i].kind; }
  return null;
}

/* ---------- Page-aware context ---------- */
function pageContext(){
  var p = path, qs = location.search.toLowerCase();
  if(/\/ai\.html/.test(p)) return "You're exploring AI & Agentic Solutions. Ask me about Agentic AI, Generative AI, RAG, Voice AI and more.";
  if(/\/qa\.html/.test(p)) return "I can help you explore automation, API testing, performance testing, AI Assurance and other Quality Engineering capabilities.";
  if(/\/engineering\.html|service-details\.html\?service=(software|enterprise)/.test(p+qs)) return "You're exploring Digital Engineering. Ask about application development, modernization, microservices and more.";
  if(/\/data\.html|service-details\.html\?service=cloud/.test(p+qs)) return "You're exploring Data, Cloud & Enterprise Platforms. Ask about cloud transformation, AWS/Azure/GCP, DevOps, SAP or PEGA.";
  if(/\/industry\.html/.test(p) && qs.indexOf('telecommunication') !== -1) return "You're exploring Telecom. I can help you explore OSS/BSS, Telecom Quality Engineering, AI & Customer Experience, Network & Field Operations, or Telecom Data & Automation.";
  if(/\/industr(y|ies)\.html/.test(p)) return "You're exploring our Industries. Telecom is a particularly deep domain for us — want to learn more?";
  if(/\/products\.html/.test(p)) return "You're exploring Innovation & Products. Ask me about our product inventory or request a demo.";
  if(/\/case-studies\.html/.test(p)) return "You're exploring Case Studies. Ask me about client or product case studies.";
  if(/\/careers\.html/.test(p)) return "I can help you explore careers and navigate to the available opportunities.";
  if(/\/contact\.html/.test(p)) return "Looks like you're ready to get in touch — I can help route your message.";
  return null;
}

/* ---------- UI construction ---------- */
function boot(){
  var root = document.createElement('div');
  root.id = 'nf1-assistant-root';
  root.innerHTML =
    '<button id="nf1-assistant-launcher" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="nf1-assistant-panel" aria-label="Open NF1 AI website assistant">' +
      '<img src="' + siteAsset('nf1-ai-robot.png') + '" alt="NF1 AI">' +
    '</button>' +
    '<div id="nf1-assistant-panel" class="chat nf1-assistant-panel" role="dialog" aria-modal="false" aria-label="NF1 AI website assistant" hidden>' +
      '<div class="chat-header">' +
        '<div><h3>NF1 AI</h3></div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<span class="status-dot" aria-hidden="true"></span>' +
          '<button type="button" id="nf1-assistant-close" class="nf1-assistant-close" aria-label="Close assistant">✕</button>' +
        '</div>' +
      '</div>' +
      '<div id="nf1-assistant-messages" class="chat-messages" aria-live="polite"></div>' +
      '<p class="small-label nf1-assistant-quick-label">Try asking</p>' +
      '<div id="nf1-assistant-quick" class="button-row nf1-assistant-quick"></div>' +
      '<div class="chat-input-row">' +
        '<input id="nf1-assistant-input" class="input" placeholder="Ask about capabilities, industries, products…" aria-label="Message NF1 AI" autocomplete="off">' +
        '<button id="nf1-assistant-send" class="btn btn-primary" type="button">Send</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  var launcher = document.getElementById('nf1-assistant-launcher');
  var panel = document.getElementById('nf1-assistant-panel');
  var closeBtn = document.getElementById('nf1-assistant-close');
  var messagesEl = document.getElementById('nf1-assistant-messages');
  var quickEl = document.getElementById('nf1-assistant-quick');
  var quickLabelEl = document.querySelector('.nf1-assistant-quick-label');
  var input = document.getElementById('nf1-assistant-input');
  var sendBtn = document.getElementById('nf1-assistant-send');
  var welcomed = false;

  var QUICK = [
    'What does NForce One do?',
    'How can NForce One help with AI?',
    'Tell me about Quality Engineering',
    'What Telecom solutions do you provide?',
    'Show me NForce One products'
  ];
  QUICK.forEach(function(q){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn-outline'; b.textContent = q;
    b.addEventListener('click', function(){
      trackEvent('assistant_suggested_question', { text: q });
      handleUserMessage(q);
    });
    quickEl.appendChild(b);
  });

  function scrollToBottom(){ messagesEl.scrollTop = messagesEl.scrollHeight; }
  function addBubble(html, isUser){
    var d = document.createElement('div');
    d.className = 'bubble ' + (isUser ? 'bubble-user' : 'bubble-ai');
    d.innerHTML = '<span class="small-label">' + (isUser ? 'You' : 'NF1 AI') + '</span>' + html;
    messagesEl.appendChild(d);
    scrollToBottom();
  }
  function addNavAction(link){
    var row = document.createElement('div');
    row.className = 'button-row';
    var a = document.createElement('a');
    a.href = pageUrl(link.href); a.className = 'btn btn-outline'; a.textContent = link.label;
    a.addEventListener('click', function(){ trackEvent('assistant_navigation', { to: link.href, label: link.label }); });
    row.appendChild(a);
    messagesEl.appendChild(row);
    scrollToBottom();
  }
  function showHumanFallback(){
    addBubble('Would you like to speak with an NForceOne expert?', false);
    var row = document.createElement('div');
    row.className = 'button-row';
    row.innerHTML = '<a class="btn btn-primary" href="' + pageUrl('contact.html') + '">Talk to an Expert</a>' +
      '<a class="btn btn-outline" href="' + pageUrl('contact.html') + '">Contact Us</a>';
    var links = row.querySelectorAll('a');
    for(var i=0;i<links.length;i++){
      links[i].addEventListener('click', function(){ trackEvent('assistant_handoff', { page: location.pathname }); });
    }
    messagesEl.appendChild(row);
    scrollToBottom();
  }
  function normalizeCompanyName(text){
    return String(text||'').replace(/nforce\s+one/gi, 'nforceone');
  }
  function respondTo(rawText){
    var text = normalizeCompanyName(rawText);
    if(isConfidential(text)){
      addBubble('I can only provide approved public information. Please contact the NForceOne team for additional details.', false);
      showHumanFallback();
      return;
    }
    var intent = classifyIntent(text);
    if(intent){
      if(intent === 'demo') trackEvent('assistant_demo_request', { text: text });
      else if(intent === 'assessment') trackEvent('assistant_assessment_request', { text: text });
      else trackEvent('assistant_contact_intent', { text: text, intent: intent });
      addBubble("I can help connect you with our team.", false);
      showHumanFallback();
      return;
    }
    var hit = findAnswer(text);
    if(hit){
      addBubble(hit.item.response, false);
      if(hit.item.link) addNavAction(hit.item.link);
      return;
    }
    addBubble("I don't have approved information for that yet. I can help you explore NForceOne's capabilities or connect you with the team.", false);
    showHumanFallback();
  }

  function handleUserMessage(text){
    text = (text||'').trim();
    if(!text) return;
    if(quickEl.style.display !== 'none'){
      quickEl.style.display = 'none';
      if(quickLabelEl) quickLabelEl.style.display = 'none';
    }
    addBubble(esc(text), true);
    setTimeout(function(){ respondTo(text); }, 260);
  }

  function send(){
    var t = input.value;
    input.value = '';
    trackEvent('assistant_question', { text: t });
    handleUserMessage(t);
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); send(); } });

  var WELCOME_CTAS = [
    { href: 'index.html#services', label: 'Explore Capabilities' },
    { href: 'products.html', label: 'View Products' },
    { href: 'case-studies.html', label: 'View Case Studies' },
    { href: 'contact.html', label: 'Contact Our Team' }
  ];
  function addWelcomeCtas(){
    var row = document.createElement('div');
    row.className = 'button-row';
    WELCOME_CTAS.forEach(function(link){
      var a = document.createElement('a');
      a.href = pageUrl(link.href); a.className = 'btn btn-outline'; a.textContent = link.label;
      a.addEventListener('click', function(){ trackEvent('assistant_navigation', { to: link.href, label: link.label }); });
      row.appendChild(a);
    });
    messagesEl.appendChild(row);
    scrollToBottom();
  }
  function openPanel(){
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    if(!welcomed){
      welcomed = true;
      addBubble("Hi, I'm NF1 AI Assistant.<br>How can I help you explore NForceOne?", false);
      var ctx = pageContext();
      if(ctx) addBubble(ctx, false);
      addWelcomeCtas();
    }
    trackEvent('assistant_open', { page: location.pathname });
    setTimeout(function(){ input.focus(); }, 50);
  }
  function closePanel(){
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    trackEvent('assistant_close', { page: location.pathname });
    launcher.focus();
  }
  launcher.addEventListener('click', function(){
    if(panel.hidden) openPanel(); else closePanel();
  });
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !panel.hidden) closePanel();
  });
  document.addEventListener('click', function(e){
    if(!panel.hidden && !panel.contains(e.target) && !launcher.contains(e.target)) closePanel();
  });
}

if(document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
