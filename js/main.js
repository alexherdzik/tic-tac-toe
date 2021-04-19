const gameboard = (() => {
    const _board = ["","","","","","","","",""];

    const getBoard = () => _board;

    const getAvailableMoves = () => {
        const moves = [];
        _board.forEach((square, index) => {
            if (!Boolean(square)) moves.push(index);
        });
        return moves;
    };

    const getSquare = index => _board[index];

    const markSquare = (index, mark) => {
        _board[index] = mark;
    };

    const isSquareMarked = index => Boolean(getSquare(index));

    const reset = () => {
        for(let i = 0; i < _board.length; i++) {
            _board[i] = "";
        }
    }

    return {getBoard, getAvailableMoves, getSquare, markSquare, isSquareMarked, reset};
})();

const view = (() => {
    const _message = document.getElementById('message');
    const _boardSquares = Array.from(document.querySelectorAll('#gameboard .square'));
    const _resetBtn = document.getElementById('reset');
    
    const _init = (() => {
        for (let i = 0; i < _boardSquares.length; i++) {
            _boardSquares[i].addEventListener('click', () => {
                gameController.markSquare(i);
            });
        }
        _resetBtn.addEventListener('click', () => {
            gameController.reset()
        });
    })();

    const updateBoard = gameboard => {
        for (let i = 0; i < _boardSquares.length; i++) {
            _boardSquares[i].textContent = gameboard.getSquare(i);
        }
    }

    const setMessage = msg => {
        _message.textContent = msg;
    }

    return {updateBoard, setMessage};
})();

const Player = (mark, isHuman) => {
    const _mark = mark;
    const _isHuman = isHuman;
    const getMark = () => _mark;
    const getIsHuman = () => _isHuman;
    return {getMark, getIsHuman};
}

const gameController = ((gameboard, view) => {
    const _playerX = Player('X', true);
    const _playerO = Player('O', false);
    let _round;
    let _currentPlayer;
    let _gameOver;

    const _switchCurrentPlayer = () => {
        _currentPlayer = (_currentPlayer === _playerX) ? _playerO : _playerX;
        view.setMessage(`Player ${_currentPlayer.getMark()}'s turn`);
        
        if (!_currentPlayer.getIsHuman()) {
            // play AI round
            _playAIRound();
        }
    }

    const markSquare = index => {
        if (!_gameOver && !gameboard.isSquareMarked(index)) {
            gameboard.markSquare(index, _currentPlayer.getMark());
            view.updateBoard(gameboard);
            const winner = _checkForWin();
            if (winner) {
                _gameOver = true;
                view.setMessage(`Player ${winner} wins!`);
            } else if (_round === 9) {
                _gameOver = true;
                view.setMessage('Draw');
            } else {
                _round++;
                _switchCurrentPlayer();
            }
        }
    };

    const _playAIRound = () => {
        let bestScore = -Infinity;
        let bestMove;
        const availableMoves = gameboard.getAvailableMoves();

        availableMoves.forEach(move => {
            gameboard.markSquare(move, "O");
            let score = _minimax(gameboard, 0, false);
            gameboard.markSquare(move, "");

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        });

        markSquare(bestMove);
    };

    const _minimax = (gameboard, depth, isMaximizing) => {
        const scores = {X: -10, O: 10};
        let winner = _checkForWin();
        if (winner) return scores[winner];
        else if (gameboard.getAvailableMoves().length === 0) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            const availableMoves = gameboard.getAvailableMoves();

            availableMoves.forEach(move => {
                gameboard.markSquare(move, "O");
                let score = _minimax(gameboard, depth + 1, false);
                gameboard.markSquare(move, "");

                bestScore = Math.max(score, bestScore);
            });

            return bestScore;
        } else {
            let bestScore = Infinity;
            const availableMoves = gameboard.getAvailableMoves();

            availableMoves.forEach(move => {
                gameboard.markSquare(move, "X");
                let score = _minimax(gameboard, depth + 1, true);
                gameboard.markSquare(move, "");

                bestScore = Math.min(score, bestScore);
            });

            return bestScore;
        }
    };

    const _checkForWin = () => {
        const winningBoards = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        if (winningBoards.some(board => board.every(index => gameboard.getSquare(index) === _playerX.getMark()))) return _playerX.getMark();
        else if (winningBoards.some(board => board.every(index => gameboard.getSquare(index) === _playerO.getMark()))) return _playerO.getMark();
        return;
    };

    const reset = () => {
        _round = 1;
        _currentPlayer = _playerX;
        _gameOver = false;

        gameboard.reset();
        view.updateBoard(gameboard);
        view.setMessage(`Player ${_currentPlayer.getMark()}'s turn`);
    }

    return {markSquare, reset};
})(gameboard, view);

gameController.reset();