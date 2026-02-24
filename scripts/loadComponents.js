
async function loadHeadComponent(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const head = document.querySelector("head");
      if (!head) return;

      const template = document.createElement("template");
      template.innerHTML = html.trim();

      Array.from(template.content.childNodes).forEach(node => {
        head.appendChild(node);
      });

      if (typeof callback === "function") callback();
    });
}

async function loadComponent(selector, url, callback) {
  const target = document.querySelector(selector);
  if (!target) return;

  fetch(url)
    .then(res => res.text())
    .then(html => {
      target.innerHTML = html;
      if (typeof callback === "function") callback();
    });
}

// Auto-loader
document.querySelectorAll("[data-component]").forEach(el => {
  const name = el.dataset.component;

  if (name === "head") {
    loadHeadComponent(`/components/head.html`, setupPageHead);
    el.remove();
  } 
});



loadComponent('[data-component="nav"]', '/components/nav.html', initNav);
loadComponent('[data-component="footer"]', '/components/footer.html', initFooter);
loadComponent('[data-component="float"]', '/components/float.html');
//for ids\\
// loadComponent("nav", "components/nav.html", initNav);
// loadComponent("footer", "components/footer.html", initFooter);
// loadComponent("head", "components/head.html");

// move the mobile menu to <body> when opened \\
// mobileBtn.addEventListener('click', () => {
//   if (!document.body.contains(mobileMenu)) {
//     document.body.appendChild(mobileMenu);
//   }
//   mobileMenu.classList.toggle('is-open');
// });




// HEAD LOADER
function setupPageHead() {
  const page = location.pathname.split("/").pop().replace(".html", "") || "index";

  // 1. Automatic Title
  const pageName = page === "index"
    ? "Home"
    : page.charAt(0).toUpperCase() + page.slice(1);

  document.title = `${pageName} — Troop 309`;

  // 2. Automatic OpenGraph Title
  addMeta("property", "og:title", document.title);

  // 3. Automatic OpenGraph URL
  addMeta("property", "og:url", location.href);


}


function addMeta(attr, name, content) {
  const head = document.head;
  let tag = head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function addPageCSS(url) {
  fetch(url, { method: "HEAD" }).then(res => {
    if (res.ok) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
  });
}

function addPageScript(url) {
  fetch(url, { method: "HEAD" }).then(res => {
    if (res.ok) {
      const script = document.createElement("script");
      script.src = url;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}


// NAV BAR FUNCTION
function initNav() {
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


// FOOTER FUNCTION
function initFooter() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
