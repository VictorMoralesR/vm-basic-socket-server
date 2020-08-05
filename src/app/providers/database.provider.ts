import { Pool } from 'pg';
import { DB_CONNECTION_STRING } from '../../global/environment';

export default class DatabaseProvider{
    private static _instance: DatabaseProvider;
    private pool: Pool;

    constructor(){
        this.pool = new Pool({
            connectionString: DB_CONNECTION_STRING,
        });
    }

    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    public insert(table:string,model:any){
        return new Promise<any>((resolve, reject)=>{
            const objInsert = this.getInsertObject(table,model);
            this.pool.query(objInsert.query, objInsert.params, (err, res) => {
                // console.log('INSERT: ', err, res);
                // this.pool.end();
                if(res){
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    public update(table:string,model:any,whereFields:{}){
        return new Promise((resolve, reject)=>{
            const objUpdate = this.getUpdateObject(table,model,whereFields);
            console.log(objUpdate);
            
            this.pool.query(objUpdate.query, objUpdate.params, (err, res) => {
                console.log('UPDATE: ', err, res);
                // this.pool.end();
                if(res){
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    public select(table:string,whereFields?:{}){
        return new Promise<any>((resolve, reject)=>{
            const objSelect = this.getSelectObject(table,whereFields);
            console.log('************ SELECT +++++++++++',objSelect);
            this.pool.query(objSelect.query, objSelect.params, (err, res) => {
                console.log('SELECT: ', err, res);
                // this.pool.end();
                if(res){
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    private getSelectObject(table:any,whereFields:any = {}){
        let strWhere = '';
        let count = 1;
        const arrParams = [];
        for(let field in whereFields){
            // const formatedField = (typeof field === 'number') ? field : `'${field}'`;
            strWhere += strWhere ? ` AND ${field} = $${count}`: `WHERE ${field} = $${count}`;
            arrParams.push(whereFields[field]);
            count++;
        }
        return {
            query: `SELECT * FROM ${table} ${strWhere}`,
            params: arrParams
        };
    }

    private getInsertObject(table:any,model:any){
        let strColumns = '';
        let strParams = '';
        let count = 1;
        const arrParams = [];
        for(let field in model){
            strColumns += strColumns ? `,${field}` : field;
            strParams += strParams ? `,$${count}`: `$${count}`;
            arrParams.push(model[field]);
            count++;
        }
        return {
            query: `INSERT INTO ${table} (${strColumns}) VALUES (${strParams}) RETURNING *`,
            params: arrParams
        };
    }
    private getUpdateObject(table:any,model:any, whereFields:any){
        let strWhere = '';
        let strColumns = '';
        let count = 1;
        const arrParams = [];
        for(let field in model){
            strColumns += strColumns ? `,${field} = $${count}` : `${field} = $${count}`;
            arrParams.push(model[field]);
            count++;
        }
        for(let field in whereFields){
            // const formatedField = (typeof field === 'number') ? field : `'${field}'`;
            strWhere += strWhere ? `AND ${field} = $${count}`: `WHERE ${field} = $${count}`;
            arrParams.push(whereFields[field]);
            count++;
        }
        return {
            query: `UPDATE ${table} SET ${strColumns} ${strWhere}`,
            params: arrParams
        };
    }

    // authenticate(){
    //     return new Promise((resolve,reject)=>{
    //         this.sequelize.authenticate().then( resp => {
    //             console.log('Connection has been established successfully.',resp);
    //         }).catch(err => {
    //             console.log('Error Connection.',err);
    //         });
    //     });
    // }

    // sync(){
    //     return new Promise((resolve,reject)=>{
    //         const publication = this.sequelize.define('publications', { 
    //             id: DataTypes.INTEGER,
    //             idGroup: DataTypes.INTEGER,
    //             title: DataTypes.STRING, 
    //             subtitle: DataTypes.STRING,
    //             content: DataTypes.TEXT
    //         });
    //         this.sequelize.sync({ force: true }).then(() => {
    //             console.log(`Database & tables created!`);
    //             publication.bulkCreate([
    //             { id:1, idGroup:1, title: 'First title', subtitle: 'Subtitle publication', content:'contents <b>strong text</b>' },
    //             { id:2, idGroup:1, title: 'Second title', subtitle: 'Subtitle publication', content:'contents <b>strong text</b>' },
    //             { id:3, idGroup:1, title: 'Third title', subtitle: 'Subtitle publication', content:'contents <b>strong text</b>' },
    //             ]).then(function() {
    //                 return publication.findAll();
    //             }).then(function(publication) {
    //                 console.log(publication);
    //                 resolve(true);
    //             }).catch(err => {
    //                 reject(err);
    //             });
    //         });
    //     });
    // }

}