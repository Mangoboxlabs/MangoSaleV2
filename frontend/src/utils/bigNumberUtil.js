import BigNumber from 'bignumber.js';

BigNumber.set({
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

class MathCalculator {
    constructor() {
        // do something
    }
    showNumAuto(val) {
        if ((val)) {
            if (BigNumber(1000000000).lt(BigNumber(val))) {
                return (BigNumber(val).div(1000000) * 10).toFixed(0) / 10 + "B";
            }
            if (BigNumber(1000000).lt(BigNumber(val))) {
                return (BigNumber(val).div(1000000) * 10).toFixed(0) / 10 + "M";
            }
            if (val != 0 && BigNumber(val).lt(BigNumber(0.001))) {
                return "<0.001";
            }
            if(BigNumber(val).gt(10)){
                return val ? (BigNumber(Number(val) * 100).toFixed(0, BigNumber.ROUND_DOWN) / 100).toLocaleString() : 0;
            }
            if(BigNumber(val).lt(1)){
                return val ? (BigNumber(Number(val) * 10000).toFixed(0, BigNumber.ROUND_DOWN) / 10000).toLocaleString() : 0;
            }
            return val ? (BigNumber(Number(val) * 1000).toFixed(0, BigNumber.ROUND_DOWN) / 1000).toLocaleString() : 0;
        }
        return 0;
    }

    dealNum(val) {
        if ((val)) {
            if (BigNumber(1000000000).lt(BigNumber(val))) {
                return (BigNumber(val).div(1000000) * 100).toFixed(0) / 100 + "B";
            }
            if (BigNumber(1000000).lt(BigNumber(val))) {
                return (BigNumber(val).div(1000000) * 100).toFixed(0) / 100 + "M";
            }
            return val ? (BigNumber(Number(val) * 100).toFixed(0, BigNumber.ROUND_DOWN) / 100).toLocaleString() : 0;
        }
        return 0;
    }

    dealNumLess(val) {
        if ((val)) {
            if (BigNumber(1000000000).lt(BigNumber(val))) {
                return (BigNumber(val).div(1000000) * 100).toFixed(0) / 100 + "B";
            }
            if (BigNumber(1000000).lt(BigNumber(val))) {
                return (BigNumber(val).div(1000000) * 100).toFixed(0) / 100 + "M";
            }
            if (val != 0 && BigNumber(val).lt(BigNumber(0.01))) {
                return "<0.01";
            }
            return val ? (BigNumber(Number(val) * 100).toFixed(0, BigNumber.ROUND_DOWN) / 100).toLocaleString() : 0;
        }
        return 0;
    }

    showNum(val) {
        if ((val)) {
            return val ? (BigNumber(Number(val) * 100).toFixed(0, BigNumber.ROUND_DOWN) / 100).toLocaleString() : 0;
        }
        return 0;
    }

    add(a, b) {
        return new BigNumber(a).plus(new BigNumber(b)).toString();
    }

    subtract(a, b) {
        return new BigNumber(a).minus(new BigNumber(b)).toString();
    }

    multiply(a, b) {
        return new BigNumber(a).multipliedBy(new BigNumber(b)).toString();
    }

    divide(a, b) {
        return new BigNumber(a).dividedBy(new BigNumber(b)).toString();
    }

}

export default MathCalculator;
