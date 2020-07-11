const wtf8 = require('wtf-8');
const utils = require('./utils.js');

function getPseudoList (file, output) {
    const msgs = file.messages;

    const names = [];
    for (const m of msgs) {
        if (m.hasOwnProperty('content') && m.content.includes('nickname')) {
            names.push(wtf8.decode(m.content));
        }
    }

    names.forEach(function (v) {
        output.write(v + '\n');
    });
}

function getConvNames (file, output) {
    const msgs = file.messages;

    const names = [];
    for (const m of msgs) {
        if (m.hasOwnProperty('content') && m.content.includes('named the group')) {
            names.push(wtf8.decode(m.content));
        }
    }

    names.forEach(function (v) {
        output.write(v + '\n');
    });
}

function getNumbersOfMsgPerUser (file, output) {
    const participants = file.participants;
    const msgs = file.messages;
    const resultats = [];
    const numberOfMsg = Object.keys(msgs).length;

    for (const p of participants) {
        resultats[p.name] = 0;
    }

    for (const m of msgs) {
        resultats[m.sender_name] += 1;
    }

    return utils.exportData(resultats, output, numberOfMsg, `Messages per user`);
}

function getMostReactedMessage (file, output) {
    const msgs = file.messages;
    let maxReactions = 0;
    let messages = [];
    for (const m of msgs) {
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
    output.write(wtf8.decode(JSON.stringify(messages, null, 4)));
}

function getNumbersOfReactionPerUser (file, output) {
    const participants = file.participants;
    const msgs = file.messages;
    const resultats = [];

    let numberOfReactions = 0;

    for (const p of participants) {
        resultats[p.name] = 0;
    }

    for (const m of msgs) {
        if (m.hasOwnProperty('reactions')) {
            for (const r of m.reactions) {
                numberOfReactions += 1;
                resultats[r.actor] += 1;
            }
        }
    }

    return utils.exportData(resultats, output, numberOfReactions, `Reactions per user`);
}

function getNumberOfEmotPerUser (file, output) {
    const participants = file.participants;
    const msgs = file.messages;
    const resultats = [];
    let numberOfEmots = 0;

    for (const p of participants) {
        resultats[p.name] = 0;
    }

    for (const m of msgs) {
        let emots;
        if (m.hasOwnProperty('content')) {
            emots = utils.detectEmoji(m.content);
            numberOfEmots += emots.length;
            resultats[m.sender_name] += emots.length;
        }
    }

    return utils.exportData(resultats, output, numberOfEmots, `Emots per user`);
}

function getNumberOfEmotPerEmot (file, output) {
    const msgs = file.messages;
    const resultats = [];
    let numberOfEmots = 0;

    for (const m of msgs) {
        let emots;
        if (m.hasOwnProperty('content')) {
            emots = utils.detectEmoji(m.content);
            numberOfEmots += emots.length;
            for (const e of emots) {
                if (resultats.hasOwnProperty(emots[e]) === false) {
                    resultats[emots[e]] = 0;
                }
                resultats[emots[e]] += 1;
            }
        }
    }

    return utils.exportData(resultats, output, numberOfEmots, `Emots usage`, true);
}

module.exports = {
    getPseudoList: getPseudoList,
    getNumbersOfMsgPerUser: getNumbersOfMsgPerUser,
    getMostReactedMessage: getMostReactedMessage,
    getConvNames: getConvNames,
    getNumbersOfReactionPerUser: getNumbersOfReactionPerUser,
    getNumberOfEmotPerUser: getNumberOfEmotPerUser,
    getNumberOfEmotPerEmot: getNumberOfEmotPerEmot
};
