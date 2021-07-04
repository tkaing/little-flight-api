module.exports = {
    // Liste de messages de validations
    messageNotEmpty: () => `Ce champ ne peut pas être vide`,
    messageIsLength: (min, max = min) => (max > min ? `Entre ${ min } et ${ max }` : `Minimum ${ min }`) + ' caractères',
    messageIsFloat: () => `Ce n'est pas un float`,
    email: {
        message: () => 'Veuillez entrer un format d\'adresse mail valide.',
        validate: (email) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(email);
        }
    }
};
