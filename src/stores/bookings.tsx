"use client";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export interface BookingContainer {
    done: boolean,
    cancelled: boolean,
    day: string,
    from: number,
    to: number,
    sala: string,
    sala_data: {
        location: string,
        type: string,
        number: number,
        status: boolean,
        cupo: number
    }
};
export interface BookingContextContainer {
    bookings: BookingContainer[],
    setBookings: Dispatch<SetStateAction<BookingContainer[]>>
    filteredBookings: BookingContainer[],
    what: Dispatch<SetStateAction<BookingContainer[]>>
};

export const BookingsContext_Bare = createContext<BookingContextContainer | null>(null);
const BookingsContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<BookingContainer[]>([]);
    const [filteredBookings, what] = useState<BookingContainer[]>([]);
    return <BookingsContext_Bare.Provider value={{bookings, setBookings, filteredBookings, what}}>{children}</BookingsContext_Bare.Provider>
};
export const useBookings = () => {
    const ctx = useContext(BookingsContext_Bare);
    if (!ctx) throw new Error("useBookings must be used within BookingsContext or equivalent!");
    return ctx;
};

export default BookingsContext;