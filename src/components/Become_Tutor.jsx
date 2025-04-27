import becomeInstructorImage from '../assets/Home-page-images/Become an Instructor.png'
const BecomeInstructor = () => {
    return(
        <div className=" bg-gray-100 h-[500px] flex justify-center items-center gap-5">
            <div className=' flex items-center'>
                <div  className='absolute p-3 flex flex-col'>
                    <h1 className=' text-gray-300 mt-4 mb-4 text-3xl font-semibold'>Become An Instructor</h1>
                    <p className='text-gray-200 mb-6 font-semibold'>Instructors from around the world teach millions <br/> of students on Udemy. We provide the tools <br/> and skills to teach what you love.</p>
                    <button className='text-[#FF6636] rounded-md bg-gray-100 mb-4 p-2 w-36 text-1xl font-semibold'>Start Teaching</button>
                </div>
                <div>
                    <img src={becomeInstructorImage} alt="" className='w-[] h-[230px]'/>
                </div>
            </div>
            <div className='bg-white h-[230px] w-[560px] flex flex-col p-5'>
                <h1 className=' text-3xl font-semibold pb-3 mb-3'>Your teaching & earning steps</h1>
                <table className='flex flex-col gap-8'>
                    <tr className='flex'>
                        <td className='flex gap-2 items-center w-[300px]'>
                            <p className=' w-10 h-10 flex justify-center items-center text-xl font-semibold rounded-full text-blue-600 bg-blue-100'>1</p>
                            <p className=' font-semibold '>Apply to become instructor</p>
                        </td>
                        <td className='flex gap-2 items-center w-[300px]'>
                            <p className=' w-10 h-10 flex justify-center items-center text-xl font-semibold rounded-full bg-pink-100 text-pink-600'>2</p>
                            <p className=' font-semibold'>Build & edit your profile</p>
                        </td>
                    </tr>
                    <tr className='flex '>    
                        <td className='flex gap-2 items-center w-[300px]'>
                            <p className=' w-10 h-10 flex justify-center items-center text-xl font-semibold rounded-full text-red-600 bg-red-100'>3</p>
                            <p className=' font-semibold'>Create your new course</p>
                        </td>
                        <td className='flex gap-2 items-center w-[300px]'>
                            <p className=' w-10 h-10 flex justify-center items-center text-xl font-semibold rounded-full text-green-600 bg-green-100'>4</p>
                            <p className=' font-semibold'>Start teaching & earning</p>
                        </td>
                    </tr>
                </table>
                
            </div>
        </div>
    )
}
export default BecomeInstructor;