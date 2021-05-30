import React, { Dispatch, SetStateAction } from "react";

import Button from "../Button";
import styles from "./Menu.scss";

type Mode = "menu" | "free" | "test" | "list";

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
};

const Menu = ({ setMode }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button text="FREE" onClick={() => setMode("free")} />
      </div>
      <div className={styles.buttonContainer}>
        <Button text="TEST" onClick={() => setMode("test")} />
      </div>
      <div className={styles.buttonContainer}>
        <Button text="LIST" onClick={() => setMode("list")} />
      </div>
    </div>
  );
};

export default Menu;
