import { rows, cols, gameBoard, playerMoves } from "./app.js";

export class Tile {
  #row
  #col
  #id
  #piece
  constructor(row, col, piece) {
    this.#row = row;
    this.#col = col;
    this.#id = "" + col + row;
    this.#piece = piece;
  }

  get row() { return this.#row; }
  get col() { return this.#col; }
  get piece() { return this.#piece; }
  get id() { return this.#id; }

  set row(r) { this.#row = r; }
  set col(c) { this.#col = c; }
  set piece(p) { this.#piece = p; }

  toString() {
    return `${this.col}${this.row}: ${this.piece.toString()}`;
  }
}

/* movement functions */
function outOfBounds(x) {
  return (x > 7 || x < 0);
}

function testMove(row, col) {
  if (outOfBounds(row) || outOfBounds(col)) return;

  const resident = gameBoard[row][col].piece;
  if (resident === null) {
    playerMoves.push(gameBoard[row][col]);
    return;
  }
  if (resident.alliance() !== this.alliance())
    playerMoves.push(gameBoard[row][col]);
}

function removeAlliance(tile) { //TODO rook, queen, and bishop will playerMoves = moves.filter(removeAlliance)
  return tile.piece.alliance !== this.alliance;
}

function moveRook(row, col) { 
  for(let d = 1; d < 8; ++d){
    const down = row + d;
    if(outOfBounds(down)) break;

    playerMoves.push(gameBoard[down][col]);
    if(gameBoard[down][col].piece != null) break;
  }
  for(let u = 1; u < 8; ++u){
    const up = row - u;
    if(outOfBounds(up)) break;
    
    playerMoves.push(gameBoard[up][col]);
    if(gameBoard[up][col].piece != null) break;
  }
  for(let l = 1; l < 8; ++l){
    const left = col - l;
    if(outOfBounds(left)) break;
    
    playerMoves.push(gameBoard[row][left]);
    if(gameBoard[row][left].piece != null) break;
  }
  for(let r = 1; r < 8; ++r){
    const right = col + 1;
    if(outOfBounds(right)) break;
    
    playerMoves.push(gameBoard[row][right]);
    if(gameBoard[row][right].piece != null) break;
  }
}

function moveBishop(row, col) {
  for(let dr = 1; dr < 8; ++dr){
    const down = row + dr;
    const right = col + dr;
    if(outOfBounds(down) || outOfBounds(right)) break;

    playerMoves.push(gameBoard[down][right]);
    if(gameBoard[down][right].piece != null) break;
  }
}

/* pieces */

class AnyPiece {
  #alliance
  #tile
  constructor(tile, color){
    this.#alliance = color;
    this.tile = tile;
  }
  get alliance() { return this.#alliance; }
  get tile() { return this.#tile; }

  set tile(t) { this.#tile = t };
}

export class Pawn extends AnyPiece{
  #name
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.#name = 'pawn';
    this.#icon = color === 'dark' ? 'asset/pawnDark.png' : 'asset/pawnLight.png';
  }
  get name() { return this.#name; }
  get icon() { return this.#icon; }

  toString() {
    return `${this.name}:${this.alliance}`
  }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    const direction = this.alliance == 'dark' ? 1 : -1;

    if (outOfBounds(xPosition + direction)) return;
    // first move both sides
    if (xPosition == 1 && this.alliance == 'dark') 
      testMove(xPosition + 2, yPosition);
    if (xPosition == 6 && this.alliance == 'light') 
      testMove(xPosition - 2, yPosition);
    
    // basic move
    testMove(xPosition + direction, yPosition);

    // check attack moves
    if (!outOfBounds(yPosition + 1) && !gameBoard[xPosition][yPosition + 1].piece === null)
      testMove(xPosition + direction, yPosition + 1);

    if (!outOfBounds(yPosition - 1) && !gameBoard[xPosition][yPosition - 1].piece === null)
      testMove(xPosition + direction, yPosition - 1);
    playerMoves.forEach((tile) => {
      document.getElementById(tile.id).classList.add('playerMove');
    });
  }
}