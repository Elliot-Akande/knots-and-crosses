const gameBoard = (() => {
    let _board = ["", "", "", "", "", "", "", "", "",];

    const add = (symbol, position) => {
        displayController.update(symbol, position);
        return _board[position] = symbol;
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

    const _validPosition = position => position >= 0 && position < 9;
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
        if (_validPosition(position) && !gameBoard.get()[position]) {
            const turn = getTurn();
            _nextTurn();
            gameBoard.add(turn, position);
        }
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
    const _statusMessage = document.querySelector("#status-message");
    const _restartContainer = document.querySelector("#restart-container");
    const _restartButton = document.createElement("BUTTON");

    const _segmentPressed = e => engine.playTurn(e);
    const _disabledSegments = () => _segments.forEach(segment => segment.disabled = true);
    const _enableSegments = () => _segments.forEach(segment => segment.disabled = false);
    const _hideRestartButton = () => _restartContainer.removeChild(_restartButton);
    const _showRestart = () => {
        _restartContainer.appendChild(_restartButton);
    };
    const _showTurn = () => {
        _statusMessage.innerText = `${engine.getTurn()}'s turn to play`;
    }
    const _showWinner = (winner) => {
        _statusMessage.innerText = `${winner} wins!`;
    }

    const update = (symbol, position) => {
        document.querySelector(`[data-position="${position}"]`).innerText = symbol;
        _showTurn();
    };
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
    const win = (winner) => {
        _disabledSegments();
        _showWinner(winner);
        _showRestart();
    }

    const _init = (() => {
        _restartButton.id = "restart-button";
        _restartButton.innerText = "Restart";
        _restartButton.addEventListener("click", engine.restart);
        
        _segments.forEach(segment => segment.addEventListener("click", _segmentPressed));

        _showTurn();
    })();

    return {
        update,
        clear,
        tie,
        win
    };
})();
