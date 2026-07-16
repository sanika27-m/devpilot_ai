import React from 'react';
import * as SiIcons from 'react-icons/si';
import * as FaIcons from 'react-icons/fa';

export default function TechIcon({ name, className }) {
  const getIcon = () => {
    switch (name) {
      case 'Python': return <SiIcons.SiPython className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Java': return <FaIcons.FaJava className="w-5 h-5 text-red-500 dark:text-orange-400" />;
      case 'C++': return <SiIcons.SiCplusplus className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'JavaScript': return <SiIcons.SiJavascript className="w-5 h-5 text-amber-500 dark:text-yellow-400" />;
      case 'React': return <SiIcons.SiReact className="w-5 h-5 text-cyan-500 dark:text-cyan-300" />;
      case 'Node.js': return <SiIcons.SiNodedotjs className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Flask': return <SiIcons.SiFlask className="w-5 h-5 text-slate-700 dark:text-slate-200" />;
      case 'Git': return <SiIcons.SiGit className="w-5 h-5 text-orange-600 dark:text-orange-500" />;
      case 'GitHub': return <SiIcons.SiGithub className="w-5 h-5 text-slate-800 dark:text-white" />;
      case 'Docker': return <SiIcons.SiDocker className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'TensorFlow': return <SiIcons.SiTensorflow className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'OpenAI': return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-700 dark:text-emerald-300" fill="currentColor">
          <path d="M21.3,10.1A5.5,5.5,0,0,0,17.9,5a5.4,5.4,0,0,0-5.8-3.4A5.5,5.5,0,0,0,6.7,5,5.5,5.5,0,0,0,3.3,10.1a5.4,5.4,0,0,0,1.3,6.2,5.5,5.5,0,0,0,3.4,5.1,5.4,5.4,0,0,0,5.8,3.4,5.5,5.5,0,0,0,5.4-3.3,5.5,5.5,0,0,0,3.4-5.1A5.4,5.4,0,0,0,21.3,10.1ZM12,22.4a3.8,3.8,0,0,1-1.9-.5l.1-.1,3.4-2a1,1,0,0,0,.5-.8V14.1l2.7,1.6a.1.1,0,0,1,0,.1V20A3.8,3.8,0,0,1,12,22.4ZM4.4,17.2a3.8,3.8,0,0,1-.5-2l.1.1,3.4,2a1,1,0,0,0,.9,0l4.3-2.5v3.1a.1.1,0,0,1-.1.1H7.8A3.8,3.8,0,0,1,4.4,17.2ZM3.9,7.8a3.8,3.8,0,0,1,1.5-1.3l.1.1V10.5a1,1,0,0,0,.4.8l4.3,2.5L7.5,15.4a.1.1,0,0,1-.1,0l-3.5-2A3.8,3.8,0,0,1,3.9,7.8ZM12,1.6A3.8,3.8,0,0,1,13.9,2l-.1.1-3.4,2a1,1,0,0,0-.5.8v4.9L7.2,8.2a.1.1,0,0,1,0-.1V4A3.8,3.8,0,0,1,12,1.6ZM19.6,6.8a3.8,3.8,0,0,1,.5,2l-.1-.1-3.4-2a1,1,0,0,0-.9,0L11.4,9.2V6.1a.1.1,0,0,1,.1-.1h4.7A3.8,3.8,0,0,1,19.6,6.8ZM20.1,16.2a3.8,3.8,0,0,1-1.5,1.3l-.1-.1V13.5a1,1,0,0,0-.4-.8l-4.3-2.5,2.7-1.6a.1.1,0,0,1,.1,0l3.5,2A3.8,3.8,0,0,1,20.1,16.2ZM12,14.6,9.3,13V9.8L12,8.2l2.7,1.6v3.2Z" />
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div
      className={`absolute hidden xl:flex items-center justify-center p-3 rounded-2xl glass-panel border border-slate-950/10 dark:border-white/10 shadow-lg pointer-events-none select-none z-10 hover:shadow-glow-cyan transition-shadow duration-500 ${className}`}
      title={name}
    >
      {getIcon()}
    </div>
  );
}
