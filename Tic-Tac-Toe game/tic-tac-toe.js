document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const winModal = document.getElementById('winModal');
    const closeModal = document.getElementById('closeModal');
    const winMessage = document.getElementById('winMessage');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add('rotate');  // Add the rotate class

        // Force reflow and then remove the rotate class to re-trigger the animation
        void clickedCell.offsetWidth;  // Trigger a reflow
        setTimeout(() => {
            clickedCell.classList.remove('rotate');  // Remove the rotate class after the animation
        }, 200);  // Match this duration with the animation duration in CSS
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
            winMessage.innerHTML = `Player ${currentPlayer} has won!`;  // Set the win message
            winModal.style.display = 'block';  // Display the modal
            gameActive = false;
            return;
        }

        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = 'Game ended in a draw!';
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('rotate');  // Ensure the class is removed when restarting
        });
        winModal.style.display = 'none';  // Hide the modal on game restart
        startGameAnimation();  // Add this line to start the animation on game restart
    }

    function startGameAnimation() {
        cells.forEach(cell => {
            cell.classList.add('rotate');  // Add the rotate class to each cell
            // Force reflow and then remove the rotate class to re-trigger the animation
            void cell.offsetWidth;  // Trigger a reflow
            setTimeout(() => {
                cell.classList.remove('rotate');  // Remove the rotate class after the animation
            }, 500);  // Match this duration with the animation duration in CSS
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
    closeModal.addEventListener('click', () => winModal.style.display = 'none');  // Add event listener for closing the modal

    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    startGameAnimation();  // Add this line to start the animation on page load
});
