

function viewLabel(){
  $("#label").css("visibility", "visible");
}
function hideLabel(){
  $("#label").css("visibility", "hidden");
}

async function del_travel(id, rev,citta){
  var data = {
    id: id,
    rev: rev,
    citta:citta
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

async function update_travel(id, rev,citta){
  var data = {
    id: id,
    rev: rev,
    citta: citta
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
