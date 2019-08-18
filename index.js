const fs = require('fs');
const tasks = require('./tasks.js');
const chartExporter = require('highcharts-export-server');

var messageFilename = 'message_1.json';

console.log('\n Starting ... \n');
var contents = fs.readFileSync(messageFilename);
var file = JSON.parse(contents);

runTasks(file, [tasks.getPseudoList,
	tasks.getNumbersOfMsgPerUser,
	tasks.getMostReactedMessage,
	tasks.getConvNames,
	tasks.getNumbersOfReactionPerUser
]);

async function runTasks (file, tasks) {
	chartExporter.initPool();
	for (var t in tasks) {
		console.log(`Starting :${tasks[t].name}...`);
		var output = fs.createWriteStream(`Outputs/${tasks[t].name}.txt`);
		output.on('error', (err) => { console.log('error', err); });
		let chartDetails = tasks[t](file, output);
		output.end();
		if (chartDetails !== undefined) {
			await exportDataToPie(chartExporter, chartDetails, `Outputs/${tasks[t].name}.${chartDetails.type}`).catch(console.log);
		}
		console.log(`Finished :${tasks[t].name} !`);
	}
	chartExporter.killPool();
}

async function exportDataToPie (chartExporter, chartDetails, path) {
	return new Promise((resolve, reject) => {
		chartExporter.export(chartDetails, (err, res) => {
			if (err) {
				reject(err);
			}
			// Get the image data (base64)
			let imageb64 = res.data;

			// Save the image to file
			fs.writeFileSync(path, imageb64, 'base64', function (err) {
				if (err) console.log(err);
			});
			console.log('Image saved !');
			resolve();
		});
	});
}
