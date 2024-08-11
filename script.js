// logic
// 1 => git value from user
// 2 => stor value in my bard
// 3 => make ai to define best move
// 4 => define who win the game

//  features
// 1 => choice difficulty by choice number of cells
// 2 => play wit ai

//=================================================

// // define number of cells
let NUMBER_OF_ROWS = 3;
let currentPlayer = 'X';
let drowNumber = NUMBER_OF_ROWS ** 2 - 1;
let difficultySelect = document.getElementById('difficulty');
let boardSizeSelect = document.getElementById('boardSize');
let resat = document.querySelector('.reset');
const container = document.querySelector('.container');
const boardGUI = document.querySelector('.board');

// AI
// =================================================
// Minimax algorithm
const difficultyLevels = {
  easy: 1,
  medium: 2,
  hard: 5,
  impossible: Infinity,
};

let currentDifficulty = 'medium'; // Default difficulty


function isMovesLeft(board) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === undefined) {
        return true;
      }
    }
  }
  return false;
}

function evaluate(board) {
  const size = board.length;

  // Check rows for victory
  for (let row = 0; row < size; row++) {
    if (board[row].every((cell) => cell === 'X')) return -10;
    if (board[row].every((cell) => cell === 'O')) return 10;
  }

  // Check columns for victory
  for (let col = 0; col < size; col++) {
    if (board.every((row) => row[col] === 'X')) return -10;
    if (board.every((row) => row[col] === 'O')) return 10;
  }

  // Check diagonals for victory
  if (board.every((row, index) => row[index] === 'X')) return -10;
  if (board.every((row, index) => row[index] === 'O')) return 10;
  if (board.every((row, index) => row[size - index - 1] === 'X')) return -10;
  if (board.every((row, index) => row[size - index - 1] === 'O')) return 10;

  // No winner
  return 0;
}

function minimax(board, depth, isMax, alpha, beta, maxDepth) {
  let score = evaluate(board);

  if (score === 10 || score === -10) return score;

  if (!isMovesLeft(board)) return 0;

  if (depth >= maxDepth) return 0;

  if (isMax) {
    let best = -1000;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === undefined) {
          board[row][col] = 'O';
          best = Math.max(best, minimax(board, depth + 1, false, alpha, beta, maxDepth));
          board[row][col] = undefined;
          alpha = Math.max(alpha, best);
          if (beta <= alpha) break;
        }
      }
    }
    return best;
  } else {
    let best = 1000;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === undefined) {
          board[row][col] = 'X';
          best = Math.min(best, minimax(board, depth + 1, true, alpha, beta, maxDepth));
          board[row][col] = undefined;
          beta = Math.min(beta, best);
          if (beta <= alpha) break;
        }
      }
    }
    return best;
  }
}

function findBestMove(board, difficulty) {
  let maxDepth = difficultyLevels[difficulty];
  let bestVal = -1000;
  let bestMove = { row: -1, col: -1 };

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === undefined) {
        board[row][col] = 'O';
        let moveVal = minimax(board, 0, false, -1000, 1000, maxDepth);
        board[row][col] = undefined;
        if (moveVal > bestVal) {
          bestMove.row = row;
          bestMove.col = col;
          bestVal = moveVal;
        }
      }
    }
  }

  return bestMove;
}

//=================================================

const enableEL = function (el) {
  el.classList.remove('non-interactive');
};
const disableEl = function (el) {
  el.classList.add('non-interactive');
};
// game start
console.log('game start');
// create board and make it automatic
const createBoardArray = function (numberOfRows) {
  let board = [];
  for (let row = 0; row < numberOfRows; row++) {
    board.push(Array.from({ length: numberOfRows }));
  }
  // console.log(board);
  return board;
};

//check if the cells is Empty and store the value
const checkAndStoreValueIfCellEmpty = function (row, column, currentPlayer) {
  if (board[row][column]) {
    console.log('not corret position ');
    console.log(board);
    return;
  }
  board[row][column] = `${currentPlayer}`;
  return true;
};

