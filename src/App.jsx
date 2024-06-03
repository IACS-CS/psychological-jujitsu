import "./App.css";
import { Card } from "./Card";
import { Hand } from "./Hand";
import { CardsPlayed } from "./CardsPlayed";
import { HumanPlayerArea } from "./HumanPlayerArea";
import { AISelector } from "./AISelector";
import { PlayerArea } from "./PlayerArea";
import { TargetArea } from "./TargetArea";
import { useEffect, useState } from "react";
import { orderedDummy, targetDummy } from "./dumbAi";
import { hinkleAi } from "./hinkleAi";
import { brucienAI } from "./brucienAi";
import { SimulatorUi } from "./Simulator";
import { generateHand, getWinnerIndex } from "./gameLogic";
import { randoAI } from "./randomAI";
import { johnnyAi } from "./johnnyAI";

const availableAIs = [orderedDummy, targetDummy, hinkleAi, brucienAI, randoAI, johnnyAi];

const GameUI = ({ availableAIs }) => {
  const targetSuit = "hearts";
  const otherSuits = [
    "diamonds",
    "spades",
    "clubs",
    "lizards",
    "fruit",
    "tshirts",
    "robots",
  ];
  const [numberOfAIs, setNumberOfAIs] = useState(2); // may never change
  const [ais, setAIs] = useState([orderedDummy, targetDummy]);
  const [trash, setTrash] = useState([]);
  const [humanHand, setHumanHand] = useState(generateHand());
  // generate a hand for each AI -- will need new logic if we actually
  // change the number of AIs
  const [useHumanPlayer, setUseHumanPlayer] = useState(true);
  let players = [null, ...ais];

  const [hands, setHands] = useState(players.map((a) => generateHand()));
  const [targets, setTargets] = useState(generateHand(true));
  const [targetIndex, setTargetIndex] = useState(0);
  const [humanWon, setHumanWon] = useState([]);
  const [playedCards, setPlayedCards] = useState(players.map((a) => []));
  const [wonCards, setWonCards] = useState(players.map((a) => []));

  const handleAIChange = (newAI, idx) => {
    // Create a new list with the updated AI at the specified index
    const updatedAIs = [...ais];
    updatedAIs[idx] = newAI;
    // Update the state with the new AI list
    setAIs(updatedAIs);
  };
  /*
   * @return the index of winner, or -1 if no one wins
   */

  /*
   * onCardPlayed takes a single human play and then uses it to
   * trigger our AI plays which in turn trigger the update to the
   * game for the next round. Basically all the logic for each
   * round of the game is contained in onCardPlayed :-)
   */
  const onCardPlayed = (humanCard) => {
    // Update the human player first:
    // 1. add played card to "played" list
    // 2. Remove played card from hand
    // Now iterate through the AI to find out the AI plays...
    // AI needs to know what cards we've bid on (targetsSoFar)

    // Make an array to store the decisions of each AI player...
    let humanCards = [humanCard];
    // Get each AI's play
    playAIs(humanCards);
  };

  const playAIs = (humanCards = []) => {
    let cardsPlayedThisRound = [];
    let targetsSoFar = targets.slice(0, targetIndex + 1);
    ais.forEach((ai) => {
      let myHand = hands[cardsPlayedThisRound.length];
      let myPlayed = playedCards[cardsPlayedThisRound.length];
      let card = ai.getNextCard(
        myHand,
        targetsSoFar,
        playedCards.filter((pp) => pp != myPlayed)
      );
      cardsPlayedThisRound.push(card);
    });
    cardsPlayedThisRound = [...cardsPlayedThisRound, ...humanCards];
    setPlayedCards(
      playedCards.map((played, idx) => [...played, cardsPlayedThisRound[idx]])
    );
    // Remove played cards from list of cards
    setHands(
      hands.map((hand, idx) =>
        hand.filter((card) => card !== cardsPlayedThisRound[idx])
      )
    );
    // Finally, let's update the winner and the target...
    // Pick the winner, and update...
    let winner = getWinnerIndex(cardsPlayedThisRound);
    if (winner === -1) {
      setTrash([...trash, targets[targetIndex]]);
    } else {
      const newWon = [...wonCards];
      newWon[winner] = [...newWon[winner], targets[targetIndex]];
      setWonCards(newWon);
    }
    setTargetIndex(targetIndex + 1);
  };

  const resetGame = () => {
    setTargets(generateHand(true));
    setHands(players.map((a) => generateHand()));
    setHumanHand(generateHand());
    setWonCards(players.map((a) => []));
    setPlayedCards(players.map((a) => []));
    setTrash([]);
    setTargetIndex(0);
  };

  useEffect(() => {
    if (useHumanPlayer) {
      setAIs(ais.slice(0, 2));
    } else {
      if (ais.length < 3) {
        setAIs([...ais, availableAIs[0]]);
      }
    }
  }, [useHumanPlayer]);

  return (
    <main>
      <h1 className="header">Psychological Jujitsu</h1>
      <div className="target">
        <TargetArea
          target={targets[targetIndex]}
          trash={trash}
          suit={targetSuit}
        />
      </div>

      {ais.map((ai, idx) => (
        <div className={`aiPlayer player-${idx + 1}`}>
          <AISelector
            selected={ai}
            onSelect={(newAI) => handleAIChange(newAI, idx)}
            idx={idx}
            allAIs={availableAIs}
          ></AISelector>

          <PlayerArea
            ai={ai}
            suit={otherSuits[idx]}
            hand={hands[idx]}
            playedValues={playedCards[idx]}
            cardsWon={wonCards[idx]}
          />
        </div>
      ))}
      {useHumanPlayer ? (
        <div className="human">
          <h2>Human Area</h2>
          <HumanPlayerArea
            onCardPlayed={onCardPlayed}
            handValues={hands[2]}
            playedValues={playedCards[2]}
            cardsWon={wonCards[2]}
            suit={otherSuits[2]}
          />
        </div>
      ) : (
        <div />
      )}

      <div className="round">
        {targetIndex <= 12 ? (
          <div>Round {targetIndex + 1}</div>
        ) : (
          <button onClick={resetGame}>New Game?</button>
        )}
        <button onClick={() => setUseHumanPlayer(!useHumanPlayer)}>
          Switch to {useHumanPlayer ? "All AI" : "Human player"}
        </button>
        <div class="instructions">
          {useHumanPlayer ? (
            "Click a Card to Play It"
          ) : (
            <button onClick={() => playAIs([])} disabled={targetIndex > 12}>
              Next Turn
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

const App = () => {
  const UNSET = 0;
  const GAME_MODE = 1;
  const SIM_MODE = 2;
  let [gameMode, setGameMode] = useState(0);
  return (
    <div>
      {gameMode === GAME_MODE ? (
        <GameUI availableAIs={availableAIs} />
      ) : gameMode === SIM_MODE ? (
        <SimulatorUi availableAIs={availableAIs} />
      ) : (
        <div>
          <button onClick={() => setGameMode(GAME_MODE)}>Play Game</button>
          <button onClick={() => setGameMode(SIM_MODE)}>Run Simulations</button>
        </div>
      )}
    </div>
  );
};

export default App;
