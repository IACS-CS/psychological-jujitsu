export const sampleAi = {
  name: "MetaMind",
  icon: "🧠",
  getNextCard: (
    hand,
    targets,
    leftOpponentPlays = [],
    rightOpponentPlays = []
  ) => {
    if (hand.length === 1) return hand[0];
    let nextTarget = targets[targets.length - 1];

    // --- Card Counting ---
    const allPlayed = [...targets, ...leftOpponentPlays, ...rightOpponentPlays];
    const fullDeck = Array.from({ length: 14 }, (_, i) => i + 1);
    const unseen = fullDeck.filter(card => !allPlayed.includes(card) && !hand.includes(card));
    const highUnseen = unseen.filter(card => card > 10);
    const lowUnseen = unseen.filter(card => card <= 4);

    // --- Pattern Recognition ---
    const N = 3;
    const leftRecent = leftOpponentPlays.slice(-N);
    const rightRecent = rightOpponentPlays.slice(-N);

    const isRepeat = arr => arr.length >= 2 && arr.every(v => v === arr[0]);
    const isIncrement = arr => arr.length >= 2 && arr.every((v, i, a) => i === 0 || v - a[i-1] === 1);
    const isDecrement = arr => arr.length >= 2 && arr.every((v, i, a) => i === 0 || v - a[i-1] === -1);

    // Detect left/right patterns
    let leftPattern = null, rightPattern = null;
    if (isRepeat(leftRecent)) leftPattern = "repeat";
    else if (isIncrement(leftRecent)) leftPattern = "increment";
    else if (isDecrement(leftRecent)) leftPattern = "decrement";

    if (isRepeat(rightRecent)) rightPattern = "repeat";
    else if (isIncrement(rightRecent)) rightPattern = "increment";
    else if (isDecrement(rightRecent)) rightPattern = "decrement";

    // --- Adaptive Play ---
    if (leftPattern === "repeat" || rightPattern === "repeat") {
      const avoid = leftPattern === "repeat" ? leftRecent[0] : rightRecent[0];
      const options = hand.filter(card => card !== avoid);
      if (options.length > 0) return options[Math.floor(Math.random() * options.length)];
    }

    if (leftPattern === "increment" || rightPattern === "increment") {
      if (hand.includes(nextTarget + 2)) return nextTarget + 2;
    }
    if (leftPattern === "decrement" || rightPattern === "decrement") {
      if (hand.includes(nextTarget - 2)) return nextTarget - 2;
    }

    // --- Card Value Management ---
    if (hand.some(card => card > 10) && highUnseen.length === 0) {
      const high = hand.filter(card => card > 10);
      if (high.length > 0) return Math.max(...high);
    }
    if (hand.some(card => card <= 4) && lowUnseen.length === 0) {
      const notLow = hand.filter(card => card > 4);
      if (notLow.length > 0) return Math.min(...notLow);
    }

    // --- Bluffing & Unpredictability ---
    if (Math.random() < 0.12 && hand.length > 2) {
      return hand[Math.floor(Math.random() * hand.length)];
    }

    // --- General Strategy ---
    if (hand.includes(nextTarget)) return nextTarget;
    if (hand.includes(nextTarget + 1)) return nextTarget + 1;
    if (hand.includes(nextTarget - 1)) return nextTarget - 1;

    // --- Fallback: always return a card ---
    return hand[0];
  },
};