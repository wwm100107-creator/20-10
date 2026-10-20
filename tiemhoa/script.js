/* ==========================================================================
   TIỆM HOA CỦA EM - FULL PROGRAMMATIC RENDERING & INTERACTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. WEB AUDIO SYNTHESIZER =================
  const SoundFX = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    // Gentle melodic doorbell chime
    playBell() {
      this.init();
      const now = this.ctx.currentTime;
      // Ding (E5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Dong (C5)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.35);
      gain2.gain.setValueAtTime(0.45, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.8);
    },
    // Pentatonic scale flower pick pop
    playFlowerPop(idx) {
      this.init();
      const freqs = [523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = freqs[idx % freqs.length];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    },
    // Ribbon tie harp glissando
    playRibbonTie() {
      this.init();
      const notes = [523, 659, 784, 1046];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    },
    // Letter unfold chime
    playLetterOpen() {
      this.init();
      const notes = [440, 554, 659, 880, 1108];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    }
  };

  // ================= 2. BACKGROUND MUSIC CONTROLLER =================
  const bgMusic = document.getElementById('bg-music');
  const musicPill = document.getElementById('music-pill');

  function toggleMusic() {
    SoundFX.init();
    if (bgMusic.paused) {
      bgMusic.volume = 0.75;
      bgMusic.play().then(() => {
        musicPill.classList.add('playing');
      }).catch(err => console.log('Autoplay blocked:', err));
    } else {
      bgMusic.pause();
      musicPill.classList.remove('playing');
    }
  }

  musicPill.addEventListener('click', toggleMusic);

  function startMusicIfSilent() {
    if (bgMusic.paused) {
      bgMusic.volume = 0.75;
      bgMusic.play().then(() => {
        musicPill.classList.add('playing');
      }).catch(() => {});
    }
  }

  // ================= 3. SCENE NAVIGATION CONTROLLER =================
  const scenes = {
    1: document.getElementById('scene-1'),
    2: document.getElementById('scene-2'),
    3: document.getElementById('scene-3'),
    4: document.getElementById('scene-4'),
    5: document.getElementById('scene-5')
  };

  function switchScene(fromId, toId) {
    const fromEl = scenes[fromId];
    const toEl = scenes[toId];
    if (!fromEl || !toEl) return;

    fromEl.classList.add('flip-out');
    setTimeout(() => {
      fromEl.classList.remove('active', 'flip-out');
      toEl.classList.add('active');

      // Trigger scene setup if needed
      if (toId === 3) renderCenterBouquet('bow-bouquet-art', false);
      if (toId === 4) renderCenterBouquet('card-bouquet-art', true);
    }, 450);
  }

  // ================= 4. SCENE 1: TIỆM HOA & CHUÔNG CỬA =================
  const doorBell = document.getElementById('door-bell');
  const doorLeaf = document.getElementById('door-leaf');
  const shopBuilding = document.getElementById('shop-building');
  const shopHint = document.getElementById('shop-hint');
  const btnEnterShop = document.getElementById('btn-enter-shop');
  let isDoorOpened = false;

  function openShopDoor() {
    if (isDoorOpened) return;

    SoundFX.playBell();
    startMusicIfSilent();

    doorBell.classList.add('ringing');
    setTimeout(() => {
      doorBell.classList.remove('ringing');
      shopBuilding.classList.add('door-opened');
      isDoorOpened = true;

      shopHint.style.opacity = '0';
      setTimeout(() => {
        shopHint.style.display = 'none';
        btnEnterShop.style.display = 'inline-block';
      }, 300);
    }, 350);
  }

  doorBell.addEventListener('click', openShopDoor);
  if (doorLeaf) {
    doorLeaf.addEventListener('click', openShopDoor);
  }

  btnEnterShop.addEventListener('click', () => {
    SoundFX.playFlowerPop(0);
    switchScene(1, 2);
  });

  // ================= 5. SCENE 2: BOTANICAL FLOWER ASSEMBLY =================
  const flowerCards = document.querySelectorAll('.flower-card');
  const flowerCounter = document.getElementById('flower-counter');
  const bouquetBed = document.getElementById('bouquet-flowers-bed');
  const emptyBouquetHint = document.getElementById('empty-bouquet-hint');
  const btnNextScene3 = document.getElementById('btn-next-scene-3');
  const toastBubble = document.getElementById('toast-bubble');

  let pickedFlowers = new Set();
  const totalRequiredFlowers = 5;

  // Botanical arrangement positions inside the kraft wrapper (matching bouquet dome)
  const flowerPlacements = {
    baby: { left: '20px', top: '15px', width: '210px', height: '200px', rotate: '0deg', scale: '1.0', z: 2 },
    tulip: { left: '20px', top: '35px', width: '100px', height: '155px', rotate: '-14deg', scale: '1.0', z: 3 },
    sunflower: { left: '110px', top: '30px', width: '125px', height: '140px', rotate: '12deg', scale: '1.0', z: 4 },
    daisy: { left: '125px', top: '85px', width: '85px', height: '145px', rotate: '-8deg', scale: '1.0', z: 5 },
    rose: { left: '45px', top: '75px', width: '120px', height: '130px', rotate: '-4deg', scale: '1.05', z: 6 }
  };

  function showToast(text) {
    toastBubble.textContent = text;
    toastBubble.classList.add('show');
    clearTimeout(toastBubble._timer);
    toastBubble._timer = setTimeout(() => {
      toastBubble.classList.remove('show');
    }, 2800);
  }

  flowerCards.forEach(card => {
    card.addEventListener('click', () => {
      const flowerId = card.dataset.id;
      const flowerName = card.dataset.name;
      const flowerMeaning = card.dataset.meaning;

      if (pickedFlowers.has(flowerId)) return;

      pickedFlowers.add(flowerId);
      card.classList.add('selected');
      SoundFX.playFlowerPop(pickedFlowers.size);

      // Hide empty hint
      if (emptyBouquetHint) emptyBouquetHint.style.opacity = '0';

      // Sprout realistic botanical flower into bouquet bed
      const pos = flowerPlacements[flowerId];
      const flowerImg = document.createElement('img');
      flowerImg.src = `assets_art/${flowerId}.png`;
      flowerImg.alt = flowerName;
      flowerImg.classList.add('sprouted-flower-img');
      flowerImg.style.left = pos.left;
      flowerImg.style.top = pos.top;
      flowerImg.style.width = pos.width;
      flowerImg.style.height = pos.height;
      flowerImg.style.setProperty('--rot', pos.rotate);
      flowerImg.style.setProperty('--sc', pos.scale);
      flowerImg.style.zIndex = pos.z;

      bouquetBed.appendChild(flowerImg);

      showToast(`+1 ${flowerName}: ${flowerMeaning}`);
      flowerCounter.textContent = `${pickedFlowers.size} / ${totalRequiredFlowers} BÔNG HOA`;

      if (pickedFlowers.size >= totalRequiredFlowers) {
        btnNextScene3.classList.add('visible');
      }
    });
  });

  btnNextScene3.addEventListener('click', () => {
    SoundFX.playFlowerPop(3);
    switchScene(2, 3);
  });

  // ================= 6. SCENE 3 & 4: CENTER BOUQUET RENDERER =================
  // Display the studio-grade botanical watercolor bouquet artwork
  function renderCenterBouquet(containerId, withBowTied = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const imgSrc = withBowTied ? 'assets_art/bouquet_finished.png' : 'assets_art/bouquet_nobow.png';

    container.innerHTML = `
      <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
        <img id="${containerId}-img" src="${imgSrc}" alt="Bó hoa của em" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 16px 36px rgba(60, 45, 30, 0.2));">
      </div>
    `;
  }

  // Scene 3: Bow Tie Click
  const ribbonBowHotspot = document.getElementById('ribbon-bow-hotspot');
  const bowHint = document.getElementById('bow-hint');
  let isBowTied = false;

  ribbonBowHotspot.addEventListener('click', () => {
    if (isBowTied) return;
    isBowTied = true;
    SoundFX.playRibbonTie();

    const bowBouquetImg = document.getElementById('bow-bouquet-art-img');
    if (bowBouquetImg) {
      bowBouquetImg.src = 'assets_art/bouquet_finished.png';
    }

    const satinBow = document.getElementById('satin-bow-img');
    if (satinBow) {
      satinBow.style.opacity = '0';
    }
    const bowTouchRing = ribbonBowHotspot.querySelector('.bow-touch-ring');
    if (bowTouchRing) {
      bowTouchRing.style.display = 'none';
    }

    spawnHeartBurst(ribbonBowHotspot.getBoundingClientRect(), 24);

    bowHint.textContent = 'Anh còn giấu một tấm thiệp trong bó hoa...';
    bowHint.style.color = '#c25975';

    setTimeout(() => {
      switchScene(3, 4);
    }, 1100);
  });

  // Scene 4: Mini Gift Tag Click
  const miniGiftTag = document.getElementById('mini-gift-tag');
  miniGiftTag.addEventListener('click', () => {
    SoundFX.playLetterOpen();
    switchScene(4, 5);
  });

  // ================= 7. SCENE 5: LETTER & POLAROID =================
  const btnCloseLetter = document.getElementById('btn-close-letter');
  const btnHeartShower = document.getElementById('btn-heart-shower');
  // Wax seal click interaction
  const waxSealEl = document.querySelector('.letter-wax-seal');
  if (waxSealEl) {
    waxSealEl.addEventListener('click', (e) => {
      SoundFX.playLetterOpen();
      spawnHeartBurst(e.target.getBoundingClientRect(), 16);
      showToast('Dấu sáp hoa hồng được niêm phong bằng cả tấm lòng ♡');
    });
  }

  // Heart Shower Burst
  btnHeartShower.addEventListener('click', (e) => {
    SoundFX.playLetterOpen();
    spawnHeartBurst(e.target.getBoundingClientRect(), 30);
    showToast('Bé Iu đã gửi ngập tràn tim cho anh! ♡');
  });

  // ================= 8. AMBIENT PARTICLES ENGINE =================
  const particlesContainer = document.getElementById('ambient-particles');
  const particleSymbols = ['🌸', '✨', '🤍', '🌷', '🌿', '🌼', '💖', '🍃'];

  function createAmbientParticle() {
    const el = document.createElement('div');
    el.className = 'ambient-particle';
    el.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
    el.style.left = Math.random() * 96 + 2 + 'vw';
    el.style.fontSize = (Math.random() * 12 + 12) + 'px';
    const duration = Math.random() * 8 + 10;
    el.style.animationDuration = duration + 's';
    particlesContainer.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, duration * 1000);
  }

  setInterval(createAmbientParticle, 1200);
  for (let i = 0; i < 7; i++) {
    setTimeout(createAmbientParticle, i * 250);
  }

  // Romantic Fountain Particle Explosion
  function spawnHeartBurst(sourceRect, count = 20) {
    const symbols = ['❤️', '💖', '💕', '✨', '🌸', '💐', '🤍'];
    const centerX = sourceRect.left + sourceRect.width / 2;
    const centerY = sourceRect.top + sourceRect.height / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.position = 'fixed';
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      p.style.fontSize = (Math.random() * 14 + 16) + 'px';
      p.style.pointerEvents = 'none';
      p.style.zIndex = '999';
      p.style.transition = 'all 1.3s cubic-bezier(0.1, 0.8, 0.2, 1)';
      document.body.appendChild(p);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const distance = Math.random() * 140 + 70;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 50;

      requestAnimationFrame(() => {
        p.style.transform = `translate(${destX}px, ${destY}px) scale(${Math.random() * 0.6 + 0.8}) rotate(${(Math.random() - 0.5) * 70}deg)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 1300);
    }
  }

  // URL Parameter Scene Deep Linking (e.g. ?scene=2, ?scene=3, ?scene=4, ?scene=5, ?open=1)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open') === '1') {
    shopBuilding.classList.add('door-opened');
    btnEnterShop.style.display = 'inline-block';
    shopHint.style.display = 'none';
    isDoorOpened = true;
  }
  const targetScene = parseInt(urlParams.get('scene'), 10);
  if (urlParams.get('picked') === 'all') {
    flowerCards.forEach(c => {
      const flowerId = c.dataset.id;
      if (flowerId && flowerPlacements[flowerId]) {
        pickedFlowers.add(flowerId);
        c.classList.add('selected');
        const pos = flowerPlacements[flowerId];
        const flowerImg = document.createElement('img');
        flowerImg.src = `assets_art/${flowerId}.png`;
        flowerImg.classList.add('sprouted-flower-img');
        flowerImg.style.left = pos.left;
        flowerImg.style.top = pos.top;
        flowerImg.style.width = pos.width;
        flowerImg.style.height = pos.height;
        flowerImg.style.setProperty('--rot', pos.rotate);
        flowerImg.style.setProperty('--sc', pos.scale);
        flowerImg.style.zIndex = pos.z;
        bouquetBed.appendChild(flowerImg);
      }
    });
    if (emptyBouquetHint) emptyBouquetHint.style.opacity = '0';
    flowerCounter.textContent = '5 / 5 BÔNG HOA';
    btnNextScene3.classList.add('visible');
  }
  if (targetScene && targetScene >= 2 && targetScene <= 5) {
    if (targetScene >= 3) {
      flowerCards.forEach(c => c.classList.add('selected'));
      pickedFlowers = new Set(['tulip', 'sunflower', 'rose', 'daisy', 'baby']);
    }
    Object.values(scenes).forEach(s => s && s.classList.remove('active', 'flip-out'));
    if (scenes[targetScene]) {
      scenes[targetScene].classList.add('active');
      if (targetScene === 3) renderCenterBouquet('bow-bouquet-art', false);
      if (targetScene === 4) renderCenterBouquet('card-bouquet-art', true);
    }
  }
});