// const checkRows = function (board, numberOfRows, currentPlayer) {
//   // first row
//   // board[0][0]
//   // board[0][1]
//   // board[0][2]
//   //second row
//   // board[1][0]
//   // board[1][1]
//   // board[1][2]
//   //3th row
//   // board[2][0]
//   // board[2][1]
//   // board[2][2]

//   // board [
//   // [1 , 2, 3]
//   // [1 , 2, 3]
//   // [1 , 2, 3]
//   //       ]
//   let row = 0;
//   let win = false;
//   for (let col = 0; col < numberOfRows; ) {
//     win = true;
//     if (board[row][col] !== currentPlayer) {
//       win = false;
//       // col = 0;
//       row++;
//     }
//     col++;

//     if (row >= numberOfRows) break;
//   }
//   if (win) {
//     console.log(board);
//     console.log(`${currentPlayer} wins checkRows`);
//     return true;
//   }
//   console.log(board);
// };
const checkRows = function (board, numberOfRows, currentPlayer) {
  // Iterate over each row
  for (let row = 0; row < numberOfRows; row++) {
    let win = true;
    // Check all columns in the current row
    for (let col = 0; col < numberOfRows; col++) {
      if (board[row][col] !== currentPlayer) {
        win = false;
        break;
      }
    }
    // If win is still true, it means the current player has won
    if (win) {
      console.log(board);
      console.log(`${currentPlayer} wins checkRows`);
      return true;
    }
  }
  console.log(board);
  return false;
};


const checkColumns = function (board, numberOfRows, currentPlayer) {
  // Iterate over each column
  for (let col = 0; col < numberOfRows; col++) {
    let win = true;
    // Check all rows in the current column
    for (let row = 0; row < numberOfRows; row++) {
      if (board[row][col] !== currentPlayer) {
        win = false;
        break;
      }
    }
    // If win is still true, it means the current player has won
    if (win) {
      console.log(board);
      console.log(`${currentPlayer} wins checkColumns`);
      return true;
    }
  }
  console.log(board);
  return false;
};

const checkDiagonals = function (board, numberOfRows, currentPlayer) {

  let cell = 0;
  for (let row = 0; row < numberOfRows; row++) {
    if (board[row][cell] !== currentPlayer) {
      return;
    }
    cell++;
    if (cell >= numberOfRows) {
      console.log(board);
      console.log(`${currentPlayer} wins checkDiagonals`);
      return true;
    }
  }
};

const checkReverseDiagonals = function (board, numberOfRows, currentPlayer) {
  // board [
  // [1 , 2, 3]
  // [1 , 2, 3]
  // [1 , 2, 3]
  //       ]

  // win conditions
  // 1th columns
  // board [0] [0]
  // board [1] [1]
  // board [2] [2]

  let col = numberOfRows - 1;
  for (let row = 0; row < numberOfRows; row++) {
    if (board[row][col] !== currentPlayer) {
      return;
    }
    col--;
    if (col < 0) {
      console.log(board);
      console.log(`${currentPlayer} wins checkReverseDiagonals`);
      return true;
    }
  }
};

const win = function (board, numberOfRows, currentPlayer) {
  if (checkRows(board, numberOfRows, currentPlayer)) return true;
  if (checkColumns(board, numberOfRows, currentPlayer)) return true;
  if (checkDiagonals(board, numberOfRows, currentPlayer)) return true;
  if (checkReverseDiagonals(board, numberOfRows, currentPlayer)) return true;
  return;
};

// GUI
//=================================================

