"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

export function useMouseTilt<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);

    const onMouseMove = (e: React.MouseEvent<T>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        el.style.transition = "transform 0.1s ease-out";
    };

    const onMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = "";
        el.style.transition = "transform 0.4s ease-out";
    };

    return { ref, onMouseMove, onMouseLeave };
}
