const jwt = require('jsonwebtoken');
const SECRET_KEY = 'heyiamlearningmerndevelopementusingcodewitharry';


const getUserData = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token){
        return res.status(500).json('Unauthorized Access');
    }

    try{
    const data = await jwt.verify(token, SECRET_KEY);
    if(!data)
        return res.status(500).json('Unauthorized Access');

    req.user = data.user
    next();
    }catch(err){
        res.status(401).json('Unauthorized Access');
    }
}

module.exports = getUserData;