let mongoose = require('mongoose');
let express = require('express'); 
let router = express.Router();
const { check, validationResult } = require('express-validator');
let bcrypt = require('bcryptjs');

let Team = require('../Models/User');
const { verifyToken } = require('../Helpers');

router.post('/add', [
    check('name', "Team name field is required").not().isEmpty(),
    check('email', "Enter a Valid Email").not().isEmpty().isEmail(),
    check('password', "Team password field is required").not().isEmpty(),
    check('user_role', "Password length should be 8 to 16 characters").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(402).json(errors);
        }
        const name = req.body.name;
        const email = req.body.email;
        let password = req.body.password;
        const user_role = req.body.user_role;
        const parent_id = req.body.parent_id;
        password = await bcrypt.hash(password, 10);
        const request = {name, email, password, user_role, parent_id};
        const oldUser = await Team.findOne({email});
        if(oldUser){
            return res.status(402).json({'message':'User already exists'});
        }else{
            Team.create(request, (error, data) => {
                if(error){
                    return res.status(402).json({'error': error});
                }else{
                    return res.status(200).json(data);
                }
            });
        }
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/:parent_id', (req, res) => {
    if(verifyToken(req, res)){
        Team.find({$or:[{parent_id:req.params.parent_id}]}, (error, data) => {
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
    check('name', "Team name field is required").not().isEmpty(),
    check('email', "Team email field is required").not().isEmpty(),
    // check('password', "Team password field is required").not().isEmpty(),
    check('user_role', "Team user_role field is required").not().isEmpty(),
], async (req, res) => {
    if(verifyToken(req, res)){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json(errors);
        }
        const name = req.body.name;
        const email = req.body.email;
        let password = req.body.password;
        const user_role = req.body.user_role;
        const parent_id = req.body.parent_id;
        let request = {}
        if (password) {
            password = await bcrypt.hash(password, 10);
            request = {name, email, password, user_role, parent_id};            
        }else{
            request = {name, email, user_role, parent_id};            
        }
        
        const oldUser = await Team.findOne({email});
        console.log(oldUser._id == req.body._id);
        if(oldUser && oldUser._id != req.body._id){
            return res.status(402).json({'message':'User already exists'});
        }else{
            Team.findByIdAndUpdate(req.body._id, request, (error, data) => {
                if(error){
                    return res.status(402).json({'error': error});
                }else{
                    return res.status(200).json({message: 'Team updated successfully'});
                }
            });
        }

    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

router.get('/delete/:id', (req, res) => {
    if(verifyToken(req, res)){
        Team.findByIdAndRemove(req.params.id, (error, data) => {
            if(error){
                return res.status(402).json({'error': error});
            }else{
                return res.status(200).json({message: 'Team deleted successfully'});
            }
        });
    }else{
        return res.status(402).json({'error': 'Unauthenticated'});
    }
});

module.exports = router;