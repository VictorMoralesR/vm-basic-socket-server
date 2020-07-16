import express from 'express';
import { SERVER_PORT } from '../global/environment';

import socketIO, { Server } from 'socket.io';
import http from 'http';

import * as socket from './../sockets/sockets';


export default class ServerProvider{

    private static _instance: ServerProvider;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.listenSockets();
    }

    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    private listenSockets(){
        console.log('Escuchando sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');

            // disconnect 
            socket.disconnect(cliente);

            // listen messages 
            socket.message(cliente,this.io);
            
            // configure user 
            socket.configUser(cliente,this.io);
        });
    }

    start( callback: any ){
        this.httpServer.listen( this.port, callback );
    }
}