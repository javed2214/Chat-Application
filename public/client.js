const socket = io()

let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let onl = document.querySelector('#online')
let tx1 = ""
let tx2 = ""

var audio = new Audio('ting.mp3')

do{
    name = prompt("Enter your Name: ")
} while((name == null || name == "" || !(name.length >= 1 && name.length <= 12)))

socket.emit('new-user-joined', name)

socket.on('user-joined', name => {
    console.log("$$$$")
    appendMessage(`${name} joined the Chat`, 'newuser')
})

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
    if(type != 'newuser' && type != 'left') mainDiv.classList.add(className, 'message')

    let markup;

    console.log(type)
    
    if(type == 'incoming'){
        console.log("Audio Played")
        audio.play();
    }

    if(type == 'newuser'){
        markup = `<h5 id="userjoined"> &nbsp;&nbsp;&nbsp;${msg}</h5>`
    }

    else if(type == 'left'){
        markup = `<h5 id="userleft">&nbsp;&nbsp;&nbsp;${msg} Left</h5>`
    }
    
    else{
        markup = `
        <h4> &nbsp;&nbsp;&nbsp;${msg.user}</h4>
        <p>${msg.message}</p>`
    }

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

socket.on('left', name => {
    console.log(name)
    appendMessage(name, 'left')
})

socket.on('onlineusers', cnt => {
    onl.innerHTML = "Users Online: " + cnt
})

socket.on('users-join', users => {
    tx1 = ""
    console.log(users)
    for (const property in users) {
        tx1 += users[property] + " "
    }
    console.log(tx1)
})

socket.on('users-left', users => {
    tx2 = ""
    console.log(users)
    for (const property in users) {
        tx2 += users[property] + " "
    }
    console.log(tx2)
})