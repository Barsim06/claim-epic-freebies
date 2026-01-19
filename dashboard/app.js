const elements = {
  speed: document.getElementById("speed"),
  gear: document.getElementById("gear"),
  rpm: document.getElementById("rpm"),
  rpmFill: document.getElementById("rpm-fill"),
  fuel: document.getElementById("fuel"),
  lap: document.getElementById("lap"),
  position: document.getElementById("position"),
  delta: document.getElementById("delta"),
  target: document.getElementById("target"),
  connectionDot: document.getElementById("connection-dot"),
  connectionText: document.getElementById("connection-text"),
  wsUrl: document.getElementById("ws-url"),
  wsForm: document.getElementById("ws-form"),
  disconnect: document.getElementById("disconnect"),
};

const MAX_RPM = 9000;
let socket;
let mockInterval;

const formatDelta = (value) => {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(3)}`;
};

const updateConnection = (status, label) => {
  elements.connectionDot.classList.toggle("status__dot--online", status === "online");
  elements.connectionDot.classList.toggle("status__dot--offline", status !== "online");
  elements.connectionText.textContent = label;
};

const updateDashboard = (data) => {
  elements.speed.textContent = Math.round(data.speed ?? 0);
  elements.gear.textContent = data.gear ?? "N";
  elements.rpm.textContent = Math.round(data.rpm ?? 0);
  elements.fuel.textContent = (data.fuel ?? 0).toFixed(1);
  elements.lap.textContent = data.lap ?? 0;
  elements.position.textContent = data.position ?? "-";
  elements.delta.textContent = formatDelta(data.delta ?? 0);
  elements.target.textContent = data.target ?? "--:--.---";

  const rpmPercent = Math.min((data.rpm ?? 0) / MAX_RPM, 1) * 100;
  elements.rpmFill.style.width = `${rpmPercent}%`;

  if ((data.delta ?? 0) >= 0) {
    elements.delta.classList.add("card__value--delta");
    elements.delta.style.color = "#36d399";
  } else {
    elements.delta.style.color = "#ff5c7a";
  }
};

const startMockData = () => {
  clearInterval(mockInterval);
  let t = 0;
  mockInterval = setInterval(() => {
    t += 1;
    const speed = 80 + 40 * Math.sin(t / 8);
    const rpm = 3000 + 3500 * (0.5 + 0.5 * Math.sin(t / 6));
    updateDashboard({
      speed,
      gear: Math.max(1, Math.round(2 + Math.sin(t / 10) * 3)),
      rpm,
      fuel: 36.8 - t * 0.01,
      lap: 5 + Math.floor(t / 60),
      position: 4,
      delta: 0.2 * Math.sin(t / 5),
      target: "01:53.420",
    });
  }, 500);
};

const stopMockData = () => {
  clearInterval(mockInterval);
};

const connectWebSocket = (url) => {
  if (!url) {
    return;
  }

  if (socket) {
    socket.close();
  }

  updateConnection("connecting", "Connessione...");
  stopMockData();

  socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    updateConnection("online", "Live telemetry");
  });

  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(event.data);
      updateDashboard(payload);
    } catch (error) {
      console.warn("Formato non valido:", error);
    }
  });

  socket.addEventListener("close", () => {
    updateConnection("offline", "Mock data");
    startMockData();
  });

  socket.addEventListener("error", () => {
    updateConnection("offline", "Mock data");
    startMockData();
  });
};

const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = undefined;
  }
  updateConnection("offline", "Mock data");
  startMockData();
};

elements.wsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  connectWebSocket(elements.wsUrl.value.trim());
});

elements.disconnect.addEventListener("click", disconnectWebSocket);

startMockData();
