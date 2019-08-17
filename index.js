var fs = require("fs");
const utf8 = require('utf8');

var message_filename = "message_1.json"

console.log("\n Starting ... \n");
var contents = fs.readFileSync(message_filename);
var file = JSON.parse( contents);

get_pseudo_list(file)
get_ratios(file)






function get_pseudo_list(file){
  var msgs = file.messages;
  console.log("number of messages", Object.keys(msgs).length);

  var names = []
  for (var i in msgs) {
    m = msgs[i]
    if (m.hasOwnProperty('content') && m.content.includes("nickname")){
      names.push(utf8.decode(m.content));
    }
  }



  var output = fs.createWriteStream('names.txt');
  output.on('error', function(err) { console.log("error"); });
  names.forEach(function(v) { output.write(v + '\n'); });
  output.end();
  console.log("pseudo recover")

}

function get_ratios(file){
  console.log("Startings ratios")
  var participants = file.participants;
  var msgs = file.messages;
  resultats = {}
  for (var i in participants) {
    p = participants[i]
    resultats[p.name] = 0;
  }

  for (var i in msgs) {
    m = msgs[i]
    resultats[m.sender_name] += 1
    }
    console.log(resultats);

    var output = fs.createWriteStream('ratios.txt');
    output.on('error', function(err) { console.log("error"); });
    for (var p in resultats) {
      console.log(p);
      output.write(utf8.decode(p) + ', ' + resultats[p] + '\n');
    }

    output.end();
    console.log("ratios recover")
}
