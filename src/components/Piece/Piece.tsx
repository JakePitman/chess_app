import React from "react";
import { useDrag } from "react-dnd";

import whiteBishop from "./images/white-bishop.png";

import styles from "./Piece.scss";
import { PieceName, Side } from "../../sharedTypes";

type Props = {
  pieceInfo: { side: { name: Side }; type: PieceName };
  location: { rank: number; file: string };
};

const Piece = ({ pieceInfo, location }: Props) => {
  const { type, side } = pieceInfo;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: {
      pieceName: type,
      square: location,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return type && side.name ? (
    <div className={isDragging ? styles.dragging : styles.container} ref={drag}>
      <div
        className={styles.piece + " " + styles[`${side.name}-${type}`]}
      ></div>
    </div>
  ) : (
    <></>
  );
};

export default Piece;
