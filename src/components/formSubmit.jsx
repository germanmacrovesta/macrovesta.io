

export default function FormSubmit(props) {

    return (
        <>
            <div className="flex flex-col items-center w-full">
                {props.submitted != undefined && props.submitted == true && (
                    <div className="w-[600px] grid place-content-center">
                        <div >
                            Submitted Successfully!
                        </div>
                    </div>
                )}
                {props.submitting != undefined && props.submitting == true && props.submitted != undefined && props.submitted != true && (
                    <div className="w-[600px] grid place-content-center">
                        <div>
                            Submitting Form
                        </div>
                    </div>
                )}
                {!props.submitted && !props.submitting && (
                    <button className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl" type="submit">
                        <div>
                            {props.warningSubmit != undefined && props.warningSubmit == true ? 'Confirm' : 'Submit'}
                        </div>
                    </button>
                )}
                {props.warningMessage && props.warningMessage != "" && (
                    <div className="bg-emerald text-black rounded-lg p-4 mt-2 text-center w-[600px]">
                        <b>Suggestions</b><br />
                        {props.warningMessage}
                    </div>
                )}
                {props.errorMessage && props.errorMessage != "" && (
                    <div className="bg-accent text-black rounded-lg p-4 mt-2 text-center w-[600px]">
                        <b>Errors</b><br />
                        {props.errorMessage}
                    </div>
                )}

            </div>
        </>
    )
}