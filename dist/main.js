"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const postsContainer = document.getElementById('posts-container');
const loadMoreBtn = document.getElementById('load-more');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const modalContent = modal.querySelector('.modal-content');
let page = 1;
const limit = 5;
function fetchPosts(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
        const data = yield res.json();
        return data;
    });
}
function openPostModal(post) {
    modalContent.innerHTML = `
    <button id="close-modal" class="close">✕</button>
    <h3>${post.title}</h3>
    <p>${post.body}</p>
  `;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    const newCloseBtn = modalContent.querySelector('#close-modal');
    newCloseBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    });
}
function loadPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const newPosts = yield fetchPosts(page, limit);
        newPosts.forEach(post => {
            const div = document.createElement('div');
            div.classList.add('post');
            div.innerHTML = `<h4>${post.title}</h4><p>${post.body.slice(0, 50)}...</p>`; // короткий прев’ю
            div.addEventListener('click', () => openPostModal(post));
            postsContainer.appendChild(div);
        });
        page++;
    });
}
loadMoreBtn.addEventListener('click', loadPosts);
loadPosts();
