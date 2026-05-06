import { TrainingEngine } from "./engine.js";
import { save, load, saveHighScore, getHighScore } from "./storage.js";

const engine = new TrainingEngine();

const grid = document.getElementById("grid");
const question = document.getElementById("question");
const symbol = document.getElementById("symbol");
const options = document.getElementById("options");

const score = document.getElementById("score");
const tier = document.getElementById("tier");

let current = null;

function init() {
  renderQuestion();
}

function renderQuestion() {
  current = engine.generateQuestion();

  symbol.textContent = current.correct.name;

  options.innerHTML = "";

  current.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.name;

    btn.onclick = () => handleAnswer(opt);

    options.appendChild(btn);
  });

  updateUI();
}

function handleAnswer(selected) {
  const result = engine.answer(selected, current.correct);

  if (result) {
    alert("Correct");
  } else {
    alert("Incorrect: " + current.correct.name);
  }

  save(engine.state);
  saveHighScore(engine.state.correct);

  renderQuestion();
}

function updateUI() {
  score.textContent = `Score: ${engine.state.correct}/${engine.state.attempts}`;
  tier.textContent = `Tier: ${engine.getDifficultyTier()}`;
}

init();
