let mongoose = require('mongoose');
let express = require('express'); 
let router = express.Router();
const { check, validationResult } = require('express-validator');

let Customer = require('../Models/Customer');
let Setting = require('../Models/Setting');
const { verifyToken } = require('../Helpers');

router.post('/add', [
    check('name', "Customer name field is required").not().isEmpty(),
    // check('email', "Customer email field is required").not().isEmpty(),
    check('phone').not().isEmpty().withMessage("Customer phone field is required").isNumeric().withMessage("Phone number must be numeric"),
    // check('address', "Customer address field is required").not().isEmpty(),
    check('tax', "Customer tax status is required").not().isEmpty(),
    
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const address = req.body.address;
        const tax = req.body.tax;
        const taxValue = req.body.taxValue;
        const user_id = req.body.user_id;
        const company_name = req.body.company_name;
    
        const request = {name, email, phone, address, tax, taxValue, user_id, company_name};
    
        Customer.create(request, (error, data) => {
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
        Customer.find({'user_id':req.params.user_id},(error, data) => {
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
    check('name', "Customer name field is required").not().isEmpty(),
    // check('email', "Customer email field is required").not().isEmpty(),
    check('phone').not().isEmpty().withMessage("Customer phone field is required").isNumeric().withMessage("Phone number must be numeric"),
    // check('address', "Customer address field is required").not().isEmpty(),
    check('tax', "Customer tax status is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json(errors);
        }
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const address = req.body.address;
        const tax = req.body.tax;
        const taxValue = req.body.taxValue;
        const user_id = req.body.user_id;
        const company_name = req.body.company_name;
        
        const request = {name, email, phone, address, tax, taxValue, user_id, company_name};
    
        Customer.findByIdAndUpdate(req.body._id, request, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Customer updated successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/delete/:id', (req, res) => {
    if(verifyToken(req, res)){
        Customer.findByIdAndRemove(req.params.id, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Customer deleted successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.post('/update-tax', [
    check('tax', "Tax Value field is required").not().isEmpty(),
    
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const tax = req.body.tax;
        const user_id = req.body.user_id;

        const filter = {user_id};
        const option = {upsert: true};
        const request = {tax, user_id};
    
        Setting.findOneAndUpdate(filter, request, option, (error, data) => {
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

router.get('/get-tax/:user_id', (req, res) => {
    if(verifyToken(req, res)){
        Setting.findOne({'user_id':req.params.user_id},(error, data) => {
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