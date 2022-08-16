import {Knight, Pawn, Tile} from "./classes.js";

/* use the index of these to move the pieces */
export const rows = [8, 7, 6, 5, 4, 3, 2, 1];
export const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export let playerMoves = [];
let activePiece = null;
let piece = null;

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
function createPieces(){
  for(let i = 0; i < 8; i++){
    const pawnDark = new Pawn(gameBoard[1][i], 'dark');
    const pawnLight = new Pawn(gameBoard[6][i], 'light');
    gameBoard[1][i].piece = pawnDark;
    gameBoard[6][i].piece = pawnLight;
  }
  const knightDark01 = new Knight(gameBoard[0][1], 'dark');
  const knightDark06 = new Knight(gameBoard[0][6], 'dark');
  gameBoard[0][1].piece = knightDark01;
  gameBoard[0][6].piece = knightDark06;
  const knightLight71 = new Knight(gameBoard[7][1], 'light');
  const knightLight76 = new Knight(gameBoard[7][6], 'light');
  gameBoard[7][1].piece = knightLight71;
  gameBoard[7][6].piece = knightLight76;
}
createPieces();

/* generating buttons for UI tiles */
const userBoard = document.getElementById("board");
function createBoard() {
  document.getElementById('board').innerHTML = "";
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
}
createBoard();

function resetTiles(){
  playerMoves.forEach((tile) =>{
    document.getElementById(tile.id).classList.remove('playerMove');
  })
}

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
updateUser();

/* selecting a piece */
const tileButtons = document.getElementsByClassName('tile'); 
function selectPiece(){
  for(let i = 0; i < tileButtons.length; i++) {
    const button = tileButtons[i];
    button.onclick = function() {
      const row = 8 - button.id.charAt(1);
      const col = cols.indexOf(button.id.charAt(0));
      piece = gameBoard[row][col].piece;

      //move the piece
      if(activePiece != null && button.classList.contains('playerMove')) {
        console.log('success');
        activePiece.tile.piece = null;
        activePiece.tile = gameBoard[row][col];
        gameBoard[row][col].piece = activePiece;
        activePiece = null;
        piece = null;
        resetTiles();
        updateUser();
        return;
      }

      //collect moves if piece is on tile
      if(piece !== null) {
        resetTiles();
        playerMoves = []; 
        piece.getMoves();
        activePiece = piece;
        console.log(playerMoves); //TODO delete when done testing
      }
    }
  }
  updateUser();
  //TODO maintain piece
}
selectPiece();
