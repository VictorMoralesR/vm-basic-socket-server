import { User } from "../classes/user";


export default class UserList{

    private userList:User[] = [];
    constructor(){
        
    }
    // agregar usuario
    public add(user:User){
        this.userList.push(user);
        console.log('user list: ',this.userList);
        
        return user;
    }

    public updateName(id:string,name:string){
        for(let user of this.userList){
            if(user.id === id){
                user.name = name;
            }
        }
        console.log('*** Updating user', this.userList);
        
    }

    public getUserList(){
        return this.userList;
    }

    public getUser(id: string){
        return this.userList.find(user => user.id === id );
    }

    public getUsersGroup(group:string){
        return this.userList.filter(user=> user.group === group);
    }

    public deleteUser(id:string){
        const tempUser = this.getUser(id);
        this.userList = this.userList.filter(user => user.id !== id );
        return tempUser;
    }
}