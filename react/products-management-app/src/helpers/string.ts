export function currencyFormat(price: number): string {
  //convert the string to an array
  let arr = price.toString().split('');

  //back to string with added spaces
  let result = '';
  let count = 0;

  for (let i = arr.length - 1; i >= 0; i--) {
    if (count < 3) {
      result = arr[i] + result;
      count = count + 1;
    } else {
      result = ' ' + result;
      count = 0;
      i = i + 1;
    }
  }

  return result;
}
