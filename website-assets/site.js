'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-navigation');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const desktopQuery = window.matchMedia('(min-width: 720px)');
desktopQuery.addEventListener('change', closeMenu);

const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTool(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTool(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTool(tabs[next], true);
    }
  });
});

const demoDialog = document.getElementById('demo-dialog');
const demoVideo = document.getElementById('app-demo');
let demoOpener;

document.querySelectorAll('[data-open-demo]').forEach((button) => {
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'demo-dialog');
  button.addEventListener('click', () => {
    demoOpener = button;
    closeMenu();
    demoDialog.showModal();
    document.body.classList.add('dialog-is-open');
    demoDialog.querySelector('.dialog-close').focus();
  });
});

function closeDemo() {
  demoVideo.pause();
  demoDialog.close();
}

demoDialog.querySelector('.dialog-close').addEventListener('click', closeDemo);
demoDialog.addEventListener('cancel', () => demoVideo.pause());
demoDialog.addEventListener('click', (event) => {
  if (event.target !== demoDialog) return;
  const bounds = demoDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDemo();
});
demoDialog.addEventListener('close', () => {
  demoVideo.pause();
  document.body.classList.remove('dialog-is-open');
  if (demoOpener) demoOpener.focus({ preventScroll: true });
});

document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
