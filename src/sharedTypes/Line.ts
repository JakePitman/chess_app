import MovesListType from "./MovesList";

type Line = {
  name: string;
  playercolor: string;
  moves: MovesListType;
  selected: boolean;
};

export default Line;
