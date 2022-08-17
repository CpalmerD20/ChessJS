import {King, Queen, Bishop, Rook, Knight, Pawn, Tile, legalMoves} from "./classes.js";

export const rows = [8, 7, 6, 5, 4, 3, 2, 1]; //used by pieces to find location
export const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export let playerMoves = [];
export let activePiece = null;

/* where the game actually happens, to be reflected in UI */
export const gameBoard = new Array(8);
for(let i = 0; i < 8; i++) {
  const array = [];
  cols.forEach((col) =>{
    const tile = new Tile(rows[i], col, null);
    array.push(tile);
  })
  gameBoard[i] = array;
}

/* generating buttons for UI tiles */
const userBoard = document.getElementById("board");
userBoard.innerHTML = "";
for(let i = 0; i < 8; i++) {
  let alliance = i % 2 == 0 ? 'dark' : 'light';
  cols.forEach((col) =>{
    alliance = alliance === 'dark' ? 'light' : 'dark';
    const tile = document.createElement('button');
    tile.classList.add('tile');
    tile.classList.add(alliance);
    tile.id = "" + col + rows[i];
    tile.textContent = "" + col + rows[i];

    userBoard.appendChild(tile);
  })
}

function resetTiles(){
  legalMoves.forEach((tile) =>{
    document.getElementById(tile.id).classList.remove('playerMove');
  })
}

function createPieces(){
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
createPieces();

/* renders the current game state */
function updateUser(){
  for(let i = 0; i < 8; i++) {
    for(let u = 0; u < 8; u++){
      const tile = gameBoard[i][u];
      const userTile = document.getElementById(gameBoard[i][u].id);
      userTile.style.backgroundImage = "none"; 
      if(tile.piece === null) continue;
      
      const piece = tile.piece;
      userTile.style.backgroundImage = `url('${piece.icon}')`;
    }
  }
}

/* selecting a piece OR selecting a tile for movement */
const tileButtons = document.getElementsByClassName('tile'); 
function selectPiece(){
  for(let i = 0; i < tileButtons.length; i++) {
    const button = tileButtons[i];
    button.onclick = function() {
      const row = 8 - button.id.charAt(1);
      const col = cols.indexOf(button.id.charAt(0));
      let piece = gameBoard[row][col].piece;
      
      if(button.classList.contains('playerMove') && activePiece !== null) { //move piece
        activePiece.tile.piece = null;
        activePiece.tile = gameBoard[row][col];
        gameBoard[row][col].piece = activePiece;
        activePiece = null;
        piece = null;
        resetTiles();
        updateUser();
        console.log(activePiece);
        return;
      }
      
      activePiece = piece; //assign active piece after move operation, needs null protection for 1st action
      
      if(!button.classList.contains('playerMove') && piece === null) {
        activePiece = null;
        playerMoves = [];
        resetTiles();
      }
      
      if(piece !== null) { //collect moves
        resetTiles();
        playerMoves = []; 
        piece.getMoves();
        activePiece = piece;
        console.log(activePiece);
      }
    }
  }
  updateUser();
}
selectPiece();
