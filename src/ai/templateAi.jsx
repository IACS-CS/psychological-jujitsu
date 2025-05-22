export const sampleAi = {
  name: "Informed Planner",
  icon: "🧠",
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1];
    let sortedHand = [...hand].sort((a, b) => a - b);

    // Track cards that have been played by both players
    let playedCards = new Set(opponentPlays);

    // Remove played cards from our hand for safety (shouldn't be needed, but safe)
    let availableHand = sortedHand.filter((card) => !playedCards.has(card));

    // If target is 5 or less, play lowest card
    if (nextTarget <= 3) {
      return availableHand[0];
    }

    // If target is 4-7, play median card or, 50% of the time, play second highest card
    if (nextTarget >= 4 && nextTarget <= 7) {
      let medianIndex = Math.floor(availableHand.length / 2);
      if (Math.random() < 0.5 && availableHand.length >= 2) {
        return availableHand[availableHand.length - 2];
      }
      return availableHand[medianIndex];
    }

    // If target is 8 or more, play highest card
    if (nextTarget >= 8) {
      return availableHand[availableHand.length - 1];
    }

    // Fallback: play second highest if possible, else lowest
    if (availableHand.length >= 2) {
      return availableHand[availableHand.length - 2];
    }
    return availableHand[0];
  },
};

