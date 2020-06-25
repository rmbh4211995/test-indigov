const path = require("path");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require(path.join(__dirname, "../webpack.config.js"));
const compiler = webpack(config);
const app = express();

app.use(cors());
app.use(webpackDevMiddleware(compiler, config.devServer));
app.use(webpackHotMiddleware(compiler));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/api/getData', (req, res) => {
    axios({
        method: 'get',
        url: 'https://indigov.com/tickets'
    }).then(resp => {

        res.send(resp);
    })
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(4000);