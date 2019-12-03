import * as request from "request-promise-native";



export async function sendApiRequest(i){
    return await request.get(`http://localhost:3322/item/${i}`, {
        headers:{
            "x-key":"123"
        }
    });
}