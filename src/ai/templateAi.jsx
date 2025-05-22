export const sampleAi = {
   name: "MetaMind", // a clever name
  icon: "🧠", // an image link or emoji
  getNextCard: (hand, targets, opponentPlays) => {
    // If only one card left, play it
    if (hand.length === 1) return hand[0];

    let nextTarget = targets[targets.length - 1];

    // --- Pattern Recognition ---
    const N = 4;
    const recent = opponentPlays.slice(-N);
    let pattern = null;

    if (recent.length >= 2) {
      // Check for mirroring (opponent plays same as target)
      let mirrors = true;
      for (let i = 1; i < recent.length; i++) {
        if (recent[i] !== targets[targets.length - recent.length + i]) {
          mirrors = false;
          break;
        }
      }
      if (mirrors) pattern = "mirror";
    }

    if (!pattern && recent.length >= 3) {
      // Check for increment/decrement pattern
      let diffs = [];
      for (let i = 1; i < recent.length; i++) {
        diffs.push(recent[i] - recent[i - 1]);
      }
      if (diffs.every(d => d === 1)) pattern = "increment";
      if (diffs.every(d => d === -1)) pattern = "decrement";
    }

    if (!pattern && recent.length >= 2) {
      // Check for repeat
      if (recent.every(v => v === recent[0])) pattern = "repeat";
    }

    // --- Card Counting ---
    // Track which cards have been played (by anyone) to estimate what remains in the deck and opponent's hand
    const allPlayed = [...targets, ...opponentPlays];
    const fullDeck = Array.from({ length: 14 }, (_, i) => i + 1);
    const unseen = fullDeck.filter(card => !allPlayed.includes(card) && !hand.includes(card));
    const highUnseen = unseen.filter(card => card > 10);
    const lowUnseen = unseen.filter(card => card <= 4);
    debugger;

    // --- Adaptive Play Based on Pattern ---
    if (pattern === "mirror") {
      // Break mirroring
      const nonMirror = hand.filter(card => card !== nextTarget);
      if (nonMirror.length > 0) return Math.min(...nonMirror);
    } else if (pattern === "increment") {
      if (hand.includes(nextTarget + 2)) return nextTarget + 2;
    } else if (pattern === "decrement") {
      if (hand.includes(nextTarget - 2)) return nextTarget - 2;
    } else if (pattern === "repeat") {
      const nonRepeat = hand.filter(card => card !== recent[0]);
      if (nonRepeat.length > 0) return Math.max(...nonRepeat);
    }

    // --- Card Value Management with Card Counting ---
    // If most high cards are gone, play high cards more freely
    if (hand.some(card => card > 10) && highUnseen.length === 0) {
      return Math.max(...hand.filter(card => card > 10));
    }
    // If most low cards are gone, avoid playing lowest cards unless forced
    if (hand.some(card => card <= 4) && lowUnseen.length === 0) {
      const notLow = hand.filter(card => card > 4);
      if (notLow.length > 0) return Math.min(...notLow);
    }

    // If opponent likely has high cards left, bait them with a mid card
    if (highUnseen.length > 0 && hand.some(card => card > 10)) {
      return Math.min(...hand.filter(card => card > 10));
    }

    // --- Bluffing & Unpredictability ---
    if (Math.random() < 0.08 && hand.length > 2) {
      return hand[Math.floor(Math.random() * hand.length)];
    }

    // --- General Strategy ---
    // 1. Try to win by matching the nextTarget exactly if possible
    if (hand.includes(nextTarget)) {
      return nextTarget;
    }

    // 2. Try to play a card that is one higher or lower than nextTarget (if rules allow)
    if (hand.includes(nextTarget + 1)) {
      return nextTarget + 1;
    }
    if (hand.includes(nextTarget - 1)) {
      return nextTarget - 1;
    }

    // 3. Play the median card to avoid extremes
    const sorted = [...hand].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  },
};