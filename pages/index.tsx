import * as React from "react";
import { Content } from "../src/components/ui/Content";
import RecipeHelperBody from "../src/components/RecipeHelperBody";
import Mic from "../src/components/listener/Mic";

const HomePage = () => {
  return (
    <Content>
      <Mic/>
      <RecipeHelperBody/>
    </Content>
  );
};

export default HomePage;
