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
});
