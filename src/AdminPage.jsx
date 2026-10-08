import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  FileText,
  Compass,
  ArrowUpRight,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Eye,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useNavigation } from './router/NavigationContext';
import './admin.css';

const isVideoMedia = (src = '', fileType = '') => {
  const normalizedType = String(fileType).toLowerCase();
  const normalizedSrc = String(src).split('?')[0].toLowerCase();
  return (
    normalizedType === 'video' ||
    normalizedSrc.startsWith('data:video/') ||
    /\.(mp4|webm|mov|m4v|ogg)$/i.test(normalizedSrc)
  );
};

export default function AdminPage() {
  const {
    language: globalLang,
    allContent,
    media,
    mediaMeta,
    resolveMedia,
    uploadStandardMedia,
    uploadConceptMedia,
    resetStandardMedia,
    resetConceptMedia,
    lastSaved,
    isSaving,
    saveAllChanges,
    updateContentField,
    updateMediaField,
    updateListItem,
    addListItem,
    deleteListItem,
    resetContentToDefaults,
    exportContentJson,
    importContentJson,
  } = useLanguage();

  const { navigate } = useNavigation();

  // Active editing language tab (independent from global site viewing language)
  const [editLang, setEditLang] = useState('vi');
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [uploadingState, setUploadingState] = useState('');

  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  const handleManualSave = async () => {
    const res = await saveAllChanges();
    if (res.success) {
      showToast(`✅ Đã lưu toàn bộ thay đổi thành công lúc ${res.time}! F5 không bị mất.`);
    } else {
      alert(`Lỗi khi lưu: ${res.error}`);
    }
  };

  const handleFieldChange = (section, field, value) => {
    updateContentField(editLang, section, field, value);
    showToast('Đã ghi nhận thay đổi (Đang lưu vào CSDL)...');
  };

  const handleMediaChange = (mediaKey, value) => {
    updateMediaField(mediaKey, value);
    showToast('Đã cập nhật media vào CSDL!');
  };

  const triggerMediaUpload = (target) => {
    setUploadTarget(target);
    if (fileInputRef.current) {
      fileInputRef.current.accept = target.fileType === 'video'
        ? 'video/mp4,video/webm,video/*'
        : target.fileType === 'media'
          ? 'image/*,video/mp4,video/webm,video/*'
          : 'image/*';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setUploadingState(`Đang đọc và chuẩn hóa dữ liệu (${sizeMb} MB)...`);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        const meta = {
          originalName: file.name,
          size: `${sizeMb} MB`,
          type: file.type,
          uploadedAt: new Date().toLocaleTimeString('vi-VN'),
        };

        if (uploadTarget.type === 'concept') {
          const idx = uploadTarget.index;
          const num = String(idx + 1).padStart(2, '0');
          const standardPath = `/assets/projects/project-${num}.${file.type.startsWith('video/') ? 'mp4' : 'jpg'}`;
          uploadConceptMedia(idx, dataUrl, meta);
          setUploadingState('');
          showToast(`✅ Đã tải ảnh lên và chuẩn hóa thành ${standardPath} (${sizeMb} MB)`);
        } else if (uploadTarget.type === 'standard') {
          uploadStandardMedia(uploadTarget.key, uploadTarget.standardPath, dataUrl, meta);
          setUploadingState('');
          showToast(`✅ Đã tải lên và chuẩn hóa thành ${uploadTarget.standardPath} (${sizeMb} MB)`);
        }
      }
    };
    reader.onerror = () => {
      setUploadingState('');
      alert('Không thể đọc tệp đã chọn. Vui lòng thử lại với tệp khác.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderMediaUploader = ({
    label,
    standardKey,
    standardPath,
    fileType = 'image',
    helperText,
  }) => {
    const meta = mediaMeta?.[standardPath] || mediaMeta?.[standardKey];
    const isCustom = Boolean(meta?.uploadedAt);
    const currentValue = media[standardKey] || '';
    const resolvedSrc = resolveMedia(currentValue || standardPath);
    const previewIsVideo = isVideoMedia(resolvedSrc, meta?.type || fileType);
    const uploadLabel = fileType === 'video'
      ? 'Tải video từ máy tính'
      : fileType === 'media'
        ? 'Tải ảnh hoặc video'
        : 'Tải ảnh từ máy tính';

    return (
      <div className="admin-form-group full-width" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="admin-label" style={{ margin: 0 }}>
            {label}
          </label>
          {isCustom ? (
            <span style={{ fontSize: '11px', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <CheckCircle2 size={13} />
              Đã lưu ({meta.size}) • Gốc: {meta.originalName}
            </span>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
              Tệp gốc: {standardPath.split('/').pop()}
            </span>
          )}
        </div>

        <div className="admin-media-box">
          {previewIsVideo ? (
            <video
              className="admin-media-video-preview"
              src={resolvedSrc}
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img
              className="admin-media-thumb"
              src={resolvedSrc}
              alt={label}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="admin-media-route">
              <span>Vị trí trên landing page</span>
              <code>{standardPath}</code>
            </div>
            <small className="admin-media-help">
              Preview bên trái là nội dung landing page sẽ dùng. Bạn có thể dán URL vào ô dưới hoặc bấm upload để lưu file vào trình duyệt.
            </small>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                className="admin-input"
                value={currentValue}
                onChange={(e) => handleMediaChange(standardKey, e.target.value)}
                placeholder={standardPath}
                title="Đường dẫn tệp chuẩn hóa trong hệ thống"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#93c5fd', fontWeight: 600 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="admin-file-upload-btn"
                onClick={() =>
                  triggerMediaUpload({
                    type: 'standard',
                    key: standardKey,
                    standardPath,
                    fileType,
                    label,
                  })
                }
              >
                <Upload size={14} />
                <span>{uploadLabel}</span>
              </button>

              {isCustom && (
                <button
                  type="button"
                  className="admin-file-upload-btn"
                  style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                  onClick={() => {
                    resetStandardMedia(standardKey, standardPath);
                    showToast(`Đã khôi phục ${label} về mặc định!`);
                  }}
                  title="Khôi phục tệp mẫu gốc ban đầu"
                >
                  <RotateCcw size={13} />
                  <span>Dùng tệp gốc</span>
                </button>
              )}
            </div>

            {helperText && (
              <small style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>
                {helperText}
              </small>
            )}
          </div>
        </div>
      </div>
    );
  };

  const currentLangData = allContent[editLang] || allContent.vi;

  const handleExport = () => {
    const jsonStr = exportContentJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loops-landing-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file cấu hình JSON!');
  };

  const handleImportSubmit = async () => {
    if (!importJsonText.trim()) return;
    const res = await importContentJson(importJsonText);
    if (res.success) {
      showToast('Đã nhập và lưu dữ liệu thành công!');
      setShowImportModal(false);
      setImportJsonText('');
    } else {
      alert(`Lỗi nhập dữ liệu: ${res.error}`);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ nội dung và hình ảnh về mặc định ban đầu không?')) {
      await resetContentToDefaults();
      showToast('Đã khôi phục toàn bộ về mặc định!');
    }
  };

  return (
    <div className="admin-portal">
      {/* Hidden file uploader */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,video/*"
        onChange={handleFileUpload}
      />

      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-brand">
          <span className="admin-brand-logo">LOOPS CMS</span>
          <span className="admin-badge">Landing Page Manager</span>
          {lastSaved && (
            <span
              style={{
                fontSize: '11px',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginLeft: '10px',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isSaving ? '#f59e0b' : '#10b981',
                  display: 'inline-block',
                }}
              />
              {isSaving ? 'Đang lưu vào CSDL...' : `Đã lưu vĩnh viễn (${lastSaved})`}
            </span>
          )}
        </div>

        <div className="admin-nav-actions">
          {/* Language Switcher for Editing */}
          <div className="admin-lang-picker">
            <button
              type="button"
              className={`admin-lang-option ${editLang === 'vi' ? 'is-active' : ''}`}
              onClick={() => setEditLang('vi')}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              type="button"
              className={`admin-lang-option ${editLang === 'en' ? 'is-active' : ''}`}
              onClick={() => setEditLang('en')}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Explicit Prominent Save Button */}
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleManualSave}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              fontWeight: 800,
            }}
            title="Lưu tất cả thay đổi ngay lập tức vào trình duyệt"
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleExport}
            title="Xuất file JSON sao lưu"
          >
            <Download size={15} />
            <span>Xuất JSON</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setShowImportModal(true)}
            title="Nhập file JSON"
          >
            <Upload size={15} />
            <span>Nhập JSON</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={handleReset}
            title="Đặt lại cài đặt gốc"
          >
            <RotateCcw size={15} />
            <span>Đặt lại</span>
          </button>

          <a
            href="/"
            className="admin-btn admin-btn-primary"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <Eye size={15} />
            <span>Xem Website</span>
          </a>
        </div>
      </header>

      {/* Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-nav-section-title">Quản trị nội dung</div>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={17} />
            <span>Tổng quan</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'hero' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Sparkles size={17} />
            <span>Hero Section (Đầu trang)</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'solve' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('solve')}
          >
            <Layers size={17} />
            <span>01 · Điều chúng tôi giải quyết</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'offers' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <VideoIcon size={17} />
            <span>02 · Hai cách bắt đầu (Offers)</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'works' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('works')}
          >
            <ImageIcon size={17} />
            <span>03 · Dự án (Concepts)</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'signals' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('signals')}
          >
            <Sliders size={17} />
            <span>04 · Tín hiệu & Collage</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'playground' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('playground')}
          >
            <Settings size={17} />
            <span>05 · Sân chơi (Playground)</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'finalCta' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('finalCta')}
          >
            <ArrowUpRight size={17} />
            <span>06 · Vòng lặp cuối (Final CTA)</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'navFooter' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('navFooter')}
          >
            <Compass size={17} />
            <span>Menu, Header & Footer</span>
          </button>

          <div className="admin-nav-section-title" style={{ marginTop: '14px' }}>Tài nguyên & Đa phương tiện</div>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'mediaLib' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('mediaLib')}
          >
            <ImageIcon size={17} />
            <span>Thư viện Media (Ảnh & Video)</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Tổng quan trang Landing Page</h1>
                  <p className="admin-page-desc">
                    Hệ thống quản trị nội dung linh hoạt cho LOOPS. Chỉnh sửa văn bản, hình ảnh, video và xem thay đổi ngay lập tức.
                  </p>
                </div>
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon"><FileText size={22} /></div>
                  <div className="admin-stat-info">
                    <strong>7 Sections</strong>
                    <span>Cấu trúc Landing Page</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ color: 'var(--admin-gold)', background: 'rgba(223, 168, 91, 0.12)' }}>
                    <Sparkles size={22} />
                  </div>
                  <div className="admin-stat-info">
                    <strong>Song ngữ VI & EN</strong>
                    <span>Tự động đồng bộ</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
                    <VideoIcon size={22} />
                  </div>
                  <div className="admin-stat-info">
                    <strong>10+ Media Assets</strong>
                    <span>Video nền & Hình ảnh sắc nét</span>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">
                    <Sparkles size={18} style={{ color: 'var(--admin-accent)' }} />
                    Hướng dẫn thao tác nhanh
                  </h2>
                </div>
                <div style={{ lineHeight: 1.7, fontSize: '13px', color: '#d1d5db' }}>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li><strong>Chỉnh sửa ngôn ngữ:</strong> Chọn tab <code>Tiếng Việt</code> hoặc <code>English</code> ở thanh menu trên cùng để tùy biến nội dung theo từng ngôn ngữ.</li>
                    <li><strong>Thay đổi hình ảnh / video:</strong> Vào từng section hoặc vào mục <code>Thư viện Media</code>, bạn có thể dán đường dẫn URL hoặc bấm <code>Tải tệp lên</code> từ máy tính.</li>
                    <li><strong>Lưu tự động (Auto-save):</strong> Mọi thay đổi được tự động ghi nhớ vào trình duyệt ngay lập tức.</li>
                    <li><strong>Sao lưu dữ liệu:</strong> Sử dụng nút <code>Xuất JSON</code> để lưu file cấu hình dự phòng và <code>Nhập JSON</code> khi muốn đồng bộ giữa các máy.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERO */}
          {activeTab === 'hero' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Hero Section (Đầu trang)</h1>
                  <p className="admin-page-desc">Chỉnh sửa 4 dòng tiêu đề lớn, phụ đề giới thiệu, video nền và ảnh poster.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">4 Dòng tiêu đề hiển thị ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 1</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.hero?.line1 || ''}
                      onChange={(e) => handleFieldChange('hero', 'line1', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 2</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.hero?.line2 || ''}
                      onChange={(e) => handleFieldChange('hero', 'line2', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 3</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.hero?.line3 || ''}
                      onChange={(e) => handleFieldChange('hero', 'line3', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 4</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.hero?.line4 || ''}
                      onChange={(e) => handleFieldChange('hero', 'line4', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Đoạn phụ đề dưới tiêu đề (Support description)</label>
                    <textarea
                      className="admin-textarea"
                      value={currentLangData.hero?.support || ''}
                      onChange={(e) => handleFieldChange('hero', 'support', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Nút xem dự án (CTA Button Text)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.hero?.exploreWorks || ''}
                      onChange={(e) => handleFieldChange('hero', 'exploreWorks', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Gợi ý cuộn trang (Scroll cue)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.hero?.scrollCue || ''}
                      onChange={(e) => handleFieldChange('hero', 'scrollCue', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Video nền Hero & Poster</h2>
                </div>

                {renderMediaUploader({
                  label: 'Video nền Hero Section (MP4)',
                  standardKey: 'heroVideo',
                  standardPath: '/assets/hero-loops.mp4',
                  fileType: 'video',
                  helperText: 'Tự động chuẩn hóa và lưu trữ thành /assets/hero-loops.mp4.',
                })}

                {renderMediaUploader({
                  label: 'Ảnh Poster Hero (Hiển thị khi chưa tải xong video)',
                  standardKey: 'heroPoster',
                  standardPath: '/assets/projects/project-01.jpg',
                  fileType: 'image',
                  helperText: 'Tự động chuẩn hóa và lưu trữ thành /assets/projects/project-01.jpg.',
                })}
              </div>
            </div>
          )}

          {/* TAB: SOLVE */}
          {activeTab === 'solve' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">01 · Điều chúng tôi giải quyết</h1>
                  <p className="admin-page-desc">Quản lý tiêu đề lớn, danh sách các thẻ vấn đề và 3 trụ cột dịch vụ (BUILD, GROW, OPERATE).</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Tiêu đề Section ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Nhãn Section (Section Label)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.solve?.sectionLabel || ''}
                      onChange={(e) => handleFieldChange('solve', 'sectionLabel', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Từ 1 (VẤN ĐỀ / REAL)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.solve?.word1 || ''}
                      onChange={(e) => handleFieldChange('solve', 'word1', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Từ 2 (THỰC TẾ / PROBLEMS)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.solve?.word2 || ''}
                      onChange={(e) => handleFieldChange('solve', 'word2', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Từ Outline (KẾT QUẢ / REAL)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.solve?.wordOutline || ''}
                      onChange={(e) => handleFieldChange('solve', 'wordOutline', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Từ 4 (THỰC / RESULTS)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.solve?.word4 || ''}
                      onChange={(e) => handleFieldChange('solve', 'word4', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Problem Tags List */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Các thẻ vấn đề thường gặp (Problem Tags)</h2>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => addListItem(editLang, 'solve', 'problems', 'VẤN ĐỀ MỚI')}
                  >
                    <Plus size={15} />
                    <span>Thêm vấn đề</span>
                  </button>
                </div>
                <div className="admin-list-container">
                  {(currentLangData.solve?.problems || []).map((problem, idx) => (
                    <div key={idx} className="admin-list-item">
                      <span style={{ fontWeight: 800, color: 'var(--admin-accent)', width: '32px' }}>0{idx + 1}</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={problem}
                        onChange={(e) => {
                          updateListItem(editLang, 'solve', 'problems', idx, e.target.value);
                          showToast('Đã cập nhật!');
                        }}
                      />
                      <button
                        type="button"
                        className="admin-btn-icon"
                        onClick={() => deleteListItem(editLang, 'solve', 'problems', idx)}
                        title="Xóa vấn đề"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Pillars */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">03 Trụ cột dịch vụ (BUILD / GROW / OPERATE)</h2>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {(currentLangData.solve?.pillars || []).map((pillar, idx) => (
                    <div key={idx} style={{ background: 'rgba(15, 18, 23, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                      <div className="admin-form-grid">
                        <div className="admin-form-group">
                          <label className="admin-label">Tên Trụ cột #{idx + 1}</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={pillar.title}
                            onChange={(e) => {
                              const updatedPillar = { ...pillar, title: e.target.value };
                              updateListItem(editLang, 'solve', 'pillars', idx, updatedPillar);
                              showToast('Đã lưu!');
                            }}
                          />
                        </div>
                        <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="admin-label">Danh mục dịch vụ đi kèm</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={pillar.services}
                            onChange={(e) => {
                              const updatedPillar = { ...pillar, services: e.target.value };
                              updateListItem(editLang, 'solve', 'pillars', idx, updatedPillar);
                              showToast('Đã lưu!');
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: OFFERS */}
          {activeTab === 'offers' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">02 · Hai cách bắt đầu (Offers Bridge)</h1>
                  <p className="admin-page-desc">Tùy biến giá thuê website, mô tả gói thiết kế website riêng và video minh họa chuyển động.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Thông tin chung ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Tiêu đề dòng 1</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.title1 || ''}
                      onChange={(e) => handleFieldChange('offers', 'title1', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Tiêu đề dòng 2</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.title2 || ''}
                      onChange={(e) => handleFieldChange('offers', 'title2', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Kicker nhỏ phía trên</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.kicker || ''}
                      onChange={(e) => handleFieldChange('offers', 'kicker', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Chú thích chân khung (Caption)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.caption || ''}
                      onChange={(e) => handleFieldChange('offers', 'caption', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Gói 01: Thuê Website (Rental)</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Tên gói</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.rentalLabel || ''}
                      onChange={(e) => handleFieldChange('offers', 'rentalLabel', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Giá niêm yết</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.rentalPrice || ''}
                      onChange={(e) => handleFieldChange('offers', 'rentalPrice', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Đơn vị chu kỳ (VD: / tháng)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.rentalUnit || ''}
                      onChange={(e) => handleFieldChange('offers', 'rentalUnit', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Nút xem chi tiết thuê</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.rentalCta || ''}
                      onChange={(e) => handleFieldChange('offers', 'rentalCta', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Gói 02: Thiết kế Website Riêng (Custom Website)</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Tên gói</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.customLabel || ''}
                      onChange={(e) => handleFieldChange('offers', 'customLabel', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group full-width">
                    <label className="admin-label">Mô tả gói thiết kế riêng</label>
                    <textarea
                      className="admin-textarea"
                      value={currentLangData.offers?.customDesc || ''}
                      onChange={(e) => handleFieldChange('offers', 'customDesc', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Nút xem dịch vụ riêng</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.offers?.customCta || ''}
                      onChange={(e) => handleFieldChange('offers', 'customCta', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Video minh họa chuyển động gói Bảng giá (Offers Video)</h2>
                </div>
                {renderMediaUploader({
                  label: 'Video chuyển động Price Motion (MP4)',
                  standardKey: 'offersVideo',
                  standardPath: '/assets/video-price-2.mp4',
                  fileType: 'video',
                  helperText: 'Tự động chuẩn hóa và lưu trữ thành /assets/video-price-2.mp4 trong hệ thống.',
                })}
              </div>
            </div>
          )}

          {/* TAB: WORKS / CONCEPTS */}
          {activeTab === 'works' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">03 · Dự án (Selected Concepts)</h1>
                  <p className="admin-page-desc">Quản lý danh sách các mẫu concept dự án, tiêu đề, thể loại và tải ảnh trực tiếp từ máy tính lên hệ thống.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Tiêu đề Section ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 1</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.works?.title1 || ''}
                      onChange={(e) => handleFieldChange('works', 'title1', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 2</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.works?.title2 || ''}
                      onChange={(e) => handleFieldChange('works', 'title2', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group full-width">
                    <label className="admin-label">Mô tả ngắn</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.works?.desc || ''}
                      onChange={(e) => handleFieldChange('works', 'desc', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Danh sách Concept ({currentLangData.works?.concepts?.length || 0})</h2>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => {
                      const nextIdx = currentLangData.works?.concepts?.length || 0;
                      const num = String(nextIdx + 1).padStart(2, '0');
                      addListItem(editLang, 'works', 'concepts', {
                        title: `Concept Dự Án Mới #${nextIdx + 1}`,
                        type: 'Thương hiệu / Web / UX',
                        image: `/assets/projects/project-${num}.jpg`,
                      });
                    }}
                  >
                    <Plus size={15} />
                    <span>Thêm Concept</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {(currentLangData.works?.concepts || []).map((concept, idx) => {
                    const num = String(idx + 1).padStart(2, '0');
                    const standardPath = `/assets/projects/project-${num}.jpg`;
                    const standardKey = `project${num}`;
                    const meta = mediaMeta?.[standardPath] || mediaMeta?.[concept.image] || mediaMeta?.[standardKey];
                    const isCustom = Boolean(meta?.uploadedAt);
                    const resolvedImg = resolveMedia(concept.image, standardPath);
                    const conceptIsVideo = isVideoMedia(resolvedImg, concept.mediaType || meta?.type);

                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(15, 18, 23, 0.6)',
                          border: isCustom ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--admin-border)',
                          borderRadius: '12px',
                          padding: '18px',
                          display: 'grid',
                          gridTemplateColumns: '140px 1fr 40px',
                          gap: '18px',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                          {conceptIsVideo ? (
                            <video
                              src={resolvedImg}
                              muted
                              autoPlay
                              loop
                              playsInline
                              style={{
                                width: '140px',
                                height: '92px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: '#090a0c',
                              }}
                            />
                          ) : (
                            <img
                              src={resolvedImg}
                              alt={concept.title}
                              style={{
                                width: '140px',
                                height: '92px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: '#090a0c',
                              }}
                            />
                          )}
                          <button
                            type="button"
                            className="admin-file-upload-btn"
                            style={{ width: '100%', justifyContent: 'center', fontSize: '11px', padding: '6px 8px' }}
                            onClick={() =>
                              triggerMediaUpload({
                                type: 'concept',
                                index: idx,
                                fileType: 'media',
                                label: `Concept #${idx + 1}`,
                              })
                            }
                          >
                            <Upload size={13} />
                            <span>Tải ảnh/video</span>
                          </button>
                        </div>

                        <div className="admin-form-grid" style={{ gap: '12px' }}>
                          <div className="admin-form-group">
                            <label className="admin-label">Tên Concept #{idx + 1}</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={concept.title}
                              onChange={(e) => {
                                const updated = { ...concept, title: e.target.value };
                                updateListItem(editLang, 'works', 'concepts', idx, updated);
                                showToast('Đã lưu!');
                              }}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-label">Thể loại / Tags</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={concept.type}
                              onChange={(e) => {
                                const updated = { ...concept, type: e.target.value };
                                updateListItem(editLang, 'works', 'concepts', idx, updated);
                                showToast('Đã lưu!');
                              }}
                            />
                          </div>

                          <div className="admin-form-group full-width">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label className="admin-label" style={{ margin: 0 }}>
                                Đường dẫn ảnh Concept (Chuẩn hóa tự động)
                              </label>
                              {isCustom ? (
                                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircle2 size={13} />
                                  Đã lưu ({meta.size}) • Gốc: {meta.originalName} ➔ {standardPath}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>
                                  Tệp mẫu: project-{num}.jpg
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input
                                type="text"
                                className="admin-input"
                                value={concept.image || standardPath}
                                onChange={(e) => {
                                  const updated = { ...concept, image: e.target.value };
                                  updateListItem(editLang, 'works', 'concepts', idx, updated);
                                  showToast('Đã lưu đường dẫn!');
                                }}
                                style={{ background: 'rgba(255,255,255,0.03)', color: '#93c5fd', fontWeight: 600 }}
                              />
                              {isCustom && (
                                <button
                                  type="button"
                                  className="admin-file-upload-btn"
                                  style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)', whiteSpace: 'nowrap' }}
                                  onClick={() => {
                                    resetConceptMedia(idx);
                                    showToast(`Đã khôi phục Concept #${idx + 1} về ảnh gốc!`);
                                  }}
                                  title="Khôi phục ảnh mẫu gốc ban đầu"
                                >
                                  <RotateCcw size={13} />
                                  <span>Dùng ảnh gốc</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() => deleteListItem(editLang, 'works', 'concepts', idx)}
                            title="Xóa concept"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SIGNALS */}
          {activeTab === 'signals' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">04 · Tín hiệu & Collage (Signals)</h1>
                  <p className="admin-page-desc">Quản lý 3 từ khóa chuyển động lớn, ticker văn bản và các hình ảnh trong collage.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">3 Từ khóa chuyển động lớn ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Từ A (TẠO / SET)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.signals?.wordA || ''}
                      onChange={(e) => handleFieldChange('signals', 'wordA', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Từ B (RA / THE)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.signals?.wordB || ''}
                      onChange={(e) => handleFieldChange('signals', 'wordB', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Từ C (NHỊP. / RHYTHM.)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.signals?.wordC || ''}
                      onChange={(e) => handleFieldChange('signals', 'wordC', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Ticker chạy chữ vô tận (Marquee Ticker)</h2>
                </div>
                <div className="admin-form-group full-width">
                  <label className="admin-label">Nội dung Ticker</label>
                  <textarea
                    className="admin-textarea"
                    value={currentLangData.signals?.ticker || ''}
                    onChange={(e) => handleFieldChange('signals', 'ticker', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Video & Hình ảnh Tín hiệu LOOPS</h2>
                </div>

                {renderMediaUploader({
                  label: 'Khung chất lỏng chuyển động (Liquid Loop - ảnh/video)',
                  standardKey: 'liquidLoop',
                  standardPath: '/assets/liquid-loop.mp4',
                  fileType: 'media',
                  helperText: 'Có thể dùng ảnh JPG/PNG hoặc video MP4/WebM. Landing page sẽ tự hiển thị đúng loại media.',
                })}

                {renderMediaUploader({
                  label: 'Bề mặt chất lỏng phản chiếu (Liquid Surface JPG)',
                  standardKey: 'liquidSurface',
                  standardPath: '/assets/liquid-surface.jpg',
                  fileType: 'image',
                  helperText: 'Tự động chuẩn hóa và lưu trữ thành /assets/liquid-surface.jpg.',
                })}

                {renderMediaUploader({
                  label: 'Biểu tượng chữ O chất lỏng (Liquid O - ảnh/video)',
                  standardKey: 'liquidO',
                  standardPath: '/assets/liquid-o.png',
                  fileType: 'media',
                  helperText: 'Có thể dùng ảnh PNG/JPG hoặc video MP4/WebM. Landing page sẽ tự hiển thị đúng loại media.',
                })}
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">4 Hình ảnh trong Khung Collage Chuyển động</h2>
                </div>

                <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {renderMediaUploader({
                    label: 'Ảnh 1 - Trên Trái (Brand Space)',
                    standardKey: 'project05',
                    standardPath: '/assets/projects/project-05.jpg',
                    fileType: 'media',
                  })}

                  {renderMediaUploader({
                    label: 'Ảnh 2 - Dưới Trái (Tech UI)',
                    standardKey: 'project04',
                    standardPath: '/assets/projects/project-04.jpg',
                    fileType: 'media',
                  })}

                  {renderMediaUploader({
                    label: 'Ảnh 3 - Trên Phải (Interaction)',
                    standardKey: 'project07',
                    standardPath: '/assets/projects/project-07.jpg',
                    fileType: 'media',
                  })}

                  {renderMediaUploader({
                    label: 'Ảnh 4 - Dưới Phải (Reflection)',
                    standardKey: 'project06',
                    standardPath: '/assets/projects/project-06.jpg',
                    fileType: 'media',
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLAYGROUND */}
          {activeTab === 'playground' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">05 · Sân chơi tương tác (Playground)</h1>
                  <p className="admin-page-desc">Chỉnh sửa tiêu đề và tên các thanh trượt điều khiển chuyển động.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Tiêu đề & Nhãn ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 1 (CHƠI CÙNG / PLAY WITH)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.playground?.title1 || ''}
                      onChange={(e) => handleFieldChange('playground', 'title1', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Dòng 2 (Ý TƯỞNG. / IDEAS.)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.playground?.title2 || ''}
                      onChange={(e) => handleFieldChange('playground', 'title2', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group full-width">
                    <label className="admin-label">Mô tả</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.playground?.desc || ''}
                      onChange={(e) => handleFieldChange('playground', 'desc', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Nhãn Thanh trượt 1 (Flow / Nhịp)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.playground?.flow || ''}
                      onChange={(e) => handleFieldChange('playground', 'flow', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Nhãn Thanh trượt 2 (Depth / Độ sâu)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.playground?.depth || ''}
                      onChange={(e) => handleFieldChange('playground', 'depth', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Nhãn Thanh trượt 3 (Energy / Năng lượng)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.playground?.energy || ''}
                      onChange={(e) => handleFieldChange('playground', 'energy', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Hình ảnh & Texture Sân chơi Tương tác</h2>
                </div>

                <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {renderMediaUploader({
                    label: 'Bề mặt Texture (Liquid Surface)',
                    standardKey: 'liquidSurface',
                    standardPath: '/assets/liquid-surface.jpg',
                    fileType: 'image',
                  })}

                  {renderMediaUploader({
                    label: 'Chữ O Tương tác (Liquid O - ảnh/video)',
                    standardKey: 'liquidO',
                    standardPath: '/assets/liquid-o.png',
                    fileType: 'media',
                  })}

                  {renderMediaUploader({
                    label: 'Ảnh chi tiết 1 (Project 02)',
                    standardKey: 'project02',
                    standardPath: '/assets/projects/project-02.jpg',
                    fileType: 'media',
                  })}

                  {renderMediaUploader({
                    label: 'Ảnh chi tiết 2 (Project 08)',
                    standardKey: 'project08',
                    standardPath: '/assets/projects/project-08.jpg',
                    fileType: 'media',
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINAL CTA */}
          {activeTab === 'finalCta' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">06 · Vòng lặp cuối (Final CTA)</h1>
                  <p className="admin-page-desc">Chỉnh sửa lời kêu gọi hành động cuối trang và đường link liên kết tới trang báo giá.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Nội dung CTA ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Tiêu đề dòng 1 (BẮT ĐẦU / START THE)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.finalCta?.line1 || ''}
                      onChange={(e) => handleFieldChange('finalCta', 'line1', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Tiêu đề dòng 2 (VÒNG. / LOOP.)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.finalCta?.line2 || ''}
                      onChange={(e) => handleFieldChange('finalCta', 'line2', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group full-width">
                    <label className="admin-label">Phụ đề dưới</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.finalCta?.bottomText || ''}
                      onChange={(e) => handleFieldChange('finalCta', 'bottomText', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Chữ hiển thị trên Nút</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.finalCta?.button || ''}
                      onChange={(e) => handleFieldChange('finalCta', 'button', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Đường dẫn liên kết nút (URL)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.finalCta?.buttonLink || 'https://www.loops.vn/bao-gia'}
                      onChange={(e) => handleFieldChange('finalCta', 'buttonLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NAV & FOOTER */}
          {activeTab === 'navFooter' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Menu, Header & Footer</h1>
                  <p className="admin-page-desc">Tùy biến nhãn các mục trên thanh điều hướng và thông tin liên hệ ở chân trang.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Menu Header ({editLang.toUpperCase()})</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Mục Trang chủ</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.nav?.home || ''}
                      onChange={(e) => handleFieldChange('nav', 'home', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Mục Dự án</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.nav?.works || ''}
                      onChange={(e) => handleFieldChange('nav', 'works', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Mục Dịch vụ</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.nav?.services || ''}
                      onChange={(e) => handleFieldChange('nav', 'services', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Mục Bảng giá</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.nav?.pricing || ''}
                      onChange={(e) => handleFieldChange('nav', 'pricing', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Mục Giới thiệu</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.nav?.about || ''}
                      onChange={(e) => handleFieldChange('nav', 'about', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Nút Bắt đầu dự án</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.nav?.startProject || ''}
                      onChange={(e) => handleFieldChange('nav', 'startProject', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Chân trang (Footer)</h2>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Tên công ty</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.footer?.company || ''}
                      onChange={(e) => handleFieldChange('footer', 'company', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Slogan phụ đề</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.footer?.subtitle || ''}
                      onChange={(e) => handleFieldChange('footer', 'subtitle', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Email liên hệ</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentLangData.footer?.email || 'hello@loops.company'}
                      onChange={(e) => handleFieldChange('footer', 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEDIA LIBRARY */}
          {activeTab === 'mediaLib' && (
            <div>
              <div className="admin-header-row">
                <div>
                  <h1 className="admin-page-title">Thư viện Media & Video</h1>
                  <p className="admin-page-desc">Quản lý toàn bộ video chuyển động và các ảnh chất lỏng / phong cảnh được dùng trên landing page.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Các Video Chuyển Động Hệ Thống</h2>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                  {renderMediaUploader({
                    label: 'Video Hero Chính (Hero Loops MP4)',
                    standardKey: 'heroVideo',
                    standardPath: '/assets/hero-loops.mp4',
                    fileType: 'video',
                    helperText: 'Tự động chuẩn hóa thành /assets/hero-loops.mp4.',
                  })}

                  {renderMediaUploader({
                    label: 'Video Bảng Giá / Offers (Price Motion MP4)',
                    standardKey: 'offersVideo',
                    standardPath: '/assets/video-price-2.mp4',
                    fileType: 'video',
                    helperText: 'Tự động chuẩn hóa thành /assets/video-price-2.mp4.',
                  })}

                  {renderMediaUploader({
                    label: 'Khung Chất Lỏng (Liquid Loop - ảnh/video)',
                    standardKey: 'liquidLoop',
                    standardPath: '/assets/liquid-loop.mp4',
                    fileType: 'media',
                    helperText: 'Có thể dùng ảnh JPG/PNG hoặc video MP4/WebM.',
                  })}
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Các Hình Ảnh Hệ Thống & Concepts (Chuẩn hóa tự động)</h2>
                </div>

                <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
                  {renderMediaUploader({
                    label: 'Bề mặt chất lỏng (Liquid Surface)',
                    standardKey: 'liquidSurface',
                    standardPath: '/assets/liquid-surface.jpg',
                    fileType: 'image',
                  })}

                  {renderMediaUploader({
                    label: 'Biểu tượng chữ O (Liquid O - ảnh/video)',
                    standardKey: 'liquidO',
                    standardPath: '/assets/liquid-o.png',
                    fileType: 'media',
                  })}

                  {[
                    { key: 'project01', path: '/assets/projects/project-01.jpg', label: 'Concept 01 (F&B Brand)' },
                    { key: 'project02', path: '/assets/projects/project-02.jpg', label: 'Concept 02 (Tech Platform)' },
                    { key: 'project03', path: '/assets/projects/project-03.jpg', label: 'Concept 03 (Lifestyle)' },
                    { key: 'project04', path: '/assets/projects/project-04.jpg', label: 'Concept 04 (Campaign)' },
                    { key: 'project05', path: '/assets/projects/project-05.jpg', label: 'Concept 05 (Brand Space)' },
                    { key: 'project06', path: '/assets/projects/project-06.jpg', label: 'Concept 06 (Reflection)' },
                    { key: 'project07', path: '/assets/projects/project-07.jpg', label: 'Concept 07 (Interaction)' },
                    { key: 'project08', path: '/assets/projects/project-08.jpg', label: 'Concept 08 (Playground Crop)' },
                  ].map((item) => (
                    <div key={item.key}>
                      {renderMediaUploader({
                        label: item.label,
                        standardKey: item.key,
                        standardPath: item.path,
                        fileType: 'media',
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Quick-Save Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 900,
        }}
      >
        <button
          type="button"
          onClick={handleManualSave}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 24px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '14px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
          title="Lưu tất cả thay đổi vào cơ sở dữ liệu trình duyệt (F5 không mất)"
        >
          <Save size={18} />
          <span>{isSaving ? 'Đang lưu vào CSDL...' : 'LƯU THAY ĐỔI'}</span>
        </button>
      </div>

      {/* Floating Save Toast */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Uploading Status Overlay Toast */}
      {uploadingState && (
        <div
          className="admin-toast"
          style={{
            background: '#2563eb',
            bottom: toastMessage ? '84px' : '28px',
            boxShadow: '0 12px 36px rgba(37, 99, 235, 0.5)',
          }}
        >
          <Upload size={18} />
          <span>{uploadingState}</span>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowImportModal(false)}
        >
          <div
            style={{
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800 }}>Nhập dữ liệu cấu hình JSON</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
              Dán nội dung JSON đã xuất từ trước để cập nhật toàn bộ Landing Page.
            </p>
            <textarea
              rows={10}
              className="admin-textarea"
              placeholder="Dán mã JSON vào đây..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '12px', marginBottom: '18px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowImportModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleImportSubmit}
              >
                Nhập dữ liệu ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
