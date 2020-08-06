import { Group } from "../classes/group";
import DatabaseProvider  from '../providers/database.provider';

export class GroupController  {
    private db = DatabaseProvider.instance;
    constructor() { }
  
    ngOnInit(): void {
    }
  
    insert(publication:Group){
        return new Promise((resolve,reject)=>{
            this.db.insert('groups',publication);
            resolve(true);
        });
    }
    update(publication:Group,objWhere:any){
        return new Promise((resolve,reject)=>{
            this.db.update('groups',publication,objWhere);
            resolve(true);
        });
    }
    selectAll(){
        return new Promise<any>((resolve,reject)=>{
            this.db.select('groups').then(resp=>{
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
            this.db.select('groups',objWhere).then(resp=>{
                if(resp.rowCount){
                    resolve(resp.rows[0]);
                } else {
                    resolve([]);
                }
            }).catch(err=>{
                reject(err);
            });
        });
    }
  
}