import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {createContext, useState, useEffect, ReactNode} from 'react'
import { auth } from '../services/firebase_config';

type User = {
    id: string;
    name: string;
    avatar: string;
  }

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext =  createContext({} as AuthContextType);

export function AuthContextProvider( props: AuthContextProviderProps ){
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if(user){
            const {displayName, photoURL, uid} =  user;
              
            if(!displayName || !photoURL){
              throw new Error('Falta algumas informações da Conta Google. ')
            }
              
            setUser({
              id: uid,
              name: displayName,
              avatar:photoURL
            })
          } 
        })
    
        return () => {
          unsubscribe();
        }
    },[] )
    
    const [user, setUser] = useState<User>();
      
      
    async function signInWithGoogle(){
        const provider = new GoogleAuthProvider();
        const auth   = getAuth();
        const results =  await signInWithPopup(auth,provider); 
          
        if(results.user){
          const {displayName, photoURL, uid} =  results.user;
            if(!displayName || !photoURL){
                throw new Error('Falta algumas informações da Conta Google. ')
            }
            
            setUser({
                id: uid,
                name: displayName,
                avatar:photoURL
            })
        }
    }
        
    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
           {props.children}
        </AuthContext.Provider>
    );
}