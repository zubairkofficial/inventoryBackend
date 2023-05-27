const jwt = require("jsonwebtoken");
class Helpers{
    static tokenKey = 'inventory';

    static verifyToken = (req, res) => {
        const token = req.headers["x-access-token"];
        if(!token){
            return false;
        }else{
            try {
                return jwt.verify(token, this.tokenKey) ? true : false;
            } catch (error) {
                return false;
            }
        }
    }
}

module.exports = Helpers;