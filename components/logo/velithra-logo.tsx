"use client"
import { motion } from "framer-motion"

interface VelithraLogoProps {
  size?: number
  animate?: boolean
}

export function VelithraLogo({ size = 144, animate = true }: VelithraLogoProps) {
  return (
    <motion.div
      animate={animate ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 700 700"
        preserveAspectRatio="xMidYMid meet"
        style={{ background: 'transparent' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur"/>
            <feFlood floodColor="#00f0ff" floodOpacity="0.9"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g id="dendrite">
          {/* ƏSAS BUDAQ */}
          <line x1="350" y1="350" x2="350" y2="75" stroke="#00f0ff" strokeWidth="3.5" strokeLinecap="round"/>
          
          {/* SOL - Kiçik xətlər */}
          <line x1="350" y1="336" x2="327" y2="325" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="320" x2="324" y2="308" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="304" x2="321" y2="290" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="288" x2="317" y2="272" stroke="#00f0ff" strokeWidth="1.8"/>
          <line x1="350" y1="271" x2="313" y2="253" stroke="#00f0ff" strokeWidth="1.8"/>
          <line x1="350" y1="254" x2="309" y2="234" stroke="#00f0ff" strokeWidth="1.8"/>
          {/* UZUN - sol hexagona */}
          <line x1="350" y1="237" x2="275" y2="200" stroke="#00f0ff" strokeWidth="2.2"/>
          <line x1="350" y1="220" x2="305" y2="198" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="203" x2="301" y2="179" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="186" x2="297" y2="160" stroke="#00f0ff" strokeWidth="1.8"/>
          <line x1="350" y1="169" x2="293" y2="141" stroke="#00f0ff" strokeWidth="1.8"/>
          {/* UZUN - sol hexagona */}
          <line x1="350" y1="152" x2="268" y2="112" stroke="#00f0ff" strokeWidth="2.2"/>
          <line x1="350" y1="135" x2="285" y2="107" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="118" x2="281" y2="88" stroke="#00f0ff" strokeWidth="1.6"/>
          
          {/* SAĞ - Kiçik xətlər */}
          <line x1="350" y1="336" x2="373" y2="325" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="320" x2="376" y2="308" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="304" x2="379" y2="290" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="288" x2="383" y2="272" stroke="#00f0ff" strokeWidth="1.8"/>
          <line x1="350" y1="271" x2="387" y2="253" stroke="#00f0ff" strokeWidth="1.8"/>
          <line x1="350" y1="254" x2="391" y2="234" stroke="#00f0ff" strokeWidth="1.8"/>
          {/* UZUN - sağ hexagona */}
          <line x1="350" y1="237" x2="425" y2="200" stroke="#00f0ff" strokeWidth="2.2"/>
          <line x1="350" y1="220" x2="395" y2="198" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="203" x2="399" y2="179" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="186" x2="403" y2="160" stroke="#00f0ff" strokeWidth="1.8"/>
          <line x1="350" y1="169" x2="407" y2="141" stroke="#00f0ff" strokeWidth="1.8"/>
          {/* UZUN - sağ hexagona */}
          <line x1="350" y1="152" x2="432" y2="112" stroke="#00f0ff" strokeWidth="2.2"/>
          <line x1="350" y1="135" x2="415" y2="107" stroke="#00f0ff" strokeWidth="1.7"/>
          <line x1="350" y1="118" x2="419" y2="88" stroke="#00f0ff" strokeWidth="1.6"/>
          
          {/* HEXAGON 1 - Sol */}
          <path d="M275,188 L282,192 L282,202 L275,206 L268,202 L268,192 Z" 
                fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="2.3"/>
          <text x="275" y="200" fontSize="11" fill="#00f0ff" textAnchor="middle" fontWeight="bold" fontFamily="serif">愛</text>
          
          {/* HEXAGON 2 - Sağ */}
          <path d="M425,188 L432,192 L432,202 L425,206 L418,202 L418,192 Z" 
                fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="2.3"/>
          <text x="425" y="200" fontSize="11" fill="#00f0ff" textAnchor="middle" fontWeight="bold" fontFamily="serif">夢</text>
          
          {/* HEXAGON 3 - Terminal */}
          <path d="M350,63 L357,67 L357,77 L350,81 L343,77 L343,67 Z" 
                fill="rgba(0,240,255,0.2)" stroke="#00f0ff" strokeWidth="2.6"/>
          <text x="350" y="75" fontSize="12" fill="#00f0ff" textAnchor="middle" fontWeight="bold" fontFamily="serif">雪</text>
          
          {/* Terminal dairə */}
          <circle cx="350" cy="53" r="4" fill="#00f0ff" stroke="#00f0ff" strokeWidth="1.5"/>
        </g>

        {/* 6 BUDAQ - hər biri fərqli kanji ilə */}
        <g filter="url(#glow)">
          {/* Budaq 1: 愛 (sevgi), 夢 (xəyal), 雪 (qar) */}
          <use href="#dendrite" transform="rotate(0 350 350)"/>
          
          {/* Budaq 2: 無 (yoxluq), 光 (işıq), 心 (ürək) simvolları */}
          <g transform="rotate(60 350 350)">
            <line x1="350" y1="350" x2="350" y2="75" stroke="#00f0ff" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="350" y1="336" x2="327" y2="325" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="320" x2="324" y2="308" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="304" x2="321" y2="290" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="288" x2="317" y2="272" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="271" x2="313" y2="253" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="254" x2="309" y2="234" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="237" x2="275" y2="200" stroke="#00f0ff" strokeWidth="2.2"/>
            <line x1="350" y1="220" x2="305" y2="198" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="203" x2="301" y2="179" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="186" x2="297" y2="160" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="169" x2="293" y2="141" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="152" x2="268" y2="112" stroke="#00f0ff" strokeWidth="2.2"/>
            <line x1="350" y1="135" x2="285" y2="107" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="118" x2="281" y2="88" stroke="#00f0ff" strokeWidth="1.6"/>
            <line x1="350" y1="336" x2="373" y2="325" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="320" x2="376" y2="308" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="304" x2="379" y2="290" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="288" x2="383" y2="272" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="271" x2="387" y2="253" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="254" x2="391" y2="234" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="237" x2="425" y2="200" stroke="#00f0ff" strokeWidth="2.2"/>
            <line x1="350" y1="220" x2="395" y2="198" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="203" x2="399" y2="179" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="186" x2="403" y2="160" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="169" x2="407" y2="141" stroke="#00f0ff" strokeWidth="1.8"/>
            <line x1="350" y1="152" x2="432" y2="112" stroke="#00f0ff" strokeWidth="2.2"/>
            <line x1="350" y1="135" x2="415" y2="107" stroke="#00f0ff" strokeWidth="1.7"/>
            <line x1="350" y1="118" x2="419" y2="88" stroke="#00f0ff" strokeWidth="1.6"/>
            <path d="M275,188 L282,192 L282,202 L275,206 L268,202 L268,192 Z" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="2.3"/>
            <text x="275" y="200" fontSize="11" fill="#00f0ff" textAnchor="middle" fontWeight="bold" fontFamily="serif">無</text>
            <path d="M425,188 L432,192 L432,202 L425,206 L418,202 L418,192 Z" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="2.3"/>
            <text x="425" y="200" fontSize="11" fill="#00f0ff" textAnchor="middle" fontWeight="bold" fontFamily="serif">光</text>
            <path d="M350,63 L357,67 L357,77 L350,81 L343,77 L343,67 Z" fill="rgba(0,240,255,0.2)" stroke="#00f0ff" strokeWidth="2.6"/>
            <text x="350" y="75" fontSize="12" fill="#00f0ff" textAnchor="middle" fontWeight="bold" fontFamily="serif">心</text>
            <circle cx="350" cy="53" r="4" fill="#00f0ff" stroke="#00f0ff" strokeWidth="1.5"/>
          </g>
          
          {/* Qalan 4 budaq - eyni struktur */}
          <use href="#dendrite" transform="rotate(120 350 350)"/>
          <use href="#dendrite" transform="rotate(180 350 350)"/>
          <use href="#dendrite" transform="rotate(240 350 350)"/>
          <use href="#dendrite" transform="rotate(300 350 350)"/>
        </g>

        {/* MƏRKƏZ - SADƏCƏ V HƏRFİ */}
        <defs>
          <linearGradient id="vGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8f8f8"/>
            <stop offset="50%" stopColor="#d0d0d0"/>
            <stop offset="100%" stopColor="#909090"/>
          </linearGradient>
          <filter id="bevel" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
            <feOffset dx="3" dy="3" result="offsetBlur"/>
            <feFlood floodColor="#000000" floodOpacity="0.7"/>
            <feComposite in2="offsetBlur" operator="in" result="shadow"/>
            <feOffset in="SourceAlpha" dx="-1.5" dy="-1.5" result="offsetHighlight"/>
            <feFlood floodColor="#ffffff" floodOpacity="0.95"/>
            <feComposite in2="offsetHighlight" operator="in" result="highlight"/>
            <feMerge>
              <feMergeNode in="shadow"/>
              <feMergeNode in="highlight"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <g filter="url(#bevel)">
          <path d="M285,310 L350,475 L415,310 L397,310 L350,440 L303,310 Z" 
                fill="url(#vGrad)" stroke="#1a1a1a" strokeWidth="6.5"/>
          <path d="M303,320 L350,432 L397,320" 
                fill="none" stroke="#ffffff" strokeWidth="5.8" opacity="0.88"/>
          <path d="M313,332 L350,415 L387,332" 
                fill="none" stroke="#909090" strokeWidth="3.2" opacity="0.68"/>
        </g>
      </svg>
    </motion.div>
  )
}