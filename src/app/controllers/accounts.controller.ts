import { Account } from "../classes/account";
import DatabaseProvider  from './../providers/database.provider';

export class AccountsController  {
    private db = DatabaseProvider.instance;
    constructor() { }
  
    ngOnInit(): void {
    }
  
    insert(account:Account){
        return new Promise((resolve,reject)=>{
            this.db.insert('accounts',account).then(resp=>{
                console.log('RESPPPPPP ************************');
                console.log(resp);
                
                if(resp.rowCount > 0){
                    resolve(resp.rows[0]);
                } else {
                    // TODO: standardize responses
                    reject({
                        message: 'Error DB: it was nos possible to register in the database'
                    });
                }
            }).catch(err=>{
                console.log('ERROR ACIT: ',err);
                reject(err);
            });
        }).catch(err=>{
            console.log('ERROR ACIC: ',err);
        });
    }
    getAccount(objWhere:any){
        return new Promise((resolve,reject)=>{
            this.db.select('accounts',objWhere).then(resp=>{
                if(resp.rowCount){
                    resolve(resp.rows[0]);
                } else {
                    reject('No data');
                }
            }).catch(err=>{
                reject(err);
            });
        });
    }
    // update(publication:Account,objWhere:any){
    //     return new Promise((resolve,reject)=>{
    //         this.db.update('accounts',publication,objWhere);
    //         resolve(true);
    //     });
    // }
    // selectAll(){
    //     return new Promise<any>((resolve,reject)=>{
    //         this.db.select('accounts').then(resp=>{
    //             console.log('********************* SELECT ALL *****************');
    //             console.log(resp);
    //             resolve(resp.rows);
    //         }).catch(err=>{
    //             reject(err);
    //         });
    //     });
    // }

    // getBy(objWhere:any){
    //     return new Promise((resolve,reject)=>{
    //         this.db.select('accounts',objWhere).then(resp=>{
    //             if(resp.rowCount){
    //                 resolve(resp.rows[0]);
    //             } else {
    //                 resolve(null);
    //             }
    //         }).catch(err=>{
    //             reject(err);
    //         });
    //     });
    // }
  
}