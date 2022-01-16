import { FormEvent, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import toast,{Toaster} from 'react-hot-toast'
import  '../styles/room.scss'
import { database } from '../services/firebase_config'
import { onValue, push, ref } from 'firebase/database'
import { Question } from '../components/Question'

type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author:{
        name: string;
        avatar: string;
    }
    
    content:string;
    isAnswered: boolean;
    isHighlighted: boolean;

}>

type Question ={
    id:string;
    author:{
        name: string;
        avatar: string;
    }    
    content:string;
    isAnswered: boolean;
    isHighlighted: boolean;

}


export function Room(){
    const {user} =  useAuth()
    const params = useParams<RoomParams>();
    const RoomID = params.id;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] =  useState('')
    const [newQuestion, setNewQuestion] =  useState('');

    useEffect(() => {
        const roomRef =  ref(database, `rooms/${RoomID}`);       
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

        
    }, [RoomID])

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();
        if(newQuestion.trim() == ''){
            return;
        }
        if(!user){
            throw new Error(toast.error('Você deve esta logado.'))
        }

        const question =  {
            content: newQuestion,
            author:{
                user: user.name,
                avatar: user.avatar
            },
            isHighlighted:false,
            isAnswered:false
        };

        const RefQuestion = await ref(database,`rooms/${RoomID}/questions`);
        await push(RefQuestion,question);
        toast.success("Pergunta criada com sucesso.")
        setNewQuestion('');
    }


    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <RoomCode code={RoomID} />
                </div>
            </header>
            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>

                    <textarea 
                        placeholder='O que você quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    
                    <div className='form-footer'>
                        {user? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>

                            </div>
                        ): (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>

                    </div>
                </form>
                

                {questions.map(question => {
                    console.log(question.author.name)
                    return(
                        <Question 
                            content={question.content}
                            author={question.author}
                        
                        />
                    )
                })}
                                


            </main>
        </div>
    )
}