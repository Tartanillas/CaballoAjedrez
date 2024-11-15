'use strict'
const rowName = 'ABCDEFGH'
const initialPosition = 'D4'
const max = 8
const min = 1
const columnas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const filas = ['1', '2', '3', '4', '5', '6', '7', '8']
let movimientosPorPartida = []
let movimientosIniciales = 0
let posicionFinal = getRandomPosition()
let posicionActual = initialPosition
window.addEventListener('load', () => {
	renderTable()
	restartScore()
	winnerPosition()
	startMove()
	putDropable(initialPosition)
})

function renderTable() {
	let tabla = ''
	// Dibujamos la tabla de 8x8 más la primera celda de cada fila que es el nombre de la fila de 8..1
	for (let i = 8; i > 0; i--) {
		tabla += `<tr><th>${i}</th>`
		for (let j = 0; j < 8; j++) {
			tabla += `<td id="${rowName.charAt(j) + i}" class="${((i + j) % 2) ? 'negra' : 'blanca'}"></td>`
		}
		tabla += '</tr><tr><th></th>'
	}
	// Dibujamos el encabezado de las columnas, A..H
	for (let i = 0; i < 8; i++) {
		tabla += `<th>${rowName.charAt(i)}</th>`
	}
	tabla += '</tr>'

	tablero.innerHTML = tabla

	// Colocamos el caballo en su celda inicial
	document.getElementById(initialPosition).innerHTML =
		'<img id="caballo" src="./images/caballo.png" width="50px">'
}

function calcTargets(position) {
	const column = rowName.indexOf(position.charAt(0)) + 1
	const row = Number(position.charAt(1))
	let targets = []
	targets.push([column + 2, row + 1])
	targets.push([column + 2, row - 1])
	targets.push([column - 2, row + 1])
	targets.push([column - 2, row - 1])
	targets.push([column + 1, row + 2])
	targets.push([column + 1, row - 2])
	targets.push([column - 1, row + 2])
	targets.push([column - 1, row - 2])
	return clearTargets(targets).map(cell =>
		rowName.charAt(cell[0] - 1) + cell[1])
}

function clearTargets(targets) {
	return targets.filter(cell => {
		const column = cell[0]
		const row = cell[1]
		return (column >= 1 && column <= 8 && row >= 1 && row <= 8)
	})
}

function getRandomPosition() {
	let posicionAleatoria
	do {
		const numeroColumnaAleatoria = Math.round(Math.random() * (max - min))
		const numeroFilaAleatoria = Math.round(Math.random() * (max - min))
		const columnaAleatoria = columnas[numeroColumnaAleatoria]
		const filaAleatoria = filas[numeroFilaAleatoria]
		posicionAleatoria = columnaAleatoria + filaAleatoria
	} while (posicionAleatoria == initialPosition)
	return posicionAleatoria
}

function restartScore() {
	document.querySelector('.btn-reinicio').addEventListener('click', () => {
		let campos = document.getElementsByClassName('data-info')
		Array.from(campos).forEach(campo => {
			campo.textContent = 0
		})
		movimientosPorPartida = [];
	})
}

function putDropable(position) {
	const celdasDropables = calcTargets(position)
	const elementosDropables = celdasDropables.map(celdaId => document.getElementById(celdaId))
	elementosDropables.forEach(elemento => {
		elemento.classList.add('dropable')
	})
	return elementosDropables
}

function startNewGame() {
	movimientosIniciales = 0
	posicionFinal = getRandomPosition()
	removeDropable()
	renderTable()
	winnerPosition()
	putDropable(initialPosition)
	startMove()
}


function winnerPosition() {
	document.getElementById(posicionFinal).classList.add('final')
	document.getElementById('posicion').textContent = posicionFinal
}

function checkWin(position) {
	if (position === posicionFinal) {
		alert('¡Has alcanzado el objetivo!')
		movimientosPorPartida.push(movimientosIniciales)
		updateScore()
		removeDropable()
		posicionActual = initialPosition
		startNewGame()
	}
}

function removeDropable() {
	const celdasDropables = document.querySelectorAll('.dropable')
	celdasDropables.forEach(celda => {
		celda.classList.remove('dropable')
		celda.removeEventListener('dragover', dragOverHandler)
		celda.removeEventListener('drop', dropHandler)
	})
}


function dragOverHandler(event) {
	event.preventDefault()
}

function dropHandler(event) {
	event.preventDefault()
	const data = event.dataTransfer.getData('text/plain')
	event.target.appendChild(document.getElementById(data))
	movimientosIniciales++
	posicionActual = event.target.id
	checkWin(event.target.id)
	startMove() 
}

function startMove() {
	const caballo = document.getElementById('caballo')
	removeDropable()
	const celdasDropables = putDropable(posicionActual)

	caballo.addEventListener('dragstart', (event) => {
		event.dataTransfer.setData('text/plain', event.target.id)
	})
	celdasDropables.forEach(celda => {
		celda.addEventListener('dragover', dragOverHandler)
		celda.addEventListener('drop', dropHandler)
	})
}

function updateScore() {
	document.getElementById('played-text').textContent++
	const movimientosMejorPartida = Math.min(...movimientosPorPartida)
	const movimientosPeorPartida = Math.max(...movimientosPorPartida)
	document.getElementById('best-mov-text').textContent = movimientosMejorPartida
	document.getElementById('worst-mov-text').textContent = movimientosPeorPartida
	const vecesMejorPartida = movimientosPorPartida.filter(movimiento => movimiento === movimientosMejorPartida).length
	const vecesPeorPartida = movimientosPorPartida.filter(movimiento => movimiento === movimientosPeorPartida).length
	document.getElementById('best-num-text').textContent = vecesMejorPartida
	document.getElementById('worst-num-text').textContent = vecesPeorPartida
}
