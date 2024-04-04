import { Router, Request, Response } from "express";
import logger from "../lib/logger";
import MusicCtrl from "./controllers/music.controller";

const routes = Router();
const musicControl = new MusicCtrl

routes.post('/createDiskStock', async ( req: Request, res: Response ) => {

    const disk  = req.body

    try{
        const response = await musicControl.createDiskStock( disk )
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code: 500).json(err)
    }
})

routes.get('/getDiskStock', async ( req: Request, res: Response ) => {

    const per_page : any = req.query.per_page
    const page : any = req.query.page

    try{
        const response = await musicControl.getDiskStock( Number(page), Number(per_page) )
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code: 500).json(err)
    }
})

routes.delete('/deleteDiskStock/:_id', async ( req: Request, res: Response ) => {

    const _id: any = req.params._id

    try{
        const response = await musicControl.deleteDiskStock( _id )
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code: 500).json(err)
    }
})

export default routes;
