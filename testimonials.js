/* NForceOne testimonial / employee-voice content architecture.
   Front-end content structure only — no CMS, no backend, no storage, no transmission.
   Public pages render ONLY records with status "Published" and the required consent flags.
   Everything else (Approval Pending / Unpublished / Removal Requested / missing consent)
   is intentionally never rendered to visitors. */
(function(){
'use strict';
if(window.__nf1TestimonialsBooted) return;
window.__nf1TestimonialsBooted = true;

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c];
  });
}

/* ---------- CLIENT TESTIMONIAL data model ----------
   Shape (for future approved content — do not add fabricated records):
   {
     type: 'client',
     name: 'Full Name',
     title: 'Job Title',
     company: 'Company Name',        // or an approved anonymized descriptor
     industry: 'Telecom',            // optional, used for slot personalization
     quote: 'Approved quote text.',
     photo: 'https://...',           // optional; approved photo/logo URL only
     status: 'Published',            // Approval Pending | Approved | Published | Unpublished | Removal Requested
     consent: { wording: true, attribution: true, photo: true },
     featured: false,
     order: 1
   }
   No approved client testimonials exist yet — this array is intentionally empty. */
window.NForceTestimonials = window.NForceTestimonials || [];

/* ---------- EMPLOYEE VOICE data model ----------
   {
     type: 'employee',
     name: 'Full Name',
     title: 'Job Title',
     team: 'Quality Engineering',
     quote: 'Approved quote text.',
     photo: 'https://...',           // optional; approved employee photo only
     status: 'Published',
     consent: { wording: true, nameTitle: true, photo: true },
     featured: false,
     order: 1
   }
   No approved employee voices exist yet — this array is intentionally empty. */
window.NForceEmployeeVoices = window.NForceEmployeeVoices || [];

/* In-memory only (never persisted, never transmitted) record of demo form activity,
   useful for local inspection while reviewing this front-end architecture. */
window.NForceStorySubmissions = window.NForceStorySubmissions || [];
window.NForceRemovalRequests = window.NForceRemovalRequests || [];

function isPublishableClient(rec){
  return rec && rec.status === 'Published' && rec.consent && rec.consent.wording && rec.consent.attribution &&
    (!rec.photo || rec.consent.photo);
}
function isPublishableEmployee(rec){
  return rec && rec.status === 'Published' && rec.consent && rec.consent.wording && rec.consent.nameTitle &&
    (!rec.photo || rec.consent.photo);
}

function photoImg(rec){
  if(!rec.photo) return '';
  return '<img src="' + esc(rec.photo) + '" alt="' + esc(rec.name) + '" style="width:48px;height:48px;border-radius:50%;object-fit:cover;margin-bottom:12px;display:block">';
}
function clientCardHTML(rec){
  var meta = [rec.title, rec.company].filter(Boolean).map(esc).join(', ');
  return '<article class="content-card reveal">' + photoImg(rec) +
    (rec.industry ? '<p class="eyebrow">' + esc(rec.industry) + '</p>' : '') +
    '<p>&ldquo;' + esc(rec.quote) + '&rdquo;</p>' +
    '<strong>' + esc(rec.name) + '</strong>' + (meta ? '<span class="small-label">' + meta + '</span>' : '') +
    '</article>';
}
function employeeCardHTML(rec){
  var meta = [rec.title, rec.team].filter(Boolean).map(esc).join(' &middot; ');
  return '<article class="content-card reveal">' + photoImg(rec) +
    '<p>&ldquo;' + esc(rec.quote) + '&rdquo;</p>' +
    '<strong>' + esc(rec.name) + '</strong>' + (meta ? '<span class="small-label">' + meta + '</span>' : '') +
    '</article>';
}

