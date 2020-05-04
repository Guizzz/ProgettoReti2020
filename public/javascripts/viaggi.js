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

async function get_pos(){
    var res = await fetch("/viaggi/positions");
    var body = await res.json();
    for(var i = 0; i < body.data.length; i++){
      add_marker(body.data[i]);
    }
  }



function add_marker(data){

  var marker = new google.maps.Marker({
    map: map,
    position: {
      lat: data.value.lat,
      lng: data.value.lng
    }

  });
  var text = "Sei stato a "+data.id+" il giorno: "+data.value.date;
  var infowindow = new google.maps.InfoWindow({
    content: text
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
    console.log("prova");
    });
}
