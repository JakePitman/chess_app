import React, { Dispatch, SetStateAction } from "react";

import Button from "../Button";
import styles from "./Menu.scss";
import { FreeImg, TestImg, ListImg } from "./images";

type Mode = "menu" | "free" | "test" | "list";

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
  linesCount: number | null;
  selectedLinesCount: number | null;
};

type MenuButtonProps = {
  handleClick: () => void;
  tooltipMsg: string;
  style: any;
  disabled?: boolean;
};

const MenuButton = ({
  handleClick,
  tooltipMsg,
  style,
  disabled = false,
}: MenuButtonProps) => {
  return (
    <div
      className={
        styles.outerButtonContainer + (disabled ? ` ${styles.disabled}` : "")
      }
      onClick={disabled ? null : handleClick}
    >
      <div className={styles.tooltip}>{disabled ? "X" : tooltipMsg}</div>
      <div className={styles.buttonContainer + " " + style} />
    </div>
  );
};

const Menu = ({ setMode, linesCount, selectedLinesCount }: Props) => {
  const testModeDisabled = selectedLinesCount < 1;
  const listModeDisabled = linesCount < 1;
  return (
    <div className={styles.container}>
      <MenuButton
        handleClick={() => setMode("free")}
        tooltipMsg={"Free"}
        style={styles.free}
      />
      <MenuButton
        handleClick={() => setMode("test")}
        tooltipMsg={"Test"}
        style={styles.test}
        disabled={testModeDisabled}
      />
      <MenuButton
        handleClick={() => setMode("list")}
        tooltipMsg={"List"}
        style={styles.list}
        disabled={listModeDisabled}
      />
    </div>
  );
};

export default Menu;
