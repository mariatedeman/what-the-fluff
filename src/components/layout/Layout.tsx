import type { LayoutProps } from "../../models/Types";

export function Layout({ children }: LayoutProps) {
    return (
       <main className="
            flex flex-col
            mx-auto m-8 
            max-w-[90vw] sm:max-w-screen-sm
        ">
            { children }
       </main>
    )
}