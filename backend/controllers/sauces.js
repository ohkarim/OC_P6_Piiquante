const Sauce = require("../models/Sauce");
const fs = require('fs');

// Create a sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    console.log(req.body);
    const sauce = new Sauce({
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,

        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch(error => res.status(403).json({ error }));
};

// Update a sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Action non autorisée' });
            } else {
                if (req.file) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    console.log(filename);
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Sauce modfiée et ancienne image supprimée' }))
                            .catch(error => res.status(400).json({ error }));
                    });
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                        .catch(error => res.status(400).json({ error }));
                };
            };
        })
        .catch(error => res.status(403).json({ error }));
};

// Delete a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Action non autorisée' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                        .catch(error => res.status(400).json({ error }));
                });
            };
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// Get a single sauce
exports.displaySingleSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // req.params.id in order to handle id from url
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Get all sauces
exports.displayAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauces = (req, res, next) => {
    const like = req.body.like;
    const userId = req.auth.userId;

    switch (like) {
        case 1:
            console.log({ State: "Liked", like });
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (!sauce.usersLiked.find(userLike => userLike === userId) && !sauce.usersDisliked.find(userLike => userLike === userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
                            .then(() => { res.status(200).json({ message: "Sauce likée" }) })
                            .catch(error => res.status(403).json({ error }));
                    } else {
                        return res.status(409).json({ error: `Sauce déjà likée` })
                    };
                })
                .catch(error => res.status(400).json({ error }));
            break;
        case -1:
            console.log({ State: "Disliked", like });
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (!sauce.usersDisliked.find(userLike => userLike === userId) && !sauce.usersLiked.find(userLike => userLike === userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                            .then(() => { res.status(200).json({ message: "Sauce dislikée" }) })
                            .catch(error => res.status(403).json({ error }));
                    } else {
                        return res.status(409).json({ error: `Sauce déjà dislikée` })
                    };
                })
                .catch(error => res.status(400).json({ error }));
            break;
        case 0:
            console.log({ State: "Unliked/Undisliked", like });
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find(userLike => userLike === userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                            .then(() => { res.status(200).json({ message: "Like retiré" }) })
                            .catch(error => res.status(403).json({ error }));
                    } else if (sauce.usersDisliked.find(userDislike => userDislike === userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                            .then(() => { res.status(200).json({ message: "Dislike retiré" }) })
                            .catch(error => res.status(403).json({ error }));
                    } else if (!sauce.usersLiked.find(userLike => userLike === userId) && !sauce.usersDisliked.find(userDislike => userDislike === userId)) {
                        console.log({ State: "Déjà enlevé", like });
                        return res.status(409).json({ error: `Le like/dislike a été déjà enlevé` })
                    } else {
                        return res.status(400).json({ error })
                    }
                })
                .catch(error => res.status(400).json({ error }));
            break;
        default:
            console.error();
    };
};