import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useServicePageMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.service-breadcrumb, .service-eyebrow', { y: 18, opacity: 0, stagger: .08, duration: .55 }, .1)
        .from('.service-hero h1 > *', { yPercent: 28, opacity: 0, stagger: .08, duration: .75 }, .18)
        .from('.service-hero-bottom', { y: 24, opacity: 0, duration: .65 }, .42)
        .from('.service-hero-main', { clipPath: 'inset(0 100% 0 0)', scale: 1.06, duration: .9 }, .18)
        .from('.service-hero-float', { x: 46, y: 36, rotate: 8, opacity: 0, duration: .8 }, .42)
        .from('.service-hero-o, .service-visual-label', { scale: .7, opacity: 0, stagger: .08, duration: .55 }, .62);

      gsap.utils.toArray('.service-reveal').forEach((element) => {
        gsap.from(element, {
          y: 34,
          opacity: 0,
          duration: .8,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray('.service-build-row').forEach((row, index) => {
        gsap.from(row, {
          x: index % 2 ? 24 : -24,
          opacity: 0,
          duration: .65,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        });
      });

      gsap.from('.service-process-step', {
        y: 30,
        opacity: 0,
        stagger: .1,
        duration: .65,
        scrollTrigger: { trigger: '.service-process-list', start: 'top 82%', once: true },
      });
      gsap.fromTo('.service-process-line i', { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.service-process-list', start: 'top 82%', end: 'bottom 62%', scrub: .6 },
      });

      gsap.utils.toArray('.service-case').forEach((card) => {
        const image = card.querySelector('img');
        gsap.fromTo(image, { yPercent: -4, scale: 1.08 }, {
          yPercent: 4,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .7 },
        });
      });

      gsap.to('.service-final-o', {
        yPercent: -16,
        rotate: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.service-final', start: 'top bottom', end: 'bottom top', scrub: .7 },
      });
    }, '.service-page');

    return () => context.revert();
  }, []);
}
