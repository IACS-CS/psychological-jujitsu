export const sampleAi = {
  name: "Give Me A Name", // a cute name
  icon: "-", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1]; // this is the card we are playing for
    // implement a strategy -- here's one for example (delete this and replace with your own)

    if (Math.random() > 0.5) {
      // flip a coin...
      // 50% chance to play a random card
      let cardIndex = Math.floor(Math.random() * hand.length);
      return hand[cardIndex]; // play a random card
    } else {
      // otherwise, just play the target if we can...
      if (hand.includes(nextTarget)) {
        // If I can, play it!
        return nextTarget;
      } else if (hand.includes(nextTarget + 1)) {
        // If I can't, play the next card up
        return nextTarget + 1;
      } else {
        // If I can't, play the lowest card
        return Math.min(...hand); // play the lowest card in hand
      }
    }
  },
};
