/**
 * PRIVATE VIEW COUNTER / ANALYTICS
 * --------------------------------
 * GitHub Pages is static hosting, so the cleanest "backend-only" page-view count
 * is to send page views to an analytics backend such as Google Analytics 4.
 * Nothing is rendered on the front end.
 *
 * 1) Create a GA4 Web data stream.
 * 2) Paste your Measurement ID below (example: G-ABC1234567).
 * 3) Push the change. Page views will appear in GA4 Reports / Realtime.
 */
const GA_MEASUREMENT_ID = 'G-X8713E4GB8';

if (GA_MEASUREMENT_ID && /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID)) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true
  });
}

// Events remain inactive until the owner's Measurement ID is configured.
document.addEventListener('DOMContentLoaded', () => {
  const track = (name, params = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
  const media = document.getElementById('audio');
  let started = false;
  media.addEventListener('play', () => {
    track(started ? 'music_resume' : 'music_start');
    started = true;
  });
  media.addEventListener('ended', () => {
    track('music_complete');
    started = false;
  });
  for (const id of ['recordButton', 'playButton', 'backButton', 'forwardButton', 'letterButton']) {
    document.getElementById(id).addEventListener('click', () => track('player_click', { control: id }));
  }
  const dialog = document.getElementById('letterDialog');
  let opened = dialog.open;
  new MutationObserver(() => {
    if (dialog.open && !opened) track('letter_open');
    opened = dialog.open;
  }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
});
