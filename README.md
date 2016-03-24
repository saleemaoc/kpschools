# KP Schools

A GIS-based web application for Govt schools in Khyber Pakhtunkhwa. 
Currently, this application shows all the schools on an interactive map. The map shows administrative boundaries of all districts in KP.

Features include:
* Basic information about districts.
* Information about schools like school name, school code, school level, functioning status, village, post office, union council, tehsil, district, no. of students, no. of staff (teaching + non-teaching), covered area, and school facilities like water, electricity etc.
* Schools shown by various color and size markers depending on the school type and level.
	* Cyan color markers show Boys schools
	* Dark orchid color markers show girls schools
    * Small size markers show primary schools
    * Medium size markers show Middle schools
    * Large size markers show High and Higher Secondary schools

It allows viewers to filterg schools based on the following criteria:

* District: View schools by one or more selected districts (Data available for Karak district only)
* Level: Primary, Middle, High, Higher Secondary
* Gender: Boys, Girls
* Status: Functional, Temporary closed
* Location: Urban, Rural



## Demo

[Demo link](http://kpschools-suaoc.rhcloud.com/)


### Installation

[todo include db migrations]
```
git clone git@github.com:saleemaoc/kpschools.git
cd kpschools
npm install
npm start
```
Open `http://localhost:3000` in your browser


## Browser support

The project is tested in Chrome and Firefox. It Should Work™ in the current stable releases of Chrome, Firefox, Safari as well as IE9 and up.


## Todos

* Calculate and display ranking score for every school
	A ranking score will be calculated for each school based on the students to teachers ration, students to classrooms ratio, area covered, facilities. This score is represented through thematic markers where green shows high ranked schools and red shows lower ranked schools.
* Add map legend
* Port to backbone.js
* Test coverage
* Documentation
* Urdu language support


## License

MIT: http://suaoc.mit-license.org/
