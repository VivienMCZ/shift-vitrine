# shift-vitrine

Vitrine publique de Shift et liste d'attente (carte Trello US 10). Pages statiques servies par
GitHub Pages : aucun serveur, aucun cookie, aucun secret. Un seul script, `motion.js` (1 Ko), qui ne fait qu'animer : sans lui la page reste complète.

| Fichier | Rôle |
|---|---|
| `index.html` | La vitrine : coût moyen du permis, trois montants sourcés, la nouvelle aide de la Région, le formulaire |
| `mentions-legales.html` | Éditeur, hébergeur, ce que devient l'adresse e-mail, droits |
| `merci.html` | Page « Vérifie ta boîte », vers laquelle Brevo renvoie après l'envoi |
| `motion.js` | Fait compter les chiffres et monter les blocs au défilement, ferme le panneau des réglages avec Échap, et se souvient des réglages d'affichage sur l'appareil (`localStorage`, rien n'est envoyé) |
| `style.css`, `fonts/` | Styles et police Archivo, hébergée ici (jamais Google Fonts) |

Écran Figma de référence : fichier `azam20tqlvBolPypsIG8IE`, cadres `363:2272` (1440) et `365:2264` (390).

Tester en local : `python3 -m http.server 8000` dans ce dossier, puis http://127.0.0.1:8000.

## Avant de publier (à faire une fois)

1. **Brevo** : créer le compte. Dans les réglages, accepter le contrat de sous-traitance (DPA), vérifier
   qu'il dit bien que les contacts restent dans l'Union européenne, activer la double authentification,
   **couper le suivi des ouvertures et des clics** des e-mails (la page de confidentialité promet qu'il
   n'y en a pas), et ne créer aucune clé d'API. Créer une liste « Liste d'attente » et un attribut `PROFIL` (texte). Créer
   ensuite un formulaire d'inscription avec la **double confirmation** activée, l'adresse de redirection
   `https://vivienmcz.github.io/shift-vitrine/merci.html`, et l'effacement des contacts non confirmés au
   bout de 30 jours si l'option existe.
2. Copier l'adresse d'envoi du formulaire (`https://….sibforms.com/serve/…`) dans l'attribut `action` du
   `<form>` de `index.html`, à la place de `BREVO_FORM_URL…A_REMPLACER`, et remplacer
   `https://*.sibforms.com` par cet hôte exact dans la CSP des trois pages.
3. Compléter les deux `[À COMPLÉTER]` de `mentions-legales.html` (nom affiché, e-mail de contact).
4. Settings → Pages → *Deploy from a branch* → `main`, dossier `/ (root)`.
5. Envoyer une vraie inscription de test, dans Chrome **et** Firefox : le formulaire part, le retour vers
   `merci.html` n'est pas bloqué, l'e-mail de confirmation arrive, le lien de désinscription marche, et un
   gestionnaire de mots de passe ne remplit pas le champ piège.
6. Si l'effacement automatique à 30 jours n'existe pas dans Brevo : supprimer les contacts non confirmés à
   la main, une fois par mois.

## Mettre les chiffres à jour

Les montants sont **recopiés** du calculateur (dépôt `shift` : `backend/apps/aides/data/aides.yaml` et
`cout-reference.yaml`), avec leur source et leur date de vérification. Quand une aide change là-bas,
changer le montant **et** la date ici. Règles : toujours « jusqu'à » et « tu pourrais », jamais « tu as
droit à » ; la condition principale de chaque montant reste écrite à côté ; la phrase « Montants
indicatifs : c'est l'organisme qui décide. » reste sous les montants.

## Sécurité

La politique de sécurité (CSP) est posée par une balise `<meta>`, car GitHub Pages ne permet pas
d'en-têtes : rien d'autre que les fichiers de ce dépôt n'est chargé, et le formulaire ne peut partir que
vers Brevo. Aucun script de Brevo n'est chargé : le formulaire est un simple envoi HTML, donc aucun
traceur sur la page.

Limite connue : `frame-ancestors` est ignoré dans une `<meta>`, donc la page peut être affichée dans le
cadre d'un autre site. Risque accepté (rien n'est pré-rempli, double confirmation) ; à fermer avec
l'en-tête `frame-ancestors 'none'` dès qu'on passe sur un domaine à nous.

La police Archivo est sous licence SIL Open Font License (`fonts/OFL.txt`).
