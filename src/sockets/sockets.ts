import { Socket } from 'socket.io';
import socketIO from 'socket.io';

export const disconnect = ( cliente: Socket ) =>{
    cliente.on('disconnect',()=>{
        console.log('Cliente desconectado');
        
    });
};
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
        callback({
            ok: true,
            message: `user ${ payload.name }, config`
        });
        // io.emit('new-message', payload);
    });
};