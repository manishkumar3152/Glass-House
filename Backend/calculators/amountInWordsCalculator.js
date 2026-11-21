/**
 * Converts an amount in numbers to words following Indian numbering system.
 * e.g., 7247 -> "Rupees Seven Thousand Two Hundred Forty Seven Only"
 * e.g., 7246.65 -> "Rupees Seven Thousand Two Hundred Forty Six and Sixty Five Paise Only"
 * 
 * @param {number} amount
 * @returns {string}
 */
const amountInWords = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rupees Zero Only';
  }

  const num = Math.abs(Number(amount));
  if (num === 0) return 'Rupees Zero Only';

  const units = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const convertTwoDigits = (n) => {
    if (n < 20) return units[n];
    const tensPart = tens[Math.floor(n / 10)];
    const unitsPart = units[n % 10];
    return tensPart + (unitsPart ? ' ' + unitsPart : '');
  };

  const convertThreeDigits = (n) => {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += units[Math.floor(n / 100)] + ' Hundred';
      if (n % 100 > 0) str += ' ';
    }
    if (n % 100 > 0) {
      str += convertTwoDigits(n % 100);
    }
    return str;
  };

  const integerPart = Math.floor(num);
  const fractionPart = Math.round((num - integerPart) * 100);

  let result = '';

  const crore = Math.floor(integerPart / 10000000);
  const remCrore = integerPart % 10000000;

  const lakh = Math.floor(remCrore / 100000);
  const remLakh = remCrore % 100000;

  const thousand = Math.floor(remLakh / 1000);
  const remThousand = remLakh % 1000;

  const hundred = remThousand;

  if (crore > 0) {
    result += convertThreeDigits(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertTwoDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertTwoDigits(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    result += convertThreeDigits(hundred) + ' ';
  }

  result = result.trim();

  let finalWords = 'Rupees ' + result;

  if (fractionPart > 0) {
    finalWords += ' and ' + convertTwoDigits(fractionPart) + ' Paise';
  }

  finalWords += ' Only';

  return finalWords.replace(/\s+/g, ' ');
};

module.exports = {
  amountInWords
};
