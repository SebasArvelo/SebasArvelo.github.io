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
        // Insertar números aleatorios en la columna central
        if (i === Math.floor(size / 2)) {
            for (let k = 0; k < maxNumbersPerColumn; k++) {
                let number;
                do {
                    number = getRandomNumber(i * numbersPerRow + 1, (i + 1) * numbersPerRow);
                } while (row.includes(number));
                row.push(number);
            }
        }
        // Ordenar la fila y agregarla al cartón
        row.sort((a, b) => a - b);
        card.push(row);
    }
    return card;
}

// Función para obtener un número aleatorio entre min (incluido) y max (excluido)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Función para mostrar la información del jugador actual
function showPlayerInfo() {
    const player = players[currentPlayerIndex];
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('turn-counter').textContent = currentTurn;
    document.getElementById('total-score').textContent = player.score;
}

// Función para mostrar el cartón de bingo del jugador actual
function showBingoCard() {
    const player = players[currentPlayerIndex];
    const bingoBoard = document.getElementById('bingo-board');
    bingoBoard.innerHTML = '';
    player.card.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('bingo-row');
        row.forEach(number => {
            const cell = document.createElement('div');
            cell.textContent = number;
            cell.classList.add('bingo-cell');
            if (number === 0 || player.calledNumbers.includes(number)) {
                cell.classList.add('marked');
            }
            rowDiv.appendChild(cell);
        });
        bingoBoard.appendChild(rowDiv);
    });
}

// Función para llamar un número aleatorio de bingo
function callNumber() {
    if (gameOver) return;
    const player = players[currentPlayerIndex];
    let calledNumber;
    do {
        calledNumber = getRandomNumber(1, 51);
    } while (player.calledNumbers.includes(calledNumber));
    player.calledNumbers.push(calledNumber);

    // Actualizar cartón y verificar si se ha completado una línea o cartón lleno
    updateBingoCard(calledNumber);
    checkWinningConditions();

    // Cambiar al siguiente jugador o reiniciar el turno si todos los jugadores han jugado
    currentPlayerIndex = (currentPlayerIndex + 1) % 4;
    if (currentPlayerIndex === 0) {
        currentTurn++;
    }

    // Mostrar información y cartón del próximo jugador
    showPlayerInfo();
    showBingoCard();
}

// Función para actualizar el cartón de bingo después de llamar un número
function updateBingoCard(number) {
    players.forEach(player => {
        const card = player.card;
        for (let i = 0; i < card.length; i++) {
            const row = card[i];
            const index = row.indexOf(number);
            if (index !== -1) {
                row[index] = 0; // Marcar el número como llamado
                break;
            }
        }
    });
}

// Función para verificar si se han completado condiciones de victoria
function checkWinningConditions() {
    players.forEach(player => {
        const card = player.card;
        let horizontalLine = true;
        let verticalLine = true;
        let diagonalLine1 = true;
        let diagonalLine2 = true;

        // Verificar líneas horizontales y verticales
        for (let i = 0; i < card.length; i++) {
