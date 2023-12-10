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
	const RETRASODISPARO = 25;
	const VELOCIDADBALA = 3;
	const PROFUNDIDADENEMIGOS = 100000;
	let balas = [];
	let numBala = -1; // función: identificar cada bala en el array "balas"
	let numBalas = 0; // función: conocer el número total de balas en pantalla (el array "balas" se va vaciando cuando estas dejan de ser visibles)
	let municionRestante = 3; // función: conocer la munición restante de la que se dispone (si es 0, no se podrá disparar; se va recargando con el tiempo)
	const NUMENEMIGOS = ENEMIGOSMINIMOS + Math.round(Math.random() * (ENEMIGOSMAXIMOS - ENEMIGOSMINIMOS));
	let enemigosRestantes = NUMENEMIGOS; // esta variable la usamos para evitar provocar fallos buscando en posiciones del array "enemigos" que ya no existen porque hemos borrado algún elemento
	let enemigos = [];
	let vidas = 3;
	let puntuacion = 0; // Se obtiene un punto por cada enemigo superado (es decir, cuando estos abandonan la pantalla por la parte superior o son acertados con un disparo)
	let invencibilidad = false;
	let partidasJugadas = 0;
	let ranking = [];
	let disparar;
	let tiempoHastaProximoDisparo = 0;
	let audioEnemigoAcertado;
	let audioHit;
	let audioDisparo;
	let tituloRanking, h3Ranking, elementoRanking, posicionRanking, elementoSalto;
	let posicionX, posicionY, velocidadEnemigoX, velocidadEnemigoY;


	let x = TOPEDERECHA / 2 - (ANCHOPJ / 2);        // posición inicial x del personaje
	let y = POSICIONPJ;      // posición y del personaje (en principio, invariable)
	let canvas;     // variable que referencia al elemento canvas del html
	let ctx;        // contexto de trabajo
	let idPintar;


	let xDerecha;
	let xIzquierda;
	let ultimaDireccion;


	let posicion = 0;   // Posición del array 0, 1


	let miPersonaje;
	let spritePersonaje; // en principio tendremos en una sola imagen tanto sprites del personaje como de los enemigos. Puede variar más adelante


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


	function Enemigo(x, y, velocidadX, velocidadY) {
		this.x = x;
		this.y = y;
		this.velocidadX = velocidadX;
		this.velocidadY = velocidadY;
	}

	function Bala() {
		this.x = miPersonaje.x + ANCHOPJ / 2;
		this.y = miPersonaje.y + ALTOPJ;
		this.color = "#00ffe1";
		this.ancho = 5;
		this.alto = 15;
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
		invencibilidad = false;
		idQuitarInvencibilidad = setInterval(quitarInvencibilidad, 2000);
		idRegenerarMunicion = setInterval(regenerarMunicion, 2500);
		generarEnemigos();
		enemigosRestantes = NUMENEMIGOS;
		vidas = 3;
		puntuacion = 0;
		miPersonaje.x = TOPEDERECHA / 2 - (ANCHOPJ / 2);
		posicion = 0;
		numBala = -1;
		numBalas = 0;
		municionRestante = 3;
		tiempoHastaProximoDisparo = 0;
		document.getElementById("mensajeInferior").innerHTML = "";
		document.getElementById("ranking").innerHTML = "";
	}


	function quitarInvencibilidad() { // al recibir daño se entra en un estado de invencibilidad temporal que dura 2 segundos. Esta función revierte ese estado

		invencibilidad = false;

	}

	function regenerarMunicion() { // la munición se va regenerando progresivamente para que no se pueda abusar de este recurso durante la partida, ajustando así la dificultad

		if (municionRestante < 3) {
			municionRestante++;
		}

	}


	function pintar() {


		document.getElementById('inicioJuego').style.visibility = 'hidden';


		// borramos el canvas
		ctx.clearRect(0, 0, TOPEDERECHA, TOPEABAJO);


		// pintamos la imagen de fondo
		ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);


		if (xDerecha) {
			miPersonaje.generaPosicionDerecha();
		}


		if (xIzquierda) {
			miPersonaje.generaPosicionIzquierda();
		}


		if (disparar) {

			if (ultimaDireccion == "izquierda") {
				posicion = 3;
			} else if (ultimaDireccion == "derecha") {
				posicion = 4;
			} else {
				posicion = 3; // Si no hemos pulsado ninguna tecla de dirección antes de pulsar el espacio, elegimos simplemente uno de los dos modelos del personaje (en este caso, el que tiene la ballesta a la izquierda).
			}

			if (tiempoHastaProximoDisparo <= 0 && municionRestante > 0) { // comprueba si se puede disparar (se dispone de munición y ha pasado el tiempo suficiente desde el último disparo)
				tiempoHastaProximoDisparo = RETRASODISPARO;
				audioDisparo.play();
				audioDisparo.currentTime = 0;
				numBala++;
				balas[numBala] = new Bala(); //creo un nuevo elemento "bala"
				municionRestante--;

			}

		}

		// fuera del bloque superior porque las balas se tienen que dibujar en pantalla todo el tiempo, independientemente de si se está pulsando el botón de disparar en ese momento o no

		for (let l = 0; l <= numBala; l++) {
			ctx.fillStyle = balas[l].color;
			ctx.fillRect(balas[l].x, balas[l].y, balas[l].ancho, balas[l].alto);
			balas[l].y += VELOCIDADBALA;
			if (balas[l].y > TOPEABAJO) {
				balas.splice(l, 1);
				numBala--;
			}
		}

		// las 2 líneas siguientes solamente son útiles para testeo

		numBalas = numBala + 1;
		console.log("Número de balas en pantalla: " + numBalas);

		tiempoHastaProximoDisparo--;

		// Pintamos al personaje
		ctx.drawImage(miPersonaje.imagen, // Imagen completa con todos los personajes (Sprite)
			miPersonaje.animacionPJ[posicion][0],    // Posicion X del sprite donde se encuentra el comecocos que voy a recortar del sprite para dibujar
			miPersonaje.animacionPJ[posicion][1],     // Posicion Y del sprite donde se encuentra el comecocos que voy a recortar del sprite para dibujar
			miPersonaje.tamañoX,            // Tamaño X del comecocos que voy a recortar para dibujar
			miPersonaje.tamañoY,            // Tamaño Y del comecocos que voy a recortar para dibujar
			miPersonaje.x,                // Posicion x de pantalla donde voy a dibujar el comecocos recortado
			miPersonaje.y,                          // Posicion y de pantalla donde voy a dibujar el comecocos recortado
			miPersonaje.tamañoX,            // Tamaño X del comecocos que voy a dibujar
			miPersonaje.tamañoY);         // Tamaño Y del comecocos que voy a dibujar                    


		// Dibujamos los enemigos y alteramos su posición tanto horizontal como vertical. También se comprueba si estos deben rebotar (tocan alguna de las paredes del canvas) y aumenta lenta y progresivamente la velocidad vertical de todos ellos para darle un incremento de dificultad al juego.
		for (let i = 0; i < enemigosRestantes; i++) {
			ctx.drawImage(spriteEnemigo, enemigos[i].x, enemigos[i].y, ALTOENEMIGO, ANCHOENEMIGO);
			enemigos[i].x += enemigos[i].velocidadX;
			if (enemigos[i].x <= 0) { // toca pared de la izquierda
				enemigos[i].velocidadX = Math.abs(enemigos[i].velocidadX);
			}
			if (enemigos[i].x >= TOPEDERECHA - ANCHOENEMIGO) { // toca pared de la derecha
				enemigos[i].velocidadX = -Math.abs(enemigos[i].velocidadX);
			}
			enemigos[i].y -= enemigos[i].velocidadY;
			enemigos[i].velocidadY += 0.0002; // Incremento de dificultad lento y progresivo. Aunque velocidadY no tiene un límite establecido, la partida acabará cuando dejen de salir enemigos, y en ese punto, la dificultad me parece apropiada.
			if (enemigos[i].y <= 0 - (ALTOENEMIGO + 2)) { // vamos vaciando el array "enemigos" por optimización y por tener una manera de saber cuándo se ha superado el juego. "+ 2" para que no se llegue a ver el último cuadrado en pantalla.
				enemigos.splice(i, 1);
				enemigosRestantes--;
				puntuacion++;
			}


			// Comprobamos si existe colisión entre los enemigos y los disparos
			for (let m = 0; m <= numBala; m++) {
				for (let n = 0; n < enemigosRestantes; n++) {
					if ((balas[m].x + balas[m].ancho) >= enemigos[n].x && balas[m].x <= (enemigos[n].x + ANCHOENEMIGO) && balas[m].y <= (enemigos[n].y + ALTOENEMIGO) && (balas[m].y + balas[m].alto) >= enemigos[n].y) {
						audioEnemigoAcertado.play();
						audioEnemigoAcertado.currentTime = 0;
						balas.splice(m, 1);
						enemigos.splice(n, 1);
						numBala--;
						enemigosRestantes--;
						puntuacion++;
						break;
					}
				}
			}


			if (invencibilidad == false) {
				// lado derecho del PJ es mayor que el lado izquierdo del enemigo, lado izquierdo del PJ es menor que el lado derecho del enemigo, lado superior del PJ es mayor que el lado inferior del enemigo, lado inferior del PJ es menor que el lado superior del enemigo
				// retocado para mayor credibilidad visual a la hora de recibir impactos
				if ((miPersonaje.x + ANCHOPJ) >= enemigos[i].x + 5 && (miPersonaje.x + 8) <= (enemigos[i].x + ANCHOENEMIGO) && miPersonaje.y <= (enemigos[i].y + ALTOENEMIGO) && (miPersonaje.y + ALTOPJ - 3) >= enemigos[i].y) {
					audioHit.play();
					vidas--;
					invencibilidad = true;
				}
			}
		}


		document.getElementById("mensajeSuperior").innerHTML = "Puntuación: " + puntuacion + "</br>Vidas: " + vidas + "</br>Munición: " + municionRestante; // La puntuación aumenta en 1 por cada enemigo superado (es decir, que sale de la pantalla por la parte superior). Como el número de enemigos puede variar en cada intento, al superar el juego se establecerá automáticamente la puntuación máxima (10000).


		if (vidas == 0 || enemigos.length == 0) {
			document.getElementById('inicioJuego').style.visibility = 'visible';


			if (enemigos.length == 0) {
				puntuacion = 10000;
				document.getElementById("mensajeSuperior").innerHTML = "Puntuación: " + puntuacion;
				document.getElementById("mensajeInferior").innerHTML = "¡Enhorabuena! Has completado el juego. Vidas restantes: " + vidas;
			}


			if (vidas == 0) {
				document.getElementById("mensajeInferior").innerHTML = "Fin del juego 💔";
			}


			partidasJugadas++;


			localStorage.setItem(partidasJugadas, puntuacion);


			tituloRanking = document.createTextNode("Ranking");
			h3Ranking = document.createElement("h3");
			h3Ranking.appendChild(tituloRanking);
			document.getElementById("ranking").appendChild(h3Ranking);
			elementoSalto = document.createElement("br");


			for (let j = 1; j <= partidasJugadas; j++) {
				ranking[j - 1] = localStorage.getItem(j);
			}


			ranking.sort(function (a, b) { return b - a });


			for (let k = 1; k <= partidasJugadas; k++) {
				elementoRanking = document.createTextNode(ranking[k - 1] + " puntos");
				posicionRanking = document.createTextNode(k + "ª posición: ");
				document.getElementById("ranking").appendChild(posicionRanking);
				document.getElementById("ranking").appendChild(elementoRanking);
				document.getElementById("ranking").appendChild(elementoSalto.cloneNode());
			}


			clearInterval(idPintar);
			clearInterval(idQuitarInvencibilidad);
			clearInterval(idRegenerarMunicion);


		}
	}

	function activaMovimiento(evt) {


		switch (evt.keyCode) {


			// Left arrow.
			case 37:
				xIzquierda = true;
				posicion = 1;
				ultimaDireccion = "izquierda";
				break;


			// Right arrow.
			case 39:
				xDerecha = true;
				posicion = 2;
				ultimaDireccion = "derecha";
				break;


			// Space bar.
			case 32:
				disparar = true;


			// Enter. Para poder iniciar el juego dándole al Enter (además de con el botón de "Iniciar juego").
			case 13:
				if (vidas == 0 || enemigos.length == 0) {
					iniciarJuego();
				}


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


			// Space bar.
			case 32:
				disparar = false;


		}


	}


	document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);


	// localizamos el canvas
	canvas = document.getElementById("miCanvas");


	// Generamos el contexto de trabajo
	ctx = canvas.getContext("2d");


	spritePersonaje = new Image();
	spritePersonaje.src = "img/SpritePersonaje40.png";
	Personaje.prototype.imagen = spritePersonaje;


	spriteEnemigo = new Image();
	spriteEnemigo.src = "img/enemigoFrame1.png";
	Enemigo.prototype.imagen = spriteEnemigo;


	imagenFondo = new Image();
	imagenFondo.src = "img/fondo.jpg";

	audioEnemigoAcertado = document.getElementById("enemigoAcertado");
	audioHit = document.getElementById("hit");
	audioDisparo = document.getElementById("disparo");


	miPersonaje = new Personaje(x, y);

}


/*
Créditos a los autores de los modelos utilizados en el sprite: "Authors: bluecarrot16, Benjamin K. Smith (BenCreating), Evert, Eliza Wyatt (ElizaWy), TheraHedwig, MuffinElZangano, Durrani, Johannes Sj?lund (wulax), Stephen Challener (Redshrike), Manuel Riecke (MrBeast), Joe White, David Conway Jr. (JaidynReiman), Johannes Sjölund (wulax), Matthew Krohn (makrohn), drjamgo@hotmail.com".
*/
