import {King, Queen, Bishop, Rook, Knight, Pawn, Tile, legalMoves, createPieces} from "./classes.js";

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
updateUser();

function resetTiles(){
  legalMoves.forEach((tile) =>{
    document.getElementById(tile.id).classList.remove('playerMove');
  })
}

/* selecting a piece OR selecting a tile for movement */
userBoard.onclick = function selectPiece(event){ //removed for loop by using event delegation instead
  let target = event.target;
  const row = rows.length - target.id.charAt(1);
  const col = cols.indexOf(target.id.charAt(0));
  let piece = gameBoard[row][col].piece;
  
  /* move active piece from tileA to tileB */
  if(target.classList.contains('playerMove') && activePiece !== null) { 
    activePiece.tile.piece = null;
    activePiece.tile = gameBoard[row][col];
    gameBoard[row][col].piece = activePiece;
    activePiece = null;
    piece = null;
    resetTiles();
    updateUser();
    return;
  }
  /* assign active piece after move operation, needs null protection for 1st action */
  activePiece = piece; 
  /* condition for when player clicks on a tile active piece cannot move to */
  if(!target.classList.contains('playerMove') && piece === null) {
    activePiece = null;
    playerMoves = [];
    resetTiles();
  }
  /* default operation */
  if(piece !== null) { 
    resetTiles();
    playerMoves = []; 
    piece.getMoves();
    activePiece = piece;
  }
  updateUser();
}
selectPiece();
