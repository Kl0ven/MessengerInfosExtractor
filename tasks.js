const utf8 = require('utf8');
const fs = require("fs");

function get_pseudo_list(file, output){
  var msgs = file.messages;

  var names = []
  for (var i in msgs) {
    m = msgs[i]
    if (m.hasOwnProperty('content') && m.content.includes("nickname")){
      names.push(utf8.decode(m.content));
    }
  }

  names.forEach(function(v) { output.write(v + '\n'); });
}

function get_numbers_of_msg_per_user(file, output){

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

    for (var p in resultats) {
      output.write(utf8.decode(p) + ', ' + resultats[p] + '\n');
    }
}


function get_most_reacted_message(file, output) {
  var msgs = file.messages;
  var max_reactions = 0
  var messages = []
  for (var i in msgs) {
    m = msgs[i]
    if (m.hasOwnProperty('reactions')){

      if (m.reactions.length > max_reactions){
        messages = []
        messages.push(m);
        max_reactions = m.reactions.length
      }
      else if (m.reactions.length == max_reactions) {
        messages.push(m)
      }
    }
  }
  output.write(`Max reaction is ${max_reactions}\n`);
  output.write("From thoses messages:\n");
  output.write(utf8.decode(JSON.stringify(messages, null, 4)));
}



module.exports = {
    get_pseudo_list: get_pseudo_list,
    get_numbers_of_msg_per_user: get_numbers_of_msg_per_user,
    get_most_reacted_message: get_most_reacted_message
}
