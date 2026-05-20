export function InfoPlate({ 
    children, 
    className = "",
}: { 
    children: React.ReactNode, 
    className?: string,
}) {

    return (
        <section className="relative w-full">
            <div className={`
                relative w-full flex justify-center self-center
                border-2 border-border border-dashed rounded-2xl
                ${className}
            `}>
                
                {/* Background with blend mode */}
                <div className="
                    absolute inset-0 pointer-events-none
                    bg-bg mix-blend-exclusion rounded-2xl" />

                {/* Content */}
                <div className="
                    relative z-10 w-full h-full  p-4
                    flex items-center justify-between
                    font-h text-white
                ">
                    {children}
                </div>
            </div>
        </section>
    )
}