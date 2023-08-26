let mongoose = require('mongoose');
let express = require('express'); 
let router = express.Router();
const { check, validationResult } = require('express-validator');

let Vehicle = require('../Models/Vehicle');
const { verifyToken } = require('../Helpers');

router.post('/add', [
    // check('vin_number', "Vin Number field is required").not().isEmpty(),
    check('year', "Year field is required").not().isEmpty(),
    check('name', "Vehicle Make is required").not().isEmpty(),
    check('model', "Model is required").not().isEmpty(),
    check('customer', "Customer is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const vin_number = req.body.vin_number;
        const year = req.body.year;
        const name = req.body.name;
        const model = req.body.model;
        const customer = req.body.customer;
        const user_id = req.body.user_id;
        
        const request = {name, model, customer, user_id, vin_number, year};
        console.log(request);
        Vehicle.create(request, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json(data);
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/all/:user_id', (req, res) => {
    if(verifyToken(req, res)){
        Vehicle.find({'user_id':req.params.user_id},(error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json(data);
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.post('/update', [
    check('vin_number', "Vin Number field is required").not().isEmpty(),
    check('year', "Year field is required").not().isEmpty(),
    check('name', "Vehicle Make is required").not().isEmpty(),
    check('model', "Model is required").not().isEmpty(),
    check('customer', "Customer is required").not().isEmpty(),

], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json(errors);
        }
        const vin_number = req.body.vin_number;
        const year = req.body.year;
        const name = req.body.name;
        const model = req.body.model;
        const customer = req.body.customer;
        const user_id = req.body.user_id;
        
        const request = {name, model, customer, user_id, vin_number, year};
    
        Vehicle.findByIdAndUpdate(req.body._id, request, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Vehicle updated successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/delete/:id', (req, res) => {
    if(verifyToken(req, res)){
        Vehicle.findByIdAndRemove(req.params.id, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Vehicle deleted successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/customer/:id', (req, res) => {
    if(verifyToken(req, res)){
        Vehicle.find({"customer._id": req.params.id},(error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json(data);
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

module.exports = router;