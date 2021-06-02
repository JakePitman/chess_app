import React, { useState } from "react";
import axios from "axios";

import Menu from "../Menu";
import FreeMode from "../FreeMode";
import TestMode from "../TestMode";
import ListMode from "../ListMode";
import Button from "../Button";
import { Line } from "../../sharedTypes";
import styles from "./App.scss";

type Mode = "menu" | "free" | "test" | "list";

const App = () => {
  const [mode, setMode] = useState<Mode>("menu");
  const [lines, setLines] = useState<Line[] | null>(null);

  const updateLinesFromDB = () => {
    axios.get("http://localhost:3000/lines").then((res) => {
      setLines(res.data);
    });
  };

  !lines && updateLinesFromDB();

  const modes = {
    menu: <Menu setMode={setMode} linesCount={lines?.length} />,
    free: (
      <FreeMode
        returnToMenu={() => setMode("menu")}
        updateLinesFromDB={updateLinesFromDB}
      />
    ),
    test: <TestMode lines={lines} />,
    list: <ListMode lines={lines} />,
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
