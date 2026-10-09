import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveToDB, getFromDB, clearDB } from './dbStorage';

const DB_CONTENT_KEY = 'loops_site_content_v1';
const DEPLOY_CONTENT_URL = '/loops-site-content.json';

const LanguageContext = createContext(null);

const defaultMedia = {
  heroVideo: '/assets/hero-loops.mp4',
  heroPoster: '/assets/projects/project-01.jpg',
  offersVideo: '', // Empty means fallback to imported bundle
  liquidSurface: '/assets/liquid-surface.jpg',
  liquidLoop: '/assets/liquid-loop.mp4',
  liquidO: '/assets/liquid-o.png',
  project01: '/assets/projects/project-01.jpg',
  project02: '/assets/projects/project-02.jpg',
  project03: '/assets/projects/project-03.jpg',
  project04: '/assets/projects/project-04.jpg',
  project05: '/assets/projects/project-05.jpg',
  project06: '/assets/projects/project-06.jpg',
  project07: '/assets/projects/project-07.jpg',
  project08: '/assets/projects/project-08.jpg',
};

const isVideoType = (value = '') => String(value).toLowerCase().startsWith('video/');

const defaultTranslations = {
  vi: {
    nav: {
      brand: 'LOOPS',
      home: 'Trang chủ',
      works: 'Dự án',
      services: 'Dịch vụ',
      customDesign: 'Thiết kế website doanh nghiệp',
      rental: 'Thuê website trọn gói',
      pricing: 'Bảng giá',
      about: 'Giới thiệu',
      startProject: 'Bắt đầu dự án',
      startProjectLink: 'https://www.loops.vn/bao-gia',
    },
    hero: {
      line1: 'BIẾN',
      line2: 'PHỨC TẠP',
      line3: 'THÀNH',
      line4: 'RÕ RÀNG.',
      support: 'Trải nghiệm số, thương hiệu và hệ thống cho một ngày mai kết nối hơn.',
      exploreWorks: 'Xem dự án',
      scrollCue: 'Cuộn để khám phá',
      skipIntro: 'Bỏ qua intro',
    },
    solve: {
      sectionLabel: 'Điều chúng tôi giải quyết',
      word1: 'VẤN ĐỀ',
      word2: 'THỰC TẾ.',
      wordOutline: 'KẾT QUẢ',
      word4: 'THỰC.',
      problems: [
        'WEBSITE CHẬM',
        'UX TỆ',
        'THIẾU BẢN SẮC',
        'HỆ THỐNG RỐI',
        'NỘI DUNG NHẠT',
      ],
      notePillars: '03 trụ cột dịch vụ',
      noteSystem: '01 hệ thống kết nối',
      pillars: [
        { title: 'BUILD', services: 'Landing Page / Business Website / E-commerce / Web App / Dashboard / UI/UX' },
        { title: 'GROW', services: 'SEO / Content / Analytics / Conversion Optimization / Email Marketing' },
        { title: 'OPERATE', services: 'Hosting / SSL / Maintenance / Backup / CRM Integration / ERP Integration / Marketing Automation / Technical Support' },
      ],
    },
    offers: {
      sectionLabel: 'Hai cách bắt đầu',
      kicker: 'Website Rental / Custom Website',
      title1: 'START SMALL.',
      title2: 'SCALE WHEN READY.',
      progressStart: 'Khởi đầu',
      progressScale: 'Mở rộng',
      rentalLabel: 'Website Rental',
      rentalPrice: '189.000đ',
      rentalUnit: '/ tháng',
      rentalCta: 'Tìm hiểu thuê website',
      pricingLink: 'Xem bảng giá',
      customLabel: 'Custom Website',
      customDesc: 'Thiết kế và phát triển hệ thống riêng khi doanh nghiệp cần mở rộng.',
      customCta: 'Thiết kế website riêng',
      caption: 'Rental → Scale → Custom',
    },
    works: {
      sectionLabel: 'SELECTED CONCEPTS',
      title1: 'Ý TƯỞNG',
      title2: 'BỀN VỮNG.',
      desc: 'Thử nghiệm ý tưởng và khám phá giao diện thị giác bởi LOOPS.',
      counterNumber: '04',
      counterLabel: 'Concepts / Khám phá thị giác',
      exploreAria: 'Khám phá',
      concepts: [
        { title: 'Khám phá thương hiệu F&B', type: 'Bản sắc / Web / Nội dung', image: '/assets/projects/project-01.jpg' },
        { title: 'Nền tảng công nghệ tương lai', type: 'Sản phẩm / Hệ thống / UX', image: '/assets/projects/project-02.jpg' },
        { title: 'Hệ thống nội dung phong cách sống', type: 'Vận hành / Nội dung / Giao diện', image: '/assets/projects/project-03.jpg' },
        { title: 'Thử nghiệm chiến dịch sáng tạo', type: 'Ra mắt / Chuyển động / Thương hiệu', image: '/assets/projects/project-04.jpg' },
      ],
    },
    signals: {
      sectionLabel: 'Tín hiệu LOOPS',
      subtitle: 'Hình ảnh / chuyển động / hệ thống',
      wordA: 'TẠO',
      wordB: 'RA',
      wordC: 'NHỊP.',
      chipA: 'HỆ THỐNG THƯƠNG HIỆU / ĐANG CHẠY',
      chipB: 'NHẬN DIỆN CHUYỂN ĐỘNG / 2027',
      chipC: 'TẦN SỐ / 60 FPS',
      caption: 'Thí nghiệm hình thái / O.01',
      ticker: 'TƯ DUY HỆ THỐNG • CHUYỂN ĐỘNG CÓ CHỦ ĐÍCH • HÌNH ẢNH TẠO NHỊP • TƯ DUY HỆ THỐNG • CHUYỂN ĐỘNG CÓ CHỦ ĐÍCH • HÌNH ẢNH TẠO NHỊP',
    },
    playground: {
      sectionLabel: 'Sân chơi',
      title1: 'CHƠI CÙNG',
      title2: 'Ý TƯỞNG.',
      desc: 'Một thử nghiệm trực tiếp về độ sâu, nhịp điệu và hành vi thị giác.',
      controlsTitle: 'Điều khiển chuyển động',
      flow: 'Nhịp',
      depth: 'Độ sâu',
      energy: 'Năng lượng',
      pause: 'Tạm dừng',
      play: 'Chạy chuyển động',
    },
    finalCta: {
      sectionLabel: 'Vòng lặp tiếp theo',
      line1: 'BẮT ĐẦU',
      line2: 'NG.',
      bottomText: 'Cùng xây dựng điều có ý nghĩa.',
      button: 'Bắt đầu dự án',
      buttonLink: 'https://www.loops.vn/bao-gia',
    },
    footer: {
      loop: 'LOOPS / MAKE IT CLEAR / MAKE IT MOVE / LOOPS / MAKE IT CLEAR / MAKE IT MOVE /',
      company: 'CÔNG TY LOOPS',
      subtitle: 'Công nghệ sáng tạo / Việt Nam + Toàn cầu',
      email: 'hello@loops.company',
    },
  },
  en: {
    nav: {
      brand: 'LOOPS',
      home: 'Home',
      works: 'Projects',
      services: 'Services',
      customDesign: 'Custom Website Design',
      rental: 'All-inclusive Website Rental',
      pricing: 'Pricing',
      about: 'About',
      startProject: 'Start a Project',
      startProjectLink: 'https://www.loops.vn/bao-gia',
    },
    hero: {
      line1: 'TURN',
      line2: 'COMPLEXITY',
      line3: 'INTO',
      line4: 'CLARITY.',
      support: 'Digital experiences, brand identity and connected systems for a bolder tomorrow.',
      exploreWorks: 'Explore Projects',
      scrollCue: 'Scroll to explore',
      skipIntro: 'Skip intro',
    },
    solve: {
      sectionLabel: 'What We Solve',
      word1: 'REAL',
      word2: 'PROBLEMS.',
      wordOutline: 'REAL',
      word4: 'RESULTS.',
      problems: [
        'SLOW WEBSITE',
        'POOR UX',
        'LACK OF IDENTITY',
        'MESSY SYSTEM',
        'DULL CONTENT',
      ],
      notePillars: '03 Service Pillars',
      noteSystem: '01 Connected System',
      pillars: [
        { title: 'BUILD', services: 'Landing Page / Business Website / E-commerce / Web App / Dashboard / UI/UX' },
        { title: 'GROW', services: 'SEO / Content / Analytics / Conversion Optimization / Email Marketing' },
        { title: 'OPERATE', services: 'Hosting / SSL / Maintenance / Backup / CRM Integration / ERP Integration / Marketing Automation / Technical Support' },
      ],
    },
    offers: {
      sectionLabel: 'Two Ways to Start',
      kicker: 'Website Rental / Custom Website',
      title1: 'START SMALL.',
      title2: 'SCALE WHEN READY.',
      progressStart: 'Start',
      progressScale: 'Scale',
      rentalLabel: 'Website Rental',
      rentalPrice: '189,000₫',
      rentalUnit: '/ month',
      rentalCta: 'Explore Website Rental',
      pricingLink: 'View Pricing',
      customLabel: 'Custom Website',
      customDesc: 'Custom-built web platforms and bespoke systems when your business scales.',
      customCta: 'Custom Website Design',
      caption: 'Rental → Scale → Custom',
    },
    works: {
      sectionLabel: 'SELECTED CONCEPTS',
      title1: 'SUSTAINABLE',
      title2: 'CONCEPTS.',
      desc: 'Experimental concepts and visual interface explorations by LOOPS.',
      counterNumber: '04',
      counterLabel: 'Concepts / Visual Explorations',
      exploreAria: 'Explore',
      concepts: [
        { title: 'F&B Brand Identity Exploration', type: 'Identity / Web / Content', image: '/assets/projects/project-01.jpg' },
        { title: 'Future Tech Platform', type: 'Product / Systems / UX', image: '/assets/projects/project-02.jpg' },
        { title: 'Lifestyle Content System', type: 'Operations / Content / UI', image: '/assets/projects/project-03.jpg' },
        { title: 'Creative Campaign Experiment', type: 'Launch / Motion / Branding', image: '/assets/projects/project-04.jpg' },
      ],
    },
    signals: {
      sectionLabel: 'LOOPS Signals',
      subtitle: 'Visuals / Motion / Systems',
      wordA: 'SET',
      wordB: 'THE',
      wordC: 'RHYTHM.',
      chipA: 'BRAND SYSTEM / LIVE',
      chipB: 'MOTION IDENTITY / 2027',
      chipC: 'FREQUENCY / 60 FPS',
      caption: 'Morphology Experiment / O.01',
      ticker: 'SYSTEM THINKING • PURPOSEFUL MOTION • RHYTHMIC VISUALS • SYSTEM THINKING • PURPOSEFUL MOTION • RHYTHMIC VISUALS',
    },
    playground: {
      sectionLabel: 'Playground',
      title1: 'PLAY WITH',
      title2: 'IDEAS.',
      desc: 'A live interactive experiment in depth, rhythm and visual behavior.',
      controlsTitle: 'Motion Controls',
      flow: 'Flow',
      depth: 'Depth',
      energy: 'Energy',
      pause: 'Pause',
      play: 'Play Motion',
    },
    finalCta: {
      sectionLabel: 'The Next Loop',
      line1: 'START THE',
      line2: 'LOOP.',
      bottomText: 'Let\'s build something meaningful together.',
      button: 'Start a Project',
      buttonLink: 'https://www.loops.vn/bao-gia',
    },
    footer: {
      loop: 'LOOPS / MAKE IT CLEAR / MAKE IT MOVE / LOOPS / MAKE IT CLEAR / MAKE IT MOVE /',
      company: 'LOOPS COMPANY',
      subtitle: 'Creative Technology / Vietnam + Global',
      email: 'hello@loops.company',
    },
  },
};

