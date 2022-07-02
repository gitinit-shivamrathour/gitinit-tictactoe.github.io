function init(player, OPPONENT){
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");

    let board = [];
    const COLUMN = 3;
    const ROW = 3;
    const SPACE_SIZE = 150;


    let X = 0;
    let O = 0;


    let gameData = new Array(9);
    
    let currentPlayer = player.man;

    // load X & O images
    const xImage = new Image();
    xImage.src = "img/X.png";

    const oImage = new Image();
    oImage.src = "img/O.png";

    // Win combinations
    const COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // game over checking
    let GAME_OVER = false;
    
    // design board
    function drawBoard(){

        let id = 0
        for(let i = 0; i < ROW; i++){
            board[i] = [];
            for(let j = 0; j < COLUMN; j++){
                board[i][j] = id;
                id++;

                // draw the spaces
                ctx.strokeStyle = "#000";
                ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
            }
        }
    }
    drawBoard();

    // 
    canvas.addEventListener("click", function(event){
        
        // exit : if game over
        if(GAME_OVER) return;

        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;

        let i = Math.floor(Y/SPACE_SIZE);
        let j = Math.floor(X/SPACE_SIZE);

        let id = board[i][j];

        if(gameData[id]) return;

        gameData[id] = currentPlayer;
        
        drawOnBoard(currentPlayer, i, j);

        // Check if the play wins
        if(isWinner(gameData, currentPlayer)){
            showGameOver(currentPlayer);
            if(player=="X"){
                X += 1;
            }
            else{
                O += 1;
            }
            GAME_OVER = true;
            return;
        }

        // check if it's a tie game
        if(isTie(gameData)){
            showGameOver("tie");
            GAME_OVER = true;
            return;
        }

        if( OPPONENT == "computer"){

            let id = minimax( gameData, player.computer ).id;

            // store the player's move to gameData
            gameData[id] = player.computer;
            
            // get i and j of space
            let space = getIJ(id);

            // draw the move on board
            drawOnBoard(player.computer, space.i, space.j);

            // Check if the play wins
            if(isWinner(gameData, player.computer)){
                showGameOver(player.computer);
                if(player=="X"){
                    X += 1;
                }
                else{
                    O += 1;
                }
                GAME_OVER = true;
                return;
            }

            // check if it's a tie game
            if(isTie(gameData)){
                showGameOver("tie");
                GAME_OVER = true;
                return;
            }
        }else{
    
            currentPlayer = currentPlayer == player.man ? player.friend : player.man;
        }

    });


    function minimax(gameData, PLAYER){
        if( isWinner(gameData, player.computer) ) return { evaluation : +10 };
        if( isWinner(gameData, player.man)      ) return { evaluation : -10 };
        if( isTie(gameData)                     ) return { evaluation : 0 };

        let EMPTY_SPACES = getEmptySpaces(gameData);

        // save all moves
        let moves = [];

        for( let i = 0; i < EMPTY_SPACES.length; i++){
            let id = EMPTY_SPACES[i];

            let backup = gameData[id];

            gameData[id] = PLAYER;

            let move = {};
            move.id = id;
  
            if( PLAYER == player.computer){
                move.evaluation = minimax(gameData, player.man).evaluation;
            }else{
                move.evaluation = minimax(gameData, player.computer).evaluation;
            }

            gameData[id] = backup;

            // save the moves to array
            moves.push(move);
        }

        let bestMove;

        if(PLAYER == player.computer){
            let bestEvaluation = -Infinity;
            for(let i = 0; i < moves.length; i++){
                if( moves[i].evaluation > bestEvaluation ){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                }
            }
        }else{
            let bestEvaluation = +Infinity;
            for(let i = 0; i < moves.length; i++){
                if( moves[i].evaluation < bestEvaluation ){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                }
            }
        }

        return bestMove;
    }

    function getEmptySpaces(gameData){
        let EMPTY = [];

        for( let id = 0; id < gameData.length; id++){
            if(!gameData[id]) EMPTY.push(id);
        }

        return EMPTY;
    }

    function getIJ(id){
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                if(board[i][j] == id) return { i : i, j : j}
            }
        }
    }

    // check for a winner
    function isWinner(gameData, player){
        for(let i = 0; i < COMBOS.length; i++){
            let won = true;

            for(let j = 0; j < COMBOS[i].length; j++){
                let id = COMBOS[i][j];
                won = gameData[id] == player && won;
            }

            if(won){
                if(player=="X"){
                    X += 1;
                }
                else{
                    O += 1;
                }
                return true;
            }
        }
        return false;
    }

    // Check for a tie game
    function isTie(gameData){
        let isBoardFill = true;
        for(let i = 0; i < gameData.length; i++){
            isBoardFill = gameData[i] && isBoardFill;
        }
        if(isBoardFill){
            return true;
        }
        return false;
    }

    // game over
    function showGameOver(player){
        let message = player == "tie" ? "No Winner" : "The Winner is";
        let imgSrc = `img/${player}.png`;

        gameOverElement.innerHTML = `
            <h1>${message}</1>
            <img class="winner-img" src=${imgSrc} </img>
            <div class="play" onclick="location.reload()">Play Again!</div>
        `;

        gameOverElement.classList.remove("hide");
    }

    function drawOnBoard(player, i, j){
        let img = player == "X" ? xImage : oImage;

        ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
    }

    // localStorage.setItem('scoreX', X.toString());
    // localStorage.setItem('scoreO', O.toString());

    // let scorex = Number(localStorage.getItem('scoreX'));
    // let scoreo = Number(localStorage.getItem('scoreO'));

    // document.getElementById("player-one-score").innerHTML = scorex;
    // document.getElementById("player-two-score").innerHTML = scoreo;

    // console.log(scoreo)
    // console.log(scorex)
}