const board = (() => {
    let _board = ["", "", "", "", "", "", "", "", "",];

    const _validPosition = position => position >= 0 && position < 9;

    const add = (symbol, position) => {
        if (_validPosition(position) && !_board[position]) {
            displayController.update(symbol, position);
            return _board[position] = symbol;
        } else {
            return false;
        }
    }
    const clear = () => _board = ["", "", "", "", "", "", "", "", "",];
    const get = () => _board;

    return {
        add,
        clear,
        get
    };
})();

const playerFactory = (symbol) => {
    const getSymbol = () => symbol;

    return {
        getSymbol
    };
};

const engine = ((playerOne, playerTwo) => {
    let _currentTurn = playerOne;

    const _nextTurn = () => _currentTurn == playerOne ? _currentTurn = playerTwo : _currentTurn = playerOne;
    const _getPosition = e => e.srcElement.getAttribute("data-position");

    const playTurn = e => {
        const position = _getPosition(e);
        if (board.add(getTurn(), position)) _nextTurn();
    }
    const getTurn = () => _currentTurn.getSymbol();

    return {
        playTurn,
        getTurn
    }

})(playerOne = playerFactory("X"), playerTwo = playerFactory("O"));

const displayController = (() => {
    const _segments = document.querySelectorAll(".board-segment");

    const _segmentPressed = e => engine.playTurn(e);

    const update = (symbol, position) => document.querySelector(`[data-position="${position}"]`).innerText = symbol;

    _segments.forEach(segment => segment.addEventListener("click", _segmentPressed));

    return {
        update
    };
})();
