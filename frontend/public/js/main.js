const socket = io("http://localhost:3000"); // Forbind til backend

function spinRoulette() {
    socket.emit("place_bet", "rød"); // Fortæller serveren, at spilleren har spillet på rød
}

socket.on("spin_result", (number) => {
    document.getElementById("result").innerText = `Resultat: ${number}`;
});
