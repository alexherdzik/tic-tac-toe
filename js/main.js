const gameboard = (() => {
    const _board = ["","","","","","","","",""];
    const markSquare = (index, mark) => {
        _board[index] = mark;
    };

    const getSquare = index => {
        return _board[index];
    }

    const isSquareMarked = index => {
        return Boolean(getSquare(index));
    }

    const reset = () => {
        for(let i = 0; i < _board.length; i++) {
            _board[i] = "";
        }
    }

    return {markSquare, getSquare, isSquareMarked, reset};
})();

const view = (() => {
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

    return {updateBoard};
})();

const Player = (mark) => {
    const _mark = mark;
    const getMark = () => {
        return _mark
    }
    return {getMark};
}

const gameController = ((gameboard, view) => {
    const _playerX = Player('X');
    const _playerO = Player('O');
    let _round = 1;
    let _currentPlayer = _playerX;

    const _switchCurrentPlayer = () => {
        _currentPlayer = (_currentPlayer === _playerX) ? _playerO : _playerX;
    }

    const markSquare = index => {
        if (!gameboard.isSquareMarked(index)) {
            gameboard.markSquare(index, _currentPlayer.getMark());
            view.updateBoard(gameboard);
            if (_checkForWin()) {
                console.log('Winner');
            } else {
                _round++;
                _switchCurrentPlayer();
            }
        }
    };

    const _checkForWin = () => {
        const currentMark = _currentPlayer.getMark();
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

        return winningBoards.some(board => board.every(index => gameboard.getSquare(index) === currentMark));
    };

    const reset = () => {
        _round = 1;
        _currentPlayer = _playerX;
        gameboard.reset();
        view.updateBoard(gameboard);
    }

    return {markSquare, reset};
})(gameboard, view);