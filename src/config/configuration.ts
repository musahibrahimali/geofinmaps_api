import { config } from "dotenv";
// configure dotenv
config();


export default () => ({
    port: process.env.PORT || 5000,
    domain: process.env.DOMAIN,
    database: {
        host: process.env.DB_URL,
    },    
});