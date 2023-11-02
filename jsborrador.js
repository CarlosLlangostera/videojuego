window.onload = function () {

	const TOPEDERECHA = 400;
	const TOPEABAJO = 700;
    const ANCHOPJ = 10;
    const ALTOPJ = 30;
    const VELOCIDADPJ = 3;

	let x = TOPEDERECHA / 2 - ANCHOPJ;        // posición inicial x del personaje
	let y = 300;      // posición y del personaje (en principio, invariable)
	let canvas;     // variable que referencia al elemento canvas del html
	let ctx;        // contexto de trabajo
	let id1, id2;   // id de la animación

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
		this.animacionPJ = [[30, 640], [1430, 645], [1050, 398], [1300, 270]]; // Por orden: no disparando mirando a la derecha, no disparando mirando a la izquierda, disparando mirando a la derecha, disparando mirando a la izquierda
		this.tamañoX = 70;
		this.tamañoY = 120;

	}

	Personaje.prototype.generaPosicionDerecha = function () {

		this.x = this.x + this.velocidadPJ;

		if (this.x > TOPEDERECHA) {
			this.x = TOPEDERECHA;
		}
	}

	Personaje.prototype.generaPosicionIzquierda = function () {

		this.x = this.x - this.velocidad;

		if (this.x < TOPEIZQUIERDA) {
			this.x = TOPEIZQUIERDA;
		}
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

		// Pintamos el comecocos
		ctx.drawImage(miPersonaje.imagen, // Imagen completa con todos los comecocos (Sprite)
			miPersonaje.animacionPJ[posicion][0],    // Posicion X del sprite donde se encuentra el comecocos que voy a recortar del sprite para dibujar
			miPersonaje.animacionPJ[posicion][1],	  // Posicion Y del sprite donde se encuentra el comecocos que voy a recortar del sprite para dibujar
			miPersonaje.tamañoX, 		    // Tamaño X del comecocos que voy a recortar para dibujar
			miPersonaje.tamañoY,	        // Tamaño Y del comecocos que voy a recortar para dibujar
			miPersonaje.x,                // Posicion x de pantalla donde voy a dibujar el comecocos recortado
			miPersonaje.y,				            // Posicion y de pantalla donde voy a dibujar el comecocos recortado
			miPersonaje.tamañoX,		    // Tamaño X del comecocos que voy a dibujar
			miPersonaje.tamañoY);         // Tamaño Y del comecocos que voy a dibujar					  

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
				posicion = 0;
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
	imagen.src = "char_orange.png";
	Personaje.prototype.imagen = imagen;

	miPersonaje = new Personaje(x, y);

	// Lanzamos la animación
	id1 = setInterval(pintaRectangulo, 1000 / 120);

}