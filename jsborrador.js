window.onload = function () {

	const TOPEDERECHA = 400;
	const TOPEABAJO = 700;
	const POSICIONPJ = 100; // Posición Y del personaje durante la partida
	const ANCHOPJ = 35; // Aunque el sprite mide 40 píxeles, definir el ancho del personaje en 35 píxeles ayuda a conseguir una mejor coherencia visual en lo relativo a las colisiones
	const ALTOPJ = 40;
	const ANCHOENEMIGO = 25;
	const ALTOENEMIGO = 25;
	const VELOCIDADPJ = 2.6;
	const ENEMIGOSMINIMOS = 750;
	const ENEMIGOSMAXIMOS = 1500;
	const NUMENEMIGOS = ENEMIGOSMINIMOS + Math.round(Math.random() * (ENEMIGOSMAXIMOS - ENEMIGOSMINIMOS));
	let enemigosRestantes = NUMENEMIGOS; // esta variable la usamos para evitar provocar fallos buscando en posiciones del array "enemigos" que ya no existen porque hemos borrado algún elemento
	const PROFUNDIDADENEMIGOS = 100000;
	let enemigos = [];
	let vidas = 3;
	let puntuacion = 0;
	let posicionX, posicionY, velocidadEnemigoX, velocidadEnemigoY;

	//lineas 15 a 58: personaje
	let x = TOPEDERECHA / 2 - (ANCHOPJ / 2);        // posición inicial x del personaje
	let y = POSICIONPJ;      // posición y del personaje (en principio, invariable)
	let canvas;     // variable que referencia al elemento canvas del html
	let ctx;        // contexto de trabajo
	let idPintar;

	let xDerecha;
	let xIzquierda;

	let posicion = 0;   // Posición del array 0, 1
	let ejecutarDerecha = true;

	let miPersonaje;
	let imagen; // en principio tendremos en una sola imagen tanto sprites del personaje como de los enemigos. Puede variar más adelante

	function Personaje(x, y) {

		this.x = x;
		this.y = y;
		this.velocidadPJ = VELOCIDADPJ;
		this.animacionPJ = [[0, 0], [40, 0], [80, 0], [120, 0], [160, 0]]; // Por orden: manos arriba, cayendo izquierda, cayendo derecha, disparando izquierda, disparando derecha
		this.tamañoX = 40;
		this.tamañoY = 40;

	}

	Personaje.prototype.generaPosicionDerecha = function () {

		this.x = this.x + this.velocidadPJ;

		if (this.x > (TOPEDERECHA - ANCHOPJ)) {
			this.x = TOPEDERECHA - ANCHOPJ;
		}
	}

	Personaje.prototype.generaPosicionIzquierda = function () {

		this.x = this.x - this.velocidadPJ;

		// -8 en lugar de -0 para que el personaje visualmente se encuentre más cerca de los límites del canvas
		if (this.x < (-8)) {
			this.x = (-8);
		}
	}

	//lineas 61 a : enemigos
	function Enemigo(x, y, velocidadX, velocidadY) {
		this.x = x;
		this.y = y;
		this.velocidadX = velocidadX;
		this.velocidadY = velocidadY;
	}

	function generarEnemigos() {
		for (let i = 0; i < NUMENEMIGOS; i++) {
			posicionX = Math.round(Math.random() * (TOPEDERECHA - ANCHOENEMIGO));
			posicionY = TOPEABAJO + Math.round(Math.random() * (PROFUNDIDADENEMIGOS - TOPEABAJO));
			velocidadEnemigoX = (Math.random() - 0.5) * 3;
			velocidadEnemigoY = 2; // todos los enemigos parten de la misma velocidad Y inicial.
			enemigos[i] = new Enemigo(posicionX, posicionY, velocidadEnemigoX, velocidadEnemigoY);
		}
	}

	document.getElementById("inicioJuego").onclick = iniciarJuego;

	function iniciarJuego() {
		idPintar = setInterval(pintar, 1000 / 120);
		generarEnemigos();
		enemigosRestantes = NUMENEMIGOS;
		vidas = 3;
		puntuacion = 0;
		miPersonaje.x = TOPEDERECHA / 2 - (ANCHOPJ / 2);
		posicion = 0;
	}

	function pintar() {

			document.getElementById('inicioJuego').style.visibility = 'hidden';

			document.getElementById("MensajeSuperior").innerHTML = "Puntuación: " + puntuacion; // La puntuación aumenta en 1 por cada enemigo superado (es decir, que sale de la pantalla por la parte superior). Como el número de enemigos puede variar en cada intento, al superar el juego se establecerá automáticamente la puntuación máxima (10000).
			// borramos el canvas
			ctx.clearRect(0, 0, TOPEDERECHA, TOPEABAJO);

			if (xDerecha) {
				miPersonaje.generaPosicionDerecha();
			}

			if (xIzquierda) {
				miPersonaje.generaPosicionIzquierda();
			}

			// Pintamos al personaje
			ctx.drawImage(miPersonaje.imagen, // Imagen completa con todos los personajes (Sprite)
				miPersonaje.animacionPJ[posicion][0],    // Posicion X del sprite donde se encuentra el comecocos que voy a recortar del sprite para dibujar
				miPersonaje.animacionPJ[posicion][1],	  // Posicion Y del sprite donde se encuentra el comecocos que voy a recortar del sprite para dibujar
				miPersonaje.tamañoX, 		    // Tamaño X del comecocos que voy a recortar para dibujar
				miPersonaje.tamañoY,	        // Tamaño Y del comecocos que voy a recortar para dibujar
				miPersonaje.x,                // Posicion x de pantalla donde voy a dibujar el comecocos recortado
				miPersonaje.y,				            // Posicion y de pantalla donde voy a dibujar el comecocos recortado
				miPersonaje.tamañoX,		    // Tamaño X del comecocos que voy a dibujar
				miPersonaje.tamañoY);         // Tamaño Y del comecocos que voy a dibujar					  

			for (let i = 0; i < enemigosRestantes; i++) {
				ctx.fillRect(enemigos[i].x, enemigos[i].y, ALTOENEMIGO, ANCHOENEMIGO);
				ctx.fillStyle = "black";
				enemigos[i].x += enemigos[i].velocidadX;
				if (enemigos[i].x <= 0) { // toca pared de la izquierda
					enemigos[i].velocidadX = Math.abs(enemigos[i].velocidadX);
				}
				if (enemigos[i].x >= TOPEDERECHA - ANCHOENEMIGO) { // toca pared de la derecha
					enemigos[i].velocidadX = -Math.abs(enemigos[i].velocidadX);
				}
				enemigos[i].y -= enemigos[i].velocidadY;
				enemigos[i].velocidadY += 0.0001; // Incremento de dificultad lento y progresivo. Aunque velocidadY no tiene un límite establecido, la partida acabará cuando dejen de salir enemigos, y en ese punto, la dificultad me parece apropiada.
				if (enemigos[i].y <= 0 - (ALTOENEMIGO + 2)) { // vamos vaciando el array "enemigos" por optimización y por tener una manera de saber cuándo se ha superado el juego. "+ 2" para que no se llegue a ver el último cuadrado en pantalla.
					enemigos.splice(i, 1);
					enemigosRestantes--;
					puntuacion++;
				}

				if (vidas == 0 || enemigos.length == 0) {
					document.getElementById('inicioJuego').style.visibility = 'visible';

					if (enemigos.length == 0) {
						puntuacion = 10000;
						document.getElementById("MensajeSuperior").innerHTML = "Puntuación: " + puntuacion;
						document.getElementById("MensajeInferior").innerHTML = "¡Enhorabuena! Has completado el juego. Vidas restantes: " + vidas;
					}

					clearInterval(idPintar);
					
				}
			
		}
	}
	/*
		function activarSpriteDerecha() {
	
			if (!ejecutarDerecha) posicion = 0;
	
			ejecutarDerecha = true;
		}
	
		function activarSpriteIzquierda() {
	
			if (ejecutarDerecha) posicion = 2;
	
			ejecutarDerecha = false;
		}
	
		function activarSpriteAbajo() {
	
			if (!ejecutarAbajo) posicion = 4;
	
			ejecutarAbajo = true;
		}
	
		function activarSpriteArriba() {
	
			if (ejecutarAbajo) posicion = 6;
	
			ejecutarAbajo = false;
		}
	*/
	function activaMovimiento(evt) {

		switch (evt.keyCode) {

			// Left arrow.
			case 37:
				xIzquierda = true;
				posicion = 1;
				break;

			// Right arrow.
			case 39:
				xDerecha = true;
				posicion = 2;
				break;

		}
	}

	function desactivaMovimiento(evt) {

		switch (evt.keyCode) {


			// Left arrow.
			case 37:
				xIzquierda = false;
				break;

			// Right arrow.
			case 39:
				xDerecha = false;
				break;

		}

	}

	document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);

	// localizamos el canvas
	canvas = document.getElementById("miCanvas");

	// Generamos el contexto de trabajo
	ctx = canvas.getContext("2d");

	imagen = new Image();
	imagen.src = "SpritePersonaje40.png";
	Personaje.prototype.imagen = imagen;

	miPersonaje = new Personaje(x, y);

}

/*
Créditos a los autores de los modelos utilizados en el sprite: "Authors: bluecarrot16, Benjamin K. Smith (BenCreating), Evert, Eliza Wyatt (ElizaWy), TheraHedwig, MuffinElZangano, Durrani, Johannes Sj?lund (wulax), Stephen Challener (Redshrike), Manuel Riecke (MrBeast), Joe White, David Conway Jr. (JaidynReiman), Johannes Sjölund (wulax), Matthew Krohn (makrohn), drjamgo@hotmail.com".
*/