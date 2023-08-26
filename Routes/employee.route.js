let mongoose = require('mongoose');
let express = require('express'); 
let router = express.Router();
const { check, validationResult } = require('express-validator');

let Employee = require('../Models/Employee');
let Setting = require('../Models/Setting');
const { verifyToken } = require('../Helpers');

router.post('/add', [
    check('name', "Employee name field is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const user_id = req.body.user_id;
    
        const request = {name, email, phone, user_id};
    
        Employee.create(request, (error, data) => {
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
        Employee.find({'user_id':req.params.user_id},(error, data) => {
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
    check('name', "Employee name field is required").not().isEmpty(),
    // check('email', "Employee email field is required").not().isEmpty(),
    check('phone').not().isEmpty().withMessage("Employee phone field is required").isNumeric({min: 10}).withMessage("Phone must be valid"),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json(errors);
        }
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const user_id = req.body.user_id;
        
        const request = {name, email, phone, user_id};
    
        Employee.findByIdAndUpdate(req.body._id, request, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Employee updated successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/delete/:id', (req, res) => {
    if(verifyToken(req, res)){
        Employee.findByIdAndRemove(req.params.id, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Employee deleted successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

module.exports = router;