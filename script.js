window.onload = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const buttons = document.querySelectorAll('.buttons button');

    let expression = '';
    let result = '';
    let lastInput = '';

    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark');
        const themeText = document.getElementById('theme-text');
        themeText.textContent = themeToggle.checked ? 'Switch to light' : 'Switch to dark';
    });

    function calculate(expression) {
        expression = expression.replace(/(\d+)%/g, (match, num) => num / 100);

        const tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\(|\))/g);
        if (!tokens) return 'Error';

        const output = [];
        const operators = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

        let prevToken = null;

        tokens.forEach(token => {
            if (!isNaN(token)) {
                output.push(Number(token));
            } else if (token === '-' && (prevToken === null || '()+-*/'.includes(prevToken))) {
                output.push(0);
                operators.push('-');
            } else if ('+-*/'.includes(token)) {
                while (
                    operators.length &&
                    precedence[operators[operators.length - 1]] >= precedence[token]
                ) {
                    output.push(operators.pop());
                }
                operators.push(token);
            }
            prevToken = token;
        });

        while (operators.length) {
            output.push(operators.pop());
        }

        const stack = [];
        for (let token of output) {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                if (token === '+') stack.push(a + b);
                if (token === '-') stack.push(a - b);
                if (token === '*') stack.push(a * b);
                if (token === '/') stack.push(a / b);
            }
        }

        return stack.length ? stack[0].toString() : 'Error';
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === 'AC') {
                expression = '';
                result = '';
                lastInput = '';
            } else if (value === '=') {
                if (expression) {
                    try {
                        result = calculate(expression);
                    } catch {
                        result = 'Error';
                    }
                } else {
                    result = 'Error';
                }
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (!['+', '-', '*', '/'].includes(lastInput) && expression) {
                    expression += value;
                }
            } else if (value === '%') {
                if (/\d$/.test(expression)) {
                    expression += '%';
                }
            } else if (value === '+/-') {
                const match = expression.match(/(-?\d+(\.\d+)?)$/);

                if (match) {
                    const number = match[0];
                    const startIndex = expression.lastIndexOf(number);

                    let newNumber;
                    if (number.startsWith('-')) {
                        newNumber = number.slice(1);
                    } else {
                        newNumber = `(-${number})`;
                    }

                    expression = expression.slice(0, startIndex) + newNumber;
                }
            } else {
                expression += value;
            }

            lastInput = value;

            expressionDisplay.textContent = expression;
            resultDisplay.textContent = result;

            if (expression.length > 10 || result.length > 10) {
                expressionDisplay.classList.add('long');
                resultDisplay.classList.add('long');
            } else {
                expressionDisplay.classList.remove('long');
                resultDisplay.classList.remove('long');
            }
        });
    });
}
