import MovesListType from "./MovesList";

type Line = {
  id: number;
  name: string;
  playercolor: string;
  moves: MovesListType;
  selected: boolean;
};

export default Line;
