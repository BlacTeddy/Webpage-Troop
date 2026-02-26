// Load <head> component - notice NO basePath needed!
fetch("components/head.html")
  .then(response => response.text())
  .then(html => {
    document.head.insertAdjacentHTML("beforeend", html);
  });

// Load all other components
document.querySelectorAll("[data-component]").forEach(el => {
  const name = el.getAttribute("data-component");
  
  // The browser automatically adds the <base href> to this string
  fetch(`components/${name}.html`)
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;
      
      // Optional: Capitalize and Init
      const capName = name.charAt(0).toUpperCase() + name.slice(1);
      const initFn = window[`init${capName}`];
      if (typeof initFn === "function") initFn();
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

