export default class calculator {
    constructor() {
        if (!this.vars()) return;
        this.setupEvents();
    }

    vars() {
        this.selectors = {
            previousValueElement: 'data-previous-value',
            currentValueElement: 'data-current-value',
            keys: 'data-keys',
            numberKey: 'num',
            operationKey: 'func',
            deleteKey: 'del',
            resetKey: 'reset',
            equalKey: 'equals',
            smallClass: 'small'
        }

        this.previousValueElement = document.querySelector(`[${this.selectors.previousValueElement}]`);
        this.currentValueElement = document.querySelector(`[${this.selectors.currentValueElement}]`);
        this.keys = document.querySelectorAll(`[${this.selectors.keys}]`);

        if (!this.previousValueElement || !this.currentValueElement || !this.keys) return false;

        this.currentOperand;
        this.previousOperand;
        return true;
    }

    setupEvents() {
        this.reset();

        this.keys.forEach(key => {
            let keyFunction = key.dataset.keys;
            let keyInnerText = key.innerHTML;
            let keyOperation = key.dataset.operation;

            key.addEventListener('click', () => {
                if (keyFunction == this.selectors.numberKey) {
                    this.appendNumber(keyInnerText);
                    this.updateDisplay();
                } else if (keyFunction == this.selectors.operationKey) {
                    this.selectOperation(keyOperation);
                    this.updateDisplay();
                } else if (keyFunction == this.selectors.deleteKey) {
                    this.delete();
                    this.updateDisplay();
                } else if (keyFunction == this.selectors.resetKey) {
                    this.reset();
                    this.updateDisplay();
                } else if (keyFunction == this.selectors.equalKey) {
                    this.compute();
                    this.updateDisplay();
                }
            })
        })
    }

    /* Function that restores variables to initial state */
    reset() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    /* Function that extracts last character from string */
    delete() {
        if (this.currentOperand === 0) {
            return;
        } else if (this.currentOperand.toString().length === 1) {
            this.currentOperand = 0;
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    /**
    * Function that append last clicked number from passed parameter to currentOperand variable
    * @param    {String}  number    key inner value
    */
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand.length >= 10) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    /**
    * Function that call compute() if condition is met or 
    * assign new values to operation, previous and currentOperand.
    * @param    {String}  number    key inner value
    */
    selectOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand != '') this.compute();
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    /**
    * Function that calculate prev and current value using a mathematical operator 
    * taken from operation variable.
    */
    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        const operations = {
            '+': prev + current,
            '-': prev - current,
            '*': prev * current,
            '/': prev / current
        }

        result = operations[this.operation];
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }

    /**
    * Function that update all informations/results on user screen
    */
    updateDisplay() {
        this.currentValueElement.innerHTML = this.convertNumber(this.currentOperand);

        if (this.currentOperand.toString().length > 10) {
            this.currentValueElement.classList.add(`${this.selectors.smallClass}`);
        } else {
            this.currentValueElement.classList.remove(`${this.selectors.smallClass}`);
        }

        if (this.operation != null) {
            this.previousValueElement.innerHTML = 
                `${this.convertNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousValueElement.innerHTML = '';
        }
    }

    /**
    * Function that converts a string with number to string with a 
    * language-sensitive representation of this number.
    * @param    {String}  number    string with number
    */
    convertNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
 }