function emptyStatePanel(kind, context){
  var lead = kind === 'employee'
    ? (context ? 'Approved ' + esc(context) + ' employee stories' : 'Approved employee stories')
    : (context ? 'Approved ' + esc(context) + ' client testimonials' : 'Approved client testimonials');
  var footnote = kind === 'employee'
    ? 'Publication follows employee consent for wording, name/title and photo.'
    : 'Publication follows written client approval for name, title, company and quote.';
  return '<div class="panel reveal nf-voice-empty">' +
    '<p class="eyebrow">CONTENT READY</p>' +
    '<h3>' + lead + ' will be featured here as they become available.</h3>' +
    '<p>' + footnote + '</p>' +
    '</div>';
}

/* Homepage-only fallback: no fabricated testimonial, no "content ready" copy —
   existing project images standing in for not-yet-published client voices. */
function homepageVoiceImagePanel(){
  return '<div class="cv-image-grid reveal">' +
    '<div class="cv-image cv-image-team" role="img" aria-label="Collaborative engineering team environment"></div>' +
    '<div class="cv-image cv-image-ai" role="img" aria-label="AI and digital engineering technology"></div>' +
    '<div class="cv-image cv-image-cloud" role="img" aria-label="Cloud and data engineering"></div>' +
    '</div>';
}

function renderSlot(el, records, cardFn, kind){
  var context = el.getAttribute('data-testimonials-context') || el.getAttribute('data-employee-voice-context') || '';
  if(records.length){
    el.classList.add('content-grid');
    el.innerHTML = records
      .slice()
      .sort(function(a,b){ return (a.order||0) - (b.order||0); })
      .map(cardFn).join('');
  }else{
    el.classList.remove('content-grid');
    if(kind === 'client' && el.getAttribute('data-testimonials-slot') === 'homepage'){
      el.innerHTML = homepageVoiceImagePanel();
    }else{
      el.innerHTML = emptyStatePanel(kind, context);
    }
  }
}

function renderAll(){
  var clientPublished = window.NForceTestimonials.filter(isPublishableClient);
  var employeePublished = window.NForceEmployeeVoices.filter(isPublishableEmployee);
  document.querySelectorAll('[data-testimonials-slot]').forEach(function(el){
    renderSlot(el, clientPublished, clientCardHTML, 'client');
  });
  document.querySelectorAll('[data-employee-voice-slot]').forEach(function(el){
    renderSlot(el, employeePublished, employeeCardHTML, 'employee');
  });
}
window.NForceRenderTestimonials = renderAll;

