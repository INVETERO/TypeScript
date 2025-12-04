import { Post } from '../types/post.js';
import { openModal, setModalContent } from './modal.js';

const postsContainer = document.getElementById('posts-container') as HTMLDivElement | null;
const loadMoreBtn = document.getElementById('load-more') as HTMLButtonElement | null;

let currentPage = 1;
const pageSize = 5;
let isLoading = false;

const fallbackPosts: Post[] = [
  { userId: 0, id: 101, title: 'Локальний запис', body: 'Це запасний контент на випадок, якщо мережа недоступна.' },
  { userId: 0, id: 102, title: 'Ще одна нотатка', body: 'Фронт працює і без зовнішніх API — дані просто локальні.' },
  { userId: 0, id: 103, title: 'Перевірка кнопок', body: 'Натисніть «Показати деталі», щоб побачити, що модалка теж жива.' },
];

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

async function fetchPosts(page: number, limit: number): Promise<Post[]> {
  const resp = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${(page - 1) * limit}&_limit=${limit}`);
  if (!resp.ok) throw new Error('Network error');
  return resp.json();
}

async function fetchPostById(id: number): Promise<Post> {
  const resp = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!resp.ok) throw new Error('Network error');
  return resp.json();
}

function renderStateMessage(text: string): void {
  if (!postsContainer) return;
  const message = document.createElement('div');
  message.className = 'post visible';
  message.textContent = text;
  postsContainer.appendChild(message);
}

function buildPostCard(post: Post): HTMLElement {
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

  button.addEventListener('click', async () => {
    openModal();
    setModalContent('<p>Завантажую...</p>');
    try {
      const freshPost = await fetchPostById(post.id);
      setModalContent(
        `<h3>${escapeHtml(freshPost.title)}</h3><p>${escapeHtml(freshPost.body)}</p>`
      );
    } catch (error) {
      console.error(error);
      const fallback = fallbackPosts.find(p => p.id === post.id);
      if (fallback) {
        setModalContent(`<h3>${escapeHtml(fallback.title)}</h3><p>${escapeHtml(fallback.body)}</p>`);
      } else {
        setModalContent('<p>Не вдалося отримати цей допис.</p>');
      }
    }
  });

  el.append(title, body, button);
  return el;
}

function renderPosts(posts: Post[]): void {
  if (!postsContainer) return;

  posts.forEach(post => {
    const card = buildPostCard(post);
    postsContainer.appendChild(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });
}

async function loadNextPage(): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Завантажую...';
  }

  try {
    const posts = await fetchPosts(currentPage, pageSize);
    renderPosts(posts);
  } catch (error) {
    console.error(error);
    renderStateMessage('Мережа недоступна — показую локальні нотатки.');
    renderPosts(fallbackPosts);
  } finally {
    isLoading = false;
    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Показати ще 5';
    }
  }
}

export function initPosts(): void {
  loadNextPage();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', async () => {
      currentPage++;
      await loadNextPage();
    });
  }
}
