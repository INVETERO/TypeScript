import { openModal, closeModal, initModal, setModalContent } from './modules/modal.js';
import { initHeaderScroll } from './modules/header.js';
import { initPosts } from './modules/posts.js';
document.addEventListener('DOMContentLoaded', () => {
    initModal();
    const openModalBtn = document.getElementById('open-modal');
    const openModalShortcut = document.getElementById('open-modal-shortcut');
    const closeModalBtn = document.getElementById('close-modal');
    const showAbout = () => {
        setModalContent(`<h3>Навіщо ця модалка?</h3>
       <p>Це невеликий TypeScript-драфт: фіксований хедер реагує на скрол, стрічка підвантажує пости, а модальне вікно показує контент без сторонніх бібліотек.</p>`);
        openModal();
    };
    if (openModalBtn)
        openModalBtn.addEventListener('click', showAbout);
    if (openModalShortcut)
        openModalShortcut.addEventListener('click', showAbout);
    if (closeModalBtn)
        closeModalBtn.addEventListener('click', closeModal);
    initHeaderScroll();
    initPosts();
});
