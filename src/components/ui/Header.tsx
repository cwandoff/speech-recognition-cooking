// import { Typography } from "@mui/material";
import React, { FC } from "react";
import styles from "./Page.module.scss";
import RecipeHelperBody from "../RecipeHelperBody.tsx"
import { AppBar, Button, Container, TextField, Typography } from "@material-ui/core";

export const Header: FC = () => {
  return (
    // <nav className={styles.navigation}>
        <div className={styles.logo}>
          <Typography variant={"h4"}>Chef Big Al</Typography>
        </div>
    // </nav>
  );
};
