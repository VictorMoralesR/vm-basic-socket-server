import { Router, Request, Response } from 'express';
import ServerProvider from '../providers/server.provider';
import { connectedUsers } from '../sockets/sockets';

const router = Router();


router.get('/messages',(request: Request, response: Response)=>{
    response.json({
        ok: true,
        mensaje: 'Todo bien'
    });
});
router.post('/messages',(request: Request, response: Response)=>{
    const message = request.body.message;
    const by = request.body.by;
    const server = ServerProvider.instance;
    const payload = {
        by ,
        message
    };
    server.io.emit('new-private-message',payload);

    response.json({
        ok: true,
        message,
        by,
    });
});
router.post('/messages/:id',(request: Request, response: Response)=>{
    console.log('message post', request);
    
    const message = request.body.message;
    const by = request.body.by;
    const id = request.params.id;
    const server = ServerProvider.instance;
    const payload = {
        by ,
        message
    };
    server.io.in( id ).emit('new-private-message',payload);
    response.json({
        ok: true,
        message,
        by,
        id
    });
});

router.get('/users',(request: Request, response: Response)=>{
    const server = ServerProvider.instance;
    
    server.io.clients((err:any,users:string[])=>{
        if(err){
            return response.json({
                ok:false,
                err
            });
        }
        
        response.json({
            ok: true,
            users
        });
    });
});
router.get('/users/detail',(request: Request, response: Response)=>{
    const server = ServerProvider.instance;
    
    server.io.clients((err:any,users:string[])=>{
        if(err){
            return response.json({
                ok:false,
                err
            });
        }
        response.json({
            ok: true,
            users: connectedUsers.getUserList()
        });
    });
});

export default router;