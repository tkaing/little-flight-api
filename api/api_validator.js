const { validationResult } = require('express-validator');

module.exports = {
    validate_body: (request, response, callback) => {

        const listOfErrors = validationResult(request);

        if (!listOfErrors.isEmpty())
            return response.status(400).json({ errors: listOfErrors.array() });

        callback();
    }
}