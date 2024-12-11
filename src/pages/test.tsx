import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context"

const Test = () => {
    const { auth } = useContext(AuthContext); 
    console.log("auth",auth);
    return <div>test</div>;
}

export default Test