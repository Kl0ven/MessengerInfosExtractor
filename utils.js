/* eslint-disable max-len */
const emoji = require('node-emoji');
const wtf8 = require('wtf-8');

function detectEmoji (text) {
    const chars = Array.from(wtf8.decode(text));
    const emots = [];
    for (let i = 0; i < chars.length; i++) {
        if (emoji.hasEmoji(chars[i]) === true) {
            const emot = emoji.find(chars[i]);
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

function exportData (resultats, output, totalAmount, title, emojify) {
    const pieData = [];
    const tuples = [];
    for (const key of resultats) tuples.push([key, resultats[key]]);
    tuples.sort(function (a, b) {
        return b[1] - a[1];
    });

    for (const p of tuples) {
        output.write((emojify ? emoji.emojify(wtf8.decode(tuples[p][0])) : wtf8.decode(tuples[p][0])) + ', ' + tuples[p][1] + ', ' + ((tuples[p][1] / totalAmount) * 100).toFixed(2) + '%\n');
        pieData.push({ name: wtf8.decode(tuples[p][0]), y: tuples[p][1], percent: ((tuples[p][1] / totalAmount) * 100).toFixed(2) });
    }
    return createChartDetails(title + ' / Total : ' + totalAmount, pieData);
}
module.exports = {
    detectEmoji: detectEmoji,
    createChartDetails: createChartDetails,
    exportData: exportData
};
