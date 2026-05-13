export function Modal({ children }) {
    return (
        <>
            <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className="
                    absolute inset-0
                    flex flex-col items-center justify-center
                    z-50
                "
            >
                    {children}
            </div>
        </>
    )
}