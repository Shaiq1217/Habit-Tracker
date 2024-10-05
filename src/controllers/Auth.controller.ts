import { Request, Response } from 'express';
import authServices from '../services/Auth.service.js';

class Auth {
    register = async (req : Request, res : Response) => {
        const { email, password, username } = req.body;
        const user = await authServices.register(email, password, username);
        if (!user) {
            return res.status(400).json(user);
        }
        return res.status(201).json(user);
    }

    login = async (req : Request, res : Response) => {
        const { email, username, password } = req.body;
        const user = await authServices.login(email, username, password);
        if (!user) {
            return res.status(400).json(user);
        }
        return res.status(200).json(user);
    }

    forgotPassword = async (req : Request, res : Response) => {
        const { email } = req.body;
        const response = await authServices.forgotPassword(email);
        if (!response) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }

    resetPassword = async (req : Request, res : Response) => {
        const { email, password, token } = req.body;
        const response = await authServices.resetPassword(email, password, token);
        if (!response) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }

    verifyEmail = async (req : Request, res : Response) => {
        const { email, token } = req.body;
        const response = await authServices.verifyEmail(email, token);
        if (!response) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }
    
}

const authController = new Auth();
export default authController;