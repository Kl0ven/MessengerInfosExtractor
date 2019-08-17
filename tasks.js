const utf8 = require('utf8');
const fs = require("fs");

function get_pseudo_list(file){
  var msgs = file.messages;

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


}

function get_ratios(file){

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

    var output = fs.createWriteStream('ratios.txt');
    output.on('error', function(err) { console.log("error"); });
    for (var p in resultats) {
      output.write(utf8.decode(p) + ', ' + resultats[p] + '\n');
    }

    output.end();

}


function get_most_reacted_message(file) {

}



module.exports = {
    get_pseudo_list: get_pseudo_list,
    get_ratios: get_ratios,
    get_most_reacted_message: get_most_reacted_message
}
