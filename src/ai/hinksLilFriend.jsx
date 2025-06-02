export const hinksLilFriend = {
  name: "Hink's lil friend", // the opposite
  icon: "🦾",
  getNextCard: (hand, targets, opponentPlays) => {
    // Helper: Get the current target card
    const nextTarget = targets[targets.length - 1];

    // Helper: Get the highest and lowest cards in hand
    const highest = Math.max(...hand);
    const lowest = Math.min(...hand);

    // Helper: Track opponent's most frequent play
    const freq = {};
    opponentPlays.forEach(card => {
      freq[card] = (freq[card] || 0) + 1;
    });
    const mostFreqOpponentCard = Object.keys(freq).length
      ? parseInt(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0])
      : null;

    // Dynamic strategy switching based on game state
    // If only a few cards left, play passively
    if (hand.length <= 3) {
      // Passive targeting: play lowest card for high-value targets
      if (nextTarget >= Math.max(...targets) - 1) {
        return lowest;
      }
      // Otherwise, avoid the target if possible
      if (hand.includes(nextTarget)) return lowest;
      // Or play the next worst card
      return lowest;
    }

    // Early/mid game: mix opposite strategies
    // 1. Target Denial: avoid the target if possible
    if (hand.includes(nextTarget) && hand.length > 1) {
      // Play something that's NOT the target
      return hand.find(card => card !== nextTarget) ?? nextTarget;
    }

    // 2. Mirror/Reverse: reverse the percentages
    if (opponentPlays.length > 0) {
      const lastOpponent = opponentPlays[opponentPlays.length - 1];
      // 70% chance to mirror (opposite of 30%)
      if (hand.includes(lastOpponent) && Math.random() < 0.7) {
        return lastOpponent;
      }
      // 80% chance to reverse (opposite of 20%)
      if (Math.random() < 0.8) {
        const farthest = hand.reduce((a, b) =>
          Math.abs(b - lastOpponent) > Math.abs(a - lastOpponent) ? b : a
        );
        return farthest;
      }
    }

    // 3. Opponent Pattern Recognition: try to lose to their most frequent card
    if (
      mostFreqOpponentCard !== null &&
      hand.includes(mostFreqOpponentCard - 1)
    ) {
      // Try to lose to their most frequent card
      return mostFreqOpponentCard - 1;
    }

    // 4. Sacrifice for Setup: if target is low value, waste strong cards
    if (nextTarget <= Math.min(...targets) + 1) {
      return highest;
    }

    // 5. Passive Targeting: play lowest card for high-value targets
    if (nextTarget >= Math.max(...targets) - 1) {
      return lowest;
    }

    // 6. Default: play the card farthest from the target
    let farthest = hand[0];
    let maxDiff = Math.abs(hand[0] - nextTarget);
    for (let i = 1; i < hand.length; i++) {
      const diff = Math.abs(hand[i] - nextTarget);
      if (diff > maxDiff) {
        maxDiff = diff;
        farthest = hand[i];
      }
    }
    return farthest;
  },
};