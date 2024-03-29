let mongoose = require("mongoose");
let express = require("express");
let router = express.Router();
const { check, validationResult } = require("express-validator");

let Receipt = require("../Models/Receipt");
let Oil = require('../Models/Oil');
let Tire = require('../Models/Tire');

const { verifyToken } = require("../Helpers");
const User = require("../Models/User");
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
router.post(
  "/add",
  [
    // check("customer", "Receipt Customer field is required").not().isEmpty(),
    // check("technician", "Technician field is required").not().isEmpty(),
    // check("vehicle", "Vehicle name field is required").not().isEmpty(),
    // check("date", "Receipt date is required").not().isEmpty(),
    // (req, res, next) => {
      // if (!req.body.isDraft) {
      //   check("services", "Services field is required").not().isEmpty()(req, res, next);
      //   check("status", "Receipt payment status field is required").not().isEmpty()(req, res, next);
      // }
      // else{
      //   next();
      // }
    // }
  ],
  async (req, res) => {
    if (verifyToken(req, res)) {
      // return res.status(402).json(req.body);
      if (
        req.body.status === "Partialy Paid" &&
        parseFloat(req.body.remaining) === 0
      ) {
        return res.status(500).json({ error: "Status cannot be 'Partially Paid' when the remaining amount is 0." });
      } 
      // else {
        // This block of code will execute if the condition is false
        // console.log("Status is not Partially Paid or remaining is not 0.");
      // }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(402).json(errors);
      }
      let invoiceNumber1 = 0;
      const user = await User.findById(req.body.user_id).exec();
      if(user){
        invoiceNumber1 = user.invoice;
        let updated = { invoice: invoiceNumber1 + 1 }
        User.findByIdAndUpdate(req.body.user_id, updated, (err, res) => {
          if(!err){
            console.log("Updated ",updated)
            console.log("Invoice Number 1:" ,invoiceNumber1)
          }
          if(err){
            return res.status(402).json(err);
          }
        })
      }
      // return res.status(402).json({data:invoiceNumber1})
      const invoice = invoiceNumber1;
      const customer = req.body.customer;
      const technician = req.body.technician;
      const vehicle = req.body.vehicle;
      const services = req.body.services;
      const tires = req.body.tires;
      const tiresPrice = req.body.tiresPrice;
      const tiresQuantity = req.body.tiresQuantity;
      const oil = req.body.oil;
      const extraOilPrice = req.body.extraOilPrice;
      const extraOilQuantity = req.body.extraOilQuantity;
      const taxInclude = req.body.taxIncluded;
      const taxType = req.body.taxType;
      const tax = req.body.tax;
      const discountInclude = req.body.discountIncluded;
      const discountType = req.body.discountType;
      const discount = req.body.discount;
      const totalPrice = req.body.totalPrice;
      const status = req.body.status;
      const paymentType = req.body.paymentType;
      const paid = req.body.paid;
      const remaining = req.body.remaining;
      const date = req.body.date;
      const tiresTax = req.body.tiresTax
      const note = req.body.note;
      const isDraft = req.body.isDraft;
      const user_id = req.body.user_id;
      const created_date = req.body.created_date;
      const createdAt = req.body.created_date;
      const updatedAt = req.body.created_date;

      const request = {
        invoice,
        customer,
        technician,
        vehicle,
        services,
        tires,
        tiresPrice,
        tiresQuantity,
        tiresQuantity,
        oil,
        extraOilPrice,
        extraOilQuantity,
        taxInclude,
        taxType,
        tax,
        discountInclude,
        discountType,
        discount,
        totalPrice,
        status,
        paymentType,
        paid,
        remaining,
        date,
        created_date,
        tiresTax,
        note,
        isDraft,
        user_id,
        createdAt, 
        updatedAt
      };
      // return res.status(402).json({data: request});
      let tires_service = [];
      let oils_service = [];
      for (let i = 0; i < request.services.length; i++) {
        if (request.services[i].value.type == 'tire_service') {
          let tire = {
            _id:request.services[i].value._id,
            quantity:request.services[i].value.quantity,
          }

          tires_service.push(tire);
        }
        if (request.services[i].value.type == 'oil_service') {
          let oils = {
            _id:request.services[i].value._id,
            quantity:5,
          }

          oils_service.push(oils);
        }
      }
      // console.log("Before Condition", request.isDraft);
      // return res.status(200).json({message:"Before Condition"});
      // return res.status(200).json({data: request});
      if (request.isDraft == 0) {
        Receipt.create(request)
          .then(async (data) => {
            try {
              if (tires_service.length !== 0 && oils_service.length !== 0) {
                await Promise.all([
                  ...tires_service.map(async (tire) => {
                    await Tire.findOneAndUpdate(
                      { _id: tire._id },
                      { $inc: { quantity: -parseInt(tire.quantity) } }
                    );
                  }),
                  ...oils_service.map(async (oil) => {
                    await Oil.findOneAndUpdate(
                      { _id: oil._id },
                      { $inc: { quantity: -oil.quantity } }
                    );
                  }),
                ]);
              } else if (oils_service.length !== 0 && tires_service.length === 0) {
                await Promise.all(
                  oils_service.map(async (oil) => {
                    await Oil.findByIdAndUpdate(
                      { _id: oil._id },
                      { $inc: { quantity: -oil.quantity } }
                    );
                  })
                );
              } else if (oils_service.length === 0 && tires_service.length !== 0) {
                await Promise.all(
                  tires_service.map(async (tire) => {
                    await Tire.findOneAndUpdate(
                      { _id: tire._id },
                      { $inc: { quantity: -parseInt(tire.quantity) } }
                    );
                  })
                );
              }
              // Send a single response to the client
              return res.status(200).json(data);
              // return;
            } catch (err) {
              console.error(err);
              return res.status(500).json({ error: "An error occurred while processing the request." });
            }
          })
          .catch((error) => {
            console.error(error);
            return res.status(402).json({ error: error });
          });
        // Receipt.create(request, async (error, data) => {
        //   if (error) {
        //     return res.status(402).json({ error: error });
        //   }
        
        //   try {
        //     if (tires_service.length !== 0 && oils_service.length !== 0) {
        //       for (let i = 0; i < tires_service.length; i++) {
        //         await Tire.findOneAndUpdate(
        //           { _id: tires_service[i]._id },
        //           { $inc: { quantity: -parseInt(tires_service[i].quantity) } }
        //         );
        //       }
        
        //       for (let j = 0; j < oils_service.length; j++) {
        //         await Oil.findOneAndUpdate(
        //           { _id: oils_service[j]._id },
        //           { $inc: { quantity: -oils_service[j].quantity } }
        //         );
        //       }
        //     } else if (oils_service.length !== 0 && tires_service.length === 0) {
        //       for (const oils of oils_service) {
        //         await Oil.findByIdAndUpdate(
        //           { _id: oils._id },
        //           { $inc: { quantity: -oils.quantity } }
        //         );
        //       }
        //     } else if (oils_service.length === 0 && tires_service.length !== 0) {
        //       await Promise.all(
        //         tires_service.map(async (tire) => {
        //           await Tire.findOneAndUpdate(
        //             { _id: tire._id },
        //             { $inc: { quantity: -parseInt(tire.quantity) } }
        //           );
        //         })
        //       );
        //     }
        //     // Send the response after all operations are complete
        //     return res.status(200).json(data);
        //   } catch (err) {
        //     console.error(err);
        //     return res.status(500).json({ error: "An error occurred while processing the request." });
        //   }
        // });
      } else {
        Receipt.create(request, async (error, data) => {
          if (error) {
            return res.status(402).json({ error: error });
          } else {
            if (tires_service.length != 0 && oils_service != 0) {
              for (let i = 0; i < tires_service.length; i++) {
                Tire.findOneAndUpdate({_id: tires_service[i]._id}, {$inc:{'quantity' : -(parseInt(tires_service[i].quantity))}});
              }
  
                for (let j = 0; j < oils_service.length; j++) {
                  Oil.findOneAndUpdate({_id: oils_service[j]._id}, {$inc:{'quantity' : -(oils_service[j].quantity)}});
                }
  
                return res.status(200).json(data);
            }
            else if(oils_service.length != 0 && tires_service.length == 0){
              for(const oils in oils_service){
                Oil.findByIdAndUpdate({_id: oils._id}, {$inc:{'quantity' : -(oils.quantity)}});
              }
  
              return res.status(200).json(data);
            }
            else if(oils_service.length == 0 && tires_service.length != 0){
              await Promise.all(tires_service.map(tire => {
                return Tire.findOneAndUpdate({_id: tire._id}, {$inc:{'quantity' : -(parseInt(tire.quantity))}});
              }));
  
              return res.status(200).json(data);
            }
            else {
              return res.status(200).json(data);
            }
          }
        });
      }
    } else {
      return res.status(402).json({ error: "Unauthenticated" });
    }
  }
);
router.post(
  "/update",
  [
    check("customer", "Receipt Customer field is required").not().isEmpty(),
    // check("technician", "Technician field is required").not().isEmpty(),
    check("vehicle", "Vehicle name field is required").not().isEmpty(),
    check("status", "Receipt payment status field is required").not().isEmpty(),
    check("date", "Receipt date is required").not().isEmpty(),
  ],
  async (req, res) => {
    if (verifyToken(req, res)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(402).json(errors);
      }
      const customer = req.body.customer;
      const technician = req.body.technician;
      const vehicle = req.body.vehicle;
      const services = req.body.services;
      const tires = req.body.tires;
      const tiresPrice = req.body.tiresPrice;
      const tiresQuantity = req.body.tiresQuantity;
      const oil = req.body.oil;
      const extraOilPrice = req.body.extraOilPrice;
      const extraOilQuantity = req.body.extraOilQuantity;
      const taxInclude = req.body.taxIncluded;
      const taxType = req.body.taxType;
      const tax = req.body.tax;
      const discountInclude = req.body.discountIncluded;
      const discountType = req.body.discountType;
      const discount = req.body.discount;
      const totalPrice = req.body.totalPrice;
      const status = req.body.status;
      const paymentType = req.body.paymentType;
      const paid = req.body.paid;
      const remaining = req.body.remaining;
      const date = req.body.date;
      const tiresTax = req.body.tiresTax
      const note = req.body.note;
      const isDraft = req.body.isDraft;
      const user_id = req.body.user_id;

      const request = {
        customer,
        technician,
        vehicle,
        services,
        tires,
        tiresPrice,
        tiresQuantity,
        tiresQuantity,
        oil,
        extraOilPrice,
        extraOilQuantity,
        taxInclude,
        taxType,
        tax,
        discountInclude,
        discountType,
        discount,
        totalPrice,
        status,
        paymentType,
        paid,
        remaining,
        date,
        tiresTax,
        note,
        isDraft,
        user_id
      };
      let tires_service = [];
      let oils_service = [];
      for (let i = 0; i < request.services.length; i++) {
        if (request.services[i].value.type == 'tire_service') {
          let tire = {
            _id:request.services[i].value._id,
            quantity:request.services[i].value.quantity,
          }

          tires_service.push(tire);
        }
        if (request.services[i].value.type == 'oil_service') {
          let oils = {
            _id:request.services[i].value._id,
            quantity:5,
          }

          oils_service.push(oils);
        }
      }
      if (request.isDraft == 0) {
        Receipt.findByIdAndUpdate(req.body._id, request, async (error, data) => {
          if (error) {
            return res.status(402).json({ error: error });
          } else {
            if (tires_service.length != 0 && oils_service != 0) {
              for (let i = 0; i < tires_service.length; i++) {
                Tire.findOneAndUpdate({_id: tires_service[i]._id}, {$inc:{'quantity' : -(parseInt(tires_service[i].quantity))}});
              }
  
                for (let j = 0; j < oils_service.length; j++) {
                  Oil.findOneAndUpdate({_id: oils_service[j]._id}, {$inc:{'quantity' : -(oils_service[j].quantity)}});
                }
  
                return res.status(200).json(data);
            }
            else if(oils_service.length != 0 && tires_service.length == 0){
              for(const oils in oils_service){
                Oil.findByIdAndUpdate({_id: oils._id}, {$inc:{'quantity' : -(oils.quantity)}});
              }
  
              return res.status(200).json(data);
            }
            else if(oils_service.length == 0 && tires_service.length != 0){
              await Promise.all(tires_service.map(tire => {
                return Tire.findOneAndUpdate({_id: tire._id}, {$inc:{'quantity' : -(parseInt(tire.quantity))}});
              }));
  
              return res.status(200).json(data);
            }
            else {
              return res.status(200).json(data);
            }
            
          }
        });
      } else {
        Receipt.findByIdAndUpdate(req.body._id, request, async (error, data) => {
          if (error) {
            return res.status(402).json({ error: error });
          // } else {
          //   if (tires_service.length != 0 && oils_service != 0) {
          //     for (let i = 0; i < tires_service.length; i++) {
          //       Tire.findOneAndUpdate({_id: tires_service[i]._id}, {$inc:{'quantity' : -(parseInt(tires_service[i].quantity))}});
          //     }
  
          //       for (let j = 0; j < oils_service.length; j++) {
          //         Oil.findOneAndUpdate({_id: oils_service[j]._id}, {$inc:{'quantity' : -(oils_service[j].quantity)}});
          //       }
  
          //       return res.status(200).json(data);
          //   }
          //   else if(oils_service.length != 0 && tires_service.length == 0){
          //     for(const oils in oils_service){
          //       Oil.findByIdAndUpdate({_id: oils._id}, {$inc:{'quantity' : -(oils.quantity)}});
          //     }
  
          //     return res.status(200).json(data);
          //   }
          //   else if(oils_service.length == 0 && tires_service.length != 0){
          //     await Promise.all(tires_service.map(tire => {
          //       return Tire.findOneAndUpdate({_id: tire._id}, {$inc:{'quantity' : -(parseInt(tire.quantity))}});
          //     }));
  
          //     return res.status(200).json(data);
          //   }
          //   else {
              return res.status(200).json(data);
          //   }
            
          }
        });
      }
      


    } else {
      return res.status(402).json({ error: "Unauthenticated" });
    }
  }
);

