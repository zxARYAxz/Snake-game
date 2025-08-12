const boardSize = 10;
    const cellSize = 30;
    const gameBoard = document.getElementById("game-board");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const restartGameButton = document.getElementById("restart-game");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("score");
    const gameOverDisplay = document.getElementById("game-over");
    const finalStatsDisplay = document.getElementById("final-stats");

    let snake = [{ x: 5, y: 5 }];
    let food = generateFood();
    let direction = { x: 1, y: 0 };
    let gameInterval;
    let timerInterval;
    let time = 0;

    // Create the game board
    function createBoard() {
      gameBoard.innerHTML = '';
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          gameBoard.appendChild(cell);
        }
      }
    }

    // Generate food in a position not occupied by the snake
    function generateFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize),
        };
      } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
      return newFood;
    }

    // Draw the snake and food
    function draw() {
      const cells = document.querySelectorAll(".cell");
      cells.forEach(cell => cell.classList.remove("snake", "food"));

      snake.forEach(segment => {
        const index = segment.y * boardSize + segment.x;
        cells[index].classList.add("snake");
      });

      const foodIndex = food.y * boardSize + food.x;
      cells[foodIndex].classList.add("food");
      
      // Update score display
      scoreDisplay.textContent = `Length: ${snake.length}`;
    }

    // Update the game state
    function update() {
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // Check for collisions
      if (
        head.x < 0 || head.x >= boardSize ||
        head.y < 0 || head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        endGame();
        return;
      }

      snake.unshift(head);

      // Check if the snake eats the food
      if (head.x === food.x && head.y === food.y) {
        food = generateFood();
      } else {
        snake.pop();
      }

      draw();
    }

    // Start the game
    function startGame() {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      snake = [{ x: 5, y: 5 }];
      food = generateFood();
      direction = { x: 1, y: 0 };
      time = 0;
      timerDisplay.textContent = "Time: 0s";
      scoreDisplay.textContent = "Length: 1";
      gameOverDisplay.style.display = "none";
      startButton.style.display = "none";
      restartButton.style.display = "inline-block";
      draw();
      gameInterval = setInterval(update, 500);
      timerInterval = setInterval(() => {
        time++;
        timerDisplay.textContent = `Time: ${time}s`;
      }, 1000);
    }

    // End the game
    function endGame() {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      document.getElementById('final-time').textContent = `Time: ${time}s`;
      document.getElementById('final-length').textContent = `Length: ${snake.length}`;
      gameOverDisplay.style.display = "block";
    }

    // Handle keyboard input
    function handleKeyPress(event) {
      const key = event.code;

      // Move up (W key or ArrowUp)
      if ((key === "KeyW" || key === "ArrowUp") && direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
      // Move down (S key or ArrowDown)
      if ((key === "KeyS" || key === "ArrowDown") && direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
      // Move left (A key or ArrowLeft)
      if ((key === "KeyA" || key === "ArrowLeft") && direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
      // Move right (D key or ArrowRight)
      if ((key === "KeyD" || key === "ArrowRight") && direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
    }

    // Event listeners
    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);
    restartGameButton.addEventListener("click", startGame);
    document.addEventListener("keydown", handleKeyPress);

    // Initialize the board
    createBoard();