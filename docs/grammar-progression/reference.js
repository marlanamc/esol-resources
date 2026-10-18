// Printing is local only. Restore disclosure state after the print dialog closes.
let restorePrint = () => {};
document.addEventListener('click', event => {
  const button = event.target.closest('[data-print-week]');
  if (!button) return;
  const article = document.getElementById(button.dataset.printWeek);
  if (!article) return;
  restorePrint();
  const closed = [...article.querySelectorAll('details:not([open])')];
  article.classList.add('print-target');
  document.body.classList.add('print-one-week');
  closed.forEach(detail => { detail.open = true; });
  restorePrint = () => {
    article.classList.remove('print-target');
    document.body.classList.remove('print-one-week');
    closed.forEach(detail => { detail.open = false; });
  };
  window.print();
});
window.addEventListener('afterprint', () => restorePrint());
