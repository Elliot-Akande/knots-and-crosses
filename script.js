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

        if ((board[0] && board[1] && board[2]) &&
            (board[3] && board[4] && board[5]) &&
            (board[6] && board[7] && board[8])) {
                winner = "tie";
        } 

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
        const checkWin = _checkWin();
        switch (checkWin) {
            case false:
                break;
            case "tie":
                displayController.tie();
                break;
            default:
                displayController.win(checkWin);
        }
    }
    const getTurn = () => _currentTurn.getSymbol();
    const restart = () => {
        gameBoard.clear();
        displayController.clear();
    }

    return {
        playTurn,
        getTurn,
        restart
    }

})(playerOne = playerFactory("X"), playerTwo = playerFactory("O"));

const displayController = (() => {
    const _segments = document.querySelectorAll(".board-segment");
    const _restartContainer = document.querySelector("#restart-container");
    const _restartButton = document.createElement("BUTTON");

    const _buildRestartButton = (() => {
        _restartButton.id = "restart-button";
        _restartButton.innerText = "Restart";
        _restartButton.addEventListener("click", engine.restart);
    })();
    const _segmentPressed = e => engine.playTurn(e);
    const _disabledSegments = () => _segments.forEach(segment => segment.disabled = true);
    const _enableSegments = () => _segments.forEach(segment => segment.disabled = false);
    const _hideRestartButton = () => _restartContainer.removeChild(_restartButton);
    const _showRestart = () => {
        _restartContainer.appendChild(_restartButton);
    };

    const update = (symbol, position) => document.querySelector(`[data-position="${position}"]`).innerText = symbol;
    const clear = () => {
        for (let i = 0; i < 9; i++) {
            update("", i);         
        }
        _hideRestartButton();
        _enableSegments();
    }
    const tie = () => {
        _disabledSegments();
        _showRestart();
    }
    const win = () => {
        _disabledSegments();
        _showRestart();
    }

    _segments.forEach(segment => segment.addEventListener("click", _segmentPressed));

    return {
        update,
        clear,
        tie,
        win
    };
})();
