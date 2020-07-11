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

function getMemeLord (file, output) {
    const points = {
        ':satisfied:': 2,
        ':thumbsup:': 1,
        ':thumbsdown:': -1,
        ':open_mouth:': 1,
        ':cry:': 1,
        ':angry:': 2,
        ':heartpulse:': 2,
        ':heart:': 2,
        ':heart_eyes:': 2
    };
    // init
    const participants = file.participants.reduce( (acc, p) => {
        acc[p.name] = {
            score: 0,
            numberOfMeme: 0
        };
        return acc;
    }, {});
    const msgs = file.messages;

    // calculating scores
    const resultats = msgs.reduce(reduceScores, participants);

    function reduceScores (p, msg) {
        score = 0;
        if (msg.hasOwnProperty('reactions')) {
            msg.reactions.map( r => {
                score += points[utils.detectEmoji(r.reaction)];
            });
        }
        p[msg.sender_name].score += score;
        p[msg.sender_name].numberOfMeme += 1;
        return p;
    }

    // normalazing scores
    const normalizedResult = {};
    for (const key in resultats) {
        if (resultats.hasOwnProperty(key)) {
            normalizedResult[key] = resultats[key].score / resultats[key].numberOfMeme;
        }
    }

    const sortableResult = [];
    for (const name in normalizedResult) {
        if (normalizedResult.hasOwnProperty(name)) {
            sortableResult.push([name, normalizedResult[name]]);
        }
    }
    sortableResult.sort(function (a, b) {
        return b[1] - a[1];
    });
    sortableResult.forEach(function (v) {
        output.write(v[0] + ' = '+ v[1] + '\n');
    });
}

module.exports = {
    getPseudoList: getPseudoList,
    getNumbersOfMsgPerUser: getNumbersOfMsgPerUser,
    getMostReactedMessage: getMostReactedMessage,
    getConvNames: getConvNames,
    getNumbersOfReactionPerUser: getNumbersOfReactionPerUser,
    getNumberOfEmotPerUser: getNumberOfEmotPerUser,
    getNumberOfEmotPerEmot: getNumberOfEmotPerEmot,
    getMemeLord: getMemeLord
};
