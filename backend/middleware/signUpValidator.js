const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

const schema = new passwordValidator();

schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Motdepasse123']); // Blacklist these values


module.exports = (req, res, next) => {
    try {
        // Email format validator with email-validator
        if (!emailValidator.validate(req.body.email)) {
            res.status(400).json({ error: `Format de l'email non valide` })
        }

        // Password validation with password-validator
        if (!schema.validate(req.body.password)) {
            res.status(400).json({ error: `Mot de passe invalide, doit comporter 8 caractères minimum, une majuscule, un chiffre et pas d'espaces` })
        }

        next();

    } catch {
        res.status(400).json({ error: `Email ou Mot de passe invalide(s)` })
    }
}


