// Load JSON files (blog posts, categories, etc.)
function loadJSON(url, callback) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (typeof callback === "function") callback(data);
    })
    .catch(err => console.error("JSON load error:", err));
}

// Initialize the blog index page
function initBlog() {
  loadJSON("posts.json", posts => {
    // Sort newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("posts-container");

    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "bg-white p-6 rounded shadow";

      card.innerHTML = `
        <h3 class="text-2xl font-semibold mb-2">
          ${post.title}
        </h3>


        <p class="text-gray-700 mb-4 ml-5">${post.preview}..</p>
     
        <p class="text-sm text-gray-500 text-right -mr-5">
        <span class="text-sm text-gray-500 ">${new Date(post.date).toLocaleDateString()}</span>
        <span class="text-sm text-gray-500 ">• ${post.category}</span>
        <span class="text-sm text-gray-500 ">• ${post.author}</span>

        </p>
        <button onclick="openBlogPost('${post.url}')" 
            class="text-blue-600 font-semibold text-left hover:underline">
          Read more→
        </button> 
      `;

      container.appendChild(card);
    });
  });
}


function openBlogPost(url) {
  const modal = document.getElementById("blog-modal");
  const content = document.getElementById("modal-content");

  // Clear old content
  content.innerHTML = "<p class='text-gray-500'>Loading...</p>";

  // Show modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Load the HTML file
  fetch(url)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
    })
    .catch(err => {
      content.innerHTML = "<p class='text-red-600'>Failed to load post.</p>";
      console.error(err);
    });
}

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
