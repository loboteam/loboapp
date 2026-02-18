"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export type LinkType = "pagenav" | "sectionnav" | "outnav" | "bigaction" | "smallaction";

export const isActive = (path: string) => usePathname() === path;

export interface ALinkParams {
    to: string,
    icon?: React.ReactNode,
    children: React.ReactNode,
    activeClass?: string,
    type?: LinkType | LinkType[],
    classes?: string | string[]
}

const ALink: React.FC<ALinkParams> = ({ to, icon, children, type, activeClass, classes }: ALinkParams) =>
    <Link href={to} className={`r-link-active:text-slate-500 r-link-active:italic r-link-active:pointer-events-none${(classes ?? type ?? false) ? " " : ""}${Array.isArray(classes) ? classes.join(" ") : (classes ?? false) ? classes : Array.isArray(type) ? type.join(" ") : (type ?? false) ? type : ""}${(classes ?? type ?? isActive(to)) ? " " : ""}${isActive(to) ? (activeClass ?? 'r-link-active') : ''}`}>
        {(icon ?? false) ? icon : ''}
        <span>{children}</span>
    </Link>;

export const Breadcrumbs: React.FC = () => {
    const location = usePathname();
    const pathnames = location.split('/').filter(Boolean);

    return <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 fade-in">
        <ALink to="/" classes={["hover:text-teal-400", "transition-colors"]}>Inicio</ALink>
        {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return <Fragment key={to}>
                <span className="text-slate-700">/</span>
                {isLast ? (
                    <span className="text-teal-400">{value.replace('-', ' ')}</span>
                ) : (
                    <ALink to={to} classes={["hover:text-teal-400", "transition-colors"]}>
                        {value.replace('-', ' ')}
                    </ALink>
                )}
            </Fragment>;
        })}
    </nav>;
};

export default ALink;