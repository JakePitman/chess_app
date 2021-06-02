import React from "react";
import styles from "./ListMode.scss";

import { Line } from "../../sharedTypes";

type LineProps = {
  title: string;
};

const LineRow = ({ title }: LineProps) => {
  return (
    <div className={styles.lineRow}>
      <p className={styles.lineTitle}>{title}</p>;
    </div>
  );
};

type Props = {
  lines: Line[];
};

const ListMode = ({ lines }: Props) => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.columnsContainer}>
        <div className={styles.sideColumn}>
          <p className={styles.title}>Lines</p>
          {lines.map((line) => (
            <LineRow title={line.name} />
          ))}
        </div>
        <div>BOARD GOES HERE</div>
      </div>
    </div>
  );
};

export default ListMode;