/* ---------- Employee "Share Your Story" submission workflow (front-end only) ---------- */
function buildStoryModal(){
  if(document.getElementById('nf-story-backdrop')) return;
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div id="nf-story-backdrop" class="nf-story-backdrop" hidden>' +
      '<div id="nf-story-modal" class="content-card nf-story-modal" role="dialog" aria-modal="true" aria-labelledby="nf-story-title" hidden>' +
        '<button type="button" id="nf-story-close" aria-label="Close story submission">&#10005;</button>' +
        '<p class="eyebrow">SHARE YOUR STORY</p>' +
        '<h2 id="nf-story-title">Share Your NForceOne Story</h2>' +
        '<p>Tell us about your experience at NForceOne. Submissions are reviewed before any publication — nothing is published automatically.</p>' +
        '<form id="nf-story-form">' +
          '<label for="story-name">Name</label><input id="story-name" class="input" required>' +
          '<label for="story-title">Job Title</label><input id="story-title" class="input" required>' +
          '<label for="story-team">Team / Area</label><input id="story-team" class="input" placeholder="e.g. Quality Engineering">' +
          '<label for="story-quote">Your Testimonial</label><textarea id="story-quote" class="input" rows="4" required></textarea>' +
          '<label for="story-photo">Preferred Photo (optional)</label>' +
          '<input id="story-photo" type="file" accept="image/png,image/jpeg,image/webp" class="input">' +
          '<div class="nf-story-consent">' +
            '<label><input type="checkbox" id="consent-own" required> I confirm that I am submitting my own testimonial.</label>' +
            '<label><input type="checkbox" id="consent-publish" required> I consent to NForceOne using my testimonial, name and job title on the website.</label>' +
            '<label><input type="checkbox" id="consent-photo"> I consent to the use of the submitted photo on the website.</label>' +
          '</div>' +
          '<button type="submit" id="story-submit" class="btn btn-primary" disabled>Submit for Review</button>' +
          '<p id="story-status" class="small-label" aria-live="polite"></p>' +
        '</form>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap.firstElementChild);

  var backdrop = document.getElementById('nf-story-backdrop');
  var modal = document.getElementById('nf-story-modal');
  var closeBtn = document.getElementById('nf-story-close');
  var form = document.getElementById('nf-story-form');
  var nameInput = document.getElementById('story-name');
  var photoInput = document.getElementById('story-photo');
  var consentOwn = document.getElementById('consent-own');
  var consentPublish = document.getElementById('consent-publish');
  var consentPhoto = document.getElementById('consent-photo');
  var submitBtn = document.getElementById('story-submit');
  var statusEl = document.getElementById('story-status');
  var lastTrigger = null;

  function updateSubmitState(){
    var hasPhoto = photoInput.files && photoInput.files.length > 0;
    submitBtn.disabled = !(consentOwn.checked && consentPublish.checked && (!hasPhoto || consentPhoto.checked));
  }
  [consentOwn, consentPublish, consentPhoto, photoInput].forEach(function(el){
    el.addEventListener('change', updateSubmitState);
  });

  function resetModal(){
    form.reset();
    statusEl.textContent = '';
    updateSubmitState();
  }
  function openModal(trigger){
    lastTrigger = trigger || null;
    resetModal();
    backdrop.hidden = false;
    modal.hidden = false;
    setTimeout(function(){ nameInput.focus(); }, 30);
  }
  function closeModal(){
    backdrop.hidden = true;
    modal.hidden = true;
    resetModal();
    if(lastTrigger) lastTrigger.focus();
  }
  window.__nf1OpenStoryModal = openModal;

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e){ if(e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function(e){
    if(modal.hidden) return;
    if(e.key === 'Escape'){ closeModal(); return; }
    if(e.key === 'Tab'){
      var focusables = modal.querySelectorAll('button:not([disabled]), input, textarea, select, [href]');
      if(!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    /* Front-end demo only: this record is kept in memory for this page view only.
       Nothing is uploaded, transmitted, or written to localStorage/sessionStorage.
       Real publication requires NForceOne review and approval before it ever
       becomes a "Published" record above. */
    var hasPhoto = photoInput.files && photoInput.files.length > 0;
    window.NForceStorySubmissions.push({
      name: nameInput.value,
      title: document.getElementById('story-title').value,
      team: document.getElementById('story-team').value,
      quote: document.getElementById('story-quote').value,
      hasPhoto: hasPhoto,
      consent: { own: consentOwn.checked, publish: consentPublish.checked, photo: consentPhoto.checked },
      status: 'Approval Pending',
      submittedAt: Date.now()
    });
    statusEl.textContent = 'Thank you. Your story has been submitted for review.';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitted';
  });
}

function wireShareTriggers(){
  document.querySelectorAll('[data-share-story-trigger]').forEach(function(btn){
    btn.addEventListener('click', function(){
      buildStoryModal();
      window.__nf1OpenStoryModal(btn);
    });
  });
}

function wireRemovalRequests(){
  document.querySelectorAll('[data-removal-request]').forEach(function(btn){
    btn.addEventListener('click', function(){
      /* Front-end acknowledgement only — no personal data is collected, stored or sent. */
      window.NForceRemovalRequests.push({ ts: Date.now(), page: location.pathname });
      var statusId = btn.getAttribute('data-removal-status');
      var statusEl = statusId ? document.getElementById(statusId) : null;
      if(statusEl) statusEl.textContent = 'Your removal request has been recorded for review.';
    });
  });
}

function boot(){
  renderAll();
  wireShareTriggers();
  wireRemovalRequests();
}
if(document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
