var myStyle = {
    "color": "#ff7800",
    "weight": 2,
    "opacity": 0.7
};

var southWest = L.latLng(25.712, 62.227),
northEast = L.latLng(44.774, 88.125),
bounds = L.latLngBounds(southWest, northEast);



var m= L.map('map', {maxBounds: bounds}).setView([34.1249883172,73.6328125], 7);
var geo = L.geoJson(
  {
    style: myStyle,

    onEachFeature:function popUp(f,l){
  		var out = [];
  		if (f.properties){

        var NAME_0 = f.properties['NAME_0']//: Pakistan
        var NAME_1 = f.properties['NAME_1']//: N.W.F.P.
        var NAME_2 = f.properties['NAME_2']//: Malakand
        var NAME_3 = f.properties['NAME_3']//: Swat

        var popUpStr = "District: " + NAME_3 + "<br />Division: " + NAME_2 + "<br /> Province: " + NAME_1;
      		// for(var key in f.properties){
        //   	out.push(key+": "+f.properties[key]);
        //   }
        l.bindPopup(popUpStr);
        // TODO fitbound the map to clicked polygon
      }
    }
  }).addTo(m);



L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', { 
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors',
    subdomains: ['otile1','otile2','otile3','otile4']
}).addTo(m);


var base = 'files/kp.zip';

shp(base).then(function(data){
  geo.addData(data[2]);
});