export default function TextInput({ children }) {
    return (
        <form>
            <div className="relative h-12 w-3xs mb-2 group justify-self-center">
                <div className="absolute inset-0 
                bg-bg mix-blend-exclusion 
                rounded-2xl pointer-events-none"></div>

            <input 
                type="text" 
                className="
                    relative z-10 w-full h-full p-2 
                    bg-transparent outline-none
                    text-center font-body text-white
                    rounded-2xl border-2 border-border border-dashed  
                "/>
            </div>
        </form>
    )
}