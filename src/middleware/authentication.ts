import { JWT_SECRET } from "../common/secrets.js";
import { JwtPayload } from "../common/types/shared.js";
import jwt from 'jsonwebtoken'; 
import userServices from "../services/User.service.js";

export const ensureAuth = async (req: any, res: any, next: any) => {
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({status: false, message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const { id } = decoded;
        if(!(await userServices.getById(id)).status) return res.status(401).json({status: false, message: 'User not found'});
        req.user = id;
        next();
    } catch (error) {
        return res.status(401).json({status: false, message: 'Unauthorized'});
    }
}