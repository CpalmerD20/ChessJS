import {Pawn, Tile} from "./classes.js";

/* use the index of these to move the pieces */
export const rows = [8, 7, 6, 5, 4, 3, 2, 1];
export const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
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
    const pawnDark = new Pawn(gameBoard[1][i], 'dark');
    const pawnLight = new Pawn(gameBoard[6][i], 'light');
    gameBoard[1][i].piece = pawnDark;
    gameBoard[6][i].piece = pawnLight;
  }

}
createPieces();

/* generating buttons for UI tiles */
const userBoard = document.getElementById("board");
function createBoard() {
  document.getElementById('board').innerHTML = "";
  for(let i = 0; i < 8; i++) {
    let alliance = i % 2 == 0 ? 'dark' : 'light';
    for(let col of cols) {
      alliance = alliance === 'dark' ? 'light' : 'dark';
      const tile = document.createElement('button');
      tile.classList.add('tile');
      tile.classList.add(alliance);
      tile.id = "" + col + rows[i];
      tile.textContent = "" + col + rows[i];
  
      userBoard.appendChild(tile);
    }
  }
}
createBoard();


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
  for(let each in playerMoves) { //TODO GET THIS TO WORK, show moves with CSS
    document.getElementById(each.id).classList.add('playerMove');
    console.log(document.getElementById(each.id).classList);
  }
}
updateUser();

/* selecting a piece */
const tileButtons = document.getElementsByClassName('tile'); s
function selectPiece(){
 let piece = null;
  for(let i = 0; i < tileButtons.length; i++) {
    const button = tileButtons[i];
    button.onclick = function() {
      const tileId = button.id;
      const row = 8 - tileId.charAt(1);
      const col = cols.indexOf(tileId.charAt(0));
      piece = gameBoard[row][col].piece;
  
      if(piece === null) return;
      playerMoves = [];   
      piece.getMoves();
      console.log(playerMoves); //TODO delete when done testing
    }
  }
  updateUser();
  console.log(piece);
  //TODO maintain piece
}
selectPiece();
