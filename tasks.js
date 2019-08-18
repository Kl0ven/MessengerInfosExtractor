const utf8 = require('utf8');
const fs = require('fs');
const chartExporter = require('highcharts-export-server');

function getPseudoList (file, output) {
	var msgs = file.messages;

	var names = [];
	for (var i in msgs) {
		let m = msgs[i];
		if (m.hasOwnProperty('content') && m.content.includes('nickname')) {
			names.push(utf8.decode(m.content));
		}
	}

	names.forEach(function (v) { output.write(v + '\n'); });
}

function getConvNames (file, output) {
	var msgs = file.messages;

	var names = [];
	for (var i in msgs) {
		let m = msgs[i];
		if (m.hasOwnProperty('content') && m.content.includes('named the group')) {
			names.push(utf8.decode(m.content));
		}
	}

	names.forEach(function (v) { output.write(v + '\n'); });
}

function getNumbersOfMsgPerUser (file, output) {
	var participants = file.participants;
	var msgs = file.messages;
	var resultats = {};
	let pieData = [];
	chartExporter.initPool();

	for (let i in participants) {
		let p = participants[i];
		resultats[p.name] = 0;
	}

	for (let i in msgs) {
		let m = msgs[i];
		resultats[m.sender_name] += 1;
	}

	for (var p in resultats) {
		output.write(utf8.decode(p) + ', ' + resultats[p] + '\n');
		pieData.push({name: utf8.decode(p), y: resultats[p]});
	}
	const chartDetails = {
		type: 'png',
		scale: 2,
		options: {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'Messages per user'
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y}'
					}
				}
			},
			series: [
				{
					data: pieData
				}
			]
		}
	};
	chartExporter.export(chartDetails, (err, res) => {
		if (err) {
			console.log(err);
		}
		// Get the image data (base64)
		let imageb64 = res.data;
		// Filename of the output
		let outputFile = 'Outputs/Messages_per_User.png';
		// Save the image to file
		fs.writeFileSync(outputFile, imageb64, 'base64', function (err) {
			if (err) console.log(err);
		});
		console.log('Saved image!');
		chartExporter.killPool();
	});
}

function getMostReactedMessage (file, output) {
	var msgs = file.messages;
	var maxReactions = 0;
	var messages = [];
	for (var i in msgs) {
		let m = msgs[i];
		if (m.hasOwnProperty('reactions')) {
			if (m.reactions.length > maxReactions) {
				messages = [];
				messages.push(m);
				maxReactions = m.reactions.length;
			} else if (m.reactions.length === maxReactions) {
				messages.push(m);
			}
		}
	}
	output.write(`Max reaction is ${maxReactions}\n`);
	output.write('From thoses messages:\n');
	output.write(utf8.decode(JSON.stringify(messages, null, 4)));
}

module.exports = {
	getPseudoList: getPseudoList,
	getNumbersOfMsgPerUser: getNumbersOfMsgPerUser,
	getMostReactedMessage: getMostReactedMessage,
	getConvNames: getConvNames
};
