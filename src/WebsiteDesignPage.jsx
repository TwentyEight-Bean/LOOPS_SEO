import { useEffect } from 'react';
import {
  AppWindow,
  ArrowUpRight,
  Building2,
  Check,
  Frame,
  Megaphone,
  PanelTop,
  ShoppingBag,
} from 'lucide-react';
import { useServicePageMotion } from './hooks/useServicePageMotion';
import { useLanguage } from './context/LanguageContext';
import SiteHeader from './SiteHeader';
import './website-design.css';

const canonicalUrl = 'https://loops.company/services/website-design/';

const buildTypes = [
  { icon: PanelTop, title: 'Landing Page', description: 'Trang tập trung vào một sản phẩm, chiến dịch hoặc mục tiêu chuyển đổi cụ thể.' },
  { icon: Building2, title: 'Business Website', description: 'Website doanh nghiệp trình bày rõ thương hiệu, năng lực, sản phẩm và thông tin liên hệ.' },
  { icon: ShoppingBag, title: 'E-commerce', description: 'Website bán hàng với cấu trúc sản phẩm, giỏ hàng và hành trình mua sắm responsive.' },
  { icon: Frame, title: 'Custom Website', description: 'Website có cấu trúc, giao diện và chức năng được thiết kế theo quy trình riêng.' },
  { icon: AppWindow, title: 'Web App', description: 'Ứng dụng chạy trên trình duyệt cho nghiệp vụ, cổng thông tin hoặc sản phẩm số.' },
  { icon: AppWindow, title: 'Dashboard', description: 'Giao diện theo dõi dữ liệu, vận hành và báo cáo theo vai trò người dùng.' },
  { icon: Megaphone, title: 'UI/UX', description: 'Kiến trúc thông tin, luồng sử dụng và hệ thống giao diện cho website hoặc sản phẩm số.' },
];

const capabilities = [
  ['Responsive Design', 'Bố cục thích ứng với desktop, tablet và điện thoại.'],
  ['Hosting', 'Môi trường lưu trữ phù hợp với gói dịch vụ hoặc yêu cầu dự án.'],
  ['SSL', 'Kết nối HTTPS giúp bảo vệ dữ liệu trao đổi với website.'],
  ['SEO-ready Structure', 'Heading, semantic HTML, metadata và cấu trúc nội dung thuận lợi cho việc lập chỉ mục.'],
  ['Google Analytics', 'Thiết lập đo lường các hành động quan trọng khi phạm vi dự án yêu cầu.'],
  ['Contact Forms', 'Biểu mẫu liên hệ, đăng ký hoặc thu thập yêu cầu phù hợp với luồng chuyển đổi.'],
  ['CMS / Content Management', 'Công cụ quản trị giúp đội ngũ cập nhật nội dung theo cấu trúc đã thiết kế.'],
  ['CRM Integration', 'Kết nối dữ liệu khách hàng với CRM khi hệ thống và gói triển khai phù hợp.'],
  ['Email Marketing Setup', 'Thiết lập điểm nhận dữ liệu và luồng email theo nhu cầu marketing.'],
  ['Marketing Automation', 'Tự động hóa các bước xử lý dữ liệu hoặc chăm sóc khách hàng theo phạm vi riêng.'],
  ['Maintenance & Backup', 'Bảo trì và sao lưu theo gói vận hành được lựa chọn.'],
  ['Technical Support', 'Hỗ trợ kỹ thuật sau triển khai theo thỏa thuận của từng gói hoặc dự án.'],
];

const processSteps = [
  ['01', 'Tìm hiểu nhu cầu', 'Làm rõ mục tiêu, người dùng, nội dung, ngân sách và hệ thống đang có.'],
  ['02', 'Đề xuất giải pháp', 'Chọn hướng thuê website hoặc thiết kế riêng cùng phạm vi phù hợp.'],
  ['03', 'Thiết kế giao diện', 'Xây cấu trúc, luồng responsive và giao diện bám sát thương hiệu.'],
  ['04', 'Phát triển & tích hợp', 'Lập trình website và kết nối các công cụ cần thiết trong phạm vi dự án.'],
  ['05', 'Kiểm thử', 'Kiểm tra nội dung, form, tương tác, thiết bị và các yêu cầu kỹ thuật.'],
  ['06', 'Triển khai', 'Đưa website lên môi trường hoạt động và hoàn thiện cấu hình cần thiết.'],
  ['07', 'Hỗ trợ & tối ưu', 'Bảo trì, cập nhật và cải thiện website theo gói vận hành hoặc nhu cầu phát sinh.'],
];

