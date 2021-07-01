const md5 = require('md5');
const JWT = require('jsonwebtoken');

const KEY = process.env.JWT_KEY || '3hNP2w4mA';
const EXPIRATION = '15m';

const encrypt = (password) => {
    return md5(password);
};

const verifyToken = (request) => {

    return JWT.verify(request.token, KEY, (error) => {
        if (error)
            return "Invalid token.";
        else
            return "";
    });
};

const verifySyntax = (request) => {

    const authorization = request.headers.authorization;

    if (!authorization)
        return 'Malformed token.';

    const formattedAuthorization = authorization.split(' ');

    if (formattedAuthorization.length !== 2)
        return 'Malformed token.';

    request.token = formattedAuthorization[1];

    return "";
};

const validateToken = async (request, response, callback) => {

    const result_syntax = verifySyntax(request);

    if (result_syntax !== "")
        return response.status(400).json(result_syntax);

    const result_token = await verifyToken(request);

    if (result_token !== "")
        return response.status(400).json(result_token);

    callback();
};

const registerToken = async (response, document) => {

    return JWT.sign(document, KEY, { expiresIn: EXPIRATION }, (error, jwt) => {
        if (error)
            return response.status(400).json('Unable to register token.');
        return response.json({ jwt: jwt });
    });
};

const formattedToken = async (request) => {

    return JWT.verify(request.token, KEY, (error, data) => {
        if (error)
            return null;
        return data;
    });
};

module.exports = {
    encrypt,
    verifyToken,
    verifySyntax,
    validateToken,
    registerToken,
    formattedToken,
};
