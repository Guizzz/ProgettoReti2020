# Travel The World

Travel the world è il nostro progetto di Reti Di Calcolatori, anno 2020.  Il progetto è stato sviluppato da Alessio Caperna, Nello Castaldo e Andrea Guizzaro. Lo scopo di questo sito è quello di monitorare i viaggi che si desiderano fare e quelli effettivamente compiuti, visualizzando questi ultimi su una mappa di google Maps.

## installazione

Per installare il progetto bisogna clonare la repository e digitare da linea di comando: 

    $ npm install

per installare le dipendenze. 

## Esecuzione

Per eseguire la nostra app è necessario far partire il server digitando: 

	$npm start

l'applicazione girerà in localhost:3000. 

## Api utilizzate

Le api che Travel the world mette a disposizione sono: 

	GET /api/get_coords/{nome_città}

che ritorna le coordinate di una data città in formato json. 

	GET /api/get_wish/{utente}

che ritorna la lista dei viaggi che l'utente desidera fare, in formato json. 

	GET /api/get_travel/{utente}

che ritorna la lsita dei viaggi compiuti dall'utente con relativa data, in formato json. 

	GET /api/get_url/{nome_città}

che ritorna la url della foto di una data città, in formato json. 

## Tecnologie utilizzate

* Nodejs
* API offerte da google maps
* WebSocket
* Swagger per documentazione delle nostre API
* Jest per effettuare i test

## Test

Per effettuare i test digitare: 

	$ npm run test


