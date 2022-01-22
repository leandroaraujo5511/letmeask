import { FormEvent,  useState } from 'react'
import { useHistory, useParams} from 'react-router-dom'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import  '../styles/room.scss'
import { database } from '../services/firebase_config'
import {  push, ref, remove, update } from 'firebase/database'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'




type RoomParams = {
    id: string;
}



export function AdminRoom(){
    const history = useHistory()
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


    async function handleEndRoom() {
        if(window.confirm('Tem certeza que deseja excluir a Sala?')){
            const endRoom = await ref(database, `rooms/${RoomID}`)
            update(endRoom,{
                endedAt: new Date()
            });
        }

        history.push('/')
       
    }

    async function handleDeleteQuestion(questionId:string) {
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
            const deleteQuestion = await ref(database, `rooms/${RoomID}/questions/${questionId}`)
            remove(deleteQuestion);
        }
    }

    async function handleCheckQuestionAsAnswered(questionId:string){
        const AsAnswered = await ref(database, `rooms/${RoomID}/questions/${questionId}`)
        update(AsAnswered, {
            isAnswered: true
        });
    }
    async function handleHighlinghtQuestion(questionId:string){
        const Highlinght = await ref(database, `rooms/${RoomID}/questions/${questionId}`)
        update(Highlinght, {
            isHighlighted: true
        });
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <div>
                        <RoomCode code={RoomID} />
                        <Button isOutlined onClick={handleEndRoom} >Encerra Sala</Button>
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
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}

                            
                            >
                               {!question.isAnswered && (
                                   <>
                                        <button
                                            type='button'
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>

                                        <button
                                            type='button'
                                            onClick={() => handleHighlinghtQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dá destaque a pergunta" />
                                        </button>
                                   </>
                               )}
                                
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Deletar Pergunta" />
                                </button>

                            </Question>
                        );
                    })}

                </div>



            </main>
        </div>
    )
}