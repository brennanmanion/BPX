const Main = (userInput) => {
  // .toString() handles wether input was number or string
  // global replace removes spaces
  userInput = userInput.toString().replace(/ /g, "");
  // defensive case for 0
  if (userInput === "0") {
    return "Zero";
  }

  // determine if userInput is in U.S. Dollars
  let isCurrency = false;
  if (userInput.includes("$")) {
    isCurrency = true;
    userInput = userInput.replace(/\$/g, "");
  }

  // determine if userInput contains a digit
  let isDigit = false;
  if (userInput.includes(".")) {
    isDigit = true;
    if (userInput.split(".")[1].length > 12) {
      throw "Too Small A Number";
    }
  }

  // first need to evaluate if there is a calculation that must take place
  // do this with my evaluateString function
  const evaluateString = (inputString) => {
    let inputStringArray = inputString;
    const pemdas = ["^", "*", "/", "+", "-"];
    let operand1, operand2, spliceIndex,result;

    // operations
    const exponential = (operand1, operand2) => Math.pow(operand1, operand2);
    const product = (operand1, operand2) => operand1 * operand2;
    const quotient = (operand1, operand2) => operand1 / operand2;
    const sum = (operand1, operand2) => operand1 + operand2;
    const difference = (operand1, operand2) => operand1 - operand2;

    let spliceDistance = 3;
    // iterate through operations, in order of PEMDAS
    for (let operator of pemdas) {
      while (inputStringArray.indexOf(operator) !== -1) {
        operand1 = parseFloat(
          inputStringArray[inputStringArray.indexOf(operator) - 1]
        );
        operand2 = parseFloat(
          inputStringArray[inputStringArray.indexOf(operator) + 1]
        );

        spliceIndex = inputStringArray.indexOf(operator) - 1;
        switch (operator) {
          case "^":
            result = exponential(operand1, operand2);
            inputStringArray.splice(
              spliceIndex,
              spliceDistance,
              result.toString()
            );
            break;
          case "*":
            result = product(operand1, operand2);
            inputStringArray.splice(
              spliceIndex,
              spliceDistance,
              result.toString()
            );
            break;
          case "/":
            result = quotient(operand1, operand2);
            inputStringArray.splice(
              spliceIndex,
              spliceDistance,
              result.toString()
            );
            break;
          case "+":
            result = sum(operand1, operand2);
            inputStringArray.splice(
              spliceIndex,
              spliceDistance,
              result.toString()
            );
            break;
          case "-":
            result = difference(operand1, operand2);
            inputStringArray.splice(
              spliceIndex,
              spliceDistance,
              result.toString()
            );
            break;
        }
      }
    }
    return inputStringArray.pop();
  };

  const parseNumbers = (userInput) => {
    let userInputCopy = userInput;
    let operations = userInput
      .replace(/[0-9]+/g, "#")
      .replace(/[\(|\|\.)]/g, "");
    let numbers = userInputCopy.split(/[^0-9\.]+/);
    let operators = operations.split("#").filter((n) => n);
    let seperateStringArray = [];

    for (let i = 0; i < numbers.length; i++) {
      seperateStringArray.push(numbers[i]);
      if (i < operators.length) {
        seperateStringArray.push(operators[i]);
      }
    }
    return seperateStringArray;
  };

  // check to see if there are operator characters
  if (userInput.match(/[()*-\+/^]/g) !== null) {
    let parenthesisSplitString;
    let removeParenthesisString;
    let replaceFromInputString;

    // check to see if there are parenthesis, need to deal with this seperately
    if (userInput.match(/[()]/g) !== null) {
      // check if parenthesis are balanced
      if (userInput.match(/[()]/g).length % 2 === 0) {
        // continue to evaluate parenthesis until there are no more
        while (userInput.match(/[()]/g) !== null) {
          // need to split up numbers, including decimals and integers
          parenthesisSplitString = userInput.slice(
            userInput.lastIndexOf("("),
            userInput.length
          );
          replaceFromInputString = parenthesisSplitString.slice(
            parenthesisSplitString.indexOf("("),
            parenthesisSplitString.indexOf(")") + 1
          );
          removeParenthesisString = replaceFromInputString.replace(/[()]/g, "");

          // replace the parenthesis with what is evaluated inside parenthesis
          userInput = userInput.replace(
            replaceFromInputString,
            evaluateString(parseNumbers(removeParenthesisString))
          );
        }
      } else {
        // case for when calculation has imbalanced parenthesis
        throw "Imbalanced Parenthesis";
      }
    }
    userInput = evaluateString(parseNumbers(userInput));
    // determine if the result is a digit after calculation
    if (userInput.includes(".")) {
      isDigit = true;
    }
    // deal with trailing digits with too great precision
    if (userInput.includes(".") && userInput.split(".")[1].length > 12) {
      userInput = parseFloat(userInput)
        .toPrecision(userInput.split(".")[0].length + 12)
        .toString();
    }
  }

  // this function will handle converting our number to words
  const numberToWords = (userInput) => {
    // from now on, dealing with an array of individual numbers as string
    let userInputArray = userInput.split("");

    const singleDigits = {
      "1": "one",
      "2": "two",
      "3": "three",
      "4": "four",
      "5": "five",
      "6": "six",
      "7": "seven",
      "8": "eight",
      "9": "nine"
    };

    const teenDigits = {
      "10": "ten",
      "11": "eleven",
      "12": "twelve",
      "13": "thirteen",
      "14": "fourteen",
      "15": "fifteen",
      "16": "sixteen",
      "17": "seventeen",
      "18": "eighteen",
      "19": "nineteen"
    };

    const tenMultipleDigits = {
      "2": "twenty",
      "3": "thirty",
      "4": "forty",
      "5": "fifty",
      "6": "sixty",
      "7": "seventy",
      "8": "eighty",
      "9": "ninety"
    };

    const magnitude = {
      "2": "hundred",
      "3": "thousand",
      "4": "thousand",
      "5": "thousand",
      "6": "million",
      "7": "million",
      "8": "million",
      "9": "billion",
      "10": "billion",
      "11": "billion",
      "12": "trillion"
    };

    let returnArray = [];
    let partialArray = [];
    let partialString = "";
    while (userInputArray.length > 0) {
      let userInputArrayLength = userInputArray.length;
      if (userInputArrayLength % 3 === 0) {
        // this is a 'hundred' number
        partialArray = [userInputArray.shift()];
        partialString = partialArray.join("");
        if (partialString !== "0") {
          returnArray.push(singleDigits[partialString], "hundred");
        }
      } else if (userInputArrayLength % 3 === 1) {
        // this is a 'single digit' number
        partialArray = [userInputArray.shift()];
        partialString = partialArray.join("");
        if (partialString !== "0") {
          returnArray.push(singleDigits[partialString]);
        }
      } else if (userInputArrayLength % 3 === 2) {
        // this is a 'teen' or 'ten multiple' number
        partialArray = [userInputArray.shift(), userInputArray.shift()];
        partialString = partialArray.join("");
        if (parseInt(partialString) <= 19) {
          if (parseInt(partialString) < 10) {
            // deals with trailing single digits lead by a 0
            returnArray.push(singleDigits[partialArray.pop()]);
          } else {
            returnArray.push(teenDigits[partialString]);
          }
        } else {
          // need to deal with trailing 0's here
          if (partialArray[partialArray.length - 1] == "0") {
            returnArray.push(tenMultipleDigits[partialArray.shift()]);
          } else {
            returnArray.push(
              tenMultipleDigits[partialArray.shift()],
              singleDigits[partialArray.shift()]
            );
          }
        }
      }
      // append the magnitude at the correct times only
      if (
        userInputArray.length % 3 === 0 &&
        userInput.toString().split("").length > userInputArray.length &&
        userInputArray.length > 1
      ) {
        returnArray.push(magnitude[String(userInputArray.length)]);
      }
    }
    // return the array of numbers converted to words with space between (not leading and trailing)
    return returnArray.join(" ");
  };

  // used to append the magnitude of the decimal
  const decimalMagnitude = {
    "1": "tenth",
    "2": "hundredth",
    "3": "thousandth",
    "4": "ten thousandth",
    "5": "hundred thousandth",
    "6": "millionth",
    "7": "ten millionth",
    "8": "hundred millionth",
    "9": "billionth",
    "10": "ten billionth",
    "11": "hundred billionth",
    "12": "trillionth"
  };

  // defensive cases for inputs of 0, too large, and negative
  if (!userInput.includes(".") && userInput.length > 12) {
    throw "Too Large Of A Number";
  }
  if (parseInt(userInput) < 0) {
    throw "Must Be A Positive Number";
  }
  if (userInput.includes(".") && userInput.split(".")[1].length > 12) {
    throw "Too Precise Of A Number";
  }

  // return our strings

  // is a digit and not a currency
  if (isDigit && !isCurrency) {
    // singular decimal notation
    if (numberToWords(userInput.split(".")[1]) === "one") {
      return (
        numberToWords(userInput.split(".")[0]) +
        " and " +
        numberToWords(userInput.split(".")[1]) +
        " " +
        decimalMagnitude[userInput.split(".")[1].length.toString()]
      );
    }
    // plural decimal notation
    else {
      return (
        numberToWords(userInput.split(".")[0]) +
        " and " +
        numberToWords(userInput.split(".")[1]) +
        " " +
        decimalMagnitude[userInput.split(".")[1].length.toString()] +
        "s"
      );
    }
  }

  // is a currency and not a digit
  if (isCurrency && !isDigit) {
    return numberToWords(userInput) + " dollars";
  }

  // is a digit and a currency
  if (isDigit && isCurrency) {
    return (
      numberToWords(userInput.split(".")[0]) +
      " dollars and " +
      numberToWords(userInput.split(".")[1]) +
      " cents"
    );
  }

  // everything else
  else {
    return numberToWords(userInput);
  }
};

// //take in user input from console
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Convert A Number To Words: ", (input) => {
  console.log(Main(input));
  rl.close();
});

rl.on("close", function() {
  process.exit(0);
});

module.exports = Main;
