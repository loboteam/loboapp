const localGet = (name: string)=>new Promise((yes,no)=>{
    const a = localStorage.getItem(name);
    if (a === null) return no(`"${name}" does not exist in localStorage.`);
    return yes(a);
});

const localSet = (name: string, value: any)=>new Promise((yes,no)=>{
    if ((value === null || value === undefined) && localStorage.getItem(name)) return no(`Cannot set existing localStorage["${name}"] as ${value}. If you intend to do so, remove the item instead.`)
    localStorage.setItem(name, value);
    return yes(true);
});

const localRemove = (name: string)=>new Promise((yes)=>{
    localStorage.removeItem(name);
    return yes(true);
});

const localClear = ()=>new Promise((yes)=>{
    localStorage.clear();
    return yes(true);
});

const sha512 = (str: any) => crypto.subtle.digest("SHA-512", new TextEncoder().encode(`${str}`)).then(buf =>
    Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')
);

export interface LoginRequest {
    id: string | number,
    pwdHash: string
};

export { localGet, localSet, localRemove, localClear, sha512 };