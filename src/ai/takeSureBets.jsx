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
    let { plan, weAreBetter } = createPlanForSureBets(
      opponentPlays,
      hand,
      targetsLeft
    );
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

    if (nextTarget > 7) {
      // For targets higher than 7, let's assume a value of up to +2
      let viableCards = remainingCards.filter(
        (c) => c >= nextTarget - 1 && c <= nextTarget + 2
      );
      if (viableCards.length == 0) {
        console.log("TSB: we have no viable cards, playing low");
        // If we assume we will lose, just play the lowest card
        return Math.min(...remainingCards); // play the lowest card
      } else if (viableCards.length == 1) {
        console.log("TSB: playing our only viable card", viableCards[0]);
        return viableCards[0];
      } else {
        // Ok, so we have some decent candidates... we prefer
        // cards our opponents don't have because they are more
        // likely to be unique plays and win (?)
        let playedCount = {};
        let maxRanking = 0;

        for (let candidate of viableCards) {
          playedCount[candidate] = 0; // initialize rankings
          for (let opponentPlay of opponentPlays) {
            if (opponentPlay.includes(candidate)) {
              // If the opponent has played this card already, it is stronger...
              playedCount[candidate] += 1;
            }
          }
        }
        viableCards.sort(() => Math.random() - 0.5); // shuffle viable cards
        console.log("TSB analyzing viable cards", viableCards);
        // Now play the lowest card that has the highest ranking
        let maybePlay = 0;
        for (let candidate of viableCards) {
          if (playedCount[candidate] === 1) {
            // If only one of them has played this card, we play it to prevent the other from winning
            console.log("TSB: playing candidate for a tie", candidate);
            return candidate;
          } else {
            if (!maybePlay && playedCount[candidate] == 2) {
              maybePlay = candidate; // first candidate
            }
          }
        }
        if (maybePlay) {
          console.log("TSB: playing card neither opponent has", maybePlay);
          return maybePlay; // play the first candidate that has a ranking of 2
        } else {
          let choice =
            viableCards[Math.floor(Math.random() * viableCards.length)];
          console.log(
            "TSB playing at random from candidates",
            viableCards,
            "=>",
            choice
          );
          if (Math.random() < 0.3) {
            console.log(
              "TSB: psych! randomly playing low card",
              Math.min(...remainingCards)
            );
            return Math.min(...remainingCards); // play the lowest card
          }
          return choice;
        }
      }
    }
    let targetCandidates = remainingCards.filter((c) => c <= nextTarget);
    if (targetCandidates.length > 0) {
      // If we have cards that are lower than the target, play the highest one
      let choice =
        targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
      console.log("TSB: randomly playing ", choice, "from ", targetCandidates);
      return choice;
    } else {
      // Just play lowest remaining card...
      console.log(
        "TSB: playing lowest remaining card",
        Math.min(...remainingCards)
      );
      return Math.min(...remainingCards);
    }
  },
};
function createPlanForSureBets(opponentPlays, hand, targetsLeft) {
  let weAreBetter = [];
  for (let i = 13; i > 1; i--) {
    if (
      opponentPlays.every(
        (p) => p.includes(i) || (p.length && p[0] === undefined) // work around bug
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
  return { plan, weAreBetter };
}
