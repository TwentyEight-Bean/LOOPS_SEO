import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Check,
  X,
  HelpCircle,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Mail,
  ChevronDown
} from 'lucide-react';
import SiteHeader from './SiteHeader';
import { useNavigation } from './router/NavigationContext';
import { useLanguage } from './context/LanguageContext';
import './pricing.css';

// 4 Pricing tiers directly from user specifications & image
const pricingTiers = [
  {
    id: 'W-01',
    code: 'W - 01',
    name: 'Khởi Đầu',
    target: 'Phù hợp cho cá nhân và startup mới bắt đầu.',
    monthlyPrice: 189000,
    yearlyPrice: 151000, // ~20% off
    badgeCategory: 'GÓI LANDING PAGE',
    topBadge: null,
    isFeatured: false,
    buttonText: 'Chọn gói',
    buttonClass: '',
    features: [
      { text: '1 trang Landing Page', included: true },
      { text: 'Thiết kế responsive', included: true },
      { text: 'Form liên hệ', included: true },
      { text: 'Hosting & SSL', included: true },
      { text: 'Hỗ trợ email', included: true },
      { text: 'SEO tối ưu', included: false },
      { text: 'Google Analytics', included: false },
    ],
  },
  {
    id: 'W-02',
    code: 'W - 02',
    name: 'Doanh Nghiệp',
    target: 'Giải pháp cho doanh nghiệp vừa và nhỏ muốn tăng trưởng.',
    monthlyPrice: 589000,
    yearlyPrice: 471000, // ~20% off
    badgeCategory: 'GÓI LANDING PAGE',
    topBadge: { text: 'PHỔ BIẾN NHẤT', type: 'gold' },
    isFeatured: true,
    buttonText: 'Bắt đầu ngay',
    buttonClass: 'gold-button',
    features: [
      { text: '5 trang nội dung', included: true },
      { text: 'Thiết kế custom cao cấp', included: true },
      { text: 'SEO on-page cơ bản', included: true },
      { text: 'Google Analytics', included: true },
      { text: 'Tích hợp mạng xã hội', included: true },
      { text: 'Chat & Email support', included: true },
      { text: 'Cập nhật 2×/tháng', included: true },
      { text: 'CRM integration', included: false },
      { text: 'Marketing automation', included: false },
    ],
  },
  {
    id: 'W-03',
    code: 'W - 03',
    name: 'Nâng Cao',
    target: 'Cho doanh nghiệp cần website mạnh với full marketing.',
    monthlyPrice: 889000,
    yearlyPrice: 711000, // ~20% off
    badgeCategory: 'GÓI LANDING PAGE',
    topBadge: null,
    isFeatured: false,
    buttonText: 'Chọn gói',
    buttonClass: '',
    features: [
      { text: '15 trang nội dung', included: true },
      { text: 'Thiết kế premium + animation', included: true },
      { text: 'SEO nâng cao + Blog', included: true },
      { text: 'Tích hợp CRM cơ bản', included: true },
      { text: 'Email marketing setup', included: true },
      { text: 'Báo cáo hàng tháng', included: true },
      { text: 'Hỗ trợ ưu tiên 24/7', included: true },
      { text: 'Cập nhật 4×/tháng', included: true },
      { text: 'Marketing automation', included: false },
    ],
  },
  {
    id: 'W-04',
    code: 'W - 04',
    name: 'Enterprise',
    target: 'Hệ sinh thái web hoàn chỉnh cho tập đoàn và doanh nghiệp lớn.',
    monthlyPrice: 1189000,
    yearlyPrice: 951000, // ~20% off
    badgeCategory: 'GÓI LANDING PAGE',
    topBadge: { text: 'CAO CẤP NHẤT', type: 'silver' },
    isFeatured: false,
    buttonText: 'Chọn gói',
    buttonClass: '',
    features: [
      { text: 'Không giới hạn trang', included: true },
      { text: 'Thiết kế hoàn toàn tùy chỉnh', included: true },
      { text: 'SEO toàn diện + Content', included: true },
      { text: 'CRM & ERP integration', included: true },
      { text: 'Marketing automation', included: true },
      { text: 'Dashboard quản lý riêng', included: true },
      { text: 'Chuyên viên hỗ trợ riêng', included: true },
      { text: 'Cập nhật không giới hạn', included: true },
      { text: 'Tên miền .com miễn phí', included: true },
    ],
  },
];

