import { Publication } from "../../classes/publication";
import DatabaseProvider  from './../../providers/database.provider';

export class PublicationController  {
    private db = DatabaseProvider.instance;
    constructor() { }
  
    ngOnInit(): void {
    }
  
    insert(publication:Publication){
        return new Promise((resolve,reject)=>{
            this.db.insert('publications',publication);
            resolve(true);
        });
    }
    update(publication:Publication,objWhere:any){
        return new Promise((resolve,reject)=>{
            this.db.update('publications',publication,objWhere);
            resolve(true);
        });
    }
    selectAll(){
        return new Promise<any>((resolve,reject)=>{
            this.db.select('publications').then(resp=>{
                console.log('********************* SELECT ALL *****************');
                console.log(resp);
                resolve(resp.rows);
            }).catch(err=>{
                reject(err);
            });
        });
    }

    getBy(objWhere:any){
        return new Promise((resolve,reject)=>{
            this.db.select('publications',objWhere).then(resp=>{
                if(resp.rowCount){
                    resolve(resp.rows[0]);
                } else {
                    resolve(null);
                }
            }).catch(err=>{
                reject(err);
            });
        });
    }
  
}