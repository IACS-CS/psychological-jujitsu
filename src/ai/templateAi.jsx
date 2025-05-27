export const sampleAi = {
  name: "tron",
  icon: "-",
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1];
    let sortedHand = [...hand].sort((a, b) => a - b);

    // Drake's predictable plays for targets 1-10
    const drakeMap = {
      1: 4, 2: 5, 3: 6, 4: 7, 5: 8,
      6: 9, 7: 10, 8: 3, 9: 2, 10: 1
    };

    // Detect if opponent is using Drake's pattern (last 5 plays match drakeMap)
    let isDrake = false;
    if (opponentPlays.length >= 5 && targets.length >= 5) {
      isDrake = opponentPlays.slice(-5).every((play, i) => {
        let t = targets[targets.length - 5 + i];
        return drakeMap[t] === play;
      });
    }

    // Detect if opponent is using an anti-Drake strategy (always just above Drake's mapped card)
    let isAntiDrake = false;
    if (opponentPlays.length >= 5 && targets.length >= 5) {
      isAntiDrake = opponentPlays.slice(-5).every((play, i) => {
        let t = targets[targets.length - 5 + i];
        return play === drakeMap[t] + 1 || play === drakeMap[t] + 2;
      });
    }

    // If opponent is using Drake, counter Drake
    if (isDrake) {
      if (nextTarget >= 1 && nextTarget <= 10) {
        let drakePlay = drakeMap[nextTarget];
        let counter = sortedHand.find(card => card > drakePlay);
        if (counter !== undefined) return counter;
        return sortedHand[0];
      }
      if (nextTarget > 10) {
        let royals = sortedHand.filter(card => card > 10);
        if (royals.length > 0) return royals[0];
        return sortedHand[sortedHand.length - 1];
      }
    }

    // If opponent is using anti-Drake, play just under their expected counter if possible
    if (isAntiDrake) {
      if (nextTarget >= 1 && nextTarget <= 10) {
        let antiDrakePlay = drakeMap[nextTarget] + 1;
        let undercut = sortedHand.find(card => card < antiDrakePlay && card > drakeMap[nextTarget]);
        if (undercut !== undefined) return undercut;
        // Otherwise, play lowest card to minimize loss
        return sortedHand[0];
      }
      if (nextTarget > 10) {
        // Play your lowest royal or lowest card
        let royals = sortedHand.filter(card => card > 10);
        if (royals.length > 0) return royals[0];
        return sortedHand[0];
      }
    }

    // --- Original adaptive strategy below ---

    // Analyze opponent's play style: aggressive (high cards), conservative (low cards), or balanced
    let opponentAvg = opponentPlays.length > 0
      ? opponentPlays.reduce((a, b) => a + b, 0) / opponentPlays.length
      : null;

    // If opponent is playing high cards, try to undercut and save your best for big targets
    if (opponentAvg !== null && opponentAvg > Math.max(...hand) / 2) {
      if (nextTarget >= 8) {
        return sortedHand[sortedHand.length - 1];
      }
      return sortedHand[0];
    }

    // If opponent is playing low cards, be more aggressive on mid/high targets
    if (opponentAvg !== null && opponentAvg <= Math.max(...hand) / 2) {
      if (nextTarget >= 6) {
        let desired = nextTarget + 2;
        if (hand.includes(desired)) {
          return desired;
        }
        let nextBest = sortedHand.find(card => card > nextTarget);
        if (nextBest !== undefined) {
          return nextBest;
        }
      }
      return sortedHand[0];
    }

    // Default: balanced strategy
    let desired = nextTarget + 2;
    if (hand.includes(desired)) {
      return desired;
    }
    let nextBest = sortedHand.find(card => card > nextTarget);
    if (nextBest !== undefined) {
      return nextBest;
    }
    return sortedHand[0];
  }
};