function mergeSiteContent(...contents) {
  const merged = {
    vi: defaultTranslations.vi,
    en: defaultTranslations.en,
    media: defaultMedia,
    mediaMeta: {},
  };

  contents.forEach((content) => {
    if (!content) return;
    merged.vi = { ...merged.vi, ...content.vi };
    merged.en = { ...merged.en, ...content.en };
    merged.media = { ...merged.media, ...content.media };
    merged.mediaMeta = { ...merged.mediaMeta, ...(content.mediaMeta || {}) };
  });

  return merged;
}

async function getDeployContentSeed() {
  if (typeof window === 'undefined') return null;

  try {
    const response = await fetch(DEPLOY_CONTENT_URL, { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) return null;
    const parsed = await response.json();
    return parsed && (parsed.vi || parsed.en || parsed.media) ? parsed : null;
  } catch {
    return null;
  }
}

export const STANDARD_MEDIA_MAP = {
  heroVideo: { standardPath: '/assets/hero-loops.mp4', standardName: 'hero-loops.mp4', type: 'video' },
  heroPoster: { standardPath: '/assets/projects/project-01.jpg', standardName: 'hero-poster.jpg', type: 'image' },
  offersVideo: { standardPath: '/assets/video-price-2.mp4', standardName: 'video-price-2.mp4', type: 'video' },
  liquidSurface: { standardPath: '/assets/liquid-surface.jpg', standardName: 'liquid-surface.jpg', type: 'image' },
  liquidLoop: { standardPath: '/assets/liquid-loop.mp4', standardName: 'liquid-loop.mp4', type: 'media' },
  liquidO: { standardPath: '/assets/liquid-o.png', standardName: 'liquid-o.png', type: 'media' },
  project01: { standardPath: '/assets/projects/project-01.jpg', standardName: 'project-01.jpg', type: 'image' },
  project02: { standardPath: '/assets/projects/project-02.jpg', standardName: 'project-02.jpg', type: 'image' },
  project03: { standardPath: '/assets/projects/project-03.jpg', standardName: 'project-03.jpg', type: 'image' },
  project04: { standardPath: '/assets/projects/project-04.jpg', standardName: 'project-04.jpg', type: 'image' },
  project05: { standardPath: '/assets/projects/project-05.jpg', standardName: 'project-05.jpg', type: 'image' },
  project06: { standardPath: '/assets/projects/project-06.jpg', standardName: 'project-06.jpg', type: 'image' },
  project07: { standardPath: '/assets/projects/project-07.jpg', standardName: 'project-07.jpg', type: 'image' },
  project08: { standardPath: '/assets/projects/project-08.jpg', standardName: 'project-08.jpg', type: 'image' },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('loops_lang');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch {
      // ignore
    }
    return 'vi';
  });

  const [siteContent, setSiteContent] = useState(() => ({
    vi: defaultTranslations.vi,
    en: defaultTranslations.en,
    media: defaultMedia,
    mediaMeta: {},
  }));

  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load deploy seed first, then local browser edits if they exist.
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const deploySeed = await getDeployContentSeed();
        const savedData = await getFromDB(DB_CONTENT_KEY);
        if ((deploySeed || savedData) && isMounted) {
          setSiteContent(mergeSiteContent(deploySeed, savedData));
          setLastSaved(new Date().toLocaleTimeString('vi-VN'));
        }
      } catch (err) {
        console.warn('Error loading CMS content:', err);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to IndexedDB persistently
  const saveContentToStorage = useCallback(async (newContent) => {
    setSiteContent(newContent);
    setIsSaving(true);
    try {
      await saveToDB(DB_CONTENT_KEY, newContent);
      const timeStr = new Date().toLocaleTimeString('vi-VN');
      setLastSaved(timeStr);
    } catch (err) {
      console.error('Failed to save to IndexedDB:', err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'vi' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem('loops_lang', lang);
      } catch {
        // ignore
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  // Helper to resolve any media URL or dataUrl
  const resolveMedia = useCallback((src, fallback = '') => {
    if (!src) return fallback;
    const mediaObj = siteContent.media || {};
    // Check if directly in media object
    if (mediaObj[src]) return mediaObj[src];
    // Check if key exists in standard map
    for (const [key, item] of Object.entries(STANDARD_MEDIA_MAP)) {
      if (item.standardPath === src && mediaObj[key]) {
        return mediaObj[key];
      }
    }
    return src || fallback;
  }, [siteContent.media]);

  // Standardized media upload
  const uploadStandardMedia = useCallback((standardKey, standardPath, dataUrl, metaInfo = {}) => {
    const updatedMedia = {
      ...siteContent.media,
      [standardKey]: standardPath,
      [standardPath]: dataUrl,
    };

    const updatedMeta = {
      ...siteContent.mediaMeta,
      [standardKey]: { ...metaInfo, standardPath },
      [standardPath]: { ...metaInfo, standardPath },
    };

    const updated = {
      ...siteContent,
      media: updatedMedia,
      mediaMeta: updatedMeta,
    };
    saveContentToStorage(updated);
  }, [siteContent, saveContentToStorage]);

  // Concept media upload (e.g. concept-01.jpg)
  const uploadConceptMedia = useCallback((conceptIndex, dataUrl, metaInfo = {}) => {
    const num = String(conceptIndex + 1).padStart(2, '0');
    const mediaType = isVideoType(metaInfo.type) ? 'video' : 'image';
    const standardName = `project-${num}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
    const standardPath = `/assets/projects/${standardName}`;
    const standardKey = `project${num}`;

    const updatedMedia = {
      ...siteContent.media,
      [standardKey]: standardPath,
      [standardPath]: dataUrl,
    };

    const updatedMeta = {
      ...siteContent.mediaMeta,
      [standardPath]: { ...metaInfo, standardName, standardPath },
      [standardKey]: { ...metaInfo, standardName, standardPath },
    };

    // Update in both vi and en concepts arrays
    const updateConceptsInLang = (lang) => {
      const concepts = siteContent[lang]?.works?.concepts || [];
      return concepts.map((item, idx) => {
        if (idx === conceptIndex) {
          return { ...item, image: standardPath, mediaType };
        }
        return item;
      });
    };

    const updated = {
      ...siteContent,
      media: updatedMedia,
      mediaMeta: updatedMeta,
      vi: {
        ...siteContent.vi,
        works: {
          ...siteContent.vi.works,
          concepts: updateConceptsInLang('vi'),
        },
      },
      en: {
        ...siteContent.en,
        works: {
          ...siteContent.en.works,
          concepts: updateConceptsInLang('en'),
        },
      },
    };

    saveContentToStorage(updated);
  }, [siteContent, saveContentToStorage]);

  // Reset a standard media item back to default
  const resetStandardMedia = useCallback((standardKey, standardPath) => {
    const updatedMedia = { ...siteContent.media };
    delete updatedMedia[standardKey];
    delete updatedMedia[standardPath];
    if (defaultMedia[standardKey]) {
      updatedMedia[standardKey] = defaultMedia[standardKey];
    }

    const updatedMeta = { ...siteContent.mediaMeta };
    delete updatedMeta[standardKey];
    delete updatedMeta[standardPath];

    const updated = {
      ...siteContent,
      media: updatedMedia,
      mediaMeta: updatedMeta,
    };
    saveContentToStorage(updated);
  }, [siteContent, saveContentToStorage]);

  // Reset a concept media item back to default
  const resetConceptMedia = useCallback((conceptIndex) => {
    const num = String(conceptIndex + 1).padStart(2, '0');
    const standardName = `project-${num}.jpg`;
    const standardPath = `/assets/projects/${standardName}`;
    const videoPath = `/assets/projects/project-${num}.mp4`;
    const standardKey = `project${num}`;

    const updatedMedia = { ...siteContent.media };
    delete updatedMedia[standardKey];
    delete updatedMedia[standardPath];
    delete updatedMedia[videoPath];
    if (defaultMedia[standardKey]) {
      updatedMedia[standardKey] = defaultMedia[standardKey];
    }

    const updatedMeta = { ...siteContent.mediaMeta };
    delete updatedMeta[standardKey];
    delete updatedMeta[standardPath];
    delete updatedMeta[videoPath];

    const updateConceptsInLang = (lang) => {
      const concepts = siteContent[lang]?.works?.concepts || [];
      return concepts.map((item, idx) => {
        if (idx === conceptIndex) {
          return { ...item, image: standardPath, mediaType: 'image' };
        }
        return item;
      });
    };

    const updated = {
      ...siteContent,
      media: updatedMedia,
      mediaMeta: updatedMeta,
      vi: {
        ...siteContent.vi,
        works: {
          ...siteContent.vi.works,
          concepts: updateConceptsInLang('vi'),
        },
      },
      en: {
        ...siteContent.en,
        works: {
          ...siteContent.en.works,
          concepts: updateConceptsInLang('en'),
        },
      },
    };
    saveContentToStorage(updated);
  }, [siteContent, saveContentToStorage]);

  // CMS update helper for simple fields: updateField('vi', 'hero', 'line1', 'MỚI')
  const updateContentField = (lang, section, field, value) => {
    const updated = {
      ...siteContent,
      [lang]: {
        ...siteContent[lang],
        [section]: {
          ...siteContent[lang][section],
          [field]: value,
        },
      },
    };
    saveContentToStorage(updated);
  };

  // CMS update helper for media URLs / base64
  const updateMediaField = (mediaKey, value) => {
    const standardPath = STANDARD_MEDIA_MAP[mediaKey]?.standardPath;
    const nextMedia = {
      ...siteContent.media,
      [mediaKey]: value,
    };

    if (standardPath) {
      if (value) {
        nextMedia[standardPath] = value;
      } else {
        delete nextMedia[standardPath];
      }
    }

    const nextMeta = { ...siteContent.mediaMeta };
    delete nextMeta[mediaKey];
    if (standardPath) delete nextMeta[standardPath];

    const updated = {
      ...siteContent,
      media: nextMedia,
      mediaMeta: nextMeta,
    };
    saveContentToStorage(updated);
  };

  // CMS update helper for lists
  const updateListItem = (lang, section, listKey, index, valueOrItem) => {
    const currentList = siteContent[lang][section][listKey] || [];
    const newList = [...currentList];
    newList[index] = valueOrItem;

    const updated = {
      ...siteContent,
      [lang]: {
        ...siteContent[lang],
        [section]: {
          ...siteContent[lang][section],
          [listKey]: newList,
        },
      },
    };
    saveContentToStorage(updated);
  };

  const addListItem = (lang, section, listKey, newItem) => {
    const currentList = siteContent[lang][section][listKey] || [];
    const newList = [...currentList, newItem];

    const updated = {
      ...siteContent,
      [lang]: {
        ...siteContent[lang],
        [section]: {
          ...siteContent[lang][section],
          [listKey]: newList,
        },
      },
    };
    saveContentToStorage(updated);
  };

  const deleteListItem = (lang, section, listKey, index) => {
    const currentList = siteContent[lang][section][listKey] || [];
    const newList = currentList.filter((_, i) => i !== index);

    const updated = {
      ...siteContent,
      [lang]: {
        ...siteContent[lang],
        [section]: {
          ...siteContent[lang][section],
          [listKey]: newList,
        },
      },
    };
    saveContentToStorage(updated);
  };

  // Explicitly trigger save for current content
  const saveAllChanges = async () => {
    setIsSaving(true);
    try {
      await saveToDB(DB_CONTENT_KEY, siteContent);
      const timeStr = new Date().toLocaleTimeString('vi-VN');
      setLastSaved(timeStr);
      return { success: true, time: timeStr };
    } catch (err) {
      console.error('Manual save error:', err);
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  // Reset all overrides back to default
  const resetContentToDefaults = async () => {
    const fresh = {
      vi: defaultTranslations.vi,
      en: defaultTranslations.en,
      media: defaultMedia,
      mediaMeta: {},
    };
    await clearDB();
    setSiteContent(fresh);
    const timeStr = new Date().toLocaleTimeString('vi-VN');
    setLastSaved(timeStr);
  };

  // Export JSON string
  const exportContentJson = () => {
    return JSON.stringify(siteContent, null, 2);
  };

  // Import JSON string
  const importContentJson = async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && (parsed.vi || parsed.en || parsed.media)) {
        const merged = mergeSiteContent(parsed);
        await saveContentToStorage(merged);
        return { success: true };
      }
      return { success: false, error: 'Dữ liệu JSON không hợp lệ' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const currentTranslations = siteContent[language] || siteContent.vi;
  const currentMedia = siteContent.media || defaultMedia;
  const currentMediaMeta = siteContent.mediaMeta || {};

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: currentTranslations,
        media: currentMedia,
        mediaMeta: currentMediaMeta,
        resolveMedia,
        uploadStandardMedia,
        uploadConceptMedia,
        resetStandardMedia,
        resetConceptMedia,
        allContent: siteContent,
        isLoaded,
        isSaving,
        lastSaved,
        saveAllChanges,
        updateContentField,
        updateMediaField,
        updateListItem,
        addListItem,
        deleteListItem,
        resetContentToDefaults,
        exportContentJson,
        importContentJson,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
