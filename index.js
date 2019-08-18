const fs = require('fs');
const tasks = require('./tasks.js');

var messageFilename = 'message_1.json';

console.log('\n Starting ... \n');
var contents = fs.readFileSync(messageFilename);
var file = JSON.parse(contents);

runTasks(file, [tasks.getPseudoList,
	tasks.getNumbersOfMsgPerUser,
	tasks.getMostReactedMessage,
	tasks.getConvNames]);

function runTasks (file, tasks) {
	for (var t in tasks) {
		console.log(`Starting :${tasks[t].name}...`);
		var output = fs.createWriteStream(`Outputs/${tasks[t].name}.txt`);
		output.on('error', (err) => { console.log('error', err); });
		tasks[t](file, output);
		output.end();
		console.log(`Finished :${tasks[t].name} !`);
	}
}
