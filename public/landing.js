
do{
    name = prompt("Enter your Name: ")
} while((name == null || name == "" || !(name.length >= 1 && name.length <= 12)))

do{
    room = prompt("Enter Lobby ID: ")
} while(room == null || room == "")

module.exports = { name, room }