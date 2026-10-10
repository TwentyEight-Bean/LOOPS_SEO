import { useState } from 'react';
import {
  ArrowUpRight,
  Pause,
  Play,
  SkipForward,
  SlidersHorizontal,
} from 'lucide-react';
import priceMotionVideo from '../Asset/Video_Price_2.mp4';
import { useLoopsMotion } from './hooks/useLoopsMotion';
import { useLanguage } from './context/LanguageContext';
import './styles.css';

function SectionLabel({ index, children, light = false }) {
  return (
    <div className={`section-label${light ? ' is-light' : ''}`}>
      <span>{index}</span><i /> <strong>{children}</strong>
    </div>
  );
}

function isVideoMedia(src = '', mediaType = '') {
  const normalizedType = String(mediaType).toLowerCase();
  const normalizedSrc = String(src).split('?')[0].toLowerCase();
  return (
    normalizedType === 'video' ||
    normalizedSrc.startsWith('data:video/') ||
    /\.(mp4|webm|mov|m4v|ogg)$/i.test(normalizedSrc)
  );
}

function MediaVisual({ src, alt = '', mediaType = '', className = '', decorative = false }) {
  if (isVideoMedia(src, mediaType)) {
    return (
      <video
        className={className}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={decorative ? undefined : alt}
        aria-hidden={decorative ? 'true' : undefined}
      />
    );
  }

  return <img className={className} src={src} alt={decorative ? '' : alt} aria-hidden={decorative ? 'true' : undefined} />;
}

function Hero() {
  const { t, media, resolveMedia } = useLanguage();

  return (
    <section id="home" className="hero">
      <video
        className="hero-video"
        src={resolveMedia(media.heroVideo || "/assets/hero-loops.mp4")}
        poster={resolveMedia(media.heroPoster || "/assets/projects/project-01.jpg")}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
      />
      <div className="hero-glass" aria-hidden="true" />
      <div className="hero-glass-highlight" aria-hidden="true" />

      <div className="hero-interface">
        <h1 className="hero-title">
          <span className="hero-line hero-line-1"><span>{t.hero?.line1 || 'BIẾN'}</span></span>
          <span className="hero-line hero-line-2"><span>{t.hero?.line2 || 'PHỨC TẠP'}</span></span>
          <span className="hero-line hero-line-3"><span>{t.hero?.line3 || 'THÀNH'}</span></span>
          <span className="hero-line hero-line-4"><span>{t.hero?.line4 || 'RÕ RÀNG.'}</span></span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-support">{t.hero?.support || 'Trải nghiệm số, thương hiệu và hệ thống cho một ngày mai kết nối hơn.'}</p>
          <a className="button button-blue hero-cta" href="#work">
            {t.hero?.exploreWorks || 'Xem dự án'} <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <span className="hero-scroll-cue" aria-hidden="true">{t.hero?.scrollCue || 'Cuộn để khám phá'}</span>
      <button className="hero-intro-skip" type="button" aria-label={t.hero?.skipIntro || 'Bỏ qua intro'}>
        <span>{t.hero?.skipIntro || 'Bỏ qua intro'}</span><SkipForward size={15} />
      </button>
    </section>
  );
}

