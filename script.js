// ESTADO GLOBAL DE LA APLICACIÓN
let currentMech = 'agua';
let mechSpeed = 40;
let scenFlow = 80;
let highlightedPart = null;

let animMechId;
let animScenId;

// CAMBIO DE PESTAÑAS Y NAVEGACIÓN INTERACTIVA
function switchTab(tabId, btnElement) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  btnElement.classList.add('active');

  if (tabId === 'tab-mecanismos') startMechCanvas();
  if (tabId === 'tab-escenario') startScenCanvas();
  if (tabId === 'tab-simulador') calculateImpact();
}

// ====================================================
// MÓDULO 1: MECANISMOS DINÁMICOS Y ANIMACIÓN
// ====================================================
function selectMechanism(type, cardEl) {
  currentMech = type;
  document.querySelectorAll('.resource-card').forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');

  const title = document.getElementById('mechTitle');
  if (type === 'agua') title.innerText = "Central Hidroeléctrica: Agua -> Energía Mecánica -> Eléctrica";
  if (type === 'aire') title.innerText = "Parque Eólico: Fuerza del Viento -> Rotación de Aspas";
  if (type === 'luz') title.innerText = "Paneles Solares Fotovoltaicos: Radiación -> Electrones";
}

function changeMechSpeed(val) {
  mechSpeed = parseInt(val);
  document.getElementById('mechSpeedVal').innerText = val + "% Intensidad";
}

function startMechCanvas() {
  cancelAnimationFrame(animMechId);
  const canvas = document.getElementById('canvasMech');
  const ctx = canvas.getContext('2d');
  let angle = 0;
  let particles = Array.from({length: 25}, () => ({x: Math.random()*250, y: 180 + Math.random()*40}));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentMech === 'agua') {
      // Embalse y Tuberías a Presión
      ctx.fillStyle = "#16387c";
      ctx.fillRect(40, 60, 180, 160);
      ctx.fillStyle = "#00d2ff";
      ctx.fillRect(40, 80, 180, 140); // Agua en embalse

      // Tubería forzada
      ctx.fillStyle = "#7f8c8d";
      ctx.fillRect(220, 180, 180, 40);

      // Partículas de agua corriendo por la tubería
      ctx.fillStyle = "#e0f7fa";
      particles.forEach(p => {
        p.x += mechSpeed * 0.1;
        if (p.x > 400) p.x = 220;
        ctx.fillRect(p.x, p.y, 10, 6);
      });

      // Turbina Pelton Giratoria
      ctx.save();
      ctx.translate(450, 200);
      angle += mechSpeed * 0.05;
      ctx.rotate(angle);
      ctx.fillStyle = "#f39c12";
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-6, -45, 12, 45);
        ctx.beginPath(); ctx.arc(0, -45, 10, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();

      // Generador Iluminado
      ctx.fillStyle = "#f1c40f";
      let blur = (mechSpeed / 100) * 35;
      ctx.shadowColor = '#f1c40f';
      ctx.shadowBlur = blur;
      ctx.beginPath(); ctx.arc(680, 200, 35, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

    } else if (currentMech === 'aire') {
      // Poste de Aerogenerador
      ctx.fillStyle = "#ecf0f1";
      ctx.fillRect(395, 140, 10, 200);

      // Palas Giratorias
      ctx.save();
      ctx.translate(400, 140);
      angle += mechSpeed * 0.06;
      ctx.rotate(angle);
      ctx.fillStyle = "#00d2ff";
      for(let i=0; i<3; i++) {
        ctx.rotate((2*Math.PI)/3);
        ctx.fillRect(-8, -110, 16, 110);
      }
      ctx.restore();

    } else {
      // Panel Solar
      ctx.fillStyle = "#1b4f72";
      ctx.fillRect(250, 220, 300, 100);
      ctx.strokeStyle = "#00d2ff";
      ctx.lineWidth = 2;
      for(let x=250; x<=550; x+=40) {
        ctx.beginPath(); ctx.moveTo(x, 220); ctx.lineTo(x, 320); ctx.stroke();
      }

      // Rayos de Sol / Fotones
      ctx.fillStyle = "#f1c40f";
      particles.forEach(p => {
        p.y += mechSpeed * 0.08;
        if (p.y > 220) p.y = 50;
        ctx.beginPath(); ctx.arc(p.x + 200, p.y, 5, 0, Math.PI*2); ctx.fill();
      });
    }

    animMechId = requestAnimationFrame(draw);
  }
  draw();
}

