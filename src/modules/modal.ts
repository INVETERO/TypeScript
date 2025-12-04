let modal: HTMLDivElement | null = null;
let modalContent: HTMLDivElement | null = null;

export function openModal(): void {
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

export function closeModal(): void {
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

export function setModalContent(html: string): void {
  if (!modalContent) return;
  modalContent.innerHTML = html;
}

export function initModal(): void {
  modal = document.getElementById('modal') as HTMLDivElement | null;
  if (modal) {
    modalContent = modal.querySelector('.modal-content') as HTMLDivElement | null;
  }
  if (!modal) return;

  modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
