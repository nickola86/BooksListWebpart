//const toRandomHex = (str:string): string => [...Array(str.length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const toHex = (str:string): string => {
    let result = '';
    for (let i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }
export default toHex