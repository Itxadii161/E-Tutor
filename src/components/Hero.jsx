import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/Home-page-images/heroImage.png'

const Hero = () => {
const navigate = useNavigate()
return (
    <section className=" flex justify-between items-center h-[450px] text-center">
    <div className=' ml-40'>
      <h1 className="text-5xl font-bold  mb-4">Learn with expert <br/> anytime anywhere</h1>
      <p className="text-lg font-semibold mb-8 px-16 text-[#4E5566]">Our mission is to help people find the best courses <br/> online and learn with experts anytime, anywhere.</p>
      <button className="bg-[#FF6636] text-white px-6 py-3 rounded text-lg"
      onClick={() => navigate('/signup-page')}
      >Create Account</button>
      </div>
      <img src={heroImage} alt="" className='h-[450px] mr-3'/>
    </section>
  );
};

export default Hero;
