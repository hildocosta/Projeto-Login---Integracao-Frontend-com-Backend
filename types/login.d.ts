declare namespace Login {

    //UserService
    type User = {
        id?: number;
        name: string;
        rg: string;
        email: string;
        password: string;

        [key: string]: any; // Assinatura de índice para permitir outras chaves além de id, name, rg, email e password
        
    };






}