const selectedConcepts = [
  {
    image: '/assets/projects/project-05.jpg',
    title: 'Khái niệm website F&B',
    industry: 'Ẩm thực / đồ uống',
    services: 'Concept Work / Website / Nội dung',
    focus: 'Khám phá cách một website F&B có thể kết nối không gian, thực đơn và thông tin địa điểm.',
    approach: 'Bố cục biên tập ưu tiên hình ảnh, thông tin thiết yếu và đường dẫn liên hệ rõ ràng.',
  },
  {
    image: '/assets/projects/project-02.jpg',
    title: 'Khái niệm nền tảng công nghệ',
    industry: 'Công nghệ',
    services: 'Concept Work / UX / Hệ thống',
    focus: 'Thử nghiệm cách trình bày sản phẩm phức tạp qua các module nội dung và dữ liệu.',
    approach: 'Hệ thống giao diện phân tầng thông tin để người dùng khám phá từ tổng quan đến chi tiết.',
  },
  {
    image: '/assets/projects/project-08.jpg',
    title: 'Khái niệm portfolio biên tập',
    industry: 'Văn hóa / phong cách sống',
    services: 'Concept Work / Portfolio / Art direction',
    focus: 'Khám phá cấu trúc portfolio cho nhiều loại dự án và định dạng media.',
    approach: 'Nhịp nội dung linh hoạt, chú thích ngắn và hệ thống điều hướng nhất quán.',
  },
];

const qualityItems = [
  ['Cấu trúc semantic', 'HTML và thứ bậc nội dung giúp trình duyệt, công cụ tìm kiếm và người dùng hiểu trang.'],
  ['Responsive', 'Bố cục được thiết kế và kiểm tra trên desktop, tablet và điện thoại.'],
  ['Tốc độ tải', 'Giảm tài nguyên không cần thiết và lựa chọn cách tải phù hợp cho từng loại nội dung.'],
  ['SEO technical fundamentals', 'Metadata, heading, internal link và khả năng crawl được chuẩn bị trong cấu trúc.'],
  ['Hình ảnh tối ưu', 'Kích thước, định dạng và lazy loading được cân nhắc theo vị trí sử dụng.'],
  ['Analytics', 'Các sự kiện đo lường được thiết lập theo mục tiêu và công cụ của dự án.'],
  ['Accessibility basics', 'Cân nhắc semantic control, focus, bàn phím, nhãn và độ tương phản.'],
  ['Kiến trúc dễ bảo trì', 'Component và nội dung có cấu trúc giúp việc cập nhật về sau rõ ràng hơn.'],
];

const faqs = [
  { question: 'Thuê website và thiết kế website riêng khác nhau như thế nào?', answer: 'Thuê website giúp bắt đầu nhanh với chi phí ban đầu thấp hơn và phạm vi tiêu chuẩn. Website riêng phù hợp khi doanh nghiệp cần UI/UX, cấu trúc, tích hợp hoặc quy trình đặc thù.' },
  { question: 'Gói thuê website bắt đầu từ bao nhiêu?', answer: 'Giá hiện tại bắt đầu từ 189.000đ/tháng. Chi tiết các gói được cập nhật tại trang bảng giá chính thức.', pricingLink: true },
  { question: 'Website có hiển thị tốt trên điện thoại không?', answer: 'Có. Responsive là một phần của quá trình thiết kế và được kiểm tra trên nhiều kích thước màn hình.' },
  { question: 'LOOPS có hỗ trợ SEO không?', answer: 'LOOPS có thể chuẩn bị cấu trúc semantic, metadata, heading, tốc độ tải và các nền tảng SEO kỹ thuật. Phạm vi SEO nội dung hoặc vận hành phụ thuộc vào gói và yêu cầu dự án.' },
  { question: 'Website có bao gồm hosting và SSL không?', answer: 'Hosting và SSL có trong một số gói thuê website hoặc có thể được cấu hình theo dự án. Hạng mục cụ thể phụ thuộc vào gói và yêu cầu được lựa chọn.' },
  { question: 'Có thể nâng cấp từ website thuê lên hệ thống tùy chỉnh không?', answer: 'Có. LOOPS có thể đánh giá nội dung, dữ liệu và nhu cầu hiện tại để đề xuất lộ trình chuyển sang website hoặc hệ thống tùy chỉnh.' },
  { question: 'LOOPS có hỗ trợ bảo trì sau khi website hoạt động không?', answer: 'Có. Bảo trì, backup, cập nhật và hỗ trợ kỹ thuật được cung cấp tùy theo gói vận hành hoặc phạm vi đã thống nhất.' },
];

