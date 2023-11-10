window.onload = function () {

	const TOPEDERECHA = 400;
	const TOPEABAJO = 700;
	const POSICIONPJ = 100; // Posición Y del personaje durante la partida
	const ANCHOPJ = 35; // Aunque el sprite mide 40 píxeles, definir el ancho del personaje en 35 píxeles ayuda a conseguir una mejor coherencia visual en lo relativo a las colisiones
	const ALTOPJ = 40;
	const ANCHOENEMIGO = 25;
	const ALTOENEMIGO = 25;
	const VELOCIDADPJ = 2.6;
	const ENEMIGOSMINIMOS = 150;
	const ENEMIGOSMAXIMOS = 300;
	const NUMENEMIGOS = ENEMIGOSMINIMOS + Math.round(Math.random() * (ENEMIGOSMAXIMOS - ENEMIGOSMINIMOS));
	const GRAVEDAD = 2;
	const PROFUNDIDADENEMIGOS = 20000;
	let enemigos = [];
	let posicionX, posicionY, velocidadEnemigo;

	//lineas 15 a 58: personaje
	let x = TOPEDERECHA / 2 - (ANCHOPJ / 2);        // posición inicial x del personaje
	let y = POSICIONPJ;      // posición y del personaje (en principio, invariable)
	let canvas;     // variable que referencia al elemento canvas del html
	let ctx;        // contexto de trabajo
	let id1, id2;   // id de la animación

	let xDerecha;
	let xIzquierda;

	let posicion = 0;   // Posición del array 0, 1
	let ejecutarDerecha = true;

	let miPersonaje;
	let imagen; // en principio tendremos en una sola imagen tanto sprites del personaje como de los enemigos. Puede variar más adelante

	function Personaje (x, y) {

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
	function Enemigo (x, y, velocidad) {
		this.x = x;
		this.y = y; // de momento la velocidad es invariable, para hacerla variable ver el ejercicio de cuadrados en el drive
		this.velocidad = velocidad;
	}

	for (let i = 0; i < NUMENEMIGOS; i++) {
		posicionX = Math.round(Math.random() * (TOPEDERECHA - ANCHOENEMIGO));
		posicionY = TOPEABAJO + Math.round(Math.random() * (PROFUNDIDADENEMIGOS - TOPEABAJO));
		velocidadEnemigo = (Math.random() - 0.5) * 3;
		enemigos[i] = new Enemigo (posicionX, posicionY, velocidadEnemigo);
		console.log(enemigos[i].velocidad);
	}

	function pintaRectangulo() {

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

		for (let i = 0; i < NUMENEMIGOS; i++) {
			ctx.fillRect(enemigos[i].x, enemigos[i].y, ALTOENEMIGO, ANCHOENEMIGO);
			ctx.fillStyle = "black";
			enemigos[i].x += enemigos[i].velocidad;
			if (enemigos[i].x <= 0){ // toca pared de la izquierda
				enemigos[i].velocidad = Math.abs(enemigos[i].velocidad);
			}
			if (enemigos[i].x >= TOPEDERECHA - ANCHOENEMIGO){ // toca pared de la derecha
				enemigos[i].velocidad = -Math.abs(enemigos[i].velocidad);
			}
			enemigos[i].y -= GRAVEDAD;
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

	// Lanzamos la animación
	id1 = setInterval(pintaRectangulo, 1000 / 120);

}

/*
Créditos a los autores de los modelos utilizados en el sprite: "Authors: bluecarrot16, Benjamin K. Smith (BenCreating), Evert, Eliza Wyatt (ElizaWy), TheraHedwig, MuffinElZangano, Durrani, Johannes Sj?lund (wulax), Stephen Challener (Redshrike), Manuel Riecke (MrBeast), Joe White, David Conway Jr. (JaidynReiman), Johannes Sjölund (wulax), Matthew Krohn (makrohn), drjamgo@hotmail.com".
*/