// 定义俄罗斯方块的形状
const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const O = [
    [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');

// 定义行和列数
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 32;
const VACANT = 'BLACK'; // 空方块颜色

// 绘制方块
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = 'WHITE';
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// 创建游戏板
let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// 绘制游戏板
function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}
drawBoard();

// 方块及其颜色
const PIECES = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'yellow'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange']
];

// 随机生成方块
function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length); // 0 -> 6
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

// 方块对象
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // 从第一个形状开始
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // 方块的位置
    this.x = 3;
    this.y = -2;
}

// 填充方块
Piece.prototype.fill = function(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino[r].length; c++) {
            // 绘制非空方块
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

// 绘制方块
Piece.prototype.draw = function() {
    this.fill(this.color);
}

// 擦除方块
Piece.prototype.unDraw = function() {
    this.fill(VACANT);
}

// 移动下落的方块
Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // 锁定方块并生成新方块
        this.lock();
        p = randomPiece();
    }
}

// 移动方块到左边
Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// 移动方块到右边
Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// 旋转方块
Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = nextPattern;
        this.draw();
    }
}

// 锁定方块并检查消行
let score = 0;
Piece.prototype.lock = function() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino[r].length; c++) {
            // 跳过空方块
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // 如果方块超出上边界，游戏结束
            if (this.y + r < 0) {
                alert('游戏结束');
                // 停止动画帧
                gameOver = true;
                break;
            }
            // 锁定方块
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // 检查消行
    for (let r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (let c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            // 消除满行并下移上方所有行
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // 顶行清空
            for (let c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            // 增加分数
            score += 10;
        }
    }
    // 更新游戏板
    drawBoard();

    // 更新分数
    scoreElement.innerHTML = score;
}

// 检查碰撞
Piece.prototype.collision = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            // 如果方块为空，跳过
            if (!piece[r][c]) {
                continue;
            }
            // 方块移动后的新坐标
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // 检查边界
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            // 跳过新坐标在上方边界外的情况
            if (newY < 0) {
                continue;
            }
            // 检查方块是否与已锁定的方块重叠
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

// 控制方块移动
document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37 || event.key === 'ArrowLeft') {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38 || event.key === 'ArrowUp') {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39 || event.key === 'ArrowRight') {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40 || event.key === 'ArrowDown') {
        p.moveDown();
    } else if (event.key === ' ') {
        // 空格键触发开始游戏按钮
        startButton.click();
    } else if (event.key === 'Escape') {
        // Esc键触发暂停游戏按钮
        pauseButton.click();
    } else if (event.key === 'Enter') {
        // Enter键触发重新开始游戏按钮
        restartButton.click();
    }
}

// 每秒下移方块
let dropStart = Date.now();
let gameOver = false;
let gamePaused = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver && !gamePaused) {
        requestAnimationFrame(drop);
    }
}

let p;

// 按钮事件
startButton.addEventListener('click', function() {
    if (!gamePaused && !gameOver) {
        p = randomPiece();
        drop();
    }
});

pauseButton.addEventListener('click', function() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        drop();
    }
});

restartButton.addEventListener('click', function() {
    gameOver = false;
    gamePaused = false;
    score = 0;
    board = [];
    for (let r = 0; r < ROW; r++) {
        board[r] = [];
        for (let c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;
    p = randomPiece();
    drop();
});
