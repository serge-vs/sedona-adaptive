function applyTheme(theme) {
  document.body.classList.remove('theme-auto', 'theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'auto';
  applyTheme(savedTheme);

  document.querySelectorAll('.site-list__input-theme').forEach((element) => {
    let optionElement = element;

    optionElement.checked = savedTheme === optionElement.value;

    optionElement.addEventListener('change', (evt) => {
      localStorage.setItem('theme', evt.target.value);
      applyTheme(evt.target.value);
    });
  });
});
