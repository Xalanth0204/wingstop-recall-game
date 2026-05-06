let menu = [];
let session = {
  correct: 0,
  total: 0,
  categoryStats: {}
};

let tier = 1;
let timeLeft = 8;
let timer;

const grid = document.getElementById("grid");
const question = document.getElementById("question");
const symbol = document.getElementById("symbol");
const options = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");

fetch("menu.json")
  .then(r => r.json())
  .then(data => {
    menu = data;
    render();
    loadProgress();
  });

function render() {
  grid.innerHTML = "";

  menu.forEach(item => {
    const el = document.createElement("div");
    el.className = "card";
    el.textContent = item.symbol;
    el.onclick = () => ask(item);
    grid.appendChild(el);
  });
}

function ask(item) {
  symbol.textContent = item.symbol;
  question.classList.remove("hidden");

  const pool = menu.filter(m => m.difficulty <= tier);

  let choices = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  if (!choices.includes(item)) choices[0] = item;

  options.innerHTML = "";

  choices.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c.name;
    btn.onclick = () => answer(c, item);
    options.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = tier >= 3 ? 6 : 8;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      fail();
    }
  }, 1000);
}

function answer(selected, correct) {
  clearInterval(timer);

  session.total++;

  if (!session.categoryStats[correct.category]) {
    session.categoryStats[correct.category] = { correct: 0, total: 0 };
  }

  session.categoryStats[correct.category].total++;

  if (selected.name === correct.name) {
    session.correct++;
    session.categoryStats[correct.category].correct++;
  }

  updateTier();
  saveProgress();
  updateUI();

  question.classList.add("hidden");
}

function fail() {
  session.total++;
  updateTier();
  saveProgress();
  updateUI();
  question.classList.add("hidden");
}

function updateTier() {
  const acc = session.total ? session.correct / session.total : 0;

  if (session.total >= 20 && acc >= 0.9) tier = 5;
  else if (session.total >= 15 && acc >= 0.8) tier = 4;
  else if (session.total >= 10 && acc >= 0.7) tier = 3;
  else if (session.total >= 5) tier = 2;
  else tier = 1;
}

function updateUI() {
  const acc = session.total ? Math.round((session.correct / session.total) * 100) : 0;

  scoreDisplay.textContent = `Accuracy: ${acc}%`;
  levelDisplay.textContent = `Tier: ${tierName()}`;
}

function tierName() {
  return ["Starter", "Trainee", "Competent", "Shift Lead", "Master"][tier - 1];
}

function saveProgress() {
  localStorage.setItem("training_progress", JSON.stringify(session));
}

function loadProgress() {
  const data = localStorage.getItem("training_progress");
  if (data) session = JSON.parse(data);
  updateUI();
}
