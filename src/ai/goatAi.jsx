export const GoatAI = {
  name: "GoatAI", // a cute name
  icon: "-", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    // Play a random card!
    if ([1, 2, 3, 4].includes(targets[0])) {
      if(hand.includes(targets[0])){
        return targets[0];
      }
      if(hand.includes(targets[0] + 1)) {
        return targets[0] + 1;
      }
      if(hand.includes(targets[0 - 1])) {
        return targets[0] - 1;
      }
      else {
        return Math.min(...hand);
      }
    }
    return hand[index];
  },
};
