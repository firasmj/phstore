import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData1, setUserData1] = useState({
        id: null,
        username: '',
        email: '',
        password: '',
        registered: ''
    });
    

    return (
        <UserContext.Provider value={{ userData1, setUserData1 }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;