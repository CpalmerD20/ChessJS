import {gameBoard, playerMoves} from "./app.js";

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

/* movement */
function outOfBounds(x) {
  return (x > 7 || x < 0);
}

function testMove(row, col) {
  if(outOfBounds(row) || outOfBounds(col)) return;
    
  const resident = gameBoard[row][col].piece();
  if(resident === null) {
    playerMoves.push(gameBoard[row][col]);
    return;
  }
  if(resident.alliance() !== this.alliance())
    playerMoves.push(gameBoard[row][col]);
  return;
}

/* pieces */
export class Pawn {
  #name
  #alliance
  #tile
  #icon
  constructor (tile, color) {
    this.#name = 'pawn';
    this.#tile = tile;
    this.#alliance = color;
    this.#icon = color === 'dark' ? 'asset/pawnDark.png' : 'asset/pawnLight.png';
  }
  get name() { return this.#name; }
  get alliance() { return this.#alliance; }
  get icon() { return this.#icon; }
  get tile() { return this.#tile; }

  set tile(t) { this.#tile = t};

  toString() {
    return `${this.name}:${this.alliance}`
  }
  getMoves() {
    playerMoves = [];
    const yPosition = this.tile().col().indexOf();
    const xPosition = this.tile().row().indexOf();
    const direction = this.alliance() == 'dark' ? 1 : -1;

    if(this.tile().row() == 7 && this.alliance == 'dark') {
      testMove(xPosition + (direction * 2), yPosition);
    }
    if(this.tile().row() == 2 && this.alliance == 'light') {
      testMove(xPosition + (direction * 2), yPosition);
    }
    testMove(xPosition + direction, yPosition);
    checkAttack(xPosition, yPosition, direction);
  }
  checkAttack(xPos, yPos, d) {
    if(outOfBounds(xPos + d)) return;

    if(!outOfBounds(yPos + 1) && gameBoard[xPos][yPos + 1].piece() !== null)
      testMove(xPos + d, yPos + 1);
    if(!outOfBounds(yPos - 1) && gameBoard[xPos][yPos - 1].piece() !== null)
      testMove(xPos + d, yPos - 1);
    return;
  }
}