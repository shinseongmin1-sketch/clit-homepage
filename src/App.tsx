// src/App.tsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentPath(hash);
      
      // 페이지 전환 후 특정 섹션으로 스크롤 처리
      setTimeout(() => {
        const elementId = hash.split('-')[1]; // #business-network -> network
        if (elementId) {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 초기 로드 시 실행

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
              <p>Cisco, Juniper, Arista 등 글로벌 브랜드의 정품 장비를 합리적인 가격에 공급합니다.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🛠️</div>
              <h3>유지보수</h3>
              <p>정기 점검 및 실시간 모니터링을 통해 장애를 미연에 방지하고 신속하게 대응합니다.</p>
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
            <p>📧 clit@clit.co.kr</p>
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

      <div id="p-network" className="product-section">
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

      <div id="p-security" className="product-section">
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

      <div id="p-server" className="product-section">
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

      <div id="p-solution" className="product-section">
        <h3>솔루션 (SOLUTION)</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="vendor-logo" style={{ color: '#007bff' }}>CLIT MONITORING</div>
            <h4>통합 NMS 솔루션</h4>
            <p>씨엘아이티만의 전문 노하우가 담긴 실시간 네트워크 모니터링 시스템입니다.</p>
            <div className="product-specs">
              <div className="spec-item">• 트래픽 실시간 시각화</div>
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
        <div id="b-ni" className="business-item">
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
        <div id="b-security" className="business-item">
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
        <div id="b-maintenance" className="business-item">
          <div className="business-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)' }}></div>
          <div className="business-info">
            <span className="tag">MAINTENANCE</span>
            <h3>통합 유지보수</h3>
            <p>24/7 중단 없는 비즈니스 운영을 보장합니다. 정기 점검과 신속한 장애 대응 프로세스를 통해 안정적인 IT 환경을 유지합니다.</p>
            <div className="feature-list">
              <div className="feature-item">365일 실시간 모니터링</div>
              <div className="feature-item">장애 긴급 복구 지원</div>
              <div className="feature-item">시스템 정기 기술 점검</div>
              <div className="feature-item">성능 분석 및 개선 컨설팅</div>
            </div>
          </div>
        </div>
        <div id="b-infra" className="business-item">
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
      </div>
    </div>
  );

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
        <p><strong>이메일:</strong> clit@clit.co.kr</p>
        <a href="#home" className="back-home">홈으로 돌아가기</a>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div className="logo"><a href="#home">CLIT <span>씨엘아이티(주)</span></a></div>
          <nav className="nav-links">
            <div className="nav-item">
              <a href="#about">회사소개</a>
              <div className="dropdown">
                <a href="#about">회사소개</a>
                <a href="#home">연혁</a>
                <a href="#location">오시는 길</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="#business">비지니스</a>
              <div className="dropdown">
                <a href="#business-ni">네트워크 통합</a>
                <a href="#business-security">통합보안 구축</a>
                <a href="#business-maintenance">통합 유지보수</a>
                <a href="#business-infra">인프라 서비스</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="#products">제품소개</a>
              <div className="dropdown">
                <a href="#products">제품전체</a>
                <a href="#products-network">네트워크</a>
                <a href="#products-security">보안</a>
                <a href="#products-server">서버 스토리지</a>
                <a href="#products-solution">솔루션</a>
              </div>
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
            </div>
            <div className="nav-item">
              <a href="#contact">고객문의</a>
            </div>
          </nav>
        </div>
      </header>

      {/* 라우팅 처리 */}
      {currentPath === '#location' ? <MapPage /> : 
       currentPath.startsWith('#business') ? <BusinessPage /> : 
       currentPath.startsWith('#products') ? <ProductsPage /> : 
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
            <form className="inquiry-form" onSubmit={(e) => { e.preventDefault(); alert('문의가 성공적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.'); toggleModal(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label>성함 / 담당자명</label>
                  <input type="text" placeholder="성함을 입력해주세요" required />
                </div>
                <div className="form-group">
                  <label>연락처</label>
                  <input type="tel" placeholder="010-0000-0000" required />
                </div>
              </div>
              <div className="form-group">
                <label>기업 / 기관명</label>
                <input type="text" placeholder="회사명을 입력해주세요" required />
              </div>
              <div className="form-group">
                <label>문의 유형</label>
                <select required>
                  <option value="">유형을 선택하세요</option>
                  <option value="design">네트워크 통합 구축/설계</option>
                  <option value="security">정보보안 솔루션 도입</option>
                  <option value="maintenance">정기 유지보수 서비스</option>
                  <option value="equipment">Cisco/Juniper 장비 견적</option>
                  <option value="etc">기타 IT 서비스 문의</option>
                </select>
              </div>
              <div className="form-group">
                <label>문의 상세 내용</label>
                <textarea rows={5} placeholder="상세한 요구사항이나 현재 인프라 환경을 설명해주세요."></textarea>
              </div>
              <button type="submit" className="submit-btn">문의하기 제출</button>
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
