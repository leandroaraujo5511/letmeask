import {useHistory} from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoGoogleImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase_config';
import {ref, onValue, getDatabase, child,get} from 'firebase/database'

export function Home() {
    const history =  useHistory() 
    const {user, signInWithGoogle} = useAuth()
    const [codeRoom, setCodeRoom] = useState('');
    async function handleCreateRoom(){    
      if(!user){
        await signInWithGoogle()
      }
        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(codeRoom.trim() == ''){
            return;
        }

        const roomRef =  await ref(database,`/rooms/${codeRoom}`)

        const teste  = await get(roomRef)
        

        if(!teste.exists()){
            alert('Room does not exists!');
            return;
        }       
        
        history.push(`/rooms/${codeRoom}`)

       

        
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
                    <button className='create-room' onClick={handleCreateRoom}>
                        <img src={logoGoogleImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separation'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            
                            placeholder='Digite o código da sala'
                            onChange={event => setCodeRoom(event.target.value)}
                            value={codeRoom}
                        />
                        <Button  type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}