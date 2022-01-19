import '../styles/question.scss'


type QuestionProps = {
    content: string;
    author:{
        avatar:string;
        user:string;
    }
}


export function Question({
    content,
    author
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

                </div>
            </footer>
        </div>
    )
}