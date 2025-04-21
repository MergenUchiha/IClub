export function generateVerificationPhoneNumberCodeAndExpiry() {
    let code: string;
    if (process.env.NODE_ENV === 'development') {
        code = '123456';
    } else {
        code = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    return { code, expiry };
}
