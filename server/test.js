const VICTORY = 0
const LOSE = 1
const DRAW = 2

var socket;
function connect() {
    socket = io();
    socket.on('start', function (data) {
        document.getElementById('text').innerText = `${data.description}`
    });
    socket.on('end game', function (data) {
        document.getElementById('text').innerText = `${data.description}`
    });
    socket.on('next_turn', function (data) {
        for (let i = 0; i < data.field.length; i++) {
            for (let j = 0; j < data.field[i].length; j++) {
                if (data.field[i][j] == 3) {
                    data.field[i][j] = "*";
                }
            }
        }

        let text = "";
        for (let i = 0; i < data.field.length; i++) {
            text += data.field[i] + '\n';
        }
        document.getElementById('game_field').innerText = text
        document.getElementById('checkers-score').innerText = `Player1: ${data.countCheckersP1}\nPlayer2: ${data.countCheckersP2}`
    })
    socket.on('end_game', function (data) {
        for (let i = 0; i < data.field.length; i++) {
            for (let j = 0; j < data.field[i].length; j++) {
                if (data.field[i][j] == 3) {
                    data.field[i][j] = "*";
                }
            }
        }
        let text = "";
        for (let i = 0; i < data.field.length; i++) {
            text += data.field[i] + '\n';
        }
        document.getElementById('game_field').innerText = text
        document.getElementById('checkers-score').innerText = `Player1: ${data.countCheckersP1}\nPlayer2: ${data.countCheckersP2}`

        if (data.result == VICTORY) {
            console.log('VICTORY')
        } else if (data.result == LOSE) {
            console.log('LOSE')
        } else {
            console.log('DRAW')
        }


    })
    document.getElementById('con_bt').remove();
}

function turn() {
    const x = Number.parseInt(document.getElementById('x').value)
    const y = Number.parseInt(document.getElementById('y').value)
    socket.emit('game_turn', { x: x, y: y })
}
