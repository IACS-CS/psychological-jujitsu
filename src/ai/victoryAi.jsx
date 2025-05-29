export const victoryAi = {
  name: "Ultimate Learner",
  icon: "🚀",
  getNextCard: (hand, targets, opponentPlays) => {
    const rounds = targets.length;
    const T = targets[rounds - 1];
    const sorted = [...hand].sort((a, b) => a - b);
    const lowest = sorted[0];

    // 1) Detect opponents who play T + 1
    let seesPlusOne = opponentPlays.some(plays =>
      plays.some((p, i) => targets[i] + 1 === p)
    );
    if (seesPlusOne) {
      const counter = T + 2;
      if (sorted.includes(counter)) return counter;
    }

    // 2) Try to beat the target by 1
    const minimalWin = sorted.find(c => c > T);
    if (minimalWin) return minimalWin;

    // 3) Use high cards against royal targets
    if (T > 10) {
      const royals = sorted.filter(c => c > 10);
      if (royals.length) return Math.max(...royals);
    }

    // 4) Otherwise, dump your lowest card
    return lowest;
  }
};