// ====================================================
// MÓDULO 2: ESCENARIO VIVO DE COCA CODO SINCLAIR
// ====================================================
function changeScenFlow(val) {
  scenFlow = parseInt(val);
  document.getElementById('scenFlowVal').innerText = val + "% Caudal";

  const dashCaudal = document.getElementById('dashCaudal');
  const dashMW = document.getElementById('dashMW');
  const dashCity = document.getElementById('dashCity');

  let mwCalculado = ((1500 * scenFlow) / 100).toFixed(0);
  dashMW.innerText = mwCalculado + " MW";

  if (scenFlow < 30) {
    dashCaudal.innerText = "Crítico / En Riego ⚠️";
    dashCity.innerText = "Apagones Parciales 🌑";
  } else if (scenFlow < 70) {
    dashCaudal.innerText = "Moderado / Alerta 🟡";
    dashCity.innerText = "Operación Normal 💡";
  } else {
    dashCaudal.innerText = "Óptimo (100%) 🟢";
    dashCity.innerText = "Totalmente Iluminado 💡✨";
  }
}

function highlightPOI(poi) {
  highlightedPart = poi;
  let title = "", desc = "";

  if (poi === 'captacion') {
    title = "Obras de Captación del Río Coca";
    desc = "Ubicadas entre Napo y Sucumbíos. Recogen el agua de los ríos Quijos y Salado, desviándola al desarenador antes de ingresar al túnel.";
  } else if (poi === 'tunel') {
    title = "Túnel de Conducción (24.83 km)";
    desc = "Transporta el agua limpia a través de las montañas hasta el embalse compensador aprovechando una caída o desnivel de 620 metros.";
  } else if (poi === 'maquinas') {
    title = "Casa de Máquinas Subterránea";
    desc = "Alberga 8 turbinas Pelton de 187.5 MW cada una, sumando una capacidad total instalada de 1,500 MW de energía limpia.";
  } else if (poi === 'poblado') {
    title = "Red de Distribución y Ciudades";
    desc = "La energía generada eleva su voltaje en transformadores para integrarse al Sistema Interconectado Nacional del Ecuador.";
  }

  openModalContent(title, desc);
}

function startScenCanvas() {
  cancelAnimationFrame(animScenId);
  const canvas = document.getElementById('canvasScen');
  const ctx = canvas.getContext('2d');
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Montañas de la Amazonía
    ctx.fillStyle = "#1e4d2b";
    ctx.beginPath(); ctx.moveTo(0, 280); ctx.lineTo(250, 100); ctx.lineTo(500, 280); ctx.fill();
    ctx.beginPath(); ctx.moveTo(350, 280); ctx.lineTo(600, 80); ctx.lineTo(850, 280); ctx.fill();

    // Río Coca en Movimiento
    ctx.fillStyle = "#00d2ff";
    ctx.beginPath();
    ctx.moveTo(0, 300);
    for(let x=0; x<=canvas.width; x+=30) {
      ctx.lineTo(x, 300 + Math.sin((x + frame * (scenFlow/15)) * 0.04) * 10);
    }
    ctx.lineTo(canvas.width, 420); ctx.lineTo(0, 420); ctx.fill();

    // Obras de Captación
    ctx.fillStyle = highlightedPart === 'captacion' ? '#00d2ff' : '#7f8c8d';
    ctx.fillRect(150, 260, 60, 50);

    // Túnel
    ctx.strokeStyle = highlightedPart === 'tunel' ? '#00d2ff' : '#bdc3c7';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(210, 285); ctx.lineTo(500, 285); ctx.stroke();

    // Casa de Máquinas
    ctx.fillStyle = highlightedPart === 'maquinas' ? '#00d2ff' : '#34495e';
    ctx.fillRect(500, 240, 90, 80);

    // Poblado / Luces
    let lightsOn = scenFlow > 30;
    ctx.fillStyle = lightsOn ? '#f1c40f' : '#7f8c8d';
    ctx.fillRect(720, 230, 20, 40);
    ctx.fillRect(750, 210, 25, 60);

    animScenId = requestAnimationFrame(draw);
  }
  draw();
}

