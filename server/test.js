var socket;
function connect() {
    socket = io();
    socket.on('start', function (data) {
        document.getElementById('text').innerText = `${data.description}`
    });
    socket.on('end game', function (data) {
        document.getElementById('text').innerText = `${data.description}`
    });
    socket.on('field', function (field) {
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (field[i][j] == 3) {
                    field[i][j] = "*";
                }
            }
        }
        console.log(field);

        let text = "";
        for (let i = 0; i < field.length; i++) {
            text += field[i] + '\n';
        }
        document.getElementById('game_field').innerText = text
    })
    document.getElementById('con_bt').remove();
}

function turn() {
    const x = Number.parseInt(document.getElementById('x').value)
    const y = Number.parseInt(document.getElementById('y').value)
    socket.emit('game_turn', { x: x, y: y })
}

