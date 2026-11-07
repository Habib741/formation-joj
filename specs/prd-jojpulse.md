# PRD — JojPulse

**Statut** : Validé

## Problème

Aux JOJ Dakar 2026, les épreuves s'enchaînent sur plusieurs sites. Le public ne sait pas vite qui a gagné, les journalistes recoupent les résultats à la main, et quand un podium publié est faux, la correction se diffuse mal : les deux versions circulent et personne ne sait laquelle est officielle.

## Utilisateurs

- **Officiel des résultats d'un site** : publier le podium d'une épreuve terminée et, au besoin, le corriger. Parcours : il choisit l'épreuve qui vient de se terminer, saisit l'or, l'argent et le bronze, puis publie. Si le jury revient sur sa décision, il corrige le podium en donnant un motif.
- **Spectateur** (sur place ou à distance) : savoir qui a gagné. Parcours : il ouvre la plateforme sur son téléphone, cherche une discipline (« lutte ») ou filtre par site et par jour, ouvre l'épreuve et voit le podium. Un podium corrigé porte la mention « corrigé ».
- **Journaliste accrédité** : vérifier un résultat sans recouper à la main. Parcours : il retrouve l'épreuve par la recherche, vérifie que le résultat est officiel, quand et par quel site il a été publié, et lit l'historique s'il a été corrigé, avant de citer le podium.

## Proposition

JojPulse est une plateforme web, consultable sur téléphone comme sur ordinateur, qui est la source unique des résultats officiels : chaque officiel y publie le podium de son site, et le public comme les journalistes y lisent le même résultat. On y cherche une épreuve par discipline et on filtre par site ou par jour. Une correction ne remplace pas un podium en silence : elle garde l'ancienne version et son motif. La source unique s'attaque au vrai problème, plusieurs versions qui circulent, mieux qu'un canal de diffusion de plus ; le web se consulte sans installation, depuis les gradins comme depuis une salle de presse.

## Mesure du succès

Pendant la démo : un officiel publie le podium d'une épreuve, et un spectateur le voit tout de suite. Un podium où le même athlète figure deux fois est refusé. Un podium corrigé apparaît comme « corrigé », avec son motif et l'ancienne version. Une recherche « lutte » ne montre que les épreuves de lutte.

## Tranches

### TR1 — Publier et consulter un podium

L'officiel publie l'or, l'argent et le bronze d'une épreuve, et le spectateur consulte le podium de cette épreuve. Règles : trois athlètes différents ; une épreuve n'a qu'un podium publié.

### TR2 — Corriger un podium, avec sa trace

L'officiel corrige un podium publié en donnant un motif obligatoire. Le spectateur et le journaliste voient que le résultat a été corrigé, avec l'historique des versions.

### TR3 — Rechercher et filtrer les résultats de tous les sites

Le spectateur voit les épreuves terminées de tous les sites, la plus récente d'abord. Il cherche une discipline par son nom et filtre par site, par discipline ou par jour.

### TR4 — Vérification par les journalistes

Le journaliste voit, pour chaque résultat, s'il est officiel, quand il a été publié ou corrigé pour la dernière fois, et par quel site.

## Hors périmètre

- Le chronométrage et le calcul des classements (le jury décide du podium), le tableau des médailles par pays, les records, les notifications poussées et les réseaux sociaux.

## Hypothèses et risques

- Supposé : un officiel par site, déjà reconnu par la plateforme, publie après la décision du jury. Si une réclamation est en cours, il faudra un état « provisoire ».
- Supposé : pas d'ex æquo. Deux médailles de bronze, par exemple, casseraient la règle des trois athlètes différents.
- Supposé : les épreuves, les disciplines, les sites et les athlètes sont déjà connus. Leur saisie n'est pas couverte.
