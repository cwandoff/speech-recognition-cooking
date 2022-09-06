import React, { FC } from "react";
import { Header } from "./Header";
import styles from "./Page.module.scss";

interface contentProps{
  children: React.ReactNode
}

export const Content: FC<contentProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      <Header/>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
