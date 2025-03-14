const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = function(event) {
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.textContent = event.data;
    chatBox.appendChild(message);
};

function sendMessage() {
    const input = document.getElementById('message-input');
    if (input.value.trim() !== "") {
        socket.send(input.value);
        input.value = "";
    }
}

