import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Chat{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    user1Id: string;

    @Column()
    user2Id: string;

    @Column()
    lastConversationDate: Date;

    @Column()
    lastMessage:string;


}