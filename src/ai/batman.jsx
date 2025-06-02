
export const batman = {
  name: "Batman", // a cute name
  icon: "dark-knight.png", // an image link
  getNextCard: (hand, targets, opponentPlays) => {


    const randomRoyal = () => {
      const royals = hand.filter((card) => card > 9 && card <= 13);
      const randomIndex = Math.floor(Math.random() * royals.length);
      return royals[randomIndex];
    }
    let nextTarget = targets[targets.length-1]
//    let royalPlacer = 0
    if (nextTarget >= 7 && nextTarget <= 10){
      // if the target is 7-10, play a royal card
    let royal = randomRoyal();
    if (royal) {
      return royal;
    }

   //between 1 to 9, higher than opponent's last play 
    let lastOpponentPlay = opponentPlays[opponentPlays.length - 1];
    if (nextTarget < 10 || nextTarget >= 13) {
      // if the target is less than or equal to 13 or greater than 10, play a card between 1 and 9
      for (let i = 0; i < hand.length; i++) {
        if (hand[i] <= 9 && hand[i] > lastOpponentPlay) {
          // if the card is less than or equal to 9 and higher than the opponent's last play, play it
            let card = hand[i];

          return card;
        }
        }
      }
    }
   
    // otherwise, play a random card
    const randomIndex = Math.floor(Math.random() * hand.length);
    let card = hand[randomIndex];
    return card;
  }
}