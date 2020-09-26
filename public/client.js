const socket = io()

let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

var audio = new Audio('ting.mp3')

do{
    name = prompt("Enter your Name: ")
} while(!(name.length >= 1 && name.length <= 12))

textarea.addEventListener('keyup', (e) => {
    if(e.key == 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg = {
        user: name,
        message: message.trim()
    }
    
    // Append Message
    console.log(message)
    if(message.length == 1){
        textarea.value = ''
        confirm("Message Cannot be Empty!")
    }
    // console.log(message.length)
    else{
        appendMessage(msg, 'outgoing')

        textarea.value = ''

        // Send to Server
        socket.emit('message', msg)
    }
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup;
    
    if(type == 'incoming'){
        console.log("Audio Played")
        audio.play();
    }
    
    markup = `
        <h4> &nbsp;&nbsp;&nbsp;${msg.user}</h4>
        <p>${msg.message}</p>`

    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)

    var xH = messageArea.scrollHeight; 
    messageArea.scrollTo(0, xH);
}

// Receive Message

socket.on('message', (msg) => {
    audio.play();
    appendMessage(msg, 'incoming')
    var xH = messageArea.scrollHeight; 
    messageArea.scrollTo(0, xH);
})


// socket.emit('disconnect', (msg) => {
//     appendMessage(msg, 'incoming')
// })
