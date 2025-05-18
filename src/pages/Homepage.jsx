import Hero from '../components/HomePageComp/Hero';
import BecomeInstructor from '../components/HomePageComp/Become_Tutor'
import TopTutors from '../components/HomePageComp/TopTutors';
const HomePage =()=>{
    return(
        <div>
            <Hero />
            <BecomeInstructor />
            <TopTutors />
        </div>
    )
}
export default HomePage;