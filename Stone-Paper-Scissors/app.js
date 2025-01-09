const choices = ['rock', 'paper', 'scissors'];

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        const computerChoice = getComputerChoice();
        console.log(`Player chose: ${playerChoice}, Computer chose: ${computerChoice}`);
    });
});

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}
