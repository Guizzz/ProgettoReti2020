function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 0, lng: 0},
  zoom: 2
});


}

function viewLabel(){
  $("#label").css("visibility", "visible");
}
function hideLabel(){
  $("#label").css("visibility", "hidden");
}

function view_map(){
  $("#btn").css("visibility", "hidden");
  $("#btn").css("height", "0vw");
  $("#btn").css("margin", "0vw");
  $("#map").css("visibility", "visible");
  $("#map").css("height", "60vh");
  $("#map").css("width", "60vw");
  add_marker(0,0);
}
async function del_travel(id, rev,citta)
{
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
  const res = await fetch('viaggi/del_viaggio', options);
 
}

async function get_pos(){
    var res = await fetch("/viaggi/positions");
    var body = await res.json();
    body.data.forEach((doc)=>{
      add_marker(doc);
    });
  }



function add_marker(data)
{
  var marker = new google.maps.Marker({
    map: map,
    position: {
      lat: data.lat,
      lng: data.lng
    }
  });

  var text = "Sei stato a "+data.citta+" il giorno: "+data.date;
  var infowindow = new google.maps.InfoWindow({
    content: text
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
    
    });
}
