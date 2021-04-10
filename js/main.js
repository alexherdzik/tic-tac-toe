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

const playerX = Player('X');
const playerO = Player('O');