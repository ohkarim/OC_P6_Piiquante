const express = require('express');

const app = express();

app.use((req, res) => {
    res.json({ message: 'Test blabla'});
});

module.exports = app;