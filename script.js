/* ============================================
   WEDDING INVITATION — JAVASCRIPT
   ============================================ */

// ─── YouTube IFrame API — Music Player ───
let ytPlayer = null;
let isMusicPlaying = false;
let ytReady = false;
let pendingPlay = false; // play requested before player was ready

// Called by YouTube API when ready
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytPlayerContainer', {
    height: '1',
    width: '1',
    videoId: 'D7_jK_g4m54', // Maher Zain - For The Rest Of My Life
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: 'D7_jK_g4m54',
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    }
  });
}

function onPlayerReady() {
  ytReady = true;
  ytPlayer.setVolume(60);
  // If user already clicked "enter" before player was ready, play now
  if (pendingPlay) {
    pendingPlay = false;
    ytPlayer.playVideo();
    isMusicPlaying = true;
    updateMusicUI(true);
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    ytPlayer.seekTo(0);
    ytPlayer.playVideo();
  }
  if (event.data === YT.PlayerState.PLAYING) {
    isMusicPlaying = true;
    updateMusicUI(true);
  }
  if (event.data === YT.PlayerState.PAUSED) {
    isMusicPlaying = false;
    updateMusicUI(false);
  }
}

function onPlayerError() {
  // On error, retry after 2 seconds
  setTimeout(() => {
    if (pendingPlay || isMusicPlaying) {
      try { ytPlayer.playVideo(); } catch(e) {}
    }
  }, 2000);
}

function startMusic() {
  if (ytReady && ytPlayer) {
    try {
      ytPlayer.playVideo();
      isMusicPlaying = true;
      updateMusicUI(true);
    } catch(e) {
      pendingPlay = true;
    }
  } else {
    // Player not ready yet — set a flag, will play in onPlayerReady
    pendingPlay = true;
  }
}

function pauseMusic() {
  pendingPlay = false;
  if (ytReady && ytPlayer) {
    try {
      ytPlayer.pauseVideo();
    } catch(e) {}
  }
  isMusicPlaying = false;
  updateMusicUI(false);
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    startMusic();
  }
}

function updateMusicUI(playing) {
  const musicToggle = document.getElementById('musicToggle');
  if (!musicToggle) return;
  const onIcon = musicToggle.querySelector('.music-on');
  const offIcon = musicToggle.querySelector('.music-off');

  if (playing) {
    onIcon.style.display = 'block';
    offIcon.style.display = 'none';
    musicToggle.classList.add('playing');
  } else {
    onIcon.style.display = 'none';
    offIcon.style.display = 'block';
    musicToggle.classList.remove('playing');
  }
}


