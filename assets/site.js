document.querySelectorAll('.menu').forEach(b => b.addEventListener('click', () => document.querySelector('.mobile-nav').classList.toggle('open'))); document.querySelectorAll('form[data-demo]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const b = f.querySelector('button'); b.textContent = 'Thank you — enquiry received'; b.disabled = true; }));
const directorySearch = document.querySelector('#businessSearch');
const directoryCards = [...document.querySelectorAll('.business-card')];
const directoryButtons = [...document.querySelectorAll('.filter-chips [data-filter]')];
const directoryEmpty = document.querySelector('#businessEmpty');
let directoryFilter = 'all';
function updateDirectory() { if (!directorySearch) return; const query = directorySearch.value.trim().toLowerCase(); let visible = 0; directoryCards.forEach(card => { const category = card.dataset.category; const haystack = (card.dataset.search + ' ' + card.textContent).toLowerCase(); const show = (directoryFilter === 'all' || category === directoryFilter) && (!query || haystack.includes(query)); card.hidden = !show; if (show) visible++ }); if (directoryEmpty) directoryEmpty.style.display = visible ? 'none' : 'block' }
directorySearch?.addEventListener('input', updateDirectory);
directoryButtons.forEach(button => button.addEventListener('click', () => { directoryFilter = button.dataset.filter; directoryButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)) }); updateDirectory() }));
