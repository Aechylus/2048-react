import React from 'react';
import './App.css';
import Direction from './Direction';

class Square extends React.Component {
    backgroundColor(value) {
        const COLOR_EMPTY = 'rgb(238, 228, 218, 0.35)';
        const COLOR_2 = 'rgb(238, 228, 218)';
        const COLOR_4 = 'rgb(237, 224, 200)';
        const COLOR_8 = 'rgb(242, 177, 121)';
        const COLOR_16 = 'rgb(245, 149, 99)';
        const COLOR_32 = 'rgb(246, 124, 95)';
        const COLOR_64 = 'rgb(246, 94, 59)';
        const COLOR_128 = 'rgb(237, 207, 114)';
        const COLOR_256 = 'rgb(237, 204, 97)';
        const COLOR_512 = 'rgb(237, 200, 80)';
        const COLOR_1024 = 'rgb(237, 197, 63)';
        const COLOR_2048 = 'rgb(237, 194, 46)';
        const COLOR_OTHER = 'black';
        const COLOR_GAME_OVER = 'rgb(238, 228, 218, 0.73)';

        switch (value) {
            case 0:
                return COLOR_EMPTY;
            case 2:
                return COLOR_2;
            case 4:
                return COLOR_4;
            case 8:
                return COLOR_8;
            case 16:
                return COLOR_16;
            case 32:
                return COLOR_32;
            case 64:
                return COLOR_64;
            case 128:
                return COLOR_128;
            case 256:
                return COLOR_256;
            case 512:
                return COLOR_512;
            case 1024:
                return COLOR_1024;
            case 2048:
                return COLOR_2048;
            default:
                return COLOR_OTHER;
        }
    }

    textColor(value) {
        const COLOR_VALUE_LIGHT = 'rgb(249, 246, 242)'; // For tiles >= 8
        const COLOR_VALUE_DARK = 'rgb(119, 110, 101)'; // For tiles < 8

        if (value >= 8) {
            return COLOR_VALUE_LIGHT;
        } else {
            return COLOR_VALUE_DARK;
        }
    }

    textSize(value) {
        const TWO_DIGITS = 45;
        const THREE_DIGITS = 37;
        const FOUR_DIGITS = 30;
        const FIVE_DIGITS = 25;

        if (value >= 0 && value < 10) {
            return TWO_DIGITS;
        } else if (value >= 10 && value < 100) {
            return TWO_DIGITS;
        } else if (value >= 100 && value < 1000) {
            return THREE_DIGITS;
        } else if (value >= 1000 && value < 10000) {
            return FOUR_DIGITS;
        } else {
            return FIVE_DIGITS;
        }
    }

    render() {
        const value = this.props.value;
        const style = {
            background: this.backgroundColor(value),
            fontSize: this.textSize(value),
            color: this.textColor(value),
        }

        return (
            <div className="square" style={style}>
                {value !== 0 ? value : ""}
            </div >
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.keyPressHandler = this.keyPressHandler.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.keyPressHandler, false);
    }


    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyPressHandler, false);
    }

    keyPressHandler(event) {
        let keyPressed = event.key;
        const upKeys = ["w", "W", "ArrowUp"];
        const downKeys = ["s", "S", "ArrowDown"];
        const leftKeys = ["a", "A", "ArrowLeft"];
        const rightKeys = ["d", "D", "ArrowRight"];

        for (let i = 0; i < upKeys.length; i++) {
            if (keyPressed === upKeys[i]) {
                this.props.onMovement(Direction.UP);
                return;
            }
        }

        for (let i = 0; i < downKeys.length; i++) {
            if (keyPressed === downKeys[i]) {
                this.props.onMovement(Direction.DOWN);
                return;
            }
        }

        for (let i = 0; i < leftKeys.length; i++) {
            if (keyPressed === leftKeys[i]) {
                this.props.onMovement(Direction.LEFT);
                return;
            }
        }

        for (let i = 0; i < rightKeys.length; i++) {
            if (keyPressed === rightKeys[i]) {
                this.props.onMovement(Direction.RIGHT);
                return;
            }
        }
    }

    renderSquare(i) {
        return <Square value={i} />;
    }

    render() {
        let status = 'Score: ' + this.props.score;

        if (this.props.gameOver()) {
            status = "Game Over! " + status;
        }
        const grid = this.props.grid;

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board">
                    {this.renderSquare(grid[0][0])}
                    {this.renderSquare(grid[0][1])}
                    {this.renderSquare(grid[0][2])}
                    {this.renderSquare(grid[0][3])}
                    {this.renderSquare(grid[1][0])}
                    {this.renderSquare(grid[1][1])}
                    {this.renderSquare(grid[1][2])}
                    {this.renderSquare(grid[1][3])}
                    {this.renderSquare(grid[2][0])}
                    {this.renderSquare(grid[2][1])}
                    {this.renderSquare(grid[2][2])}
                    {this.renderSquare(grid[2][3])}
                    {this.renderSquare(grid[3][0])}
                    {this.renderSquare(grid[3][1])}
                    {this.renderSquare(grid[3][2])}
                    {this.renderSquare(grid[3][3])}
                </div>
            </ div>
        );
    }
}

