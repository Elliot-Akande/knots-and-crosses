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

const playerFactory = () => {
    let name;
    let symbol;

    const setSymbol = (s) => symbol = s;
    const setName = (s) => name = s;
    const getSymbol = () => symbol;
    const getName = () => name;

    return {
        getSymbol,
        getName,
        setSymbol,
        setName
    };
};

const engine = ((playerOne, playerTwo) => {
    const _players = [playerOne, playerTwo];
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

        _players.forEach(player => {
            if ((board[0] == player.getSymbol() && board[1] == player.getSymbol() && board[2] == player.getSymbol()) ||
                (board[3] == player.getSymbol() && board[4] == player.getSymbol() && board[5] == player.getSymbol()) ||
                (board[6] == player.getSymbol() && board[7] == player.getSymbol() && board[8] == player.getSymbol()) ||
                (board[0] == player.getSymbol() && board[3] == player.getSymbol() && board[6] == player.getSymbol()) ||
                (board[1] == player.getSymbol() && board[4] == player.getSymbol() && board[7] == player.getSymbol()) ||
                (board[2] == player.getSymbol() && board[5] == player.getSymbol() && board[8] == player.getSymbol()) ||
                (board[0] == player.getSymbol() && board[4] == player.getSymbol() && board[8] == player.getSymbol()) ||
                (board[2] == player.getSymbol() && board[4] == player.getSymbol() && board[6] == player.getSymbol()))
                winner = player.getName();
        });
        return winner ? winner : false;
    };

    const playTurn = e => {
        const position = _getPosition(e);
        if (_validPosition(position) && !gameBoard.get()[position]) {
            const turn = _currentTurn.getSymbol();
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
    const getTurn = () => _currentTurn.getName();
    const restart = () => {
        gameBoard.clear();
        displayController.clear();
    }
    const setPlayerOne = (name, symbol) => {
        playerOne.setName(name);
        playerOne.setSymbol(symbol);
    }
    const setPlayerTwo = (name, symbol) => {
        playerTwo.setName(name);
        playerTwo.setSymbol(symbol);
    }

    return {
        playTurn,
        getTurn,
        restart,
        setPlayerOne,
        setPlayerTwo
    }

})(playerOne = playerFactory(), playerTwo = playerFactory());

const displayController = (() => {
    const _segments = document.querySelectorAll(".board-segment");
    const _gameSetup = document.querySelectorAll(".game-setup");
    const _scoreBoard = document.querySelector("#score-board");
    const _gameBoard = document.querySelector("#game-board");
    const _startButton = document.querySelector("#start-button");
    const _statusMessage = document.querySelector("#status-message");
    const _playerOneName = document.querySelector("#score-player-one-name");
    const _playerTwoName = document.querySelector("#score-player-two-name");
    const _restartContainer = document.querySelector("#restart-container");
    const _restartButton = document.createElement("BUTTON");

    const _start = () => {
        if (_getPlayers()) {
            _hideGameSetup();
            _showScore();
            _showGameBoard();
            _showTurn();

            _restartButton.id = "restart-button";
            _restartButton.innerText = "Restart";
            _restartButton.addEventListener("click", engine.restart);

            _segments.forEach(segment => segment.addEventListener("click", _segmentPressed));
        }
    };
    const _getPlayers = () => {
        let _playerOneName = document.querySelector("#player-one-name").value;
        const _playerOneSymbol = document.querySelector("#player-one-symbol").value;
        let _playerTwoName = document.querySelector("#player-two-name").value;
        const _playerTwoSymbol = document.querySelector("#player-two-symbol").value;

        if (_playerOneName.length > 10) _playerOneName = _playerOneName.substr(0,10);
        if (_playerTwoName.length > 9) _playerTwoName = _playerTwoName.substr(0,10);

        _setScoreNames(_playerOneName, _playerTwoName);

        engine.setPlayerOne(_playerOneName, _playerOneSymbol);
        engine.setPlayerTwo(_playerTwoName, _playerTwoSymbol);
        return (_playerOneName && _playerOneSymbol && _playerOneName && _playerOneSymbol);
    };
    const _hideGameSetup = () => _gameSetup.forEach(div => div.setAttribute("style", "display: none"));
    const _showGameBoard = () => _gameBoard.setAttribute("style", "display: grid");
    const _segmentPressed = e => engine.playTurn(e);
    const _disabledSegments = () => _segments.forEach(segment => segment.disabled = true);
    const _enableSegments = () => _segments.forEach(segment => segment.disabled = false);
    const _hideRestartButton = () => _restartContainer.removeChild(_restartButton);
    const _showRestart = () => {
        _restartContainer.appendChild(_restartButton);
    };
    const _setScoreNames = (playerOne, playerTwo) => {
        _playerOneName.innerText = playerOne;
        _playerTwoName.innerText = playerTwo;
    }
    const _showScore = () => {
        _scoreBoard.setAttribute("style", "display: flex");
    }
    const _updateScore = (winner) => {
        if (winner == _playerOneName.innerText){
            +(document.querySelector("#score-player-one-value").innerText)++;
        } else {
            +(document.querySelector("#score-player-two-value").innerText)++;
        }
    }
    const _showTurn = () => {
        _statusMessage.innerText = `${engine.getTurn()}'s turn to play`;
        _statusMessage.setAttribute("style", "display: block");
    };
    const _showWinner = winner => {
        _statusMessage.innerText = `${winner} wins!`;
    };
    const _showTie = () => {
        _statusMessage.innerText = "Tie game!";
    };

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
    };
    const tie = () => {
        _disabledSegments();
        _showTie();
        _showRestart();
    };
    const win = (winner) => {
        _disabledSegments();
        _updateScore(winner);
        _showWinner(winner);
        _showRestart();
    };

    const _init = (() => {
        _startButton.addEventListener("click", _start);
    })();

    return {
        update,
        clear,
        tie,
        win
    };
})();
