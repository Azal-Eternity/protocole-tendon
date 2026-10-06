# Protocole Tendon

Application de suivi du protocole de charge pour tendinopathie rotulienne proximale.
Séances quotidiennes, minuteur de séries, compléments, KPI, questionnaire VISA-P, assiduité.
Fonctionne hors ligne, s'installe sur l'écran d'accueil.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | L'application entière : interface, moteur 3D, minuteur, données |
| `manifest.json` | Déclaration d'application installable (nom, icônes, plein écran) |
| `sw.js` | Service worker : mise en cache pour le fonctionnement hors ligne |
| `three.min.js` | Moteur 3D hébergé localement — c'est lui qui rend le hors ligne possible |
| `icon-192.png` / `icon-512.png` | Icônes d'installation |
| `icon-maskable-512.png` | Icône adaptative Android (forme découpée par le système) |

Les six fichiers doivent rester **dans le même dossier**. Tous les chemins sont relatifs,
donc le dossier peut être servi depuis n'importe quelle adresse.

## Publication sur GitHub Pages

### 1. Créer le dépôt

Sur github.com, en étant connecté sur l'organisation `Azal-Eternity` :
**New repository** → nom **`protocole-tendon`** → visibilité **Public** → **Create**.

GitHub n'accepte ni espace ni accent dans un nom de dépôt. « Protocole Tendon » devient
donc `protocole-tendon` ; le nom affiché dans l'application reste « Protocole Tendon ».

GitHub Pages ne fonctionne sur un dépôt privé qu'avec un compte payant. En public, le code
est visible mais **aucune de tes données ne l'est** : elles restent dans le navigateur de
ton téléphone, rien n'est envoyé nulle part.

### 2. Déposer les fichiers

Sur la page du dépôt vide : **uploading an existing file**, puis glisser les **six fichiers**
d'un coup. Message de commit : `Version initiale`. **Commit changes**.

### 3. Activer Pages

**Settings** → **Pages** → Source : **Deploy from a branch** → Branch : **main**, dossier
**/ (root)** → **Save**. Le premier déploiement prend une à deux minutes.

### 4. Ouvrir sur le téléphone

Adresse obtenue :

```
https://azal-eternity.github.io/protocole-tendon/
```

Ouvrir dans **Chrome** sur Android. Un bouton **« Installer »** apparaît en haut à droite dès
que le service worker est enregistré — tous les critères sont désormais réunis, contrairement
à la version en page unique. Toucher, confirmer.

Sur iPhone : **Safari** uniquement, bouton Partager → **Sur l'écran d'accueil**.

### 5. Vérifier que le hors ligne marche

1. Ouvrir l'application, laisser l'écran de chargement afficher **Prêt**
2. Fermer, activer le mode avion
3. Relancer depuis l'icône : tout doit fonctionner, figure 3D comprise

Si le 3D manque hors ligne, c'est que `three.min.js` n'a pas été déposé ou qu'il n'est pas
dans le même dossier que `index.html`.

## Mettre à jour l'application

1. Remplacer le ou les fichiers modifiés dans le dépôt
2. **Incrémenter `VERSION` dans `sw.js`** (`"v1"` → `"v2"`)

Sans ce changement de version, les téléphones continuent de servir l'ancienne version depuis
leur cache. Une fois la nouvelle version détectée, le bouton de l'en-tête devient
**« Mettre à jour »**.

## Sauvegarde des données

Les mesures, séances cochées et scores vivent dans le stockage local du navigateur. Ils ne
sont ni synchronisés ni sauvegardés ailleurs. **Onglet Semaine → « Copier mes données »**
produit un JSON à coller dans Notion ou une note, à faire une fois par semaine.

Vider les données de site dans Chrome, ou désinstaller l'application, efface ces données.
