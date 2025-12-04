const postsContainer = document.getElementById('posts-container') as HTMLDivElement;
const loadMoreBtn = document.getElementById('load-more') as HTMLButtonElement;
const modal = document.getElementById('modal') as HTMLDivElement;
const modalContent = modal.querySelector('.modal-content') as HTMLDivElement;

interface Post {
  id: number;
  title: string;
  body: string;
}

let page = 1;
const limit = 5;
let postList: Post[] = []; 

async function fetchPosts(page: number, limit: number): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
  const data: Post[] = await res.json();
  return data;
}

function openPostModal(post: Post) {
  modalContent.innerHTML = `
    <button id="close-modal" class="close">✕</button>
    <h3>${post.title}</h3>
    <p>${post.body}</p>
  `;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  const newCloseBtn = modalContent.querySelector('#close-modal') as HTMLButtonElement;
  newCloseBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  });
}

async function loadPosts() {
  const newPosts = await fetchPosts(page, limit);
  postList.push(...newPosts);

  newPosts.forEach((post, idx) => {
    const div = document.createElement('div');
    div.classList.add('post');
    div.dataset.index = (postList.length - newPosts.length + idx).toString(); 
    div.innerHTML = `<h4>${post.title}</h4><p>${post.body.slice(0, 50)}...</p>`;
    postsContainer.appendChild(div);
  });

  page++;
}

postsContainer.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const postDiv = target.closest('.post') as HTMLDivElement;
  if (!postDiv) return;

  const index = parseInt(postDiv.dataset.index!); 
  openPostModal(postList[index]);
});

loadMoreBtn.addEventListener('click', loadPosts);

loadPosts();
