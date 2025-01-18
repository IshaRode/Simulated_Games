class ConnectFour {
    constructor() {
        this.board = document.getElementById('board');
        this.currentPlayer = 1;
        this.gameActive = true;
        this.boardState = Array(42).fill(0);
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.winnerMessage = document.getElementById('winner-message');
        this.resetButton = document.getElementById('reset-button');
        this.gameModeSelect = document.getElementById('game-mode-select');
        this.gameMode = 'player'; // Default mode
        this.initializeBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        this.board.innerHTML = '';
        for (let i = 0; i < 42; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            this.board.appendChild(cell);
        }
    }

    setupEventListeners() {
        this.board.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.handleCellClick(e.target);
            }
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.gameModeSelect.addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            this.resetGame();
        });
    }

    handleCellClick(cell) {
        if (!this.gameActive || (this.gameMode === 'computer' && this.currentPlayer === 2)) return;

        const column = cell.dataset.index % 7;
        const availableRow = this.getLowestEmptyRow(column);

        if (availableRow !== -1) {
            const index = availableRow * 7 + parseInt(column);
            this.placePiece(index);

            if (this.gameMode === 'computer' && this.currentPlayer === 2 && this.gameActive) {
                setTimeout(() => this.computerMove(), 500); 
            }
        }
    }

    getLowestEmptyRow(column) {
        for (let row = 5; row >= 0; row--) {
            const index = row * 7 + parseInt(column);
            if (this.boardState[index] === 0) {
                return row;
            }
        }
        return -1;
    }

    placePiece(index) {
        const cells = document.querySelectorAll('.cell');
        this.boardState[index] = this.currentPlayer;
        cells[index].classList.add(this.currentPlayer === 1 ? 'player-one' : 'player-two');

        if (this.checkWin(index)) {
            this.showWinner(`Player ${this.currentPlayer} wins!`);
            this.gameActive = false;
            return;
        }

        if (this.checkDraw()) {
            this.showWinner("It's a draw!");
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.currentPlayerDisplay.textContent = `Player ${this.currentPlayer}`;
    }

    computerMove() {
        const validColumns = [];
        for (let col = 0; col < 7; col++) {
            if (this.getLowestEmptyRow(col) !== -1) {
                validColumns.push(col);
            }
        }

        if (validColumns.length > 0) {
            const randomColumn = validColumns[Math.floor(Math.random() * validColumns.length)];
            const availableRow = this.getLowestEmptyRow(randomColumn);
            const index = availableRow * 7 + randomColumn;
            this.placePiece(index);
        }
    }

    checkWin(lastIndex) {
        const directions = [
            [1, 0],   // horizontal
            [0, 1],   // vertical
            [1, 1],   // diagonal right
            [1, -1]   // diagonal left
        ];

        return directions.some(([dx, dy]) => {
            return this.checkDirection(lastIndex, dx, dy) || 
                   this.checkDirection(lastIndex, -dx, -dy);
        });
    }

    checkDirection(index, dx, dy) {
        const row = Math.floor(index / 7);
        const col = index % 7;
        const player = this.boardState[index];
        let count = 1;

        for (let i = 1; i < 4; i++) {
            const newRow = row + dy * i;
            const newCol = col + dx * i;
            
            if (
                newRow < 0 || newRow >= 6 || 
                newCol < 0 || newCol >= 7 ||
                this.boardState[newRow * 7 + newCol] !== player
            ) {
                break;
            }
            count++;
        }

        return count >= 4;
    }

    checkDraw() {
        return !this.boardState.includes(0);
    }

    showWinner(message) {
        this.winnerMessage.textContent = message;
        this.winnerMessage.classList.add('show');
        setTimeout(() => {
            this.winnerMessage.classList.remove('show');
        }, 3000);
    }

    resetGame() {
        this.boardState = Array(42).fill(0);
        this.currentPlayer = 1;
        this.gameActive = true;
        this.currentPlayerDisplay.textContent = 'Player 1';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('player-one', 'player-two');
        });
        this.winnerMessage.classList.remove('show');
    }
}

const game = new ConnectFour();
