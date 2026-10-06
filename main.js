// GETTING ELEMENTS
let navBar = document.querySelector('.navBar');
let folderContainer = document.querySelector('.mainContainer');

navBar.onclick = (event)=>{
  if(event.target.classList.contains('icon')){
  let parent = event.target.parentElement;
  let icons = parent.querySelectorAll('.icon');
  let iconsCount = icons.length;
  for(i=0; i<iconsCount; i++){
    icons[i].classList.remove('on');
  }
  event.target.classList.add('on');
  document.body.style.pointerEvents = "none";
  setTimeout(()=>{
    document.body.style.pointerEvents = "auto";
  },700);
}
  else{
    return;
  }
}

function flipFolders(e){
  let folders = folderContainer.querySelectorAll('.folders');
  let foldersCount = folders.length;
  for(i=0; i<foldersCount; i++){
    folders[i].classList.remove('on');
  }
  folders[e-1].classList.add('on');
}