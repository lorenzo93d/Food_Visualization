Visualizzazione del grafo delle ricette e degli ingredienti. 
A partire dalle principali aree di cucina su scala mondiale, è possibile esplorarne le ricette caratteristiche, talvolta suddivise per categoria. Scopo della visualizzazione è permettere all'utente di selezionare una o più ricette per identificarne gli ingredienti in comune.

Le immagini, non presenti nel dataset, sono state reperite dal sito www.themealdb.com tramite apposite api e salvate all'interno del progetto.

Per la gestione della fisica è stato scelto il modello 'forceAtlas2Based', basato su spring-embedders (https://visjs.github.io/vis-network/docs/network/physics.html).

Il progetto è stato realizzato utilizzando la libreria Vis.js, facendo riferimento alla sezione "network" (https://visjs.github.io/vis-network/docs/network/).

Per una corretta visualizzazione è necessario lanciare i file all'interno di un server. In ambiente Linux si suggeriscono i seguenti comandi:
python -m SimpleHTTPServer (Python2)
python3 -m http.server (Python3)

Autori del progetto:
Lorenzo d'Abbieri
Roberto Francazi
