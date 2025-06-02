import { Card } from "./Card.jsx";

export const Hand = ({
  values = [],
  suit = "hearts",
  onCardPlayed = (c) => console.log("played ", c),
}) => {
  return (
    <div>
      {values.map((value) => (
        <Card
          key={value}
          onClick={() => onCardPlayed(value)}
          suit={suit}
          value={value}
        />
      ))}
    </div>
  );
};
