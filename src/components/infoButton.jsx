import Button from './button'

export default function InfoButton({ text }) {
    return (
        <>
            <Button className='z-40 absolute top-2 right-2 remove-me group' >
                <img className=' w-[15px] h-[15px] self-center opacity-100 group-hover:hidden' width="15" height="15" src={"/i_G_SQ.png"}></img>
                <img className=' w-[15px] h-[15px] self-center opacity-100 hidden group-hover:block' width="15" height="15" src={"/i.png"}></img>
                <div className="z-50 pointer-events-none absolute flex flex-col justify-end left-1/2 w-[300px] h-[600px] -translate-x-full -translate-y-[615px] invisible group-hover:visible origin-bottom-right scale-0 group-hover:scale-100 transition-all duration-300 ">
                    <div className="shadow-center-2xl flex flex-col items-center px-4 pt-2 pb-4 rounded-2xl bg-deep_blue text-white text-center text-xs">
                        <img className="opacity-70" width="30px" src="/i_White.png" />
                        <div className="mt-2">
                            {text}
                        </div>
                    </div>
                </div>
            </Button>
        </>
    )
}