document.addEventListener("DOMContentLoaded", function () {
    // Variables globales
    let players = [];
    let currentPlayerIndex = 0;
    let totalScore = [0, 0, 0, 0];
    let bingoBoard;

    // Función para iniciar el juego
    function startGame() {
        // Obtener nombres de los jugadores y tamaño del cartón
        let playerNames = document.getElementById("player-names").value.trim().split("\n");
        let cardSize = parseInt(document.getElementById("card-size").value);

        // Verificar que se hayan ingresado nombres para 4 jugadores
        if (playerNames.length !== 4) {
            alert("Por favor, ingrese los nombres de los 4 jugadores.");
            return;
        }

        // Limpiar el tablero de bingo y reiniciar el puntaje
        document.getElementById("bingo-board").innerHTML = "";
        totalScore = [0, 0, 0, 0];

        // Generar el cartón de bingo para cada jugador
        players = [];
        for (let i = 0; i < 4; i++) {
            let player = generateBingoCard(cardSize);
            players.push(player);
            displayBingoCard(i, player);
        }

        // Mostrar el tablero de bingo y actualizar la interfaz
        document.getElementById("bingo-game").style.display = "block";
        document.getElementById("menu").style.display = "none";
        document.getElementById("select-player").innerHTML = playerNames.map((name, index) => `<option value="${index}">${name}</option>`).join("");
        currentPlayerIndex = 0;
        updatePlayerInfo();
    }

    // Función para generar un cartón de bingo aleatorio
    function generateBingoCard(size) {
        let card = [];
        let numbers = Array.from({ length: 50 }, (_, i) => i + 1);

        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                let randomIndex = Math.floor(Math.random() * numbers.length);
                row.push(numbers[randomIndex]);
                numbers.splice(randomIndex, 1);
            }
            card.push(row);
        }

        return card;
    }

    // Función para mostrar un cartón de bingo en el tablero
    function displayBingoCard(playerIndex, card) {
        let board = document.getElementById("bingo-board");
        let html = `<div class="player-card" id="player-card-${playerIndex}">`;
        card.forEach((row, rowIndex) => {
            row.forEach((number, colIndex) => {
                html += `<div class="cell" id="cell-${playerIndex}-${rowIndex}-${colIndex}">${number}</div>`;
            });
        });
        html += "</div>";
        board.innerHTML += html;
    }

    // Función para actualizar la información del jugador actual
    function updatePlayerInfo() {
        document.getElementById("select-player").value = currentPlayerIndex;
        document.getElementById("turn-counter").textContent = currentPlayerIndex + 1;
        document.getElementById("total-score").textContent = totalScore[currentPlayerIndex];
    }

    // Función para cambiar el jugador actual
    function changePlayer() {
        currentPlayerIndex = parseInt(document.getElementById("select-player").value);
        updatePlayerInfo();
    }

    // Función para llamar un número de bingo aleatorio
    function callNumber() {
        let number;
        do {
            number = Math.floor(Math.random() * 50) + 1;
        } while (bingoBoard.some(row => row.includes(number)));

        document.getElementById("called-number").textContent = number;

        players.forEach((player, index) => {
            let markedCells = document.querySelectorAll(`#player-card-${index} .cell`);
            markedCells.forEach(cell => {
                if (parseInt(cell.textContent) === number) {
                    cell.classList.add("marked");
                    totalScore[index]++;
                    checkWin(index);
                }
            });
        });

        currentPlayerIndex = (currentPlayerIndex + 1) % 4;
        updatePlayerInfo();
    }

    // Función para verificar si un jugador ha ganado
    function checkWin(playerIndex) {
        let win = false;

        // Verificar líneas horizontales y verticales
        for (let i = 0; i < players[playerIndex].length; i++) {
            if (players[playerIndex][i].every(number => document.getElementById(`cell-${playerIndex}-${i}-${players[playerIndex][i].indexOf(number)}`).classList.contains("marked"))) {
                win = true;
                break;
            }
            if (players[playerIndex].every(row => document.getElementById(`cell-${playerIndex}-${players[playerIndex].indexOf(row)}-${i}`).classList.contains("marked"))) {
                win = true;
                break;
            }
        }

        // Verificar línea diagonal (de izquierda a derecha)
        if (!win && players[playerIndex].every((row, index) => document.getElementById(`cell-${playerIndex}-${index}-${players[playerIndex][index].indexOf(row[index])}`).classList.contains("marked"))) {
            win = true;
        }

        // Verificar línea diagonal (de derecha a izquierda)
        if (!win && players[playerIndex].every((row, index) => document.getElementById(`cell-${playerIndex}-${index}-${players[playerIndex][index].indexOf(row[row.length - index - 1])}`).classList.contains("marked"))) {
            win = true;
        }

        if (win) {
            alert(`¡El jugador ${playerIndex + 1} ha ganado!`);
            endGame();
        }
    }

    // Función para terminar el juego
    function endGame() {
        // Mostrar el puntaje final
        let finalScores = "";
        for (let i = 0; i < 4; i++) {
            finalScores += `Jugador ${i + 1}: ${totalScore[i]} puntos\n`;
        }
        alert(finalScores);

        // Reiniciar el juego
        document.getElementById("bingo-game").style.display = "none";
        document.getElementById("game-over").style.display = "block";
    }

    // Función para reiniciar el juego
    function resetGame() {
        location.reload();
    }

    // Asignar eventos a los botones
    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("call-button").addEventListener("click", callNumber);
    document.getElementById("reset-button").addEventListener("click", resetGame);
    document.getElementById("select-player").addEventListener("change", changePlayer);
});



