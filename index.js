const fs = require('fs');
const tasks = require('./tasks.js');
const chartExporter = require('highcharts-export-server');
const chalk = require('chalk');

const messageFilename = 'message_1.json';
const contents = fs.readFileSync(messageFilename);
const file = JSON.parse(contents);

runTasks(file, [
    tasks.getPseudoList,
    tasks.getNumbersOfMsgPerUser,
    tasks.getMostReactedMessage,
    tasks.getConvNames,
    tasks.getNumbersOfReactionPerUser,
    tasks.getNumberOfEmotPerUser,
    tasks.getNumberOfEmotPerEmot,
    tasks.getMemeLord
]);

async function runTasks (file, tasks) {
    chartExporter.initPool();
    for (const t of tasks) {
        console.log(`${chalk.cyan('Starting')} :${chalk.yellow(t.name)}...`);
        const output = fs.createWriteStream(`Outputs/${t.name}.txt`);
        output.on('error', err => {
            console.log('error', err);
        });
        const chartDetails = t(file, output);
        output.end();
        if (chartDetails !== undefined) {
            await exportDataToPie(chartExporter, chartDetails, `Outputs/${t.name}.${chartDetails.type}`).catch(
                err => console.log(chalk.red(err))
            );
        }
        console.log(`${chalk.green('Finished')} :${chalk.yellow(t.name)} !`);
    }
    chartExporter.killPool();
}

async function exportDataToPie (chartExporter, chartDetails, path) {
    return new Promise((resolve, reject) => {
        console.log(chalk.cyan('Exporting data to pie chart!'));
        chartExporter.export(chartDetails, (err, res) => {
            if (err) {
                reject(err);
            }
            // Get the image data (base64)
            const imageb64 = res.data;

            // Save the image to file
            fs.writeFileSync(path, imageb64, 'base64', function (err) {
                if (err) console.log(err);
            });
            console.log(chalk.magenta('Image saved !'));
            resolve();
        });
    });
}
