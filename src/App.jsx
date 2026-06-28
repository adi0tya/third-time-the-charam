import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    id: 1, num: '01',
    tagline: 'Forever & Always',
    title: 'Delicious',
    desc: 'How can someone look this delicious? The cuteness you carry is just... mwah.',
    bg: '#e8e0f0', textColor: '#2d1b4e', taglineColor: '#7c3aed',
    btnBg: '#7c3aed', btnText: '#fff', navColor: '#2d1b4e',
    ringColor: 'rgba(124,58,237,0.08)',
    image: 'https://res.cloudinary.com/deevn56zp/image/upload/v1782631410/proposal_assets/IMG-20260328-WA0005_transparent.png',
    imageScale: 0.65,
    imageOffsetY: 20,
  },
  {
    id: 2, num: '02',
    tagline: 'Bold & Beautiful',
    title: 'Gorgeous',
    desc: 'The amount of beauty you carry is indescribable. I keep thinking about the day I\'ll wake up beside you in the morning.',
    bg: '#fdf6e3', textColor: '#5c4813', taglineColor: '#d4a017',
    btnBg: '#c8991f', btnText: '#fff', navColor: '#5c4813',
    ringColor: 'rgba(212,160,23,0.08)',
    image: 'https://res.cloudinary.com/deevn56zp/image/upload/v1782631412/proposal_assets/IMG-20260331-WA0023_transparent.png',
  },
  {
    id: 3, num: '03',
    tagline: 'Sweet & Lovely',
    title: 'Sunflower',
    desc: 'You\'re just like a sunflower. The way sunflowers attract people, you attract me. I want to have you by my side always.',
    bg: '#fde4ec', textColor: '#6b1d3a', taglineColor: '#e84393',
    btnBg: '#e84393', btnText: '#fff', navColor: '#6b1d3a',
    ringColor: 'rgba(232,67,147,0.08)',
    image: 'https://res.cloudinary.com/deevn56zp/image/upload/v1782631415/proposal_assets/IMG_20260130_002122_transparent.png',
  },
  {
    id: 4, num: '04',
    tagline: 'Warm & Graceful',
    title: 'Favourite',
    desc: 'This picture is my favourite. If you say yes, I\'ll keep this photo as my wallpaper and carry it in my wallet forever.',
    bg: '#e6f5e8', textColor: '#1a4731', taglineColor: '#2ecc71',
    btnBg: '#27ae60', btnText: '#fff', navColor: '#1a4731',
    ringColor: 'rgba(39,174,96,0.08)',
    image: 'https://res.cloudinary.com/deevn56zp/image/upload/v1782631428/proposal_assets/IMG_20260310_213006_transparent.png',
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'questions', 'blank'
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  
  // HIGH-PERFORMANCE DOM NODE CACHING
  const foodRefs = useRef([]);
  const sceneRefs = useRef([]);
  const dotRefs = useRef([]);
  const bgRef = useRef(null);
  const ringRef = useRef(null);
  const navLogoRef = useRef(null);
  const scrollIndRef = useRef(null);
  const navBtnRef = useRef(null);
  const menuRefs = useRef([]);
  
  useEffect(() => {
    if (currentPage !== 'main') return;
    const ctx = gsap.context(() => {
      const RADIUS = 450;
      const BASE_ANGLES = [0, -90, -180, -270];
      let activeIndex = 0;

      function normAngle(a) {
        return ((a % 360) + 360) % 360;
      }

      function updateCarousel(rotationOffset) {
        let closestDist = 999;
        let closestIdx = 0;

        scenes.forEach((_, i) => {
          const angle = normAngle(BASE_ANGLES[i] + rotationOffset);
          const rad = (angle * Math.PI) / 180;

          const x = RADIUS * Math.sin(rad);
          const depthZ = Math.cos(rad);
          
          const depthNorm = (depthZ + 1) / 2;
          const imgScale = scenes[i].imageScale || 1;
          const scale = (0.4 + 0.95 * Math.pow(depthNorm, 2)) * imgScale;

          const distFromFront = Math.min(angle, 360 - angle);
          let opacity = 1;
          if (distFromFront > 140) opacity = 0;
          else if (distFromFront > 90) opacity = 1 - ((distFromFront - 90) / 50);

          const zIndex = Math.round(20 + 10 * depthZ);
          const yShift = -depthZ * 80 + 80 + (scenes[i].imageOffsetY || 0);

          const rotZ = Math.sin(rad) * 12;
          
          const brightness = 0.4 + (depthNorm * 0.7);
          const contrast = 0.8 + (depthNorm * 0.35);

          const shadowY = 10 + (depthNorm * 30);
          const shadowBlur = 10 + (depthNorm * 20);
          const shadowOpacity = 0.3 - (depthNorm * 0.15);
          
          let filterStr = `brightness(${brightness}) contrast(${contrast}) drop-shadow(0px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`;
          
          if (distFromFront > 30) {
             const blurVal = Math.min(8, (distFromFront / 180) * 12);
             filterStr += ` blur(${blurVal}px)`;
          }

          // Directly animate the cached DOM node instead of querying the DOM string every frame
          if (foodRefs.current[i]) {
            gsap.set(foodRefs.current[i], {
              x,
              y: yShift,
              scale,
              opacity,
              zIndex,
              rotation: rotZ,
              rotateY: 0,
              force3D: true, // Force GPU hardware acceleration
              filter: filterStr
            });
          }

          if (distFromFront < closestDist) {
            closestDist = distFromFront;
            closestIdx = i;
          }
        });

        if (closestIdx !== activeIndex && closestDist < 45) {
          activeIndex = closestIdx;
          const sc = scenes[activeIndex];

          scenes.forEach((_, i) => {
            if (sceneRefs.current[i]) {
               gsap.to(sceneRefs.current[i], {
                 autoAlpha: i === activeIndex ? 1 : 0,
                 y: i === activeIndex ? 0 : 20,
                 duration: 0.4,
                 ease: 'power2.out',
                 overwrite: true,
               });
            }
          });

          if (bgRef.current) gsap.to(bgRef.current, { backgroundColor: sc.bg, duration: 0.8, ease: 'power1.inOut', overwrite: true });
          if (ringRef.current) gsap.to(ringRef.current, { borderColor: sc.ringColor, duration: 0.8, overwrite: true });
          if (navLogoRef.current) gsap.to(navLogoRef.current, { color: sc.navColor, duration: 0.5, overwrite: true });
          if (navBtnRef.current) gsap.to(navBtnRef.current, { color: sc.navColor, duration: 0.5, overwrite: true });
        }
      }

      // Initialize scenes manually hiding all but active
      scenes.forEach((_, i) => {
        if (i !== 0 && sceneRefs.current[i]) {
          gsap.set(sceneRefs.current[i], { autoAlpha: 0, y: 20 });
        }
      });
      updateCarousel(0);

      if (ringRef.current) {
        gsap.to(ringRef.current, { rotation: 360, duration: 60, repeat: -1, ease: 'none' });
      }

      gsap.to('.particle', { opacity: 0.5, duration: 1.5, stagger: 0.1, delay: 0.3, force3D: true });

      const rotObj = { value: 0 };

      gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1.2,
          snap: {
            snapTo: 1 / 3,
            delay: 0.1,
            duration: { min: 0.4, max: 0.8 },
            ease: 'power2.inOut',
          },
        }
      }).to(rotObj, {
        value: 270,
        duration: 3,
        ease: 'none',
        onUpdate: () => updateCarousel(rotObj.value),
      });

    }, containerRef);

    return () => ctx.revert();
  }, [currentPage]);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let timer;
    if (currentPage === 'blank') {
      setShowPopup(false);
      timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [currentPage]);

  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [proposalAnswer, setProposalAnswer] = useState(null); // null, 'yes', 'no'

  const moveNoButton = () => {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    setNoBtnPos({ x: randomX, y: randomY });
  };

  if (currentPage === 'proposal') {
    return (
      <div style={{ backgroundColor: '#fff5f7', width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: "'Outfit', sans-serif", color: '#4a1525', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '650px', background: '#fff', padding: '3.5rem', borderRadius: '30px', boxShadow: '0 25px 60px rgba(255, 77, 109, 0.12)', border: '1px solid rgba(255, 77, 109, 0.1)', textAlign: 'center', position: 'relative' }}>
          
          {proposalAnswer === 'yes' ? (
            <div>
              <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#ff4d6d' }}>Yay! ❤️</h1>
              <p style={{ fontSize: '1.3rem', lineHeight: 1.6, color: '#4a1525', marginBottom: '2.5rem' }}>
                You just made me the happiest guy ever! I promise to make you smile every day, water the sunflowers with you, and look at you forever. Mwah! 🌻💍
              </p>
              <div style={{ backgroundColor: '#fff0f3', border: '1px dashed #ff4d6d', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem' }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#ff4d6d', fontSize: '1.1rem' }}>
                  📸 Take a picture of this page and send it to me!
                </p>
              </div>
              <button 
                onClick={() => { setCurrentPage('main'); setProposalAnswer(null); }}
                style={{ padding: '0.8rem 2rem', borderRadius: '50px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
              >
                Go to Home Page
              </button>
            </div>
          ) : proposalAnswer === 'no' ? (
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#7c3aed' }}>Koi na... 🥺</h1>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: '#2d1b4e', marginBottom: '2.5rem', textAlign: 'left' }}>
                I still have 5 years, kabhi na kabhi toh haan bol degi. But if you want right now, you can still say yes!
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => setProposalAnswer('yes')}
                  style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(255, 77, 109, 0.35)' }}
                >
                  Yes! ❤️
                </button>
                <button 
                  onClick={() => { setCurrentPage('main'); setProposalAnswer(null); }}
                  style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: '2px solid #2d1b4e', background: 'transparent', color: '#2d1b4e', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ color: '#ff4d6d', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '1.5rem' }}>A Message for You</h2>
              <div style={{ textAlign: 'left', lineHeight: 1.8, fontSize: '1.05rem', color: '#5a2d3a', marginBottom: '2.5rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                <p style={{ marginBottom: '1rem' }}>
                  Supriya, you know what? Main jab se teko pasand kara hu na, I just want to be with you. The amount of love I carry for you is unbelievable. The respect I have for you is insane.
                </p>
                <p style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#ff4d6d' }}>
                  Sup, just one more time, I am proposing to you, this time with all the love.
                </p>
                <blockquote style={{ borderLeft: '3px solid #ff4d6d', paddingLeft: '15px', margin: '1.5rem 0', fontStyle: 'italic', color: '#ff4d6d' }}>
                  "You are the moon to my darkest night.<br />
                  You are the song to my overthinking.<br />
                  You are the calm I always want.<br />
                  You are the home where I always want to stay."
                </blockquote>
                <p style={{ marginBottom: '1rem', fontWeight: 600 }}>
                  Supriya Panda, I, Aditya Dash, want to ask you...
                </p>
                <p style={{ marginBottom: '1rem', fontSize: '1.15rem', color: '#ff4d6d', fontWeight: 700 }}>
                  Will you want to be my girlfriend, then my wife later, and the mother to our kids?
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Will you want to sit with me after 50 years in our sunflower garden? Tab bhi flirt karunga. Tu bolegi ki, "Sunflowers kitne sundar hai, dekh." Tu bolegi, aur main bolunga, "Dekh hi toh raha hu. teko dekh raha hu." <span style={{ opacity: 0.6 }}>(How delusional I am 😂)</span>
                </p>
                <p style={{ fontWeight: 700, textAlign: 'center', fontSize: '1.2rem', color: '#ff4d6d', marginTop: '2rem' }}>
                  Wanna say yes to my proposal?
                </p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '60px' }}>
                <button 
                  onClick={() => setProposalAnswer('yes')}
                  style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(255, 77, 109, 0.35)', transition: 'transform 0.2s' }}
                >
                  Yes! ❤️
                </button>
                <button 
                  onClick={() => setProposalAnswer('no')}
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '50px',
                    border: '1px solid #ff4d6d',
                    background: 'transparent',
                    color: '#ff4d6d',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'wanna-see') {
    const coupleImages = [
      { id: 1, src: '/images/95.jpg', label: 'Cute Us' },
      { id: 2, src: '/images/IMG-20251108-WA0021 (1).jpg', label: 'Laughs' },
      { id: 3, src: '/images/IMG-20251108-WA0024.jpg', label: 'Moments' },
      { id: 4, src: '/images/IMG_20251213_18054517.jpeg', label: 'Together' }
    ];

    return (
      <div style={{ backgroundColor: '#16161a', width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontFamily: "'Outfit', sans-serif", padding: '40px 20px', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <button 
          onClick={() => setCurrentPage('main')}
          style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}
        >
          ← Home
        </button>

        {/* Page Heading */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ff4d6d', margin: '0 0 10px 0', textShadow: '0 4px 10px rgba(255, 77, 109, 0.15)' }}>
            see how happy i am with you
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>our favorite memories hanging together</p>
        </div>

        {/* The Hanging Rope & Photo Clothesline Container */}
        <div style={{ width: '100%', maxWidth: '1000px', position: 'relative', margin: '20px 0', padding: '40px 0' }}>
          {/* Hanging Rope element */}
          <div style={{ position: 'absolute', top: '20px', left: '-5%', right: '-5%', height: '4px', background: 'linear-gradient(to right, #4a3319, #8d6e63, #4a3319)', borderRadius: '5px', boxShadow: '0 8px 15px rgba(0,0,0,0.5)', zIndex: 2 }}></div>
          
          {/* Clothesline photos flex layout */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 3 }}>
            {coupleImages.map((img, idx) => {
              // Create randomized tilt angles for a realistic organic clothesline look
              const tilts = [-5, 4, -3, 6];
              const rotation = tilts[idx % tilts.length];
              
              return (
                <div 
                  key={img.id} 
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                    marginTop: idx % 2 === 0 ? '10px' : '0px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = `rotate(${rotation * 0.5}deg) scale(1.05)`}
                  onMouseLeave={(e) => e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`}
                >
                  {/* Wooden Clip / Peg */}
                  <div style={{ 
                    width: '12px', 
                    height: '28px', 
                    background: '#d7ccc8', 
                    border: '1.5px solid #8d6e63',
                    borderRadius: '2px', 
                    position: 'absolute', 
                    top: '-15px', 
                    zIndex: 4,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                  }}>
                    {/* Metal spring clip detail */}
                    <div style={{ width: '100%', height: '2px', background: '#9e9e9e', position: 'absolute', top: '12px' }}></div>
                  </div>

                  {/* Photo frame */}
                  <div style={{ 
                    background: '#fff', 
                    padding: '12px 12px 24px 12px', 
                    borderRadius: '4px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <img 
                      src={img.src} 
                      alt={img.label}
                      style={{ 
                        width: '125px', 
                        height: '160px', 
                        objectFit: 'cover', 
                        borderRadius: '2px',
                        display: 'block'
                      }} 
                    />
                    <p style={{ margin: '8px 0 0 0', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.85rem', color: '#6d4c41', textAlign: 'center', fontWeight: 600 }}>
                      {img.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#aaa', marginBottom: '1.2rem', fontSize: '1.1rem' }}>I want to say something! Wanna listen?</p>
          <button 
            onClick={() => setCurrentPage('proposal')}
            style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(255, 77, 109, 0.25)' }}
          >
            Say it! ❤️
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'blank') {
    return (
      <div style={{ backgroundColor: '#000', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#333', fontFamily: "'Outfit', sans-serif" }}>
        <button 
          onClick={() => setCurrentPage('main')}
          style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: '1px solid #333', color: '#666', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Go Back
        </button>
        <p style={{ fontStyle: 'italic', fontSize: '1.2rem', transition: 'opacity 0.5s', opacity: showPopup ? 0.2 : 1 }}>A quiet space...</p>

        {showPopup && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid #333',
            padding: '2.5rem',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            color: '#fff',
            maxWidth: '450px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#ff4d6d' }}>you got it right?</h2>
            <p style={{ fontSize: '1rem', color: '#aaa', lineHeight: 1.5, marginBottom: '2rem' }}>
              Wanna see?<br />
              Want to see what my life feels like with you?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setCurrentPage('wanna-see')}
                style={{ padding: '0.8rem 2rem', borderRadius: '50px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'questions') {
    return (
      <div style={{ backgroundColor: '#e6f5e8', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left', padding: '0 8%', fontFamily: "'Outfit', sans-serif", color: '#1a4731' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#2ecc71', marginBottom: '1rem' }}>To My Favourite...</h2>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '2.5rem' }}>
            Do you know how my life is when we don't talk and when we fight?
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              onClick={() => setCurrentPage('blank')}
              style={{ padding: '1rem 2.2rem', borderRadius: '50px', border: 'none', background: '#27ae60', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(39,174,96,0.25)' }}
            >
              Watch
            </button>
            <button 
              onClick={() => setCurrentPage('main')}
              style={{ padding: '1rem 2.2rem', borderRadius: '50px', border: '2px solid #1a4731', background: 'transparent', color: '#1a4731', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="app-container">
      <div ref={triggerRef} className="sticky-hero">
        
        <div ref={bgRef} className="bg-layer" style={{ backgroundColor: scenes[0].bg, willChange: 'background-color' }}></div>

        <div className="particles-layer">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`particle p-${i}`}></div>
          ))}
        </div>




        <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.8rem 4%', width: '100%', boxSizing: 'border-box', position: 'absolute', top: 0, left: 0, zIndex: 100 }}>
          <div ref={navLogoRef} style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '1px', transition: 'color 0.5s' }}>
            I love you
          </div>
          <div ref={navBtnRef} style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '1px', transition: 'color 0.5s' }}>
            my sweetest girl
          </div>
        </nav>

        <div className="hero-content">
          {scenes.map((scene, i) => (
            <div 
              key={scene.id} 
              ref={el => sceneRefs.current[i] = el}
              className="scene" 
              style={{ 
                color: scene.textColor, 
                willChange: 'opacity, transform',
                opacity: i === 0 ? 1 : 0,
                visibility: i === 0 ? 'visible' : 'hidden'
              }}
            >
              <div className="text-content">
                <h1 className="title">{scene.title}</h1>
                <p className="description">{scene.desc}</p>
                {scene.id === 4 && (
                  <div className="actions">
                    <button 
                      className="btn-order" 
                      onClick={() => setCurrentPage('questions')}
                      style={{ backgroundColor: scene.btnBg, color: scene.btnText }}
                    >
                      Click Here ❤️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div ref={ringRef} className="circle-ring" style={{ borderColor: scenes[0].ringColor, willChange: 'border-color, transform' }}></div>

        <div className="models-wrapper">
          {scenes.map((scene, i) => (
            <div
              key={scene.id}
              ref={el => foodRefs.current[i] = el}
              className="food-container"
              style={{ 
                willChange: 'transform, opacity, filter',
                opacity: i === 0 ? 1 : 0,
                visibility: i === 0 ? 'visible' : 'hidden'
              }}
            >
              <div className="img-glow" style={{ background: `radial-gradient(ellipse at center 70%, ${scene.taglineColor}30 0%, transparent 70%)` }}></div>
              <img 
                src={scene.image}
                className="food-img"
                alt={scene.title}
              />
              <div className="floor-shadow"></div>
            </div>
          ))}
        </div>



      </div>
    </div>
  );
}
