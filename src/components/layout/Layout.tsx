import type { LayoutProps } from "../../models/Types";

export function Layout({ children }: LayoutProps) {
    return (
       <main className="
            flex flex-col justify-center
            mx-auto my-8
            min-h-[70vh]
            max-w-[90vw] sm:max-w-screen-sm
        ">
            { children }
       </main>
    )
}