export const madDummyAi = {
  name: "Mad Dummy", // a cute name
  icon: "https://pm1.narvii.com/6329/abf760cc4219eb4031540d01e0f6125848cd1823_00.jpg", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1];
    let previousTarget = targets[targets.length - 2];
    if (targets.length === 1) {
      // If this is the first round, play either the highest or lowest card
      if (nextTarget >= 10) {
        return Math.max(...hand);
      } else {
        return Math.min(...hand);
      }
    } else {
      let topThreeCards = hand.sort().slice(-3);
      if (nextTarget >= topThreeCards[0]) {
        // return a random card from top 3 cards in hand
        return topThreeCards[Math.floor(Math.random() * topThreeCards.length)];
      } else if (hand.includes(previousTarget)) {
        return previousTarget; // play the previous target
      } else if (hand.includes(previousTarget + 1)) {
        return previousTarget + 1; // play the next card up if I can't play the previous target
      } else if (hand.includes(previousTarget - 1)) {
        return previousTarget - 1; // play the next card down if I can't play the next card up
      } else {
        return Math.max(...hand); // play the highest card in hand
      }
    }
  },
};
