import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DBService } from './db.service';
import { Message, MessageSchema, User, UserSchema } from '../schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [DBService],
    exports: [DBService]
})
export class DBsModule {}