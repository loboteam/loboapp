'use client';
import { localClear, localGet } from "@/lib/promisd";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export interface User {
    id?: number,
    name: string,
    token: string,
    admin: boolean
};

type UserContextContainer = {
    user?: User,
    setUser: Dispatch<SetStateAction<User | undefined>>,
    logOut: () => Promise<void>,
    logInCheck: () => Promise<UserContextContainer | null>
};

const UserContext_Bare = createContext<UserContextContainer | null>(null);

const UserContext: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    const logOut = ()=>localClear().then(()=>setUser(undefined));

    const logInCheck = () => localGet("token").then(() => useUser()).catch(() => null);

    return <UserContext_Bare.Provider value={{user, setUser, logOut, logInCheck}}>{children}</UserContext_Bare.Provider>
};

export const useUser = () => {
    const ctx = useContext(UserContext_Bare);
    if (!ctx) throw new Error("can't get user context outside user context");
    return ctx;
};

export const IfAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user?.admin && children;
};
export const IfNotAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && !(user?.admin) && children;
};
export const IfLogged: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && children;
};
export const IfNotLogged: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return !user && children;
};
export const LogoutButton: React.FC<{ children: React.ReactNode, classes: string[] }> = ({ children, classes }) => {
    const { logOut } = useUser();
    return <IfLogged><button onClick={logOut} className={classes?.join(" ")}>{children}</button></IfLogged>;
};

export default UserContext;