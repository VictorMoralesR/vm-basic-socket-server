import express from 'express';
import { SERVER_PORT } from './../../global/environment';

import socketIO, { Server } from 'socket.io';
import http from 'http';

import * as socket from './../../sockets/sockets';


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
        this.io.on('connection', client => {
            console.log('client connected');

            // disconnect 
            socket.disconnect(client);

            // listen messages 
            socket.message(client,this.io);
            
            // configure user 
            socket.configUser(client,this.io);

            socket.connectClient(client);
        });
    }

    start( callback: any ){
        this.httpServer.listen( this.port, callback );
    }
}