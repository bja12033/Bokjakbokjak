(() => {
  const shell = document.querySelector('.recipe-carousel');
  const track = shell?.querySelector('.recipe-picker');
  const cards = [...document.querySelectorAll('.recipe-card')];
  if (!shell || !track || cards.length < 2) return;

  let start = 0;
  let page = 0;
  const visibleCount = () => Number.parseInt(getComputedStyle(track).getPropertyValue('--cards-visible'), 10) || 4;

  function render(reset = false) {
    const count = visibleCount();
    const maxStart = Math.max(0, cards.length - count);
    if (reset) start = 0;
    start = Math.min(start, maxStart);
    page = start === 0 ? 0 : Math.ceil(start / count);
    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const shift = start * (cardWidth + gap);
    track.style.transform = `translateX(-${shift}px)`;
    shell.querySelector('.recipe-page').textContent = `${page + 1} / ${Math.ceil(cards.length / count)}`;
    shell.querySelector('.recipe-prev').disabled = false;
    shell.querySelector('.recipe-next').disabled = false;
  }

  function move(direction) {
    const count = visibleCount();
    const maxStart = Math.max(0, cards.length - count);
    if (direction > 0) start = start >= maxStart ? 0 : Math.min(start + count, maxStart);
    else start = start <= 0 ? maxStart : Math.max(0, start - count);
    render();
  }

  shell.querySelector('.recipe-prev').addEventListener('click', () => move(-1));
  shell.querySelector('.recipe-next').addEventListener('click', () => move(1));
  window.addEventListener('resize', () => render());
  render();
})();
