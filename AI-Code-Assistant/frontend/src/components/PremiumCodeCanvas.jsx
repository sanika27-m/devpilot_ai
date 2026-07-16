import React, { useEffect, useRef } from 'react';

export default function PremiumCodeCanvas({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Responsive Canvas Resizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pre-tokenized snippets with syntax colors matching Dracula theme
    const codeSnippets = [
      // Python Binary Search check
      [
        [{ text: 'def ', color: '#ff79c6' }, { text: 'search', color: '#50fa7b' }, { text: '(arr, val):', color: '#f8f8f2' }],
        [{ text: '    if ', color: '#ff79c6' }, { text: 'val ', color: '#f8f8f2' }, { text: 'in ', color: '#ff79c6' }, { text: 'arr:', color: '#f8f8f2' }],
        [{ text: '        return ', color: '#ff79c6' }, { text: 'True', color: '#bd93f9' }]
      ],
      // Javascript Arrow Function
      [
        [{ text: 'const ', color: '#ff79c6' }, { text: 'add ', color: '#50fa7b' }, { text: '= ', color: '#ff79c6' }, { text: '(a, b) ', color: '#ffb86c' }, { text: '=> ', color: '#ff79c6' }, { text: 'a + b;', color: '#f8f8f2' }]
      ],
      // C++ Output
      [
        [{ text: '#include ', color: '#ff79c6' }, { text: '<vector>', color: '#f1fa8c' }],
        [{ text: 'std::cout ', color: '#8be9fd' }, { text: '<< ', color: '#ff79c6' }, { text: '"OK";', color: '#f1fa8c' }]
      ],
      // HTML Tag
      [
        [{ text: '<', color: '#f8f8f2' }, { text: 'div ', color: '#ff79c6' }, { text: 'className', color: '#50fa7b' }, { text: '="flex"', color: '#f1fa8c' }, { text: ' />', color: '#f8f8f2' }]
      ],
      // SQL Statement
      [
        [{ text: 'SELECT ', color: '#ff79c6' }, { text: '* ', color: '#f8f8f2' }, { text: 'FROM ', color: '#ff79c6' }, { text: 'users ', color: '#50fa7b' }, { text: 'LIMIT ', color: '#ff79c6' }, { text: '10;', color: '#bd93f9' }]
      ],
      // JSON Payload
      [
        [{ text: '{ ', color: '#f8f8f2' }, { text: '"id"', color: '#ff79c6' }, { text: ': ', color: '#f8f8f2' }, { text: '101', color: '#bd93f9' }, { text: ', ', color: '#f8f8f2' }, { text: '"role"', color: '#ff79c6' }, { text: ': ', color: '#f8f8f2' }, { text: '"admin"', color: '#f1fa8c' }, { text: ' }', color: '#f8f8f2' }]
      ]
    ];

    const keywords = ['const', 'import', 'class', 'struct', 'fn', 'while', 'return', 'lambda', 'null', 'nil', 'async', 'await'];
    const brackets = ['{}', '[]', '()', '<>', '=>', '::'];
    const binary = ['1010101', '0110010', '1100110', '0011011', '1110001'];

    // Particle pool setup
    const particles = [];
    const isMobile = window.innerWidth < 1024;
    const maxParticles = isMobile ? 8 : 18;

    const createParticle = (initYRandom = false) => {
      const typeRand = Math.random();
      let type = 'bracket';
      let content = null;

      if (typeRand < 0.35) {
        type = 'snippet';
        content = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      } else if (typeRand < 0.6) {
        type = 'keyword';
        content = keywords[Math.floor(Math.random() * keywords.length)];
      } else if (typeRand < 0.8) {
        type = 'bracket';
        content = brackets[Math.floor(Math.random() * brackets.length)];
      } else {
        type = 'binary';
        content = binary[Math.floor(Math.random() * binary.length)];
      }

      return {
        x: Math.random() * canvas.width,
        y: initYRandom ? Math.random() * canvas.height : canvas.height + 50,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.15 + Math.random() * 0.45),
        alpha: 0,
        targetAlpha: 0.15 + Math.random() * 0.25, // Subtle transparency to respect readability
        fadeDir: 1, // 1 = fade in, -1 = fade out
        rotation: (Math.random() - 0.5) * 0.1,
        rotSpeed: (Math.random() - 0.5) * 0.002,
        scale: 0.85 + Math.random() * 0.3,
        blur: Math.random() < 0.3 ? 1 : 0, // Randomly blur background codes
        type,
        content
      };
    };

    // Initialize particles across full height
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const draw = () => {
      // Clear with dark or light canvas base
      ctx.fillStyle = theme === 'dark' ? '#030712' : '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textBaseline = 'top';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Fade handling
        if (p.fadeDir === 1) {
          p.alpha += 0.005;
          if (p.alpha >= p.targetAlpha) {
            p.alpha = p.targetAlpha;
            p.fadeDir = 0;
          }
        } else if (p.fadeDir === -1) {
          p.alpha -= 0.008;
          if (p.alpha <= 0) {
            particles[i] = createParticle();
            continue;
          }
        }

        // Trigger fade out if reaching bounds
        if (p.y < 50 && p.fadeDir === 0) {
          p.fadeDir = -1;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);

        // Apply blur filter if particle is set to blur (3D depth effect)
        if (p.blur > 0) {
          ctx.filter = `blur(${p.blur}px)`;
        }

        // Set global opacity
        ctx.globalAlpha = p.alpha;

        // Draw particle based on type
        if (p.type === 'snippet') {
          ctx.font = "11px 'JetBrains Mono', monospace";
          
          // Draw pre-tokenized syntax highlighted lines
          p.content.forEach((lineTokens, lineIdx) => {
            let cursorX = 0;
            const cursorY = lineIdx * 16;
            
            lineTokens.forEach(token => {
              // Adjust colors in light theme to have readable contrast
              let drawColor = token.color;
              if (theme !== 'dark') {
                // Map dark neon colors to solid darker alternatives
                if (token.color === '#ff79c6') drawColor = '#c026d3'; // pink -> purple-600
                else if (token.color === '#50fa7b') drawColor = '#059669'; // green -> emerald-600
                else if (token.color === '#bd93f9') drawColor = '#4f46e5'; // violet -> indigo-600
                else if (token.color === '#8be9fd') drawColor = '#0891b2'; // cyan -> cyan-600
                else if (token.color === '#f1fa8c') drawColor = '#d97706'; // yellow -> amber-600
                else drawColor = '#334155'; // white -> slate-700
              }

              ctx.fillStyle = drawColor;
              ctx.fillText(token.text, cursorX, cursorY);
              cursorX += ctx.measureText(token.text).width;
            });
          });
        } else {
          // Draw standard single text particle (bracket, binary, keyword)
          ctx.font = "12px 'JetBrains Mono', monospace";
          let drawColor = theme === 'dark' ? '#8be9fd' : '#4f46e5'; // cyan in dark, indigo in light
          if (p.type === 'binary') drawColor = theme === 'dark' ? '#6272a4' : '#64748b'; // comments gray
          ctx.fillStyle = drawColor;
          ctx.fillText(p.content, 0, 0);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
}
