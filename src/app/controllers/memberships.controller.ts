import { Membership } from "../classes/membership";
import DatabaseProvider  from '../providers/database.provider';

export class MembershipController  {
    private db = DatabaseProvider.instance;
    constructor() { }
  
    ngOnInit(): void {
    }
  
    insert(publication:Membership){
        return new Promise((resolve,reject)=>{
            this.db.insert('memberships',publication);
            resolve(true);
        });
    }
    update(publication:Membership,objWhere:any){
        return new Promise((resolve,reject)=>{
            this.db.update('memberships',publication,objWhere);
            resolve(true);
        });
    }
    selectAll(){
        return new Promise<any>((resolve,reject)=>{
            this.db.select('memberships').then(resp=>{
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
            this.db.select('memberships',objWhere).then(resp=>{
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