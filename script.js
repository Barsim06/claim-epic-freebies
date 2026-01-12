const difficulty = document.querySelector("#difficulty");
const difficultyValue = document.querySelector("#difficultyValue");
const sync = document.querySelector("#sync");
const resonance = document.querySelector("#resonance");
const stability = document.querySelector("#stability");
const gridToggle = document.querySelector("#toggleGrid");
const calibrate = document.querySelector("#calibrate");
const panic = document.querySelector("#panic");
const challenges = document.querySelectorAll(".challenge");
const terminal = document.querySelector("#terminal");
const terminalForm = document.querySelector("#terminalForm");
const terminalField = document.querySelector("#terminalField");
const cipherInput = document.querySelector("#cipherInput");
const cipherButton = document.querySelector("#cipherButton");
const cipherResult = document.querySelector("#cipherResult");
const orbitToggle = document.querySelector("#orbit");
const echoToggle = document.querySelector("#echo");
const flareToggle = document.querySelector("#flare");
const paths = document.querySelector("#paths");
const memory = document.querySelector("#memory");
const indexValue = document.querySelector("#index");
const mode = document.querySelector("#mode");

const canvas = document.querySelector("#aura");
const ctx = canvas.getContext("2d");

let particles = [];
let gridActive = false;
let panicMode = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateDifficulty = (value) => {
  const normalized = clamp(parseInt(value, 10), 1, 10);
  difficultyValue.textContent = String(normalized).padStart(2, "0");
  document.documentElement.style.setProperty("--difficulty", normalized);
  const syncValue = 60 + normalized * 4;
  sync.textContent = `${syncValue}%`;
  resonance.textContent = `${40 + normalized * 2} Hz`;
  stability.textContent = normalized > 7 ? "Critica" : normalized > 4 ? "Variabile" : "Stabile";
  mode.textContent = normalized > 7 ? "MANUAL" : "AUTO";
};

const logTerminal = (text, type = "system") => {
  const entry = document.createElement("p");
  entry.textContent = `> ${text}`;
  entry.dataset.type = type;
  terminal.append(entry);
  terminal.scrollTop = terminal.scrollHeight;
};

const calibrateCore = () => {
  logTerminal("Calibrazione in corso. Allinea i vettori.");
  memory.textContent = `${65 + Math.floor(Math.random() * 20)}%`;
  paths.textContent = `${110 + Math.floor(Math.random() * 60)}`;
  indexValue.textContent = `Δ-${Math.floor(Math.random() * 9 + 1)}`;
};

const toggleGrid = () => {
  gridActive = !gridActive;
  document.body.classList.toggle("grid-active", gridActive);
  gridToggle.textContent = gridActive ? "Disattiva griglia" : "Attiva griglia";
};

const togglePanic = () => {
  panicMode = !panicMode;
  document.body.style.filter = panicMode ? "hue-rotate(120deg)" : "none";
  panic.textContent = panicMode ? "Resta calmo" : "Senza paura";
  logTerminal(panicMode ? "Modalità panico attiva." : "Modalità panico disattivata.");
};

const challengeCopy = [
  "Impulso ricevuto. Ricalibrazione avviata.",
  "Duplicazione completata. Pattern stabile.",
  "Pozzo gravitazionale stabile. Rumore isolato.",
  "Gabbia entropica sigillata. Energia contenuta."
];

challenges.forEach((card) => {
  const button = card.querySelector("button");
  button.addEventListener("click", () => {
    const index = Number(card.dataset.challenge || 0);
    card.classList.toggle("active");
    logTerminal(challengeCopy[index]);
  });
});

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = terminalField.value.trim();
  if (!value) {
    return;
  }
  logTerminal(value, "user");
  if (value.toLowerCase().includes("omega")) {
    logTerminal("Chiave Omega riconosciuta. Sistemi potenziati.");
  } else if (value.toLowerCase().includes("status")) {
    logTerminal("Status: dinamico, complesso, instabile.");
  } else {
    logTerminal("Comando accettato. Analisi in corso.");
  }
  terminalField.value = "";
});

cipherButton.addEventListener("click", () => {
  const answer = cipherInput.value.trim();
  if (!answer) {
    cipherResult.textContent = "Inserisci un valore per attivare il controllo.";
    return;
  }
  if (answer === "24") {
    cipherResult.textContent = "Sequenza corretta. Modalità Omega sbloccata.";
    document.body.style.setProperty("--accent", "#facc15");
    logTerminal("Modalità Omega attivata. Prestazioni estreme.");
  } else {
    cipherResult.textContent = "Sequenza errata. Riavvia l'analisi.";
  }
});

orbitToggle.addEventListener("change", () => {
  logTerminal(orbitToggle.checked ? "Orbite riattivate." : "Orbite disattivate.");
});

echoToggle.addEventListener("change", () => {
  logTerminal(echoToggle.checked ? "Eco neurale amplificata." : "Eco neurale silenziata.");
});

flareToggle.addEventListener("change", () => {
  logTerminal(flareToggle.checked ? "Flare difensivi attivati." : "Flare difensivi spenti.");
});

difficulty.addEventListener("input", (event) => {
  updateDifficulty(event.target.value);
});

calibrate.addEventListener("click", calibrateCore);

gridToggle.addEventListener("click", toggleGrid);

panic.addEventListener("click", togglePanic);

const resizeCanvas = () => {
  const { innerWidth, innerHeight, devicePixelRatio } = window;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
};

const createParticles = () => {
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2 + 0.5
  }));
};

const drawParticles = () => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const difficultyScale = Number(document.documentElement.style.getPropertyValue("--difficulty")) || 6;
  const speed = 0.4 + difficultyScale * 0.06;

  particles.forEach((particle, i) => {
    particle.x += particle.vx * speed;
    particle.y += particle.vy * speed;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(125, 249, 255, 0.7)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const dist = Math.hypot(particle.x - other.x, particle.y - other.y);
      const limit = 120 + difficultyScale * 6;
      if (dist < limit) {
        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / limit})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
};

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
updateDifficulty(difficulty.value);
requestAnimationFrame(drawParticles);
