// Variables globales
let jugadores = [];
let indiceJugadorActual = 0;
let contadorTurnos = 0;
let juegoTerminado = false;
let puntajesTotales = [0, 0, 0, 0];
let tamañoCarton = 3; // Variable para almacenar el tamaño del cartón

// Función para iniciar el juego
function iniciarJuego() {
    // Obtener el tamaño del cartón ingresado por el usuario
    tamañoCarton = parseInt(document.getElementById('card-size').value);
    // Verificar que el tamaño del cartón sea válido (entre 3 y 5)
    if (isNaN(tamañoCarton) || tamañoCarton < 3 || tamañoCarton > 5) {
        alert('El tamaño del cartón debe ser un número entre 3 y 5.');
        return;
    }
    // Obtener los nombres de los jugadores ingresados por el usuario
    const nombresJugadores = [];
    for (let i = 1; i <= 4; i++) {
        const nombre = document.getElementById(`player${i}-name`).value.trim();
        if (nombre !== '') {
            nombresJugadores.push(nombre);
        }
    }
    // Verificar que se hayan ingresado nombres para al menos dos jugadores
    if (nombresJugadores.length < 2) {
        alert('Por favor, ingrese al menos dos nombres de jugadores.');
        return;
    }
    jugadores = nombresJugadores;
    indiceJugadorActual = 0;
    contadorTurnos = 0;
    juegoTerminado = false;
    puntajesTotales = [0, 0, 0, 0];
    // Generar los cartones de bingo para cada jugador
    generarCartonesBingo();
    // Mostrar el tablero de juego y ocultar el menú principal
    document.getElementById('menu').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'block';
    // Actualizar la interfaz con la información del jugador actual
    actualizarInformacionJugador();
}

// Función para generar los cartones de bingo para cada jugador
function generarCartonesBingo() {
    // Limpiar el contenedor de los cartones de bingo
    const contenedorCartones = document.getElementById('bingo-board');
    contenedorCartones.innerHTML = '';
    // Generar un cartón de bingo para cada jugador
    for (let i = 0; i < jugadores.length; i++) {
        const cartonBingo = document.createElement('div');
        cartonBingo.id = `jugador${i + 1}-carton`;
        cartonBingo.className = 'carton-bingo';
        // Generar la matriz del cartón de bingo
        const matrizBingo = generarMatrizBingo();
        // Llenar el cartón con los números generados aleatoriamente
        for (let fila = 0; fila < tamañoCarton; fila++) {
            for (let columna = 0; columna < tamañoCarton; columna++) {
                const celda = document.createElement('div');
                celda.className = 'celda';
                celda.textContent = matrizBingo[fila][columna];
                cartonBingo.appendChild(celda);
            }
        }
        // Agregar el cartón al contenedor
        contenedorCartones.appendChild(cartonBingo);
    }
}

// Función para generar una matriz cuadrada NxN para el cartón de bingo
function generarMatrizBingo() {
    const matriz = [];
    const numerosDisponibles = Array.from({ length: 50 }, (_, i) => i + 1);
    // Generar la matriz con números aleatorios únicos
    for (let i = 0; i < tamañoCarton; i++) {
        const fila = [];
        for (let j = 0; j < tamañoCarton; j++) {
            const numeroAleatorioIndex = Math.floor(Math.random() * numerosDisponibles.length);
            const numeroAleatorio = numerosDisponibles.splice(numeroAleatorioIndex, 1)[0];
            fila.push(numeroAleatorio);
        }
        matriz.push(fila);
    }
    return matriz;
}

// Función para actualizar la interfaz con la información del jugador actual
function actualizarInformacionJugador() {
    document.getElementById('select-player').innerHTML = '';
    for (let i = 0; i < jugadores.length; i++) {
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = jugadores[i];
        document.getElementById('select-player').appendChild(opcion);
    }
    document.getElementById('turn-counter').textContent = contadorTurnos;
    document.getElementById('total-score').textContent = puntajesTotales[indiceJugadorActual];
}

// Función para llamar un número de bingo aleatorio
function llamarNumero() {
    if (juegoTerminado) {
        return;
    }
    // Obtener un número aleatorio entre 1 y 50
    const numeroAleatorio = obtenerNumeroAleatorio(1, 50);
    // Mostrar el número llamado en la interfaz
    document.getElementById('numero-llamado').textContent = numeroAleatorio;
    // Actualizar los cartones de bingo de los jugadores
    actualizarCartonesBingo(numeroAleatorio);
    // Verificar si se ha completado un cartón lleno o se ha alcanzado el máximo de turnos
    verificarFinJuego();
    // Incrementar el contador de turnos y cambiar al siguiente jugador
    contadorTurnos++;
    if (indiceJugadorActual === jugadores.length - 1) {
        indiceJugadorActual = 0;
    } else {
        indiceJugadorActual++;
    }
    actualizarInformacionJugador();
}

// Función para obtener un número aleatorio en un rango específico
function obtenerNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para actualizar los cartones de bingo de los jugadores
function actualizarCartonesBingo(numero) {
    const cartonActual = document.getElementById(`jugador${indiceJugadorActual + 1}-carton`);
    const celdas = cartonActual.querySelectorAll('.celda');
    celdas.forEach(celda => {
        if (parseInt(celda.textContent) === numero) {
            celda.classList.add('marcada');
        }
    });
}

// Función para verificar si se ha completado un cartón lleno o se ha alcanzado el máximo de turnos
function verificarFinJuego() {
    const cartonActual = document.getElementById(`jugador${indiceJugadorActual + 1}-carton`);
    const celdas = cartonActual.querySelectorAll('.celda');
    // Verificar si todas las celdas están marcadas en el cartón actual
    const cartonCompleto = Array.from(celdas).every(celda => celda.classList.contains('marcada'));
    if (cartonCompleto) {
        // Incrementar el puntaje total del jugador actual
        puntajesTotales[indiceJugadorActual] += 5;
        juegoTerminado = true;
        mostrarFinJuego();
        return;
    }
    // Verificar si se ha alcanzado el máximo de turnos
    if (contadorTurnos >= 25) {
        juegoTerminado = true;
        mostrarFinJuego();
        return;
    }
}

// Función para mostrar el mensaje de juego terminado
function mostrarFinJuego() {
    document.getElementById('bingo-game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    // Mostrar el puntaje total de cada jugador y la cantidad de victorias acumuladas
    const puntajesFinales = document.getElementById('final-scores');
    puntajesFinales.innerHTML = '';
    for (let i = 0; i < jugadores.length; i++) {
        const puntajeJugador = document.createElement('p');
        puntajeJugador.textContent = `${jugadores[i]}: ${puntajesTotales[i]} puntos`;
        puntajesFinales.appendChild(puntajeJugador);
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('bingo-game').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    // Limpiar el tablero de bingo
    const contenedorCartones = document.getElementById('bingo-board');
    contenedorCartones.innerHTML = '';
}
