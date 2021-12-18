const gameBoard = (() => {
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
    const _symbols = [playerOne.getSymbol(), playerTwo.getSymbol()];
    let _currentTurn = playerOne;

    const _nextTurn = () => _currentTurn == playerOne ? _currentTurn = playerTwo : _currentTurn = playerOne;
    const _getPosition = e => e.srcElement.getAttribute("data-position");
    const _checkWin = () => {
        const board = gameBoard.get();
        let winner = "";

        _symbols.forEach(symbol => {
            if ((board[0] == symbol && board[1] == symbol && board[2] == symbol) ||
                (board[3] == symbol && board[4] == symbol && board[5] == symbol) ||
                (board[6] == symbol && board[7] == symbol && board[8] == symbol) ||
                (board[0] == symbol && board[3] == symbol && board[6] == symbol) ||
                (board[1] == symbol && board[4] == symbol && board[7] == symbol) ||
                (board[2] == symbol && board[5] == symbol && board[8] == symbol) ||
                (board[0] == symbol && board[4] == symbol && board[8] == symbol) ||
                (board[2] == symbol && board[4] == symbol && board[6] == symbol)) 
                winner = symbol;
        });
        return winner ? winner : false;
    };

    const playTurn = e => {
        const position = _getPosition(e);
        if (gameBoard.add(getTurn(), position)) _nextTurn();
        if (_checkWin()) displayController.gameOver();
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
    const gameOver = () => _segments.forEach(segment => segment.disabled = true);

    _segments.forEach(segment => segment.addEventListener("click", _segmentPressed));

    return {
        update,
        gameOver
    };
})();
