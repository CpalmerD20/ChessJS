import { rows, cols, gameBoard, playerMoves, activePiece } from "./app.js";

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
export let legalMoves = [];

function outOfBounds(x) {
  return (x > 7 || x < 0);
}

function showLegalMoves() {
  legalMoves = [];

  legalMoves = playerMoves.filter(tile => {
    return tile.piece == null || tile.piece.alliance !== activePiece.alliance;
  })
  legalMoves.forEach((tile) => {
    document.getElementById(tile.id).classList.add('playerMove');
  });
}

function testMove(row, col) {
  if (outOfBounds(row) || outOfBounds(col)) return;
    playerMoves.push(gameBoard[row][col]);
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
    const right = col + r;
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
  for(let dl = 1; dl < 8; ++dl) {
    const down = row + dl;
    const left = col - dl;
    if(outOfBounds(down) || outOfBounds(left)) break;

    playerMoves.push(gameBoard[down][left]);
    if(gameBoard[down][left].piece != null) break;
  }
  for(let ur = 1; ur < 8; ++ur){
    const up = row - ur;
    const right = col + ur;
    if(outOfBounds(up) || outOfBounds(right)) break;

    playerMoves.push(gameBoard[up][right]);
    if(gameBoard[up][right].piece != null) break;
  }
  for(let ul = 1; ul < 8; ++ ul){
    const up = row - ul;
    const left = col - ul;
    if(outOfBounds(up) || outOfBounds(left)) break;

    playerMoves.push(gameBoard[up][left]);
    if(gameBoard[up][left].piece != null) break;
  }
}

/* pieces */

class AnyPiece {
  #alliance
  #tile
  #name
  constructor(tile, color){
    this.#alliance = color;
    this.tile = tile;
  }
  get alliance() { return this.#alliance; }
  get tile() { return this.#tile; }
  get name() { return this.#name; }

  set name(n) {this.#name = n; }
  set tile(t) { this.#tile = t; }

  toString() {
    return `${this.name}:${this.alliance}`
  }
}

export class Pawn extends AnyPiece {
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.name = 'pawn';
    this.#icon = color === 'dark' ? 'asset/pawnDark.png' : 'asset/pawnLight.png';
  }
  get icon() { return this.#icon; }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    const direction = this.alliance == 'dark' ? 1 : -1;
    const newX = xPosition + direction;
    if (outOfBounds(newX)) return;

    if(gameBoard[newX][yPosition].piece === null) //basic move 
      testMove(newX, yPosition); 
    if (xPosition == 1 && this.alliance == 'dark') //first move dark pawns
      testMove(xPosition + 2, yPosition);
    if (xPosition == 6 && this.alliance == 'light') //first move light pawns
      testMove(xPosition - 2, yPosition);
    if (!outOfBounds(yPosition + 1) && gameBoard[newX][yPosition + 1].piece !== null)
      testMove(newX, yPosition + 1); //attack move right
    if (!outOfBounds(yPosition - 1) && gameBoard[newX][yPosition - 1].piece !== null)
      testMove(newX, yPosition - 1); //attack move left
    showLegalMoves();
  }
}

export class Knight extends AnyPiece {
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.name = 'knight';
    this.#icon = color === 'dark' ? 'asset/knightDark.png' : 'asset/knightLight.png';
  }
  get icon() { return this.#icon; }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    testMove(xPosition +1, yPosition +2);
    testMove(xPosition +1, yPosition -2);
    testMove(xPosition +2, yPosition +1);
    testMove(xPosition +2, yPosition -1);
    testMove(xPosition -1, yPosition +2);
    testMove(xPosition -1, yPosition -2);
    testMove(xPosition -2, yPosition +1);
    testMove(xPosition -2, yPosition -1);
    showLegalMoves();
  }
}

export class Rook extends AnyPiece {
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.name = 'rook';
    this.#icon = color === 'dark' ? 'asset/rookDark.png' : 'asset/rookLight.png';
  }
  get icon() { return this.#icon; }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    moveRook(xPosition, yPosition);
    showLegalMoves();
  }  
}

export class Bishop extends AnyPiece {
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.name = 'bishop';
    this.#icon = color === 'dark' ? 'asset/bishopDark.png' : 'asset/bishopLight.png';
  }
  get icon() { return this.#icon; }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    moveBishop(xPosition, yPosition);
    showLegalMoves();
  }
}

export class Queen extends AnyPiece {
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.name = 'queen';
    this.#icon = color === 'dark' ? 'asset/queenDark.png' : 'asset/queenLight.png';
  }
  get icon() { return this.#icon; }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    moveRook(xPosition, yPosition);
    moveBishop(xPosition, yPosition);
    showLegalMoves();
  }
}

