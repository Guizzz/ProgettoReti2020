

function viewLabel(){
  $("#label").css("visibility", "visible");
}
function hideLabel(){
  $("#label").css("visibility", "hidden");
}

async function del_travel(id, rev){
  var data = {
    id: id,
    rev: rev
  };
  const options = {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const res = await fetch('wishlist/del_wish', options);
}

async function update_travel(id, rev){
  var data = {
    id: id,
    rev: rev
  };
  const options = {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const res = await fetch('wishlist/update_wish', options);
}

function prova(){
  var d = new Date();
  var giorno = d.getDate();
  var mese = d.getMonth();
  var anno = d.getFullYear();
  console.log("giorno: "+giorno + " anno: "+anno + " mese: "+mese);
}
