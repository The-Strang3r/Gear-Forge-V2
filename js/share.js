import { state, setView } from "./state.js";
import { saveCurrent } from "./storage.js";
import { showSaveNotice } from "./reset.js";

const BUILD_VERSION = 1;

function readStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch (error) {
    console.warn(`Could not read ${key}:`, error);
    return {};
  }
}

function encodeBuild(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBuild(encoded) {
  const base64 = encoded
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);

  return JSON.parse(json);
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isValidBuild(build) {
  if (!isPlainObject(build)) return false;
  if (build.version !== BUILD_VERSION) return false;
  if (!isPlainObject(build.armor)) return false;
  if (!isPlainObject(build.tools)) return false;

  return true;
}

function createBuildData() {
  saveCurrent();

  return {
    version: BUILD_VERSION,
    armor: readStoredJson("armorData"),
    tools: readStoredJson("toolData"),
    theme: localStorage.getItem("theme") === "light"
      ? "light"
      : "dark",
    thornsEnabled:
      localStorage.getItem("thornsEnabled") === "true",
    view: state.currentView === "tools"
      ? "tools"
      : "armor"
  };
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Browser could not copy the link.");
  }
}

export async function copyShareLink() {
  const button = document.getElementById("copy-share-link");

  try {
    const build = createBuildData();
    const encodedBuild = encodeBuild(build);

    const url = new URL(window.location.href);

    url.searchParams.set("build", encodedBuild);
    url.hash = "";

    await copyText(url.toString());

    showSaveNotice("Share link copied!");

    if (button) {
      button.textContent = "Link Copied!";

      setTimeout(() => {
        button.textContent = "Copy Share Link";
      }, 1400);
    }
  } catch (error) {
    console.error("Could not create share link:", error);

    showSaveNotice("Unable to copy link");

    if (button) {
      button.textContent = "Copy Failed";

      setTimeout(() => {
        button.textContent = "Copy Share Link";
      }, 1400);
    }
  }
}

/**
 * Loads a build from ?build= in the URL.
 *
 * Returns true when a shared build was successfully loaded.
 */
export function loadSharedBuildFromUrl() {
  const url = new URL(window.location.href);
  const encodedBuild = url.searchParams.get("build");

  if (!encodedBuild) return false;

  try {
    const build = decodeBuild(encodedBuild);

    if (!isValidBuild(build)) {
      throw new Error("Shared build data is invalid.");
    }

    localStorage.setItem(
      "armorData",
      JSON.stringify(build.armor)
    );

    localStorage.setItem(
      "toolData",
      JSON.stringify(build.tools)
    );

    localStorage.setItem(
      "theme",
      build.theme === "light" ? "light" : "dark"
    );

    localStorage.setItem(
      "thornsEnabled",
      String(build.thornsEnabled === true)
    );

    setView(build.view === "tools" ? "tools" : "armor");

    /*
     * Remove the build parameter after importing it.
     * This prevents a refresh from repeatedly overwriting later changes.
     */
    url.searchParams.delete("build");

    window.history.replaceState(
      {},
      document.title,
      `${url.pathname}${url.search}${url.hash}`
    );

    return true;
  } catch (error) {
    console.error("Could not load shared build:", error);

    url.searchParams.delete("build");

    window.history.replaceState(
      {},
      document.title,
      `${url.pathname}${url.search}${url.hash}`
    );

    return false;
  }
}