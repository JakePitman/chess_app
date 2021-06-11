import React from "react";

import styles from "./Button.scss";

type Props = {
  text: string;
  onClick: () => void;
};

const Button = ({ text, onClick }: Props) => {
  return (
    <div onClick={onClick} className={styles.button}>
      {text}
    </div>
  );
};

export default Button;
