"use client";
import { ENDPOINTS } from "@/lib/constants";
import { SpaceParams, useSpace } from "@/stores/space";
import { useEffect, useState } from "react";
import Space from "@/components/min/space";
import { Button } from "../min/legacygeneric";

const SpaceCollection: React.FC = () => {
    const { spaces, setSpaces } = useSpace();
    const [page, setPage] = useState(1);
    const [loadable, setLoadable] = useState(false);
    useEffect(() => { fetch(ENDPOINTS.getSpaces).then(r => r.json()).then((sps: SpaceParams[] | null)=>{
        if (sps && sps.length > 4) setLoadable(true);
        setSpaces(sps);
    }) }, []);
    if (!spaces) return null;
    const renderGalaxy = ()=>spaces.map((space, i) => <Space space={space} key={i} />);
    const loadMore = () => {
        setPage(prev=>prev + 1);
        fetch(ENDPOINTS.getSpaces + "/?page=" + page).then(r => r.json()).then((s: SpaceParams[] | null) =>{
            if (!s || s.length < 4) return setLoadable(false);
            setSpaces(() => spaces.concat(s));
        });
    };
    return loadable ? renderGalaxy().concat(<Button onClick={loadMore} key={999999}>Cargar más...</Button>) : renderGalaxy();
};

export default SpaceCollection;