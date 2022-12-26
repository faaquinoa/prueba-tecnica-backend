import { ClientSession, MongoClient, ObjectId, ReadConcern, ReadPreference, MongoError } from "mongodb";

export class AdapterMongoDB {

    public static async connection(uri: string, directConnection: boolean = false): Promise<MongoClient> {
        try {
            let client: MongoClient = await MongoClient.connect(uri, { directConnection });
            return client;
        } catch (error) {
            if (error instanceof MongoError) {
                if (error.message.indexOf('EADDRINUSE') !== -1) {
                    return await AdapterMongoDB.connection(uri, directConnection);
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
    }

    public static async closeConnection(client: MongoClient): Promise<void> {
        await client.close(true);
    }

    public static async openSession(client: MongoClient): Promise<ClientSession> {
        let session = client.startSession({ causalConsistency: true, defaultTransactionOptions: { readPreference: ReadPreference.primaryPreferred } });
        return session;
    }

    public static async closeSession(session: ClientSession): Promise<void> {
        try {
            await session.endSession();
        } catch (error) {
            console.error("Ocurrio un error cerrando una sessión: ", error);
        }
    }

    public static async openTransaction(session: ClientSession): Promise<void> {
        if (!session.inTransaction()) {
            session.startTransaction({ readConcern: { level: ReadConcern.SNAPSHOT }, writeConcern: { w: 'majority' } });
        }
    }

    public static async commitTransaction(session: ClientSession): Promise<void> {
        try {
            if (session.inTransaction()) {
                await session.commitTransaction();
            }
        }
        catch (error) {
            if (error instanceof MongoError) {
                if (error.errorLabels && error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0) {
                    await AdapterMongoDB.commitTransaction(session);
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
    }

    public static async rollbackTransaction(session: ClientSession): Promise<void> {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
    }

    public static validateDocument(obj: any): any {
        let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");


        let isIsoDate = (str: string) => {
            if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
            const d: any = new Date(str);
            return d instanceof Date && d.toISOString() === str; // valid date 
        }

        let keys: Array<string> = Object.keys(obj);

        for (let key of keys) {
            let keyProp: never = key as keyof object;
            if (obj[keyProp] !== null) {
                if (key.includes('_id')) {
                    if (typeof obj[key as keyof object] === 'string') {
                        obj[key] = checkForValidMongoDbID.test(obj[key as keyof object])
                            ? new ObjectId(obj[key as keyof object])
                            : obj[key as keyof object];
                    }
                }

                if (key === '$in' || key === '$nin') {
                    obj[key] = obj[key].map((row: any) => checkForValidMongoDbID.test(row) ? new ObjectId(row) : row);
                }

                if (typeof obj[key] === 'object') {
                    if (Array.isArray(obj[key])) {
                        for (let row of obj[key]) {
                            AdapterMongoDB.validateDocument(row);
                        }
                    } else if (obj[key] instanceof Date) {

                    } else {
                        AdapterMongoDB.validateDocument(obj[key]);
                    }
                } else if (typeof obj[key] === 'string') {
                    if (key.trim().toLocaleLowerCase().includes('date')) {
                        obj[key] = isIsoDate(obj[key]) ? new Date(obj[key]) : obj[key];
                    }

                    if (key.trim().toLocaleLowerCase().includes('gte')) {
                        obj[key] = isIsoDate(obj[key]) ? new Date(obj[key]) : obj[key];
                    }

                    if (key.trim().toLocaleLowerCase().includes('lte')) {
                        obj[key] = isIsoDate(obj[key]) ? new Date(obj[key]) : obj[key];
                    }
                }
            }
        }
        return obj;
    }

    public static decodeError(error: any) {
        if (!!error?.code) {
            switch (error.code) {
                case 11000:
                    error = new Error(`Existe duplicidad, favor de verificar la información`);
                    break;
                default:
                    break;
            }
        }
        return error;
    }

}