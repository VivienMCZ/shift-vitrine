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

  // Le panneau se ferme avec Échap (le focus revient sur la pastille) ou par un clic à côté.
  const reglages = document.querySelector('.reglages');
  if (reglages) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reglages.open) { reglages.open = false; reglages.querySelector('summary').focus(); }
    });
    document.addEventListener('click', (e) => { if (reglages.open && !reglages.contains(e.target)) reglages.open = false; });
    // au clavier : le panneau se ferme dès que le focus en sort, pour ne jamais cacher l'élément focalisé (WCAG 2.4.11)
    reglages.addEventListener('focusout', (e) => { if (!reglages.contains(e.relatedTarget)) reglages.open = false; });
  }

  // Se souvenir des réglages d'affichage sur cet appareil (rien n'est envoyé).
  document.querySelectorAll('[data-reglage]').forEach((c) => {
    try { c.checked = localStorage.getItem('shift-' + c.dataset.reglage) === '1'; } catch (e) { /* stockage bloqué : réglage non gardé */ }
    c.addEventListener('change', () => {
      try { localStorage.setItem('shift-' + c.dataset.reglage, c.checked ? '1' : '0'); } catch (e) { /* idem */ }
    });
  });
});
