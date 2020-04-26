var prova = [
  {lat:0, lng:0},
  {lat:41.89193, lng:12.51133}
  //{lat:51.509865, lng:-0.118092}
];


function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 3
    });

      for(var i = 0; i< prova.length; i++){
        addMarker(prova[i]);
      }


    function addMarker(coords){
      var marker = new google.maps.Marker({
        position:coords,
        map:map
      });
    }

}
