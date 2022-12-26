import { ClientSession, MongoClient } from "mongodb";
import { RepositoryGeneric } from "../domain/RepositoryGeneric";
import { AdapterMongoDB } from "./AdapterMongoDB";

export abstract class RepositoryImplMongo implements RepositoryGeneric {
    protected uri: string;

    constructor(_uri: string) {
        this.uri = _uri;
    }

    //#region Methods Database

    async connection(): Promise<MongoClient> {
        let client: MongoClient = await AdapterMongoDB.connection(this.uri);
        return client;
    }

    async session(client: MongoClient): Promise<any> {
        let session: ClientSession = await AdapterMongoDB.openSession(client);
        return session;
    }

    async startTransaction(session: ClientSession): Promise<void> {
        await AdapterMongoDB.openTransaction(session);
    }

    async commitTransaction(session: ClientSession): Promise<void> {
        await AdapterMongoDB.commitTransaction(session);
    }

    async rollbackTransaction(session: ClientSession): Promise<void> {
        await AdapterMongoDB.rollbackTransaction(session);
    }

    async closeSession(session: ClientSession): Promise<void> {
        await AdapterMongoDB.closeSession(session);
    }

    async closeConnection(client: MongoClient): Promise<void> {
        await AdapterMongoDB.closeConnection(client);
    }

    //#endregion

}