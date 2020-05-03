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
      add_marker(body.data[i].value.lat, body.data[i].value.lng);
    }
  }



function add_marker(lat, lng){
  var marker = new google.maps.Marker({
    map: map,
    position: {
      lat: lat,
      lng: lng
    }
  });
}
