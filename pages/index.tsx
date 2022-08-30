import * as React from "react";
import { TestButton } from "../src/components/ButtonTest";
import { Content } from "../src/components/ui/Content";

const HomePage = (_props: any) => {
  return (
    <Content>
      <TestButton name={"HELLO"} />
    </Content>
  );
};

export default HomePage;
