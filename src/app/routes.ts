import { Router, Request, Response } from 'express';
import ServerProvider from './providers/server.provider';
import { connectedUsers } from '../sockets/sockets';
// interfaces
import { Publication } from './classes/publication';
import { Group } from './classes/group';
import { Account } from './classes/account';
import { Membership } from './classes/membership';
//controllers
import { PublicationController } from './controllers/publications.controller';
import { GroupController } from './controllers/groups.controller';
import { AccountsController } from './controllers/accounts.controller';
import { MembershipController } from './controllers/memberships.controller';

// server
const server = ServerProvider.instance;

// hash 
var crypto = require('crypto');

// jwt 
const jwt = require('jsonwebtoken');

const router = Router();
const protectedRoutes = Router(); 
protectedRoutes.use((req:any, res, next) => {
    const token = req.headers['access-token'];
    if (token) {
      jwt.verify(token, server.app.get('llave'),(err:any, decoded:any) => {      
        if (err) {
            return res.json({
                ok: false,
                message: 'Invalid token'
            });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
        res.status(401);
        res.send({
            ok: false,
            message: 'Token not provided'
        });
    }
});


router.get('/messages',protectedRoutes,(request: Request, response: Response)=>{
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

router.get('/publications',protectedRoutes,(request: Request, response: Response)=>{
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
router.get('/publications/:id',protectedRoutes,(request: Request, response: Response)=>{
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

router.post('/auth/signup',(request: Request, response: Response)=>{
    
    console.log("********************POST********");
    console.log(request.body.id_group);
    console.log(parseInt(request.body.id_group));
    
    const id_group = parseInt(request.body.id_group);
    const first_name = request.body.first_name;
    const last_name = request.body.last_name;
    const email = request.body.email;
    const password = crypto.createHash('sha256').update(request.body.password).digest('base64');

    const token = jwt.sign({check:  true}, server.app.get('llave'), {
        expiresIn: 1440
    });

    const accountsCtrl = new AccountsController();
    const account: Account = {
        id_group: id_group,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        token
    }
    accountsCtrl.insert(account).then((newAccount:any)=>{
        delete newAccount.password;
        response.json({
            ok: true,
            data: {
                account: newAccount
            }
        });
    }).catch( err =>{

    });
});
router.post('/auth/signin',(request: Request, response: Response)=>{
    
    console.log("********************POST********");
    
    const email = request.body.email;
    const password = crypto.createHash('sha256').update(request.body.password).digest('base64');

    const accountsCtrl = new AccountsController();
    const objWhere: any = {
        email: email,
        password: password,
    }
    accountsCtrl.getAccount(objWhere).then((validAccount:any)=>{
        console.log('LOGIN');
        console.log(validAccount);
        const token = jwt.sign({check:  true}, server.app.get('llave'), {
            expiresIn: 1440
        });
        validAccount.token = token
        delete validAccount.password;
        response.json({
            ok: true,
            data: {
                account: validAccount
            }
        });
    }).catch( err =>{
        console.log('/auth/signin', err);
        response.status(400);
        response.send({
            ok: false,
            message: 'Usuario o contraseña incorrectos',
            description: err
        });
    });
});


// groups 

router.post('/groups',(request: Request, response: Response)=>{
    
    
    console.log("********************POST********");
    console.log(request.body.id_group);
    console.log(parseInt(request.body.id_group));
    
    const name = request.body.name;
    const description = request.body.description;
    const image = request.body.image;

    const group = new GroupController();
    const pub: Group = {
        name,
        description,
        image
    }
    group.insert(pub).then(resp=>{
        response.json({
            ok: true,
            data: {
                group: {
                    name,
                    description,
                    image
                }
            }
        });
    }).catch( err =>{

    });
});

router.get('/groups',(request: Request, response: Response)=>{
    const group = new GroupController();
    group.selectAll().then(resp=>{
        response.json({
            ok: true,
            data: resp
        });
    }).catch( err =>{
        console.log('get /groups', err);
        response.json({
            ok: false,
            message: 'Database error',
            description: err
        });
    });
});

router.get('/groups/:id',(request: Request, response: Response)=>{
    const group = new GroupController();
    const id = parseInt(request.params.id);
    group.getBy({id:id}).then(resp=>{
        response.json({
            ok: true,
            data: resp
        });
    }).catch( err =>{
        console.log('get /groups', err);
        response.json({
            ok: false,
            message: 'Database error',
            description: err
        });
    });
});

router.put('/groups',(request: Request, response: Response)=>{
    console.log("********************PUT********");
    const id = parseInt(request.body.id);
    const name = request.body.name;
    const description = request.body.description;
    const image = request.body.image;

    const publication = new GroupController();
    const pub: Group = {
        name: name,
        description: description,
        image: image
    }
    publication.update(pub,{id:id}).then(resp=>{
        response.json({
            ok: true,
            data: {
                publication: {
                    id,
                    name,
                    description,
                    image
                }
            }
        });
    }).catch( err =>{

    });
});
// memberships 

router.post('/memberships',(request: Request, response: Response)=>{
    
    
    console.log("********************POST********");
    console.log(parseInt(request.body.id_term));
    
    const name = request.body.name;
    const description = request.body.description;
    const id_term = parseInt(request.body.id_term);
    const price = parseFloat(request.body.price);
    const content = request.body.content;

    const membership = new MembershipController();
    const pub: Membership = {
        name,
        description,
        id_term,
        price,
        content
    }
    membership.insert(pub).then(resp=>{
        response.json({
            ok: true,
            data: {
                membership: {
                    name,
                    description,
                    id_term,
                    price,
                    content
                }
            }
        });
    }).catch( err =>{

    });
});

router.get('/memberships',(request: Request, response: Response)=>{
    const group = new MembershipController();
    group.selectAll().then(resp=>{
        response.json({
            ok: true,
            data: resp
        });
    }).catch( err =>{
        console.log('get /memberships', err);
        response.json({
            ok: false,
            message: 'Database error',
            description: err
        });
    });
});

router.get('/memberships/:id',(request: Request, response: Response)=>{
    const group = new MembershipController();
    const id = parseInt(request.params.id);
    group.getBy({id:id}).then(resp=>{
        response.json({
            ok: true,
            data: resp
        });
    }).catch( err =>{
        console.log('get /memberships', err);
        response.json({
            ok: false,
            message: 'Database error',
            description: err
        });
    });
});

router.put('/memberships',(request: Request, response: Response)=>{
    console.log("********************PUT********");
    const id = parseInt(request.body.id);
    const name = request.body.name;
    const description = request.body.description;
    const image = request.body.image;

    const publication = new MembershipController();
    const pub: Group = {
        name: name,
        description: description,
        image: image
    }
    publication.update(pub,{id:id}).then(resp=>{
        response.json({
            ok: true,
            data: {
                publication: {
                    id,
                    name,
                    description,
                    image
                }
            }
        });
    }).catch( err =>{

    });
});


export default router;