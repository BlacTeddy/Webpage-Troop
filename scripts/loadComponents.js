// Helper: Capitalize component names 
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1); 
}
// Detect repo name ONLY when running on GitHub Pages
let repo = ""; 
const pathParts = window.location.pathname.split("/").filter(Boolean);

// Detect repo name ONLY on GitHub Pages
if (location.hostname.endsWith("github.io") && pathParts.length > 1) {
   repo = pathParts[0]; }

const basePath = repo ? `/${repo}` : "";

// Build correct path to head.html
const headPath = `${basePath}/components/head.html`;

// Load <head> component
fetch(headPath)
  .then(response => response.text())
  .then(html => {
    document.head.insertAdjacentHTML("beforeend", html);
  })
  .catch(err => console.error("Failed to load head.html", err));

// Load all other components
document.querySelectorAll("[data-component]").forEach(el => {
  const name = el.getAttribute("data-component");
  const file = `${basePath}/components/${name}.html`;

  fetch(file)
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;
      // Call init function if it exists
      const initFn = window[`init${capitalize(name)}`];
      if (typeof initFn === "function") { 
        initFn(); 
      }
    })
    .catch(err => console.error(`Failed to load ${name}.html`, err));
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
