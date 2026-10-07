(() => {
  "use strict";
  
  const navBar = document.querySelector(".navBar");
  const folders = [...document.querySelectorAll(".mainContainer .folders")];
  const navIcons = [...document.querySelectorAll(".navBar .icon")];
  const slider = document.querySelector(".navSlider");
  const root = document.documentElement;
  let current = 0;
  
  // Move the highlight box behind the active nav button
  function moveSlider(animate = true) {
    const icon = navIcons[current];
    if (!slider || !icon) return;
    
    if (!animate) slider.classList.add("no-anim");
    
    slider.style.width = icon.offsetWidth + "px";
    slider.style.height = icon.offsetHeight + "px";
    slider.style.transform = `translate(${icon.offsetLeft}px, ${icon.offsetTop}px)`;
    slider.classList.add("ready");
    
    if (!animate) {
      void slider.offsetWidth; // flush so the jump is instant
      slider.classList.remove("no-anim");
    }
  }
  
  function setActive(index) {
    if (!folders[index] || !navIcons[index]) return;
    current = index;
    
    navIcons.forEach((icon, i) => icon.classList.toggle("on", i === index));
    folders.forEach((folder, i) => folder.classList.toggle("on", i === index));
    
    const accent = getComputedStyle(folders[index]).getPropertyValue("--c").trim();
    if (accent) root.style.setProperty("--accent", accent);
    
    moveSlider(true);
  }
  
  setActive(0);
  moveSlider(false);
  
  // Keep slider aligned on resize / font load / orientation change
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => moveSlider(false)).observe(navBar);
  } else {
    window.addEventListener("resize", () => moveSlider(false));
  }
  window.addEventListener("load", () => moveSlider(false));
  
  navBar?.addEventListener("click", event => {
    const icon = event.target.closest(".icon");
    if (!icon) return;
    const index = navIcons.indexOf(icon);
    if (index >= 0 && index !== current) setActive(index);
  });
  
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();