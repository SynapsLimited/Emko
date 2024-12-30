import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, PhoneIcon as WhatsApp } from 'lucide-react';

export default function Marquee() {
  return (
    <div className="bg-primary backdrop-blur-sm text-white font-bold py-1  overflow-hidden">
      <motion.div 
        className="flex whitespace-nowrap justify-end md:justify-end"
        
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        <MarqueeContent />
      </motion.div>
    </div>
  );
}

function MarqueeContent() {
  return (
    <div className="flex items-center space-x-8 mx-4 xl:text-sm  lg:text-sm md:text-sm text-[7px]">
      <div className="flex items-center space-x-2">
      <a href="mailto:emko_shpk@yahoo.com" className="transition hover:opacity-[0.7]"> <Mail size={16} /></a>
        <span><a href="mailto:emko_shpk@yahoo.com" className="transition hover:opacity-[0.7]">emko_shpk@yahoo.com</a></span>
      </div>
      <div className="flex items-center space-x-2">
      <a href="tel:+355684008000" className="transition hover:opacity-[0.7]"> <Phone size={16} /> </a> 
        <span> <a href="tel:+355684008000" className="transition hover:opacity-[0.7]">+355 68 400 8000</a></span>
      </div>

      <div className="flex items-center space-x-4">
        <a href="https://www.facebook.com/emkoalbania" className="transition hover:opacity-[0.7]"><Facebook size={16} /></a>
        <a href="https://wa.link/sb1x1e" className="hover:opacity-[0.7]">   
          <img src={`${process.env.PUBLIC_URL}/assets/whatsapp.png`} alt="Whatsapp" className='h-[16px] w-[16px] hover:opacity-[0.7]' />
        </a>
        <a href="https://www.instagram.com/emko.alb/" className="transition hover:opacity-[0.7]"><Instagram size={16} /></a>
      </div>
    </div>
  );
}

