const md5 = require('md5');
const JWT = require('jsonwebtoken');

const KEY = process.env.JWT_KEY || '3hNP2w4mA';
const EXPIRATION = '30m';

const encrypt = (password) => {
    return md5(password);
};

const verify_token = async (request) => {

    return await JWT.verify(request.token, KEY, (error) => {
        if (error)
            return "Invalid token.";
        else
            return "";
    });
};

const verify_syntax = (request) => {

    const authorization = request.headers.authorization;

    if (!authorization)
        return 'Malformed token.';

    const formattedAuthorization = authorization.split(' ');

    if (formattedAuthorization.length !== 2)
        return 'Malformed token.';

    request.token = formattedAuthorization[1];

    return "";
};

const validate_token = async (request, response, callback) => {

    const result_syntax = verify_syntax(request);

    if (result_syntax !== "")
        return response.status(400).json(result_syntax);

    const result_token = await verify_token(request);

    if (result_token !== "")
        return response.status(400).json(result_token);

    callback();
};

const register_token = async (response, document) => {

    return JWT.sign(document, KEY, { expiresIn: EXPIRATION }, (error, token) => {
        console.log(document);
        console.log(error);
        if (error)
            return response.status(400).json('Unable to register token.');
        return response.json({ token: token });
    });
};

const formatted_token = async (request) => {

    return await JWT.verify(request.token, KEY, (error, data) => {
        if (error)
            return null;
        return data;
    });
};

module.exports = {
    encrypt,
    verify_token,
    verify_syntax,
    validate_token,
    register_token,
    formatted_token,
};