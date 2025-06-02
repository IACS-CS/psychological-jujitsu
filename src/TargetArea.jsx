import { Card } from "./Card";

// Matt
export const TargetArea = ({ trash = [], target = 10, suit = "diamonds" }) => {
  return (
    <div>
      <div>
        Lost points:
        {trash.map((v) => (
          <Card key={v} value={v} suit={suit} />
        ))}
      </div>
      Target: <Card value={target} suit={suit} />
    </div>
  );
};
