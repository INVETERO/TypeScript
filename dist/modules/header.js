const header = document.getElementById('header');
export function initHeaderScroll() {
    if (!header)
        return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        else {
            header.classList.remove('scrolled');
        }
    });
}