// Comparison Matrix Data
const comparisonMatrix = [
  {
    category: 'Giao diện & Thiết kế',
    categoryEn: 'Interface & Design',
    items: [
      { feature: 'Số lượng trang', featureEn: 'Number of Pages', w01: '1 trang Landing', w02: '5 trang', w03: '15 trang', w04: 'Không giới hạn' },
      { feature: 'Giao diện Responsive Mobile/Tablet', featureEn: 'Responsive Mobile/Tablet', w01: '✓', w02: '✓', w03: '✓', w04: '✓' },
      { feature: 'Thiết kế Custom theo thương hiệu', featureEn: 'Bespoke Brand Design', w01: 'Tiêu chuẩn', w02: 'Cao cấp', w03: 'Premium + Motion', w04: 'May đo 100%' },
      { feature: 'Hiệu ứng chuyển động & Animation', featureEn: 'Motion & Animations', w01: '—', w02: 'Cơ bản', w03: 'Mượt mà GSAP', w04: 'Độc bản' },
    ],
  },
  {
    category: 'Hạ tầng & Vận hành',
    categoryEn: 'Infrastructure & Operations',
    items: [
      { feature: 'Hosting tốc độ cao & SSL HTTPS', featureEn: 'High-speed Cloud Hosting & SSL', w01: '✓', w02: '✓', w03: '✓', w04: '✓ (Dedicated Server)' },
      { feature: 'Tên miền quốc tế (.com/.vn)', featureEn: 'Domain (.com/.vn)', w01: 'Dùng tên miền phụ', w02: 'Tên miền riêng', w03: 'Hỗ trợ DNS', w04: 'Tặng kèm miễn phí' },
      { feature: 'Bảo mật & Sao lưu dữ liệu (Backup)', featureEn: 'Security & Automated Backups', w01: 'Hàng tháng', w02: 'Hàng tuần', w03: 'Hàng ngày', w04: 'Thời gian thực' },
      { feature: 'Cập nhật nội dung định kỳ', featureEn: 'Content Updates', w01: '—', w02: '2 lần / tháng', w03: '4 lần / tháng', w04: 'Không giới hạn' },
    ],
  },
  {
    category: 'Tiếp thị & Chuyển đổi',
    categoryEn: 'Marketing & Conversion',
    items: [
      { feature: 'Biểu mẫu liên hệ & Thu thập Leads', featureEn: 'Lead Capture & Contact Forms', w01: '✓', w02: '✓', w03: '✓', w04: '✓' },
      { feature: 'Tối ưu hóa SEO Google', featureEn: 'Search Engine Optimization (SEO)', w01: 'Cơ bản thẻ Meta', w02: 'SEO On-page', w03: 'SEO Nâng cao + Blog', w04: 'SEO Toàn diện' },
      { feature: 'Google Analytics & Facebook Pixel', featureEn: 'Analytics & Tracking Pixel', w01: '—', w02: '✓', w03: '✓', w04: '✓ + Dashboard' },
      { feature: 'Tích hợp CRM / ERP & Email Marketing', featureEn: 'CRM/ERP & Marketing Setup', w01: '—', w02: '—', w03: 'CRM cơ bản & Email', w04: 'Full Automation' },
    ],
  },
  {
    category: 'Chăm sóc & Dịch vụ khách hàng',
    categoryEn: 'Customer Support & SLA',
    items: [
      { feature: 'Kênh hỗ trợ', featureEn: 'Support Channels', w01: 'Email', w02: 'Email + Chat Zalo', w03: '24/7 Hotline & Chat', w04: 'Chuyên viên riêng' },
      { feature: 'Thời gian phản hồi cam kết', featureEn: 'SLA Response Time', w01: 'Trong 24h', w02: 'Trong 12h', w03: 'Trong 2h', w04: 'Dưới 30 phút' },
      { feature: 'Cam kết hoàn tiền trong 30 ngày', featureEn: '30-Day Money-back Guarantee', w01: '✓', w02: '✓', w03: '✓', w04: '✓' },
    ],
  },
];

