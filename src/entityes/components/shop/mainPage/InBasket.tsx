import { NumberField } from "@heroui/react";
import { useState } from "react";

const InBasket = () => {
  const [value, setValue] = useState<number>(0);
  return (
    <NumberField
      aria-label="Item in basket"
      value={value}
      onChange={setValue}
      step={1}
      minValue={0}
      maxValue={200}
      className={"scale-80"}
    >
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
};

export default InBasket;
