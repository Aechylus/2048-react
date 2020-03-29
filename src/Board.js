import React from 'react';
import './Board.css';
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
        this.gameOverClickHandler = this.gameOverClickHandler.bind(this);
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

    gameOverClickHandler() {
        this.props.resetBoard();
    }

    render() {
        let status = 'Score: ' + this.props.score;

        let style = {}
        if (this.props.gameOver()) {
            style = {
                opacity: 1
            }
        }
        const grid = this.props.grid;

        return (
            <div>
                <div className="game-over" style={style}>
                    <div className="game-over-overlay"></div>
                    <div className="game-over-text">
                        Game Over
                        <div className="game-over-button">
                            <button onClick={this.gameOverClickHandler}>New Game</button>
                        </div>
                    </div>
                </div>
                <div className="game">
                    <div className="status">{status}</div>
                    <div className="board">
                        <Square value={grid[0][0]} />
                        <Square value={grid[0][1]} />
                        <Square value={grid[0][2]} />
                        <Square value={grid[0][3]} />
                        <Square value={grid[1][0]} />
                        <Square value={grid[1][1]} />
                        <Square value={grid[1][2]} />
                        <Square value={grid[1][3]} />
                        <Square value={grid[2][0]} />
                        <Square value={grid[2][1]} />
                        <Square value={grid[2][2]} />
                        <Square value={grid[2][3]} />
                        <Square value={grid[3][0]} />
                        <Square value={grid[3][1]} />
                        <Square value={grid[3][2]} />
                        <Square value={grid[3][3]} />
                    </div>
                </ div>
            </div >
        );
    }
}

export default Board;