class Logic extends React.Component {
    constructor(props) {
        super(props);
        // this.GRID_SIZE = this.props.boardSize < 2 ? 4 : this.props.boardSize;
        this.GRID_SIZE = 4;
        this.NUM_START_TILES = 2;
        this.TWO_PROBABILITY = 0.9;

        this.handleMovement = this.handleMovement.bind(this);
        this.isGameOver = this.isGameOver.bind(this);

        let newGrid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]

        for (let i = 0; i < this.NUM_START_TILES; i++) {
            newGrid = this.addRandomTile(newGrid);
        }

        this.state = {
            score: 0,
            grid: newGrid,
        }
    }

    render() {
        return (
            <Board
                score={this.state.score}
                grid={this.state.grid}
                onMovement={this.handleMovement}
                gameOver={this.isGameOver}
            />
        );
    }

    addRandomTile(inputGrid) {
        let grid = inputGrid;
        //counts the number of empty spaces in the board
        let count = 0;
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (grid[i][j] === 0) {
                    count++;
                }
            }
        }

        if (count === 0) {//if no empty space, don't add more tiles
            return;
        }

        //calculate random location to put the tile in
        let tileLocation = Math.floor((Math.random() * count));

        //determines whether tile is 2 or 4 depending on specified probability
        let tileValue = Math.random() < this.TWO_PROBABILITY ? 2 : 4;

        //adds the tile into the random location calculated previously
        let iteration = 0; //to count numbers of 0s passed
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (iteration === tileLocation && grid[i][j] === 0) {
                    grid[i][j] = tileValue;
                    return grid;
                }
                if (grid[i][j] === 0) {
                    iteration++;//increment count when passing another 0
                }
            }
        }
    }

    canMove(direction) {
        //uses 4 helper methods, 1 for each direction.
        if (direction === Direction.RIGHT) {
            return this.canMoveRight();
        }

        if (direction === Direction.LEFT) {
            return this.canMoveLeft();
        }

        if (direction === Direction.UP) {
            return this.canMoveUp();
        }

        if (direction === Direction.DOWN) {
            return this.canMoveDown();
        }
        return false; //if direction is invalid
    }

    canMoveRight() {
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = this.GRID_SIZE - 1; j > 0; j--) {
                //1: two adjacent horizontal tiles have the same value
                //and non 0 (both tiles can combine)
                let check1 = this.state.grid[i][j] === this.state.grid[i][j - 1] && this.state.grid[i][j - 1] !== 0;
                //2: an empty space exists and a non-0 tile exists on its left
                let check2 = this.state.grid[i][j] === 0 && this.state.grid[i][j - 1] !== 0;
                if (check1 || check2) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveLeft() {
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE - 1; j++) {
                //1: two adjacent horizontal tiles have the same value
                //and non 0 (both tiles can combine)
                let check1 = this.state.grid[i][j] === this.state.grid[i][j + 1] && this.state.grid[i][j + 1] !== 0;
                //2: an empty space exists and a non-0 tile exists on its right
                let check2 = this.state.grid[i][j] === 0 && this.state.grid[i][j + 1] !== 0;
                if (check1 || check2) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveUp() {
        for (let i = 0; i < this.GRID_SIZE - 1; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                //1: two adjacent vertical tiles have the same value
                //and non 0 (both tiles can combine)
                let check1 = this.state.grid[i][j] === this.state.grid[i + 1][j] && this.state.grid[i + 1][j] !== 0;
                //2: an empty space exists and a non-0 tile exists below it
                let check2 = this.state.grid[i][j] === 0 && this.state.grid[i + 1][j] !== 0;
                if (check1 || check2) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveDown() {
        for (let i = this.GRID_SIZE - 1; i > 0; i--) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                //1: two adjacent vertical tiles have the same value
                //and non 0 (both tiles can combine)
                let check1 = this.state.grid[i][j] === this.state.grid[i - 1][j] && this.state.grid[i - 1][j] !== 0;
                //2: an empty space exists and a non-0 tile exists above it
                let check2 = this.state.grid[i][j] === 0 && this.state.grid[i - 1][j] !== 0;
                if (check1 || check2) {
                    return true;
                }
            }
        }
        return false;
    }

    move(direction) {
        //if no valid move exists, return false
        if (!this.canMove(direction)) {
            return false;
        }

        //uses 8 helper methods, 2 for each direction. To move the tiles and
        //avoid edge cases, shift -> combine -> shift again. It imitates the way
        //we intuitively expect it to behave.
        if (direction === Direction.RIGHT) {
            let grid = this.state.grid;
            grid = this.shiftRight(grid);
            grid = this.combineRight(grid);
            grid = this.shiftRight(grid);
            this.setState({ grid: grid });
            return true;
        }

        if (direction === Direction.LEFT) {
            let grid = this.state.grid;
            grid = this.shiftLeft(grid);
            grid = this.combineLeft(grid);
            grid = this.shiftLeft(grid);
            this.setState({ grid: grid });
            return true;
        }

        if (direction === Direction.UP) {
            let grid = this.state.grid;
            grid = this.shiftUp(grid);
            grid = this.combineUp(grid);
            grid = this.shiftUp(grid);
            this.setState({ grid: grid });
            return true;
        }

        if (direction === Direction.DOWN) {
            let grid = this.state.grid;
            grid = this.shiftDown(grid);
            grid = this.combineDown(grid);
            grid = this.shiftDown(grid);
            this.setState({ grid: grid });
            return true;
        }
        return false; //if direction is invalid
    }

    shiftRight(grid) {
        //loops through everything except last column (tiles in the last column
        //can't be moved right any further)
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = this.GRID_SIZE - 2; j >= 0; j--) {
                if (grid[i][j] !== 0) {//source to be moved !== 0
                    //searches for any 0 to the right of grid[i][j]
                    for (let k = this.GRID_SIZE - 1; k > j; k--) {
                        if (grid[i][k] === 0) { //when 0 is found, move tile
                            grid[i][k] = grid[i][j];
                            grid[i][j] = 0;
                            break;
                        }
                    }
                }
            }
        }

        return grid;
    }

    combineRight(grid) {
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = this.GRID_SIZE - 1; j > 0; j--) {
                //if adjacent horizontal tiles are the same and non 0, combine
                if (grid[i][j] === grid[i][j - 1] && grid[i][j] !== 0) {
                    grid[i][j] *= 2;
                    grid[i][j - 1] = 0;
                    let score = this.state.score;
                    score += grid[i][j];
                    this.setState({ score: score });
                }
            }
        }

        return grid;
    }

    shiftLeft(grid) {
        //loops through everything except first column(tiles in the first column
        //can't be moved left any further)
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 1; j < this.GRID_SIZE; j++) {
                if (grid[i][j] !== 0) {//source to be moved !== 0
                    //searches for any 0 to the left of grid[i][j]
                    for (let k = 0; k < j; k++) {
                        if (grid[i][k] === 0) { //when 0 is found, move tile
                            grid[i][k] = grid[i][j];
                            grid[i][j] = 0;
                            break;
                        }
                    }
                }
            }
        }

        return grid;
    }

    combineLeft(grid) {
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE - 1; j++) {
                //if adjacent horizontal tiles are the same and non 0, combine
                if (grid[i][j] === grid[i][j + 1] && grid[i][j] !== 0) {
                    grid[i][j] *= 2;
                    grid[i][j + 1] = 0;
                    let score = this.state.score;
                    score += grid[i][j];
                    this.setState({ score: score });
                }
            }
        }

        return grid;
    }

    shiftUp(grid) {
        //loops through everything except first row (tiles in the first row
        //can't be moved up any further)
        for (let i = 1; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (grid[i][j] !== 0) {//source to be moved !== 0
                    for (let k = 0; k < i; k++) {
                        //searches for any 0 above grid[i][j]
                        if (grid[k][j] === 0) { //when 0 is found, move tile
                            grid[k][j] = grid[i][j];
                            grid[i][j] = 0;
                            break;
                        }
                    }
                }
            }
        }

        return grid;
    }

    combineUp(grid) {
        for (let i = 0; i < this.GRID_SIZE - 1; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                //if adjacent vertical tiles are the same and non 0, combine
                if (grid[i][j] === grid[i + 1][j] && grid[i][j] !== 0) {
                    grid[i][j] *= 2;
                    grid[i + 1][j] = 0;
                    let score = this.state.score;
                    score += grid[i][j];
                    this.setState({ score: score });
                }
            }
        }

        return grid;
    }

    shiftDown(grid) {
        //loops through everything except last row (tiles in the last row
        //can't be moved down any further)
        for (let i = this.GRID_SIZE - 2; i >= 0; i--) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (grid[i][j] !== 0) {//source to be moved !== 0
                    //searches for any 0 below grid[i][j]
                    for (let k = this.GRID_SIZE - 1; k > i; k--) {
                        if (grid[k][j] === 0) { //when 0 is found, move tile
                            grid[k][j] = grid[i][j];
                            grid[i][j] = 0;
                            break;
                        }
                    }
                }
            }
        }

        return grid;
    }

    combineDown(grid) {
        for (let i = this.GRID_SIZE - 1; i > 0; i--) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                //if adjacent vertical tiles are the same and non 0, combine
                if (grid[i][j] === grid[i - 1][j] && grid[i][j] !== 0) {
                    grid[i][j] *= 2;
                    grid[i - 1][j] = 0;
                    let score = this.state.score;
                    score += this.state.grid[i][j];
                    this.setState({ score: score });
                }
            }
        }

        return grid;
    }

    isGameOver() {
        //if no valid move exists, game over is true
        if (this.canMoveRight() || this.canMoveLeft() || this.canMoveUp() || this.canMoveDown()) {
            return false;
        }
        return true;
    }


    handleMovement(direction) {
        if (this.move(direction)) {
            const newGrid = this.addRandomTile(this.state.grid);
            this.setState({ grid: newGrid })
        }
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="game">
                <Logic />
            </div>
        );
    }
}

export default App;
