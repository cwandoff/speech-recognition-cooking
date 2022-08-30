import * as React from "react";
import { TestButton } from "../src/components/ButtonTest";
import { Page } from "../src/components/ui/Page";

const HomePage = (_props: any) => {
  return (
    <Page>
      <TestButton name={"HELLO"} />
    </Page>
  );
};

export default HomePage;
