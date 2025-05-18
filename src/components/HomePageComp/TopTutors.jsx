import React, { useEffect, useState, useContext } from 'react';
import TutorCard from '../SMALL_components/TutorCard';
import image1 from '../../assets/Top_tutors/Image1.png';
import image2 from '../../assets/Top_tutors/Image2.png';
import image3 from '../../assets/Top_tutors/Image3.png';
import image4 from '../../assets/Top_tutors/Image4.png';
import image5 from '../../assets/Top_tutors/Image5.png';
import {UserContext} from '../../context/UserContext'
const TopTutors = () => {
    const [tutors, setTutors] = useState([]);
    const {user, role} = useContext(UserContext)
    useEffect(() => {
        const fetchTutors = async () => {
            const topTutors = [
                { id: "1", image: image1, name: 'Devan Lane', profession: 'Senior Developer', rating: '4.6', students: '854' },
                { id: "2", image: image2, name: 'Derrell Steward', profession: 'Digital Product Designer', rating: '4.9', students: '451,444' },
                { id: "3", image: image3, name: 'Jane Cooper', profession: 'UI/UX Designer', rating: '4.8', students: '435,671' },
                { id: "4", image: image4, name: 'Albert Flores', profession: 'Adobe Instructor', rating: '4.7', students: '511,123' },
                { id: "5", image: image5, name: 'Kathryn Murphy', profession: 'Lead Developer', rating: '4.2', students: '2,711' },
            ];
            setTutors(topTutors);
        };
        fetchTutors();
    }, []);

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className='text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-12'>
                    Top Instructors of the Month
                </header>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {tutors.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                </div>
                
                <footer className='text-gray-600 text-center mt-10 text-sm sm:text-base'>
                    Thousands of students looking for an instructor. Start teaching & earning now!{' '}
                   
                    {!user ? (
                    <a href="/login" className="text-[#FF6636] hover:underline font-medium">
                        Login First
                    </a>
                    ) : role !== 'tutor' ? (
                    <a href="/become-tutor-form" className="text-[#FF6636] hover:underline font-medium">
                        Become an Instructor
                    </a>
                    ) : (
                    <a href="/dashboard" className="text-[#FF6636] hover:underline font-medium">
                        Go to Dashboard
                    </a>
                    )}

                    
                </footer>
            </div>
        </section>
    );
};

export default TopTutors; 