function WhatWeSolve() {
  const { t } = useLanguage();
  const solveData = t.solve || {};
  const problems = solveData.problems || ['WEBSITE CHẬM', 'UX TỆ', 'THIẾU BẢN SẮC', 'HỆ THỐNG RỐI', 'NỘI DUNG NHẠT'];
  const pillars = solveData.pillars || [
    { title: 'BUILD', services: 'Landing Page / Business Website / E-commerce / Web App / Dashboard / UI/UX' },
    { title: 'GROW', services: 'SEO / Content / Analytics / Conversion Optimization / Email Marketing' },
    { title: 'OPERATE', services: 'Hosting / SSL / Maintenance / Backup / CRM Integration / ERP Integration / Marketing Automation / Technical Support' },
  ];

  return (
    <section id="services" className="solve-section">
      <div className="tech-grid" />
      <div className="solve-stage">
        <SectionLabel index="01">{solveData.sectionLabel || 'Điều chúng tôi giải quyết'}</SectionLabel>
        <div className="solve-heading">
          <span>{solveData.word1 || 'VẤN ĐỀ'}</span>
          <span>{solveData.word2 || 'THỰC TẾ.'}</span>
          <span className="outline-word">{solveData.wordOutline || 'KẾT QUẢ'}</span>
          <span>{solveData.word4 || 'THỰC.'}</span>
        </div>

        <div className="problem-system" aria-label="Những vấn đề thường gặp">
          {problems.map((problem, index) => (
            <div key={problem} className={`problem-tag problem-tag-${index + 1}`}>
              <span>0{index + 1}</span>{problem}
            </div>
          ))}
        </div>

        <div className="solve-note">
          <span>{solveData.notePillars || '03 trụ cột dịch vụ'}</span>
          <strong>{solveData.noteSystem || '01 hệ thống kết nối'}</strong>
        </div>

        <div className="service-index">
          {pillars.map((pillar, index) => (
            <article className="service-index-row" key={pillar.title}>
              <span>0{index + 1}</span>
              <div>
                <strong>{pillar.title}</strong>
                <small>{pillar.services}</small>
              </div>
              <ArrowUpRight size={22} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessOfferBridge() {
  const { t, media, resolveMedia } = useLanguage();
  const offersData = t.offers || {};

  return (
    <section id="offers" className="offer-bridge" aria-labelledby="offer-bridge-title">
      <div className="tech-grid" aria-hidden="true" />
      <div className="offer-bridge-inner">
        <SectionLabel index="02">{offersData.sectionLabel || 'Hai cách bắt đầu'}</SectionLabel>
        <div className="offer-bridge-layout">
          <div className="offer-bridge-copy">
            <p className="offer-bridge-kicker">{offersData.kicker || 'Website Rental / Custom Website'}</p>
            <h2 id="offer-bridge-title">
              {offersData.title1 || 'START SMALL.'}<br />
              <span>{offersData.title2 || 'SCALE WHEN READY.'}</span>
            </h2>
            <div className="offer-progression" aria-hidden="true">
              <span>{offersData.progressStart || 'Khởi đầu'}</span>
              <i />
              <span>{offersData.progressScale || 'Mở rộng'}</span>
            </div>
          </div>

          <div className="offer-scene">
            <div className="offer-video-frame">
              <video
                className="offer-video"
                src={resolveMedia(media.offersVideo || priceMotionVideo)}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Website phát triển từ gói thuê cơ bản thành hệ thống tùy chỉnh"
              />
              <div className="offer-video-wash" aria-hidden="true" />
              <div className="offer-scene-index" aria-hidden="true"><span>01</span><i /><span>02</span></div>

              <div className="offer-state offer-state-rental">
                <span className="offer-state-label">{offersData.rentalLabel || 'Website Rental'}</span>
                <div className="offer-state-price">
                  <strong>{offersData.rentalPrice || '189.000đ'}</strong>
                  <span>{offersData.rentalUnit || '/ tháng'}</span>
                </div>
                <a className="button button-blue" href="/services/website-rental/">
                  {offersData.rentalCta || 'Tìm hiểu thuê website'} <ArrowUpRight size={18} />
                </a>
                <a className="offer-pricing-link" href="/pricing">
                  {offersData.pricingLink || 'Xem bảng giá'}
                </a>
              </div>

              <div className="offer-state offer-state-custom">
                <span className="offer-state-label">{offersData.customLabel || 'Custom Website'}</span>
                <p>{offersData.customDesc || 'Thiết kế và phát triển hệ thống riêng khi doanh nghiệp cần mở rộng.'}</p>
                <a className="offer-custom-link" href="/services/website-design/">
                  {offersData.customCta || 'Thiết kế website riêng'} <ArrowUpRight size={18} />
                </a>
              </div>

              <div className="offer-scroll-progress" aria-hidden="true"><i /></div>
              <span className="offer-frame-caption" aria-hidden="true">
                {offersData.caption || 'Rental → Scale → Custom'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectedConcepts() {
  const { t, resolveMedia } = useLanguage();
  const worksData = t.works || {};
  const concepts = worksData.concepts || [
    { title: 'Khám phá thương hiệu F&B', type: 'Bản sắc / Web / Nội dung', image: '/assets/projects/project-01.jpg' },
    { title: 'Nền tảng công nghệ tương lai', type: 'Sản phẩm / Hệ thống / UX', image: '/assets/projects/project-02.jpg' },
    { title: 'Hệ thống nội dung phong cách sống', type: 'Vận hành / Nội dung / Giao diện', image: '/assets/projects/project-03.jpg' },
    { title: 'Thử nghiệm chiến dịch sáng tạo', type: 'Ra mắt / Chuyển động / Thương hiệu', image: '/assets/projects/project-04.jpg' },
  ];

  return (
    <section id="work" className="works-section">
      <div className="works-glow" aria-hidden="true" />
      <div className="works-intro">
        <SectionLabel index="03" light>{worksData.sectionLabel || 'SELECTED CONCEPTS'}</SectionLabel>
        <h2 className="text-reveal">
          {worksData.title1 || 'Ý TƯỞNG'}<br />
          <span>{worksData.title2 || 'BỀN VỮNG.'}</span>
        </h2>
        <p className="reveal">{worksData.desc || 'Thử nghiệm ý tưởng và khám phá giao diện thị giác bởi LOOPS.'}</p>
        <div className="works-counter" aria-hidden="true">
          <b>{worksData.counterNumber || '04'}</b>
          <span>{worksData.counterLabel || 'Concepts / Khám phá thị giác'}</span>
        </div>
      </div>

      <div className="project-deck">
        {concepts.map((project, index) => (
          <article className="project-panel" key={project.title} data-project={`0${index + 1}`}>
            <figure className="project-media">
              <MediaVisual src={resolveMedia(project.image)} alt={project.title} mediaType={project.mediaType} />
              <div className="project-shade" />
            </figure>
            <div className="project-topline">
              <div className="project-number">0{index + 1}</div>
              <div className="project-meta">{project.type}</div>
              <span className="project-state">LOOPS / CONCEPT 0{index + 1}</span>
            </div>
            <div className="project-copy">
              <span>Concept / 0{index + 1}</span>
              <h3>{project.title}</h3>
            </div>
            <a href="#start" aria-label={`${worksData.exploreAria || 'Khám phá'} ${project.title}`}>
              <ArrowUpRight size={26} />
            </a>
            <span className="project-edge" aria-hidden="true">SCROLL / EXPLORE / 0{index + 1}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromoCollage() {
  const { t, media, resolveMedia } = useLanguage();
  const signalsData = t.signals || {};

  return (
    <section className="signal-section">
      <div className="tech-grid" />
      <div className="signal-head">
        <SectionLabel index="04">{signalsData.sectionLabel || 'Tín hiệu LOOPS'}</SectionLabel>
        <span>{signalsData.subtitle || 'Hình ảnh / chuyển động / hệ thống'}</span>
      </div>
      <div className="signal-stage">
        <figure className="signal-surface"><MediaVisual src={resolveMedia(media.liquidSurface || "/assets/liquid-surface.jpg")} alt="Bề mặt chất lỏng trong suốt" /></figure>
        <div className="signal-word signal-word-a">{signalsData.wordA || 'TẠO'}</div>
        <div className="signal-word signal-word-b">{signalsData.wordB || 'RA'}</div>
        <div className="signal-word signal-word-c">{signalsData.wordC || 'NHỊP.'}</div>

        <figure className="signal-image signal-image-a"><MediaVisual src={resolveMedia(media.project05 || "/assets/projects/project-05.jpg")} alt="Không gian thương hiệu F&B" /></figure>
        <figure className="signal-image signal-image-b"><MediaVisual src={resolveMedia(media.project04 || "/assets/projects/project-04.jpg")} alt="Giao diện công nghệ sáng tạo" /></figure>
        <figure className="signal-image signal-image-c"><MediaVisual src={resolveMedia(media.project07 || "/assets/projects/project-07.jpg")} alt="Tương tác với hệ thống nội dung" /></figure>
        <figure className="signal-image signal-image-d"><MediaVisual src={resolveMedia(media.project06 || "/assets/projects/project-06.jpg")} alt="Không gian phong cảnh phản chiếu" /></figure>
        <figure className="signal-video">
          <MediaVisual src={resolveMedia(media.liquidLoop || "/assets/liquid-loop.mp4")} alt={signalsData.caption || 'Thí nghiệm hình thái / O.01'} />
          <figcaption>{signalsData.caption || 'Thí nghiệm hình thái / O.01'}</figcaption>
        </figure>
        <div className="signal-o">
          <MediaVisual src={resolveMedia(media.liquidO || "/assets/liquid-o.png")} alt="Hình ảnh chữ O chất lỏng" />
        </div>

        <div className="signal-chip signal-chip-a">{signalsData.chipA || 'HỆ THỐNG THƯƠNG HIỆU / ĐANG CHẠY'}</div>
        <div className="signal-chip signal-chip-b">{signalsData.chipB || 'NHẬN DIỆN CHUYỂN ĐỘNG / 2027'}</div>
        <div className="signal-chip signal-chip-c">{signalsData.chipC || 'TẦN SỐ / 60 FPS'}</div>
        <div className="signal-axis">X 108.02 / Y 75.44</div>
        <div className="signal-progress" aria-hidden="true"><i /><span>03 — 05</span></div>
      </div>
      <div className="signal-ticker" aria-hidden="true">
        <div>{signalsData.ticker || 'TƯ DUY HỆ THỐNG • CHUYỂN ĐỘNG CÓ CHỦ ĐÍCH • HÌNH ẢNH TẠO NHỊP • TƯ DUY HỆ THỐNG • CHUYỂN ĐỘNG CÓ CHỦ ĐÍCH • HÌNH ẢNH TẠO NHỊP'}</div>
      </div>
    </section>
  );
}

function Playground() {
  const { t, media, resolveMedia } = useLanguage();
  const playData = t.playground || {};
  const [values, setValues] = useState({ flow: 68, depth: 44, energy: 82 });
  const [playing, setPlaying] = useState(true);

  const updateValue = (key, value) => setValues((current) => ({ ...current, [key]: Number(value) }));
  const visualStyle = {
    '--o-scale': 0.86 + values.depth / 500,
    '--o-rotate': `${(values.flow - 50) * 0.16}deg`,
    '--o-saturate': 0.75 + values.energy / 140,
  };

  const labels = {
    flow: playData.flow || 'Nhịp',
    depth: playData.depth || 'Độ sâu',
    energy: playData.energy || 'Năng lượng',
  };

  return (
    <section className="playground-section">
      <div className="tech-grid" />
      <div className="playground-head">
        <SectionLabel index="05">{playData.sectionLabel || 'Sân chơi'}</SectionLabel>
        <h2 className="text-reveal">
          {playData.title1 || 'CHƠI CÙNG'}<br />
          <span>{playData.title2 || 'Ý TƯỞNG.'}</span>
        </h2>
        <p className="reveal">{playData.desc || 'Một thử nghiệm trực tiếp về độ sâu, nhịp điệu và hành vi thị giác.'}</p>
      </div>

      <div className={`playground-canvas${playing ? ' is-playing' : ''}`} style={visualStyle}>
        <MediaVisual className="playground-surface" src={resolveMedia(media.liquidSurface || "/assets/liquid-surface.jpg")} decorative />
        <div className="playground-cross cross-a" /><div className="playground-cross cross-b" />
        <div className="playground-code">LOOPS.O / DIGITAL ENTITY</div>
        <div className="playground-orbit" aria-hidden="true"><span>FLOW / FORM / FEEL / FUTURE /</span></div>
        <MediaVisual className="playground-o" src={resolveMedia(media.liquidO || "/assets/liquid-o.png")} alt="Chữ O chất lỏng tương tác" />
        <figure className="playground-crop"><MediaVisual src={resolveMedia(media.project02 || "/assets/projects/project-02.jpg")} alt="Chi tiết giao diện sản phẩm" /></figure>
        <figure className="playground-crop playground-crop-secondary"><MediaVisual src={resolveMedia(media.project08 || "/assets/projects/project-08.jpg")} alt="Thử nghiệm giao diện và hình ảnh" /></figure>
        <div className="playground-readout" aria-hidden="true">
          <span>INPUT / 032</span><i /><span>OUTPUT / LIVE</span>
        </div>
        <div className="playground-pointer" aria-hidden="true"><span /></div>

        <div className="playground-controls">
          <div className="controls-title">
            <SlidersHorizontal size={18} />
            <span>{playData.controlsTitle || 'Điều khiển chuyển động'}</span>
          </div>
          {Object.entries(values).map(([key, value]) => (
            <label key={key}>
              <span>{labels[key]}</span><output>{value}</output>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(event) => updateValue(key, event.target.value)}
              />
            </label>
          ))}
          <button type="button" onClick={() => setPlaying((value) => !value)}>
            {playing ? <Pause size={17} /> : <Play size={17} />}
            {playing ? (playData.pause || 'Tạm dừng') : (playData.play || 'Chạy chuyển động')}
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t, media, resolveMedia } = useLanguage();
  const ctaData = t.finalCta || {};

  return (
    <section id="start" className="final-cta">
      <div className="tech-grid" />
      <figure className="final-fragment final-fragment-a" aria-hidden="true"><MediaVisual src={resolveMedia(media.project06 || "/assets/projects/project-06.jpg")} decorative /></figure>
      <figure className="final-fragment final-fragment-b" aria-hidden="true"><MediaVisual src={resolveMedia(media.project08 || "/assets/projects/project-08.jpg")} decorative /></figure>
      <span className="final-axis final-axis-a" aria-hidden="true">LOOPS / 05 / CONNECT</span>
      <span className="final-axis final-axis-b" aria-hidden="true">16.0471° N / 108.2068° E</span>
      <SectionLabel index="06" light>{ctaData.sectionLabel || 'Vòng lặp tiếp theo'}</SectionLabel>
      <div className="final-title">
        <span className="final-line">{ctaData.line1 || 'BẮT ĐẦU'}</span>
        <span className="final-loop">V<i><MediaVisual src={resolveMedia(media.liquidO || "/assets/liquid-o.png")} alt="O" /></i>{ctaData.line2 || 'NG.'}</span>
      </div>
      <div className="final-bottom">
        <p>{ctaData.bottomText || 'Cùng xây dựng điều có ý nghĩa.'}</p>
        <a
          className="button button-light"
          href={ctaData.buttonLink || "https://www.loops.vn/bao-gia"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaData.button || 'Bắt đầu dự án'} <ArrowUpRight size={19} />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  const footerData = t.footer || {};

  return (
    <footer>
      <div className="footer-loop" aria-hidden="true">
        <span>{footerData.loop || 'LOOPS / MAKE IT CLEAR / MAKE IT MOVE / LOOPS / MAKE IT CLEAR / MAKE IT MOVE /'}</span>
      </div>
      <div className="footer-meta">
        <strong>{footerData.company || 'CÔNG TY LOOPS'}</strong>
        <span>{footerData.subtitle || 'Công nghệ sáng tạo / Việt Nam + Toàn cầu'}</span>
        <nav className="footer-links" aria-label="Dịch vụ và bảng giá">
          <a href="/pricing">{t.nav?.rental || 'Thuê website'}</a>
          <a href="/services/website-design/">{t.nav?.customDesign || 'Website riêng'}</a>
          <a href="/pricing">{t.nav?.pricing || 'Bảng giá'}</a>
          <a href="/admin" style={{ color: 'var(--admin-accent, #3b82f6)', fontWeight: 700 }}>CMS Admin</a>
        </nav>
        <a href={`mailto:${footerData.email || 'hello@loops.company'}`}>
          {footerData.email || 'hello@loops.company'}
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  useLoopsMotion();

  return (
    <>
      <main>
        <Hero />
        <WhatWeSolve />
        <BusinessOfferBridge />
        <SelectedConcepts />
        <PromoCollage />
        <Playground />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
