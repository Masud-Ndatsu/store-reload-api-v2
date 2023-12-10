export const authCodeExpiration = () => {
     const codeExpiration = new Date();
     const time = 60;
     codeExpiration.setSeconds(codeExpiration.getSeconds() + time);
     return codeExpiration;
};
