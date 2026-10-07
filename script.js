(() => {
  "use strict";
  
  const navBar = document.querySelector(".navBar");
  const folders = [...document.querySelectorAll(".mainContainer .folders")];
  const navIcons = [...document.querySelectorAll(".navBar .icon")];
  const root = document.documentElement;
  let current = 0;
  
  function setActive(index) {
    if (!folders[index] || !navIcons[index]) return;
    current = index;
    
    navIcons.forEach((icon, i) => icon.classList.toggle("on", i === index));
    folders.forEach((folder, i) => folder.classList.toggle("on", i === index));
    
    const accent = getComputedStyle(folders[index]).getPropertyValue("--c").trim();
    if (accent) root.style.setProperty("--accent", accent);
  }
  
  setActive(0);
  
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