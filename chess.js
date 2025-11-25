import React, { useState, useEffect } from 'react';
import { Crown, RotateCcw, Flag, Clock } from 'lucide-react';

const ChessGame = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [validMoves, setValidMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [timer, setTimer] = useState({ white: 600, black: 600 });
  const [activeTimer, setActiveTimer] = useState('white');

  // Initialize chess board
  function initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Black pieces
    board[0] = [
      { type: 'rook', color: 'black', moved: false },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black', moved: false },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black', moved: false }
    ];
    board[1] = Array(8).fill({ type: 'pawn', color: 'black', moved: false });

    // White pieces
    board[6] = Array(8).fill({ type: 'pawn', color: 'white', moved: false });
    board[7] = [
      { type: 'rook', color: 'white', moved: false },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white', moved: false },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white', moved: false }
    ];

    return board;
  }

  // Timer logic
  useEffect(() => {
    if (isCheckmate) return;
    
    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimer = { ...prev };
        newTimer[activeTimer] = Math.max(0, prev[activeTimer] - 1);
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, isCheckmate]);

  // Get piece unicode symbol
  const getPieceSymbol = (piece) => {
    if (!piece) return '';
    const symbols = {
      white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
      black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
    };
    return symbols[piece.color][piece.type];
  };

  // Check if square is under attack
  const isSquareUnderAttack = (row, col, byColor, testBoard = board) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = testBoard[r][c];
        if (piece && piece.color === byColor) {
          const moves = getValidMovesForPiece(r, c, testBoard, false);
          if (moves.some(move => move.row === row && move.col === col)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Get valid moves for a piece
  const getValidMovesForPiece = (row, col, testBoard = board, checkForCheck = true) => {
    const piece = testBoard[row][col];
    if (!piece) return [];

    let moves = [];

    switch (piece.type) {
      case 'pawn':
        moves = getPawnMoves(row, col, piece, testBoard);
        break;
      case 'rook':
        moves = getRookMoves(row, col, piece, testBoard);
        break;
      case 'knight':
        moves = getKnightMoves(row, col, piece, testBoard);
        break;
      case 'bishop':
        moves = getBishopMoves(row, col, piece, testBoard);
        break;
      case 'queen':
        moves = getQueenMoves(row, col, piece, testBoard);
        break;
      case 'king':
        moves = getKingMoves(row, col, piece, testBoard);
        break;
    }

    // Filter out moves that would put own king in check
    if (checkForCheck) {
      moves = moves.filter(move => {
        const testBoardCopy = testBoard.map(row => [...row]);
        testBoardCopy[move.row][move.col] = testBoardCopy[row][col];
        testBoardCopy[row][col] = null;
        
        // Find king position
        let kingPos = null;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (testBoardCopy[r][c]?.type === 'king' && testBoardCopy[r][c]?.color === piece.color) {
              kingPos = { row: r, col: c };
              break;
            }
          }
          if (kingPos) break;
        }

        return !isSquareUnderAttack(kingPos.row, kingPos.col, piece.color === 'white' ? 'black' : 'white', testBoardCopy);
      });
    }

    return moves;
  };

  const getPawnMoves = (row, col, piece, testBoard) => {
    const moves = [];
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;

    // Forward move
    if (row + direction >= 0 && row + direction < 8 && !testBoard[row + direction][col]) {
      moves.push({ row: row + direction, col });
      
      // Double move from start
      if (row === startRow && !testBoard[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Captures
    [-1, 1].forEach(offset => {
      const newCol = col + offset;
      if (newCol >= 0 && newCol < 8 && row + direction >= 0 && row + direction < 8) {
        const target = testBoard[row + direction][newCol];
        if (target && target.color !== piece.color) {
          moves.push({ row: row + direction, col: newCol });
        }
      }
    });

    return moves;
  };

  const getRookMoves = (row, col, piece, testBoard) => {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dr, dc]) => {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (testBoard[r][c]) {
          if (testBoard[r][c].color !== piece.color) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        moves.push({ row: r, col: c });
        r += dr;
        c += dc;
      }
    });

    return moves;
  };

  const getKnightMoves = (row, col, piece, testBoard) => {
    const moves = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    knightMoves.forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!testBoard[r][c] || testBoard[r][c].color !== piece.color) {
          moves.push({ row: r, col: c });
        }
      }
    });

    return moves;
  };

  const getBishopMoves = (row, col, piece, testBoard) => {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(([dr, dc]) => {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (testBoard[r][c]) {
          if (testBoard[r][c].color !== piece.color) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        moves.push({ row: r, col: c });
        r += dr;
        c += dc;
      }
    });

    return moves;
  };

  const getQueenMoves = (row, col, piece, testBoard) => {
    return [...getRookMoves(row, col, piece, testBoard), ...getBishopMoves(row, col, piece, testBoard)];
  };

  const getKingMoves = (row, col, piece, testBoard) => {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!testBoard[r][c] || testBoard[r][c].color !== piece.color) {
          moves.push({ row: r, col: c });
        }
      }
    });

    return moves;
  };

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (isCheckmate) return;

    if (selectedSquare) {
      // Try to move
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);
      
      if (isValidMove) {
        const newBoard = board.map(r => [...r]);
        const piece = newBoard[selectedSquare.row][selectedSquare.col];
        const capturedPiece = newBoard[row][col];

        // Capture piece
        if (capturedPiece) {
          setCapturedPieces(prev => ({
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], capturedPiece]
          }));
        }

        // Move piece
        newBoard[row][col] = { ...piece, moved: true };
        newBoard[selectedSquare.row][selectedSquare.col] = null;

        // Pawn promotion
        if (piece.type === 'pawn' && (row === 0 || row === 7)) {
          newBoard[row][col] = { type: 'queen', color: piece.color, moved: true };
        }

        setBoard(newBoard);
        setMoveHistory(prev => [...prev, {
          from: selectedSquare,
          to: { row, col },
          piece: piece.type,
          captured: capturedPiece?.type
        }]);

        // Switch player
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
        setCurrentPlayer(nextPlayer);
        setActiveTimer(nextPlayer);

        // Check for check/checkmate
        checkForCheckAndCheckmate(newBoard, nextPlayer);
      }

      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Select piece
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col });
        const moves = getValidMovesForPiece(row, col);
        setValidMoves(moves);
      }
    }
  };

  const checkForCheckAndCheckmate = (testBoard, player) => {
    // Find king
    let kingPos = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (testBoard[r][c]?.type === 'king' && testBoard[r][c]?.color === player) {
          kingPos = { row: r, col: c };
          break;
        }
      }
      if (kingPos) break;
    }

    const inCheck = isSquareUnderAttack(kingPos.row, kingPos.col, player === 'white' ? 'black' : 'white', testBoard);
    setIsCheck(inCheck);

    // Check for checkmate
    if (inCheck) {
      let hasValidMove = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (testBoard[r][c]?.color === player) {
            const moves = getValidMovesForPiece(r, c, testBoard, true);
            if (moves.length > 0) {
              hasValidMove = true;
              break;
            }
          }
        }
        if (hasValidMove) break;
      }
      if (!hasValidMove) {
        setIsCheckmate(true);
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setValidMoves([]);
    setCapturedPieces({ white: [], black: [] });
    setIsCheck(false);
    setIsCheckmate(false);
    setMoveHistory([]);
    setTimer({ white: 600, black: 600 });
    setActiveTimer('white');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start justify-center">
        
        {/* Left Panel - Captured Pieces & Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 w-full lg:w-72 flex-shrink-0">
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <Crown className="text-yellow-400" />
            Game Status
          </h3>
          
          {/* Timers */}
          <div className="space-y-3 mb-6">
            <div className={`bg-white/10 p-3 rounded-lg ${activeTimer === 'black' ? 'ring-2 ring-purple-400' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Black</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-300" />
                  <span className="text-white font-mono">{formatTime(timer.black)}</span>
                </div>
              </div>
            </div>
            <div className={`bg-white/10 p-3 rounded-lg ${activeTimer === 'white' ? 'ring-2 ring-purple-400' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">White</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-300" />
                  <span className="text-white font-mono">{formatTime(timer.white)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Turn */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <p className="text-white text-sm mb-1">Current Turn:</p>
            <p className={`text-lg font-bold ${currentPlayer === 'white' ? 'text-white' : 'text-gray-300'}`}>
              {currentPlayer.toUpperCase()}
            </p>
          </div>

          {/* Status Messages */}
          {isCheck && !isCheckmate && (
            <div className="bg-red-500/20 border-2 border-red-500 p-3 rounded-lg mb-4">
              <p className="text-red-300 font-bold text-center">CHECK!</p>
            </div>
          )}
          
          {isCheckmate && (
            <div className="bg-yellow-500/20 border-2 border-yellow-500 p-3 rounded-lg mb-4">
              <p className="text-yellow-300 font-bold text-center">CHECKMATE!</p>
              <p className="text-yellow-300 text-sm text-center mt-1">
                {currentPlayer === 'white' ? 'Black' : 'White'} Wins!
              </p>
            </div>
          )}

          {/* Captured Pieces */}
          <div className="mb-4">
            <h4 className="text-white text-sm font-semibold mb-2">Captured by White:</h4>
            <div className="flex flex-wrap gap-1 bg-white/5 p-2 rounded-lg min-h-[40px]">
              {capturedPieces.white.map((piece, i) => (
                <span key={i} className="text-2xl">{getPieceSymbol(piece)}</span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-white text-sm font-semibold mb-2">Captured by Black:</h4>
            <div className="flex flex-wrap gap-1 bg-white/5 p-2 rounded-lg min-h-[40px]">
              {capturedPieces.black.map((piece, i) => (
                <span key={i} className="text-2xl">{getPieceSymbol(piece)}</span>
              ))}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            New Game
          </button>
        </div>

        {/* Chess Board - Center */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 flex-shrink-0">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Chess Master</h2>
          <div className="relative inline-block">
            {/* Row Coordinates (Left) */}
            <div className="absolute -left-8 top-0 h-full flex flex-col justify-around text-white text-sm font-semibold">
              {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                <div key={num} className="h-16 flex items-center justify-center">{num}</div>
              ))}
            </div>
            
            {/* Column Coordinates (Bottom) */}
            <div className="absolute -bottom-8 left-0 w-full flex justify-around text-white text-sm font-semibold">
              {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                <div key={letter} className="w-16 flex items-center justify-center">{letter}</div>
              ))}
            </div>

            {/* Chess Board Grid */}
            <div className="grid grid-cols-8 gap-0 border-4 border-amber-700 rounded-xl overflow-hidden shadow-2xl">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                  const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
                  const isKingInCheck = isCheck && piece?.type === 'king' && piece?.color === currentPlayer;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`
                        w-16 h-16 flex items-center justify-center text-5xl cursor-pointer transition-all relative
                        ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                        ${isSelected ? 'ring-4 ring-inset ring-cyan-400' : ''}
                        ${isKingInCheck ? 'ring-4 ring-inset ring-red-500 animate-pulse' : ''}
                        hover:brightness-110
                      `}
                    >
                      {piece && (
                        <span className="select-none pointer-events-none">{getPieceSymbol(piece)}</span>
                      )}
                      {isValidMove && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {board[rowIndex][colIndex] ? (
                            <div className="w-14 h-14 border-4 border-red-500 rounded-full opacity-50" />
                          ) : (
                            <div className="w-4 h-4 bg-green-500 rounded-full opacity-70" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Move History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 w-full lg:w-72 flex-shrink-0">
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <Flag className="text-green-400" />
            Move History
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {moveHistory.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No moves yet</p>
            ) : (
              moveHistory.map((move, i) => (
                <div key={i} className="bg-white/5 p-2 rounded-lg text-white text-sm">
                  <span className="font-bold">{i + 1}.</span> {move.piece} 
                  {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} → 
                  {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
                  {move.captured && <span className="text-red-400 ml-1">×{move.captured}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;