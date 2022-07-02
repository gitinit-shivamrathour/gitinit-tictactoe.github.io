const options = document.getElementById("options");
const first = document.getElementById("first");

const container = document.getElementById("container");

// choosing btns
const computerBtn = document.getElementById("computer");
const friendBtn = document.getElementById("friend");
const xBtn = document.getElementById("x");
const oBtn = document.getElementById("o");
const playBtn = document.getElementById("play");
const gameMessages = document.getElementById("game-messages");

const next = document.getElementById('next');
const nexBtn = document.getElementById('next-btn');

// hiding or unhiding the elements
document.getElementById("game-messages").style.display = "none";
document.getElementById("container").style.display = "none";
document.getElementById("first").style.display = "block";

//-------------
// const score = document.getElementById('score');
// let xScore = document.getElementById('player-one-score');
// let oScore = document.getElementById('player-two-score');
// //-------------


// game over
const gameOverElement = document.getElementById("gameover");

const player = new Object;
let OPPONENT;

oBtn.addEventListener("click", function () {
    player.man = "O";
    player.computer = "X";
    player.friend = "X";

    switchActive(xBtn, oBtn);
});

xBtn.addEventListener("click", function () {
    player.man = "X";
    player.computer = "O";
    player.friend = "O";

    switchActive(oBtn, xBtn);
});

computerBtn.addEventListener("click", function () {
    OPPONENT = "computer";
    switchActive(friendBtn, computerBtn);
});

friendBtn.addEventListener("click", function () {
    OPPONENT = "friend";
    switchActive(computerBtn, friendBtn);
});

playBtn.addEventListener("click", function () {
    if (!OPPONENT) {
        computerBtn.style.backgroundColor = "orange";
        friendBtn.style.backgroundColor = "orange";
        return;
    }
    
    if (!player.man) {
        oBtn.style.backgroundColor = "orange";
        xBtn.style.backgroundColor = "orange";
        return;
    }
    
    init(player, OPPONENT);
    document.getElementById("options").style.display = "none";
    // options.classList.add("hide");
});

nexBtn.addEventListener("click", function () {
    
    // hiding or unhiding the elements
    document.getElementById("options").style.display = "block";
    document.getElementById("container").style.display = "block";
    document.getElementById("game-messages").style.display = "block";
    document.getElementById("first").style.display = "none";
});

function switchActive(off, on) {
    off.classList.remove("active");
    on.classList.add("active");
}