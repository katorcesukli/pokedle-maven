import { BASE_API_URL } from "../constant";


export async function wakeBackend(){
    try {
        await fetch(`${BASE_API_URL}/daily-info`, {
            method: "GET"
        });
        console.log("Backend awake");
    } catch(error){
        console.log("Backend waking...");
    }
}