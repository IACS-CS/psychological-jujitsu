export const sortOfSmart = {
  name: "Brad", // a cute name
  icon: "https://generated.photos/human-generator/66572613aa0e81000fb3b298", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    let nextPlay = hand.length;
    return nextPlay;
  },
};