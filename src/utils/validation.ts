const isEmailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const isEmail = (s: string) => isEmailRegEx.test(s);

export { isEmail };