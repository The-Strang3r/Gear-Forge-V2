export const state = {
  currentView: "armor", // "armor" | "tools"
};

export function setView(view) {
  state.currentView = view;
}

export function isArmorView() {
  return state.currentView === "armor";
}
