
var pg = require('pg')
/*
 * GET home page.
 */

exports.index = function(req, res){

  //res.render('index', { title: 'KP Services' })
  getDistricts(req, res);
};

function getDistricts(req, res){

    var connString = 'postgres://kpapps:kcolniws@localhost:5432/kpapps';
    pg.connect(connString, function(err, client) {
    	// var sql = 'select ST_AsGeoJSON(geom) as shape from kpdistricts;'
    	var sql = 'select ST_AsGeoJSON(geom) as shape, NAME_2 as division, NAME_3 as district, shape_area from kpdistricts;';
 /*       var sql = 'select ST_AsGeoJSON(geog) as shape ';
        sql = sql + 'from spatial.state_1 ';
        sql = sql + 'where geog && ST_GeogFromText(\'SRID=4326;POLYGON(($1 $2,$3 $4,$5 $6,$7 $8,$9 $10))\') ';
        sql = sql + 'and ST_Intersects(geog, ST_GeogFromText(\'SRID=4326;POLYGON(($11 $12,$13 $14,$15 $16,$17 $18,$19 $20))\'));';
*/        
        // var vals = [bounds._southWest.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._northEast.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lng, bounds._southWest.lat];
        // var vals = vals.concat(vals);
        
        // {type: "Feature", geometry: Object, properties: Object}
		client.query(sql, function(err, result) {
		    var featureCollection = new FeatureCollection();
		    for (i = 0; i < result.rows.length; i++) {
		        featureCollection.features[i] = JSON.parse(result.rows[i].shape);
		        featureCollection.features[i]['properties'] = {'district': result.rows[i].district, 'division':  result.rows[i].division }
		    }
		    //res.send(featureCollection);
		    res.render('index', {title: 'KP Schools', features: featureCollection })
		});
	});
}


// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
    this.district = '';
    this.division = '';
    this.area = '';
}
