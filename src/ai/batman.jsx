
export const batman = {
  name: "Batman", // a cute name
  icon: "dark-knight.png", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    const randomRoyal = () => {
      const royals = hand.filter((card) => card > 9);
      const randomIndex = Math.floor(Math.random() * royals.length);
      return royals[randomIndex];
    }
    let nextTarget = targets[targets.length-1]
    let royalPlacer = 0
    if (nextTarget > 9){
      royalPlacer++;
    }
    if (royalPlacer > 0){

      royalPlacer --;
      return randomRoyal();
    }
    if (nextTarget === 9){
      return 1;
    }
    if (nextTarget === 8){
      return 2;
    }
    if (nextTarget === 7){
      return 3;
    }
    if (nextTarget === 6){
      return 9;
    }
    if (nextTarget === 5){
      return 8;
    }
    if (nextTarget === 4){
      return 7;
    }
    if (nextTarget === 3){
      return 6;
    }
    if (nextTarget === 2){
      return 5;
    }
    if (nextTarget === 1){
      return 4;
    }

  },
};