export class User{
    public id: string;
    public name: string;
    public group: string;
    constructor(id:string){
        this.id = id;
        this.name = 'sin-nombre';
        this.group = 'sin-group';
    }
}