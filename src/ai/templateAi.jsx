export const sampleAi = {
  name: "Computer",
  icon: "♟️", 
  getNextCard: (hand, targets, opponentPlays) => {
    const nextTarget = targets[targets.length - 1];

    // If target is a royal (Drake usually plays a random royal), respond with our strongest royal
    if (nextTarget > 10) {
      const royals = hand.filter((card) => card > 10);
      if (royals.length > 0) {
        return Math.max(...royals);
      }
    }

    // Predictable responses (soft-countering common behavior)
    const likelyOpponentPlay = {
      10: 1,
      9: 2,
      8: 3,
      7: 10,
      6: 9,
      5: 8,
      4: 7,
      3: 6,
      2: 5,
      1: 4,
    };

    const predicted = likelyOpponentPlay[nextTarget];
    const options = hand.filter((card) => card > predicted);

    if (options.length > 0) {
      return Math.min(...options); // just enough to win
    }

    // If we can't win, play lowest card to save stronger ones
    return Math.min(...hand);
  },
};
