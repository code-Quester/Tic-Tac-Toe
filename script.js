document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('reset');
    const playerVsPlayerButton = document.getElementById('player-vs-player');
    const playerVsComputerButton = document.getElementById('player-vs-computer');
    let currentPlayer = 'X';
    let gameMode = 'PVP';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function CellPlayed(index) {
        board[index] = currentPlayer;
        cells[index].innerText = currentPlayer;
    }

    function PlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWinner() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                highlightWinningMoves(a,b,c);
                return board[a];
            }
        }
        return board.includes('') ? null : 'draw';
    }

    function ResultValidation() {
        const winner = checkWinner();
        if (winner) {
            message.innerText = winner === 'draw' ? 'Game ended in a draw!' : `Player ${winner} has won!`;
            gameActive = false;
            return;
        }

        PlayerChange();
    } 

    function CellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        CellPlayed(clickedCellIndex);
        ResultValidation();

        if (gameMode === 'PVC' && gameActive) {
            ComputerMove();
        }
    }

    function ComputerMove() {
        const bestMove = getBestMove();
        CellPlayed(bestMove);
        highlightLastMove(bestMove);
        ResultValidation();
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(board, depth, isMaximizing) {
        let result = checkWinner();
        if (result !== null) {
            if (result === 'O') return 10 - depth;
            if (result === 'X') return depth - 10;
            if (result === 'draw') return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function ResetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        message.innerText = '';
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('highlight');
        });
    }

    function GameModeChange(mode) {
        gameMode = mode;
        ResetGame();
        updateGameModeButtons();
    }

    function updateGameModeButtons() {
        if (gameMode === 'PVP') {
            playerVsPlayerButton.classList.add('selected');
            playerVsComputerButton.classList.remove('selected');
        } else {
            playerVsPlayerButton.classList.remove('selected');
            playerVsComputerButton.classList.add('selected');
        }
    }

    function highlightLastMove(index) {
        cells.forEach(cell => cell.classList.remove('highlight'));
        cells[index].classList.add('highlight');
    }
    function highlightWinningMoves(index1,index2,index3) {
        cells.forEach(cell => cell.classList.remove('highlight'));
        cells[index1].classList.add('highlight');
        cells[index2].classList.add('highlight');
        cells[index3].classList.add('highlight');
    }

    cells.forEach(cell => cell.addEventListener('click', CellClick));
    resetButton.addEventListener('click', ResetGame);
    playerVsPlayerButton.addEventListener('click', () => GameModeChange('PVP'));
    playerVsComputerButton.addEventListener('click', () => GameModeChange('PVC'));

    updateGameModeButtons();
});            
