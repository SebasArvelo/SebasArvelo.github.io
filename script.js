let players = [];
let currentPlayerIndex = 0;
let turnCounter = 0;
let cardSize = 3;
let bingoBoard = [];
let calledNumbers = [];
let gameOver = false;

function startGame() {
    const playerNames = document.getElementById("player-names").value.trim().split("\n");
    cardSize = parseInt(document.getElementById("card-size").value);

    if (playerNames.length !== 4 || isNaN(cardSize) || cardSize < 3 || cardSize > 5) {
        alert("Por favor, ingrese 4 nombres de jugadores y un tamaño de cartón válido (entre 3 y 5).");
        return;
    }

    players = playerNames.map(name => ({
        name: name,
        score: 0,
        wins: 0,
        card: generateCard(cardSize),
        lines: { horizontal: 0, vertical: 0, diagonal: 0 },
        fullCard: false
    }));

    currentPlayerIndex = 0;
    turnCounter = 0;
    calledNumbers = [];
    gameOver = false;

    updatePlayerInfo();
    displayBingoBoard(players[currentPlayerIndex].card);
    document.getElementById("menu").style.display = "none";
    document.getElementById("bingo-game").style.display = "block";
}

function generateCard(size) {
    const numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    const card = [];

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const index = Math.floor(Math.random() * numbers.length);
            row.push(numbers.splice(index, 1)[0]);
        }
        card.push(row);
    }

    return card;
}

function displayBingoBoard(board) {
    const bingoBoardElement = document.getElementById("bingo-board");
    bingoBoardElement.innerHTML = "";

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = document.createElement("div");
            cell.textContent = board[i][j];
            cell.classList.add("cell");
            if (calledNumbers.includes(board[i][j])) {
                cell.classList.add("marked");
            }
            bingoBoardElement.appendChild(cell);
        }
    }
}

function callNumber() {
    if (gameOver) return;

    const calledNumber = generateNumber();
    document.getElementById("called-number").textContent = calledNumber;
    calledNumbers.push(calledNumber);

    players[currentPlayerIndex].card.forEach(row => {
        row.forEach(number => {
            if (number === calledNumber) {
                markNumber(calledNumber);
            }
        });
    });

    updateGameStatus();
}

function generateNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 50) + 1;
    } while (calledNumbers.includes(number));
    return number;
}

function markNumber(number) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (parseInt(cell.textContent) === number) {
            cell.classList.add("marked");
        }
    });
}

function updateGameStatus() {
    turnCounter++;

    if (turnCounter >= 25) {
        endGame();
        return;
    }

    checkForLines();
    checkForFullCard();

    if (!gameOver) {
        currentPlayerIndex = (currentPlayerIndex + 1) % 4;
        updatePlayerInfo();
    }
}

function checkForLines() {
    const currentPlayer = players[currentPlayerIndex];

    // Horizontal lines
    currentPlayer.card.forEach(row => {
        if (row.every(number => calledNumbers.includes(number))) {
            currentPlayer.lines.horizontal++;
            currentPlayer.score++;
        }
    });

    // Vertical lines
    for (let i = 0; i < currentPlayer.card.length; i++) {
        const column = currentPlayer.card.map(row => row[i]);
        if (column.every(number => calledNumbers.includes(number))) {
            currentPlayer.lines.vertical++;
            currentPlayer.score++;
        }
    }

    // Diagonal lines
    const diagonal1 = currentPlayer.card.map((row, index) => row[index]);
    const diagonal2 = currentPlayer.card.map((row, index) => row[row.length - index - 1]);
    if (diagonal1.every(number => calledNumbers.includes(number))) {
        currentPlayer.lines.diagonal++;
        currentPlayer.score++;
    }
    if (diagonal2.every(number => calledNumbers.includes(number))) {
        currentPlayer.lines.diagonal++;
        currentPlayer.score++;
    }
}

function checkForFullCard() {
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.card.every(row => row.every(number => calledNumbers.includes(number)))) {
        currentPlayer.fullCard = true;
        currentPlayer.score += 5;
        endGame();
    }
}

function endGame() {
    gameOver = true;
    document.getElementById("game-over").style.display = "block";

    const finalScoresElement = document.getElementById("final-scores");
    finalScoresElement.innerHTML = "";
    players.forEach(player => {
        const playerScore = document.createElement("p");
        playerScore.textContent = `${player.name}: ${player.score} puntos`;
        finalScoresElement.appendChild(playerScore);
    });
}

function updatePlayerInfo() {
    const currentPlayer = players[currentPlayerIndex];
    document.getElementById("select-player").innerHTML = "";
    players.forEach((player, index) => {
        const option = document.createElement("option");
        option.textContent = player.name;
        option.value = index;
        document.getElementById("select-player").appendChild(option);
    });
    document.getElementById("turn-counter").textContent = turnCounter;
    document.getElementById("total-score").textContent = currentPlayer.score;
    displayBingoBoard(currentPlayer.card);
}





