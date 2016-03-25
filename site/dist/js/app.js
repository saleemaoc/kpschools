/*! kp-schools 2016-03-25 */
function showDistricts(a){L.geoJson({features:a.features},{style:myStyle,onEachFeature:function(a,b){if(a.properties){var c="Khyber Pakhtunkhwa",d=a.properties.division,e=a.properties.district,f=a.properties.area,g="District: "+e+"<br />Area: "+f+"<br />Division: "+d+"<br /> Province: "+c;b.bindPopup(g)}}}).addTo(m)}function showSchools(a){sJson=L.geoJson({features:a.features},{style:myStyle,onEachFeature:function(a,b){var c=[];if(a.properties){for(var d in a.properties)c.push(d.replace("_"," ")+": "+a.properties[d]);b.bindPopup(c.join("<br />"));var e="l";"Primary"===a.properties.Level?e="s":"Middle"===a.properties.Level&&(e="m"),"Boys"===a.properties.Gender?b.setIcon(L.MakiMarkers.icon({icon:"school",color:"#00cdcd",size:e})):b.setIcon(L.MakiMarkers.icon({icon:"school",color:"#68228b",size:e}))}}});markers=new L.markerClusterGroup({disableClusteringAtZoom:12,showCoverageOnHover:!0,singleMarkerMode:!1}),null!==markers&&m.removeLayer(markers),markers.addLayer(sJson).addTo(m)}function showHealthUnits(a){var b=L.geoJson({features:a.features},{style:myStyle,onEachFeature:function(a,b){var c=[];if(a.properties){for(var d in a.properties)c.push(d+" : "+a.properties[d]);b.bindPopup(c.join("<br />"))}}});markers=new L.markerClusterGroup({disableClusteringAtZoom:13,showCoverageOnHover:!0}),null!==markers&&m.removeLayer(markers),markers.addLayer(b).addTo(m)}function closeDialog(){Avgrund.hide()}function toggleMenu(){var a=$(".btn-toolbar");a.hasClass("expand")?(a.removeClass("expand"),$("#map").removeClass("collapse")):(a.addClass("expand"),$("#map").addClass("collapse"))}!function(a){a.fn.spin=function(b,c){var d={tiny:{lines:8,length:2,width:2,radius:3},small:{lines:10,length:4,width:4,radius:6},large:{lines:10,length:8,width:4,radius:8}};if(Spinner)return this.each(function(){var e=a(this),f=e.data();f.spinner&&(f.spinner.stop(),delete f.spinner),b!==!1&&("string"==typeof b&&(b=b in d?d[b]:{},c&&(b.color=c)),f.spinner=new Spinner(a.extend({color:e.css("color")},b)).spin(this))});throw"Spinner class not available."}}(jQuery),$(document).ready(function(){var a=Ladda.create($("#refresh-btn")[0]);a.start(),$.get("/districts",function(b){void 0!==b&&(showDistricts(b),console.log("districts loaded")),a.stop()}),$.get("/schools",function(a){void 0!==a&&(showSchools(a),console.log("schools loaded"))})});var myStyle={color:"#ea8557",weight:1,opacity:.3},southWest=L.latLng(25.712,67.227),northEast=L.latLng(44.774,76.125),bounds=L.latLngBounds(southWest,northEast),m=L.map("map",{maxBounds:bounds,maxZoom:19}).setView([33.0999,71.1328],9),googleLayer=new L.Google("ROADMAP");m.addLayer(googleLayer);var markers,sJson;$("#refresh-btn").on("click",function(a){var b=$("input:radio:checked").map(function(){return this.value}).get();$("#map").hasClass("collapse")&&toggleMenu();var c=Ladda.create($("#refresh-btn")[0]);c.start(),$.post("/schools",{checked:b},function(a){console.log("response"),void 0!==a&&(null!==markers&&m.removeLayer(markers),showSchools(a)),c.stop()})}),$(".menu-btn").on("click",function(a){toggleMenu()}),$("#sabout").on("click",function(a){Avgrund.show("#about-box")}),$("#clear-btn").on("click",function(a){location.reload(!0)}),$("#about").on("click",function(a){a.preventDefault(),$(".cd-panel").hasClass("is-visible")?$(".cd-panel").removeClass("is-visible"):$(".cd-panel").addClass("is-visible")}),$("#map").on("click",function(a){$(".cd-panel").removeClass("is-visible")}),$(".cd-panel").on("click",function(a){($(a.target).is(".cd-panel")||$(a.target).is(".cd-panel-close"))&&($(".cd-panel").removeClass("is-visible"),a.preventDefault())});