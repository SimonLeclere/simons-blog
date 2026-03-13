# Propositions d'améliorations & bugs potentiels

## 1. La page About est très basique

`src/app/about/page.tsx` — Pas de photo, pas de liens vers les réseaux sociaux (sauf GitHub), pas de timeline / projets mis en avant.

Note de l'utilisateur: Je suis d'accord, la page About est très minimaliste pour l'instant. J'aimerais bien l'améliorer en ajoutant une photo de moi, une courte bio, et des liens vers mes réseaux sociaux (LinkedIn, Twitter). Je pourrais aussi ajouter une section "Projets" pour mettre en avant les projets sur lesquels j'ai travaillé. J'aimerais une page un peu créative.

## 2. Il manque une table des matières dans les posts longs

On pourrait ajouter une table des matières générée automatiquement pour les posts qui dépassent un certain nombre de mots ou de sections. Cela aiderait les lecteurs à naviguer dans les articles plus longs.

Pour le style de la table des matières, je pense à une TOC dans le même style que celle de notion (ou grok), c'est à dire un indicateur visuel discret qui montre seulement la structure du post, mais qui, au hover, affiche les titres complets et permet de cliquer pour naviguer. Je pense que ça serait un bon compromis entre utilité et discrétion.

## 3. Traduction du site en anglais

Je pense que ce serait une bonne idée de rendre le site bilingue (français et anglais). Cela permettrait d'atteindre un public plus large. On pourrait détecter la langue du navigateur et afficher le site dans la langue correspondante, avec une option pour changer manuellement la langue (bouton discret).

Pour les posts, on pourrait écrire deux versions (français et anglais). Il faut réfléchir à si on range les traductions dans un dossier nommé, si on ajoute un segment ".en."/".fr." dans les noms de fichiers, ou si on utilise un système de frontmatter pour indiquer la langue.