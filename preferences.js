(() => {
  const button = document.querySelector('.theme-switch');
  if (!button) return;
  let saved;
  try { saved = localStorage.getItem('cabin-theme'); } catch {}
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', (window.cabinText || (text => text))(dark ? 'Use light theme' : 'Use dark theme'));
    button.textContent = dark ? '☀' : '☾';
    document.querySelector('meta[name="color-scheme"]').content = theme;
  }
  apply(saved === 'dark' ? 'dark' : 'light');
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(theme);
    try { localStorage.setItem('cabin-theme', theme); } catch {}
  });
})();
