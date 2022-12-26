const URI: string = process.env?.SECURE_TOKEN_URI || '';
const DATABASE: string = process.env?.SECURE_TOKEN_DATABASE || '';
const SCHEMA: string = process.env?.SECURE_TOKEN_SCHEMA || '';
const ENTITY: string = process.env?.SECURE_TOKEN_ENTITY || '';

export const AdapterConfigure = {
    URI,
    DATABASE,
    SCHEMA,
    ENTITY
};