export function save(data) {
  localStorage.setItem("training_state", JSON.stringify(data));
}

export function load() {
  return JSON.parse(localStorage.getItem("training_state")) || null;
}

export function saveHighScore(score) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem("high_score", score);
  }
}

export function getHighScore() {
  return parseInt(localStorage.getItem("high_score") || "0");
}
