import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, Message, MessageDocument } from '../schemas';
import { DataEmail } from 'src/interfaces';

@Injectable()
export class DBService {
    constructor( 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>
    ) {}

    async saveEmail(incomingEmail: DataEmail) {
        const { name, email, subject, message } = incomingEmail;
        let searchedUser = await this.userModel.findOne({ email });    // busqueda de antiguo enviante
        // let registeredUser: UserDocument;
        if (!searchedUser) {
            searchedUser = new this.userModel({ name, email, count: 1 });
            await searchedUser.save();
        }
        else {
            if (name !== '') searchedUser.name = name;       // revisión de valores nulos pendientes a cambio
            searchedUser.count++;
            searchedUser = await this.userModel.findByIdAndUpdate(searchedUser._id, { ...searchedUser });
        }
        const newMessage = new this.messageModel({ subject, message, User: searchedUser?._id });
        const savedMessage = await newMessage.save();
        return { searchedUser, savedMessage };
    }

}