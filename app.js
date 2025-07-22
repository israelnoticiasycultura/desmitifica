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

// Si hay video, mostrar enlace y botón "Copiar todo"
if (p.video) {
  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'flex items-center gap-3 mt-2'; // Alinea elementos en fila y agrega espacio entre ellos

  const videoLink = document.createElement('a');
  videoLink.href = p.video;
  videoLink.target = '_blank';
  videoLink.textContent = '📺 Ver video';
  videoLink.className = 'text-blue-600 hover:underline';

  // Crear botón "Copiar todo"
  const copiarTodoBtn = document.createElement('button');
  copiarTodoBtn.textContent = '📋 Copiar argumento';
  copiarTodoBtn.className = 'bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700';
  copiarTodoBtn.onclick = () => {
    // Convierte Markdown a HTML
    const html = marked.parse(p.respuesta);

    // Crea un elemento temporal para extraer solo texto sin etiquetas
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Obtén solo el texto plano, sin etiquetas ni símbolos markdown
    const textoLimpio = tempDiv.textContent || tempDiv.innerText || "";

    const url = window.location.href.split('#')[0] + '#p' + i;
    const texto = `❓ ${p.titulo}\n${textoLimpio}\n📺 Video ilustrativo: ${p.video}\n\n🔗Enlace al directorio de preguntas:\n ${url}`;
    navigator.clipboard.writeText(texto);
    alert('¡Listo! Ahora puedes pegar la pregunta, respuesta y enlaces de utilidad en cualquier destino y difundir la verdad');
  };

  // // Crear botón "Copiar enlace"
  // const copyBtn = document.createElement('button');
  // copyBtn.innerHTML = '🔗 <strong>Copiar enlace</strong>';
  // copyBtn.className = 'bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600';
  // copyBtn.onclick = () => {
  //   const url = window.location.href.split('#')[0] + '#p' + i;
  //   navigator.clipboard.writeText(url);
  //   alert('¡Listo! Ahora puedes pegar el enlace en tus redes y difundir la verdad.');
  // };

  // Crear un contenedor para los botones
  const botonesContainer = document.createElement('div');
  botonesContainer.className = 'flex space-x-2'; // "flex" para alinearlos horizontalmente, "space-x-2" para el espacio entre ellos
  // botonesContainer.appendChild(copyBtn);
  botonesContainer.appendChild(copiarTodoBtn);

  // Añadir el enlace y los botones al contenedor
  videoWrapper.appendChild(videoLink);
  videoWrapper.appendChild(botonesContainer);

  // Agregar todo al contenedor principal
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

    const fbBtn = document.createElement('button');
    fbBtn.innerHTML = `
      <i class="fab fa-facebook-f" style="margin-right: 8px;"></i> <strong>Facebook</strong>
    `;
    fbBtn.className = 'bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800 inline-flex items-center';
    fbBtn.onclick = () => {
      const url = window.location.href.split('#')[0] + '#p' + i;
      const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbShare, '_blank', 'width=600,height=400');
    };
    botonesDiv.appendChild(fbBtn);

  const waBtn = document.createElement('button');
  waBtn.innerHTML = `
    <i class="fab fa-whatsapp" style="margin-right: 8px;"></i> <strong>WhatsApp</strong>
  `;
  waBtn.className = 'bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 inline-flex items-center';
  waBtn.onclick = () => {
    const url = window.location.href.split('#')[0] + '#p' + i;
    const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
    window.open(waShare, '_blank');
  };
  botonesDiv.appendChild(waBtn);

  const tgBtn = document.createElement('button');
  tgBtn.innerHTML = `
    <i class="fab fa-telegram-plane" style="margin-right: 8px;"></i> <strong>Telegram</strong>
  `;
  tgBtn.className = 'bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 inline-flex items-center';
  tgBtn.onclick = () => {
    const url = window.location.href.split('#')[0] + '#p' + i;
    const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
    window.open(tgShare, '_blank');
  };
  botonesDiv.appendChild(tgBtn);

  const msBtn = document.createElement('button');
  msBtn.innerHTML = `
    <i class="fab fa-facebook-messenger" style="margin-right: 8px;"></i> <strong>Messenger</strong>
  `;
  msBtn.className = 'bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 inline-flex items-center';
  msBtn.onclick = () => {
    const url = window.location.href.split('#')[0] + '#p' + i;
    const msShare = `fb-messenger://share?link=${encodeURIComponent(url)}`;
    window.open(msShare, '_blank');
  };
  botonesDiv.appendChild(msBtn);

  const twBtn = document.createElement('button');
  twBtn.innerHTML = `
    <i class="fab fa-twitter" style="margin-right: 8px;"></i> <strong>X</strong>
  `;
  twBtn.className = 'bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 inline-flex items-center'; // Fondo gris y texto blanco
  twBtn.onclick = () => {
    const url = window.location.href.split('#')[0] + '#p' + i;
    const twShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(twShare, '_blank');
  };
  botonesDiv.appendChild(twBtn);

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
