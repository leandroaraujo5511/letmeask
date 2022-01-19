import { ReactNode } from 'react'
import '../styles/question.scss'


type QuestionProps = {
    content: string;
    author:{
        avatar:string;
        user:string;
    };
    children?: ReactNode;

}


export function Question({
    content,
    author,
    children
}: QuestionProps){
    return(
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.user} />
                    <span>{author.user}</span>
                    
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}