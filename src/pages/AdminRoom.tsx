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
import { useRoom } from '../hooks/useRoom'




type RoomParams = {
    id: string;
}



export function AdminRoom(){
    const {user} =  useAuth()
    const params = useParams<RoomParams>();
    const RoomID = params.id;
    const {title, questions} = useRoom(RoomID)
    const [newQuestion, setNewQuestion] =  useState('');

    

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
                    <div>
                        <RoomCode code={RoomID} />
                        <Button isOutlined >Encerra Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
                </div>

               
                

                <div className='question-list'> 
                    {questions.map(question => {
                        console.log(question.author.user)
                        return(
                            <Question 
                            key={question.id} //algoritmo de recociliação
                            content={question.content}
                            author={question.author}
                            
                            />
                        );
                    })}

                </div>



            </main>
        </div>
    )
}