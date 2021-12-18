const board = (() => {
    let _board = ["","","","","","","","","",];
    
    const _validPosition = position => position >= 0 && position < 9;

    const add = (symbol, position) => _validPosition(position) && !_board[position] ? _board[position] = symbol : false;
    const clear = () => _board = ["","","","","","","","","",];
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
    }
};

const engine = ((playerOne, playerTwo) => {
    let _currentTurn = playerOne;

    const _nextTurn = () => _currentTurn == playerOne ? _currentTurn = playerTwo : _currentTurn = playerOne;
    const _logState = () => {
        console.log(board.get());
        console.log(getTurn());
    };

    const playTurn = (position) => {
        if (board.add(getTurn(), position)) _nextTurn();
        
        _logState();
    }
    const restart = () => board.clear;
    const getTurn = () => _currentTurn.getSymbol();

    return {
        playTurn,
        restart,
        getTurn
    }

})(playerOne = playerFactory("X"), playerTwo = playerFactory("O"));

const displayController = (() => {
    
})();
