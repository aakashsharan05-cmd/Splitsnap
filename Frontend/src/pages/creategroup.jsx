import React from 'react'

const creategroup = () => {
  return (
    <div>
      <div className="min-h-screen bg-[#F8F4EA] px-5 py-5 text-[#211F1B]">
         <div className="max-w-xl mx-auto">

         
                    {/* Header */}

                     <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-11 h-11 rounded-xl bg-[#F1EBDD] text-2xl"
                        >
                            ‹
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                               Create Group
                            </h1>

                            <p className="text-sm text-[#756F65] mt-1">
                               Start sharing expenses together
                            </p>
                        </div>
                    </div>


                    {/* groupname */}
                    <div className='rounded-2xl w-full h-25 bg-white mt-5 flex  justify-center'>

                        <p className='flex items-start'>Give group a name</p>

                    </div>
        
        </div>
      </div>
    </div>
  )
}

export default creategroup
