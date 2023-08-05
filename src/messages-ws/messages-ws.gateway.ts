//* yarn add @nestjs/websockets @nestjs/platform-socket.io
//*http://localhost:3000/socket.io/socket.io.js
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true, namespace: '/' })//*por default, el namespace es así. O sea cualquier cliente que se conecte va a estar en esa ruta
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {//*estas dos implementaciones son para saber cuando alguien se conecta o se desconecta
  
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
    ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient( client, payload.id );//*se registran los clientes por navegador

    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload })    
    // console.log('Cliente conectado', client.id);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());//*En el segundo argumento irá lo que se quiere mostrar en el cliente, socket.on('clients-updated', ... )

    // console.log({conectados: this.messagesWsService.getConnectedClients2()});
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());//*se recomienda colocar cuando se desconecta

    // console.log({conectados: this.messagesWsService.getConnectedClients2()});
  }
}

//*escuchar eventos del cliente
// @SubscribeMessage('message-from-client')//*NOMBRE DEL EVENTO
// onMessageFromClient( client: Socket, payload: NewMessageDto ) {
  // console.log(client.id, payload: NewMessageDto);//*cliente.id es su id, payload es lo que envia el cliente
  //! Emite únicamente al cliente.
  // client.emit('message-from-server', {
  //   fullName: 'Soy Yo!',
  //   message: payload.message || 'no-message!!'
  // });

  //! Emitir a todos MENOS, al cliente inicial
  // client.broadcast.emit('message-from-server', {
  //   fullName: 'Soy Yo!',
  //   message: payload.message || 'no-message!!'
  // });

//   this.wss.emit('message-from-server', {
//     fullName: this.messagesWsService.getUserFullName(client.id),
//     message: payload.message || 'no-message!!'
//   });

// }
