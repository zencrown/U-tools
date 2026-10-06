(() => {
  "use strict";
  
  const navBar = document.querySelector(".navBar");
  const folders = [...document.querySelectorAll(".mainContainer .folders")];
  const navIcons = [...document.querySelectorAll(".navBar .icon")];
  const searchInput = document.getElementById("search");
  const linkCount = document.getElementById("linkCount");
  const root = document.documentElement;
  let current = 0;
  
  const visibleFolders = folders.filter(f => f.style.display !== "none");
  const totalLinks = visibleFolders.reduce((n, f) => n + f.querySelectorAll("a").length, 0);
  
  if (linkCount) linkCount.textContent = `${totalLinks} tools · ${visibleFolders.length} categories`;
  
  function setActive(index, scroll = false) {
    if (!folders[index] || !navIcons[index]) return;
    current = index;
    
    navIcons.forEach((icon, i) => icon.classList.toggle("on", i === index));
    folders.forEach((folder, i) => folder.classList.toggle("on", i === index));
    
    const accent = getComputedStyle(folders[index]).getPropertyValue("--c").trim();
    if (accent) root.style.setProperty("--accent", accent);
    
    if (scroll && matchMedia("(min-width:700px)").matches) {
      folders[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  
  setActive(0);
  
  navBar?.addEventListener("click", event => {
    const icon = event.target.closest(".icon");
    if (!icon) return;
    const index = navIcons.indexOf(icon);
    if (index >= 0 && index !== current) setActive(index, true);
  });
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (!matchMedia("(min-width:700px)").matches) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = folders.indexOf(entry.target);
        if (index >= 0) {
          current = index;
          navIcons.forEach((icon, i) => icon.classList.toggle("on", i === index));
          const accent = getComputedStyle(entry.target).getPropertyValue("--c").trim();
          if (accent) root.style.setProperty("--accent", accent);
        }
      }
    }, { rootMargin: "-30% 0px -55% 0px" });
    folders.forEach(folder => observer.observe(folder));
  }
  
  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    
    visibleFolders.forEach(folder => {
      let matches = 0;
      folder.querySelectorAll("a").forEach(link => {
        const hit = !q || link.textContent.toLowerCase().includes(q) || link.href.toLowerCase().includes(q);
        link.classList.toggle("hide", !hit);
        if (hit) matches++;
      });
      folder.classList.toggle("empty", matches === 0);
    });
  });
  
  document.addEventListener("keydown", event => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput?.focus();
    } else if (event.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.blur();
    }
  });
  
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();