export interface RepositoryGeneric {
    connection(): Promise<any>;
    session(client: any): Promise<any>;
    startTransaction(session: any): Promise<void>;
    commitTransaction(session: any): Promise<void>;
    rollbackTransaction(session: any): Promise<void>;
    closeSession(session: any): Promise<void>;
    closeConnection(client: any): Promise<void>;
};