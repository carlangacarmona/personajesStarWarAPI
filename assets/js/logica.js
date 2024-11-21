// Función para generar URLs de personajes según el rango
function urlsPersonajes(range) {
    const [start, end] = range.split('-').map(Number);
    const urls = [];
    for (let i = start; i <= end; i++) {
        urls.push(`https://swapi.dev/api/people/${i}/`);
    }
    return urls;
}

// Función para obtener datos de un personaje desde la API
async function buscarPersonajes(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error(`Error al obtener datos del personaje: ${url}`);
    }
    return await respuesta.json();
}

// Generador para iterar sobre los personajes en cada sección
async function* generadorPersonaje(urls) {
    for (const url of urls) {
        const personaje = await buscarPersonajes(url);
        yield personaje;
    }
}

// Función para renderizar la tarjeta del personaje con el color heredado
function renderizarPersonaje(personaje, color) {
    const card = document.createElement('div');
    card.className = 'personaje-card';
    card.style.backgroundColor = color; // Aplicar el color heredado

    card.innerHTML = `
        <h5>${personaje.name}</h5>
        <p>Estatura: ${personaje.height} cm</p>
        <p>Peso: ${personaje.mass !== 'unknown' ? personaje.mass + ' kg' : 'unknown'}</p>
    `;
    return card;
}

// Función para mostrar personajes de una sección
async function mostrarPersonajes(range, container, color) {
    const urls = urlsPersonajes(range).slice(0, 5); // Solo los primeros 5 personajes
    const generador = generadorPersonaje(urls);

    for await (const personaje of generador) {
        const card = renderizarPersonaje(personaje, color); // Pasar el color al renderizar
        container.appendChild(card);
        await new Promise(resolve => setTimeout(resolve, 500)); // Espera 2 segundos
    }
}

// Agrega el evento de clic a cada recuadro inicial
document.querySelectorAll('.clickable').forEach(clickable => {
    clickable.addEventListener('click', () => {
        const container = clickable.nextElementSibling;
        if (container.classList.contains('d-none')) {
            container.classList.remove('d-none'); // Muestra el contenedor
            const range = container.dataset.range;
            const color = getComputedStyle(clickable).backgroundColor; // Obtener el color del recuadro principal
            mostrarPersonajes(range, container, color); // Pasar el color al mostrar personajes
        }
    });
});
