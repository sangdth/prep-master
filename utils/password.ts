export default (length = 6, charset?: string) => {
    const c = charset || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0, n = c.length; i < length; ++i) {
        password += c.charAt(Math.floor(Math.random() * n));
    }

    return password.toUpperCase();
};
