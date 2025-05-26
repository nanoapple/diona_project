
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface Game2048Props {
  onBack: () => void;
}

const Game2048 = ({ onBack }: Game2048Props) => {
  const [squares, setSquares] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const width = 4;

  // Generate a new number
  const generate = useCallback(() => {
    setSquares(prev => {
      const emptySquares = prev.map((val, index) => val === 0 ? index : -1).filter(val => val !== -1);
      if (emptySquares.length > 0) {
        const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        const newSquares = [...prev];
        newSquares[randomIndex] = 2;
        return newSquares;
      }
      return prev;
    });
  }, []);

  // Initialize board
  useEffect(() => {
    const initialSquares = Array(16).fill(0);
    setSquares(initialSquares);
    setScore(0);
    setResult("");
    
    // Generate two initial numbers
    setTimeout(() => generate(), 100);
    setTimeout(() => generate(), 200);
  }, [generate]);

  // Move functions
  const moveRight = () => {
    setSquares(prev => {
      const newSquares = [...prev];
      for (let i = 0; i < 16; i += 4) {
        const row = [newSquares[i], newSquares[i + 1], newSquares[i + 2], newSquares[i + 3]];
        const filteredRow = row.filter(num => num);
        const missing = 4 - filteredRow.length;
        const zeros = Array(missing).fill(0);
        const newRow = zeros.concat(filteredRow);
        
        newSquares[i] = newRow[0];
        newSquares[i + 1] = newRow[1];
        newSquares[i + 2] = newRow[2];
        newSquares[i + 3] = newRow[3];
      }
      return newSquares;
    });
  };

  const moveLeft = () => {
    setSquares(prev => {
      const newSquares = [...prev];
      for (let i = 0; i < 16; i += 4) {
        const row = [newSquares[i], newSquares[i + 1], newSquares[i + 2], newSquares[i + 3]];
        const filteredRow = row.filter(num => num);
        const missing = 4 - filteredRow.length;
        const zeros = Array(missing).fill(0);
        const newRow = filteredRow.concat(zeros);
        
        newSquares[i] = newRow[0];
        newSquares[i + 1] = newRow[1];
        newSquares[i + 2] = newRow[2];
        newSquares[i + 3] = newRow[3];
      }
      return newSquares;
    });
  };

  const moveUp = () => {
    setSquares(prev => {
      const newSquares = [...prev];
      for (let i = 0; i < 4; i++) {
        const column = [newSquares[i], newSquares[i + 4], newSquares[i + 8], newSquares[i + 12]];
        const filteredColumn = column.filter(num => num);
        const missing = 4 - filteredColumn.length;
        const zeros = Array(missing).fill(0);
        const newColumn = filteredColumn.concat(zeros);
        
        newSquares[i] = newColumn[0];
        newSquares[i + 4] = newColumn[1];
        newSquares[i + 8] = newColumn[2];
        newSquares[i + 12] = newColumn[3];
      }
      return newSquares;
    });
  };

  const moveDown = () => {
    setSquares(prev => {
      const newSquares = [...prev];
      for (let i = 0; i < 4; i++) {
        const column = [newSquares[i], newSquares[i + 4], newSquares[i + 8], newSquares[i + 12]];
        const filteredColumn = column.filter(num => num);
        const missing = 4 - filteredColumn.length;
        const zeros = Array(missing).fill(0);
        const newColumn = zeros.concat(filteredColumn);
        
        newSquares[i] = newColumn[0];
        newSquares[i + 4] = newColumn[1];
        newSquares[i + 8] = newColumn[2];
        newSquares[i + 12] = newColumn[3];
      }
      return newSquares;
    });
  };

  const combineRow = () => {
    setSquares(prev => {
      const newSquares = [...prev];
      let newScore = 0;
      
      for (let i = 0; i < 15; i++) {
        if (i % 4 !== 3 && newSquares[i] === newSquares[i + 1] && newSquares[i] !== 0) {
          const combinedTotal = newSquares[i] + newSquares[i + 1];
          newSquares[i] = combinedTotal;
          newSquares[i + 1] = 0;
          newScore += combinedTotal;
        }
      }
      
      setScore(prev => prev + newScore);
      return newSquares;
    });
  };

  const combineColumn = () => {
    setSquares(prev => {
      const newSquares = [...prev];
      let newScore = 0;
      
      for (let i = 0; i < 12; i++) {
        if (newSquares[i] === newSquares[i + 4] && newSquares[i] !== 0) {
          const combinedTotal = newSquares[i] + newSquares[i + 4];
          newSquares[i] = combinedTotal;
          newSquares[i + 4] = 0;
          newScore += combinedTotal;
        }
      }
      
      setScore(prev => prev + newScore);
      return newSquares;
    });
  };

  // Check for win
  const checkForWin = useCallback(() => {
    if (squares.includes(2048)) {
      setResult("You WIN!");
      setTimeout(() => setResult(""), 3000);
    }
  }, [squares]);

  // Check for game over
  const checkForGameOver = useCallback(() => {
    const zeros = squares.filter(val => val === 0).length;
    if (zeros === 0) {
      setResult("You LOSE!");
      setTimeout(() => setResult(""), 3000);
    }
  }, [squares]);

  // Key controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (result) return; // Don't allow moves if game is over
    
    e.preventDefault();
    
    if (e.key === "ArrowLeft") {
      moveLeft();
      setTimeout(() => {
        combineRow();
        setTimeout(() => {
          moveLeft();
          setTimeout(generate, 100);
        }, 50);
      }, 50);
    } else if (e.key === "ArrowRight") {
      moveRight();
      setTimeout(() => {
        combineRow();
        setTimeout(() => {
          moveRight();
          setTimeout(generate, 100);
        }, 50);
      }, 50);
    } else if (e.key === "ArrowUp") {
      moveUp();
      setTimeout(() => {
        combineColumn();
        setTimeout(() => {
          moveUp();
          setTimeout(generate, 100);
        }, 50);
      }, 50);
    } else if (e.key === "ArrowDown") {
      moveDown();
      setTimeout(() => {
        combineColumn();
        setTimeout(() => {
          moveDown();
          setTimeout(generate, 100);
        }, 50);
      }, 50);
    }
  }, [result, generate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    checkForWin();
    checkForGameOver();
  }, [squares, checkForWin, checkForGameOver]);

  // Get tile color
  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: "#afa192",
      2: "#eee4da",
      4: "#ede0c8",
      8: "#f2b179",
      16: "#ffcea4",
      32: "#e8c064",
      64: "#ffab6e",
      128: "#fd9982",
      256: "#ead79c",
      512: "#76daff",
      1024: "#beeaa5",
      2048: "#d7d4f0"
    };
    return colors[value] || "#3c3a32";
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-green-500/50" onClick={onBack} />
      
      <div className="absolute top-0 right-0 h-full w-[85%] bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="hover:bg-green-100"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-green-700">2048 - Mindfulness Game</h2>
              <p className="text-green-600">Use arrow keys to combine tiles and reach 2048!</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Score: <span id="score">{score}</span></div>
              {result && (
                <div className="text-xl font-bold text-green-700" id="result">{result}</div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg">
              {squares.map((value, index) => (
                <div
                  key={index}
                  className="w-16 h-16 flex items-center justify-center text-lg font-bold rounded"
                  style={{ backgroundColor: getTileColor(value) }}
                >
                  {value !== 0 ? value : ''}
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-600 max-w-md">
              <p className="mb-2"><strong>How to play:</strong></p>
              <p>Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
              <p className="mt-2">This mindful game helps improve focus and concentration while providing a relaxing mental challenge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2048;
