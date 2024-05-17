import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';

async function createNestApp(...gateways: any[]) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    providers: [...gateways],
  }).compile();

  return moduleFixture.createNestApplication();
}
describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    //instantiat the app
    app = await createNestApp(ChatGateway);
    //get the gateway instance from the app instance
    gateway = app.get<ChatGateway>(ChatGateway);
    //create a new client that will interact with the gateway
    const port = 5500;
    ioClient = io(`http://localhost:${port}`, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(port);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit hello world when called', async () => {
    //connect the client
    ioClient.connect();
    //emit a message to the server
    ioClient.emit('message', 'Hello world!');
    //listen for the response from the server
    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        console.log('connected');
      });
      ioClient.on('message', (message) => {
        expect(message).toBe('Hello world!');
        resolve();
      });
    });
    ioClient.disconnect();
  });
});
