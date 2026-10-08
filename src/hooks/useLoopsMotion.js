import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const REVEAL_BEFORE_END = 1.2;

export function useLoopsMotion() {
  useEffect(() => {
    const hero = document.querySelector('.hero');
    const video = document.querySelector('.hero-video');
    const nav = document.querySelector('.site-nav');
    const glass = document.querySelector('.hero-glass');
    const highlight = document.querySelector('.hero-glass-highlight');
    const lines = gsap.utils.toArray('.hero-line > span');
    const support = document.querySelector('.hero-support');
    const cta = document.querySelector('.hero-cta');
    const introSkip = document.querySelector('.hero-intro-skip');
    const scrollCue = document.querySelector('.hero-scroll-cue');
    const solveHeading = document.querySelector('.solve-heading');
    const solveCards = gsap.utils.toArray('.problem-tag');
    const solveNote = document.querySelector('.solve-note');
    const serviceIndex = document.querySelector('.service-index');
    const offerSection = document.querySelector('.offer-bridge');
    const offerHeading = document.querySelector('.offer-bridge h2');
    const offerScene = document.querySelector('.offer-scene');
    const offerVideo = document.querySelector('.offer-video');
    const offerRental = document.querySelector('.offer-state-rental');
    const offerCustom = document.querySelector('.offer-state-custom');
    const offerCustomCta = offerCustom?.querySelector('a');
    const offerProgress = document.querySelector('.offer-scroll-progress i');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hero || !video || !nav || !glass || lines.length === 0) return undefined;

    if (reduceMotion) {
      hero.classList.add('is-ready');
      gsap.set(nav, { opacity: 1, y: 0, filter: 'none' });
      gsap.set(glass, { opacity: 1 });
      gsap.set(highlight, { opacity: .32 });
      gsap.set(lines, { opacity: 1, yPercent: 0, filter: 'none' });
      gsap.set([support, cta, scrollCue], { opacity: 1, y: 0 });
      gsap.set(video, { scale: 1.02, opacity: .72 });
      gsap.set([offerHeading, offerScene], { opacity: 1, y: 0, filter: 'none', clipPath: 'inset(0 0 0% 0)' });
      gsap.set([offerCustom, offerCustomCta], { autoAlpha: 1, y: 0, filter: 'none' });
      gsap.set(offerRental, { autoAlpha: 0 });
      gsap.set(offerProgress, { scaleX: 1 });
      offerCustom?.style.setProperty('pointer-events', 'auto');
      video.pause();
      offerVideo?.play().catch(() => {});
      return undefined;
    }

    let revealStarted = false;
    let heroExitCreated = false;
    let disposed = false;
    let introTimeline;
    let removeVideoListeners = () => {};
    let removeIntroListeners = () => {};
    let removePointerListeners = () => {};
    let removeOfferVideoListeners = () => {};
    let stopOfferPlayback = () => {};
    let desktopMedia;
    let offerMedia;
    const heroMedia = gsap.matchMedia();

    const context = gsap.context(() => {
      if (window.__navAlreadyRevealed) {
        gsap.set(nav, { opacity: 1, y: 0, filter: 'none' });
      } else {
        gsap.set(nav, { opacity: .015, y: -10, filter: 'blur(7px)' });
      }
      gsap.set(lines, { opacity: 0, yPercent: 112, filter: 'blur(9px)' });
      gsap.set([support, cta], { opacity: 0, y: 14 });
      gsap.set(scrollCue, { opacity: 0, y: 10 });
      gsap.set([glass, highlight], { opacity: 0 });
      gsap.set([solveHeading, solveNote, serviceIndex], { opacity: 0 });
      gsap.set(solveCards, { opacity: 0 });

      const restoreHeroReadyState = () => {
        hero.classList.remove('is-revealing');
        hero.classList.add('is-ready');
        gsap.set('.hero-interface', { opacity: 1 });
        gsap.set(nav, { opacity: 1, y: 0, filter: 'none' });
        gsap.set(glass, { opacity: 1, backgroundColor: 'rgba(244, 243, 238, 0.08)' });
        gsap.set(highlight, { opacity: .32 });
        gsap.set(video, { opacity: .7, scale: 1.025, filter: 'none' });
        gsap.set(lines, {
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          filter: 'none',
          clipPath: 'inset(0 0 0% 0)',
        });
        gsap.set([support, cta], { opacity: 1, y: 0 });
        gsap.set(scrollCue, { opacity: .62, y: 0 });
      };

      const createHeroExit = () => {
        if (heroExitCreated) return;
        heroExitCreated = true;

        heroMedia.add('(min-width: 761px)', () => {
          const exit = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '+=150%',
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (self.direction < 0 && revealStarted) restoreHeroReadyState();
              },
            },
          });

          exit
            .to(support, { opacity: 0, y: -14, duration: .3 }, .2)
            .to(cta, { opacity: 0, y: 16, duration: .28 }, .22)
            .to(scrollCue, { opacity: 0, duration: .2 }, .2)
            .to(lines[0], { opacity: 0, xPercent: -5, yPercent: -45, filter: 'blur(7px)', clipPath: 'inset(0 0 100% 0)', duration: .28 }, .35)
            .to(lines[1], { opacity: 0, xPercent: 4, yPercent: -40, filter: 'blur(8px)', clipPath: 'inset(0 0 100% 0)', duration: .28 }, .43)
            .to(lines[2], { opacity: 0, xPercent: -4, yPercent: -38, filter: 'blur(7px)', clipPath: 'inset(0 0 100% 0)', duration: .26 }, .52)
            .to(video, { scale: 1.075, opacity: .08, filter: 'saturate(.74) brightness(1.1) blur(3px)', duration: .42 }, .55)
            .to(highlight, { opacity: .15, duration: .38 }, .56)
            .to(glass, { opacity: 1, backgroundColor: 'rgba(244, 243, 238, 0.92)', duration: .42 }, .55)
            .to(lines[3], { opacity: 0, xPercent: 3, yPercent: -34, filter: 'blur(9px)', clipPath: 'inset(0 0 100% 0)', duration: .26 }, .7)
            .to('.hero-interface', { opacity: 0, duration: .05 }, .95)
            .to(hero, { backgroundColor: '#f4f3ee', duration: .15 }, .85);
        });

        heroMedia.add('(max-width: 760px)', () => {
          const exit = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '+=85%',
              pin: true,
              pinSpacing: true,
              scrub: .7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (self.direction < 0 && revealStarted) restoreHeroReadyState();
              },
            },
          });

          exit
            .to([support, cta], { opacity: 0, y: 12, duration: .28 }, .16)
            .to(lines[0], { opacity: 0, yPercent: -34, filter: 'blur(5px)', duration: .25 }, .32)
            .to(lines[1], { opacity: 0, yPercent: -34, filter: 'blur(5px)', duration: .25 }, .42)
            .to(lines[2], { opacity: 0, yPercent: -30, filter: 'blur(5px)', duration: .24 }, .53)
            .to(video, { scale: 1.055, opacity: .08, filter: 'saturate(.78) brightness(1.1) blur(2px)', duration: .4 }, .55)
            .to(glass, { backgroundColor: 'rgba(244, 243, 238, 0.94)', duration: .4 }, .55)
            .to(lines[3], { opacity: 0, yPercent: -28, filter: 'blur(6px)', duration: .25 }, .69)
            .to('.hero-interface', { opacity: 0, duration: .06 }, .94);
        });

        heroMedia.add('(min-width: 761px)', () => {
          const solve = gsap.timeline({
            scrollTrigger: {
              trigger: '.solve-stage',
              start: 'top top',
              end: '+=115%',
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          solve
            .fromTo(solveHeading,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: .28, ease: 'power3.out' },
              .06,
            )
            .fromTo(solveCards,
              {
                opacity: 0,
                x: (index) => [-150, 135, -90, 120, -70][index],
                y: (index) => [75, -55, 90, -70, 55][index],
                rotate: (index) => [-14, 12, -8, 11, -12][index],
              },
              { opacity: 1, x: 0, y: 0, rotate: 0, stagger: .025, duration: .34 },
              .2,
            )
            .fromTo(serviceIndex, { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: .3 }, .42)
            .fromTo(solveNote, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .2 }, .72);
        });

        heroMedia.add('(max-width: 760px)', () => {
          gsap.timeline({
            scrollTrigger: {
              trigger: '.solve-stage',
              start: 'top top',
              end: '+=70%',
              pin: true,
              pinSpacing: true,
              scrub: .7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
            .fromTo(solveHeading, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .22 }, .05)
            .fromTo(solveCards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: .025, duration: .34 }, .22)
            .fromTo(serviceIndex, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .28 }, .48)
            .fromTo(solveNote, { opacity: 0 }, { opacity: 1, duration: .18 }, .75);
        });
      };

      // Create pin spacers before the intro finishes so late video reveal cannot reflow the page.
      createHeroExit();

      const beginReveal = (skip = false) => {
        if (revealStarted || disposed) return;
        revealStarted = true;

        if (skip) {
          window.__navAlreadyRevealed = true;
          video.play().catch(() => {});
          hero.classList.add('is-ready');
          gsap.set(nav, { opacity: 1, y: 0, filter: 'none' });
          gsap.set(glass, { opacity: 1 });
          gsap.set(highlight, { opacity: .32 });
          gsap.set(video, { opacity: .72, scale: 1.02, filter: 'none' });
          gsap.set(lines, { opacity: 1, yPercent: 0, filter: 'none' });
          gsap.set([support, cta, scrollCue], { opacity: 1, y: 0 });
          ScrollTrigger.refresh();
          return;
        }

        hero.classList.add('is-revealing');

        introTimeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            window.__navAlreadyRevealed = true;
            hero.classList.remove('is-revealing');
            hero.classList.add('is-ready');
            gsap.set([...lines, nav], { clearProps: 'filter' });
          },
        });

        introTimeline
          .to(glass, { opacity: 1, duration: 1.35, ease: 'power2.inOut' }, 0)
          .to(highlight, { opacity: .38, xPercent: 10, duration: 1.5, ease: 'power2.inOut' }, .05)
          .to(video, { opacity: .7, scale: 1.025, filter: 'saturate(.9) brightness(1.025)', duration: 1.45, ease: 'power2.inOut' }, 0)
          .to(nav, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, .18)
          .to(lines[0], { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: .78 }, .15)
          .to(lines[1], { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: .84 }, .30)
          .to(lines[2], { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: .72 }, .48)
          .to(lines[3], { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: .9, ease: 'power4.out' }, .65)
          .to(support, { opacity: 1, y: 0, duration: .62 }, .85)
          .to(cta, { opacity: 1, y: 0, duration: .58 }, 1)
          .to(scrollCue, { opacity: .62, y: 0, duration: .55 }, 1.08);
      };

      let lastTouch = 0;
      const handleIntroSkip = () => beginReveal(true);
      const handleHeroDoubleClick = (event) => {
        if (event.target.closest('a, button, input, textarea, select')) return;
        beginReveal(true);
      };
      const handleHeroTouch = (event) => {
        if (event.pointerType !== 'touch' || event.target.closest('a, button, input, textarea, select')) return;
        const now = Date.now();
        if (now - lastTouch < 360) beginReveal(true);
        lastTouch = now;
      };
      introSkip?.addEventListener('click', handleIntroSkip);
      hero.addEventListener('dblclick', handleHeroDoubleClick);
      hero.addEventListener('pointerup', handleHeroTouch);
      removeIntroListeners = () => {
        introSkip?.removeEventListener('click', handleIntroSkip);
        hero.removeEventListener('dblclick', handleHeroDoubleClick);
        hero.removeEventListener('pointerup', handleHeroTouch);
      };

      const handleMetadata = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.play().catch(() => beginReveal());
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      };

      const handleTimeUpdate = () => {
        if (!Number.isFinite(video.duration)) return;
        if (video.duration - video.currentTime <= REVEAL_BEFORE_END) beginReveal();
      };
      const handleVideoFinished = () => beginReveal();

      video.addEventListener('loadedmetadata', handleMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleVideoFinished);
      video.addEventListener('error', handleVideoFinished);
      removeVideoListeners = () => {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleVideoFinished);
        video.removeEventListener('error', handleVideoFinished);
      };
      if (video.readyState >= 1) handleMetadata();
      document.fonts?.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });

      gsap.to('.nav-shell', {
        minHeight: 52,
        scrollTrigger: { trigger: document.body, start: 'top -80', end: 'top -320', scrub: true },
      });

      gsap.utils.toArray('.text-reveal').forEach((element) => {
        gsap.fromTo(element,
          { opacity: 0, yPercent: 16 },
          { opacity: 1, yPercent: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: element, start: 'top 88%' }, onComplete: () => gsap.set(element, { clearProps: 'clipPath' }) },
        );
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%' } });
      });

      if (offerSection && offerHeading && offerScene && offerVideo && offerRental && offerCustom && offerCustomCta && offerProgress) {
        let offerMasterTimeline;

        const restartOfferVideo = () => {
          offerVideo.pause();
          offerVideo.currentTime = 0;
          offerVideo.playbackRate = 1;
          offerVideo.play().catch(() => {});
        };
        const pauseOfferVideo = () => offerVideo.pause();
        const handleOfferMetadata = () => ScrollTrigger.refresh();

        stopOfferPlayback = pauseOfferVideo;
        offerVideo.pause();
        offerVideo.addEventListener('loadedmetadata', handleOfferMetadata);
        removeOfferVideoListeners = () => offerVideo.removeEventListener('loadedmetadata', handleOfferMetadata);
        gsap.set([offerHeading, offerScene], { opacity: 0, y: 24, filter: 'blur(7px)' });
        gsap.set(offerRental, { autoAlpha: 0, y: 18, filter: 'blur(5px)', pointerEvents: 'none' });
        gsap.set(offerCustom, { autoAlpha: 0, y: 18, filter: 'blur(5px)', pointerEvents: 'none' });
        gsap.set(offerCustomCta, { autoAlpha: 0, y: 12 });
        gsap.set(offerProgress, { scaleX: 0 });

        const buildOfferTimeline = (isMobile) => {
          offerMasterTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: offerSection,
              start: 'top top',
              end: isMobile ? '+=110%' : '+=125%',
              scrub: isMobile ? .65 : 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: restartOfferVideo,
              onEnterBack: restartOfferVideo,
              onLeave: pauseOfferVideo,
              onLeaveBack: pauseOfferVideo,
            },
          });

          offerMasterTimeline
            .to(offerHeading, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .14, ease: 'power3.out' }, 0)
            .to(offerScene, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .13, ease: 'power3.out' }, .03)
            .to(offerRental, { autoAlpha: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'auto', duration: .16, ease: 'power3.out' }, .08)
            .to(offerProgress, { scaleX: .55, duration: .42, ease: 'none' }, .12)
            .to(offerRental, { autoAlpha: 0, y: -12, filter: 'blur(4px)', pointerEvents: 'none', duration: .12, ease: 'power2.inOut' }, .57)
            .to(offerCustom, { autoAlpha: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'auto', duration: .16, ease: 'power3.out' }, .64)
            .to(offerCustomCta, { autoAlpha: 1, y: 0, duration: .1, ease: 'power3.out' }, .73)
            .to(offerProgress, { scaleX: 1, duration: .27, ease: 'none' }, .73);

          return offerMasterTimeline;
        };

        offerMedia = gsap.matchMedia();
        offerMedia.add('(min-width: 761px)', () => buildOfferTimeline(false));
        offerMedia.add('(max-width: 760px)', () => buildOfferTimeline(true));
      }

      desktopMedia = gsap.matchMedia();
      desktopMedia.add('(min-width: 761px)', () => {
        gsap.fromTo('.works-glow',
          { xPercent: -14, yPercent: -8, scale: .82 },
          { xPercent: 18, yPercent: 20, scale: 1.16, ease: 'none', scrollTrigger: { trigger: '.works-section', start: 'top bottom', end: 'bottom top', scrub: 1 } },
        );

        gsap.utils.toArray('.project-panel').forEach((panel, index) => {
          const image = panel.querySelector('img, video');
          const copy = panel.querySelector('.project-copy');
          const topline = panel.querySelector('.project-topline');
          const arrow = panel.querySelector(':scope > a');

          gsap.timeline({
            scrollTrigger: { trigger: panel, start: 'top 92%', end: 'top 16%', scrub: 1, invalidateOnRefresh: true },
          })
            .fromTo(panel,
              { clipPath: 'inset(12% 5% 10% 5%)', scale: .94, rotateX: 2.5 },
              { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, rotateX: 0, ease: 'none' },
              0,
            )
            .fromTo(image, { scale: 1.2, yPercent: -1 }, { scale: 1.07, yPercent: -7, ease: 'none' }, 0)
            .fromTo(copy, { xPercent: -8, opacity: .2 }, { xPercent: 0, opacity: 1, ease: 'none' }, .18)
            .fromTo(topline, { y: -22, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, .18)
            .fromTo(arrow, { scale: .5, rotate: -45, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, ease: 'none' }, .35);

          gsap.timeline({
            scrollTrigger: { trigger: panel, start: 'top 8.5%', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
          })
            .to(image, { yPercent: -12 - index, scale: 1.01, ease: 'none' }, 0)
            .to(copy, { yPercent: -12, ease: 'none' }, 0)
            .to(panel, { scale: .925, yPercent: -3, ease: 'none' }, .42);
        });

        const signalTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.signal-stage',
            start: 'top 9%',
            end: '+=180%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        signalTimeline
          .fromTo('.signal-surface', { opacity: 0, scale: 1.16, clipPath: 'inset(48% 36% 48% 36%)' }, { opacity: .18, scale: 1, clipPath: 'inset(14% 12% 14% 12%)', duration: .32 }, 0)
          .fromTo('.signal-word-a', { xPercent: -65 }, { xPercent: 0, duration: .32 }, .02)
          .fromTo('.signal-image-a', { xPercent: 65, yPercent: -18, rotate: 11, clipPath: 'inset(0 0 100% 0)' }, { xPercent: 0, yPercent: 0, rotate: 2, clipPath: 'inset(0 0 0% 0)', duration: .38 }, .08)
          .fromTo('.signal-image-d', { xPercent: -80, rotate: -14, opacity: 0 }, { xPercent: 0, rotate: -5, opacity: 1, duration: .34 }, .16)
          .fromTo('.signal-word-b', { xPercent: 72, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .3 }, .27)
          .fromTo('.signal-image-c', { yPercent: 70, rotate: 14, scale: .72, clipPath: 'inset(100% 0 0 0)' }, { yPercent: 0, rotate: 4, scale: 1, clipPath: 'inset(0% 0 0 0)', duration: .38 }, .31)
          .fromTo('.signal-image-b', { xPercent: -62, yPercent: 28, rotate: -13, clipPath: 'inset(0 100% 0 0)' }, { xPercent: 0, yPercent: 0, rotate: -3, clipPath: 'inset(0 0% 0 0)', duration: .42 }, .38)
          .fromTo('.signal-video', { xPercent: 70, yPercent: 30, rotate: 11, opacity: 0 }, { xPercent: 0, yPercent: 0, rotate: 2, opacity: 1, duration: .38 }, .44)
          .fromTo('.signal-o', { scale: .2, rotate: -60, opacity: 0 }, { scale: 1, rotate: 10, opacity: 1, duration: .34 }, .52)
          .fromTo('.signal-word-c', { xPercent: 54, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .3 }, .58)
          .fromTo('.signal-chip', { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, stagger: .035, duration: .22 }, .64)
          .to('.signal-image-a', { yPercent: -10, rotate: -1, duration: .3 }, .7)
          .to('.signal-image-b', { xPercent: 5, yPercent: -8, rotate: 1, duration: .3 }, .7)
          .to('.signal-video', { yPercent: -12, rotate: -2, duration: .3 }, .7)
          .to('.signal-o', { yPercent: -22, rotate: 24, scale: 1.08, duration: .3 }, .7);

        const playgroundTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.playground-canvas',
            start: 'top 8%',
            end: '+=125%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        playgroundTimeline
          .fromTo('.playground-surface', { scale: 1.18, opacity: .08 }, { scale: 1, opacity: .3, duration: .35 }, 0)
          .fromTo('.playground-crop:not(.playground-crop-secondary)', { xPercent: -65, yPercent: 22, rotate: -12 }, { xPercent: 0, yPercent: 0, rotate: -4, duration: .4 }, .02)
          .fromTo('.playground-crop-secondary', { xPercent: 70, yPercent: -24, rotate: 14 }, { xPercent: 0, yPercent: 0, rotate: 4, duration: .4 }, .08)
          .fromTo('.playground-o', { scale: .62, rotate: -16, opacity: .2 }, { scale: 1, rotate: 8, opacity: 1, duration: .5 }, .12)
          .fromTo('.playground-controls', { xPercent: 42, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .32 }, .34)
          .to('.playground-o', { y: -22, rotate: -7, scale: 1.06, duration: .45 }, .55)
          .to('.playground-crop:not(.playground-crop-secondary)', { yPercent: -16, rotate: 1, duration: .4 }, .57)
          .to('.playground-crop-secondary', { yPercent: 13, rotate: -2, duration: .4 }, .57);
      });

      desktopMedia.add('(max-width: 760px)', () => {
        gsap.utils.toArray('.project-panel').forEach((panel) => {
          const image = panel.querySelector('img, video');
          gsap.fromTo(image, { scale: 1.12, yPercent: -3 }, { scale: 1.02, yPercent: -10, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 92%', end: 'bottom 10%', scrub: .7 } });
        });
        gsap.fromTo('.signal-image-a', { xPercent: 28, rotate: 8 }, { xPercent: -8, rotate: 1, ease: 'none', scrollTrigger: { trigger: '.signal-stage', start: 'top 88%', end: 'bottom 14%', scrub: .7 } });
        gsap.fromTo('.signal-image-b', { xPercent: -24, rotate: -9 }, { xPercent: 5, rotate: -2, ease: 'none', scrollTrigger: { trigger: '.signal-stage', start: 'top 88%', end: 'bottom 14%', scrub: .7 } });
        gsap.fromTo('.signal-o', { yPercent: 24, rotate: -12 }, { yPercent: -18, rotate: 16, ease: 'none', scrollTrigger: { trigger: '.signal-stage', start: 'top 88%', end: 'bottom 14%', scrub: .7 } });
        gsap.fromTo('.playground-crop', { yPercent: 18 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.playground-canvas', start: 'top 90%', end: 'bottom 10%', scrub: .7 } });
      });

      const finalTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.final-cta', start: 'top 82%', end: 'top 8%', scrub: 1, invalidateOnRefresh: true },
      });
      finalTimeline
        .fromTo('.final-fragment-a', { xPercent: 50, yPercent: -35, rotate: 15, opacity: 0 }, { xPercent: -58, yPercent: 55, rotate: 1, opacity: .66, duration: .5 }, 0)
        .fromTo('.final-fragment-b', { xPercent: -55, yPercent: 45, rotate: -16, opacity: 0 }, { xPercent: 80, yPercent: -50, rotate: -1, opacity: .58, duration: .5 }, 0)
        .fromTo('.final-line', { xPercent: -10, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .46 }, .16)
        .fromTo('.final-loop', { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .46 }, .26)
        .fromTo('.final-bottom', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .32 }, .54)
        .to('.final-fragment', { scale: .5, xPercent: 0, yPercent: 0, opacity: 0, duration: .32 }, .65)
        .fromTo('.final-loop img', { rotate: -35, scale: .72 }, { rotate: 10, scale: 1, duration: .46 }, .4);

      const playgroundCanvas = document.querySelector('.playground-canvas');
      const playgroundPointer = document.querySelector('.playground-pointer');
      if (playgroundCanvas && playgroundPointer && window.matchMedia('(pointer: fine)').matches) {
        const pointerX = gsap.quickTo(playgroundPointer, 'x', { duration: .5, ease: 'power3.out' });
        const pointerY = gsap.quickTo(playgroundPointer, 'y', { duration: .5, ease: 'power3.out' });
        const handlePointerMove = (event) => {
          const bounds = playgroundCanvas.getBoundingClientRect();
          pointerX(event.clientX - bounds.left - bounds.width / 2);
          pointerY(event.clientY - bounds.top - bounds.height / 2);
        };
        const resetPointer = () => { pointerX(0); pointerY(0); };
        playgroundCanvas.addEventListener('pointermove', handlePointerMove);
        playgroundCanvas.addEventListener('pointerleave', resetPointer);
        removePointerListeners = () => {
          playgroundCanvas.removeEventListener('pointermove', handlePointerMove);
          playgroundCanvas.removeEventListener('pointerleave', resetPointer);
        };
      }

    });

    return () => {
      disposed = true;
      removeVideoListeners();
      removeOfferVideoListeners();
      stopOfferPlayback();
      removeIntroListeners();
      removePointerListeners();
      introTimeline?.kill();
      heroMedia.revert();
      offerMedia?.revert();
      desktopMedia?.revert();
      context.revert();
    };
  }, []);
}
