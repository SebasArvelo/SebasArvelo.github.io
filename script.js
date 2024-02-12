// Variables globales
let jugadores = []; // Array para almacenar los nombres de los jugadores
let indiceJugadorActual = 0; // Índice del jugador actual
let contadorTurnos = 0; // Contador de turnos
let juegoTerminado = false; // Variable para verificar si el juego ha terminado
let puntajesTotales = [0, 0, 0, 0]; // Array para almacenar los puntajes totales de los jugadores

// Función para iniciar el juego
function iniciarJuego() {
    // Obtener el tamaño del cartón ingresado por el usuario
    const tamañoCarton = parseInt(document.getElementById('card-size').value);
    // Verificar que el tamaño del cartón sea válido (entre 3 y 5)
    if (isNaN(tamañoCarton) || tamañoCarton < 3 || tamañoCarton > 5) {
        alert('El tamaño del cartón debe ser un número entre 3 y 5.');
        return;
    }
    // Obtener los nombres de los jugadores ingresados por el usuario
    const jugador1Nombre = document.getElementById('player1-name').value.trim();
    const jugador2Nombre = document.getElementById('player2-name').value.trim();
    const jugador3Nombre = document.getElementById('player3-name').value.trim();
    const jugador4Nombre = document.getElementById('player4-name').value.trim();
    // Verificar que se hayan ingresado nombres para todos los jugadores
    if (jugador1Nombre === '' || jugador2Nombre === '' || jugador3Nombre === '' || jugador4Nombre === '') {
        alert('Por favor, ingrese el nombre de todos los jugadores.');
        return;
    }
    // Reiniciar variables globales
    jugadores = [jugador1Nombre, jugador2Nombre, jugador3Nombre, jugador4Nombre];
    indiceJugadorActual = 0;
    contadorTurnos = 0;
    juegoTerminado = false;
    puntajesTotales = [0, 0, 0, 0];
    // Generar los cartones de bingo para cada jugador
    generarCartonesBingo(tamañoCarton);
    // Mostrar el tablero de juego y ocultar el menú principal
    document.getElementById('menu').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'block';
    // Actualizar la interfaz con la información del jugador actual
    actualizarInformacionJugador();
    // Llamar a la función para llamar un número de bingo aleatorio
    llamarNumero();
}

// Función para generar los cartones de bingo para cada jugador
function generarCartonesBingo(tamaño) {
    // Limpiar el contenedor de los cartones de bingo
    const contenedorCartones = document.getElementById('bingo-board');
    contenedorCartones.innerHTML = '';
    // Generar un cartón de bingo para cada jugador
    for (let i = 0; i < 4; i++) {
        const cartonBingo = document.createElement('div');
        cartonBingo.id = `jugador${i + 1}-carton`;
        cartonBingo.className = 'carton-bingo';
        // Generar la matriz del cartón de bingo
        const matrizBingo = generarMatrizBingo(tamaño);
        // Llenar el cartón con los números generados aleatoriamente
        for (let fila = 0; fila < tamaño; fila++) {
            for (let columna = 0; columna < tamaño; columna++) {
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
function generarMatrizBingo(tamaño) {
    const matriz = [];
    const numeroMinimo = 1;
    const numeroMaximo = 50;
    // Generar la matriz con números aleatorios únicos
    for (let i = 0; i < tamaño; i++) {
        const fila = [];
        for (let j = 0; j < tamaño; j++) {
            let numeroAleatorio;
            do {
                numeroAleatorio = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
            } while (fila.includes(numeroAleatorio));
            fila.push(numeroAleatorio);
        }
        matriz.push(fila);
    }
    return matriz;
}

// Función para actualizar la interfaz con la información del jugador actual
function actualizarInformacionJugador() {
    document.getElementById('seleccionar-jugador').innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = jugadores[i];
        document.getElementById('seleccionar-jugador').appendChild(opcion);
    }
    document.getElementById('seleccionar-jugador').selectedIndex = indiceJugadorActual;
    document.getElementById('contador-turnos').textContent = contadorTurnos;
    document.getElementById('puntaje-total').textContent = puntajesTotales[indiceJugadorActual];
}

// Función para cambiar al siguiente jugador
function cambiarJugador() {
    indiceJugadorActual = parseInt(document.getElementById('seleccionar-jugador').value);
    actualizarInformacionJugador();
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
    if (indiceJugadorActual === 3) {
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
    const puntajesFinales = document.getElementById('puntajes-finales');
    puntajesFinales.innerHTML = '';
    for (let i = 0; i < 4; i++) {
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







