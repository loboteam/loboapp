"use client";
import { useUser } from "@/stores/user";

export const FirstName: React.FC = () => {
    const { user } = useUser();
    return user && user.name.split(' ')[0];
};