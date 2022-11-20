const Sauce = require("../models/Sauce");
const fs = require('fs');

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
        .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
        .catch(error => res.status(400).json({error}));
};


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Action non autorisée'});
            } else {
                if(req.file) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    console.log(filename);
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({message: 'Sauce modfiée et ancienne image supprimée'}))
                        .catch(error => res.status(400).json({error}));
                    });
                } else {
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce modifiée'}))
                    .catch(error => res.status(400).json({error}));
                };
            };
        })
        .catch(error => res.status(400).json({error}));
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Action non autorisée'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée'}))
                    .catch(error => res.status(400).json({error}));
                });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

exports.displaySingleSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // req.params.id in order to handle id from url
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};


exports.displayAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};