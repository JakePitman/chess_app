import React, { Dispatch, SetStateAction } from "react";

import Button from "../Button";
import styles from "./Menu.scss";
import { FreeImg, TestImg, ListImg } from "./images";

type Mode = "menu" | "free" | "test" | "list";

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
};

const Menu = ({ setMode }: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.outerButtonContainer}
        onClick={() => setMode("free")}
      >
        <div className={styles.buttonContainer + " " + styles.free} />
      </div>
      <div
        className={styles.outerButtonContainer}
        onClick={() => setMode("test")}
      >
        <div className={styles.buttonContainer + " " + styles.test} />
      </div>
      <div
        className={styles.outerButtonContainer}
        onClick={() => setMode("list")}
      >
        <div className={styles.buttonContainer + " " + styles.list} />
      </div>
    </div>
  );
};

export default Menu;
