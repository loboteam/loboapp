'use client';
import { localClear } from "@/lib/promisd";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export interface User {
    id: number,
    name: string,
    token: string,
    staff: boolean,
    admin: boolean
};

type UserContextContainer = {
    user?: User,
    setUser: Dispatch<SetStateAction<User | undefined>>,
    logOut: () => Promise<void>
};

export const userJwt = () => {
    const s = localStorage.getItem("token");
    if (!s) return undefined;
    const dec = jwt.decode(s, { json: true });
    if (!dec) return undefined;
    try {
        let h = dec as User;
        h.token = s;
        return h;
    } catch (e) {
        console.error(`invalid token payload! got ${e}`);
        return undefined;
    }
};

const UserContext_Bare = createContext<UserContextContainer | null>(null);

export const useUser = () => {
    const ctx = useContext(UserContext_Bare);
    if (!ctx) throw new Error("can't get user context outside user context");
    return ctx;
};

const UserContext: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const localUsr = userJwt();
        if (localUsr?.token) {
            // Verificación Activa
            fetch("/verify", {
                headers: { "Authorization": "Bearer " + localUsr.token }
            }).then(r => {
                if (r.status === 401) {
                    console.warn("JWT expired or invalid! Logging out...");
                    localClear().then(() => setUser(undefined));
                } else {
                    setUser(localUsr);
                }
            }).catch(e => {
                // Fallback (ej. sin internet)
                setUser(localUsr);
            });
        } else {
            setUser(localUsr);
        }
    }, []);

    const logOut = ()=>localClear().then(()=>setUser(undefined));

    return <UserContext_Bare.Provider value={{user, setUser, logOut}}>{children}</UserContext_Bare.Provider>
};

export const IfAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user?.admin && children;
};
export const IfNotAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && !(user?.admin) && children;
};
export const IfStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user?.staff && children;
};
export const IfNotStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && !(user?.staff) && children;
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