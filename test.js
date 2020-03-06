const numberToWords = require('./index');

test('function numberToWords exists', () => {
    expect(typeof numberToWords).toEqual('function');
  });
  
  // test('numberToWords converts number to be word representation of number', () => {
  //   const userInput = '1162';
  //   const words = numberToWords(userInput);
  
  //   expect(words).toEqual('one thousand one hundred sixty two');
  // });

  test('numberToWords converts number to be word representation of number', () => {
    const userInput = '((5+4)*2/(3-1))^2';
    const words = numberToWords(userInput);
  
    expect(words).toEqual('eighty one');
  });  

  test('numberToWords converts number to be word representation of number', () => {
    const userInput = '1.07';
    const words = numberToWords(userInput);
  
    expect(words).toEqual('one and seven hundredths');
  });    

  test('numberToWords converts number to be word representation of number', () => {
    const userInput = '$85052.50';
    const words = numberToWords(userInput);
  
    expect(words).toEqual('eighty five thousand fifty two dollars and fifty cents');
  });     
  
  test('numberToWords converts number to be word representation of number', () => {
    const userInput = '$11150';
    const words = numberToWords(userInput);
  
    expect(words).toEqual('eleven thousand one hundred fifty dollars');
  });       

  test('numberToWords converts number to be word representation of number', () => {
    const userInput = '((5.5+4.4)*2.2/(3.33-1.1))^2.2';
    const words = numberToWords(userInput);
  
    expect(words).toEqual('one hundred fifty and four hundred seventy two billion three hundred twenty three million five hundred thirty thousand seven hundred forty one trillionths');
  });    

  