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

$(document).ready(function(){
  // get districts
  var l = Ladda.create($('#refresh-btn')[0]);
  l.start();

  $.get('/districts', function(response) {
    // console.log(response);
    if(response !== undefined) {
      showDistricts(response);
      console.log('districts loaded');
    }
    l.stop();
  });

  $.get('/schools', function(response) {
    // console.log(response);
    if(response !== undefined) {
      showSchools(response);
      console.log('schools loaded');
    }
  });

/*  $.get('/healthunits', function(response) {
    console.log(response);
    if(response !== undefined) {
      showHealthUnits(response);
      console.log('health units loaded');
    }
  });
*/
});


var myStyle = {
    "color": "#ea8557",
    "weight": 1,
    "opacity": 0.3
};

var southWest = L.latLng(25.712, 67.227),
northEast = L.latLng(44.774, 76.125),
bounds = L.latLngBounds(southWest, northEast);


var m= L.map('map', {maxBounds: bounds, maxZoom:19}).setView([33.0999,71.1328], 9);
/*var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
tiles.addTo(m);*/
var googleLayer = new L.Google('ROADMAP');
m.addLayer(googleLayer);

function showDistricts(f) {
  var geo = L.geoJson(
    {
      features: f.features
    },
    {
      style: myStyle,

      onEachFeature:function popUp(f,l){
        var out = [];
        if (f.properties){

          var province = 'Khyber Pakhtunkhwa';
          var division = f.properties.division;
          var district = f.properties.district;
          var area = f.properties.area;

          var popUpStr = "District: " + district + "<br />Area: " + area + "<br />Division: " + division + "<br /> Province: " + province;
          l.bindPopup(popUpStr);
        }
      }
    }).addTo(m);
}

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
      if (f.properties) {
        for(var key in f.properties){
          out.push(key.replace("_"," ") + ": " + f.properties[key]);
        }
        l.bindPopup(out.join('<br />'));
        var size = 'l';
        if(f.properties['Level'] === 'Primary') {
          size = 's';
        } else if(f.properties['Level'] === 'Middle') {
          size='m';
        }
        if(f.properties['Gender'] === 'Boys') {
          l.setIcon(L.MakiMarkers.icon({icon: "school", color: "#00cdcd", size: size})); // cyan
        } else {
          l.setIcon(L.MakiMarkers.icon({icon: "school", color: "#68228b", size: size}));//dark orchid
        }
      }
    }
  });
var c;
  markers = new L.markerClusterGroup({
    disableClusteringAtZoom: 12,
    showCoverageOnHover: true,
    singleMarkerMode:false,

  });

  if (markers !== null) {
    m.removeLayer(markers);
  }
  markers.addLayer(sJson).addTo(m);
}


function showHealthUnits(hunits) {
  var hJson = L.geoJson(
  {
    features: hunits.features
  },
  {
    style: myStyle,

    onEachFeature:function popUp(f,l){
      var out = [];
      // console.log(f);
      if (f.properties){
        for(var key in f.properties){
          out.push(key + " : " + f.properties[key]);
        }
        l.bindPopup(out.join('<br />'));
      }
    }
  });
  markers = new L.markerClusterGroup({
    disableClusteringAtZoom: 13,
    showCoverageOnHover: true,
  });
  if (markers !== null) {
    m.removeLayer(markers);
  }
  markers.addLayer(hJson).addTo(m);
  // sJson.addTo(m);
}


$('#refresh-btn').on('click', function(e){
  var checkedValues = $('input:radio:checked').map(function() {
      return this.value;
  }).get();

  // hide menu and show map, if map hidden
  if($('#map').hasClass('collapse')) {
    toggleMenu();
  }

  // console.log(checkedValues);
  var l = Ladda.create($('#refresh-btn')[0]);
  l.start();
  $.post('/schools', {'checked': checkedValues}, function(response) {
    // Log the response to the console
    console.log('response');
    if(response !== undefined) {
      if (markers !== null) {
        m.removeLayer(markers);
      }
      showSchools(response);
    }
    l.stop();
  });

});

function closeDialog() {
    Avgrund.hide();
}

function toggleMenu() {
  var el = $('.btn-toolbar');
  if(el.hasClass('expand')) {
    el.removeClass('expand');
    $('#map').removeClass('collapse');
  } else {
    el.addClass('expand');
    $('#map').addClass('collapse');
  }
}

$('.menu-btn').on('click', function(e){
  toggleMenu();
});

$('#sabout').on('click', function(e){
    Avgrund.show( "#about-box" );
});

$('#clear-btn').on('click', function(e){
  location.reload(true);

});


$('#about').on('click', function(event){
  event.preventDefault();
  if($('.cd-panel').hasClass('is-visible')) {
    $('.cd-panel').removeClass('is-visible');
  } else {
    $('.cd-panel').addClass('is-visible');
  }
});

$("#map").on('click', function(e){
  $('.cd-panel').removeClass('is-visible');
});

$('.cd-panel').on('click', function(event){
  if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) { 
    $('.cd-panel').removeClass('is-visible');
    event.preventDefault();
  }
});