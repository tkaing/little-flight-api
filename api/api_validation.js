module.exports = {
    messageNotEmpty: () => `Ce champ ne peut pas être vide`,
    messageIsLength: (min, max = min) => (max > min ? `Entre ${ min } et ${ max }` : `Minimum ${ min }`) + ' caractères',
    messageIsFloat: () => `Ce n'est pas un float`,
    email: {
        message: () => 'Please fill a valid email address',
        validate: (email) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(email);
        }
    },
    NotFound: '404 Not Found.'
};