// ====================================================
// MÓDULO 3: SIMULADOR DE IMPACTO BIOLÓGICO
// ====================================================
function calculateImpact() {
  const tipo = document.getElementById('simTipo').value;
  const region = document.getElementById('simRegion').value;
  const area = parseInt(document.getElementById('simArea').value);
  const abandono = parseInt(document.getElementById('simAbandono').value);

  document.getElementById('areaVal').innerText = area + " ha";

  // Cálculo Energético kWh
  let factor = tipo === 'hidro' ? 140000 : (tipo === 'eolica' ? 90000 : 65000);
  let kwhTotal = area * factor;
  if (abandono > 0) kwhTotal = 0; // Si está abandonada no genera

  // Cálculo de Biodiversidad (Índice de Shannon H')
  let habitatAlterado = area * (tipo === 'hidro' ? 1.6 : (tipo === 'solar' ? 1.1 : 0.5));
  let shannon = Math.max(0.4, 3.8 - (habitatAlterado * 0.003));

  if (abandono > 0) {
    shannon += (abandono * 0.045);
  }

  document.getElementById('resKwh').innerText = Math.round(kwhTotal).toLocaleString() + " kWh";
  document.getElementById('resHabitat').innerText = habitatAlterado.toFixed(1) + " ha";
  document.getElementById('resShannon').innerText = shannon.toFixed(2);

  // Carga de Especies en Riesgo según Documento
  const speciesList = document.getElementById('speciesList');
  speciesList.innerHTML = "";

  let especies = [];
  if (region === 'amazonia') {
    especies = [
      "Rana de Cristal (Centrolenidae)",
      "Anfibios Endémicos de Bosque Montano",
      "Peces de Agua Dulce (Migración alterada)",
      "Delfines de Río (Aislamiento poblacional)"
    ];
  } else if (region === 'sierra') {
    especies = ["Cóndor Andino", "Oso de Anteojos", "Preñadilla de Río"];
  } else if (region === 'costa') {
    especies = ["Mono Aullador de la Costa", "Concha Prieta (Manglares)", "Iguana Verde"];
  } else {
    especies = ["Pinzones de Darwin", "Iguana Marina", "Tortuga Gigante de Galápagos"];
  }

  especies.forEach(esp => {
    let li = document.createElement('li');
    li.innerText = esp;
    speciesList.appendChild(li);
  });

  // Etapa de Sucesión Ecológica Secundaria
  const succNotice = document.getElementById('succNotice');
  if (abandono === 0) {
    succNotice.innerText = "Perturbación Antrópica Activa: Fragmentación de bosque húmedo y retención de sedimentos en el río Coca.";
  } else if (abandono === 5) {
    succNotice.innerText = "Sucesión Temprana (5 años): Establecimiento de plantas pioneras, líquenes, musgos y descompactación inicial del suelo.";
  } else if (abandono === 20) {
    succNotice.innerText = "Sucesión Intermedia (20 años): Formación de dosel arbustivo, recuperación del microclima y retorno de pequeños anfibios.";
  } else {
    succNotice.innerText = "Clímax Secundario (50 años): Restablecimiento estructural del nicho ecológico y estabilización de la biodiversidad.";
  }
}

// MODALES FLOTANTES INTERACTIVOS
function openModalContent(title, htmlBody) {
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalBody').innerHTML = htmlBody;
  document.getElementById('infoModal').style.display = 'flex';
}

function openModal(type) {
  openModalContent(
    "Central Hidroeléctrica Coca Codo Sinclair",
    "<p>Aprovecha la fuerza de los ríos Quijos y Salado en Napo y Sucumbíos. Cuenta con un desnivel de 620 metros, túnel de conducción de 24.83 km y 8 turbinas Pelton instaladas.</p>"
  );
}

function closeModal(e) {
  if (e.target.id === 'infoModal') closeModalForce();
}

function closeModalForce() {
  document.getElementById('infoModal').style.display = 'none';
}

function triggerCelebration() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// INICIALIZACIÓN AL CARGAR LA PÁGINA
window.onload = function() {
  startMechCanvas();
};