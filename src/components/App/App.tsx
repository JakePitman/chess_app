import React, { useState } from "react";
import axios from "axios";

import Menu from "../Menu";
import FreeMode from "../FreeMode";
import TestMode from "../TestMode";
import Button from "../Button";
import { Line } from "../../sharedTypes";
import styles from "./App.scss";

type Mode = "menu" | "free" | "test" | "list";

const App = () => {
  const [mode, setMode] = useState<Mode>("menu");
  const [lines, setLines] = useState<Line[] | null>(null);

  !lines &&
    axios.get("http://localhost:3000/lines").then((res) => {
      setLines(res.data);
    });

  const modes = {
    menu: <Menu setMode={setMode} />,
    free: <FreeMode returnToMenu={() => setMode("menu")} />,
    test: <TestMode lines={lines} />,
    list: <div>List</div>,
  };

  return (
    <div className={styles.container}>
      {lines ? (
        <>
          {mode !== "menu" && (
            <div className={styles.menuButtonContainer}>
              <Button text="MENU" onClick={() => setMode("menu")} />
            </div>
          )}
          {modes[mode]}
        </>
      ) : (
        <div>Failure retrieving lines. Ensure db is running on 3000</div>
      )}
    </div>
  );
};

export default App;
