
import copyImg from '../assets/images/copy.svg'
import '../styles/roomCode.scss'
import toast,{Toaster} from 'react-hot-toast'


type RoomCodeProps = {
    code: string;
}




export function RoomCode(props: RoomCodeProps){


    function copyRoomCodeClipboard(){
        toast.success('Copiado com Sucesso');       
        navigator.clipboard.writeText(props.code)       
    }


    return(
        <button className="room-code" onClick={copyRoomCodeClipboard}>
            <div>
                <img src={copyImg} alt="Copiar Codigo" />
            
                
            </div>
            <span>Sala #{props.code}</span>
            <div>
            </div>
        </button>
    );
}