// Dedicated Pricing FAQs
const pricingFaqs = [
  {
    q: 'Chi phí thuê website có phát sinh thêm khoản nào khác không?',
    qEn: 'Are there any hidden costs with the website rental?',
    a: 'Hoàn toàn không. Mức giá niêm yết đã bao gồm hạ tầng lưu trữ (Hosting), chứng chỉ bảo mật (SSL), bản quyền hệ thống và dịch vụ hỗ trợ kỹ thuật. Bạn chỉ thanh toán đúng số tiền theo chu kỳ đã chọn.',
    aEn: 'No hidden fees. Listed prices include high-speed hosting, SSL certificates, platform license, and continuous technical support.',
  },
  {
    q: 'Tôi có thể nâng cấp hoặc chuyển đổi giữa các gói sau này không?',
    qEn: 'Can I upgrade or switch between plans later?',
    a: 'Có. Khi hoạt động kinh doanh phát triển, bạn có thể nâng cấp từ gói Khởi Đầu lên Doanh Nghiệp hoặc Enterprise bất kỳ lúc nào. Khoản phí còn lại của gói cũ sẽ được khấu trừ trực tiếp vào gói mới.',
    aEn: 'Yes. You can upgrade anytime as your business grows. Any remaining balance will be credited directly to your new plan.',
  },
  {
    q: 'Thời gian bàn giao website là bao lâu sau khi thanh toán?',
    qEn: 'How fast is the turnaround time after onboarding?',
    a: 'Đối với gói Khởi Đầu và Doanh Nghiệp, website được bàn giao và hoạt động trong vòng 48 đến 72 giờ làm việc kể từ khi nhận đủ nội dung và hình ảnh cơ bản từ khách hàng.',
    aEn: 'For Starter and Business plans, your website is delivered and goes live within 48 to 72 business hours after receiving basic content.',
  },
  {
    q: 'Tôi có thể kết nối tên miền riêng của mình không?',
    qEn: 'Can I connect my own custom domain?',
    a: 'Có. Tất cả các gói từ Doanh Nghiệp trở lên đều hỗ trợ kết nối tên miền riêng của bạn (.vn, .com, .net, v.v.). Kỹ sư LOOPS sẽ hỗ trợ trỏ bản ghi DNS hoàn toàn miễn phí.',
    aEn: 'Yes. All tiers support connecting your custom domain (.com, .vn, .io, etc.) with complimentary DNS configuration by LOOPS engineers.',
  },
  {
    q: 'Dữ liệu khách hàng và nội dung website thuộc về ai?',
    qEn: 'Who owns the customer data and website content?',
    a: 'Toàn bộ dữ liệu, bài viết, hình ảnh và thông tin khách hàng nhập qua biểu mẫu hoàn toàn thuộc quyền sở hữu của bạn. LOOPS cam kết bảo mật tuyệt đối và xuất dữ liệu khi bạn có nhu cầu.',
    aEn: 'All data, media, articles, and lead entries are 100% owned by you. LOOPS provides secure exports upon request.',
  },
  {
    q: 'Chính sách cam kết hoàn tiền 30 ngày áp dụng như thế nào?',
    qEn: 'How does the 30-day money-back guarantee work?',
    a: 'Nếu trong 30 ngày đầu tiên kể từ khi bắt đầu sử dụng dịch vụ, bạn không hài lòng về chất lượng website hoặc trải nghiệm hỗ trợ của LOOPS, chúng tôi sẽ hoàn trả 100% số tiền mà không cần giải trình thêm.',
    aEn: 'If you are unsatisfied within the first 30 days of service, we will refund 100% of your payment with no questions asked.',
  }
];

function formatPrice(number) {
  return new Intl.NumberFormat('vi-VN').format(number);
}

