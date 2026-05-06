import { MENU } from "./menu-data.js";

export class TrainingEngine {
  constructor() {
    this.state = {
      attempts: 0,
      correct: 0,
      streak: 0,
      categoryStats: {},
      heatStats: {}
    };
  }

  getDifficultyTier() {
    const acc = this.getAccuracy();

    if (this.state.attempts < 10) return 1;
    if (acc > 0.9) return 4;
    if (acc > 0.8) return 3;
    if (acc > 0.7) return 2;
    return 1;
  }

  generateQuestion() {
    const tier = this.getDifficultyTier();

    const pool = MENU.filter(item =>
      !item.heat || item.heat <= tier
    );

    const correct = pool[Math.floor(Math.random() * pool.length)];

    const distractors = MENU
      .filter(i => i.category === correct.category && i.id !== correct.id)
      .sort(() => Math.random() - 0.5);

    const options = this.shuffle([
      correct,
      ...distractors
    ]).slice(0, 4);

    return { correct, options };
  }

  answer(selected, correct) {
    this.state.attempts++;

    const isCorrect = selected.id === correct.id;

    if (isCorrect) {
      this.state.correct++;
      this.state.streak++;
    } else {
      this.state.streak = 0;
    }

    this.track(correct, isCorrect);

    return isCorrect;
  }

  track(item, correct) {
    const cat = item.category;

    if (!this.state.categoryStats[cat]) {
      this.state.categoryStats[cat] = { correct: 0, total: 0 };
    }

    this.state.categoryStats[cat].total++;

    if (correct) {
      this.state.categoryStats[cat].correct++;
    }
  }

  getAccuracy() {
    return this.state.attempts
      ? this.state.correct / this.state.attempts
      : 0;
  }

  shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
}
