const audio = document.getElementById('audio');
const recordButton = document.getElementById('recordButton');
const playButton = document.getElementById('playButton');
const playIcon = document.getElementById('playIcon');
const backButton = document.getElementById('backButton');
const forwardButton = document.getElementById('forwardButton');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const tapHint = document.getElementById('tapHint');
const lyricsEl = document.getElementById('lyrics');
const sectionLabel = document.getElementById('sectionLabel');
const letterDialog = document.getElementById('letterDialog');
const closeLetter = document.getElementById('closeLetter');
const letterButton = document.getElementById('letterButton');

// Lyrics are read manually; playback never changes their position.
const lyricTimeline = [
  { section: 'VERSE', text: '半年是一封拆封的信' },
  { section: 'VERSE', text: '风吹散了没说完的话' },
  { section: 'VERSE', text: '你要的不过一盏烛火' },
  { section: 'VERSE', text: '我却总在很远的渡口' },
  { section: 'VERSE', text: '心事结成一场冻雨' },
  { section: 'VERSE', text: '落成无人知晓的沉默' },
  { section: 'VERSE', text: '千言万语揉成雪' },
  { section: 'VERSE', text: '藏进每一次沉默的门锁' },

  { section: 'CHORUS', text: '原谅我如初雪的心' },
  { section: 'CHORUS', text: '落在你眼底融成了冷' },
  { section: 'CHORUS', text: '所有牵念藏在灯火阑珊处' },
  { section: 'CHORUS', text: '从未松开那年的手心' },
  { section: 'CHORUS', text: '往后所有春分与秋分' },
  { section: 'CHORUS', text: '把笨拙的温柔都酿成酒' },
  { section: 'CHORUS', text: '陪你饮尽' },

  { section: 'OUTRO', text: '渡过半生风雨' },
  { section: 'OUTRO', text: '此后 只愿与你 共赴余生' }
];


let hasStarted = false;
let letterUnlocked = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function buildLyrics() {
  const frag = document.createDocumentFragment();
  lyricTimeline.forEach((item, index) => {
    const p = document.createElement('p');
    p.className = 'lyric-line';
    p.dataset.index = String(index);
    p.textContent = item.text;
    frag.appendChild(p);
  });
  lyricsEl.appendChild(frag);
}

function updateProgress() {
  const duration = audio.duration || 221.4;
  const ratio = duration ? audio.currentTime / duration : 0;
  progress.value = String(Math.round(ratio * 1000));
  progress.style.setProperty('--progress', `${ratio * 100}%`);
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(duration);

}

async function togglePlayback() {
  try {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  } catch (error) {
    console.warn('Playback needs a direct user gesture.', error);
  }
}

function setPlaybackUi(isPlaying) {
  recordButton.classList.toggle('is-playing', isPlaying);
  playIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
  recordButton.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
  if (isPlaying) {
    hasStarted = true;
    tapHint.classList.add('is-hidden');
  }
}

function seekBy(delta) {
  audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), audio.duration || 221.4);
  updateProgress();
}

function openLetter() {
  if (typeof letterDialog.showModal === 'function' && !letterDialog.open) {
    letterDialog.showModal();
  } else {
    letterDialog.setAttribute('open', '');
  }
}

recordButton.addEventListener('click', togglePlayback);
playButton.addEventListener('click', togglePlayback);
backButton.addEventListener('click', () => seekBy(-10));
forwardButton.addEventListener('click', () => seekBy(10));
letterButton.addEventListener('click', openLetter);
closeLetter.addEventListener('click', () => letterDialog.close());

letterDialog.addEventListener('click', (event) => {
  if (event.target === letterDialog) letterDialog.close();
});

progress.addEventListener('input', () => {
  const duration = audio.duration || 221.4;
  audio.currentTime = (Number(progress.value) / 1000) * duration;
  updateProgress();
});

audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('play', () => setPlaybackUi(true));
audio.addEventListener('pause', () => setPlaybackUi(false));
audio.addEventListener('ended', () => {
  setPlaybackUi(false);
  letterUnlocked = true;
  letterButton.hidden = false;
  setTimeout(openLetter, 650);
});



// Media Session makes lock-screen controls feel native on supported phones.
if ('mediaSession' in navigator) {
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: '半程温柔，予你余生',
      artist: 'Private Record',
      album: 'A Letter, Finally Opened',
      artwork: [
        { src: 'assets/cover.jpg', sizes: '512x512', type: 'image/jpeg' }
      ]
    });
    navigator.mediaSession.setActionHandler('play', () => audio.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    navigator.mediaSession.setActionHandler('seekbackward', () => seekBy(-10));
    navigator.mediaSession.setActionHandler('seekforward', () => seekBy(10));
  } catch (_) {}
}

buildLyrics();

updateProgress();

// --- Click / touch star & snow particles ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnParticles(x, y) {
  const count = 12 + Math.floor(Math.random() * 7);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = .45 + Math.random() * 1.65;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - .35,
      gravity: .007 + Math.random() * .012,
      life: 1,
      decay: .012 + Math.random() * .013,
      size: 1.4 + Math.random() * 3.2,
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .06,
      kind: Math.random() > .5 ? 'star' : 'snow'
    });
  }
}

function drawStar(p) {
  const spikes = 4;
  const outer = p.size;
  const inner = p.size * .25;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = p.rotation + i * Math.PI / spikes;
    const px = p.x + Math.cos(a) * r;
    const py = p.y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawSnow(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.lineWidth = .7;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI / 3;
    const dx = Math.cos(a) * p.size;
    const dy = Math.sin(a) * p.size;
    ctx.moveTo(-dx, -dy);
    ctx.lineTo(dx, dy);
  }
  ctx.stroke();
  ctx.restore();
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= .997;
    p.rotation += p.vr;
    p.life -= p.decay;
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0, p.life) * .9})`;
    ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, p.life) * .75})`;
    if (p.kind === 'star') drawStar(p); else drawSnow(p);
  }
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('pointerdown', (event) => {
  if (letterDialog.open) return;
  spawnParticles(event.clientX, event.clientY);
}, { passive: true });

resizeCanvas();
animateParticles();
