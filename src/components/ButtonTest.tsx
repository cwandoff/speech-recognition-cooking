import React, { FC } from "react";
import Button from "@mui/material/Button";

interface TestButtonProps {
  name: string;
}
export const TestButton: FC<TestButtonProps> = ({ name }) => {
  return (
    <div>
      <Button>{name}</Button>
    </div>
  );
};
