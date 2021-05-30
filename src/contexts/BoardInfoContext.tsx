import React from "react";
import chess from "chess";

const BoardInfoContext = React.createContext(chess.create());
export const BoardInfoProvider = BoardInfoContext.Provider;
export default BoardInfoContext;