document.addEventListener('DOMContentLoaded', () => {

  // ─── Splash Screen ───
  const splashOverlay = document.getElementById('splashOverlay');
  const splashEnterBtn = document.getElementById('splashEnterBtn');

  document.body.classList.add('splash-active');

  splashEnterBtn.addEventListener('click', () => {
    splashOverlay.classList.add('hidden');
    document.body.classList.remove('splash-active');

    // Start music after user click (bypasses autoplay policy)
    startMusic();

    setTimeout(() => {
      if (splashOverlay.parentNode) {
        splashOverlay.parentNode.removeChild(splashOverlay);
      }
    }, 1000);
  });


  // ─── Countdown Timer ───
  const weddingDate = new Date('2026-05-15T07:00:00+05:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '🎉';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ─── Scroll Animations ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


  // ─── Navbar Scroll Effect ───
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  // ─── Mobile Navigation Toggle ───
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });


  // ─── Firebase Initialization ───
  const firebaseConfig = {
    apiKey: "AIzaSyC4_GGwwrRmAfGmVf23SSJGRNgJ7pSI_xQ",
    authDomain: "wedding-website-a1623.firebaseapp.com",
    projectId: "wedding-website-a1623",
    storageBucket: "wedding-website-a1623.firebasestorage.app",
    messagingSenderId: "984293485960",
    appId: "1:984293485960:web:0b88944e7cac0ff43b5e3d",
    databaseURL: "https://wedding-website-a1623-default-rtdb.europe-west1.firebasedatabase.app"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const wishesRef = db.ref('wishes');

  // ─── Load Existing Wishes from Firebase (Paginated) ───
  const WISHES_PER_PAGE = 6;
  let firstKeyLoaded = null; 
  let latestKeyLoaded = null; 

  const loadMoreBtn = document.getElementById('loadMoreWishesBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', fetchOlderWishes);
  }

  function loadWishes() {
    const wishesGrid = document.getElementById('wishesGrid');
    const wishesEmptyHint = document.getElementById('wishesEmptyHint');
    wishesGrid.innerHTML = '';

    // Step 1: Fetch initial page (Latest WISHES_PER_PAGE)
    wishesRef.orderByKey().limitToLast(WISHES_PER_PAGE).once('value', snapshot => {
      const wishes = [];
      snapshot.forEach(child => {
        wishes.push({ key: child.key, val: child.val() });
      });

      if (wishes.length > 0) {
        firstKeyLoaded = wishes[0].key;
        latestKeyLoaded = wishes[wishes.length - 1].key;
      }

      wishes.forEach(wishObj => {
        appendWishCard(wishObj.val.name, wishObj.val.message, wishObj.val.timestamp, true);
      });

      if (wishes.length < WISHES_PER_PAGE && loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
      } else if (loadMoreBtn && wishes.length > 0) {
        loadMoreBtn.style.display = 'inline-flex';
      }
      
      if (wishes.length === 0 && wishesEmptyHint) wishesEmptyHint.style.display = 'block';
      else if (wishesEmptyHint) wishesEmptyHint.style.display = 'none';

      // Step 2: Listen for NEW wishes added AFTER `latestKeyLoaded`
      listenForNewWishes(latestKeyLoaded);
    });
  }

  function fetchOlderWishes() {
    if (!firstKeyLoaded) return;
    const oldBtnText = loadMoreBtn.querySelector('.btn-text').textContent;
    loadMoreBtn.querySelector('.btn-text').textContent = 'Yuklanmoqda...';
    loadMoreBtn.disabled = true;

    wishesRef.orderByKey().endAt(firstKeyLoaded).limitToLast(WISHES_PER_PAGE + 1).once('value', snapshot => {
      const wishes = [];
      snapshot.forEach(child => {
        if (child.key !== firstKeyLoaded) {
          wishes.push({ key: child.key, val: child.val() });
        }
      });

      if (wishes.length > 0) {
        firstKeyLoaded = wishes[0].key;
        for (let i = wishes.length - 1; i >= 0; i--) {
          const wishObj = wishes[i];
          appendWishCard(wishObj.val.name, wishObj.val.message, wishObj.val.timestamp, false); // append to bottom
        }
      }

      if (wishes.length < WISHES_PER_PAGE) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.disabled = false;
        loadMoreBtn.querySelector('.btn-text').textContent = oldBtnText;
      }
    });
  }

  function listenForNewWishes(afterKey) {
    let query = wishesRef.orderByKey();
    if (afterKey) {
       query = query.startAt(afterKey);
    }
    query.on('child_added', snapshot => {
      if (afterKey && snapshot.key === afterKey) return; // skip the overlapping one
      latestKeyLoaded = snapshot.key;
      const wish = snapshot.val();
      appendWishCard(wish.name, wish.message, wish.timestamp, true); // prepend top
      const wishesEmptyHint = document.getElementById('wishesEmptyHint');
      if (wishesEmptyHint) wishesEmptyHint.style.display = 'none';
    });
  }

  function appendWishCard(name, message, timestamp, prepend = true) {
    const wishesGrid = document.getElementById('wishesGrid');
    const wishesEmptyHint = document.getElementById('wishesEmptyHint');
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const UZ_MONTHS = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
    let time = '';
    if (timestamp) {
      const d = new Date(timestamp);
      time = `${d.getDate()} ${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }

    const wishCard = document.createElement('div');
    wishCard.className = 'wish-card animate-on-scroll visible';
    wishCard.innerHTML = `
      <div class="wish-avatar">${initials}</div>
      <div class="wish-content">
        <h4>${escapeHtml(name)}</h4>
        <p>"${escapeHtml(message)}"</p>
        ${time ? `<span class="wish-time">${time}</span>` : ''}
      </div>
    `;

    if (prepend) {
      wishesGrid.insertBefore(wishCard, wishesGrid.firstChild);
    } else {
      wishesGrid.appendChild(wishCard);
    }

    if (wishesEmptyHint) wishesEmptyHint.style.display = 'none';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadWishes();


  // ─── Phone Input Mask & Validation ───
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('998')) val = val.slice(3);
      val = val.slice(0, 9);
      let formatted = '+998';
      if (val.length > 0) formatted += ' ' + val.slice(0, 2);
      if (val.length > 2) formatted += ' ' + val.slice(2, 5);
      if (val.length > 5) formatted += ' ' + val.slice(5, 7);
      if (val.length > 7) formatted += ' ' + val.slice(7, 9);
      e.target.value = formatted;
      if (phoneError) phoneError.style.display = 'none';
    });

    phoneInput.addEventListener('keydown', (e) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') &&
          phoneInput.selectionStart <= 4 && phoneInput.selectionEnd <= 4) {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+998 ';
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === '+998 ' || phoneInput.value === '+998') {
        phoneInput.value = '';
      }
    });
  }

  function validatePhone() {
    if (!phoneInput || !phoneInput.value) return true; // optional — empty OK
    const pattern = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
    if (!pattern.test(phoneInput.value)) {
      if (phoneError) phoneError.style.display = 'block';
      phoneInput.focus();
      return false;
    }
    if (phoneError) phoneError.style.display = 'none';
    return true;
  }


  // ─── Tilak / RSVP Form ───
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const submitBtn = document.getElementById('submitBtn');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validatePhone()) return;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Yuborilmoqda...';

    const formData = new FormData(rsvpForm);
    const data = Object.fromEntries(formData.entries());

    if (data.message && data.message.trim()) {
      const wishEntry = {
        name: data.fullname,
        message: data.message.trim(),
        phone: data.phone || '',
        timestamp: new Date().toISOString()
      };

      // Save wish to Firebase
      wishesRef.push(wishEntry)
        .then(() => {
          rsvpForm.style.display = 'none';
          rsvpSuccess.classList.add('show');
          createConfetti();
        })
        .catch((err) => {
          console.error("Firebase Error: ", err);
          alert("Xatolik yuz berdi. Internetni tekshirib qayta urinib ko'ring.");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = 'Tilak yuborish';
        });
    } else {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Tilak yuborish';
    }
  });


  // ─── Floating Petals ───
  const petalsContainer = document.getElementById('petalsContainer');
  const petalColors = [
    'rgba(212, 165, 165, 0.6)',
    'rgba(245, 230, 224, 0.5)',
    'rgba(201, 169, 110, 0.4)',
    'rgba(156, 173, 152, 0.4)',
    'rgba(212, 165, 116, 0.4)',
  ];

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const size = Math.random() * 12 + 6;
    const startX = Math.random() * 100;
    const duration = Math.random() * 8 + 8;
    const delay = Math.random() * 3;
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];

    petal.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      background: radial-gradient(ellipse at center, ${color}, transparent);
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    petalsContainer.appendChild(petal);
    setTimeout(() => {
      if (petal.parentNode) petal.parentNode.removeChild(petal);
    }, (duration + delay) * 1000);
  }

  function startPetals() {
    for (let i = 0; i < 3; i++) createPetal();
    setInterval(() => {
      if (document.querySelectorAll('.petal').length < 15) createPetal();
    }, 2000);
  }

  startPetals();


  // ─── Confetti Effect ───
  function createConfetti() {
    const colors = ['#c9a96e', '#d4a5a5', '#9cad98', '#b07d62', '#e8d5a3', '#f5e6e0'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const size = Math.random() * 8 + 4;
      const duration = Math.random() * 2 + 2;
      const delay = Math.random() * 0.5;

      confetti.style.cssText = `
        position: fixed; z-index: 10000;
        width: ${size}px; height: ${size * 1.5}px;
        background: ${color}; left: ${left}%; top: -10px;
        border-radius: 2px;
        animation: confettiFall ${duration}s ease-out ${delay}s forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;

      document.body.appendChild(confetti);
      setTimeout(() => {
        if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
      }, (duration + delay) * 1000 + 500);
    }
  }

  // Confetti animation keyframes
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confettiFall {
      0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
      100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.3); }
    }
  `;
  document.head.appendChild(confettiStyle);


  // ─── Smooth Scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });


  // ─── Music Toggle Button ───
  document.getElementById('musicToggle').addEventListener('click', toggleMusic);


  // ─── Parallax Effect on Hero ───
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${scrollY * 0.3}px)`;
      hero.style.opacity = 1 - (scrollY / window.innerHeight) * 0.6;
    }
  }, { passive: true });


  // ─── Copy Card Number ───
  const copyCardBtn = document.getElementById('copyCardBtn');
  if (copyCardBtn) {
    // The real card number
    const CARD_NUMBER = '5614 6818 1789 3526';
    const cardSpan = document.querySelector('#cardNumber span');
    if (cardSpan) cardSpan.textContent = CARD_NUMBER;

    copyCardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, '')).then(() => {
        copyCardBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        copyCardBtn.style.color = '#4caf50';
        setTimeout(() => {
          copyCardBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          copyCardBtn.style.color = '';
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = CARD_NUMBER.replace(/\s/g, '');
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      });
    });
  }

});

// ─── Lightbox Gallery ───
const galleryImages = [
  'images/couple.png',
  'images/rings.png',
  'images/bouquet.png',
  'images/venue.png',
  'images/hands.png',
  'images/cake.png'
];
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImg');
  img.src = galleryImages[index];
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightbox(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
  if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
  const img = document.getElementById('lightboxImg');
  img.style.animation = 'none';
  img.offsetHeight; // trigger reflow
  img.style.animation = '';
  img.src = galleryImages[currentLightboxIndex];
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeLightbox(-1);
  if (e.key === 'ArrowRight') changeLightbox(1);
});
