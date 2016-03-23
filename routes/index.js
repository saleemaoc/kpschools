
var pg = require('pg')
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'KP Services' })
};

exports.districts = function(req, res) {
    pg.connect(getDBConnectionURL(), function(err, client) {
        var sql = 'select ST_AsGeoJSON(geom) as shape, NAME_2 as division, NAME_3 as district, shape_area from kpdistricts;';
        // {type: "Feature", geometry: Object, properties: Object}
        client.query(sql, function(err, result) {
            var districts = new FeatureCollection();
            for (i = 0; i < result.rows.length; i++) {
                districts.features[i] = JSON.parse(result.rows[i].shape);
                districts.features[i]['properties'] = {'district': result.rows[i].district, 'division':  result.rows[i].division, 'area': result.rows[i].shape_area }
            }
            res.send(districts);
            //res.render('index', {title: 'KP Schools', features: districts })
        });
    });
}

exports.schools = function(req, res){
    // var sql = 'select ST_AsGeoJSON(geom) as shape from kpdistricts;'
    var sql = 'select ST_AsGeoJSON(geom) as shape, schoolname, scode, status, gender, level, location, village, tehsil, district, boys, girls, teachstaff, nonteachin, coveredarea, water, electricity, classrooms, otherrooms, latrineusa, boudarywall from schools;';
    return getSchools(sql, function(schools) {
        res.send(schools);
    });    
}

exports.filterSchools = function(req, res) {
    //["girls", "boys", "primary", "middle", "high", "highersec", "functional", "closed", "urban", "rural"]
    var sql = 'select ST_AsGeoJSON(geom) as shape, schoolname, scode, status, gender, level, location, village, tehsil, district, boys, girls, teachstaff, nonteachin, coveredarea, water, electricity, classrooms, otherrooms, latrineusa, boudarywall from schools';
    var clauseDict = {"girls": "gender='Girls'", "boys": "gender='Boys'", "primary": "level='Primary'", "middle": "level='Middle'", "high": "level='High'", "highersec": "level='Higher Secondary'", "functional": "status='Functional'", "closed": "status!='Functional'", "urban": "location='Urbon'", "rural": "location='Rural'"};

    var checked = req.param('checked');
    if(checked == undefined) {
        res.send('');
        return;
    }
    checked = checked.filter(function(v) { 
        if(!startsWith(v,"all")) {
            return v;
        }
    });
    console.log(checked);

    var whereClause = ' where ';
    for(i=0;i<checked.length;i++) {
        whereClause += ' ' + clauseDict[checked[i]]
        if(i+1 < checked.length) {
            whereClause += ' and ';
        }
    }
    console.log('checked: ' + checked.length);
    whereClause += ';';
    if(checked.length > 0) {
        sql += whereClause;
    }
    console.log(sql);

    return getSchools(sql, function(schools) {
        res.send(schools);
    });
}

function getSchools(sql, cb) {
    pg.connect(getDBConnectionURL(), function(err, client) {
        client.query(sql, function(err, result) {
            var schools = new FeatureCollection();
            for (i = 0; i < result.rows.length; i++) {
                schools.features[i] = JSON.parse(result.rows[i].shape);
                schools.features[i]['properties'] = {'School_Name': result.rows[i].schoolname, 'School_Code': result.rows[i].scode, 'Status': result.rows[i].status, 'Gender': result.rows[i].gender, 'Level': result.rows[i].level, 'Location': result.rows[i].location, 'Village': result.rows[i].village, 'Tehsil': result.rows[i].tehsil, 'District': result.rows[i].district, 'Boys': result.rows[i].boys, 'Girls': result.rows[i].girls, 'Teaching_Staff': result.rows[i].teachstaff, 'Nonteaching_Staff': result.rows[i].nonteachin, 'Covered_Area': result.rows[i].coveredarea, 'Water': result.rows[i].water, 'Electricity': result.rows[i].electricity, 'Classrooms': result.rows[i].classrooms, 'Other_Rooms': result.rows[i].otherrooms, 'Latrine': result.rows[i].latrineusa, 'Boundary_Wall': result.rows[i].boudarywall}
            }
            cb(schools);
        });
    });
}

exports.healthUnits = function(req, res){
    // var sql = 'select ST_AsGeoJSON(geom) as shape from kpdistricts;'
    var sql = 'select ST_AsGeoJSON(geom) as shape, inst_name as name, district, tehsil, type, beds, locality, status, lat, long as lon from kphealth;';
    pg.connect(getDBConnectionURL(), function(err, client) {
        client.query(sql, function(err, result) {
            var hu = new FeatureCollection();
            for (i = 0; i < result.rows.length; i++) {
                hu.features[i] = JSON.parse(result.rows[i].shape);
                hu.features[i]['properties'] = {'Name': result.rows[i].name, 'Type': result.rows[i].type, 'Beds':result.rows[i].beds, 'Status': result.rows[i].status, 'Tehsil': result.rows[i].tehsil, 'District': result.rows[i].district, 'Locality': result.rows[i].locality, 'Village': result.rows[i].village, 'Tehsil': result.rows[i].tehsil, 'District': result.rows[i].district, 'Boys': result.rows[i].boys, 'Girls': result.rows[i].girls, 'Teaching_Staff': result.rows[i].teachstaff, 'Nonteaching_Staff': result.rows[i].nonteachin, 'Covered_Area': result.rows[i].coveredarea, 'Water': result.rows[i].water, 'Electricity': result.rows[i].electricity, 'Classrooms': result.rows[i].classrooms, 'Other_Rooms': result.rows[i].otherrooms, 'Latrine': result.rows[i].latrineusa, 'Boundary_Wall': result.rows[i].boudarywall}
            }
            res.send(hu);
        });
    });
}

// ('0.000000','BHU Khurram','Karak','Banda Dawood Shah','BASIC HEALTH UNITS','1','-','R','Functional','0','3.32150000000e+001','7.10410000000e+001','0101000000B4C876BE9FC25140EC51B81E859B4040');
''


function getDBConnectionURL() {
    var connString = process.env.OPENSHIFT_POSTGRESQL_DB_URL || process.env.DATABASE_URL;
    if(connString == undefined) {
        console.log(connString);
        throw new Error("DB connection URL not set!!");
    }
    return connString;
}

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}

function startsWith(s1, s2) {
  return (s1.length >= s2.length && s1.substr(0, s2.length) == s2);
}

//{"girls": "gender='Girls'", "boys": "gender='boys'", "primary": "level='Primary'", "middle": "level='Middle'", "high": "level=''High", "highersec": "level='Higher Secondary'", "functional": "status='Functional'", "closed": "status!='Functional'", "urban": "location='Urbon'", "rural": "location='Rural'"}
