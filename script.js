// Get references to DOM elements
const previousOperandDisplay = document.getElementById('previousOperandDisplay');
const currentOperandDisplay = document.getElementById('currentOperandDisplay');
const calculatorButtons = document.querySelectorAll('.calc-button');

// Calculator state variables
let currentOperand = '';
let previousOperand = '';
let operation = undefined;
let shouldResetDisplay = false; // Flag to clear display after an operation or equals

/**
 * Appends a number to the current operand.
 * @param {string} number - The number string to append.
 */
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentOperand = number;
        shouldResetDisplay = false;
    } else if (number === '.' && currentOperand.includes('.')) {
        return; // Prevent multiple decimal points
    } else if (currentOperand === '0' && number !== '.') {
        currentOperand = number; // Replace initial '0' if a non-decimal number is pressed
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

/**
 * Chooses an operation and moves the current operand to the previous operand.
 * @param {string} selectedOperation - The operation symbol (+, -, ×, ÷).
 */
function chooseOperation(selectedOperation) {
    if (currentOperand === '') return; // Do nothing if no number is entered
    if (previousOperand !== '') {
        // If there's a previous operand and a new operation is chosen,
        // calculate the result of the previous operation first.
        calculate();
    }
    operation = selectedOperation;
    previousOperand = currentOperand;
    currentOperand = '';
    shouldResetDisplay = false; // Ensure display doesn't reset until a new number is typed
    updateDisplay();
}

/**
 * Performs the calculation based on the current operation.
 */
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return; // Do nothing if operands are not numbers

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                computation = 'Error: Division by zero';
                break;
            }
            computation = prev / current;
            break;
        default:
            return; // No operation selected
    }
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetDisplay = true; // Reset display for the next number input
    updateDisplay();
}

/**
 * Clears all operands and the operation.
 */
function clearAll() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    shouldResetDisplay = false;
    updateDisplay();
}

/**
 * Deletes the last character from the current operand.
 */
function deleteLast() {
    currentOperand = currentOperand.slice(0, -1);
    if (currentOperand === '') {
        currentOperand = '0'; // Display '0' if all characters are deleted
    }
    updateDisplay();
}

/**
 * Updates the display elements with current and previous operands.
 */
function updateDisplay() {
    currentOperandDisplay.textContent = currentOperand === '' ? '0' : currentOperand;
    if (operation != null) {
        previousOperandDisplay.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandDisplay.textContent = '';
    }
}

// Add event listeners to all calculator buttons
calculatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        const action = button.dataset.action;

        if (number != null) {
            appendNumber(number);
        } else if (action === 'clear') {
            clearAll();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'equals') {
            calculate();
        } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
            chooseOperation(button.textContent); // Use button's text content as operation symbol
        }
    });
});

// Initialize display on load
window.onload = () => {
    updateDisplay();
};