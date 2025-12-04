"use strict";
(() => {
  // src/modules/modal.ts
  var modal = null;
  var modalContent = null;
  function openModal() {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }
  function setModalContent(html) {
    if (!modalContent) return;
    modalContent.innerHTML = html;
  }
  function initModal() {
    modal = document.getElementById("modal");
    if (modal) {
      modalContent = modal.querySelector(".modal-content");
    }
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  // src/modules/header.ts
  var header = document.getElementById("header");
  function initHeaderScroll() {
    if (!header) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // src/modules/posts.ts
  var postsContainer = document.getElementById("posts-container");
  var loadMoreBtn = document.getElementById("load-more");
  var currentPage = 1;
  var pageSize = 5;
  var isLoading = false;
  var fallbackPosts = [
    { userId: 0, id: 101, title: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0438\u0439 \u0437\u0430\u043F\u0438\u0441", body: "\u0426\u0435 \u0437\u0430\u043F\u0430\u0441\u043D\u0438\u0439 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u043D\u0430 \u0432\u0438\u043F\u0430\u0434\u043E\u043A, \u044F\u043A\u0449\u043E \u043C\u0435\u0440\u0435\u0436\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430." },
    { userId: 0, id: 102, title: "\u0429\u0435 \u043E\u0434\u043D\u0430 \u043D\u043E\u0442\u0430\u0442\u043A\u0430", body: "\u0424\u0440\u043E\u043D\u0442 \u043F\u0440\u0430\u0446\u044E\u0454 \u0456 \u0431\u0435\u0437 \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u0456\u0445 API \u2014 \u0434\u0430\u043D\u0456 \u043F\u0440\u043E\u0441\u0442\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0456." },
    { userId: 0, id: 103, title: "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 \u043A\u043D\u043E\u043F\u043E\u043A", body: "\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0434\u0435\u0442\u0430\u043B\u0456\xBB, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438, \u0449\u043E \u043C\u043E\u0434\u0430\u043B\u043A\u0430 \u0442\u0435\u0436 \u0436\u0438\u0432\u0430." }
  ];
  var escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  async function fetchPosts(page, limit) {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${(page - 1) * limit}&_limit=${limit}`);
    if (!resp.ok) throw new Error("Network error");
    return resp.json();
  }
  async function fetchPostById(id) {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!resp.ok) throw new Error("Network error");
    return resp.json();
  }
  function renderStateMessage(text) {
    if (!postsContainer) return;
    const message = document.createElement("div");
    message.className = "post visible";
    message.textContent = text;
    postsContainer.appendChild(message);
  }
  function buildPostCard(post) {
    const el = document.createElement("article");
    el.className = "post";
    const title = document.createElement("h3");
    title.textContent = post.title;
    const body = document.createElement("p");
    body.textContent = post.body;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "details";
    button.dataset.id = String(post.id);
    button.textContent = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0434\u0435\u0442\u0430\u043B\u0456";
    button.addEventListener("click", async () => {
      openModal();
      setModalContent("<p>\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0443\u044E...</p>");
      try {
        const freshPost = await fetchPostById(post.id);
        setModalContent(
          `<h3>${escapeHtml(freshPost.title)}</h3><p>${escapeHtml(freshPost.body)}</p>`
        );
      } catch (error) {
        console.error(error);
        const fallback = fallbackPosts.find((p) => p.id === post.id);
        if (fallback) {
          setModalContent(`<h3>${escapeHtml(fallback.title)}</h3><p>${escapeHtml(fallback.body)}</p>`);
        } else {
          setModalContent("<p>\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043E\u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u0446\u0435\u0439 \u0434\u043E\u043F\u0438\u0441.</p>");
        }
      }
    });
    el.append(title, body, button);
    return el;
  }
  function renderPosts(posts) {
    if (!postsContainer) return;
    posts.forEach((post) => {
      const card = buildPostCard(post);
      postsContainer.appendChild(card);
      requestAnimationFrame(() => card.classList.add("visible"));
    });
  }
  async function loadNextPage() {
    if (isLoading) return;
    isLoading = true;
    if (loadMoreBtn) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0443\u044E...";
    }
    try {
      const posts = await fetchPosts(currentPage, pageSize);
      renderPosts(posts);
    } catch (error) {
      console.error(error);
      renderStateMessage("\u041C\u0435\u0440\u0435\u0436\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u2014 \u043F\u043E\u043A\u0430\u0437\u0443\u044E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438.");
      renderPosts(fallbackPosts);
    } finally {
      isLoading = false;
      if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0449\u0435 5";
      }
    }
  }
  function initPosts() {
    loadNextPage();
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", async () => {
        currentPage++;
        await loadNextPage();
      });
    }
  }

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    initModal();
    const openModalBtn = document.getElementById("open-modal");
    const openModalShortcut = document.getElementById("open-modal-shortcut");
    const closeModalBtn = document.getElementById("close-modal");
    const showAbout = () => {
      setModalContent(
        `<h3>\u041D\u0430\u0432\u0456\u0449\u043E \u0446\u044F \u043C\u043E\u0434\u0430\u043B\u043A\u0430?</h3>
       <p>\u0426\u0435 \u043D\u0435\u0432\u0435\u043B\u0438\u043A\u0438\u0439 TypeScript-\u0434\u0440\u0430\u0444\u0442: \u0444\u0456\u043A\u0441\u043E\u0432\u0430\u043D\u0438\u0439 \u0445\u0435\u0434\u0435\u0440 \u0440\u0435\u0430\u0433\u0443\u0454 \u043D\u0430 \u0441\u043A\u0440\u043E\u043B, \u0441\u0442\u0440\u0456\u0447\u043A\u0430 \u043F\u0456\u0434\u0432\u0430\u043D\u0442\u0430\u0436\u0443\u0454 \u043F\u043E\u0441\u0442\u0438, \u0430 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u0435 \u0432\u0456\u043A\u043D\u043E \u043F\u043E\u043A\u0430\u0437\u0443\u0454 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u0431\u0435\u0437 \u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0456\u0445 \u0431\u0456\u0431\u043B\u0456\u043E\u0442\u0435\u043A.</p>`
      );
      openModal();
    };
    if (openModalBtn) openModalBtn.addEventListener("click", showAbout);
    if (openModalShortcut) openModalShortcut.addEventListener("click", showAbout);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    initHeaderScroll();
    initPosts();
  });
})();
//# sourceMappingURL=bundle.js.map
