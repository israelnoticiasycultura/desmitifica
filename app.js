// Cargar preguntas y preparar Fuse.js para búsqueda
let preguntas = [];
let fuse;

// Función para ordenar aleatoriamente el array de preguntas
function ordenarPreguntasAleatoriamente(preguntas) {
  return preguntas.sort(() => Math.random() - 0.5);
}

async function cargarPreguntas() {
  const res = await fetch('preguntas.json');
  preguntas = await res.json();

  // Ordenar las preguntas de forma aleatoria
  preguntas = ordenarPreguntasAleatoriamente(preguntas);
  
  fuse = new Fuse(preguntas, {
    keys: ['titulo', 'respuesta', 'tags'],
    threshold: 0.4,
  });

  mostrarPreguntas(preguntas);
}

function mostrarPreguntas(lista) {
  const contenedor = document.getElementById('preguntas-container');
  contenedor.innerHTML = '';

  lista.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';

    const titulo = document.createElement('h3');
    titulo.className = 'text-lg font-semibold mb-2';
    titulo.textContent = p.titulo;
    div.appendChild(titulo);

    const resp = document.createElement('p');
    resp.className = 'mb-2';
    resp.textContent = p.respuesta;
    resp.innerHTML = marked.parse(p.respuesta);
    div.appendChild(resp);

    // Contenedor botones compartir y copiar link
const botonesDiv = document.createElement('div');
botonesDiv.className = 'mt-3 space-x-3';


function generarTextoArgumento(p, i) {
  const html = marked.parse(p.respuesta);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const textoLimpio = tempDiv.textContent || tempDiv.innerText || "";

  const url = window.location.href.split('#')[0];
  //return `🛑 ${p.titulo}\n${textoLimpio}\n📺 Video ilustrativo:\n${p.video}\n\n🔗Directorio de preguntas:\n ${url}#p${i}`;
  return `🛑 ${p.titulo}\n${textoLimpio}\n📺 Video ilustrativo:\n${p.video}\n\n🔗Directorio de preguntas:\n ${url}`;
}


// Si hay video, mostrar enlace y botón "Copiar todo"
// if (p.video) {
//   const videoWrapper = document.createElement('div');
//   videoWrapper.className = 'flex items-center gap-3 mt-2'; // Alinea elementos en fila y agrega espacio entre ellos

//   const videoLink = document.createElement('a');
//   videoLink.href = p.video;
//   videoLink.target = '_blank';
//   videoLink.textContent = '📺 Ver video';
//   videoLink.className = 'text-blue-600 hover:underline';

//   // Crear botón "Copiar todo"
//   const copiarTodoBtn = document.createElement('button');
//   copiarTodoBtn.textContent = '📋 Copiar argumento';
//   copiarTodoBtn.className = 'bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700';


//   copiarTodoBtn.onclick = () => {
//     const texto = generarTextoArgumento(p, i);
//     navigator.clipboard.writeText(texto);
//     alert('¡Listo! Ahora puedes pegar el argumento en cualquier destino y difundir la verdad');
//   };

//   // Crear un contenedor para los botones
//   const botonesContainer = document.createElement('div');
//   botonesContainer.className = 'flex space-x-2'; // "flex" para alinearlos horizontalmente, "space-x-2" para el espacio entre ellos
//   // botonesContainer.appendChild(copyBtn);
//   botonesContainer.appendChild(copiarTodoBtn);

//   // Añadir el enlace y los botones al contenedor
//   videoWrapper.appendChild(videoLink);
//   videoWrapper.appendChild(botonesContainer);

//   // Agregar todo al contenedor principal
//   div.appendChild(videoWrapper);
// }

// Extraer ID del video de YouTube
function obtenerIdYoutube(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\s&]+)/);
  return match ? match[1] : null;
}

