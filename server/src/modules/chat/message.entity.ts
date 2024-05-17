import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { User } from "../user/user.entity";



@Entity()
export class Message{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    // @ManyToOne(() => Chat, chat => chat.messages)
    // chat: Chat;

    @ManyToOne(() => User)
    @Column()
    sender: User;

   
    @ManyToOne(() => User)
    @Column()
    receiver: User;

    @Column()
    sentAt: Date;

    @Column()
    createdAt: Date;

    @Column()
    readAt: Date;

    @Column()
    content: string;

}