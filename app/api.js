//Require our Models

// var Report = require('./models/report');

var express  = require('express');
var mongoose = require('mongoose');
var axios = require('axios');
var apiRoutes = express.Router();

// Load DataSF API Token
var dataSFAPITOken = require('./third-party').dataSF.api_key;

var Socrata = require('node-socrata');



apiRoutes.get('/', function (req,res) {
    res.json({Message: 'Welcome To Reported API. More to come'});
});

apiRoutes.get('/sfpd-incidents', function (req,res) {
    // console.log('conv ', conv)

    const config = {
        "headers": {'X-App-Token': dataSFAPITOken},
        "Content-Type": "application/json"
    }
    const url = "http://data.sfgov.org/resource/cuks-n6tp.json";
    var resp;
    return new Promise((resolve, reject) => {
        
        return axios
            .get(url, {
                params:{
                    $limit:100,
                    $$app_token: dataSFAPITOken,
                    $order: 'date DESC'
                }
            })
            .then(response => {
                resp = response.data
                return res.json(resp)
            })
            .catch(error => {
                // console.log(error);
                // conv.ask('Sorry! Something went wrong')
                return res.json(error)
            });
    })
    
});

module.exports = apiRoutes;