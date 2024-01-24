interface Props {
    text: string
}

export const MyMessage = ({text} : Props) => {
  return (
    <div className="col-start-6 col-end-13 p-3 rounded-lg">
        <div className="flex flex-row items-start">
            <div className="relative mr-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
                {text}
            </div>
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 flex-shrink-0">
                D
            </div>
        </div>
    </div>
  )
}
