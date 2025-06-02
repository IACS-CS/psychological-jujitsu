export const emoRAI = {
  name: "emoR", // a cute name
  icon: "-", // an image link
getNextCard: (hand, targets, opponentPlays) => {
  let weight = 0;
  let best;
  let cardsLeft = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  let cardOptions = []
  let nextTarget = targets[targets.length - 1];

  let handA = cardsLeft.filter((card)=>!opponentPlays[0].includes(card))
  let handB = cardsLeft.filter((card)=>!opponentPlays[1].includes(card))


  // Handle special cases for targets 13 and 12
  if (nextTarget === 13) {
    return hand.includes(12) ? 12 : hand[0]; // Return 12 if available
  } else if (nextTarget === 12) {
    return hand.includes(11) ? 11 : hand[0]; // Return 11 if available
  } else {return hand[nextTarget-1]}

  // General logic for other targets
  

}
}
