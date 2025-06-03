// Cursor animation: move cursor on mouse move
window.addEventListener('DOMContentLoaded', function() {
  const ide = document.querySelector('.ide-code');
  const cursor = document.querySelector('.ide-cursor');
  const ide3d = document.querySelector('.ide-3d');
  const ideWindow = document.querySelector('.ide-window');
  // Floating icons
  const floatingIcons = document.querySelectorAll('.ide-floating-icons .icon');

  // Move code cursor and animate objects on mouse move
  ide.addEventListener('mousemove', function(e) {
    const rect = ide.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    // Calculate normalized values (-0.5 to 0.5)
    const nx = (x / rect.width) - 0.5;
    const ny = (y / rect.height) - 0.5;

    // Animate 3D window tilt
    ideWindow.style.transform = `rotateY(${nx * 18}deg) rotateX(${-ny * 12}deg) scale(1.05)`;

    // Animate floating icons in orbit
    floatingIcons.forEach((icon, i) => {
      const angle = nx * Math.PI + i * Math.PI / 2 + ny * 0.5;
      const radius = 80 + Math.sin(Date.now() / 800 + i) * 10;
      const ix = Math.cos(angle) * radius;
      const iy = Math.sin(angle) * radius;
      icon.style.transform = `translate(${ix}px, ${iy}px) scale(1.1)`;
    });
  });

  ide.addEventListener('mouseleave', function() {
    cursor.style.left = '7.2em';
    cursor.style.top = '2.1em';
    ideWindow.style.transform = 'rotateY(-18deg) rotateX(10deg) scale(1.05)';
    floatingIcons.forEach(icon => icon.style.transform = '');
  });

  // GLOBAL floating icons (no random movement, only cursor interaction)
  const globalIcons = document.querySelectorAll('.floating-icons-global .icon');
  const hero = document.querySelector('.hero');

  // Precompute static angles for icons
  const iconAngles = Array.from(globalIcons).map((_, i) => i * Math.PI / 3);

  hero.addEventListener('mousemove', function(e) {
    const heroRect = this.getBoundingClientRect();
    const x = e.clientX - heroRect.left;
    const y = e.clientY - heroRect.top;
    // Animate icons to zoom in/out based on distance to cursor
    globalIcons.forEach((icon, i) => {
      const angle = iconAngles[i];
      const radius = heroRect.width * 0.32;
      const ix = Math.cos(angle) * radius + heroRect.width / 2 - 19;
      const iy = Math.sin(angle) * radius + heroRect.height / 2 - 19;
      icon.style.left = `${ix}px`;
      icon.style.top = `${iy}px`;
      // Calculate distance from cursor to icon center
      const dist = Math.sqrt(Math.pow(x - (ix + 19), 2) + Math.pow(y - (iy + 19), 2));
      // Zoom in if close, out if far (clamp scale between 1 and 1.7)
      const scale = 1.7 - Math.min(dist / 300, 0.7);
      icon.style.transform = `scale(${scale})`;
    });
  });
  hero.addEventListener('mouseleave', function() {
    // Reset icons to default positions and scale
    const heroRect = this.getBoundingClientRect();
    globalIcons.forEach((icon, i) => {
      const angle = iconAngles[i];
      const radius = heroRect.width * 0.32;
      const ix = Math.cos(angle) * radius + heroRect.width / 2 - 19;
      const iy = Math.sin(angle) * radius + heroRect.height / 2 - 19;
      icon.style.left = `${ix}px`;
      icon.style.top = `${iy}px`;
      icon.style.transform = 'scale(1)';
    });
  });
  // On load, set icons to default positions
  setTimeout(() => {
    const heroRect = hero.getBoundingClientRect();
    globalIcons.forEach((icon, i) => {
      const angle = iconAngles[i];
      const radius = heroRect.width * 0.32;
      const ix = Math.cos(angle) * radius + heroRect.width / 2 - 19;
      const iy = Math.sin(angle) * radius + heroRect.height / 2 - 19;
      icon.style.left = `${ix}px`;
      icon.style.top = `${iy}px`;
      icon.style.transform = 'scale(1)';
    });
  }, 100);

  // === Moving Python Code Background Animation ===
  const pythonSnippets = [
    `def hello():\n    print('Hello, World!')`,
    `for i in range(5):\n    print(i)`,
    `class Lightning:\n    def __init__(self, speed):\n        self.speed = speed`,
    `if __name__ == '__main__':\n    hello()`,
    `import this`,
    `print('⚡ Fast!')`,
    `def add(a, b):\n    return a + b`,
    `try:\n    x = 1/0\nexcept ZeroDivisionError:\n    pass`,
    `with open('file.txt') as f:\n    data = f.read()`
  ];
  const bg = document.querySelector('.moving-code-bg');
  const snippetCount = 8;
  const snippets = [];

  // --- Cursor-reactive foreground code layer ---
  const fgLayer = document.createElement('div');
  fgLayer.className = 'moving-code-fg';
  fgLayer.style.position = 'fixed';
  fgLayer.style.top = '0';
  fgLayer.style.left = '0';
  fgLayer.style.width = '100vw';
  fgLayer.style.height = '100vh';
  fgLayer.style.pointerEvents = 'none';
  fgLayer.style.zIndex = '12';
  document.body.appendChild(fgLayer);

  const fgSnippets = [];
  for (let i = 0; i < 5; i++) {
    const el = document.createElement('pre');
    el.className = 'moving-code-snippet moving-code-fg-snippet';
    el.textContent = pythonSnippets[Math.floor(Math.random() * pythonSnippets.length)];
    el.style.left = Math.random() * 80 + 'vw';
    el.style.top = Math.random() * 80 + 'vh';
    el.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
    el.style.opacity = 0.22 + Math.random() * 0.13;
    fgLayer.appendChild(el);
    fgSnippets.push(el);
  }

  let fgMouseX = 0, fgMouseY = 0;
  document.addEventListener('mousemove', function(e) {
    fgMouseX = e.clientX / window.innerWidth - 0.5;
    fgMouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animateFgSnippets() {
    const now = Date.now();
    fgSnippets.forEach((el, i) => {
      const offsetX = Math.sin(now / 1200 + i) * 18 + fgMouseX * 120 * (0.5 + i/6);
      const offsetY = Math.cos(now / 1100 + i) * 12 + fgMouseY * 90 * (0.5 + i/6);
      el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    requestAnimationFrame(animateFgSnippets);
  }
  animateFgSnippets();

  // Moving Python code background
  const pythonSnippetsStatic = [
    `def greet(name):\n    print(f"Hello, {name}!")`,
    `class Lightning:\n    def __init__(self, speed):\n        self.speed = speed`,
    `for i in range(5):\n    print(i)`,
    `if __name__ == "__main__":\n    greet("World")`,
    `import math\nprint(math.pi)`
  ];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createMovingSnippet(snippet, idx) {
    const el = document.createElement('pre');
    el.className = 'moving-code-snippet';
    el.textContent = snippet;
    // Random initial position
    el.style.left = randomBetween(0, 80) + 'vw';
    el.style.top = randomBetween(0, 80) + 'vh';
    el.style.fontSize = randomBetween(1, 2.2) + 'rem';
    el.style.opacity = 0.13 + Math.random() * 0.07;
    el.dataset.dx = (Math.random() - 0.5) * 0.12;
    el.dataset.dy = (Math.random() - 0.5) * 0.07;
    return el;
  }

  const bgStatic = document.querySelector('.moving-code-bg-static');
  if (bgStatic) {
    const snippetsStatic = [];
    for (let i = 0; i < 8; ++i) {
      const snip = createMovingSnippet(
        pythonSnippetsStatic[i % pythonSnippetsStatic.length], i
      );
      bgStatic.appendChild(snip);
      snippetsStatic.push(snip);
    }
    function animateSnippetsStatic() {
      for (const el of snippetsStatic) {
        let left = parseFloat(el.style.left);
        let top = parseFloat(el.style.top);
        let dx = parseFloat(el.dataset.dx);
        let dy = parseFloat(el.dataset.dy);
        left += dx;
        top += dy;
        // Wrap around screen
        if (left > 100) left = -20;
        if (left < -25) left = 100;
        if (top > 100) top = -10;
        if (top < -15) top = 100;
        el.style.left = left + 'vw';
        el.style.top = top + 'vh';
      }
      requestAnimationFrame(animateSnippetsStatic);
    }
    animateSnippetsStatic();
  }

  // Smooth hero zoom-out on scroll
  (function() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    // Set initial scale
    heroContent.style.transform = 'scale(1.5)';
    
    function onScroll() {
      const minScale = 0.7;
      const maxScale = 1.5;
      const scrollStart = 0;
      const scrollEnd = 400; // px after which hero is fully minimized
      const scrollY = window.scrollY;
      let scale = maxScale - (scrollY - scrollStart) * (maxScale - minScale) / (scrollEnd - scrollStart);
      scale = Math.max(minScale, Math.min(maxScale, scale));
      heroContent.style.transform = `scale(${scale})`;
    }
    window.addEventListener('scroll', onScroll);
  })();
});

window.addEventListener('scroll', function() {
  if (window.scrollY > 40) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
});
