import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    id: 1,
    tagline: '#1 Most loved dish',
    title: 'GOURMET<br>PIZZA',
    desc: 'Experience the perfect balance of authentic ingredients and culinary mastery.',
    rating: '4.9',
    chefName: 'Chef Feny',
    chefDesc: 'Crafted with the finest imported ingredients, perfectly balanced to deliver an unforgettable taste.',
    bg: '#e5e4de'
  },
  {
    id: 2,
    tagline: '#2 Signature Pick',
    title: 'PREMIUM<br>BURGER',
    desc: 'A masterclass in flavor stacking. Prime aged beef, artisanal cheese, and our secret sauce.',
    rating: '4.8',
    chefName: 'Chef Semy',
    chefDesc: 'Grilled to perfection, offering a juicy and robust flavor profile in every single bite.',
    bg: '#eae6df'
  },
  {
    id: 3,
    tagline: '#3 Organic Choice',
    title: 'FRESH<br>WRAP',
    desc: 'Crisp, vibrant, and bursting with life. Our wraps combine wholesome grains with local greens.',
    rating: '4.7',
    chefName: 'Chef Adin',
    chefDesc: 'Sourced daily from local organic farms to ensure the absolute highest quality and freshness.',
    bg: '#e2e8e4'
  },
  {
    id: 4,
    tagline: '#4 Crowd Favorite',
    title: 'CRISPY<br>FRIES',
    desc: 'Hand-cut, twice-cooked, and perfectly seasoned. The ultimate comfort side, elevated.',
    rating: '4.9',
    chefName: 'Chef Reza',
    chefDesc: 'The secret is in the double-fry technique, yielding an incredibly satisfying crunch.',
    bg: '#eee6de'
  }
];

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-container',
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1.5,
    }
  });

  let currentIndex = 0;

  function updateUI(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    const scene = scenes[index];

    // Background
    document.querySelector('.bg-layer').style.backgroundColor = scene.bg;

    // Thumbnails
    document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  // Floating animation for active models
  gsap.to('.food-model', {
    y: '+=10',
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  for (let i = 0; i < 4; i++) {
    
    // Exit current
    if (i > 0) {
      masterTl.addLabel(`exit-${i-1}`)
        .to(`#model-${i}`, {
          opacity: 0,
          y: -100, // Moves up
          scale: 0.8,
          duration: 1,
          ease: 'power2.inOut'
        }, `exit-${i-1}`)
        .to('.text-content > *, .rating-score, .chef-info > *', {
          y: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.in',
          onComplete: () => updateUI(i)
        }, `exit-${i-1}+=0.3`);
    } else {
      masterTl.addLabel(`start`);
    }

    masterTl.to({}, {duration: 0.5});

    // Enter next
    masterTl.addLabel(`enter-${i}`)
      .call(() => {
        document.querySelector('.tagline').innerHTML = scenes[i].tagline;
        document.querySelector('.title').innerHTML = scenes[i].title;
        document.querySelector('.description').innerHTML = scenes[i].desc;
        document.querySelector('.rating-score').innerHTML = scenes[i].rating;
        document.querySelector('.chef-name').innerHTML = scenes[i].chefName;
        document.querySelector('.chef-desc').innerHTML = scenes[i].chefDesc;
      }, null, `enter-${i}`)
      .fromTo(`#model-${i+1}`, 
        { opacity: 0, y: 100, scale: 0.8 }, // Enters from bottom
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out' },
        `enter-${i}`
      )
      .fromTo('.text-content > *, .rating-score, .chef-info > *', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' },
        `enter-${i}+=0.5`
      );

    masterTl.to({}, {duration: 1});
  }
});
