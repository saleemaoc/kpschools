var myStyle = {
    "color": "#ff7800",
    "weight": 2,
    "opacity": 0.7
};

var southWest = L.latLng(25.712, 62.227),
northEast = L.latLng(44.774, 76.125),
bounds = L.latLngBounds(southWest, northEast);


var m= L.map('map', {maxBounds: bounds}).setView([33.0999,71.1328], 10);

/*var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
tiles.addTo(m);
*/
function showDistricts(f) {
  var geo = L.geoJson(
    {
      features: f.features
    },
    {
      style: myStyle,

      onEachFeature:function popUp(f,l){
        var out = [];
        // console.log(f);
        if (f.properties){

          var province = 'Khyber Pakhtunkhwa';
          var division = f.properties['division']//: Malakand
          var district = f.properties['district']//: Swat

          var popUpStr = "District: " + district + "<br />Division: " + division + "<br /> Province: " + province;
            // for(var key in f.properties){
          //    out.push(key+": "+f.properties[key]);
          //   }
          l.bindPopup(popUpStr);
          // TODO fitbound the map to clicked polygon
          // m.fitbounds()
        }
      }
    }).addTo(m);
}

/*
var base = 'files/kp.zip';

shp(base).then(function(data){
  geoJson.addData(data[2]);
});
*/

var markers;
var sJson;

function showSchools(schools) {
  sJson = L.geoJson(
  {
    features: schools.features
  },
  {
    style: myStyle,

    onEachFeature:function popUp(f,l){
      var out = [];
      // console.log(f);
      if (f.properties){
        for(var key in f.properties){
          out.push(key.replace("_"," ") + ": " + f.properties[key]);
        }
        l.bindPopup(out.join('<br />'));
      }
    }
  });
  markers = new L.markerClusterGroup({
    disableClusteringAtZoom: 13,
    showCoverageOnHover: false,
  });
  markers.addLayer(sJson).addTo(m);
  // sJson.addTo(m);

}

$('#refresh-btn').on('click', function(e){
  var checkedValues = $('input:checkbox:checked').map(function() {
    return this.value;
  }).get();

  console.log(checkedValues);
  $.post('/', {'checked': checkedValues}, function(response) {
      // Log the response to the console
      console.log(response.schools);
    if (markers != null) {
      m.removeLayer(markers);
    }
    showSchools(response.schools);
  });

});


$('#clear-btn').on('click', function(e){
  $('input:checkbox:checked').map(function() {
    $(this).removeAttr('checked');
  }).get();
});