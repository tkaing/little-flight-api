module.exports = {
    messageNotEmpty: () => `Ce champ ne peut pas être vide`,
    messageIsLength: (min, max = min) => (max > min ? `Entre ${ min } et ${ max }` : `Minimum ${ min }`) + ' caractères',
    messageIsFloat: () => `Ce n'est pas un float`,
};