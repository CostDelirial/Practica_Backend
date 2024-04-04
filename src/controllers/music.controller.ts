import IMusic from "../interfaces/int.music";
import IResponse from "../interfaces/int.response";
import logger from "../../lib/logger";
import Stock from "../models/mod.music";
import HttpServer from "../class/server.class";

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
        try {
            this.connection = this.server.app.locals.dbConnection
            const stockDisk = await Stock.find({}).limit(per_page).skip(per_page * (page -1))
            if ( !stockDisk || stockDisk.length < 1 ) {
            return ({ ok: false, message: 'Sin stock', response: stockDisk, code: 404 })
            }
            return({ ok: true, message: 'Stock encontrado', response: stockDisk, code: 200 })

        }catch (err: any) {
            logger.error(`getDiskStock ${err}`);
            return { ok: false, message: "Error ocurred", response: null, code: 500 };
        } finally {
        if (this.connection)
            await this.server.app.locals.dbConnection.release(this.connection);
        }
    }

    async deleteDiskStock(_id: any):Promise <IResponse>{

        try{
            this.connection = this.server.app.locals.dbConnection
            if( _id ){
            const stockDeleted = await Stock.findOneAndDelete( _id )
            return({ ok: true, message: "Stock eliminado", response: stockDeleted, code: 200})    
            }
            return({ ok: false, message: "Parametros incorrectos", response: null, code: 400})
                    
            
        }catch(err: any){
            logger.error(`deleteDiskStock ${err}`)
            return ({ ok: false, message: "Ocurrió un error", response: null, code: 500 })
        
        }finally {
            if (this.connection)
            await this.server.app.locals.dbConnection.release(this.connection);
        }   
    }
}

