import IMusic from "../interfaces/int.music";
import IResponse from "../interfaces/int.response";
import logger from "../../lib/logger";
import Stock from '../models/mod.music';
import HttpServer from "../class/server.class";
import mongoose from "mongoose";

export default class MusicCtrl{

    private server: HttpServer;
    private connection = null;
  
    constructor() {
      this.server = HttpServer.instance;
    }

    async createDiskStock(disk: IMusic):Promise <IResponse>{

        try{
            this.connection = this.server.app.locals.dbConnection

            if( disk ){
                const existe = await  Stock.find({diskId: disk.diskId})

                if(existe.length > 0){
                    return({ ok: true, message: "Ya existe ", response: null, code: 301})
                }

            const stockCreated = await Stock.create( disk )

            return({ ok: true, message: "Stock creado", response: stockCreated, code: 200})    
            
            }
            
            return({ ok: false, message: "Parametros incorrectos", response: null, code: 400})        
            
        }catch(err: any){
            logger.error(`createDiskStock ${err}`)
            return ({ ok: false, message: "Ocurrió un error", response: null, code: 500 })
        
        }finally {
            if (this.connection)
            await this.server.app.locals.dbConnection.release(this.connection);
        }   
    }



    async getDiskStock(page: number, per_page: number):Promise <IResponse>{
        
        if(page <= 0 || per_page <= 0){
            return ({ ok: false, message: 'Value params incorrect', response: null, code: 301 })
        }

        try {
            this.connection = this.server.app.locals.dbConnection

            const skip = per_page * (page-1)

            const stockDisk = await Stock.find({}).limit(per_page).skip(skip)

            if ( !stockDisk ) {

                    return ({ ok: false, message: 'Sin stock', response: stockDisk, code: 404 })
            }
            if(stockDisk.length === 0){
                return { ok: true, message: "No disks found", response: null, code: 204 };
            }

            return ({ ok: true, message: 'Stock encontrado', response: stockDisk, code: 200 })

        }catch (err: any) {
            logger.error(`getDiskStock ${err}`);
            return { ok: false, message: "Error ocurred", response: null, code: 500 };
        } finally {
        if (this.connection)
            await this.server.app.locals.dbConnection.release(this.connection);
        }
    }

    async deleteDiskStock(id: any):Promise <IResponse>{
        
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return { ok: false, message: "El ID proporcionado no es válido", response: null, code: 400 };
        }

        try{
            this.connection = this.server.app.locals.dbConnection

            const stockDeleted = await Stock.deleteOne({_id: id})

            if(stockDeleted.deletedCount === 0){

                return({ ok: false, message: "Este stock ya fue eliminado con anterioridad", response: stockDeleted, code: 301})  
            
            }
            
            return({ ok: true, message: "Stock eliminado", response: stockDeleted, code: 200})    
            
        }catch(err: any){
            logger.error(`deleteDiskStock ${err}`)
            return ({ ok: false, message: "Ocurrió un error", response: null, code: 500 })
        
        }finally {
            if (this.connection)
            await this.server.app.locals.dbConnection.release(this.connection);
        }   
    }

    async updateDiskStock(_id: String, disk: IMusic):Promise<IResponse>{
        
        try{
            this.connection = this.server.app.locals.dbConnection
            /*const searchDisk = await Stock.findById( _id )
            if(!searchDisk ) {
                return({ ok: false, message: "Disk not found", response: null, code: 400})
            }

            const updateDisk = await Stock.updateOne({_id},{$set: disk})
            
            if(!updateDisk){
                return ({ ok: false, message: "Not updating", response: null, code: 400})
            }
            return ({ ok: false, message: "Udate Success", response: updateDisk, code: 200})
            */

            const updateDisk = await Stock.findOneAndUpdate({_id},{$set: disk})

            if(!updateDisk){

                return ({ ok: false, message: "Not found and not updating", response: null, code: 400})
            
            }

            return ({ ok: false, message: "Udate Success", response: updateDisk, code: 200})
            
        }catch(err){

            logger.error(`updateDiskStock ${err}`)

            return ({ ok: false, message: "Ocurrió un error", response: null, code: 500 })

        }finally{

            if(this.connection)

                await this.server.app.locals.dbConnection.release(this.connection)
        }

    }
}

1