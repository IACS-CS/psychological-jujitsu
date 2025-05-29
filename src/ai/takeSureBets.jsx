export const takeSureBetsAi = {
  name: "Take Sure Bets", // a cute name
  icon: "-", // an image link
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1]; // this is the card we are playing for
    console.log(`TSB playing for `, nextTarget);
    let targetsLeft = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // all the cards we have left
    for (let i = 0; i < targets.length - 1; i++) {
      // remove each target we've seen
      targetsLeft = targetsLeft.filter((c) => c !== targets[i]);
    }
    // Make a list of how many cards we have that are higher than
    // any cards our opponents have (i.e. they both played their king,
    // and we still have ours)
    let weAreBetter = [];
    for (let i = 13; i > 1; i--) {
      if (
        opponentPlays.every(
          (p) => p.includes(i) || p[0] === undefined // work around bug
        )
      ) {
        if (hand.includes(i)) {
          weAreBetter.push(i);
        } else {
          continue;
        }
      } else {
        // Break out of loop -- someone has a better card than us...
        break;
      }
    }
    // If we have cards that are better than opponents, plan to save them
    // for the highest remaining targets...
    let plan = {}; // plan is a map from target to card
    for (let i = 0; i < weAreBetter.length; i++) {
      let target = targetsLeft[i]; // targets are ordered high to low
      let winningPlay = weAreBetter[i]; // cards we know will win are ordered high to low
      plan[target] = winningPlay; // map target to card
    }
    if (plan[nextTarget]) {
      // If we have a plan for the next target, play it
      console.log("TSB: We know we will win!", plan);
      return plan[nextTarget];
    }
    if (weAreBetter.length > 0) {
      console.log(`TSB knows it can win some cards: `, plan);
    }
    // Otherwise, we will have to make a non-guaranteed-to-win strategy...
    let remainingCards = hand.filter((c) => !weAreBetter.includes(c));
    let randoDelta = Math.floor(Math.random() * 6) - 3; // +/- 3
    // Let's get the average of the remaining cards, and generally play
    // higher cards for higher targets...
    let avgRemaining = Math.floor(
      remainingCards.reduce((a, b) => a + b, 0) / remainingCards.length
    );
    if (nextTarget > avgRemaining) {
      randoDelta += 1;
    } else {
      randoDelta -= 1;
    }
    let randoTarget = nextTarget + randoDelta;
    console.log(
      "TSB: No guaranteed win, spin the dice aiming for ",
      randoTarget
    );
    if (remainingCards.includes(randoTarget)) {
      // If we have a card that matches the random target, play it
      return randoTarget;
    } else {
      if (nextTarget > Math.max(...remainingCards)) {
        // If the highest card we want to play is lower than the target,
        // assume we will lose it...
        console.log(
          `TSB: Nevermind, we don't have that, let's just play low...`,
          Math.min(...remainingCards)
        );
        return Math.min(...remainingCards);
      } else {
        while (true) {
          console.log(`TSB: Ok, don't have that -- let's go higher!`);
          randoTarget = randoTarget + 1;
          if (remainingCards.includes(randoTarget)) {
            // If we have a card that matches the random target, play it
            console.log(
              `TSB: playing ${randoTarget} from remaining cards`,
              remainingCards
            );
            return randoTarget;
          } else if (randoTarget > 13) {
            // This condition should never be reached, but let's not risk
            // an infinite loop...
            // If we run out of cards, just play the highest one
            return Math.max(...remainingCards);
          }
        }
      }
    }
  },
};
