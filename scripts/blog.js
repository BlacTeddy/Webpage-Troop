let allPosts = [];

// Load JSON files (blog posts, categories, etc.)
function loadJSON(url, callback) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (typeof callback === "function") callback(data);
    })
    .catch(err => console.error("JSON load error:", err));
}

function initBlog() {
  loadJSON("data/posts.json", posts => {
    allPosts = posts;
  // sort newest to the top
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderPosts(allPosts);
  });
}

// ################################################ CARDS
function renderPosts(list) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  list.forEach(post => {
    const card = document.createElement("div");

    // Tailwind styling
    card.className = `
      group
      bg-white p-6 rounded-xl shadow-md border border-gray-200 
      hover:shadow-lg hover:-translate-y-1 hover:bg-gray-200 
      transition duration-200 space-y-3 cursor-pointer 
    `;

    // Assign ID for hybrid/template loading
    card.dataset.id = post.id;

    // Make card clickable
    card.onclick = () => openBlogPost(post.id);

    card.innerHTML = `
      <h3 class="text-2xl font-semibold mb-2 text-blue-600 group-hover:text-red-500">${post.title}</h3>

      <p class="text-gray-700 mb-4 ml-5">${post.preview} [click for more...]</p>

      <p class="text-sm text-gray-500 text-right -mr-5">
        <span class="text-sm text-gray-500">${new Date(post.date).toLocaleDateString()}</span>
        <span class="text-sm text-gray-500">• ${post.category}</span>
        <span class="text-sm text-gray-500">• ${post.author}</span>
      </p>
    `;

    container.appendChild(card);
  });
}
// ################################################

function filterByCategory(category) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("filter-active");
  });

  const activeBtn = document.querySelector(`[onclick="filterByCategory('${category}')"]`);
  if (activeBtn) activeBtn.classList.add("filter-active");

  if (category === "All") {
    renderPosts(allPosts);
    return;
  }

  const filtered = allPosts.filter(post =>
    post.category.toLowerCase().includes(category.toLowerCase())
  );

  renderPosts(filtered);
}

// ################################################ BLOG POST
// Hybrid/template loader
function openBlogPost(id) {
  const post = allPosts.find(p => p.id == id);
  if (!post) return;

  const modal = document.getElementById("blog-modal");
  const content = document.getElementById("modal-content");

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  content.innerHTML = "<p class='text-gray-500'>Loading...</p>";

  if (post.useTemplate) {
    fetch(post.url)
      .then(res => res.text())
      .then(html => {
        // Load template into modal
        content.innerHTML = html;

        // Inject JSON data into template
        document.getElementById("post-title").textContent = post.title;

        document.getElementById("post-meta").textContent =
          `${new Date(post.date).toLocaleDateString()} • ${post.category} • ${post.author}`;

        document.getElementById("post-body").innerHTML = post.body || "";

        // HERO IMAGE
        const hero = document.getElementById("post-hero");
        if (hero && post.hero) {
          hero.src = post.hero;
          hero.classList.remove("hidden");
        }

        // GALLERY
        const gallery = document.getElementById("post-gallery");
        if (gallery) {
          gallery.innerHTML = "";
          if (post.gallery && post.gallery.length > 0) {
            post.gallery.forEach(img => {
              gallery.innerHTML += `
                <img src="${img}" class="w-full h-40 object-cover rounded-md">
              `;
            });
          }
        }
      });

  } else {
    // Load custom HTML file directly
    fetch(post.url)
      .then(res => res.text())
      .then(html => content.innerHTML = html);
  }
}


// ################################################
// Close modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("blog-modal");
  const closeBtn = document.getElementById("close-modal");

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
});

// Highlight "All" on load
document.addEventListener("DOMContentLoaded", () => {
  const allBtn = document.querySelector(`[onclick="filterByCategory('All')"]`);
  if (allBtn) allBtn.classList.add("filter-active");
});
