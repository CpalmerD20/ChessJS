import {Pawn, Tile} from "./classes.js";

/* use the index of these to move the pieces */
const rows = [8, 7, 6, 5, 4, 3, 2, 1];
const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export let playerMoves = [];

/* where the game actually happens, to be reflected in UI */
export const gameBoard = new Array(8);
for(let i = 0; i < 8; i++) {
  const array = [];
  for(let col of cols) {
    const tile = new Tile(rows[i], col, null);
    array.push(tile);
  }
  gameBoard[i] = array;
}
function createPieces(){
  for(let i = 0; i < 8; i++){
    const pawnDark = new Pawn(gameBoard[7][i], 'dark');
    gameBoard[6][i].piece = pawnDark;
    const pawnLight = new Pawn(gameBoard[2][i], 'light');
    gameBoard[1][i].piece = pawnLight;
  }

}
createPieces();

/* generating UI tiles */
const userBoard = document.getElementById("board");
function createBoard() {
  for(let i = 0; i < 8; i++) {
    let alliance = i % 2 == 0 ? 'dark' : 'light';
    for(let col of cols) {
      alliance = alliance === 'dark' ? 'light' : 'dark';
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.classList.add(alliance);
      tile.id = "" + col + rows[i];
      tile.textContent = "" + col + rows[i];
  
      userBoard.appendChild(tile);
    }
  }
}
// createBoard();

function updateUser(){
  createBoard();
  for(let i = 0; i < 8; i++) {
    for(let u = 0; u < 8; u++){
      const tile = gameBoard[i][u];
      if(tile.piece === null) continue;
      
      const piece = tile.piece;
      const userTile = document.getElementById(tile.id); 
      userTile.style.backgroundImage = `url('${piece.icon}')`;
    }
  }
}
updateUser();