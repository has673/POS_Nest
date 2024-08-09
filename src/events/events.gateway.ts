import { SubscribeMessage, WebSocketGateway ,WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({namespace:'events'})
export class EventsGateway {

  @WebSocketServer()
  server:Server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  sendMessage(){
    this.server.emit("newMessage","Hellow")
  }
}
