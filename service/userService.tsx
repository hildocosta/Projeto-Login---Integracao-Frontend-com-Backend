import axios from "axios";

export const axiosInstance  = axios.create({

    baseURL: "http://localhost:8080"
})

export class UserService{


    inserir(user : Login.User){
        return axiosInstance.post("/users", user);
    }
    

    listarTodos(){
        return axiosInstance.get("/users");
    }

    // Método para atualizar um usuário
    atualizar(user : Login.User) {
        return axiosInstance.put(`/users/${user.id}`, user);
    }

    excluir(id : number){
        return axiosInstance.delete("/users/" + id);
    }


    
}