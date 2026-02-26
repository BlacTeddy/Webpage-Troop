// Helper: Capitalize component names 
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1); 
}

/**
 * Robust Base Path Detection
 * This ensures that whether you are on:
 * 1. localhost:5500/index.html -> basePath = ""
 * 2. username.github.io/my-repo/index.html -> basePath = "/my-repo"
 */
const isGitHubPages = window.location.hostname.includes("github.io");
const pathSegments = window.location.pathname.split("/").filter(Boolean);

// On GitHub Pages, the first segment is usually the repo name
const repoName = (isGitHubPages && pathSegments.length > 0) ? pathSegments[0] : "";
const basePath = repoName ? `/${repoName}` : "";

// 1. Load <head> component
// Using a relative path starting with / ensures it works from subfolders like /blog/
fetch(`${basePath}/components/head.html`)
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text();
  })
  .then(html => {
    document.head.insertAdjacentHTML("beforeend", html);
  })
  .catch(err => console.error("Failed to load head.html:", err));

// 2. Load all other components
document.querySelectorAll("[data-component]").forEach(el => {
  const name = el.getAttribute("data-component");
  const file = `${basePath}/components/${name}.html`;

  fetch(file)
    .then(r => {
      if (!r.ok) throw new Error(`Could not find ${name}.html at ${file}`);
      return r.text();
    })
    .then(html => {
      el.innerHTML = html;
      
      // Call init function if it exists (e.g., initNav())
      const initFnName = `init${capitalize(name)}`;
      if (typeof window[initFnName] === "function") { 
        window[initFnName](); 
      }
    })
    .catch(err => console.error(`Failed to load component:`, err));
});

function initNav() {
  console.log("Nav initialized");
  
  if (window.__navInitialized) return;
    window.__navInitialized = true;

  const mobileBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileBtn || !mobileMenu) return;
    
  mobileBtn.addEventListener('click', () => {
    const isOpen = mobileBtn.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
  });

    const mobileLinks = document.querySelectorAll('.mobile-nav-link'); 
    mobileLinks.forEach(link => { 
      link.addEventListener('click', () => { 
        mobileBtn.classList.remove('is-open'); 
        mobileMenu.classList.remove('is-open'); 
      }); 
    }); 
   // Make it available globally if needed:
    window.initNav = initNav;

  const links = document.querySelectorAll(".nav-link");
  const current = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("underline", "font-semibold");
    }
  });

    // CUSTOM STICKY HEADER
  function handleStickyHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    if (window.scrollY > 10) {
      header.classList.add("is-sticky");
    } else {
      header.classList.remove("is-sticky");
    }
  }
  window.addEventListener("scroll", handleStickyHeader);
  handleStickyHeader(); // run once on load
}

function initFooter() {
  console.log("Footer initialized");
  
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initFloat() {
  console.log("Float initialized");
}

