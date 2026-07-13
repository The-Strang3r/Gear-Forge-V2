const SERVER_ADDRESS = "onemainworld.com";

const STATUS_API =
  `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(SERVER_ADDRESS)}`;

const REFRESH_INTERVAL = 60_000;

async function fetchServerStatus() {
  const response = await fetch(STATUS_API, {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `Server status request failed: ${response.status}`
    );
  }

  return response.json();
}

function setStatusOnline(data) {
  const card = document.getElementById("server-card");
  const dot = document.getElementById("server-status-dot");
  const status = document.getElementById("server-status-text");
  const players = document.getElementById("server-player-count");

  if (!card || !dot || !status || !players) return;

  const onlinePlayers = data.players?.online ?? 0;
  const maxPlayers = data.players?.max ?? 0;

  card.classList.remove("server-offline");
  card.classList.add("server-online");

  status.textContent = "Online";

  players.textContent = maxPlayers > 0
    ? `${onlinePlayers} / ${maxPlayers} Players`
    : `${onlinePlayers} Players Online`;
}

function setStatusOffline() {
  const card = document.getElementById("server-card");
  const status = document.getElementById("server-status-text");
  const players = document.getElementById("server-player-count");

  if (!card || !status || !players) return;

  card.classList.remove("server-online");
  card.classList.add("server-offline");

  status.textContent = "Offline";
  players.textContent = "Server unavailable";
}

export async function updateServerStatus() {
  try {
    const data = await fetchServerStatus();

    if (!data.online) {
      setStatusOffline();
      return;
    }

    setStatusOnline(data);
  } catch (error) {
    console.warn("Unable to retrieve server status:", error);
    setStatusOffline();
  }
}

export function initServerStatus() {
  updateServerStatus();

  window.setInterval(
    updateServerStatus,
    REFRESH_INTERVAL
  );
}