export const kendrickAi = {
  name: "KendrickLamar", // a cute name
  icon: "kendrick-icon.jpg", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1];
    if (nextTarget === 10) {
      return 2;
    }
    if (nextTarget === 9) {
      return 3;
    }
    if (nextTarget === 8) {
      return 4;
    }
    if (nextTarget === 7) {
      return 11;
    }
    if (nextTarget === 6) {
      return 10;
    }
    if (nextTarget === 5) {
      return 9;
    }
    if (nextTarget === 4) {
      return 8;
    }
    if (nextTarget === 3) {
      return 7;
    }
    if (nextTarget === 2) {
      return 6;
    }
    if (nextTarget === 1) {
      return 5;
    }
    if (nextTarget === 13) {
      return 13; // play the highest card in hand
    }
    if (nextTarget === 12) {
      return 12; // play the second highest card in hand
    }
    if (nextTarget === 11) {
      return 1;
    }
  },
};
