$(document).ready(function(){
  // get districts
  console.log('getting districts');
  var l = Ladda.create($('#refresh-btn')[0]);
  l.start();

  $.get('/districts', function(response) {
    console.log(response);
    if(response !== undefined) {
      showDistricts(response);
      console.log('districts loaded');
    }
    l.stop();
  });

  $.get('/schools', function(response) {
    console.log(response);
    if(response !== undefined) {
      showSchools(response);
      console.log('schools loaded');
    }
  });  
});

(function($) {
  $.fn.spin = function(opts, color) {
    var presets = {
      "tiny": { lines: 8, length: 2, width: 2, radius: 3 },
      "small": { lines: 10, length: 4, width: 4, radius: 6 },
      "large": { lines: 10, length: 8, width: 4, radius: 8 }
    };
    if (Spinner) {
      return this.each(function() {
        var $this = $(this),
          data = $this.data();
        
        if (data.spinner) {
          data.spinner.stop();
          delete data.spinner;
        }
        if (opts !== false) {
          if (typeof opts === "string") {
            if (opts in presets) {
              opts = presets[opts];
            } else {
              opts = {};
            }
            if (color) {
              opts.color = color;
            }
          }
          data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
        }
      });
    } else {
      throw "Spinner class not available.";
    }
  };
})(jQuery);

var myStyle = {
    "color": "#ff7800",
    "weight": 2,
    "opacity": 0.7
};

var southWest = L.latLng(25.712, 62.227),
northEast = L.latLng(44.774, 76.125),
bounds = L.latLngBounds(southWest, northEast);


var m= L.map('map', {maxBounds: bounds, maxZoom:19}).setView([33.0999,71.1328], 9);

/*var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
tiles.addTo(m);*/

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
          var division = f.properties.division;// Malakand
          var district = f.properties.district;//: Swat

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
    showCoverageOnHover: true,
  });
  markers.addLayer(sJson).addTo(m);
  // sJson.addTo(m);

}

$('#refresh-btn').on('click', function(e){
  var checkedValues = $('input:radio:checked').map(function() {
    // if(!this.value.startsWith("all")) {
      return this.value;
    // }
  }).get();

  console.log(checkedValues);
  var l = Ladda.create($('#refresh-btn')[0]);
  l.start();
  $.post('/schools', {'checked': checkedValues}, function(response) {
    // Log the response to the console
    console.log('response');
    console.log(response);
    if(response !== undefined) {
      if (markers !== null) {
        m.removeLayer(markers);
      }
      showSchools(response);
    }
    l.stop();
  });

});


$('#clear-btn').on('click', function(e){
/*  $('input:radio:checked').map(function() {
    $(this).removeAttr('checked');
  }).get();
  $('.allradio').map(function(){$(this).attr('checked','checked')});
  //$.get('/', function(data, status){console.log('status: ' + status)});
*/  location.reload(true);

});