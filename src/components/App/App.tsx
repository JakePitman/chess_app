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

  const selectedLines = lines?.filter((line) => line.selected);

  const modes = {
    menu: (
      <Menu
        setMode={setMode}
        linesCount={lines?.length}
        selectedLinesCount={selectedLines?.length}
      />
    ),
    free: (
      <FreeMode
        returnToMenu={() => setMode("menu")}
        updateLinesFromDB={updateLinesFromDB}
      />
    ),
    test: <TestMode lines={selectedLines} />,
    list: <ListMode lines={lines} updateLinesFromDB={updateLinesFromDB} />,
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
        <div className={styles.dbFailureMessage}>
          <p>Failure retrieving lines</p>
          <p>Ensure db is running on 3000 with `yarn run backend`</p>
          <p>
            Run `yarn run resetDB` to reset DB, or create for the first time
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
