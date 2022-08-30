import React, { FC } from "react";
import { Header } from "./Header";
import styles from "./Page.module.scss";

interface pageProps{
  children: React.ReactNode
}

export const Page: FC<pageProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      <Header/>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