router.get("/all/:user_id", (req, res) => {
  if (verifyToken(req, res)) {
    Receipt.find({'user_id':req.params.user_id, 'isDraft':0},(error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.status(200).json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});

router.get("/drafts/all/:user_id", (req, res) => {
  if (verifyToken(req, res)) {
    Receipt.find({'user_id':req.params.user_id, 'isDraft':1},(error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.status(200).json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});

router.get("/today/:date/:user_id", (req, res) => {
  if (verifyToken(req, res)) {
    Receipt.find({$or:[{'user_id':req.params.user_id, date: req.params.date, 'isDraft':0}]},(error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.status(200).json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});
router.get("/unpaid/:user_id", (req, res) => {
  if (verifyToken(req, res)) {
    Receipt.find({$or:[{'user_id':req.params.user_id, status:'Unpaid',  'isDraft':0}]},(error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.status(200).json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});
router.get("/details/:_id", (req, res) => {
  if (verifyToken(req, res)) {
    Receipt.findById(req.params._id,(error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res.status(200).json(data);
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});



router.post("/add-payment",[
    check("amount_paid", "Please Enter Some Amount").not().isEmpty(),
    check("payment_type", "Please Select a Payment Type").not().isEmpty(),
    check("payment_date", "Please Enter Payment Date").not().isEmpty(),
], async(req, res) => {
    if (verifyToken(req, res)) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(402).json(errors);
      }
      const receipt_id = req.body.receipt_id;

      const payment = {
       amount_due : req.body.amount_due,
       amount_paid : req.body.amount_paid,
       amount_remaining : req.body.amount_remaining,
       payment_type : req.body.payment_type,
       payment_date : req.body.payment_date,
      }
      

      Receipt.findByIdAndUpdate({_id:receipt_id},{$push:{payments: payment}, 
        $set:{
          status: req.body.status,
          paymentType:req.body.payment_type,
          paid:req.body.paid,
          remaining:req.body.amount_remaining,
        }}, (error, data) => {
        if (error) {
          return res.status(402).json({ error: error });
        } else {
          return res
            .status(200)
            .json({ message: "Payment Added successfully" });
        }
      });
    } else {
      return res.status(402).json({ error: "Unauthenticated" });
    }
});

router.post("/bulk-payment",[
  check("payment_type", "Please Select a Payment Type").not().isEmpty(),
  check("payment_date", "Please Enter Payment Date").not().isEmpty(),
], async(req, res)=>{
  if (verifyToken(req, res)) {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).json(errors);
    }
    const receiptsToUpdate = req.body.receipts;
    const payment_date = req.body.payment_date;
    const payment_type = req.body.payment_type;

    const updatePromises = [];

    for (let receipt of receiptsToUpdate){ 
      const payment = {
        amount_due: receipt.remaining,
        amount_paid: receipt.remaining,
        amount_remaining: 0,
        payment_type: payment_type,
        payment_date: payment_date,
      };
      updatePromises.push(Receipt.updateMany({_id:receipt._id}, {$push:{payments:payment},
        $set:{
          status:'Paid',
          payment_type:payment.payment_type,
          paid:receipt.totalPrice,
          remaining:0
        }
      }))
      
    }
    
    try {
      await Promise.all(updatePromises);
      return res.status(200).json({ message: "Payment Added successfully" });
    } catch(error) {
      return res.status(402).json({ error });
    }

  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});
router.get("/delete/:id", (req, res) => {
  if (verifyToken(req, res)) {
    Receipt.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return res.status(402).json({ error: error });
      } else {
        return res
          .status(200)
          .json({ message: "Receipt deleted successfully" });
      }
    });
  } else {
    return res.status(402).json({ error: "Unauthenticated" });
  }
});

router.get('/customer/:id', (req, res) => {
  if(verifyToken(req, res)){
      Receipt.find({"customer._id": req.params.id,  'isDraft':0},(error, data) => {
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
