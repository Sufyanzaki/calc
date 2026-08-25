import { useState } from 'react';

type Op = '+' | '-' | '×' | '÷';

function apply(a: number, b: number, op: Op): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? NaN : a / b;
  }
}

function format(n: number): string {
  if (Number.isNaN(n)) return 'Error';
  if (Number.isInteger(n)) return String(n);
  return String(parseFloat(n.toFixed(8)));
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true); // display is a fresh result; next digit resets it

  function inputDigit(d: string) {
    if (fresh) {
      setDisplay(d);
      setFresh(false);
    } else if (display === '0') {
      setDisplay(d);
    } else {
      if (display.length < 14) setDisplay(display + d);
    }
  }

  function inputDot() {
    if (fresh) {
      setDisplay('0.');
      setFresh(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }

  function chooseOp(op: Op) {
    const current = parseFloat(display);
    if (acc !== null && pendingOp !== null) {
      const result = apply(acc, current, pendingOp);
      setAcc(Number.isNaN(result) ? null : result);
      setDisplay(Number.isNaN(result) ? 'Error' : format(result));
    } else {
      setAcc(current);
    }
    setPendingOp(op);
    setFresh(true);
  }

  function equals() {
    if (acc === null || pendingOp === null) return;
    const result = apply(acc, parseFloat(display), pendingOp);
    setDisplay(format(result));
    setAcc(null);
    setPendingOp(null);
    setFresh(true);
  }

  function clearAll() {
    setDisplay('0');
    setAcc(null);
    setPendingOp(null);
    setFresh(true);
  }

  function negate() {
    if (display === 'Error') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  }

  function percent() {
    if (display === 'Error') return;
    setDisplay(format(parseFloat(display) / 100));
    setFresh(true);
  }

  function backspace() {
    if (display === 'Error' || display === '0') return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  }

  const buttons: { label: string; onClick: () => void; className: string }[] = [
    { label: 'AC', onClick: clearAll, className: 'btn-fn' },
    { label: '⌫', onClick: backspace, className: 'btn-fn' },
    { label: '%', onClick: percent, className: 'btn-fn' },
    { label: '÷', onClick: () => chooseOp('÷'), className: 'btn-op' },
    { label: '7', onClick: () => inputDigit('7'), className: 'btn-num' },
    { label: '8', onClick: () => inputDigit('8'), className: 'btn-num' },
    { label: '9', onClick: () => inputDigit('9'), className: 'btn-num' },
    { label: '×', onClick: () => chooseOp('×'), className: 'btn-op' },
    { label: '4', onClick: () => inputDigit('4'), className: 'btn-num' },
    { label: '5', onClick: () => inputDigit('5'), className: 'btn-num' },
    { label: '6', onClick: () => inputDigit('6'), className: 'btn-num' },
    { label: '-', onClick: () => chooseOp('-'), className: 'btn-op' },
    { label: '1', onClick: () => inputDigit('1'), className: 'btn-num' },
    { label: '2', onClick: () => inputDigit('2'), className: 'btn-num' },
    { label: '3', onClick: () => inputDigit('3'), className: 'btn-num' },
    { label: '+', onClick: () => chooseOp('+'), className: 'btn-op' },
    { label: '±', onClick: negate, className: 'btn-num' },
    { label: '0', onClick: () => inputDigit('0'), className: 'btn-num' },
    { label: '.', onClick: inputDot, className: 'btn-num' },
    { label: '=', onClick: equals, className: 'btn-eq' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xs rounded-3xl bg-slate-900 p-5 shadow-xl">
        <div className="mb-4 flex h-20 items-end justify-end overflow-hidden rounded-2xl bg-slate-800 px-4 py-3">
          <span
            className="truncate text-right text-5xl font-extralight text-white"
            role="status"
            aria-live="polite"
          >
            {display}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((b) => (
            <button
              key={b.label}
              onClick={b.onClick}
              className={`${b.className} h-16 text-2xl font-medium transition active:scale-95`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}