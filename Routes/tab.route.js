let mongoose = require('mongoose');
let express = require('express'); 
let router = express.Router();
const { check, validationResult } = require('express-validator');

let Tab = require('../Models/Tab');
const { verifyToken } = require('../Helpers');

router.post('/add', [
    check('tab_name', "Tab Name field is required").not().isEmpty(),
    check('tab_icon', "Tab Icon field is required").not().isEmpty(),
    check('tab_link', "Tab Link field is required").not().isEmpty(),
    // check('is_child', "Is Child field is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const tab_name = req.body.tab_name;
        const tab_icon = req.body.tab_icon;
        const tab_link = req.body.tab_link;
    
        const request = {tab_name, tab_icon, tab_link};
    
        Tab.create(request, (error, data) => {
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

router.get('/', (req, res) => {
    if(verifyToken(req, res)){
        Tab.find((error, data) => {
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