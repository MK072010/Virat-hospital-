(function () {
  'use strict';
  var PH = '919694801604'; /* WhatsApp number: digits only with country code */
  var $ = function (s) { return document.querySelector(s); };
  var btn = $('.menu-btn'), nav = $('#nav');
  function setMenu(o) { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  var s = $('#dsearch');
  if (s) s.addEventListener('input', function () {
    var q = s.value.trim().toLowerCase(), n = 0;
    document.querySelectorAll('.dcard').forEach(function (c) { var m = c.getAttribute('data-s').indexOf(q) > -1; c.hidden = !m; if (m) n++; });
    $('#dnone').hidden = n > 0;
  });

  var form = $('#appt');
  if (!form) return;
  var status = $('#status'), dateEl = $('#date');
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var today = iso(new Date()); dateEl.min = today;
  function setErr(id, msg) { var el = $('#' + id); $('#e-' + id).textContent = msg; if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); return !msg; }
  function validate() {
    var digits = $('#phone').value.replace(/[\s\-()+]/g, ''), d = dateEl.value;
    return [
      setErr('name', $('#name').value.trim().length < 2 ? 'Enter your full name.' : ''),
      setErr('dept', $('#dept').value ? '' : 'Choose a department.'),
      setErr('date', !d ? 'Choose a preferred date.' : (d < today ? 'Choose today or a later date.' : '')),
      setErr('phone', /^\d{7,15}$/.test(digits) ? '' : 'Enter a phone number with 7 to 15 digits.')
    ].indexOf(false) === -1;
  }
  form.addEventListener('input', function (e) { if (e.target.hasAttribute('aria-invalid')) validate(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); status.textContent = '';
    if (!validate()) { var b = form.querySelector('[aria-invalid="true"]'); if (b) b.focus(); status.textContent = 'Please fix the highlighted fields.'; return; }
    var m = $('#msg').value.trim();
    var t = 'Hello Virat Hospital, I would like to request an appointment.\nName: ' + $('#name').value.trim() + '\nDepartment: ' + $('#dept').value + '\nPreferred date: ' + dateEl.value + '\nPhone: ' + $('#phone').value.trim() + (m ? '\nMessage: ' + m : '');
    var url = 'https://wa.me/' + PH + '?text=' + encodeURIComponent(t);
    status.textContent = 'Opening WhatsApp. Review the message and press send.';
    if (!window.open(url, '_blank', 'noopener')) window.location.href = url;
  });
})();