function isVideoMedia(src = '') {
  const normalizedSrc = String(src).split('?')[0].toLowerCase();
  return normalizedSrc.startsWith('data:video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(normalizedSrc);
}

function ServiceMedia({ src, alt = '', loading, fetchPriority, decorative = false }) {
  if (isVideoMedia(src)) {
    return (
      <video
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

  return (
    <img
      src={src}
      alt={decorative ? '' : alt}
      loading={loading}
      fetchPriority={fetchPriority}
      aria-hidden={decorative ? 'true' : undefined}
    />
  );
}

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function useServiceSeo() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    document.title = 'Thiết kế website doanh nghiệp & thuê website | LOOPS';
    document.documentElement.lang = 'vi';
    document.body.classList.add('service-route');

    upsertMeta('name', 'description', 'LOOPS cung cấp dịch vụ thuê website từ 189.000đ/tháng và thiết kế website doanh nghiệp theo yêu cầu, gồm landing page, website bán hàng, web app và UI/UX.');
    upsertMeta('property', 'og:title', 'Thiết kế website doanh nghiệp & thuê website | LOOPS');
    upsertMeta('property', 'og:description', 'Bắt đầu nhanh với dịch vụ thuê website hoặc phát triển website tùy chỉnh khi doanh nghiệp cần mở rộng.');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', 'https://loops.company/assets/projects/project-02.jpg');
    upsertMeta('property', 'og:site_name', 'LOOPS COMPANY');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', 'Thiết kế website doanh nghiệp & thuê website | LOOPS');
    upsertMeta('name', 'twitter:description', 'Bắt đầu nhanh với dịch vụ thuê website hoặc phát triển website tùy chỉnh khi doanh nghiệp cần mở rộng.');
    upsertMeta('name', 'twitter:image', 'https://loops.company/assets/projects/project-02.jpg');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = document.createElement('script');
    schema.id = 'website-design-schema';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://loops.company/#organization',
          name: 'LOOPS COMPANY',
          url: 'https://loops.company/',
          email: 'hello@loops.company',
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#service`,
          name: 'Dịch vụ thuê và thiết kế website doanh nghiệp',
          serviceType: ['Thuê website doanh nghiệp', 'Thiết kế website theo yêu cầu', 'Phát triển web'],
          url: canonicalUrl,
          description: 'LOOPS cung cấp giải pháp thuê website dễ tiếp cận và thiết kế, phát triển website tùy chỉnh cho doanh nghiệp.',
          provider: { '@id': 'https://loops.company/#organization' },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://loops.company/' },
            { '@type': 'ListItem', position: 2, name: 'Thiết kế website doanh nghiệp', item: canonicalUrl },
          ],
        },
      ],
    });
    document.getElementById(schema.id)?.remove();
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
      document.body.classList.remove('service-route');
      schema.remove();
    };
  }, []);
}

function ServiceFooter() {
  return (
    <footer className="service-footer">
      <div><strong>LOOPS COMPANY</strong><span>Công nghệ sáng tạo / Việt Nam + Toàn cầu</span></div>
      <nav aria-label="Footer navigation">
        <a href="/">Trang chủ</a><a href="#service-offerings">Dịch vụ</a><a href="/#work">Dự án</a><a href="/#start">Giới thiệu</a><a href="mailto:hello@loops.company">Liên hệ</a>
      </nav>
      <a href="mailto:hello@loops.company">hello@loops.company</a>
    </footer>
  );
}

