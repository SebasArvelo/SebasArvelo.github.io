// Obtener elementos del DOM
const playerNamesTextarea = document.getElementById('player-names');
const cardSizeInput = document.getElementById('card-size');
const startButton = document.getElementById('start-button');
const selectPlayer = document.getElementById('select-player');
const bingoBoard = document.getElementById('bingo-board');
const turnCounter = document.getElementById('turn-counter');
const totalScore = document.getElementById('total-score');
const callNumberButton = document.getElementById('call-number-button');

// Variables globales
let players = [];
let currentPlayerIndex = 0;
let turn = 0;
let numbersCalled = new Set();

// Función para iniciar el juego
function startGame() {
    // Obtener nombres de jugadores
    const playerNames = playerNamesTextarea.value.split('\n');
    
    // Validar que haya 4 nombres ingresados
    if (playerNames.length !== 4) {
        alert('Debes ingresar nombres para 4 jugadores.');
        return;
    }

    // Crear jugadores
    players = playerNames.map(name => ({
        name: name.trim(),
        card: generateBingoCard(cardSizeInput.value)
    }));

    // Mostrar el juego y el primer jugador
    document.getElementById('menu').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'block';
    showCurrentPlayer();
}

// Función para generar un cartón de bingo
function generateBingoCard(size) {
    const card = [];
    const min = 1;
    const max = 50;
    
    // Generar números aleatorios únicos para el cartón
    while (card.length < size * size) {
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!card.includes(number)) {
            card.push(number);
        }
    }

    // Organizar números en filas y columnas
    const bingoCard = [];
    for (let i = 0; i < size; i++) {
        bingoCard.push(card.slice(i * size, (i + 1) * size));
    }
    return bingoCard;
}

// Función para mostrar el cartón de bingo del jugador actual
function showCurrentPlayer() {
    const currentPlayer = players[currentPlayerIndex];
    selectPlayer.textContent = currentPlayer.name;
    bingoBoard.innerHTML = ''; // Limpiar el tablero anterior
    
    // Crear el tablero de bingo
    currentPlayer.card.forEach(row => {
        row.forEach(number => {
            const cell = document.createElement('div');
            cell.textContent = number;
            cell.classList.add('cell');
            if (numbersCalled.has(number)) {
                cell.classList.add('called');
            }
            bingoBoard.appendChild(cell);
        });
    });
}

// Función para llamar un número de bingo aleatorio
function callNumber() {
    // Verificar si todos los números ya han sido llamados
    if (numbersCalled.size === 50) {
        alert('¡Todos los números ya han sido llamados!');
        return;
    }

    let number;
    // Generar un número aleatorio que no se haya llamado antes
    do {
        number = Math.floor(Math.random() * 50) + 1;
    } while (numbersCalled.has(number));
    
    // Marcar el número como llamado
    numbersCalled.add(number);
    
    // Actualizar la interfaz de usuario
    const calledCell = document.querySelector(`.cell[data-number="${number}"]`);
    calledCell.classList.add('called');

    // Verificar si el número coincide con algún número en los cartones de bingo de los jugadores
    players.forEach(player => {
        player.card.forEach(row => {
            if (row.includes(number)) {
                const cell = document.querySelector(`.cell[data-number="${number}"]`);
                cell.classList.add('matched');
                if (checkWinner(player)) {
                    endGame(player);
                }
            }
        });
    });

    // Actualizar el contador de turnos
    updateTurnCounter();
}

// Función para verificar si se ha logrado una línea horizontal, vertical o diagonal
function checkWinner(player) {
    // Lógica para verificar si el jugador ha logrado una línea o cartón lleno
    const card = player.card;
    // Verificar líneas horizontales
    for (let i = 0; i < card.length; i++) {
        const row = card[i];
        if (row.every(number => numbersCalled.has(number))) {
            return true;
        }
    }
    // Verificar líneas verticales
    for (let i = 0; i < card.length; i++) {
        const column = card.map(row => row[i]);
        if (column.every(number => numbersCalled.has(number))) {
            return true;
        }
    }
    // Verificar diagonales
    const diagonal1 = card.map((row, index) => row[index]);
    const diagonal2 = card.map((row, index) => row[row.length - 1 - index]);
    if (diagonal1.every(number => numbersCalled.has(number)) || diagonal2.every(number => numbersCalled.has(number))) {
        return true;
    }
    return false;
}

// Función para actualizar el contador de turnos
function updateTurnCounter() {
    turn++;
    turnCounter.textContent = turn;
}

// Función para terminar el juego
function endGame(winner) {
    // Mostrar mensaje de juego terminado
    alert(`¡Bingo! ${winner.name} ha ganado.`);
    // Reiniciar el juego
    resetGame();
}

// Función para reiniciar el juego
function resetGame() {
    // Reiniciar variables globales
    currentPlayerIndex = 0;
    turn = 0;
    numbersCalled.clear();
    // Limpiar tablero y actualizar interfaz
    bingoBoard.innerHTML = '';
    turnCounter.textContent = turn;
    totalScore.textContent = '';
    // Volver al menú principal
    document.getElementById('menu').style.display = 'block';
    document.getElementById('bingo-game').style.display = 'none';
}

// Iniciar el juego al hacer clic en el botón de inicio
startButton.addEventListener('click', startGame);

// Llamar un número de bingo al hacer clic en el botón de llamar número
callNumberButton.addEventListener('click', callNumber);

