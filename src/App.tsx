// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import './App.css';
import ResumePage from './ResumePage';

// ✅ 채용 모집 기간 설정 — 관리자가 true/false 로 변경
const IS_RECRUITING = false;

// web3forms.com 에서 jylee@clict.co.kr 로 발급받은 Access Key
const WEB3FORMS_KEY = '03939c95-62bb-4936-b8b7-a95566a6a0f2';

const SEARCH_INDEX = [
  { label: '홈', hash: '#home', keywords: ['홈', '메인', '처음', 'home'] },
  { label: '회사소개', hash: '#about', keywords: ['회사소개', '회사', 'about', '씨엘아이티', 'clit'] },
  { label: 'CEO Message', hash: '#ceo', keywords: ['ceo', '대표', '인사말', 'message', '최혁원'] },
  { label: '연혁', hash: '#history', keywords: ['연혁', '역사', '설립', 'history'] },
  { label: '오시는 길', hash: '#location', keywords: ['오시는길', '오시는 길', '위치', '지도', '주소', '찾아오는'] },
  { label: '비지니스', hash: '#business', keywords: ['비지니스', '사업', 'business'] },
  { label: '네트워크 통합 (NI)', hash: '#business-ni', keywords: ['네트워크통합', '네트워크 통합', 'ni', '네트워크'] },
  { label: '통합보안 구축', hash: '#business-security', keywords: ['보안', '통합보안', '방화벽', 'security', 'vpn'] },
  { label: '통합 유지보수', hash: '#business-maintenance', keywords: ['유지보수', '유지', '보수', 'maintenance', '장애'] },
  { label: '인프라 서비스', hash: '#business-infra', keywords: ['인프라', '서버', '스토리지', '클라우드', 'infra'] },
  { label: 'UC (IPT/VoIP)', hash: '#business-uc', keywords: ['uc', 'ipt', 'voip', '전화', '인터넷전화', 'pbx'] },
  { label: 'Technical Consulting', hash: '#business-consulting', keywords: ['컨설팅', 'consulting', '기술컨설팅'] },
  { label: 'IoT', hash: '#business-iot', keywords: ['iot', '사물인터넷', '센서'] },
  { label: 'Smart City', hash: '#business-smartcity', keywords: ['스마트시티', 'smartcity', '통합관제', 'cctv', '관제'] },
  { label: '제품소개', hash: '#products', keywords: ['제품소개', '제품', 'product'] },
  { label: '네트워크 장비', hash: '#products-network', keywords: ['네트워크장비', '스위치', 'cisco', 'juniper', 'aruba', 'hp'] },
  { label: '무선 AP', hash: '#products-wireless', keywords: ['무선', 'ap', 'wifi', 'wi-fi', '액세스포인트', 'access point', '무선ap'] },
  { label: '보안 솔루션', hash: '#products-security', keywords: ['보안솔루션', 'axgate', 'ssl', '방화벽'] },
  { label: '서버 · 스토리지', hash: '#products-server', keywords: ['서버', '스토리지', 'server', 'storage'] },
  { label: '솔루션 (NMS)', hash: '#products-solution', keywords: ['솔루션', 'nms', '모니터링', 'solution'] },
  { label: '파트너사', hash: '#partners-1', keywords: ['파트너', 'partner', '협력'] },
  { label: '고객사', hash: '#partners-2', keywords: ['고객사', '고객', 'client'] },
  { label: '채용정보', hash: '#recruitment', keywords: ['채용', '취업', '입사', '채용정보', 'recruit', '지원'] },
  { label: '채용공고', hash: '#recruitment-jobs', keywords: ['채용공고', '공고', '구인', '네트워크엔지니어'] },
  { label: '고객문의', hash: '#contact', keywords: ['문의', '연락', 'contact', '상담', '견적'] },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_INDEX.filter(item =>
        item.keywords.some(kw => kw.includes(searchQuery.toLowerCase())) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (hash: string) => {
    window.location.hash = hash;
    setSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 초기 로드 시 실행

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // currentPath가 바뀐 후 React 리렌더링이 완료되면 스크롤
  useEffect(() => {
    const elementId = currentPath.replace('#', '');
    const topLevelRoutes = ['home', 'about', 'ceo', 'history', 'location', 'business', 'products', 'partners', 'recruitment', 'contact', 'apply'];
    if (!elementId || topLevelRoutes.includes(elementId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // 리렌더링 후 DOM에 요소가 생길 때까지 대기
    const tryScroll = (attempts = 0) => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 90;
        const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (attempts < 10) {
        setTimeout(() => tryScroll(attempts + 1), 50);
      }
    };
    setTimeout(() => tryScroll(), 50);
  }, [currentPath]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setPrivacyConsent(false);
  };

  const [isSending, setIsSending] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setIsSending(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[씨엘아이티 문의] ${fd.get('inquiry_type')} - ${fd.get('company')}`,
          from_name: fd.get('from_name'),
          phone: fd.get('phone'),
          company: fd.get('company'),
          inquiry_type: fd.get('inquiry_type'),
          message: fd.get('message'),
        }),
      });
      if (!res.ok) throw new Error();
      alert('문의가 성공적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.');
      form.reset();
      toggleModal();
    } catch {
      alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  // 메인 페이지 컴포넌트
  const MainContent = () => (
    <>
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>연결의 가치를 더하는<br />네트워크 파트너 씨엘아이티(주)</h1>
            <p>2014년 설립 이래 최상의 기술력으로 고객의 비즈니스 인프라를 위한 최적의 엔드 투 엔드 솔루션을 제공합니다.</p>
            <button onClick={toggleModal} className="cta-button">상담 신청하기</button>
          </div>
        </div>
      </section>

      <section id="about" className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2>ABOUT CLIT</h2>
            <div className="bar"></div>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <h3>최고의 기술력으로<br />네트워크의 미래를 설계합니다.</h3>
              <p>
                씨엘아이티(주)는 다년간의 풍부한 경험과 전문 기술력을 바탕으로 기업의 IT 환경에 최적화된 네트워크 인프라를 제공합니다. 
                신속한 장애 대응과 체계적인 관리 시스템을 통해 고객사의 비즈니스 연속성을 보장합니다.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <h4>10+</h4>
                  <p>경력 (년)</p>
                </div>
                <div className="stat-item">
                  <h4>500+</h4>
                  <p>완료 프로젝트</p>
                </div>
                <div className="stat-item">
                  <h4>24/7</h4>
                  <p>기술 지원</p>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="씨엘아이티 신뢰를 상징하는 현대적 건물"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section id="about-achievements" className="about-achievements-section">
        <div className="container">
          <div className="achievements-top">
            <div className="achievements-top-left">
              <span className="achievements-eyebrow">RECENT ACHIEVEMENTS</span>
              <h2 className="achievements-title">주요 실적</h2>
            </div>
            <p className="achievements-desc">2023년부터 2025년까지 씨엘아이티㈜가 수행한 주요 프로젝트입니다.</p>
          </div>
          <div className="achievements-grid">
            {[
              { year: '2023', items: ['실적 내용을 입력해주세요'] },
              { year: '2024', items: ['실적 내용을 입력해주세요'] },
              { year: '2025', items: ['실적 내용을 입력해주세요'] },
            ].map(({ year, items }) => (
              <div className="achievement-year-card" key={year}>
                <div className="achievement-year-label">{year}</div>
                <ul className="achievement-list">
                  {items.map((item, i) => (
                    <li className={`achievement-item${item === '실적 내용을 입력해주세요' ? ' achievement-placeholder' : ''}`} key={i}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section">
        <div className="container">
          <div className="section-title">
            <h2>OUR SERVICES</h2>
            <div className="bar"></div>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏗️</div>
              <h3>네트워크 설계</h3>
              <p>최적의 트래픽 분석과 확장성을 고려한 하이엔드 아키텍처 설계를 제공합니다.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚙️</div>
              <h3>네트워크 구축</h3>
              <p>풍부한 실무 경험을 보유한 엔지니어가 안정적이고 신속한 시스템 구축을 수행합니다.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>장비 납품</h3>
              <p>Cisco, Juniper, HP 등 글로벌 브랜드의 정품 장비를 합리적인 가격에 공급합니다.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🛠️</div>
              <h3>유지보수</h3>
              <p>정기 점검 및 모니터링을 통해 장애를 미연에 방지하고 신속하게 대응합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact">
        <div className="container">
          <div className="section-title">
            <h2>CONTACT US</h2>
            <div className="bar"></div>
          </div>
          <div className="contact-info">
            <p>네트워크 전문가 씨엘아이티(주)가 귀사의 최적화된 비즈니스 인프라를 지원합니다.<br />언제든 편하게 문의해 주세요.</p>
            <div style={{fontSize: '24px', fontWeight: 'bold', margin: '20px 0'}}>
              📞 051-501-3735 | 3734
            </div>
            <p>📧 jylee@clict.co.kr</p>
            <button onClick={toggleModal} className="cta-button" style={{marginTop: '20px', border: 'none'}}>견적 문의하기</button>
          </div>
        </div>
      </section>
    </>
  );

  // 제품소개 페이지 컴포넌트
  const ProductsPage = () => (
    <div className="products-page container">
      <div className="section-title">
        <h2>제품소개</h2>
        <div className="bar"></div>
      </div>

      <div id="products-network" className="product-section">
        <h3>네트워크 장비 (NETWORK)</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#00bceb' }}>CISCO</div>
            <h4>Cisco Catalyst Switches</h4>
            <p>업계 최고의 성능과 안정성을 자랑하는 엔터프라이즈급 스위치 솔루션입니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 고성능 백본/액세스 레이어 지원</div>
              <div className="spec-item">• 지능형 네트워크 자동화 기능</div>
            </div>
          </div>
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#563e91' }}>JUNIPER</div>
            <h4>Juniper EX Series</h4>
            <p>클라우드 환경에 최적화된 고성능 인프라를 위한 캐리어급 스위치입니다.</p>
            <div className="product-specs">
              <div className="spec-item">• Mist AI 기반 지능형 운영</div>
              <div className="spec-item">• 강력한 보안 및 가용성 보장</div>
            </div>
          </div>
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#01a982' }}>HP (Aruba)</div>
            <h4>Aruba CX Switches</h4>
            <p>모바일 및 클라우드 시대의 엣지 네트워크를 위한 최상의 가시성을 제공합니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 클라우드 기반 관리 용이성</div>
              <div className="spec-item">• 유연한 확장성 및 저전력 설계</div>
            </div>
          </div>
        </div>
      </div>

      <div id="products-wireless" className="product-section">
        <h3>무선 AP (WIRELESS)</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#00bceb' }}>CISCO</div>
            <h4>Cisco Catalyst Access Point</h4>
            <p>Wi-Fi 6/6E를 지원하는 차세대 엔터프라이즈 무선 액세스 포인트입니다.</p>
            <div className="product-specs">
              <div className="spec-item">• Wi-Fi 6E (802.11ax) 지원</div>
              <div className="spec-item">• Cisco DNA Center 통합 관리</div>
            </div>
          </div>
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#01a982' }}>HP (Aruba)</div>
            <h4>Aruba Access Point</h4>
            <p>고밀도 환경에 최적화된 Wi-Fi 6E 무선 AP로 안정적인 무선 커버리지를 제공합니다.</p>
            <div className="product-specs">
              <div className="spec-item">• Aruba Central 클라우드 관리</div>
              <div className="spec-item">• AI 기반 자동 RF 최적화</div>
            </div>
          </div>
        </div>
      </div>

      <div id="products-security" className="product-section">
        <h3>보안 솔루션 (SECURITY)</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#0054a6' }}>AXGATE</div>
            <h4>AXGATE 차세대 방화벽</h4>
            <p>강력한 가상화 기능과 고성능 하드웨어를 바탕으로 국내 최고의 보안 환경을 제공합니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 통합 보안 관리 (UTM) 지원</div>
              <div className="spec-item">• 고도화된 위협 탐지 및 차단</div>
            </div>
          </div>
          <div className="product-card">
            <div className="vendor-logo">SECURITY</div>
            <h4>SSL VPN 솔루션</h4>
            <p>재택근무 및 원격 접속 환경에서 안전한 내부 데이터 접근을 보장합니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 다중 인증 (MFA) 연동</div>
              <div className="spec-item">• 강력한 데이터 암호화 통신</div>
            </div>
          </div>
        </div>
      </div>

      <div id="products-server" className="product-section">
        <h3>서버 및 스토리지 (SERVER & STORAGE)</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="vendor-logo">SERVER</div>
            <h4>Enterprise Servers</h4>
            <p>안정적인 비즈니스 운영을 위한 고성능 서버 인프라 도입을 지원합니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 가상화 및 클라우드 최적화</div>
              <div className="spec-item">• 유연한 하드웨어 확장 구조</div>
            </div>
          </div>
          <div className="product-card">
            <div className="vendor-logo">STORAGE</div>
            <h4>Hybrid Storage</h4>
            <p>대용량 데이터의 안정적인 저장과 빠른 액세스를 보장하는 스토리지 솔루션입니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 높은 데이터 가용성</div>
              <div className="spec-item">• 실시간 백업 및 복구 지원</div>
            </div>
          </div>
        </div>
      </div>

      <div id="products-solution" className="product-section">
        <h3>솔루션 (SOLUTION)</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#007bff' }}>CLIT MONITORING</div>
            <h4>통합 NMS 솔루션</h4>
            <p>씨엘아이티만의 전문 노하우가 담긴 네트워크 모니터링 관리 시스템입니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 트래픽 현황 시각화</div>
              <div className="spec-item">• 이상 징후 자동 알림 서비스</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BusinessPage = () => (
    <div className="business-page container">
      <div className="section-title">
        <h2>BUSINESS 영역</h2>
        <div className="bar"></div>
      </div>
      <div className="business-intro">
        <p>씨엘아이티(주)는 고도의 기술력과 풍부한 인프라 구축 경험을 통해<br />고객사의 비즈니스 혁신을 지원하는 전문 IT 파트너입니다.</p>
      </div>
      <div className="business-list">
        <div id="business-ni" className="business-item">
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)' }}></div>
          <div className="business-info">
            <span className="tag">NETWORK</span>
            <h3>네트워크 통합 (NI)</h3>
            <p>기업 환경에 최적화된 유무선 네트워크 인프라 설계 및 구축을 담당합니다. 트래픽 분석과 확장성을 고려한 하이엔드 아키텍처를 제공합니다.</p>
            <div className="feature-list">
              <div className="feature-item">백본 스위치 구축</div>
              <div className="feature-item">무선 LAN 솔루션</div>
              <div className="feature-item">트래픽 가속 및 최적화</div>
              <div className="feature-item">네트워크 진단 및 설계</div>
            </div>
          </div>
        </div>
        <div id="business-security" className="business-item">
          <div className="business-info" style={{ order: 2 }}>
            <span className="tag">SECURITY</span>
            <h3>통합보안 구축</h3>
            <p>외부 위협으로부터 고객사의 핵심 정보를 보호합니다. 강력한 방화벽부터 내부 보안 관리 시스템까지 최상의 보안 솔루션을 제공합니다.</p>
            <div className="feature-list">
              <div className="feature-item">차세대 방화벽 (UTM)</div>
              <div className="feature-item">VPN / 보안관제</div>
              <div className="feature-item">DB / 문서 보안</div>
              <div className="feature-item">IPS / DDoS 방어</div>
            </div>
          </div>
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)', order: 1 }}></div>
        </div>
        <div id="business-maintenance" className="business-item">
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)' }}></div>
          <div className="business-info">
            <span className="tag">MAINTENANCE</span>
            <h3>통합 유지보수</h3>
            <p>중단 없는 비즈니스 운영을 보장합니다. 정기 점검과 신속한 장애 대응 프로세스를 통해 안정적인 IT 환경을 유지합니다.</p>
            <div className="feature-list">
              <div className="feature-item">모니터링</div>
              <div className="feature-item">장애 긴급 복구 지원</div>
              <div className="feature-item">시스템 정기 기술 점검</div>
              <div className="feature-item">성능 분석 및 개선 컨설팅</div>
            </div>
          </div>
        </div>
        <div id="business-infra" className="business-item">
          <div className="business-info" style={{ order: 2 }}>
            <span className="tag">INFRA SERVICE</span>
            <h3>인프라 서비스</h3>
            <p>서버, 스토리지 및 클라우드 인프라의 설계와 도입을 지원합니다. 글로벌 벤더사들과의 파트너십을 통해 검증된 장비를 최적으로 공급합니다.</p>
            <div className="feature-list">
              <div className="feature-item">서버/스토리지 공급</div>
              <div className="feature-item">클라우드 마이그레이션</div>
              <div className="feature-item">워크스테이션 구축</div>
              <div className="feature-item">가상화 솔루션</div>
            </div>
          </div>
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)', order: 1 }}></div>
        </div>

        <div id="business-uc" className="business-item">
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)' }}></div>
          <div className="business-info">
            <span className="tag">UC</span>
            <h3>UC (IPT/VoIP)</h3>
            <p>기존 PSTN 대비 업무 효율성과 경비 절감, 네트워크 효율적 운영이 강점인 인터넷 전화 시스템을 납품·구축합니다. 기업 통신 환경의 디지털 전환을 선도합니다.</p>
            <div className="feature-list">
              <div className="feature-item">IPT / VoIP 시스템 구축</div>
              <div className="feature-item">기존 PSTN 대체 솔루션</div>
              <div className="feature-item">PBX 교환기 납품·설치</div>
              <div className="feature-item">통신 비용 절감 컨설팅</div>
            </div>
          </div>
        </div>

        <div id="business-consulting" className="business-item">
          <div className="business-info" style={{ order: 2 }}>
            <span className="tag">CONSULTING</span>
            <h3>Technical Consulting</h3>
            <p>기업별 업무 환경·방식·서비스에 맞춘 맞춤형 IT 컨설팅을 제공합니다. 효율성·보안성·안정성을 최우선으로 고객과의 끊임없는 소통을 통해 최적의 솔루션을 설계합니다.</p>
            <div className="feature-list">
              <div className="feature-item">기업 맞춤 IT 환경 분석</div>
              <div className="feature-item">최적 네트워크 설계</div>
              <div className="feature-item">보안 취약점 진단</div>
              <div className="feature-item">Pre-Sales 기술 지원</div>
            </div>
          </div>
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)', order: 1 }}></div>
        </div>

        <div id="business-iot" className="business-item">
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)' }}></div>
          <div className="business-info">
            <span className="tag">IoT</span>
            <h3>IoT 솔루션</h3>
            <p>기업의 요구에 가장 부합하는 IoT 서비스를 제공합니다. 온습도 모니터링, 환경 센서, 자산 추적 등 현장 맞춤형 IoT 인프라를 설계·구축합니다.</p>
            <div className="feature-list">
              <div className="feature-item">온습도 모니터링 시스템</div>
              <div className="feature-item">IoT 센서 네트워크 구축</div>
              <div className="feature-item">실시간 데이터 수집·분석</div>
              <div className="feature-item">부산시 IoT 실증단지 협력</div>
            </div>
          </div>
        </div>

        <div id="business-smartcity" className="business-item">
          <div className="business-info" style={{ order: 2 }}>
            <span className="tag">SMART CITY</span>
            <h3>Smart City / 통합관제</h3>
            <p>데이터 수집 센서와 서버 간 안정적인 실시간 통신망을 제공합니다. CCTV 통합관제센터 구축과 BIS 네트워크 등 스마트시티 핵심 인프라를 담당합니다.</p>
            <div className="feature-list">
              <div className="feature-item">CCTV 통합관제센터 구축</div>
              <div className="feature-item">BIS 버스정보시스템 네트워크</div>
              <div className="feature-item">실시간 통신망 설계</div>
              <div className="feature-item">스마트시티 솔루션 개발·공급</div>
            </div>
          </div>
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)', order: 1 }}></div>
        </div>

      </div>
    </div>
  );

  const RecruitmentPage = () => {
    const [activeJob, setActiveJob] = useState<number | null>(null);

    const jobs = [
      {
        id: 1,
        title: '네트워크 엔지니어',
        type: '신입 / 경력',
        tag: 'NETWORK',
        tagColor: '#007BFF',
        deadline: '채용 시 마감',
        location: '부산',
        headcount: '기술지원 0명',
        tasks: ['기업 네트워크 인프라 설계 및 구축', 'LAN/WAN 환경 구성 및 최적화', '네트워크 장애 분석 및 긴급 복구', '고객사 기술지원 및 현장 엔지니어링'],
        requirements: ['Cisco / Juniper / Aruba 장비 운용 경험', 'CCNA 이상 자격증 우대', '네트워크 관련 학과 졸업 또는 유사 경력', '성실하고 팀워크를 중시하는 분'],
      },
    ];

    const benefits = [
      { icon: '🏥', title: '4대 보험', desc: '국민·건강·고용·산재보험 전액 지원' },
      { icon: '📚', title: '기술 교육 지원', desc: '사내외 세미나·컨퍼런스 참가 및 기술 교육 프로그램 지원' },
      { icon: '🎁', title: '명절 선물', desc: '설·추석 명절 선물 및 귀향비 지급' },
      { icon: '🏖️', title: '연차·휴가', desc: '법정 연차 외 창립기념일 전사 휴무' },
      { icon: '🍱', title: '중식 제공', desc: '평일 점심 식비 지원' },
      { icon: '📈', title: '성과 인센티브', desc: '반기별 실적 평가 기반 성과급 지급' },
    ];

    const steps = ['서류 접수', '1차 면접', '최종 합격', '입사'];

    return (
      <div className="recruit-page">
        {/* Hero */}
        <div className="recruit-hero">
          <div className="container">
            <span className="recruit-hero-tag">CAREER</span>
            <h1>함께 성장할 인재를<br />찾습니다</h1>
            <p>씨엘아이티(주)는 네트워크 전문가와 함께 대한민국 IT 인프라의 미래를 만들어 갑니다.</p>
          </div>
        </div>

        <div className="container recruit-body">

          {/* 인재상 */}
          <div id="recruitment-talent" className="recruit-section">
            <div className="section-title">
              <h2>인재상</h2>
              <div className="bar"></div>
            </div>
            <div className="talent-grid">
              {[
                { icon: '🔧', title: '전문성', desc: '끊임없이 학습하고 기술 역량을 키우는 전문가' },
                { icon: '🤝', title: '협업', desc: '팀과 함께 시너지를 만드는 소통하는 인재' },
                { icon: '💡', title: '도전정신', desc: '새로운 환경에 유연하게 적응하고 도전하는 인재' },
                { icon: '🎯', title: '책임감', desc: '맡은 업무에 끝까지 책임을 다하는 신뢰받는 인재' },
              ].map((t, i) => (
                <div key={i} className="talent-card">
                  <div className="talent-icon">{t.icon}</div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 복리후생 */}
          <div id="recruitment-benefits" className="recruit-section recruit-benefits-wrap">
            <div className="section-title">
              <h2>복리후생</h2>
              <div className="bar"></div>
            </div>
            <div className="benefits-grid">
              {benefits.map((b, i) => (
                <div key={i} className="benefit-card">
                  <span className="benefit-icon">{b.icon}</span>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 채용 프로세스 */}
          <div className="recruit-section">
            <div className="section-title">
              <h2>채용 프로세스</h2>
              <div className="bar"></div>
            </div>
            <div className="process-steps">
              {steps.map((step, i) => (
                <div key={i} className="process-step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-label">{step}</div>
                  {i < steps.length - 1 && <div className="step-arrow">›</div>}
                </div>
              ))}
            </div>
          </div>

          {/* 채용공고 */}
          <div id="recruitment-jobs" className="recruit-section">
            <div className="section-title">
              <h2>채용공고</h2>
              <div className="bar"></div>
            </div>
            <div className="job-list">
              {jobs.map((job) => (
                <div key={job.id} className={`job-card ${activeJob === job.id ? 'open' : ''}`}>
                  <div className="job-header" onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}>
                    <div className="job-header-left">
                      <span className="job-tag" style={{ backgroundColor: job.tagColor + '18', color: job.tagColor }}>{job.tag}</span>
                      <div>
                        <h3>{job.title}</h3>
                        <span className="job-type">{job.type}</span>
                      </div>
                    </div>
                    <div className="job-header-right">
                      <span className="job-meta">📍 {job.location}</span>
                      <span className="job-meta">👥 {job.headcount}</span>
                      <span className="job-deadline">{job.deadline}</span>
                      <span className="job-toggle">{activeJob === job.id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {activeJob === job.id && (
                    <div className="job-detail">
                      <div className="job-detail-cols">
                        <div>
                          <h4>주요 업무</h4>
                          <ul>{job.tasks.map((t, i) => <li key={i}>{t}</li>)}</ul>
                        </div>
                        <div>
                          <h4>자격 요건</h4>
                          <ul>{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                        </div>
                      </div>
                      <a href="#apply" className="apply-btn" onClick={e => { if (!IS_RECRUITING) { e.preventDefault(); alert('현재 모집 기간이 아닙니다.\n채용 공고가 오픈되면 다시 안내드리겠습니다.'); } }}>지원하기 →</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="recruit-notice">
              <p>* 이력서는 <strong>hwchoi@next-ict.co.kr</strong> 로 보내주세요. (양식 무관)</p>
              <p>* 채용 관련 문의: <strong>051-501-3735</strong></p>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const PartnersPage = () => (
    <div className="partners-page">
      {/* Hero */}
      <div className="partners-hero">
        <div className="container">
          <span className="partners-hero-tag">PARTNERS & CLIENTS</span>
          <h1>신뢰로 함께하는<br />파트너 · 고객사</h1>
          <p>씨엘아이티(주)는 글로벌 기술 파트너와 함께 고객사에 최적의 IT 인프라를 제공합니다.</p>
        </div>
      </div>

      <div className="container partners-body">

        {/* 파트너 */}
        <div id="partners-1" className="partners-section">
          <div className="partners-section-header">
            <div className="partners-section-label">PARTNER</div>
            <h2>협력 파트너사</h2>
            <p>씨엘아이티(주)는 세계 최고 수준의 네트워크·보안 기업들과 공식 파트너십을 맺고 검증된 솔루션을 제공합니다.</p>
          </div>
          <div className="partner-card-grid">
            {[
              { name: 'HP',           logo: '/logos/partners/hp.svg' },
              { name: '에스넷시스템', logo: '/logos/partners/esnet.png' },
              { name: 'CISCO',        logo: '/logos/partners/cisco.svg' },
              { name: 'SK텔레콤',     logo: '/logos/partners/skt.svg' },
              { name: '삼성',         logo: '/logos/partners/samsung.svg' },
              { name: '주니퍼',       logo: '/logos/partners/juniper.svg' },
              { name: 'A10',          logo: '/logos/partners/a10.png' },
              { name: 'WINS',         logo: '/logos/partners/wins.png' },
              { name: 'F5',           logo: '/logos/partners/f5.svg' },
              { name: 'INNOOEP',      logo: '/logos/partners/innooep.svg', bg: '#1B2A4A' },
            ].map((p, i) => (
              <div key={i} className="partner-card" style={p.bg ? { background: p.bg } : {}}>
                <img src={p.logo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        <div className="partners-divider"></div>

        {/* 고객사 */}
        <div id="partners-2" className="partners-section">
          <div className="partners-section-header">
            <div className="partners-section-label">CLIENT</div>
            <h2>주요 고객사</h2>
            <p>공공기관, 금융, 의료, 교육 등 다양한 산업군의 고객사에 안정적인 IT 인프라를 공급하고 있습니다.</p>
          </div>
          <div className="client-categories">

            <div className="client-category">
              <div className="category-title">공공 · 공기업</div>
              <div className="client-card-grid">
                {[
                  { name: '경상남도청',         color: '#1a4a8a', logo: '/logos/clients/gyeongnam.png' },
                  { name: '부산도시공사',       color: '#1a5276', logo: '/logos/clients/busanurban.jpg' },
                  { name: '부산명장정수사업소', color: '#1f618d', logo: '/logos/clients/myeongjang.png' },
                  { name: '게임물관리위원회',   color: '#6c3483', logo: '/logos/clients/grac.svg' },
                  { name: '울산농수산물시장',   color: '#117a65', logo: '/logos/clients/ulsanmarket.png' },
                ].map((c, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="client-category">
              <div className="category-title">금융</div>
              <div className="client-card-grid">
                {[
                  { name: '부산IBK저축은행',    color: '#1e6b9a', logo: '/logos/clients/ibk.png' },
                  { name: '부산은행 미음IT센터', color: '#154360', logo: '/logos/clients/busanbank.png' },
                ].map((c, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="client-category">
              <div className="category-title">의료</div>
              <div className="client-card-grid">
                {[
                  { name: '메리놀병원',       color: '#922b21', logo: '/logos/clients/maryknoll.png' },
                  { name: '동래한서요양병원', color: '#a93226', logo: '/logos/clients/dongrae.jpg' },
                  { name: '한서병원',         color: '#c0392b', logo: '/logos/clients/hanseo.png' },
                ].map((c, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="client-category">
              <div className="category-title">교육</div>
              <div className="client-card-grid">
                {[
                  { name: '대동대학교',         color: '#7d6608', logo: '/logos/clients/daedong.png' },
                  { name: '동의과학대학교',     color: '#6e2f06', logo: '/logos/clients/dongui.png' },
                  { name: '부산경상대학교',     color: '#1e8449', logo: '/logos/clients/busangyeongsung.png', filter: 'brightness(0.6) contrast(1.2)' },
                  { name: '부산과학기술대학교', color: '#1a5276', logo: '/logos/clients/busantech.png' },
                ].map((c: { name: string; color: string; logo: string; filter?: string }, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: c.filter }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="client-category">
              <div className="category-title">제조 · 대기업</div>
              <div className="client-card-grid">
                {[
                  { name: '삼성전기 부산사업장', color: '#1c2833', logo: '/logos/clients/samsungelec.svg' },
                  { name: '디오임플란트',        color: '#2471a3', logo: '/logos/clients/dio.svg', filter: 'brightness(0.5) contrast(1.3)' },
                  { name: '울산 STM',            color: '#2e4057', logo: '/logos/clients/stm.png' },
                ].map((c: { name: string; color: string; logo: string; filter?: string }, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: c.filter }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="client-category">
              <div className="category-title">통신</div>
              <div className="client-card-grid">
                {[
                  { name: 'SK브로드밴드', color: '#e8001c', logo: '/logos/clients/skbroadband.svg' },
                ].map((c, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="client-category">
              <div className="category-title">서비스 · 유통</div>
              <div className="client-card-grid">
                {[
                  { name: '부산 롯데시그니엘', color: '#7d3c98', logo: '/logos/clients/lotte.svg' },
                ].map((c, i) => (
                  <div key={i} className="client-card" style={{ '--card-color': c.color } as React.CSSProperties}>
                    <img src={c.logo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  const CeoPage = () => (
    <div className="ceo-page">
      <div className="ceo-hero">
        <div className="container">
          <span className="ceo-hero-tag">CEO MESSAGE</span>
          <h1>대표이사 인사말</h1>
        </div>
      </div>

      <div className="ceo-body">
        <div className="container ceo-inner">

          {/* 인사말 */}
          <div className="ceo-main-layout">
            <div className="ceo-msg-side ceo-msg-full">
              <p className="ceo-greeting">안녕하십니까, 씨엘아이티㈜ 대표이사 최혁원입니다.</p>
              <p>
                저희 씨엘아이티㈜는 2014년 창립 이래, 네트워크 인프라 구축과 ICT 솔루션 제공을 핵심으로
                고객의 디지털 환경을 설계하고 최적화하는데 전력을 다해왔습니다.
                Cisco, Juniper, HP(Aruba) 등 글로벌 선도 브랜드와의 파트너십을 바탕으로
                공공기관, 의료기관, 교육기관, 금융기관 등 다양한 산업군에서 신뢰받는 기술 파트너로 성장해 왔습니다.
              </p>
              <p>
                오늘날 디지털 전환(Digital Transformation)은 선택이 아닌 필수가 되었습니다.
                클라우드, AI, IoT, 스마트시티로 이어지는 거대한 기술 흐름 속에서
                안정적이고 보안성 높은 네트워크 인프라는 모든 혁신의 근간입니다.
                저희는 이 변화의 최전선에서 고객의 비즈니스 연속성을 지키고,
                더 빠르고 안전한 연결 환경을 제공하기 위해 끊임없이 연구하고 준비하고 있습니다.
              </p>
              <p>
                씨엘아이티㈜는 단순한 장비 공급을 넘어, 컨설팅·설계·구축·유지보수·교육에 이르는
                토탈 ICT 서비스를 통해 고객과 함께 성장하는 파트너가 되겠습니다.
                앞으로도 변함없는 기술력과 신뢰로 고객 여러분께 보답하겠습니다.
              </p>
              <p className="ceo-thanks">감사합니다.</p>
              <div className="ceo-sig-block">
                <span>씨엘아이티㈜ 대표이사</span>
                <strong>최 혁 원</strong>
                <div className="ceo-sig-underline" />
              </div>
            </div>
          </div>

          {/* 하단: 핵심 가치 3카드 */}
          <div className="ceo-values">
            <div className="ceo-value-card">
              <div className="ceo-value-icon">🌐</div>
              <h4>토탈 네트워크 서비스</h4>
              <p>컨설팅에서 설계·구축·유지보수·교육까지 네트워크 전 영역의 부가가치를 제공합니다.</p>
            </div>
            <div className="ceo-value-card">
              <div className="ceo-value-icon">🔒</div>
              <h4>차세대 ICT 솔루션</h4>
              <p>정보보안, UC, 무선랜, 데이터센터, 가상화 등 급변하는 IT 시장에 발맞춘 종합 서비스를 제공합니다.</p>
            </div>
            <div className="ceo-value-card">
              <div className="ceo-value-icon">🚀</div>
              <h4>글로벌 ICT 전문기업</h4>
              <p>Smart City·IoT 솔루션으로 신성장 동력을 확보하고 한국 IT 융합 기술의 선진화를 이끌어 갑니다.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  const HistoryPage = () => {
    const history = [
      {
        year: '2014',
        events: [{ date: '2014. 12. 10', text: '씨엘아이티(주) 법인 설립' }],
      },
      { year: '2015', events: [] },
      { year: '2016', events: [] },
      { year: '2017', events: [] },
      {
        year: '2018',
        events: [
          { date: '2018', text: '부산소방본부 방화벽 및 L4 시스템 구축 사업' },
          { date: '2018', text: '동의과학대학 보안시스템 납품 및 구축' },
          { date: '2018', text: '창원세계사격선수권대회 온라인홍보 운영' },
          { date: '2018', text: '부산신항만㈜ 온습도모니터링시스템 구축 사업' },
          { date: '2018', text: '대동대학교 무선랜 구축 사업' },
          { date: '2018', text: '부산광역시 청렴부산 소셜미디어 운영' },
          { date: '2018', text: '싸이버로지텍 전산실 이전 구축 사업' },
          { date: '2018', text: '인제대학교 의과대학 무선랜 구축' },
        ],
      },
      {
        year: '2019',
        events: [
          { date: '2019', text: '부산소방본부 방화벽 및 L4 시스템 구축 사업' },
          { date: '2019', text: '동의과학대학 보안시스템 납품 및 구축' },
          { date: '2019', text: '창원세계사격선수권대회 온라인홍보 운영' },
          { date: '2019', text: '부산신항만㈜ 온습도모니터링시스템 구축 사업' },
          { date: '2019', text: '대동대학교 무선랜 구축 사업' },
          { date: '2019', text: '부산광역시 청렴부산 소셜미디어 운영' },
          { date: '2019', text: '싸이버로지텍 전산실 이전 구축 사업' },
          { date: '2019', text: '인제대학교 의과대학 무선랜 구축' },
        ],
      },
      {
        year: '2020',
        events: [
          { date: '2020', text: '동의과학대학 강의실 무선 구축 사업' },
          { date: '2020', text: '한국우주항공 IPT 구축 사업' },
          { date: '2020', text: '우즈베키스탄 국립아동병원 네트워크 구축 사업' },
          { date: '2020', text: '만에너지솔루션 네트워크 구축 사업' },
          { date: '2020', text: '군포시 버스정보시스템 네트워크 구축사업' },
          { date: '2020', text: '국립수산품질관리원 네트워크 교체 사업' },
          { date: '2020', text: '롯데시그니엘호텔 무선랜 구축 사업' },
          { date: '2020', text: '경성대학교 가상화서버 구축 사업' },
          { date: '2020', text: '부산과학기술대학교 LMS 시스템 구축 사업' },
          { date: '2020', text: '창원시 블로그 소셜미디어 운영용역' },
          { date: '2020', text: '울산 미즈병원 PACS 시스템 교체 사업' },
          { date: '2020', text: '화신사이버대학 보안 시스템 구축 사업' },
          { date: '2020', text: '울산여행 온라인 홍보단 운영용역' },
          { date: '2020', text: '의령군청 IP 교환기 교체 사업' },
          { date: '2020', text: '경상남도의회 블로그 및 SNS 운영용역' },
          { date: '2020', text: '동의과학대학교 기숙사 무선랜 구축' },
        ],
      },
      {
        year: '2021',
        events: [
          { date: '2021. 01 ~ 02', text: '부산과학기술대 네트워크 구축' },
          { date: '2021. 01 ~ 10', text: '카메룬 가루와국립병원 네트워크 및 IPT 납품 구축' },
          { date: '2021. 03 ~ 12', text: '부산대 스마트캠퍼스 사업내 보안시스템 납품' },
          { date: '2021. 06 ~ 08', text: '기술보증기금 무선네트워크 납품 및 설치' },
          { date: '2021. 09 ~ 10', text: '르완다 국립병원 네트워크 납품' },
          { date: '2021. 09 ~ 12', text: '아트하랑 홈페이지 및 SNS 홍보시스템 구축' },
          { date: '2021. 10 ~ 11', text: '인제대 가상화시스템 납품 및 구축' },
          { date: '2021. 10 ~ 12', text: '삼성전자 인재개발원 네트워크 모니터링시스템 구축' },
        ],
      },
      { year: '2022', events: [] },
      { year: '2023', events: [] },
      { year: '2024', events: [] },
      { year: '2025', events: [] },
      { year: '2026', events: [] },
    ];

    return (
      <div className="history-page">
        <div className="history-hero">
          <div className="container">
            <span className="history-hero-tag">HISTORY</span>
            <h1>씨엘아이티(주)의<br />걸어온 길</h1>
            <p>2014년 설립 이래 최고의 기술력으로 고객과 함께 성장해 왔습니다.</p>
          </div>
        </div>

        <div className="history-body">
          <div className="history-container">
            <div className="timeline-section-label">
              <span className="timeline-section-line" />
              <span className="timeline-section-text">주요 실적</span>
              <span className="timeline-section-line" />
            </div>
            <div className="timeline">
              {history.map((row, i) => {
                const side = i % 2 === 0 ? 'left' : 'right';
                const isEmpty = row.events.length === 0;
                const contentBlock = !isEmpty && (
                  <div className={`timeline-content${row.events.length === 1 ? ' timeline-content--single' : ''}`}>
                    <ul className="timeline-events">
                      {row.events.map((e, j) => (
                        <li key={j}>
                          <span className="event-text">{e.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
                return (
                  <div key={i} className={`timeline-row timeline-row--${side}${isEmpty ? ' timeline-row--empty' : ''}`}>
                    <div className="timeline-side timeline-side--left">
                      {side === 'left' && (
                        <>
                          <span className="timeline-year">{row.year}</span>
                          {contentBlock}
                        </>
                      )}
                    </div>
                    <div className="timeline-node-col">
                      <div className="timeline-node">
                        <div className="node-inner"></div>
                      </div>
                    </div>
                    <div className="timeline-side timeline-side--right">
                      {side === 'right' && (
                        <>
                          <span className="timeline-year">{row.year}</span>
                          {contentBlock}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapPage = () => (
    <div className="map-page container">
      <div className="section-title">
        <h2>오시는 길</h2>
        <div className="bar"></div>
      </div>
      <div className="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.672!2d129.068!3d35.207428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDEyJzI2LjciTiAxMjnCsDA0JzEyLjgiRQ!5e0!3m2!1sko!2skr!4v1711430000000!5m2!1sko!2skr" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="씨엘아이티 오시는길"
        ></iframe>
      </div>
      <div className="address-info">
        <h3>사무실 위치</h3>
        <p><strong>주소:</strong> 부산광역시 동래구 충렬대로 84 영남빌딩 303호 (미남역 10번 출구 바로 앞)</p>
        <p><strong>전화:</strong> 051-501-3735 / 3734</p>
        <p><strong>이메일:</strong> hwchoi@next-ict.co.kr</p>
        <a href="#home" className="back-home">홈으로 돌아가기</a>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div className="logo"><a href="#home">CL<span className="logo-it-red">IT</span> <span>씨엘아이티(주)</span></a></div>
          <nav className="nav-links">
            <div className="nav-item">
              <a href="#about">회사소개</a>
              <div className="dropdown">
                <a href="#about">회사소개</a>
                <a href="#ceo">CEO Message</a>
                <a href="#history">연혁</a>
                <a href="#location">오시는 길</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="#business">비지니스</a>
            </div>
            <div className="nav-item">
              <a href="#products">제품소개</a>
            </div>
            <div className="nav-item">
              <a href="#partners">파트너·고객사</a>
              <div className="dropdown">
                <a href="#partners-1">파트너</a>
                <a href="#partners-2">고객사</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="#recruitment">채용정보</a>
              <div className="dropdown">
                <a href="#recruitment-jobs">채용공고</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="#contact">고객문의</a>
            </div>
          </nav>
          <div className="search-wrap" ref={searchRef}>
            {searchOpen ? (
              <div className="search-box">
                <input
                  autoFocus
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>✕</button>
                {searchResults.length > 0 && (
                  <ul className="search-results">
                    {searchResults.map((r, i) => (
                      <li key={i} onClick={() => handleSearchSelect(r.hash)}>{r.label}</li>
                    ))}
                  </ul>
                )}
                {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                  <ul className="search-results">
                    <li className="no-result">검색 결과가 없습니다</li>
                  </ul>
                )}
              </div>
            ) : (
              <button className="search-icon-btn" onClick={() => setSearchOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 라우팅 처리 */}
      {currentPath === '#location' ? <MapPage /> :
       currentPath === '#ceo' ? <CeoPage /> :
       currentPath === '#history' ? <HistoryPage /> :
       currentPath === '#apply' ? <ResumePage /> :
       currentPath.startsWith('#recruitment') ? <RecruitmentPage /> :
       currentPath.startsWith('#business') ? <BusinessPage /> :
       currentPath.startsWith('#products') ? <ProductsPage /> :
       currentPath.startsWith('#partners') ? <PartnersPage /> :
       <MainContent />}

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={toggleModal}>&times;</span>
            <div className="modal-header">
              <h2>견적 및 기술 문의</h2>
              <p>문의를 남겨주시면 담당자가 신속히 연락드리겠습니다.</p>
            </div>
            <form className="inquiry-form" onSubmit={handleInquirySubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>성함 / 담당자명</label>
                  <input name="from_name" type="text" placeholder="성함을 입력해주세요" required />
                </div>
                <div className="form-group">
                  <label>연락처</label>
                  <input name="phone" type="tel" placeholder="010-0000-0000" required />
                </div>
              </div>
              <div className="form-group">
                <label>기업 / 기관명</label>
                <input name="company" type="text" placeholder="회사명을 입력해주세요" required />
              </div>
              <div className="form-group">
                <label>문의 유형</label>
                <select name="inquiry_type" required>
                  <option value="">유형을 선택하세요</option>
                  <option value="네트워크 통합 구축/설계">네트워크 통합 구축/설계</option>
                  <option value="정보보안 솔루션 도입">정보보안 솔루션 도입</option>
                  <option value="정기 유지보수 서비스">정기 유지보수 서비스</option>
                  <option value="Cisco/Juniper 장비 견적">Cisco/Juniper 장비 견적</option>
                  <option value="기타 IT 서비스 문의">기타 IT 서비스 문의</option>
                </select>
              </div>
              <div className="form-group">
                <label>문의 상세 내용</label>
                <textarea name="message" rows={5} placeholder="상세한 요구사항이나 현재 인프라 환경을 설명해주세요."></textarea>
              </div>
              <div className="privacy-notice">
                <div className="privacy-notice-title">개인정보 수집 및 이용 안내</div>
                <div className="privacy-notice-body">
                  <p>씨엘아이티㈜는 「개인정보 보호법」 제15조에 따라 아래와 같이 개인정보를 수집·이용합니다.</p>
                  <table className="privacy-table">
                    <thead>
                      <tr>
                        <th>수집 항목</th>
                        <th>수집·이용 목적</th>
                        <th>보유 및 이용 기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>성명, 연락처, 회사명</td>
                        <td>문의 접수 및 상담 응대</td>
                        <td>문의 처리 완료 후 1년</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="privacy-rights">귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으나, 동의 거부 시 상담 신청이 제한될 수 있습니다.</p>
                </div>
                <label className="privacy-consent-label">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={e => setPrivacyConsent(e.target.checked)}
                  />
                  <span>개인정보 수집 및 이용에 <strong>동의합니다</strong> <span className="required">(필수)</span></span>
                </label>
              </div>
              <button type="submit" className="submit-btn" disabled={isSending || !privacyConsent}>
                {isSending ? '전송 중...' : '문의하기 제출'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <p>© 2026 씨엘아이티(주) (CLIT). All Rights Reserved.</p>
          <p style={{marginTop: '10px', fontSize: '12px'}}>부산광역시 동래구 충렬대로 84 영남빌딩 303호 | 대표이사: 최혁원 | 사업자등록번호: 615-86-14557</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