export default function WebsiteDesignPage() {
  useServiceSeo();
  useServicePageMotion();
  const { media, resolveMedia } = useLanguage();
  const serviceMedia = {
    heroMain: resolveMedia(media.project02 || '/assets/projects/project-02.jpg'),
    heroFloat: resolveMedia(media.project07 || '/assets/projects/project-07.jpg'),
    liquidO: resolveMedia(media.liquidO || '/assets/liquid-o.png'),
    whyImage: resolveMedia(media.project04 || '/assets/projects/project-04.jpg'),
    concept01: resolveMedia(media.project05 || '/assets/projects/project-05.jpg'),
    concept02: resolveMedia(media.project02 || '/assets/projects/project-02.jpg'),
    concept03: resolveMedia(media.project08 || '/assets/projects/project-08.jpg'),
  };
  const serviceConcepts = selectedConcepts.map((project, index) => ({
    ...project,
    image: [serviceMedia.concept01, serviceMedia.concept02, serviceMedia.concept03][index] || project.image,
  }));

  return (
    <div className="service-page">
      <main>
        <section className="service-hero" aria-labelledby="website-design-title">
          <div className="service-grid" aria-hidden="true" />
          <div className="service-hero-copy">
            <nav className="service-breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a><span>/</span><a href="#service-offerings">Dịch vụ</a><span>/</span><span>Thiết kế website</span></nav>
            <p className="service-eyebrow">Thuê website + thiết kế website theo yêu cầu</p>
            <h1 id="website-design-title"><span>Websites built</span><span className="is-blue">to grow with</span><span>your business.</span></h1>
            <div className="service-hero-bottom">
              <p>LOOPS thiết kế, phát triển và vận hành website cho doanh nghiệp — từ giải pháp thuê website dễ tiếp cận đến hệ thống website tùy chỉnh theo nhu cầu.</p>
              <div className="service-actions">
                <a className="service-button is-primary" href="https://www.loops.vn/bao-gia">Xem gói thuê website <ArrowUpRight size={18} /></a>
                <a className="service-text-link" href="mailto:hello@loops.company">Tư vấn website theo yêu cầu <ArrowUpRight size={18} /></a>
              </div>
            </div>
          </div>
          <div className="service-hero-visual" aria-label="Concept hình ảnh website của LOOPS">
            <figure className="service-hero-main"><ServiceMedia src={serviceMedia.heroMain} alt="Concept giao diện nền tảng công nghệ responsive" fetchPriority="high" /></figure>
            <figure className="service-hero-float"><ServiceMedia src={serviceMedia.heroFloat} alt="Concept quy trình thiết kế giao diện nhiều lớp" /></figure>
            <div className="service-hero-o"><ServiceMedia src={serviceMedia.liquidO} alt="LOOPS liquid O visual motif" /></div>
            <span className="service-visual-label">Thiết kế / Xây dựng / Cải thiện</span>
          </div>
        </section>

        <section className="service-paths service-section" aria-labelledby="service-paths-title">
          <div className="service-section-label"><span>01</span><i />Two ways to start</div>
          <div className="service-heading-row">
            <h2 id="service-paths-title" className="service-reveal">Bắt đầu phù hợp.<br />Mở rộng đúng lúc.</h2>
            <p className="service-reveal">Thuê website giúp doanh nghiệp đi nhanh hơn. Website tùy chỉnh tạo thêm quyền kiểm soát khi quy trình và nhu cầu phát triển.</p>
          </div>
          <div className="service-paths-grid">
            <article className="service-path is-rental service-reveal">
              <div className="service-path-index"><span>Option 01</span><strong>Điểm bắt đầu dễ tiếp cận</strong></div>
              <h3>Website<br />Rental</h3>
              <p className="service-path-purpose">Triển khai nhanh, chi phí ban đầu thấp hơn và phù hợp với nhu cầu kinh doanh tiêu chuẩn.</p>
              <div className="service-path-price"><small>Bắt đầu từ</small><strong>189.000đ</strong><span>/ tháng</span></div>
              <ul>
                <li>Hosting và SSL</li><li>Responsive</li><li>Hỗ trợ kỹ thuật</li><li>Phù hợp doanh nghiệp mới bắt đầu</li><li>Có thể nâng cấp khi nhu cầu tăng</li>
              </ul>
              <a className="service-button is-primary" href="/pricing">Xem bảng giá <ArrowUpRight size={18} /></a>
            </article>
            <article className="service-path is-custom service-reveal">
              <div className="service-path-index"><span>Option 02</span><strong>Kiểm soát và tùy chỉnh sâu hơn</strong></div>
              <h3>Custom<br />Website</h3>
              <p className="service-path-purpose">Dành cho doanh nghiệp cần website theo quy trình riêng, tích hợp phức tạp hoặc hệ thống có khả năng mở rộng.</p>
              <ul>
                <li>UI/UX theo yêu cầu</li><li>Cấu trúc website riêng</li><li>Tích hợp CRM / ERP / hệ thống khác</li><li>Dashboard hoặc web application khi cần</li><li>Khả năng mở rộng cao hơn</li><li>Phù hợp doanh nghiệp có quy trình đặc thù</li>
              </ul>
              <a className="service-text-link" href="mailto:hello@loops.company">Tư vấn website riêng <ArrowUpRight size={18} /></a>
            </article>
          </div>
          <p className="service-paths-note service-reveal">Start quickly with Website Rental. Scale into a custom digital system when the business needs more.</p>
        </section>

        <section className="service-build service-section" aria-labelledby="what-we-build-title">
          <div id="service-offerings" className="service-section-label"><span>02</span><i />Chúng tôi xây gì</div>
          <div className="service-heading-row">
            <h2 id="what-we-build-title" className="service-reveal">Đúng với vai trò<br />website cần đảm nhận.</h2>
            <p className="service-reveal">Mỗi định dạng cần nội dung, tương tác và quyết định kỹ thuật khác nhau. Chúng tôi bắt đầu từ mục tiêu sử dụng thật.</p>
          </div>
          <div className="service-build-list">
            {buildTypes.map(({ icon: Icon, title, description }, index) => (
              <article className="service-build-row" key={title}>
                <span>0{index + 1}</span><Icon aria-hidden="true" size={24} strokeWidth={1.7} /><h3>{title}</h3><p>{description}</p><ArrowUpRight className="service-row-arrow" aria-hidden="true" size={24} />
              </article>
            ))}
          </div>
        </section>

        <section className="service-why" aria-labelledby="why-loops-title">
          <div className="service-section-label is-light"><span>03</span><i />Hạng mục có thể triển khai</div>
          <div className="service-why-head">
            <div>
              <h2 id="why-loops-title" className="service-reveal">Website cần gì.<br /><span>LOOPS chuẩn bị đó.</span></h2>
              <p className="service-why-note service-reveal">Các hạng mục được cung cấp tùy theo gói đã chọn và yêu cầu của từng dự án.</p>
            </div>
            <figure><ServiceMedia src={serviceMedia.whyImage} alt="Layered interface system and blue digital form" loading="lazy" /></figure>
          </div>
          <div className="service-capabilities">
            {capabilities.map(([title, description], index) => (
              <article className="service-capability service-reveal" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>
            ))}
          </div>
        </section>

        <section className="service-compare service-section" aria-labelledby="service-compare-title">
          <div className="service-section-label"><span>04</span><i />Rental vs Custom</div>
          <div className="service-heading-row">
            <h2 id="service-compare-title" className="service-reveal">Hai hướng đi.<br />Một lộ trình phát triển.</h2>
            <p className="service-reveal">Không phải doanh nghiệp nào cũng cần xây hệ thống riêng ngay từ đầu. Lựa chọn phù hợp phụ thuộc vào mục tiêu và mức độ đặc thù hiện tại.</p>
          </div>
          <div className="service-compare-grid">
            <article className="service-compare-column service-reveal">
              <span>01 / Website Rental</span><h3>Phù hợp nhất khi</h3>
              <ul><li>Cần ra mắt nhanh</li><li>Muốn giảm chi phí đầu tư ban đầu</li><li>Doanh nghiệp nhỏ hoặc đang phát triển</li><li>Nhu cầu website tương đối tiêu chuẩn</li></ul>
            </article>
            <article className="service-compare-column service-reveal">
              <span>02 / Custom Website</span><h3>Phù hợp nhất khi</h3>
              <ul><li>Có quy trình riêng</li><li>Cần UX tùy chỉnh</li><li>Có tích hợp phức tạp</li><li>Cần hệ thống số có khả năng mở rộng</li></ul>
            </article>
          </div>
          <div className="service-compare-question service-reveal"><strong>Bạn chưa chắc nên chọn hướng nào?</strong><p>LOOPS có thể tư vấn dựa trên mục tiêu, ngân sách và quy mô hiện tại.</p><a className="service-text-link" href="mailto:hello@loops.company">Trao đổi với LOOPS <ArrowUpRight size={18} /></a></div>
        </section>

        <section className="service-process service-section" aria-labelledby="process-title">
          <div className="service-section-label"><span>05</span><i />Quy trình</div>
          <div className="service-heading-row">
            <h2 id="process-title" className="service-reveal">Từ câu hỏi đầu tiên<br />đến website hữu ích.</h2>
            <p className="service-reveal">Một quy trình rõ ràng và liền mạch giúp chiến lược, thiết kế và phát triển cùng đi về một hướng.</p>
          </div>
          <ol className="service-process-list">
            {processSteps.map(([number, title, description]) => (
              <li className="service-process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></li>
            ))}
          </ol>
          <div className="service-process-line" aria-hidden="true"><i /></div>
        </section>

        <section id="selected-concepts" className="service-cases" aria-labelledby="selected-concepts-title">
          <div className="service-section-label is-light"><span>06</span><i />Selected Concepts</div>
          <h2 id="selected-concepts-title" className="service-reveal">Concept work.<br />Không phải client case.</h2>
          <p className="service-cases-disclaimer service-reveal">Các hình ảnh bên dưới là concept và thử nghiệm giao diện của LOOPS, không đại diện cho kết quả khách hàng đã được xác minh.</p>
          <div className="service-case-list">
            {serviceConcepts.map((project, index) => (
              <article className="service-case" key={project.title}>
                <figure><ServiceMedia src={project.image} alt={`${project.title} của LOOPS`} loading="lazy" /></figure>
                <div className="service-case-index">0{index + 1}</div>
                <div className="service-case-content">
                  <header><span>{project.industry}</span><h3>{project.title}</h3><p>{project.services}</p></header>
                  <dl>
                    <div><dt>Khám phá</dt><dd>{project.focus}</dd></div>
                    <div><dt>Tiếp cận</dt><dd>{project.approach}</dd></div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="service-quality service-section" aria-labelledby="quality-title">
          <div className="service-section-label"><span>07</span><i />SEO + hiệu suất + chất lượng</div>
          <div className="service-quality-layout">
            <div>
              <h2 id="quality-title" className="service-reveal">Nền tảng tốt trước khi tăng trưởng.</h2>
              <p className="service-reveal">Một website có chất lượng cần tải hợp lý, dễ sử dụng, có cấu trúc rõ cho SEO và đủ đơn giản để tiếp tục bảo trì. Phạm vi triển khai phụ thuộc vào gói hoặc yêu cầu dự án.</p>
            </div>
            <ul>
              {qualityItems.map(([title, description]) => <li className="service-reveal" key={title}><Check size={18} aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></li>)}
            </ul>
          </div>
        </section>

        <section className="service-faq service-section" aria-labelledby="faq-title">
          <div className="service-section-label"><span>08</span><i />Câu hỏi thường gặp</div>
          <div className="service-faq-layout">
            <h2 id="faq-title" className="service-reveal">Câu trả lời hữu ích<br />trước khi bắt đầu.</h2>
            <div className="service-faq-list">
              {faqs.map(({ question, answer, pricingLink }, index) => (
                <details key={question}>
                  <summary><span>0{index + 1}</span><h3>{question}</h3><i aria-hidden="true" /></summary>
                  <p>{answer} {pricingLink && <a href="/pricing">Xem bảng giá chính thức.</a>}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="service-final" aria-labelledby="service-final-title">
          <div className="service-grid" aria-hidden="true" />
          <span className="service-final-kicker">Vòng lặp tiếp theo / 09</span>
          <h2 id="service-final-title" className="service-reveal">Start simple.<br />Grow when ready.</h2>
          <div className="service-final-o" aria-hidden="true"><ServiceMedia src={serviceMedia.liquidO} decorative /></div>
          <div className="service-final-bottom service-reveal">
            <p>Bắt đầu với một website phù hợp ngân sách hiện tại. Khi doanh nghiệp phát triển, hệ thống có thể được mở rộng theo nhu cầu thực tế.</p>
            <div className="service-final-actions"><a className="service-button is-light" href="/pricing">Xem gói thuê website <ArrowUpRight size={18} /></a><a className="service-text-link is-light" href="mailto:hello@loops.company">Tư vấn website theo yêu cầu <ArrowUpRight size={18} /></a></div>
          </div>
        </section>
      </main>
      <ServiceFooter />
    </div>
  );
}
