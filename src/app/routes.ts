import { Router, Request, Response } from 'express';
import ServerProvider from '../providers/server.provider';

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

export default router;