export default function PricingPage() {
  const { navigate } = useNavigation();
  const { language, t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', note: '' });

  const isEn = language === 'en';

  useEffect(() => {
    document.title = isEn ? 'Website Service Pricing | LOOPS COMPANY' : 'Bảng giá dịch vụ website | LOOPS COMPANY';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [isEn]);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setFormSubmitted(false);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setSelectedPlan(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', note: '' });
      alert(isEn ? 'Thank you! A LOOPS consultant will contact you within 15 minutes.' : 'Cảm ơn bạn! Chuyên viên tư vấn LOOPS sẽ liên hệ lại với bạn trong vòng 15 phút.');
    }, 1200);
  };

  return (
    <div className="pricing-page">
      {/* Background aesthetics */}
      <div className="pricing-grid-bg" aria-hidden="true" />
      <div className="pricing-glow" aria-hidden="true" />

      <main className="pricing-container">
        {/* Header & Subtitle matching user photo */}
        <div className="pricing-header">
          <div className="pricing-badge-pill">
            <Sparkles size={13} />
            <span>{isEn ? 'WEBSITE SERVICE PRICING · LOOPS' : 'BẢNG GIÁ DỊCH VỤ WEBSITE · LOOPS'}</span>
          </div>

          <h1 className="pricing-title">
            {isEn ? 'Clear Solutions. Lasting Value.' : 'Giải Pháp Rõ Ràng. Giá Trị Bền Vững.'}
          </h1>

          {/* EXACT TEXT FROM USER PHOTO */}
          <p className="pricing-subtitle">
            {isEn ? 'Own a professional website without massive upfront capital. Cancel anytime.' : 'Sở hữu website chuyên nghiệp không cần đầu tư lớn. Hủy bất kỳ lúc nào.'}
          </p>

          {/* Monthly / Yearly Switcher Toggle */}
          <div className="pricing-switcher-wrap">
            <div
              className="pricing-switcher"
              onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
                }
              }}
              aria-label={isEn ? 'Toggle monthly or annual billing' : 'Chuyển đổi chu kỳ thanh toán theo tháng hoặc năm'}
            >
              <span className={`pricing-switcher-label ${billingCycle === 'monthly' ? 'is-active' : ''}`}>
                {isEn ? 'Monthly' : 'Tháng'}
              </span>
              <div className={`pricing-switch-toggle ${billingCycle === 'yearly' ? 'is-yearly' : ''}`}>
                <div className="pricing-switch-thumb" />
              </div>
              <span className={`pricing-switcher-label ${billingCycle === 'yearly' ? 'is-active' : ''}`}>
                {isEn ? 'Yearly' : 'Năm'}
              </span>
            </div>

            {billingCycle === 'yearly' && (
              <span className="pricing-discount-badge">
                {isEn ? 'Save 20%' : 'Tiết kiệm 20%'}
              </span>
            )}
          </div>
        </div>

        {/* 4 Pricing Cards Grid (Exact data from user photo) */}
        <div className="pricing-cards-grid">
          {pricingTiers.map((tier) => {
            const price = billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;

            return (
              <article
                key={tier.id}
                className={`pricing-card ${tier.isFeatured ? 'is-featured' : ''}`}
                id={`plan-${tier.id}`}
              >
                {/* Floating Top Badge */}
                {tier.topBadge && (
                  <div className={`pricing-top-pill ${tier.topBadge.type}`}>
                    {tier.topBadge.text}
                  </div>
                )}

                <div>
                  {/* Card Code */}
                  <div className="pricing-card-code">{tier.code}</div>

                  {/* Card Plan Title */}
                  <h3 className="pricing-card-title">{tier.name}</h3>

                  {/* Target Audience */}
                  <p className="pricing-card-target">{tier.target}</p>

                  {/* Price */}
                  <div className="pricing-card-price-row">
                    <span className="pricing-card-amount">
                      {formatPrice(price)} đ
                    </span>
                    <span className="pricing-card-unit">/tháng</span>
                  </div>

                  {/* Category Badge */}
                  <span className="pricing-card-category-badge">{tier.badgeCategory}</span>

                  {/* Divider line */}
                  <div className="pricing-card-divider" />

                  {/* Features Checklist */}
                  <ul className="pricing-features-list">
                    {tier.features.map((feat, index) => (
                      <li
                        key={index}
                        className={`pricing-feature-item ${feat.included ? '' : 'is-excluded'}`}
                      >
                        <span className={`pricing-feature-icon ${feat.included ? 'check' : 'cross'}`}>
                          {feat.included ? <Check size={14} strokeWidth={2.6} /> : <X size={14} strokeWidth={2} />}
                        </span>
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  className={`pricing-card-button ${tier.buttonClass}`}
                  onClick={() => handleOpenModal(tier)}
                >
                  <span>{tier.buttonText}</span>
                  <ArrowUpRight size={16} />
                </button>
              </article>
            );
          })}
        </div>

        {/* Footnote matching user photo */}
        <div className="pricing-disclaimer">
          {isEn
            ? '* Prices exclude VAT · Free Consultation · 30-Day Money-Back Guarantee'
            : '* Giá chưa bao gồm VAT · Tư vấn miễn phí · Cam kết hoàn tiền 30 ngày'}
        </div>

        {/* Transparency Value Pillars */}
        <section className="pricing-pillars" aria-label={isEn ? 'Quality Commitments' : 'Cam kết chất lượng dịch vụ'}>
          <div className="pricing-pillar-item">
            <Zap size={24} style={{ color: 'var(--pricing-gold)' }} />
            <h3>{isEn ? '48-Hour Turnaround' : 'Bàn giao sau 48 giờ'}</h3>
            <p>
              {isEn
                ? 'Streamlined onboarding and development pipeline to launch your product online rapidly.'
                : 'Quy trình triển khai tinh gọn, tối ưu thời gian đưa sản phẩm và dịch vụ của bạn lên môi trường trực tuyến nhanh nhất.'}
            </p>
          </div>

          <div className="pricing-pillar-item">
            <ShieldCheck size={24} style={{ color: 'var(--blue)' }} />
            <h3>{isEn ? 'Zero Hidden Fees' : 'Không phát sinh chi phí'}</h3>
            <p>
              {isEn
                ? 'High-speed cloud server infrastructure, SSL security, and regular maintenance all included.'
                : 'Hạ tầng máy chủ tốc độ cao, chứng chỉ bảo mật SSL HTTPS và bảo trì hệ thống định kỳ đã được trọn gói đầy đủ.'}
            </p>
          </div>

          <div className="pricing-pillar-item">
            <RotateCcw size={24} style={{ color: '#a0c49d' }} />
            <h3>{isEn ? '30-Day Money Back' : 'Bảo đảm hoàn tiền 30 ngày'}</h3>
            <p>
              {isEn
                ? 'Risk-free collaboration. If you are not satisfied in month 1, we refund 100% of your investment.'
                : 'Trải nghiệm dịch vụ an tâm tuyệt đối. Nếu không ưng ý trong tháng đầu tiên, chúng tôi hoàn lại 100% chi phí.'}
            </p>
          </div>
        </section>

        {/* Interactive Feature Comparison Table */}
        <section className="pricing-comparison-section" aria-labelledby="comparison-title">
          <div className="pricing-comparison-header">
            <h2 id="comparison-title">
              {isEn ? 'Detailed Feature Comparison' : 'So Sánh Tính Năng Chi Tiết'}
            </h2>
            <p>
              {isEn
                ? 'Review full specifications and capabilities across all plans'
                : 'Xem toàn bộ quyền lợi và thông số kỹ thuật giữa các gói dịch vụ'}
            </p>
          </div>

          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>{isEn ? 'Feature & Capability' : 'Hạng mục tính năng'}</th>
                  <th style={{ width: '17.5%' }}>{isEn ? 'W-01 Starter' : 'W-01 Khởi Đầu'}</th>
                  <th style={{ width: '17.5%' }} className="is-featured-col">{isEn ? 'W-02 Business' : 'W-02 Doanh Nghiệp'}</th>
                  <th style={{ width: '17.5%' }}>{isEn ? 'W-03 Advanced' : 'W-03 Nâng Cao'}</th>
                  <th style={{ width: '17.5%' }}>{isEn ? 'W-04 Enterprise' : 'W-04 Enterprise'}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((group, groupIdx) => (
                  <React.Fragment key={groupIdx}>
                    <tr className="category-row">
                      <td colSpan={5}>{isEn ? group.categoryEn : group.category}</td>
                    </tr>
                    {group.items.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{isEn ? row.featureEn : row.feature}</td>
                        <td>{row.w01}</td>
                        <td className="is-featured-col">{row.w02}</td>
                        <td>{row.w03}</td>
                        <td>{row.w04}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dedicated Pricing FAQ */}
        <section className="pricing-faq-section" aria-labelledby="pricing-faq-heading">
          <div className="pricing-faq-head">
            <h2 id="pricing-faq-heading">
              {isEn ? 'Frequently Asked Questions' : 'Câu Hỏi Thường Gặp Về Báo Giá'}
            </h2>
            <p>
              {isEn ? 'Transparent answers before getting started' : 'Giải đáp minh bạch mọi thắc mắc trước khi bắt đầu'}
            </p>
          </div>

          <div className="pricing-faq-accordion">
            {pricingFaqs.map((faq, index) => (
              <details className="pricing-faq-item" key={index}>
                <summary className="pricing-faq-summary">
                  <span>{isEn ? faq.qEn : faq.q}</span>
                  <ChevronDown size={18} style={{ opacity: 0.6 }} />
                </summary>
                <p className="pricing-faq-body">{isEn ? faq.aEn : faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Enterprise & Custom Banner */}
        <section className="pricing-custom-banner">
          <div>
            <h3>
              {isEn ? 'Need a Custom System or Large Web App?' : 'Cần Hệ Thống Tùy Biến Hoặc Web App Lớn?'}
            </h3>
            <p>
              {isEn
                ? 'If your business requires bespoke workflows, custom architecture, or dedicated software engineering, explore our custom web development services.'
                : 'Nếu mô hình kinh doanh của bạn đòi hỏi quy trình nghiệp vụ phức tạp, thiết kế may đo độc bản từ đầu hoặc kiến trúc phần mềm tích hợp riêng, hãy tìm hiểu dịch vụ thiết kế theo yêu cầu của LOOPS.'}
            </p>
          </div>
          <div className="pricing-custom-actions">
            <button
              type="button"
              className="button button-light"
              onClick={() => navigate('/services/website-design/')}
            >
              {isEn ? 'Explore Custom Design' : 'Xem Dịch Vụ Thiết Kế Riêng'} <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
      </main>

      {/* Order / Consultation Modal */}
      {selectedPlan && (
        <div className="pricing-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="pricing-modal-shell"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="pricing-modal-close"
              onClick={handleCloseModal}
              aria-label={isEn ? 'Close modal' : 'Đóng cửa sổ'}
            >
              ✕
            </button>

            <div className="pricing-modal-selected">
              <span>{isEn ? `Selected Plan: ${selectedPlan.code} - ${selectedPlan.name}` : `Gói Đã Chọn: ${selectedPlan.code} - ${selectedPlan.name}`}</span>
            </div>

            <h3 className="pricing-modal-title">
              {isEn ? 'Initialize Website Plan' : 'Đăng Ký Khởi Tạo Website'}
            </h3>
            <p className="pricing-modal-desc">
              {isEn ? 'Pricing: ' : 'Chi phí: '}
              <strong style={{ color: 'var(--pricing-gold)' }}>
                {formatPrice(billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice)} {isEn ? 'VND/mo' : 'đ/tháng'}
              </strong>{' '}
              ({billingCycle === 'yearly' ? (isEn ? 'Billed annually - Save 20%' : 'Thanh toán theo năm - Tiết kiệm 20%') : (isEn ? 'Billed monthly' : 'Thanh toán theo tháng')}).
            </p>

            <form onSubmit={handleSubmitForm}>
              <div className="pricing-form-group">
                <label>{isEn ? 'Your Full Name *' : 'Họ và tên của bạn *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'e.g. Alex Johnson' : 'Ví dụ: Nguyễn Văn A'}
                  className="pricing-form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="pricing-form-group">
                <label>{isEn ? 'Phone / WhatsApp / Zalo *' : 'Số điện thoại / Zalo *'}</label>
                <input
                  type="tel"
                  required
                  placeholder={isEn ? 'e.g. +84 912 345 678' : 'Ví dụ: 0912 345 678'}
                  className="pricing-form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="pricing-form-group">
                <label>{isEn ? 'Email Address' : 'Email liên hệ'}</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="pricing-form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="pricing-form-group">
                <label>{isEn ? 'Notes or Desired Domain Name' : 'Ghi chú hoặc tên thương hiệu mong muốn'}</label>
                <textarea
                  rows={2}
                  placeholder={isEn ? 'Desired domain or specific feature requests...' : 'Nhập tên miền mong muốn hoặc yêu cầu cụ thể...'}
                  className="pricing-form-input"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="pricing-modal-submit"
                disabled={formSubmitted}
              >
                {formSubmitted ? (isEn ? 'Sending...' : 'Đang gửi thông tin...') : (isEn ? 'Submit Request Now' : 'Gửi Yêu Cầu Kích Hoạt Ngay')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
