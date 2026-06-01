// Initialize Chess.js game logic engine
let game = new Chess();
let board = null;

// DOM Elements
const $status = $('#status');
const $resetBtn = $('#resetBtn');

// Prevent dragging pieces if the game is over or if it's the wrong color's turn
function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;

    // Only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

// Handle when a piece is dropped on a square
function onDrop(source, target) {
    // See if the move is legal
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Automatically promote to a Queen for simplicity
    });

    // If illegal move, snap the piece back
    if (move === null) return 'snapback';

    updateStatus();
}

// Update the board position after piece animations finish (required for castling, en passant, etc.)
function onSnapEnd() {
    board.position(game.fen());
}

// Update game status text (Check, Checkmate, Draw, or Next Move)
function updateStatus() {
    let status = '';
    let moveColor = (game.turn() === 'b') ? 'Black' : 'White';

    if (game.in_checkmate()) {
        status = `Game over, ${moveColor} is in checkmate.`;
    } else if (game.in_draw()) {
        status = 'Game over, drawn position.';
    } else {
        status = `${moveColor} to move`;
        if (game.in_check()) {
            status += `, ${moveColor} is in CHECK!`;
        }
    }

    $status.html(status);
}

// Board Configuration
const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

// Initialize Chessboard.js
board = Chessboard('myBoard', config);
updateStatus();

// Reset Game Button Click Event
$resetBtn.on('click', function() {
    game.reset();
    board.start();
    updateStatus();
});

// Keep board responsive on window resize
$(window).resize(board.resize);
