let substitution = {
  "K": "♔",
  "Q": "♕",
  "R": "♖",
  "B": "♗",
  "N": "♘",
  "P": "♙",
  "k": "♚",
  "q": "♛",
  "r": "♜",
  "b": "♝",
  "n": "♞",
  "p": "♟"
};
let len;
let board_gen = (fen, white, black) => {
  let error = [];
  let send = true;
  let ertrue = false;
  let move = "";
  // Takes FEN string and converts to USER-READABLE board position. Outputs [error, board after processing error if applicable] if incorrect. If correct, outputs [error, board]. error will be false.
  let posstr = "";
  let splitted = fen.split(/ +/g);
  let lines = splitted[0].split("/");
  let board = [["□","■","□","■","□","■","□","■"],
    ["■","□","■","□","■","□","■","□"],
    ["□","■","□","■","□","■","□","■"],
    ["■","□","■","□","■","□","■","□"],
    ["□","■","□","■","□","■","□","■"],
    ["■","□","■","□","■","□","■","□"],
    ["□","■","□","■","□","■","□","■"],
    ["■","□","■","□","■","□","■","□"]];
  for (let i = 0; i < 8; i++) {
    len = lines[i].length;
    let marker = 0;
    for (let j = 0; j < len; j++) {
      let parsed = parseInt(lines[i].charAt(j));
      if (parsed !== parsed) {
        board[i][marker] = substitution[lines[i].charAt(j)];
        marker++;
      } else {
        marker += parsed;
      }
      
      if (marker >= 7 && j != len - 1) {
        error.push("Rank " + (8-i) + " exceeded 8 squares in parsing. Extra content will be truncated.");
        ertrue = true;
        break;
      }
    }
    if (marker < 7) {
      error.push("Rank " + (8-i) + " did not reach 8 squares in parsing. Empty squares have been appended.");
      ertrue = true;
    }
  }
  switch (splitted[1]) {
    case "w":
      move = "white";
      break;
    case "b":
      move = "black";
      break;
    default:
      error.push("Second argument for FEN is not 'w' or 'b'. Please correct. No corrected board position will be provided.");
      ertrue = true;
  }
  let castling = [false, false, false, false]; // [kingside white, queenside white, kingside black, queenside black]
  if (splitted[2] != "-") {
    let cas = splitted[2].split("");
    len = cas.length;
    let valid = ["K","Q","k","q"];
    for (let i = 0; i < len; i++) {
      let ind = valid.indexOf(cas[i]);
      if (ind == -1) {
        error.push("An invalid castling letter was found in the third argument. Please correct. No corrected board position will be provided.");
        ertrue = true;
        continue;
      }
      castling[ind] = true;
    }
  }
  if (splitted[3] != "-") {
    let row = splitted[3].charAt(0);
    let column = splitted[3].charAt(1);
    
  }
}
let state_gen = (fen) => {
  // Takes FEN string and converts to MACHINE-READABLE board condition.
}
let to_fen = (pos) => {
  // Takes MACHINE-READABLE board condition and converts to a usable FEN string.
}
let validity = (move, pos) => {
  // Checks if a move is valid or not.
}
let in_check = (side, pos) => {
  // Checks if side is in check based on pos.
}
let move = (move, pos) => {
  // Makes a move, updating pos.
}
let checkmate = (pos) => {
  // Checks if either side is checkmated. If a side is checkmated, it returns that side. Otherwise, it returns none.
}
let stalemate = (pos, stalemated) => {
  // Checks if side stalemated is stalemated. If that side is stalemated, returns true. Otherwise, it returns false.
}
let impossible = (pos) => {
  // Checks if mate is impossible.
}
