let highCardsPlayed = 0;
export const WoatAI = {
  name: "WoatAI", // a cute name
  icon: "-", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    if ([9, 10, 11, 12, 13].includes(targets[targets.length - 1])) {
      highCardsPlayed++;
    }
    const fullDeck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    // Find all played cards
    const allPlayed = opponentPlays.flat();

    // Find all unplayed cards
    const unplayed = fullDeck.filter(
      (card) => !allPlayed.includes(card) && !hand.includes(card)
    );

    // Highest unplayed card
    const highestRemaining = Math.max(...[...hand, ...unplayed]);

    // Check if you have it
    const youHaveHighest = hand.includes(highestRemaining);

    // Check if any opponent still has it
    let onlyYouHaveHighest = youHaveHighest;
    if (youHaveHighest) {
      for (const opp of opponentPlays) {
        const oppHand = fullDeck.filter((card) => !opp.includes(card));
        if (oppHand.includes(highestRemaining)) {
          onlyYouHaveHighest = false;
          break;
        }
      }
    }

    const highestPrizeRemaining = Math.max(...targets);

    // If the current prize is the highest, and only you have the highest card, play it!
    if (
      onlyYouHaveHighest &&
      targets[targets.length - 1] === highestPrizeRemaining &&
      hand.includes(highestRemaining)
    ) {
      return highestRemaining;
    }

    if ([1, 2, 3, 4].includes(targets[targets.length - 1])) {
      if (hand.includes(targets[targets.length - 1])) {
        return targets[targets.length - 1];
      }
      if (hand.includes(targets[targets.length - 1] + 1)) {
        return targets[targets.length - 1] + 1;
      }
      if (hand.includes(targets[targets.length - 1] - 1)) {
        return targets[targets.length - 1] - 1;
      } else {
        return Math.min(...hand);
      }
    }
    if ([9, 10, 11, 12, 13].includes(targets[targets.length - 1])) {
      if (highCardsPlayed < 2) {
        return Math.min(...hand);
      } else {
        for (let i = 4; (i = 0); i--) {
          if (hand.includes(targets[targets.length - 1] + i)) {
            return targets[targets.length - 1] + i;
          }
        }
        return Math.max(...hand);
      }
    }
    if ([5, 6, 7, 8].includes(targets[targets.length - 1])) {
      if (hand.includes(targets[targets.length - 1] + 2)) {
        return targets[targets.length - 1] + 2;
      } else {
        return Math.min(...hand);
      }
    }
    // Fallback: play a random card
    return hand[Math.floor(Math.random() * hand.length)];
  },
};
