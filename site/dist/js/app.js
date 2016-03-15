/*! kp-schools 2016-03-15 */
function showDistricts(a){L.geoJson({features:a.features},{style:myStyle,onEachFeature:function(a,b){if(a.properties){var c="Khyber Pakhtunkhwa",d=a.properties.division,e=a.properties.district,f="District: "+e+"<br />Division: "+d+"<br /> Province: "+c;b.bindPopup(f)}}}).addTo(m)}function showSchools(a){sJson=L.geoJson({features:a.features},{style:myStyle,onEachFeature:function(a,b){var c=[];if(a.properties){for(var d in a.properties)c.push(d.replace("_"," ")+": "+a.properties[d]);b.bindPopup(c.join("<br />"))}}}),markers=new L.markerClusterGroup({disableClusteringAtZoom:13,showCoverageOnHover:!0}),markers.addLayer(sJson).addTo(m)}$(document).ready(function(){console.log("getting districts"),$.get("/districts",function(a){console.log(a),void 0!==a&&(showDistricts(a),console.log("districts loaded"))}),$.get("/schools",function(a){console.log(a),void 0!==a&&(showSchools(a),console.log("schools loaded"))})});var myStyle={color:"#ff7800",weight:2,opacity:.7},southWest=L.latLng(25.712,62.227),northEast=L.latLng(44.774,76.125),bounds=L.latLngBounds(southWest,northEast),m=L.map("map",{maxBounds:bounds,maxZoom:19}).setView([33.0999,71.1328],10),markers,sJson;$("#refresh-btn").on("click",function(a){var b=$("input:radio:checked").map(function(){return this.value}).get();console.log(b),$.post("/",{checked:b},function(a){console.log("response"),console.log(a),void 0!==a.schools&&(null!==markers&&m.removeLayer(markers),showSchools(a.schools))})}),$("#clear-btn").on("click",function(a){location.reload(!0)});