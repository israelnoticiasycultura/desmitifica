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
    botonesDiv.className = 'mt-3 space-x-3 flex items-center justify-start';

    const compartirTexto = document.createElement('p');
    compartirTexto.textContent = 'Compártelo en tus redes:';
    compartirTexto.className = 'font-semibold mt-4 mb-2 text-gray-700';
    div.appendChild(compartirTexto);

    // const fbBtn = document.createElement('button');
    // fbBtn.innerHTML = `
    //   <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
    //     <path d="M22.675 0H1.325C.594 0 0 .594 0 1.325v21.351C0 23.406.594 24 1.325 24h11.497v-9.284H9.746V12h3.076V9.285c0-3.075 1.829-4.755 4.552-4.755 1.325 0 2.687.099 3.019.146v3.517l-2.04.001c-1.602 0-1.922.758-1.922 1.847v2.412h3.844l-.498 3.765h-3.346V24h6.56c.73 0 1.325-.594 1.325-1.325V1.325C24 .594 23.406 0 22.675 0z"/>
    //   </svg>
    //   <strong>Facebook</strong>
    // `.replace(/\n/g, '').replace(/\r/g, '').trim();

    // fbBtn.className = 'bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800 inline-flex items-center';
    // fbBtn.onclick = () => {
    //   const url = window.location.href.split('#')[0] + '#p' + i;
    //   const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    //   window.open(fbShare, '_blank', 'width=600,height=400');
    // };
    //botonesDiv.appendChild(fbBtn);
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


  // const waBtn = document.createElement('button');
  // waBtn.innerHTML = `
  //   <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
  //     <path d="M20.52 3.48A11.73 11.73 0 0 0 12.07.25 11.85 11.85 0 0 0 .22 12a11.74 11.74 0 0 0 1.59 5.84L0 24l6.4-1.67a11.76 11.76 0 0 0 5.67 1.45h.05a11.87 11.87 0 0 0 8.4-20.3Z"/>
  //   </svg>
  //   <strong>WhatsApp</strong>
  // `.replace(/\n/g, '').replace(/\r/g, '').trim();

  // waBtn.className = 'bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 inline-flex items-center';
  // waBtn.onclick = () => {
  //   const url = window.location.href.split('#')[0] + '#p' + i;
  //   const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
  //   window.open(waShare, '_blank');
  // };
  // botonesDiv.appendChild(waBtn);
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



  // Telegram
  // const tgBtn = document.createElement('button');
  // tgBtn.innerHTML = '🚀 <strong>Telegram</strong>';
  // tgBtn.className = 'bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600';
  // tgBtn.onclick = () => {
  //   const url = window.location.href.split('#')[0] + '#p' + i;
  //   const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
  //   window.open(tgShare, '_blank');
  // };
  // botonesDiv.appendChild(tgBtn);

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



  // Twitter
  // const twBtn = document.createElement('button');
  // twBtn.innerHTML = '🐦 <strong>X</strong>';
  // twBtn.className = 'bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500';
  // twBtn.onclick = () => {
  //   const url = window.location.href.split('#')[0] + '#p' + i;
  //   const twShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
  //   window.open(twShare, '_blank');
  // };
  // botonesDiv.appendChild(twBtn);
  const twBtn = document.createElement('button');
  twBtn.innerHTML = `
    <i class="fab fa-twitter" style="margin-right: 8px;"></i> <strong>Twitter</strong>
  `;
  twBtn.className = 'bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500 inline-flex items-center';
  twBtn.onclick = () => {
    const url = window.location.href.split('#')[0] + '#p' + i;
    const twShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(twShare, '_blank');
  };
  botonesDiv.appendChild(twBtn);


  // Messenger
  // const msBtn = document.createElement('button');
  // msBtn.innerHTML = '💬 <strong>Messenger</strong>';
  // msBtn.className = 'bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700';
  // msBtn.onclick = () => {
  //   const url = window.location.href.split('#')[0] + '#p' + i;
  //   const msShare = `fb-messenger://share?link=${encodeURIComponent(url)}`;
  //   window.open(msShare, '_blank');
  // };
  // botonesDiv.appendChild(msBtn);
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
