// Animations de la vitrine. Sans ce fichier, la page reste complète et lisible :
// les chiffres sont déjà écrits dans le HTML, ce script ne fait que les faire compter.
// Les lecteurs d'écran lisent la copie fixe (.lu) ; celle qui compte est aria-hidden.
'use strict';
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('anime');

document.addEventListener('DOMContentLoaded', () => {

const nombre = new Intl.NumberFormat('fr-FR');
function compter(el) {
  const fin = Number(el.dataset.compte);
  const duree = 1400;
  const debut = performance.now();
  function pas(t) {
    const p = Math.min((t - debut) / duree, 1);
    const doux = 1 - Math.pow(1 - p, 4);
    el.textContent = nombre.format(Math.round(fin * doux)).replace(/ /g, ' ');
    if (p < 1) requestAnimationFrame(pas);
  }
  requestAnimationFrame(pas);
}

const vus = new IntersectionObserver((entrees) => {
  for (const e of entrees) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('vu');
    if (!calme) e.target.querySelectorAll('[data-compte]').forEach(compter);
    vus.unobserve(e.target);
  }
}, { threshold: 0.2 });

document.querySelectorAll('.monte, .titre-chiffre').forEach((el) => vus.observe(el));
});
