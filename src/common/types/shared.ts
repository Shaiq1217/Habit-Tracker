import { Types } from 'mongoose';

export type User = {
    _id: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    habits: Types.ObjectId[];
};

export type IResponse<T> = {
    status: boolean;
    message: string;
    data?: T;
};
