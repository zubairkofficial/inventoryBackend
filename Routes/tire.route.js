let mongoose = require('mongoose');
let express = require('express'); 
let router = express.Router();
const { check, validationResult } = require('express-validator');

let Tire = require('../Models/Tire');
const { verifyToken } = require('../Helpers');

router.post('/add', [
    check('brand', "Brand name field is required").not().isEmpty(),
    check('size', "Size field is required").not().isEmpty(),
    check('quantity').isInt({ min: 1, max: 99 }).withMessage('quantity must be between 1 and 99'),
    check('price').notEmpty().isFloat({min: 0.01}).withMessage('Price must be a number greater than 0.'),
    check('quality', "Quality field is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const brand = req.body.brand;
        const size = req.body.size;
        const quantity = req.body.quantity;
        const price = req.body.price;
        const quality = req.body.quality;
        const user_id = req.body.user_id;
        
        const request = {brand, size, quantity, quality, price, user_id};
    
        Tire.create(request, (error, data) => {
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
        Tire.find({'user_id':req.params.user_id},(error, data) => {
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
    check('brand', "Brand name field is required").not().isEmpty(),
    check('size', "Brand name field is required").not().isEmpty(),
    check('quantity', "Quantity must be at least 1").isLength({min:1}),
    check('price').notEmpty().isFloat({min: 0.01}).withMessage('Price must be a number greater than 0.'),
    check('quality', "Quality field is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const brand = req.body.brand;
        const size = req.body.size;
        const quantity = req.body.quantity;
        const price = req.body.price;
        const quality = req.body.quality;
        const user_id = req.body.user_id;
    
        const request = {brand, size, quantity, quality, price, user_id};
    
        Tire.findByIdAndUpdate(req.body._id, request, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Tire updated successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/delete/:id', (req, res) => {
    if(verifyToken(req, res)){
        Tire.findByIdAndRemove(req.params.id, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Tire deleted successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

module.exports = router;