const menu = [
  { symbol: "🍗🔥", name: "Atomic Wings" },
  { symbol: "🍗🍋", name: "Lemon Pepper" },
  { symbol: "🍗🧄", name: "Garlic Parmesan" },
  { symbol: "🍟", name: "Fries" },
  { symbol: "🥤C", name: "Coke" },
  { symbol: "🥤S", name: "Sprite" }
];

let score = 0;

const grid = document.getElementById("grid");
const question = document.getElementById("question");
const symbol = document.getElementById("symbol");
const options = document.getElementById("options");
const scoreDisplay = document.getElementById("score");

menu.forEach((item, index) => {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = item.symbol;
  div.onclick = () => ask(index);
  grid.appendChild(div);
});

function ask(index) {
  const correct = menu[index];
  symbol.textContent = correct.symbol;
  options.innerHTML = "";
  question.classList.remove("hidden");

  let choices = [...menu].sort(() => 0.5 - Math.random()).slice(0, 3);
  if (!choices.includes(correct)) choices[0] = correct;

  choices.sort(() => 0.5 - Math.random()).forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.name;
    btn.onclick = () => check(choice.name, correct.name);
    options.appendChild(btn);
  });
}

function check(selected, correct) {
  if (selected === correct) {
    score++;
    alert("Correct");
  } else {
    alert("Wrong: " + correct);
  }
  scoreDisplay.textContent = "Score: " + score;
  question.classList.add("hidden");
}