export class King extends AnyPiece {
  #icon
  constructor(tile, color) {
    super(tile, color);
    this.name = 'king';
    this.#icon = color === 'dark' ? 'asset/kingDark.png' : 'asset/kingLight.png';
  }
  get icon() { return this.#icon; }

  getMoves() {
    const yPosition = cols.indexOf(this.tile.col);
    const xPosition = rows.indexOf(this.tile.row);
    testMove(xPosition +1, yPosition +1);
    testMove(xPosition +1, yPosition -1);
    testMove(xPosition +1, yPosition);
    testMove(xPosition -1, yPosition);
    testMove(xPosition -1, yPosition +1);
    testMove(xPosition -1, yPosition -1);
    testMove(xPosition, yPosition +1);
    testMove(xPosition, yPosition -1);
    showLegalMoves();
  }
}

export function createPieces(){
  for(let i = 0; i < 8; i++){
    const pawnDark = new Pawn(gameBoard[1][i], 'dark');
    const pawnLight = new Pawn(gameBoard[6][i], 'light');
    gameBoard[1][i].piece = pawnDark;
    gameBoard[6][i].piece = pawnLight;
  }
  const knightDark01 = new Knight(gameBoard[0][1], 'dark');
  const knightDark06 = new Knight(gameBoard[0][6], 'dark');
  const knightLight71 = new Knight(gameBoard[7][1], 'light');
  const knightLight76 = new Knight(gameBoard[7][6], 'light');
  gameBoard[0][1].piece = knightDark01;
  gameBoard[0][6].piece = knightDark06;
  gameBoard[7][1].piece = knightLight71;
  gameBoard[7][6].piece = knightLight76;

  const rookDark00 = new Rook(gameBoard[0][0], 'dark');
  const rookDark07 = new Rook(gameBoard[0][7], 'dark');
  const rookLight70 = new Rook(gameBoard[7][0], 'light');
  const rookLight77 = new Rook(gameBoard[7][7], 'light');
  gameBoard[0][0].piece = rookDark00;
  gameBoard[0][7].piece = rookDark07;
  gameBoard[7][0].piece = rookLight70;
  gameBoard[7][7].piece = rookLight77;

  const bishopDark02 = new Bishop(gameBoard[0][2], 'dark');
  const bishopDark05 = new Bishop(gameBoard[0][5], 'dark');
  const bishopDark72 = new Bishop(gameBoard[7][2], 'light');
  const bishopDark75 = new Bishop(gameBoard[7][5], 'light');
  gameBoard[0][2].piece = bishopDark02;
  gameBoard[0][5].piece = bishopDark05;
  gameBoard[7][2].piece = bishopDark72;
  gameBoard[7][5].piece = bishopDark75;

  const queenDark03 = new Queen(gameBoard[0][3], 'dark');
  const queenLight73 = new Queen(gameBoard[7][3], 'light');
  gameBoard[0][3].piece = queenDark03;
  gameBoard[7][3].piece = queenLight73;

  const kingDark04 = new King(gameBoard[0][4], 'dark');
  const kingDark74 = new King(gameBoard[7][4], 'light');
  gameBoard[0][4].piece = kingDark04;
  gameBoard[7][4].piece = kingDark74;
}