import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4 text-center">
      <p>&copy; {new Date().getFullYear()} E-tutor. All rights reserved.</p> {/* Added a copyright notice*/}
    </footer>
  );
};

export default Footer;