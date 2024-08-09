// import { SubscribeMessage, WebSocketGateway ,WebSocketServer} from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway({namespace:'events'})
// export class EventsGateway {

//   @WebSocketServer()
//   server:Server;
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
//   sendMessage(){
//     this.server.emit("newMessage","Hellow")
//   }
// }


//2nd

// import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ namespace: 'events' })
// export class EventsGateway {
//   @WebSocketServer()
//   private readonly server: Server;

//   @SubscribeMessage('message')
//   handleMessage(client: Socket, payload: { message: string }): void {
//     console.log('Message received:', payload.message);
//     this.server.emit('message', { response: 'Hello world!' });
//   }

//   sendMessage(message: string): void {
//     this.server.emit('newMessage', { message });
//   }
// }



import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { UnauthorizedException } from '@nestjs/common'; // Import UnauthorizedException

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.headers['authorization'] as string; // Directly access 'authorization'
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Remove 'Bearer ' if present
      const tokenWithoutBearer = token.replace('Bearer ', '');

      // Verify token using jsonwebtoken
      const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET) as { userId: number; email: string };
      client.data.user = decoded; // Store user data in client
      console.log('Decoded JWT for socket:', decoded);
    } catch (error) {
      client.disconnect(); // Disconnect the client if authentication fails
      console.error('Connection failed due to:', error.message);
    }
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { message: string }): void {
    if (!client.data.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('Message received from:', client.data.user.email);
    this.server.emit('message', { response: 'Hello world!' });
  }

  sendMessage(message: string): void {
    this.server.emit('newMessage', { message });
  }
}
