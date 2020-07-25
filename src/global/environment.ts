export const SERVER_PORT: number = Number(process.env.PORT) || 5000;
export const DATABASE:any = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "",
    DB: "sandbox",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
export const DB_CONNECTION_STRING:any = "postgresql://postgres@localhost:5432/sandbox";