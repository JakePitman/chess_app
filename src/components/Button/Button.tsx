import React from "react";

import styles from "./Button.scss";

type Props = {
  text: string;
  onClick: () => void;
  clickable?: boolean;
};

const Button = ({ text, onClick, clickable = true }: Props) => {
  return (
    <div
      onClick={clickable ? onClick : null}
      className={styles.button + ` ${!clickable && styles.disabled}`}
    >
      {text}
    </div>
  );
};

export default Button;
