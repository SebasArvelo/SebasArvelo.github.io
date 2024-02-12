// Variables globales
let players = [];
let currentPlayerIndex = 0;
let currentTurn = 0;
let maxTurns = 25;
let gameOver = false;

// Función para iniciar el juego
function startGame() {
    const playerNames = document.getElementById('player-names').value.trim().split('\n');
    const cardSize = parseInt(document.getElementById('card-size').value);

    // Validar que se hayan ingresado nombres para todos los jugadores
    if (playerNames.length !== 4 || playerNames.some(name => name.trim() === '')) {
        alert('Ingrese nombres para los 4 jugadores.');
        return;
    }

    // Validar tamaño del cartón
    if (isNaN(cardSize) || cardSize < 3 || cardSize > 5) {
        alert('El tamaño del cartón debe ser un número entre 3 y 5.');
        return;
    }

    // Reiniciar variables globales
    players = [];
    currentPlayerIndex = 0;
    currentTurn = 0;
    gameOver = false;

    // Generar cartón de bingo para cada jugador
    for (let i = 0; i < 4; i++) {
        const card = generateBingoCard(cardSize);
        players.push({ name: playerNames[i].trim(), card: card, score: 0 });
    }

    // Ocultar menú principal y mostrar juego de bingo
    document.getElementById('menu').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'block';

    // Mostrar información del primer jugador
    showPlayerInfo();
    // Mostrar cartón del primer jugador
    showBingoCard();
}

// Función para generar un cartón de bingo aleatorio
function generateBingoCard(size) {
    const card = [];
    const maxNumber = 50;
    const numbersPerRow = Math.ceil(maxNumber / size);
    const maxNumbersPerColumn = Math.floor(size / 2);
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // Generar números aleatorios sin repetición para cada fila
            let number;
            do {
                number = getRandomNumber(i * numbersPerRow + 1, (i + 1) * numbersPerRow);
            } while (row.includes(number));
            row.push(number);
        }
