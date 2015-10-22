console.log("Creating..............");
var start = Date.now(),
	fs = require('fs'),
	filePath = process.argv[2], //first word after app.js
	parseString = require('xml2js').parseString,
	shapeData = {name: "", coordinates: ""},
	shapeFileData = [],
	//coordinates = [],
	shapes,
	line = "shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled",
	lines = "";
// Reading the data from file using readFileSync as blocking
var fileData = fs.readFileSync(filePath, 'utf8');
// parse the data from file
parseString(fileData, function (err, result) {
	for (var i in result.kml.Document[0].Placemark) {
		shapeData = {name: "", coordinates: ""};
		shapes = result.kml.Document[0].Placemark[i];
		if(shapes.LineString){
			shapeData.name = shapes.name[0];
			shapeData.coordinates = shapes.LineString[0].coordinates[0].split(" ");
		}
		shapeFileData.push(shapeData); //pushing it to array
		
	}
});
//create a directory with the time stamp in result folder
var timpstamp = new Date();
fs.mkdir('./result/'+timpstamp, function(err) {
  	if (err) {
		console.log(err);
	};
});
// writing the first line to the file
fs.appendFile('./result/'+timpstamp+'/shapes.txt', line + "\n", function (err) {
	if (err) {
		console.log(err);
	};
});
// reading from array to file 
for(var x in shapeFileData){
	var name = shapeFileData[x].name;
	var coordinates = shapeFileData[x].coordinates;
	lines = ""; 
	for(var y in coordinates){
		line = name + "," + coordinates[y].split(",").splice(0, 2).join() + "," + y + "," + "0\n";
		lines += line;
	}
		// write to the file
	if (lines != "") {
		fs.appendFile('./result/'+timpstamp+'/shapes.txt', lines, function (err) {
			if (err) {
				console.log(err);
				lines = "";
			};
		});
	};
}
var end = Date.now();
console.log("Your shape file created :D");
console.log("Time taken: %ds", (end - start)/1000);