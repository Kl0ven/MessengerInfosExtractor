const fs = require("fs");
const tasks = require('./tasks.js')


var message_filename = "message_1.json"

console.log("\n Starting ... \n");
var contents = fs.readFileSync(message_filename);
var file = JSON.parse( contents);


run_tasks(file, [tasks.get_pseudo_list, tasks.get_ratios, tasks.get_most_reacted_message])


function run_tasks(file, tasks){
  for (var t in tasks) {
    console.log(`Starting :${tasks[t].name}...`);
    tasks[t](file)
    console.log(`Finished :${tasks[t].name} !`);
  }
}
