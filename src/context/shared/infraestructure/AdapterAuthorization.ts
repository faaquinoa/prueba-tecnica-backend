export class AdapterAuthorization {
    public static validate(auth: string): void {
        let spliAuth: Array<string> = auth.split(' ');
        if (spliAuth.length !== 2) {
            throw new Error('Autorización inválida');
        }

        let token: string = spliAuth[1];

        let splitToken: Array<string> = token.split('_');
        if (splitToken.length !== 3) {
            throw new Error('Autorización inválida');
        }

        let pk: string = splitToken[0];
        let test: string = splitToken[1];
        let key: string = splitToken[2];

        if (pk !== 'pk') {
            throw new Error('Autorización inválida');
        }

        if (test !== 'test') {
            throw new Error('Autorización inválida');
        }

        let validateKey: RegExp = /^([a-zA-Z]){16}$/g;
        if (!validateKey.test(key)) {
            throw new Error('Autorización inválida');
        }

        if (key !== 'LsRBKejzCOEEWOsw') {
            throw new Error('Autorización inválida');
        }

    }
}