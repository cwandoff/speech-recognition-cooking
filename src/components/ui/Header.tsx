import { Typography } from "@mui/material";
import React, { FC } from "react";
import styles from "./Page.module.scss";

export const Header: FC = () => {
  return (
    <nav className={styles.navigation}>
        <div className={styles.logo}>
          <Typography variant={"h5"}>Welcome To Chuck's World</Typography>
        </div>
    </nav>
  );
};
