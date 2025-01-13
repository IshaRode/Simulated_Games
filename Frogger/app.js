const width = 9;
        const squares = [];
        let currentIndex = 76;
        let timerId = null;
        let outcomeTimerId = null;
        let currentTime = 20;
        const timeLeftDisplay = document.querySelector('.time-left');
        const startPauseButton = document.querySelector('#start-pause-button');
        const gameStatus = document.querySelector('.game-status');
        let paused = true;
        let gameSpeed = 1000; // Base speed in milliseconds
        
        function createGrid() {
            const grid = document.querySelector('.grid');
            grid.innerHTML = ''; // Clear existing grid
            squares.length = 0; // Clear squares array
            
            for (let i = 0; i < width * width; i++) {
                const square = document.createElement('div');
                squares.push(square);
                grid.appendChild(square);
            }
            
            // Set starting position
            squares[currentIndex].classList.add('frog');
            
            // Add static elements
            squares[76].classList.add('starting-block');
            squares[4].classList.add('ending-block');
            
            // Add logs with different patterns
            [19, 20, 21, 22, 23].forEach(idx => squares[idx].classList.add('l1'));
            [28, 29, 30, 31].forEach(idx => squares[idx].classList.add('l2'));
            [37, 38, 39, 40, 41].forEach(idx => squares[idx].classList.add('l3'));
            
            // Add river sections
            [46, 47, 48, 49, 50].forEach(idx => squares[idx].classList.add('l4'));
            [55, 56, 57, 58].forEach(idx => squares[idx].classList.add('l5'));
            
            // Add cars in different lanes
            [64, 65, 66].forEach(idx => squares[idx].classList.add('c1'));
            [70, 71, 72].forEach(idx => squares[idx].classList.add('c2'));
            [73, 74, 75].forEach(idx => squares[idx].classList.add('c3'));
        }
        
        function moveFrog(e) {
            if (paused) return;
            
            squares[currentIndex].classList.remove('frog');
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (currentIndex % width !== 0) currentIndex -= 1;
                    break;
                case 'ArrowRight':
                    if (currentIndex % width < width - 1) currentIndex += 1;
                    break;
                case 'ArrowUp':
                    if (currentIndex - width >= 0) currentIndex -= width;
                    break;
                case 'ArrowDown':
                    if (currentIndex + width < width * width) currentIndex += width;
                    break;
                default:
                    return;
            }
            
            squares[currentIndex].classList.add('frog');
            checkOutcome();
        }
        
        function autoMoveElements() {
            if (paused) return;
            
            // Move elements at different speeds
            const time = Date.now();
            if (time % (gameSpeed * 2) === 0) {
                moveLogRight('.l1');
                moveCarRight('.c1');
            }
            if (time % (gameSpeed * 1.5) === 0) {
                moveLogLeft('.l2');
                moveCarLeft('.c2');
            }
            if (time % gameSpeed === 0) {
                moveLogRight('.l3');
                moveCarRight('.c3');
            }
            
            checkOutcome();
        }
        
        function moveLogRight(className) {
            const elements = document.querySelectorAll(className);
            const lastIndex = Array.from(elements).map(el => 
                Array.from(squares).indexOf(el)).sort((a,b) => b-a)[0];
            
            elements.forEach(element => {
                const currentIdx = Array.from(squares).indexOf(element);
                const nextIndex = currentIdx + 1;
                
                if (nextIndex % width !== 0) {
                    element.classList.remove(className.slice(1));
                    squares[nextIndex].classList.add(className.slice(1));
                    
                    // Move frog if it's on the log
                    if (currentIdx === currentIndex) {
                        squares[currentIndex].classList.remove('frog');
                        currentIndex = nextIndex;
                        squares[currentIndex].classList.add('frog');
                    }
                } else {
                    // Wrap to beginning of row
                    element.classList.remove(className.slice(1));
                    squares[nextIndex - width].classList.add(className.slice(1));
                }
            });
        }
        
        function moveLogLeft(className) {
            const elements = document.querySelectorAll(className);
            
            Array.from(elements).reverse().forEach(element => {
                const currentIdx = Array.from(squares).indexOf(element);
                const prevIndex = currentIdx - 1;
                
                if ((currentIdx) % width !== 0) {
                    element.classList.remove(className.slice(1));
                    squares[prevIndex].classList.add(className.slice(1));
                    
                    // Move frog if it's on the log
                    if (currentIdx === currentIndex) {
                        squares[currentIndex].classList.remove('frog');
                        currentIndex = prevIndex;
                        squares[currentIndex].classList.add('frog');
                    }
                } else {
                    // Wrap to end of row
                    element.classList.remove(className.slice(1));
                    squares[prevIndex + width].classList.add(className.slice(1));
                }
            });
        }
        
        function moveCarRight(className) {
            const elements = document.querySelectorAll(className);
            elements.forEach(element => {
                const currentIdx = Array.from(squares).indexOf(element);
                const nextIndex = currentIdx + 1;
                
                if (nextIndex % width !== 0) {
                    element.classList.remove(className.slice(1));
                    squares[nextIndex].classList.add(className.slice(1));
                } else {
                    // Wrap to beginning of row
                    element.classList.remove(className.slice(1));
                    squares[nextIndex - width].classList.add(className.slice(1));
                }
            });
        }
        
        function moveCarLeft(className) {
            const elements = document.querySelectorAll(className);
            Array.from(elements).reverse().forEach(element => {
                const currentIdx = Array.from(squares).indexOf(element);
                const prevIndex = currentIdx - 1;
                
                if ((currentIdx) % width !== 0) {
                    element.classList.remove(className.slice(1));
                    squares[prevIndex].classList.add(className.slice(1));
                } else {
                    // Wrap to end of row
                    element.classList.remove(className.slice(1));
                    squares[prevIndex + width].classList.add(className.slice(1));
                }
            });
        }
        
        function checkOutcome() {
            if (squares[currentIndex].classList.contains('ending-block')) {
                updateGameStatus('YOU WIN! 🎉');
                clearGame();
                return;
            }
            
            if (squares[currentIndex].classList.contains('c1')) {
                updateGameStatus('GAME OVER! Hit by a car! 💥');
                clearGame();
                return;
            }
            
            if (squares[currentIndex].classList.contains('l4') ||
                squares[currentIndex].classList.contains('l5')) {
                updateGameStatus('GAME OVER! Fell in the river! 💦');
                clearGame();
                return;
            }
        }
        
        function updateGameStatus(message) {
            gameStatus.textContent = message;
            setTimeout(() => {
                gameStatus.textContent = '';
            }, 3000);
        }
        
        function countDown() {
            if (paused) return;
            
            currentTime--;
            timeLeftDisplay.textContent = `Time: ${currentTime}`;
            
            if (currentTime === 0) {
                updateGameStatus('GAME OVER! Time\'s up! ⏰');
                clearGame();
            }
        }
        
        function clearGame() {
            clearInterval(timerId);
            clearInterval(outcomeTimerId);
            document.removeEventListener('keyup', moveFrog);
            paused = true;
            startPauseButton.textContent = 'Start Game';
        }
        
        function resetGame() {
            currentTime = 20;
            currentIndex = 76;
            timeLeftDisplay.textContent = `Time: ${currentTime}`;
            createGrid();
        }
        
        function startPause() {
            if (paused) {
                resetGame();
                paused = false;
                timerId = setInterval(autoMoveElements, 1000);
                outcomeTimerId = setInterval(countDown, 1000);
                document.addEventListener('keyup', moveFrog);
                startPauseButton.textContent = 'Pause';
                gameStatus.textContent = '';
            } else {
                paused = true;
                clearInterval(timerId);
                clearInterval(outcomeTimerId);
                document.removeEventListener('keyup', moveFrog);
                startPauseButton.textContent = 'Resume';
                updateGameStatus('Game Paused ⏸️');
            }
        }
        
        // Initialize game
        createGrid();
        startPauseButton.addEventListener('click', startPause);