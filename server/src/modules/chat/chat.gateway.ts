import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";



// @WebSocketGateway() decorator is used to define a gateway.
//cors is enabled by default
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5500', 'http://localhost:3000','http://127.0.0.1:5500' ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }
})
export class ChatGateway  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: any, ...args: any[]) {
    const token  = client.handshake.query.token;
    this.logger.log(`Client connected: ${client.id} and the token is ${token}`);
  }

  handleDisconnect(client: any) {

    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug( `Payload: ${payload}`);
    return {
      event: "message",
      data:payload,
    }
  }
}
