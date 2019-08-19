var emoji = require('node-emoji');
var wtf8 = require('wtf-8');

function detectEmoji (text) {
	var chars = Array.from(wtf8.decode(text));
	var emots = [];
	for (var i = 0; i < chars.length; i++) {
		if (emoji.hasEmoji(chars[i]) === true) {
			let emot = emoji.find(chars[i]);
			if (emot.key === chars[i]) {
				continue;
			}
			emots.push(emoji.unemojify(chars[i]));
		}
	}
	return emots;
}

function createChartDetails (title, data) {
	return {
		type: 'png',
		scale: 3,
		options: {
			chart: {
				type: 'pie'
			},
			title: {
				text: title
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b><br/> {point.y} ({point.percent}%)'
					},
					size: '75%'
				}
			},
			series: [
				{
					data: data
				}
			]
		}
	};
}
module.exports = {
	detectEmoji: detectEmoji,
	createChartDetails: createChartDetails
};
