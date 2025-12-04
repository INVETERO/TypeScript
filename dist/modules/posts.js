var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { openModal, setModalContent } from './modal.js';
const postsContainer = document.getElementById('posts-container');
const loadMoreBtn = document.getElementById('load-more');
let currentPage = 1;
const pageSize = 5;
let isLoading = false;
const fallbackPosts = [
    { userId: 0, id: 101, title: 'Локальний запис', body: 'Це запасний контент на випадок, якщо мережа недоступна.' },
    { userId: 0, id: 102, title: 'Ще одна нотатка', body: 'Фронт працює і без зовнішніх API — дані просто локальні.' },
    { userId: 0, id: 103, title: 'Перевірка кнопок', body: 'Натисніть «Показати деталі», щоб побачити, що модалка теж жива.' },
];
const escapeHtml = (value) => value.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
function fetchPosts(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(`https://jsonplaceholder.typicode.com/posts?_start=${(page - 1) * limit}&_limit=${limit}`);
        if (!resp.ok)
            throw new Error('Network error');
        return resp.json();
    });
}
function fetchPostById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!resp.ok)
            throw new Error('Network error');
        return resp.json();
    });
}
function renderStateMessage(text) {
    if (!postsContainer)
        return;
    const message = document.createElement('div');
    message.className = 'post visible';
    message.textContent = text;
    postsContainer.appendChild(message);
}
function buildPostCard(post) {
    const el = document.createElement('article');
    el.className = 'post';
    const title = document.createElement('h3');
    title.textContent = post.title;
    const body = document.createElement('p');
    body.textContent = post.body;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'details';
    button.dataset.id = String(post.id);
    button.textContent = 'Показати деталі';
    button.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        openModal();
        setModalContent('<p>Завантажую...</p>');
        try {
            const freshPost = yield fetchPostById(post.id);
            setModalContent(`<h3>${escapeHtml(freshPost.title)}</h3><p>${escapeHtml(freshPost.body)}</p>`);
        }
        catch (error) {
            console.error(error);
            const fallback = fallbackPosts.find(p => p.id === post.id);
            if (fallback) {
                setModalContent(`<h3>${escapeHtml(fallback.title)}</h3><p>${escapeHtml(fallback.body)}</p>`);
            }
            else {
                setModalContent('<p>Не вдалося отримати цей допис.</p>');
            }
        }
    }));
    el.append(title, body, button);
    return el;
}
function renderPosts(posts) {
    if (!postsContainer)
        return;
    posts.forEach(post => {
        const card = buildPostCard(post);
        postsContainer.appendChild(card);
        requestAnimationFrame(() => card.classList.add('visible'));
    });
}
function loadNextPage() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isLoading)
            return;
        isLoading = true;
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Завантажую...';
        }
        try {
            const posts = yield fetchPosts(currentPage, pageSize);
            renderPosts(posts);
        }
        catch (error) {
            console.error(error);
            renderStateMessage('Мережа недоступна — показую локальні нотатки.');
            renderPosts(fallbackPosts);
        }
        finally {
            isLoading = false;
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                loadMoreBtn.textContent = 'Показати ще 5';
            }
        }
    });
}
export function initPosts() {
    loadNextPage();
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            currentPage++;
            yield loadNextPage();
        }));
    }
}
