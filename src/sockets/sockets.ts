import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import UserList from '../providers/user-list.provider';
import { User } from '../classes/user';

export const connectedUsers = new UserList();

export const disconnect = ( cliente: Socket ) =>{
    cliente.on('disconnect',()=>{
        console.log('Cliente desconectado');
        connectedUsers.deleteUser(cliente.id);
    });
};

export const connectClient = ( client: Socket )=>{
    const user = new User(client.id);
    connectedUsers.add(user);
}
// listen message
export const message = ( client: Socket, io: socketIO.Server ) => {
    client.on('message',(payload) => {
        console.log('Message received', payload);
        io.emit('new-message', payload);
    });
};
// listen message
export const configUser = ( client: Socket, io: socketIO.Server ) => {
    client.on('config-user',(payload: { name : string }, callback: Function ) => {
        console.log('User configuration', payload);
        connectedUsers.updateName( client.id, payload.name );
        callback({
            ok: true,
            message: `user ${ payload.name }, config`
        });
        // io.emit('new-message', payload);
    });
};