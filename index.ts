import ServerProvider from "./src/app/providers/server.provider";
import router from './src/app/routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import DatabaseProvider from "./src/app/providers/database.provider";

const server = ServerProvider.instance;
const database = DatabaseProvider.instance;

// jwt 
// TODO: add env file
server.app.set('llave', 'testpass');
// body parser 
server.app.use( bodyParser.urlencoded( { extended: true } ) );
server.app.use( bodyParser.json() );

// cors
server.app.use( cors( { origin:true, credentials: true } ) );

// routes
server.app.use('/', router);


server.start(() => {
    console.log(`El servidor esta corriendo en el puerto ${ server.port }`);
});