if (p.video) {
  const videoWrapper = document.createElement('div');
  // videoWrapper.className = 'flex items-center gap-3 mt-2';
  videoWrapper.className = 'flex items-center gap-2 mt-2 flex-wrap';


  // Reemplazar por este nuevo bloque:
  const videoId = obtenerIdYoutube(p.video);
  if (videoId) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.width = '200';
    iframe.height = '113';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    videoWrapper.appendChild(iframe);
  } else {
    const videoLink = document.createElement('a');
    videoLink.href = p.video;
    videoLink.target = '_blank';
    videoLink.textContent = '📺 Ver video';
    videoLink.className = 'text-blue-600 hover:underline';
    videoWrapper.appendChild(videoLink);
  }

  // Botón copiar argumento (como ya tienes)
  const copiarTodoBtn = document.createElement('button');
  copiarTodoBtn.textContent = '📋 Copiar argumento';
  // copiarTodoBtn.className = 'bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700';
  copiarTodoBtn.className = 'bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm';

  copiarTodoBtn.onclick = () => {
    const texto = generarTextoArgumento(p, i);
    navigator.clipboard.writeText(texto);
    alert('¡Listo! Ahora puedes pegar el argumento en cualquier destino y difundir la verdad');
  };

  const botonesContainer = document.createElement('div');
  botonesContainer.className = 'flex space-x-2';
  botonesContainer.appendChild(copiarTodoBtn);
  videoWrapper.appendChild(botonesContainer);

  div.appendChild(videoWrapper);
}



    // Contenedor botones compartir y copiar link
    //const botonesDiv = document.createElement('div');
    // botonesDiv.className = 'mt-3 space-x-3 flex items-center justify-start';
    botonesDiv.className = 'mt-3 flex gap-2 items-center justify-start overflow-x-auto no-scrollbar';

    const compartirTexto = document.createElement('p');
    compartirTexto.textContent = 'Compártelo en tus redes:';
    compartirTexto.className = 'font-semibold mt-4 mb-2 text-gray-700';
    div.appendChild(compartirTexto);

  const waBtn = document.createElement('button');
  waBtn.innerHTML = `
    <i class="fab fa-whatsapp" style="margin-right: 8px;"></i> <strong>WhatsApp</strong>
  `;
  waBtn.className = 'bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 inline-flex items-center';
  waBtn.onclick = () => {
    const url = window.location.href.split('#')[0] ;
    //const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
    const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(generarTextoArgumento(p, i))}`;
    window.open(waShare, '_blank');
  };
  botonesDiv.appendChild(waBtn);

  const tgBtn = document.createElement('button');
  tgBtn.innerHTML = `
    <i class="fab fa-telegram-plane" style="margin-right: 8px;"></i> <strong>Telegram</strong>
  `;
  tgBtn.className = 'bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 inline-flex items-center';
  tgBtn.onclick = () => {
    const url = window.location.href.split('#')[0];
    //const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
    //const tgShare = `https://t.me/share/url?text=${encodeURIComponent(generarTextoArgumento(p, i))}`;

    const texto = generarTextoArgumento(p, i);

    const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`;


    window.open(tgShare, '_blank');
  };
  botonesDiv.appendChild(tgBtn);

  const twBtn = document.createElement('button');
  twBtn.innerHTML = `
    <i class="fab fa-twitter" style="margin-right: 8px;"></i> <strong>X</strong>
  `;
  twBtn.className = 'bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 inline-flex items-center'; // Fondo gris y texto blanco
  twBtn.onclick = () => {
    const url = window.location.href.split('#')[0];
    //const twShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    const twShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generarTextoArgumento(p, i))}`;
    window.open(twShare, '_blank');
  };
  botonesDiv.appendChild(twBtn);

  const msBtn = document.createElement('button');
  msBtn.innerHTML = `
    <i class="fab fa-facebook-messenger" style="margin-right: 8px;"></i> <strong>Messenger</strong>
  `;
  msBtn.className = 'bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 inline-flex items-center';
  msBtn.onclick = () => {
    const url = window.location.href.split('#')[0];
    const texto = generarTextoArgumento(p, i);
    // const msShare = `fb-messenger://share?link=${encodeURIComponent(url)}`;
    const msShare = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=TU_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`;
    //const msShare = `https://www.facebook.com/dialog/send?app_id=TU_APP_ID&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(url)}`;
    window.open(msShare, '_blank');
  };
  botonesDiv.appendChild(msBtn);

  const fbBtn = document.createElement('button');
  fbBtn.innerHTML = `
      <i class="fab fa-facebook-f" style="margin-right: 8px;"></i> <strong>Facebook</strong>
    `;
  fbBtn.className = 'bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800 inline-flex items-center';
  fbBtn.onclick = () => {
    const url = window.location.href.split('#')[0];
    const texto = generarTextoArgumento(p, i);
    const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    //const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(texto)}`;
    window.open(fbShare, '_blank', 'width=600,height=400');
  };
  botonesDiv.appendChild(fbBtn);

div.appendChild(botonesDiv);

  // Añadir ancla para poder linkear directamente
  div.id = 'p' + i;

  contenedor.appendChild(div);
  });
}

// Buscador en tiempo real
document.getElementById('busqueda').addEventListener('input', e => {
  const texto = e.target.value.trim();
  if (texto.length > 1) {
    const resultados = fuse.search(texto).map(res => res.item);
    mostrarPreguntas(resultados);
  } else {
    mostrarPreguntas(preguntas);
  }
});

// Carga inicial
cargarPreguntas();
