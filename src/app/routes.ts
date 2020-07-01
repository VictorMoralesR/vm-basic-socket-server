import { Router, Request, Response } from 'express';

const router = Router();


router.get('/mensajes',(request: Request, response: Response)=>{
    response.json({
        ok: true,
        mensaje: 'Todo bien'
    });
});
router.post('/mensajes/:id',(request: Request, response: Response)=>{
    const cuerpo = request.body.cuerpo;
    const de = request.body.de;
    const id = request.params.id;
    response.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

export default router;