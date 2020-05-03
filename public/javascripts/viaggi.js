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

function add_marker(){
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch('viaggi/get_position', options).then(function(res){
    console.log(res);
  });
  // const res = await fetch('viaggi/get_position');
  // console.log(res.body);
  var marker = new google.maps.Marker({
    map: map,
    position: {
      lat: 0,
      lng: 0
    }
  });
}
