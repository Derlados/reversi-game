var socket;
function connect() {
    socket = io();
    socket.on('start', function (data) {
        document.getElementById('text').innerText = `${data.description}`
    });
    socket.on('end game', function (data) {
        document.getElementById('text').innerText = `${data.description}`
    });
    socket.on('field', function (data) {

    })
    document.getElementById('con_bt').remove();
}

function turn() {
    const x = Number.parseInt(document.getElementById('x').value)
    const y = Number.parseInt(document.getElementById('y').value)
    console.log({ x: x, y: y })
    socket.emit('game_turn', { x: x, y: y })
}

