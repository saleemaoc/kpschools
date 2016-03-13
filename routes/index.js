
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
		    var districts = new FeatureCollection();
		    for (i = 0; i < result.rows.length; i++) {
		        districts.features[i] = JSON.parse(result.rows[i].shape);
		        districts.features[i]['properties'] = {'district': result.rows[i].district, 'division':  result.rows[i].division }
		    }
		    //res.send(districts);
		    //res.render('index', {title: 'KP Schools', features: districts })
		    getSchools(req, res, districts)
		});
	});
}

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}

function getSchools(req, res, districts){
    var connString = 'postgres://kpapps:kcolniws@localhost:5432/kpapps';
    pg.connect(connString, function(err, client) {
    	// var sql = 'select ST_AsGeoJSON(geom) as shape from kpdistricts;'
    	var sql = 'select  ST_AsGeoJSON(geom) as shape, schoolname, scode, status, gender, level, location, village, tehsil, district, boys, girls, teachstaff, nonteachin, coveredarea, water, electricity, classrooms, otherrooms, latrineusa, boudarywall from schools;';
 /*       var sql = 'select ST_AsGeoJSON(geog) as shape ';
        sql = sql + 'from spatial.state_1 ';
        sql = sql + 'where geog && ST_GeogFromText(\'SRID=4326;POLYGON(($1 $2,$3 $4,$5 $6,$7 $8,$9 $10))\') ';
        sql = sql + 'and ST_Intersects(geog, ST_GeogFromText(\'SRID=4326;POLYGON(($11 $12,$13 $14,$15 $16,$17 $18,$19 $20))\'));';
*/        
        // var vals = [bounds._southWest.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._northEast.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lng, bounds._southWest.lat];
        // var vals = vals.concat(vals);
        
        // {type: "Feature", geometry: Object, properties: Object}
		client.query(sql, function(err, result) {
		    var schools = new FeatureCollection();
		    for (i = 0; i < result.rows.length; i++) {
		        schools.features[i] = JSON.parse(result.rows[i].shape);
		        //schools.features[i]['properties'] = {'schoolname': result.rows[i].schoolname, 'scode': result.rows[i].scode, 'status': result.rows[i].status, 'gender': result.rows[i].gender, 'level': result.rows[i].level, 'location': result.rows[i].location, 'village': result.rows[i].village, 'tehsil': result.rows[i].tehsil, 'district': result.rows[i].district, 'boys': result.rows[i].boys, 'girls': result.rows[i].girls, 'teachstaff': result.rows[i].teachstaff, 'nonteachin': result.rows[i].nonteachin, 'coveredarea': result.rows[i].coveredarea, 'water': result.rows[i].water, 'electricity': result.rows[i].electricity, 'classrooms': result.rows[i].classrooms, 'otherrooms': result.rows[i].otherrooms, 'latrineusa': result.rows[i].latrineusa, 'boudarywall': result.rows[i].boudarywall}
		        schools.features[i]['properties'] = {'School_Name': result.rows[i].schoolname, 'School_Code': result.rows[i].scode, 'Status': result.rows[i].status, 'Gender': result.rows[i].gender, 'Level': result.rows[i].level, 'Location': result.rows[i].location, 'Village': result.rows[i].village, 'Tehsil': result.rows[i].tehsil, 'District': result.rows[i].district, 'Boys': result.rows[i].boys, 'Girls': result.rows[i].girls, 'Teaching_Staff': result.rows[i].teachstaff, 'Nonteaching_Staff': result.rows[i].nonteachin, 'Covered_Area': result.rows[i].coveredarea, 'Water': result.rows[i].water, 'Electricity': result.rows[i].electricity, 'Classrooms': result.rows[i].classrooms, 'Other_Rooms': result.rows[i].otherrooms, 'Latrine': result.rows[i].latrineusa, 'Boundary_Wall': result.rows[i].boudarywall}
		    }
		    //res.send(schools);
		    res.render('index', {title: 'KP Schools', districts: districts, schools: schools })
		});
});
}

exports.refreshSchools = function(req, res) {
    //["girls", "boys", "primary", "middle", "high", "highersec", "functional", "closed", "urban", "rural"]
    var sql = 'select  ST_AsGeoJSON(geom) as shape, schoolname, scode, status, gender, level, location, village, tehsil, district, boys, girls, teachstaff, nonteachin, coveredarea, water, electricity, classrooms, otherrooms, latrineusa, boudarywall from schools';
    var clauseDict = {"girls": "gender='Girls'", "boys": "gender='Boys'", "primary": "level='Primary'", "middle": "level='Middle'", "high": "level=''High", "highersec": "level='Higher Secondary'", "functional": "status='Functional'", "closed": "status!='Functional'", "urban": "location='Urbon'", "rural": "location='Rural'"};

    var checked = req.param('checked');
    // console.log(checked);

    var whereClause = ' where ';
    for(i=0;i<checked.length;i++) {
        whereClause += ' ' + clauseDict[checked[i]]
        if(i+1 < checked.length) {
            whereClause += ' and ';
        }
    }
    whereClause += ';';
    sql += whereClause;

    console.log(sql);

    var connString = 'postgres://kpapps:kcolniws@localhost:5432/kpapps';
    pg.connect(connString, function(err, client) {
        client.query(sql, function(err, result) {
            var schools = new FeatureCollection();
            for (i = 0; i < result.rows.length; i++) {
                schools.features[i] = JSON.parse(result.rows[i].shape);
                //schools.features[i]['properties'] = {'schoolname': result.rows[i].schoolname, 'scode': result.rows[i].scode, 'status': result.rows[i].status, 'gender': result.rows[i].gender, 'level': result.rows[i].level, 'location': result.rows[i].location, 'village': result.rows[i].village, 'tehsil': result.rows[i].tehsil, 'district': result.rows[i].district, 'boys': result.rows[i].boys, 'girls': result.rows[i].girls, 'teachstaff': result.rows[i].teachstaff, 'nonteachin': result.rows[i].nonteachin, 'coveredarea': result.rows[i].coveredarea, 'water': result.rows[i].water, 'electricity': result.rows[i].electricity, 'classrooms': result.rows[i].classrooms, 'otherrooms': result.rows[i].otherrooms, 'latrineusa': result.rows[i].latrineusa, 'boudarywall': result.rows[i].boudarywall}
                schools.features[i]['properties'] = {'School_Name': result.rows[i].schoolname, 'School_Code': result.rows[i].scode, 'Status': result.rows[i].status, 'Gender': result.rows[i].gender, 'Level': result.rows[i].level, 'Location': result.rows[i].location, 'Village': result.rows[i].village, 'Tehsil': result.rows[i].tehsil, 'District': result.rows[i].district, 'Boys': result.rows[i].boys, 'Girls': result.rows[i].girls, 'Teaching_Staff': result.rows[i].teachstaff, 'Nonteaching_Staff': result.rows[i].nonteachin, 'Covered_Area': result.rows[i].coveredarea, 'Water': result.rows[i].water, 'Electricity': result.rows[i].electricity, 'Classrooms': result.rows[i].classrooms, 'Other_Rooms': result.rows[i].otherrooms, 'Latrine': result.rows[i].latrineusa, 'Boundary_Wall': result.rows[i].boudarywall}
            }
            res.send({'schools': schools});
        });
    });


}
//{"girls": "gender='Girls'", "boys": "gender='boys'", "primary": "level='Primary'", "middle": "level='Middle'", "high": "level=''High", "highersec": "level='Higher Secondary'", "functional": "status='Functional'", "closed": "status!='Functional'", "urban": "location='Urbon'", "rural": "location='Rural'"}
