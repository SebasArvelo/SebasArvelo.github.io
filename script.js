document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const bingoGame = document.getElementById("bingo-game");
    const callNumberButton = document.getElementById("call-number-button");
    const resetButton = document.getElementById("reset-button");
    const bingoBoard = document.getElementById("bingo-board");
    const playerSelect = document.getElementById("select-player");
    const turnCounter = document.getElementById("turn-counter");
    const totalScore = document.getElementById("total-score");
    const gameOverDiv = document.getElementById("game-over");
    const finalScores = document.getElementById("final-scores");

    let players = [];
    let currentPlayerIndex = 0;
    let turn = 0;
    let maxTurns = 25;
    let bingoNumbers = [];
    let markedNumbers = [];
    let playerScores = {};

    startButton.addEventListener("click", startGame);
    callNumberButton.addEventListener("click", callNumber);
    resetButton.addEventListener("click", resetGame);

    function startGame() {
        resetGame();

        const cardSize = parseInt(document.getElementById("card-size").value);

        // Generar cartones para cada jugador
        players = Array.from(document.querySelectorAll(".player-name")).map(input => input.value);
        players.forEach(player => {
            generateBingoCard(player, cardSize);
            playerScores[player] = { total: 0, victories: 0 };
        });

        // Mostrar interfaz de juego y jugador actual
        bingoGame.style.display = "block";
        updatePlayerSelect();

        // Reiniciar contador de turnos
        turn = 0;
        updateTurnCounter();
    }

    function generateBingoCard(player, size) {
        const card = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                let num;
                do {
                    num = Math.floor(Math.random() * 50) + 1;
                } while (row.includes(num));
                row.push(num);
            }
            card.push(row);
        }
        renderBingoCard(player, card);
    }

    function renderBingoCard(player, card) {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("bingo-card");

        card.forEach((row, i) => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("bingo-row");
            row.forEach(num => {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("bingo-cell");
                cellDiv.textContent = num;
                rowDiv.appendChild(cellDiv);
            });
            cardDiv.appendChild(rowDiv);
        });

        bingoBoard.appendChild(cardDiv);
    }

    function callNumber() {
        if (turn >= maxTurns) {
            endGame();
            return;
        }

        let num;
        do {
            num = Math.floor(Math.random() * 50) + 1;
        } while (bingoNumbers.includes(num));

        bingoNumbers.push(num);
        turn++;
        updateTurnCounter();

        // Marcar número en los cartones
        const currentPlayerCard = document.querySelector(".bingo-card.current");
        const cells = currentPlayerCard.querySelectorAll(".bingo-cell");
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === num) {
                cell.classList.add("marked");
                markedNumbers.push(num);
                checkLinesAndBingo(currentPlayerCard);
            }
        });

        // Llamar número en la interfaz
        alert(`¡Número llamado! ${num}`);
    }

    function checkLinesAndBingo(card) {
        const rows = card.querySelectorAll(".bingo-row");
        const cols = [];
        for (let i = 0; i < card.children.length; i++) {
            const col = [];
            for (let j = 0; j < card.children.length; j++) {
                col.push(card.children[j].children[i]);
            }
            cols.push(col);
        }

        let lines = 0;

        // Verificar líneas horizontales y verticales
        [...rows, ...cols].forEach(line => {
            if ([...line].every(cell => cell.classList.contains("marked"))) {
                lines++;
            }
        });

        // Verificar diagonales
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < card.children.length; i++) {
            diagonal1.push(card.children[i].children[i]);
            diagonal2.push(card.children[i].children[card.children.length - 1 - i]);
        }

        if ([...diagonal1, ...diagonal2].every(cell => cell.classList.contains("marked"))) {
            lines += 2; // Ambas diagonales cuentan como dos líneas
        }

        if (lines > 0) {
            playerScores[players[currentPlayerIndex]].total += lines;
            if (lines >= 5) {
                playerScores[players[currentPlayerIndex]].victories++;
                endGame();
            }
            updateTotalScore();
        }
    }

    function updatePlayerSelect() {
        playerSelect.innerHTML = "";
        players.forEach((player, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = player;
            playerSelect.appendChild(option);
        });
    }

    function updateTurnCounter() {
        turnCounter.textContent = turn;
    }

    function updateTotalScore() {
        totalScore.textContent = playerScores[players[currentPlayerIndex]].total;
    }

    function endGame() {
        gameOverDiv.style.display = "block";
        let html = "<h2>Puntajes Finales</h2>";
        players.forEach(player => {
            html += `<p>${player}: ${playerScores[player].total} puntos, ${playerScores[player].victories} victorias</p>`;
        });
        finalScores.innerHTML = html;
    }

    function resetGame() {
        players = [];
        currentPlayerIndex = 0;
        turn = 0;
        bingoNumbers = [];
        markedNumbers = [];
        playerScores = {};
        bingoBoard.innerHTML = "";
        gameOverDiv.style.display = "none";
    }
});


