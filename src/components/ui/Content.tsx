import React, { FC } from "react";
import styles from "./Page.module.scss";
import { Grid } from "@material-ui/core";

interface contentProps{
  children: React.ReactNode
}

export const Content: FC<contentProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {children}</div>
    </div>
  );
};