const createBoard = function (numberOfRows) {

  document.documentElement.style.setProperty('--grid-rows', numberOfRows);
  boardGUI.innerHTML = '';

  const cells = function () {
    let html = '';
    let col = 0;
    let row = 0;
    for (let cell = 0; cell < numberOfRows ** 2; cell++) {
      if (col > numberOfRows - 1) {
        row++;
        col = 0;
      }
      html += `<div class="cell" role="button" tabindex="${cell + 1}" data-row ="${row}" data-column="${col}"><span class="value"></span></div>`;
      col++;
    }
    return html;
  };

  boardGUI.innerHTML = `  ${cells()}
`;
  const html = `

        </div>
        
    <div id="popup" class="popup">
      <div class="popup-content">
        <p id="popup-message"></p>
        <button onclick="closePopup()">Close</button>
      </div>
    </div>
    

`;

  // const cellElement = document.createRange().createContextualFragment(cellElementString);
  container.insertAdjacentHTML('afterbegin', html);

  boardSizeSelect.addEventListener('click', updateboardSize);

  resat.addEventListener('click', () => {
    console.log('click');
    resatBoard(NUMBER_OF_ROWS);
  });
  difficultySelect.addEventListener('click', updateDifficulty);
};

const resatBoard = function (numberOfRows) {
  const cells = document.querySelectorAll('.value');
  [...cells].forEach((item) => {
    item.classList.remove('cell--X');
    item.classList.remove('cell--O');
    item.textContent = '';
  });
  drowNumber = numberOfRows ** 2 - 1;
  board = createBoardArray(numberOfRows);
  currentPlayer = 'X';
  enableEL(difficultySelect);
  enableEL(boardSizeSelect);
};

const switchPlayer = function () {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const updateBoardGui = function (cell) {
  cell.children[0].classList.add(`cell--${currentPlayer}`);
  cell.children[0].textContent = `${currentPlayer}`;
};

const processCellClick = function (cell, numberOfRows) {
  const row = cell.dataset.row;
  const column = cell.dataset.column;

  if (checkAndStoreValueIfCellEmpty(row, column, currentPlayer)) {
    if (currentPlayer === 'X') {
      //check draw
      if (drowNumber == 0) {
        showPopup();
        updateBoardGui(cell);
        return;
      }
      //check win
      // debugger;
      if (win(board, numberOfRows, currentPlayer)) {
        updateBoardGui(cell);
        showPopup(currentPlayer);
        return;
      }
      drowNumber--;
      updateBoardGui(cell);
      switchPlayer();
    }

    if (currentPlayer === 'O') {
      const bestMove = findBestMove(board, currentDifficulty); // Adjust the depth as needed
      checkAndStoreValueIfCellEmpty(bestMove.row, bestMove.col, currentPlayer);
      updateBoardGui(document.querySelector(`[data-row="${bestMove.row}"][data-column="${bestMove.col}"]`));
      if (win(board, numberOfRows, currentPlayer)) {
        //check win
        showPopup(currentPlayer);
      } else if (drowNumber == 0) {
        //check draw
        showPopup();
        switchPlayer();
        return;
      } else {
        drowNumber--;
        switchPlayer();
      }
    }
  }
};

const handleCellClick = function (e) {
  if (e.target.classList.contains('cell')) {
    processCellClick(e.target, NUMBER_OF_ROWS);
    disableEl(difficultySelect);
    disableEl(boardSizeSelect);
  }
};

const initializeBoardEventListener = function () {
  const boardGui = document.querySelector('.board');
  boardGui.addEventListener('click', handleCellClick);
};

const showPopup = function (message = false) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  popup.classList.add('show');
  if (!message) {
    popupMessage.textContent = `its draw`;
    return;
  }
  popupMessage.textContent = `${message} win oops`;
};

const closePopup = function () {
  const popup = document.getElementById('popup');
  resatBoard(NUMBER_OF_ROWS);
  popup.classList.remove('show');
};

const updateDifficulty = function () {
  currentDifficulty = difficultySelect.value;
};
const updateboardSize = function () {
  NUMBER_OF_ROWS = boardSizeSelect.value;
  drowNumber = NUMBER_OF_ROWS ** 2 - 1;
  board = createBoardArray(NUMBER_OF_ROWS);
  createBoard(NUMBER_OF_ROWS);
  initializeBoardEventListener();
};

//=================================================

//  usage:
let board = createBoardArray(NUMBER_OF_ROWS);
createBoard(NUMBER_OF_ROWS);
initializeBoardEventListener();
