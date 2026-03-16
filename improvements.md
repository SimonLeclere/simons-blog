# Propositions d'améliorations & bugs potentiels

## 1. Traduction du site en anglais

Je pense que ce serait une bonne idée de rendre le site bilingue (français et anglais). Cela permettrait d'atteindre un public plus large. On pourrait détecter la langue du navigateur et afficher le site dans la langue correspondante, avec une option pour changer manuellement la langue (bouton discret).

Pour les posts, on pourrait écrire deux versions (français et anglais). Il faut réfléchir à si on range les traductions dans un dossier nommé, si on ajoute un segment ".en."/".fr." dans les noms de fichiers, ou si on utilise un système de frontmatter pour indiquer la langue.

## 2. Auto-update "Listening to" via Deezer

La section "Currently" de la page About contient un champ "Listening to" qui est actuellement en dur. On pourrait l'alimenter dynamiquement via l'API Deezer pour afficher le dernier morceau écouté.
-> endpoint history
-> Problème actuel: deezer ne permet pas la création de nouvelles apps pour le moment