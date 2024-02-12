// Variables globales
let players = []; // Array para almacenar los nombres de los jugadores
let currentPlayerIndex = 0; // Índice del jugador actual
let turnCounter = 0; // Contador de turnos
let gameOver = false; // Variable para verificar si el juego ha terminado
let totalScores = [0, 0, 0, 0]; // Array para almacenar los puntajes totales de los jugadores

// Función para iniciar el juego
function startGame() {
    // Obtener el tamaño del cartón ingresado por el usuario
    const cardSize = parseInt(document.getElementById('card-size').value);
    // Verificar que el tamaño del cartón sea válido (entre 3 y 5)
    if (isNaN(cardSize) || cardSize < 3 || cardSize > 5) {
        alert('El tamaño del cartón debe ser un número entre 3 y 5.');
        return;
    }
    // Obtener los nombres de los jugadores ingresados por el usuario
    const player1Name = document.getElementById('player1-name').value.trim();
    const player2Name = document.getElementById('player2-name').value.trim();
    const player3Name = document.getElementById('player3-name').value.trim();
    const player4Name = document.getElementById('player4-name').value.trim();
    // Verificar que se hayan ingresado nombres para todos los jugadores
    if (player1Name === '' || player2Name === '' || player3Name === '' || player4Name === '') {
        alert('Por favor, ingrese el nombre de todos los jugadores.');
        return;
    }
    // Reiniciar variables globales
    players = [player1Name, player2Name, player3Name, player4Name];
    currentPlayerIndex = 0;
    turnCounter = 0;
    gameOver = false;
    totalScores = [0, 0, 0, 0];
    // Generar los cartones de bingo para cada jugador
    generateBingoCards(cardSize);
    // Mostrar el tablero de juego y ocultar el menú principal
    document.getElementById('menu').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'block';
    // Actualizar la interfaz con la información del jugador actual
    updatePlayerInfo();
    // Llamar a la función para llamar un número de bingo aleatorio
    callNumber();
}

// Función para generar los cartones de bingo para cada jugador
function generateBingoCards(cardSize) {
    // Limpiar el contenedor de los cartones de bingo
    const bingoBoardContainer = document.getElementById('bingo-board');
    bingoBoardContainer.innerHTML = '';
    // Generar un cartón de bingo para cada jugador
    for (let i = 0; i < 4; i++) {
        const bingoBoard = document.createElement('div');
        bingoBoard.id = `player${i + 1}-board`;
        bingoBoard.className = 'bingo-board';
        // Generar la matriz del cartón de bingo
        const bingoMatrix = generateBingoMatrix(cardSize);
        // Llenar el cartón con los números generados aleatoriamente
        for (let row = 0; row < cardSize; row++) {
            for (let col = 0; col < cardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = bingoMatrix[row][col];
                bingoBoard.appendChild(cell);
            }
        }
        // Agregar el cartón al contenedor
        bingoBoardContainer.appendChild(bingoBoard);
    }
}

// Función para generar una matriz cuadrada NxN para el cartón de bingo
function generateBingoMatrix(size) {
    const matrix = [];
    const minNumber = 1;
    const maxNumber = 50;
    // Generar la matriz con números aleatorios únicos
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
            } while (row.includes(randomNumber));
            row.push(randomNumber);
        }
        matrix.push(row);
    }
    return matrix;
}

// Función para actualizar la interfaz con la información del jugador actual
function updatePlayerInfo() {
    document.getElementById('select-player').innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = players[i];
        document.getElementById('select-player').appendChild(option);
    }
    document.getElementById('select-player').selectedIndex = currentPlayerIndex;
    document.getElementById('turn-counter').textContent = turnCounter;
    document.getElementById('total-score').textContent = totalScores[currentPlayerIndex];
}

// Función para cambiar al siguiente jugador
function changePlayer() {
    currentPlayerIndex = parseInt(document.getElementById('select-player').value);
    updatePlayerInfo();
}

// Función para llamar un número de bingo aleatorio
function callNumber() {
    if (gameOver) {
        return;
    }
    // Obtener un número aleatorio entre 1 y 50
    const randomNumber = getRandomNumber(1, 50);
    // Mostrar el número llamado en la interfaz
    document.getElementById('called-number').textContent = randomNumber;
    // Actualizar los cartones de bingo de los jugadores
    updateBingoCards(randomNumber);
    // Verificar si se ha completado un cartón lleno o se ha alcanzado el máximo de turnos
    checkGameOver();
    // Incrementar el contador de turnos y cambiar al siguiente jugador
    turnCounter++;
    if (currentPlayerIndex === 3) {
        currentPlayerIndex = 0;
    } else {
        currentPlayerIndex++;
    }
    updatePlayerInfo();
}

// Función para obtener un número aleatorio en un rango específico
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para actualizar los cartones de bingo de los jugadores
function updateBingoCards(number) {
    const currentBoard = document.getElementById(`player${currentPlayerIndex + 1}-board`);
    const cells = currentBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (parseInt(cell.textContent) === number) {
            cell.classList.add('marked');
        }
    });
}

// Función para verificar si se ha completado un cartón lleno o se ha alcanzado el máximo de turnos
function checkGameOver() {
    const currentBoard = document.getElementById(`player${currentPlayerIndex + 1}-board`);
    const cells = currentBoard.querySelectorAll('.cell');
    // Verificar si todas las celdas están marcadas en el cartón actual
    const isBoardFull = Array.from(cells).every(cell => cell.classList.contains('marked'));
    if (isBoardFull) {
        // Incrementar el puntaje total del jugador actual
        totalScores[currentPlayerIndex] += 5;
        gameOver = true;
        showGameOver();
        return;
    }
    // Verificar si se ha alcanzado el máximo de turnos
    if (turnCounter >= 25) {
        gameOver = true;
        showGameOver();
        return;
    }
}

// Función para mostrar el mensaje de juego terminado
function showGameOver() {
    document.getElementById('bingo-game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    // Mostrar el puntaje total de cada jugador y la cantidad de victorias acumuladas
    const finalScores = document.getElementById('final-scores');
    finalScores.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const playerScore = document.createElement('p');
        playerScore.textContent = `${players[i]}: ${totalScores[i]} puntos`;
        finalScores.appendChild(playerScore);
    }
}

// Función para reiniciar el juego
function resetGame() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('bingo-game').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    // Limpiar el tablero de bingo
    const bingoBoardContainer = document.getElementById('bingo-board');
    bingoBoardContainer.innerHTML = '';
}






