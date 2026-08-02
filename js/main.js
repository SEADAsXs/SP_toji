function dateTime() {
	const date = new Date();

	// Formatear la fecha en español (ej: Domingo, 02 de Agosto de 2026)
	const options = {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	};

	let today = date.toLocaleDateString('es-ES', options);

	// Capitalizar la primera letra del día
	today = today.charAt(0).toUpperCase() + today.slice(1);

	let time = date.toLocaleTimeString();

	document.getElementById('date-time').innerHTML =
		'<p id="date">' + today + '</p><p id="time">' + time + '</p>';

	setTimeout(dateTime, 1000);
}

// Clima por geolocalización + idioma español (&lang=es)
function weatherBalloon(cityID) {
	var apiKey = '1affa4b37d737510a545f7d594da08bb';

	function fetchWeather(url) {
		fetch(url)
			.then(resp => resp.json())
			.then(data => {
				let weatherIcon = data.weather[0].icon;
				let tempK = parseFloat(data.main.temp);
				let tempC = Math.round(tempK - 273.15);
				let tempF = Math.round((tempK - 273.15) * 1.8) + 32;

				// Descripción en español dada por la API
				let description = data.weather[0].description;

				document.getElementById('weather').innerHTML =
					'<p id="location">' + data.name + '</p>' +
					'<p id="details" title="' + tempF + '&deg;F">' +
					'<img src="https://openweathermap.org/img/wn/' + weatherIcon + '.png" alt="clima">' +
					description + ' <span class="separator">|</span> ' + tempC + '&deg;C</p>';
			})
			.catch(err => console.error("Error al obtener clima:", err));
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;
				// Agregado &lang=es
				fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=es`);
			},
			() => {
				// Respaldo en caso de denegar ubicación + &lang=es
				fetchWeather(`https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${apiKey}&lang=es`);
			}
		);
	} else {
		fetchWeather(`https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${apiKey}&lang=es`);
	}
}

// Efecto Pixel Art animado al cargar la imagen
function initPixelEffect() {
	const img = document.getElementById('toji-img');
	if (!img) return;

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const parent = img.parentElement;

	const imageObj = new Image();
	imageObj.crossOrigin = "Anonymous";
	imageObj.src = img.src;

	imageObj.onload = function () {
		try {
			const width = imageObj.naturalWidth || 300;
			const height = imageObj.naturalHeight || 300;
			canvas.width = width;
			canvas.height = height;
			canvas.className = "pixel-canvas";

			ctx.drawImage(imageObj, 0, 0, 1, 1);
			ctx.getImageData(0, 0, 1, 1);

			parent.replaceChild(canvas, img);

			let pixelFactor = 0.01; // Comienza bastante pixelado

			function drawPixelated() {
				ctx.imageSmoothingEnabled = false;

				const w = Math.max(1, Math.floor(width * pixelFactor));
				const h = Math.max(1, Math.floor(height * pixelFactor));

				ctx.drawImage(imageObj, 0, 0, w, h);
				ctx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);

				if (pixelFactor < 1) {
					// Incremento más lento para extender la animación (~2.5s)
					pixelFactor += 0.006;
					requestAnimationFrame(drawPixelated);
				} else {
					ctx.imageSmoothingEnabled = true;
					ctx.drawImage(imageObj, 0, 0, width, height);
				}
			}

			drawPixelated();
		} catch (e) {
			console.warn("Canvas bloqueado por CORS. Mostrando imagen standard.", e);
			img.style.display = "block";
		}
	};

	imageObj.onerror = function () {
		console.error("No se pudo cargar la imagen:", img.src);
	};
}

function traichu() {
	dateTime();
	weatherBalloon(3427406); // ID por defecto
	initPixelEffect();
}