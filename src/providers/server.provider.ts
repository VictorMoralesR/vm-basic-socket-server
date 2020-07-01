import express from 'express';
import { SERVER_PORT } from '../global/environment';

import socketIO from 'socket.io';
import http from 'http';


export default class ServerProvider{
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );
    }

    private listenSockets(){
        console.log('Escuchando sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');
        });
    }

    start( callback:FunctionConstructor ){
        this.httpServer.listen( this.port, callback );
    }
}