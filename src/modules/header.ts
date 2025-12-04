const header = document.getElementById('header') as HTMLElement | null;

export function initHeaderScroll(): void {
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}
