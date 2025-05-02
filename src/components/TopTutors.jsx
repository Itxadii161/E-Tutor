import react, {useEffect, useState} from 'react';
import TutorCard from './SMALL_components/TutorCard';
import image1 from '../assets/Top_tutors/src\Image1.png';
import image2 from '../assets/Top_tutors/image2.png'
import image3 from '../assets/Top_tutors/image3.png'
import image4 from '../assets/Top_tutors/image4.png'
import image5 from '../assets/Top_tutors/image5.png'

const TopTutors = () => {
    const[tutors , setTutors] = useState([])

    useEffect(()=> {
        const fetchTutors = async () => {
            const topTutors = [
                {id : "1", image : image1 , name : 'Devan Lane', fassion: 'Senior Developer', rating: '4.6', students: '854',},
                {id : "2", image : image2, name : 'Derrell Steward', fassion: 'Digital Product Designer', rating: '4.9', students: '451444',},
                {id : "3", image : image3, name : 'Jane Cooper', fassion: 'UI/UX Designer', rating: '4.8', students: '435671',},
                {id : "4", image : image4, name : 'Albert Flores', fassion: 'Adobe Instructor', rating: '4.7', students: '511123',},
                {id : "5", image : image5, name : 'Kathryn Murphy', fassion: 'Lead Developer', rating: '4.2', students: '2711',},    
            ];
            setTutors(topTutors.slice(0, 5));
        };
        fetchTutors();
    }, [])
    return(
        <div className=" h-[500px] flex justify-evenly flex-col items-center">
            <header className=' text-3xl font-bold'>
            Top instructor of the month</header>
            <body className=' grid grid-cols-5 gap-3'>
                {tutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor}/>
                ))}
            </body>
            <footer className=' text-gray-600 '>
            Thousands of students looking for an instructor. Start teaching & earning now!
                <span className=" text-[#FF6636]">
                <a href="">
                  Become Instructor</a>
                </span>
            </footer>
        </div>
    )
}
export default TopTutors;