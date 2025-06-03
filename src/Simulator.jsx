import { useEffect, useState } from "react";
import { AISelector } from "./AISelector";
import { generateHand, getWinnerIndex } from "./gameLogic";
import "./simulator.css";
import { isValid } from "./validator";
export const SimulatorUi = ({ availableAIs }) => {
  let [selectAIMode, setSelectAIMode] = useState(true);
  let [ais, setAIs] = useState([
    availableAIs[0],
    availableAIs[1],
    availableAIs[2],
  ]);
  let [simsPerClick, setSimsPerClick] = useState(5000);
  let [simData, setSimData] = useState([]);

  const handleAIChange = (newAi, idx) => {
    let newAIs = [...ais];
    newAIs[idx] = newAi;
    setAIs(newAIs);
  };

  const runGame = () => {
    let targets = generateHand(true);
    let hands = [generateHand(false), generateHand(false), generateHand(false)];
    let played = [[], [], []];
    let won = [[], [], []];
    for (let round = 0; round < targets.length; round++) {
      let targetsSoFar = targets.slice(0, round + 1);
      let plays = ais.map((ai, idx) => {
        let card = ai.getNextCard(
          [...hands[idx]],
          targetsSoFar,
          played.filter((pp) => pp != played[idx])
        );
        if (isValid(card, hands[idx])) {
          return card;
        } else {
          console.error(
            "Invalid card",
            card,
            "from",
            hands[idx],
            "played by AI",
            ai
          );
          return -1;
        }
      });
      let winner = getWinnerIndex(plays);
      if (winner > -1) {
        won[winner].push(targets[round]);
      }
      for (let idx = 0; idx < plays.length; idx++) {
        let play = plays[idx];
        hands[idx] = hands[idx].filter((c) => c != play);
        played[idx].push(play);
      }
    }
    return getGameSummary({ targets, played, won });
  };

  const getGameSummary = ({ targets, played, won }) => {
    // Sum the points for each player based on the cards they won
    let points = won.map((cardsWon) =>
      cardsWon.reduce((sum, card) => sum + card, 0)
    );

    // Determine the standings for each player
    let maxPoints = Math.max(...points);
    let standings = points.map((point) => {
      if (point === maxPoints) {
        // Check for ties
        return points.filter((p) => p === maxPoints).length > 1 ? "tie" : "win";
      } else {
        return "loss";
      }
    });

    return {
      targets,
      played,
      won,
      points,
      standings,
    };
  };

  const runGames = () => {
    let newData = [];
    for (let i = 0; i < simsPerClick; i++) {
      newData.push(runGame());
    }
    setSimData([...simData, ...newData]);
  };

  const getRecords = (simData) => {
    let wins = [0, 0, 0];
    let ties = [0, 0, 0];
    let losses = [0, 0, 0];
    for (let game of simData) {
      for (let idx = 0; idx < 3; idx++) {
        let result = game.standings[idx];
        if (result === "win") {
          wins[idx]++;
        } else if (result === "tie") {
          ties[idx]++;
        } else if (result === "loss") {
          losses[idx]++;
        }
      }
    }
    return { wins, ties, losses };
  };
  let records = getRecords(simData);

  const resetSim = () => {
    setSelectAIMode(true);
    setSimData([]);
  };

  return (
    <div>
      {selectAIMode ? (
        <div>
          <h2>Select your AI</h2>
          {ais.map((ai, idx) => (
            <div key={idx}>
              <label>
                AI # {idx + 1}
                <AISelector
                  selected={ai}
                  onSelect={(newAI) => handleAIChange(newAI, idx)}
                  idx={idx}
                  allAIs={availableAIs}
                />
              </label>
            </div>
          ))}
          <div>
            Selected:
            {ais.map((ai) => (
              <li key={ai.name}>{ai.name}</li>
            ))}
          </div>
          <button onClick={() => setSelectAIMode(false)}>Let's Play!</button>
        </div>
      ) : (
        <div>
          <header>
            <h2>Run Simulation!</h2>
            <button onClick={resetSim}>Reset</button>
            <button className="action" onClick={runGames}>
              Run Games
            </button>
            <label>
              Games per Click
              <input
                type="number"
                min="10"
                max="1000"
                value={simsPerClick}
                onChange={(e) => setSimsPerClick(Number(e.target.value))}
              />
            </label>
          </header>
          <main>
            <table>
              <thead>
                <tr>
                  <th>AI: </th>
                  {ais.map((ai, idx) => (
                    <th key={idx}>{ai.name}</th>
                  ))}
                </tr>
                <tr>
                  <th>Record:</th>
                  {ais.map((ai, idx) => (
                    <td>
                      {records.wins[idx]}&ndash;{records.losses[idx]}&ndash;
                      {records.ties[idx]}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Total Points</th>
                  {ais.map((ai, idx) => {
                    const totalPoints = simData.reduce(
                      (sum, gameInfo) => sum + gameInfo.points[idx],
                      0
                    );
                    return <td key={idx}>{totalPoints}</td>;
                  })}
                </tr>
              </thead>
              <tbody>
                {simData.map((gameData, idx) => (
                  <tr key={idx}>
                    <th>Round {idx + 1}</th>
                    {gameData.points.map((point, i) => (
                      <td key={i} className={gameData.standings[i]}>
                        {point}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      )}
    </div>
  );
};
