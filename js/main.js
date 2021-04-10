const gameboard = (() => {
    const _boardElement = document.getElementById('gameboard');
    const _board = new Array(9);
    const markSquare = (index, mark) => {
        _board[index] = mark;
    };
    const isSquareMarked = index => {
        return typeof _board[index] !== 'undefined';
    }

    return {markSquare, isSquareMarked};
})();

const Player = (mark) => {
    return {mark};
}

const displayController = ((gameboard) => {
    const _boardSquares = Array.from(document.querySelectorAll('#gameboard .square'));
    const markSquare = (index, mark) => {
        _boardSqaures[index].textContent = mark;
    }
    const _init = (() => {
        for (let i = 0; i < _boardSquares.length; i++) {
            _boardSquares[i].addEventListener('click', () => {
                if (!gameboard.isSquareMarked(i)) {
                    gameboard.markSquare(i, 'X');
                    _boardSquares[i].textContent = 'X';
                }
            });
        }
    })();
    return {markSquare};
})(gameboard);

const playerX = Player('X');
const playerO = Player('O');