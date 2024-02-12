// Lógica para generar un cartón de bingo aleatorio de tamaño N
function generateBingoCard(N) {
    const card = [];
    const minNumber = 1;
    const maxNumber = 50;
    
    for (let i = 0; i < N; i++) {
        const row = [];
        for (let j = 0; j < N; j++) {
            let number;
            do {
                number = Math.floor(Math.random() * maxNumber) + minNumber;
            } while (row.includes(number));
            row.push(number);
        }
        card.push(row);
    }
    return card;
}

// Lógica para mostrar un cartón de bingo en el tablero
function displayBingoCard(card) {
    const bingoBoard = document.getElementById("bingo-board");
    bingoBoard.innerHTML = "";
    
    card.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("bingo-row");
        row.forEach(number => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = number;
            rowDiv.appendChild(cell);
        });
        bingoBoard.appendChild(rowDiv);
    });
}

// Lógica para marcar el número llamado en los cartones de los jugadores
function markNumberCalled(number) {
    const bingoBoard = document.getElementById("bingo-board");
    const cells = bingoBoard.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (cell.textContent === number) {
            cell.classList.add("called");
        }
    });
}

// Función para iniciar el juego de bingo
function startGame() {
    // Obtener el tamaño del cartón ingresado por el usuario
    const cardSize = parseInt(document.getElementById("card-size").value);
    
    // Validar el tamaño del cartón (debe ser 3, 4 o 5)
    if (![3, 4, 5].includes(cardSize)) {
        alert("El tamaño del cartón debe ser 3, 4 o 5.");
        return;
    }
    
    // Generar un cartón de bingo para cada jugador
    const players = [];
    const playerNames = document.getElementById("player-names").value.split("\n");
    playerNames.forEach(name => {
        const card = generateBingoCard(cardSize);
        players.push({ name, card });
    });
    
    // Mostrar el primer cartón de bingo en el tablero
    displayBingoCard(players[0].card);
    
    // Habilitar el botón para llamar un número
    document.getElementById("call-number-btn").disabled = false;
    
    // Ocultar el menú principal y mostrar el juego de bingo
    document.getElementById("menu").style.display = "none";
    document.getElementById("bingo-game").style.display = "block";
}

// Función para llamar un número aleatorio de bingo
function callNumber() {
    const calledNumber = Math.floor(Math.random() * 50) + 1;
    markNumberCalled(calledNumber);
    document.getElementById("called-number").textContent = calledNumber;
}

// Función para reiniciar el juego de bingo
function resetGame() {
    location.reload(); // Recargar la página para reiniciar el juego
}

// Lógica para calcular el puntaje final
// Función para calcular el puntaje de un jugador dado su cartón de bingo
function calculateScore(card) {
    // Lógica para calcular el puntaje del cartón (líneas y cartón lleno)
    // Devuelve un objeto con las puntuaciones de cada tipo de línea y el puntaje total
}

// Función para mostrar el puntaje final de todos los jugadores
function showFinalScores(players) {
    // Lógica para calcular y mostrar el puntaje final de cada jugador
}

// Lógica para gestionar el juego de bingo
document.getElementById("start-game-btn").addEventListener("click", startGame);
document.getElementById("call-number-btn").addEventListener("click", callNumber);
document.getElementById("reset-game-btn").addEventListener("click", resetGame);




