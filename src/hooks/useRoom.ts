import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase_config";


type FirebaseQuestions = Record<string, {
    author:{
        user: string;
        avatar: string;
    }
    
    content:string;
    isAnswered: boolean;
    isHighlighted: boolean;

}>

type QuestionType ={
    id:string;
    author:{
        user: string;
        avatar: string;
    }    
    content:string;
    isAnswered: boolean;
    isHighlighted: boolean;

}


export function useRoom(roomID:string){
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] =  useState('')
    

    useEffect(() => {
        const roomRef =  ref(database, `rooms/${roomID}`);       
        onValue(roomRef,(room) => {
            const databaseRoom =  room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; 
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value])=>{
                return{
                  id: key,
                  content:value.content,
                  author: value.author,
                  isAnswered: value.isAnswered,
                  isHighlighted: value.isHighlighted,  
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        
    }, [roomID])
    
    

    return{questions,title}
}