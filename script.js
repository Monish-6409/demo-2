const display = document.getElementById('display');
const historyEl = document.getElementById('history');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

function updateScreen() {
  display.textContent = current;
  historyEl.textContent = previous !== null && operator
    ? `${previous} ${operator}`
    : '';
}

function inputDigit(digit) {
  if (current === '0' || justEvaluated) {
    current = digit;
    justEvaluated = false;
  } else {
    current += digit;
  }
}

function inputDecimal() {
  if (justEvaluated) {
    current = '0.';
    justEvaluated = false;
    return;
  }
  if (!current.includes('.')) current += '.';
}

function setOperator(op) {
  if (operator && previous !== null && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  current = '0';
  justEvaluated = false;
  highlightOperator(op);
}

function highlightOperator(op) {
  document.querySelectorAll('.key--op').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.op === op);
  });
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '−': result = a - b; break;
    case '×': result = a * b; break;
    case '÷': result = b === 0 ? NaN : a / b; break;
    default: return;
  }
  current = Number.isNaN(result) ? 'Error' : trimResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  highlightOperator(null);
}

function trimResult(num) {
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  highlightOperator(null);
}

function negate() {
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
}

function percent() {
  current = trimResult(parseFloat(current) / 100);
}

document.querySelectorAll('.key').forEach(btn => {
  btn.addEventListener('click', () => {
    const { num, op, action } = btn.dataset;
    if (num !== undefined) inputDigit(num);
    else if (op !== undefined) setOperator(op);
    else if (action === 'decimal') inputDecimal();
    else if (action === 'equals') evaluate();
    else if (action === 'clear') clearAll();
    else if (action === 'negate') negate();
    else if (action === 'percent') percent();
    updateScreen();
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') setOperator('+');
  else if (e.key === '-') setOperator('−');
  else if (e.key === '*') setOperator('×');
  else if (e.key === '/') { e.preventDefault(); setOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') evaluate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
  } else return;
  updateScreen();
});

updateScreen();
