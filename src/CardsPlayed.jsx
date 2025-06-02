//AP and AP
import { Card } from "./Card";

export const CardsPlayed = ({ values = [], suit = "hearts" }) => {
  return (
    <div>
      {values.map((value) => (
        <Card key={value} value={value} suit={suit} />
      ))}
    </div>
  );
};
