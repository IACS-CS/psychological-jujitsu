import { useState, useRef, useEffect } from "react";
import { Card } from "./Card";

// Sam and Tristan

export const ScoreDisplay = ({ values = [], suit = "hearts", round = 1 }) => {
  const [justUpdated, setJustUpdated] = useState(false);
  let sum = 0;
  values.forEach((v) => {
    sum = sum + v;
  });
  const prevSum = useRef(sum);
  useEffect(() => {
    if (prevSum.current !== sum) {
      setJustUpdated(true);
      prevSum.current = sum;
    } else {
      setJustUpdated(false);
    }
  }, [sum]);
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div style={{ position: "relative", width: 400 }}>
        {values.map((value, idx) => (
          <div
            style={{ left: 30 * idx, position: "absolute" }}
            key={value}
            className={
              justUpdated && idx === values.length - 1
                ? "card-updated card-container"
                : "card-container"
            }
          >
            <Card value={value} suit={suit} />
          </div>
        ))}
      </div>
      <div className={justUpdated ? "score score-updated" : "score"}>{sum}</div>
    </div>
  );
};
