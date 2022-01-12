import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import {FormEvent, useState} from 'react'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth';
import { database, firebase } from '../services/firebase_config';
import {ref, set, getDatabase,push } from 'firebase/database'

export function NewRoom() {
    const {user} = useAuth()
    const [newRoom, setNewRoom] =  useState('');
    const history =  useHistory();
    
    async function handleCreateRoom(event:FormEvent) {
        event.preventDefault();
        if(newRoom.trim() == ''){
            return;
        }

        const roomRef =  ref(database,'rooms');


        const firebaseRoom = await push(roomRef,{
            title: newRoom,
            authorId: user?.id 
        }) 



        

        history.push(`/rooms/${firebaseRoom.key}`)


    }

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="LetMeAsk"  />
                    <h2>Criar uma nova sala</h2>
                    <form  onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder='Nome da sala'
                            onChange={event => setNewRoom(event.target.value) }
                            value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala já existente ? <Link to='/'>Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}