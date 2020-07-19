var serv= require('./servizi.js');

test('creazione utente', (ok)=>{
    var obj= {
        nome: "prova",
        cognome: "prova",
        email: "prova@gmail.com",
        paese: "prova",
        password: "prova"

    };
    serv.creaUtente(obj).then(()=>{
        ok();
    }).catch((err)=>{
        ok(err);
    });

});

test('aggiunta viaggio ', (ok)=>{
    var obj= {
        citta: 'padova',
        date: '0/00/0000',
        lat: 0,
        lng: 0,
        email: 'prova@gmail.com'
    };
    serv.addTravel(obj).then(()=>{
        ok();
    }).catch((err)=>{
        ok(err);
    });
});


test('aggiunta wish ', (ok)=>{
    var obj= {
        citta: 'palermo',
        date: null,
        email: 'prova@gmail.com'
    };
    serv.creaWish(obj).then(()=>{
        ok();
    }).catch((err)=>{
        ok(err);
    });
});

test('update wish',(ok)=>{
  
    var id,rev;
    serv.find('prova@gmail.com',["_id","_rev"]).then((body)=>{
        
        body.docs.forEach((doc)=>{
            id=doc._id;
            rev=doc._rev;
            
            var obj= {
                        _id:id,
                        _rev:rev,
                        citta: 'palermo',
                        date: '0/00/0000',
                        lat: 0,
                        lng: 0,
                        email: 'prova@gmail.com'
                    };
    
    serv.updateWish(id,rev,obj).then(()=>{
             ok();
         }).catch((err)=>{
                ok(err);
            });

        });
    }); 
    
   
});



test('elimina viaggio ',(ok)=>{
  
    var id,rev;
    serv.find('prova@gmail.com',["_id","_rev"]).then((body)=>{
        
        body.docs.forEach((doc)=>{
            id=doc._id;
            rev=doc._rev;
            serv.deleteTravel(id,rev).then(()=>{
                        ok();
                    }).catch((err)=>{
                            ok(err);
                        });
    
        });
    }); 
    
   
});       
                   
                



