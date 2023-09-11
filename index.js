require('dot-env');
let express = require('express');
let mongoose = require('mongoose');
const path = require('path');
let cors = require('cors');
let bodyParser = require('body-parser');

const userRoute = require('./Routes/user.route');
const adminRoute = require('./Routes/admin.route');
const customerRoute = require('./Routes/customer.route');
const employeeRoute = require('./Routes/employee.route');
const serviceRoute = require('./Routes/service.route');
const tireRoute = require('./Routes/tire.route');
const vehicleRoute = require('./Routes/vehicle.route');
const oilRoute = require('./Routes/oil.route');
const receiptRoute = require('./Routes/receipt.route');
const reportRoute = require('./Routes/report.route')
const roleRoute = require('./Routes/role.route');
const permissionRoute = require('./Routes/permission.route');
const teamRoute = require('./Routes/team.route');
const tabRoute = require('./Routes/tab.route');
// const User = require('./Models/User');

mongoose.connect('mongodb+srv://inventory:inventory123@inventorycluster.ai2teve.mongodb.net/db_inventory?retryWrites=true&w=majority').then(data => {
    console.log(`Conneced to Mongodb! Database name: ${data.connections[0].name}`);
}).catch(err => {
    console.log(`Error connecting to database. ${err}`);
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true,
}));
app.use(cors());
app.get('/check', (req, res) => {
    return res.json({
        message: "Everything is working fine",
    })
})
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use('/api', adminRoute);
app.use('/admins', adminRoute);
app.use('/users', userRoute);
app.use('/customers', customerRoute);
app.use('/employees', employeeRoute);
app.use('/services', serviceRoute);
app.use('/tires', tireRoute);
app.use('/vehicles', vehicleRoute);
app.use('/oils', oilRoute);
app.use('/receipts', receiptRoute);
app.use('/reports', reportRoute);
app.use('/roles', roleRoute);
app.use('/permissions', permissionRoute);
app.use('/teams', teamRoute);
app.use('/tabs', tabRoute);

// app.get('/temp-get-all-user', (req, res)=>{
//     User.find((error, data) => {
//         if (error) {
//           return res.status(402).json({ error: error });
//         } else {
//           return res.json(data);
//         }
//       });
// })

// app.get("/temp-get-profile/:id", (req, res) => {
//     User.findById(req.params.id, (error, data) => {
//       if (error) {
//         return res.status(500).json({ error: "Internal Server Error" });
//       } else if (!data) {
//         return res.status(404).json({ error: "User not found" });
//       } else {
//         return res.status(200).json(data);
//       }
//     });
//   });
  

// const port = process.env.PORT || 3000;
const port = 8001;
app.listen(port, () => {
    console.log(`App Running at port: ${port}`);
});