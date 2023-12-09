export const genAuthCode = (length: number) => {
     let code: string = "";

     if (isNaN(length) || length < 1) return 0;

     length = Math.min(length, 10);

     for (let i = 0; i < length; i++) {
          const randomDigit = Math.floor(Math.random() * 10);
          code += randomDigit;
     }

     return code;
};
