const fs = require("fs");
const tasks = require('./tasks.js')


var message_filename = "message_1.json"

console.log("\n Starting ... \n");
var contents = fs.readFileSync(message_filename);
var file = JSON.parse( contents);


run_tasks(file, [tasks.get_pseudo_list, tasks.get_numbers_of_msg_per_user, tasks.get_most_reacted_message, tasks.get_conv_names])


function run_tasks(file, tasks){
  for (var t in tasks) {
    console.log(`Starting :${tasks[t].name}...`);
    var output = fs.createWriteStream(`Outputs/${tasks[t].name}.txt`);
    output.on('error', function(err) { console.log("error"); });
    tasks[t](file, output)
    output.end();
    console.log(`Finished :${tasks[t].name} !`);
  }
}
