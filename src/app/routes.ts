import { Router, Request, Response } from 'express';
import ServerProvider from '../providers/server.provider';
import { connectedUsers } from '../sockets/sockets';

//controllers
import { PublicationController } from './controllers/publications.controller';
import { Publication } from '../classes/publication';

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

router.post('/publications',(request: Request, response: Response)=>{
    
    
    console.log("********************POST********");
    console.log(request.body.id_group);
    console.log(parseInt(request.body.id_group));
    
    const id_group = parseInt(request.body.id_group);
    const title = request.body.title;
    const subtitle = request.body.subtitle;
    const content = request.body.content;

    const publication = new PublicationController();
    const pub: Publication = {
        id_group: id_group,
        title: title,
        subTitle: subtitle,
        content: content
    }
    publication.insert(pub).then(resp=>{
        response.json({
            ok: true,
            data: {
                publication: {
                    id_group,
                    title,
                    subtitle,
                    content
                }
            }
        });
    }).catch( err =>{

    });
});

router.put('/publications',(request: Request, response: Response)=>{
    console.log("********************PUT********");
    const id = parseInt(request.body.id);
    const id_group = parseInt(request.body.id_group);
    const title = request.body.title;
    const subtitle = request.body.subtitle;
    const content = request.body.content;

    const publication = new PublicationController();
    const pub: Publication = {
        id_group: id_group,
        title: title,
        subTitle: subtitle,
        content: content
    }
    publication.update(pub,{id:id}).then(resp=>{
        response.json({
            ok: true,
            data: {
                publication: {
                    id,
                    id_group,
                    title,
                    subtitle,
                    content
                }
            }
        });
    }).catch( err =>{

    });
});

router.get('/publications',(request: Request, response: Response)=>{
    const publication = new PublicationController();
    publication.selectAll().then(resp=>{
        response.json({
            ok: true,
            data: resp
        });
    }).catch( err =>{
        console.log('get /publications', err);
        response.json({
            ok: false,
            message: 'Database error',
            description: err
        });
    });
});
router.get('/publications/:id',(request: Request, response: Response)=>{
    const publication = new PublicationController();
    const id = parseInt(request.params.id);
    publication.getBy({id:id}).then(resp=>{
        response.json({
            ok: true,
            data: resp
        });
    }).catch( err =>{
        console.log('get /publications', err);
        response.json({
            ok: false,
            message: 'Database error',
            description: err
        });
    });
});

export default router;