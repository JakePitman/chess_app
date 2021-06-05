import React, { useState, SetStateAction, Dispatch } from "react";

import styles from "./CommandColumn.scss";
import Button from "../Button";

type Props = {
  setRandomLine: () => void;
  lineTitle: string;
  startingPoint: number | "random";
  setStartingPoint: Dispatch<SetStateAction<number | "random">>;
};

const CommandColumn = ({ setRandomLine, lineTitle }: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <div className={styles.container}>
      <p className={styles.inputHeader}>{lineTitle}</p>
      <Button text="New line" onClick={setRandomLine} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default CommandColumn;
