// Cargar preguntas y preparar Fuse.js para búsqueda
let preguntas = [];
let fuse;

function ordenarPreguntasAleatoriamente(preguntas) {
  return preguntas.sort(() => Math.random() - 0.5);
}

async function cargarPreguntas() {
  const res = await fetch('preguntas.json');
  preguntas = await res.json();

  preguntas.forEach((p, i) => p.indiceOriginal = i + 1);

  preguntas = ordenarPreguntasAleatoriamente(preguntas);

  fuse = new Fuse(preguntas, {
    keys: ['titulo', 'respuesta', 'tags'],
    threshold: 0.4,
  });

  mostrarPreguntas(preguntas);

  // Esperar un poco más para que el DOM se actualice antes de hacer scroll
  setTimeout(() => {
    scrollSiHayHash();
  }, 1000); // 100 ms es suficiente, puedes probar con menos o más
}




function mostrarPreguntas(lista) {
  const contenedor = document.getElementById('preguntas-container');
  contenedor.innerHTML = '';

  lista.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.id = 'p' + p.indiceOriginal;

    const titulo = document.createElement('h3');
    titulo.className = 'text-lg font-semibold mb-2';
    titulo.textContent = p.titulo;
    div.appendChild(titulo);

    const botonesDiv = document.createElement('div');
    botonesDiv.className = 'mt-2 mb-3 flex flex-wrap gap-2 items-center justify-start';

    const compartirTexto = document.createElement('span');
    compartirTexto.innerHTML = '<strong>Compártelo:</strong>';
    compartirTexto.className = 'text-sm text-gray-700 ml-2';
    botonesDiv.appendChild(compartirTexto);

    // Función para generar texto
    function generarTextoArgumento(p, i) {
      const html = marked.parse(p.respuesta);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const textoLimpio = tempDiv.textContent || tempDiv.innerText || "";
      const url = window.location.href.split('#')[0];
      //const url = window.location.href.split('#')[0] + '#'+ p.indiceOriginal;
      return `🛑 ${p.titulo}\n${textoLimpio}\n📺 Video ilustrativo:\n${p.video}\n\n📘 Respuestas a las mentiras sobre Israel:\n ${url}`;
    }

    // Compartir botones
    const redes = [
      {
        clase: 'bg-green-500 hover:bg-green-600',
        icono: 'fab fa-whatsapp',
        url: (texto) => `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`
      },
      {
        clase: 'bg-sky-500 hover:bg-sky-600',
        icono: 'fab fa-telegram-plane',
        url: (texto) => {
          const url = window.location.href.split('#')[0];
          return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`;
        }
      },
      {
        clase: 'bg-gray-600 hover:bg-gray-700',
        icono: 'fab fa-twitter',
        url: (texto) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`
      },
      {
        clase: 'bg-blue-600 hover:bg-blue-700',
        icono: 'fab fa-facebook-messenger',
        url: (texto) => {
          // const url = window.location.href;
          const url = window.location.href.split('#')[0] + '#' + p.indiceOriginal;
          return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=TU_APP_ID&redirect_uri=${encodeURIComponent(url)}`;
        }
      },
      {
        clase: 'bg-blue-700 hover:bg-blue-800',
        icono: 'fab fa-facebook-f',
        url: () => {
          // const url = window.location.href.split('#')[0];
          const url = window.location.href.split('#')[0] + '#' + p.indiceOriginal;
          return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        }
      }
    ];

    redes.forEach(r => {
      const btn = document.createElement('button');
      btn.innerHTML = `<i class="${r.icono}"></i>`;
      btn.className = `${r.clase} text-white px-2 py-1 rounded inline-flex items-center justify-center text-sm`;
      btn.onclick = () => window.open(r.url(generarTextoArgumento(p, i)), '_blank');
      botonesDiv.appendChild(btn);
    });

    div.appendChild(botonesDiv);

    if (p.video) {
      const videoWrapper = document.createElement('div');
      videoWrapper.className = 'mt-2 flex items-center justify-center gap-4';


      const videoId = obtenerIdYoutube(p.video);
      
      if (videoId) {
        const shortUrl = `https://youtu.be/${videoId}`;
        const link = document.createElement('a');
        //link.href = shortUrl;
        link.href = p.video;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const contenedorMiniatura = document.createElement('div');
        contenedorMiniatura.className = 'relative w-[280px] h-[158px] cursor-pointer';

        const thumb = document.createElement('img');
        thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        thumb.alt = 'Miniatura del video';
        thumb.className = 'w-full h-full object-cover rounded shadow';

        const iconoPlay = document.createElement('div');
        iconoPlay.className = `
          absolute inset-0 flex items-center justify-center pointer-events-none
        `;
        iconoPlay.innerHTML = `
          <div class="bg-black/60 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
            <i class="fas fa-play text-xl"></i>
          </div>
        `;


        contenedorMiniatura.appendChild(thumb);
        contenedorMiniatura.appendChild(iconoPlay);

        link.appendChild(contenedorMiniatura);

        videoWrapper.appendChild(link);
      } else {
        const videoLink = document.createElement('a');
        videoLink.href = p.video;
        videoLink.target = '_blank';
        videoLink.textContent = '📺 Ver video';
        videoLink.className = 'text-blue-600 hover:underline';
        videoWrapper.appendChild(videoLink);
      }

      // Crear botón copiar junto a la miniatura
      const copiarTodoBtn = document.createElement('button');
      copiarTodoBtn.textContent = '📋 Copiar';
      copiarTodoBtn.className = 'bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm whitespace-nowrap';
      copiarTodoBtn.onclick = () => {
        const texto = generarTextoArgumento(p, i);
        navigator.clipboard.writeText(texto);
        alert('¡Listo! Ahora puedes pegar el argumento en cualquier destino y difundir la verdad');
      };
      videoWrapper.appendChild(copiarTodoBtn);

      div.appendChild(videoWrapper);
}


    // Respuesta en markdown
    const resp = document.createElement('p');
    resp.className = 'mt-3';
    resp.innerHTML = marked.parse(p.respuesta);
    div.appendChild(resp);

    contenedor.appendChild(div);
  });
}

function scrollSiHayHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#')) {
    const id = hash.substring(1);
    const el = document.getElementById('p' + id);
    if (el) {
      // Scroll al elemento
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Luego ajustamos un poco el scroll hacia arriba para que se vea el título
      // Esperamos que el scrollIntoView termine con un pequeño timeout
      setTimeout(() => {
        window.scrollBy({ top: -50, behavior: 'smooth' }); // ajusta -50 según necesites
      }, 300);

      // Resaltar brevemente el elemento
      el.classList.add('ring', 'ring-yellow-400', 'ring-4');
      setTimeout(() => {
        el.classList.remove('ring', 'ring-yellow-400', 'ring-4');
      }, 3000);
    }
  }
}



function obtenerIdYoutube(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\s&]+)/);
  return match ? match[1] : null;
}

// Buscador
document.getElementById('busqueda').addEventListener('input', e => {
  const texto = e.target.value.trim();
  if (texto.length > 1) {
    const resultados = fuse.search(texto).map(res => res.item);
    mostrarPreguntas(resultados);
  } else {
    mostrarPreguntas(preguntas);
  }
});

// Iniciar
cargarPreguntas();
