let modal = null;
let modalContent = null;
export function openModal() {
    if (!modal)
        return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}
export function closeModal() {
    if (!modal)
        return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}
export function setModalContent(html) {
    if (!modalContent)
        return;
    modalContent.innerHTML = html;
}
export function initModal() {
    modal = document.getElementById('modal');
    if (modal) {
        modalContent = modal.querySelector('.modal-content');
    }
    if (!modal)
        return;
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}
