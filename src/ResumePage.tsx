// src/ResumePage.tsx
import { useState } from 'react';
import './ResumePage.css';

const WEB3FORMS_KEY = '03939c95-62bb-4936-b8b7-a95566a6a0f2';

type Education = { school: string; major: string; from: string; to: string; degree: string; gpa: string };
type Career = { company: string; dept: string; position: string; from: string; to: string; current: boolean; tasks: string; reason: string };
type License = { name: string; issuer: string; date: string };
type Language = { lang: string; test: string; score: string };

export default function ResumePage() {
  const [isSending, setIsSending] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [educations, setEducations] = useState<Education[]>([
    { school: '', major: '', from: '', to: '', degree: '', gpa: '' },
  ]);
  const [careers, setCareers] = useState<Career[]>([
    { company: '', dept: '', position: '', from: '', to: '', current: false, tasks: '', reason: '' },
  ]);
  const [licenses, setLicenses] = useState<License[]>([{ name: '', issuer: '', date: '' }]);
  const [languages, setLanguages] = useState<Language[]>([{ lang: '', test: '', score: '' }]);

  // 학력
  const updateEdu = (i: number, key: keyof Education, val: string) =>
    setEducations(educations.map((x, idx) => idx === i ? { ...x, [key]: val } : x));
  // 경력
  const updateCareer = (i: number, key: keyof Career, val: string | boolean) =>
    setCareers(careers.map((x, idx) => idx === i ? { ...x, [key]: val } : x));
  // 자격증
  const updateLicense = (i: number, key: keyof License, val: string) =>
    setLicenses(licenses.map((x, idx) => idx === i ? { ...x, [key]: val } : x));
  // 어학
  const updateLang = (i: number, key: keyof Language, val: string) =>
    setLanguages(languages.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacyConsent) { alert('개인정보 수집 및 이용에 동의해주세요.'); return; }
    const fd = new FormData(e.currentTarget);

    const eduText = educations.map((x, i) =>
      `[학력${i+1}] ${x.school} ${x.major} (${x.from}~${x.to}) ${x.degree}${x.gpa ? ' / 학점: '+x.gpa : ''}`
    ).join('\n');

    const careerText = careers.map((x, i) =>
      `[경력${i+1}] ${x.company} / ${x.dept} / ${x.position} / ${x.from}~${x.current ? '재직중' : x.to}\n업무: ${x.tasks}${x.reason ? ' / 이직사유: '+x.reason : ''}`
    ).join('\n\n');

    const licenseText = licenses.filter(x => x.name).map(x =>
      `${x.name} (${x.issuer}) ${x.date}`
    ).join(', ');

    const langText = languages.filter(x => x.lang).map(x =>
      `${x.lang} - ${x.test} ${x.score}`
    ).join(', ');

    setIsSending(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[씨엘아이티 입사지원] ${fd.get('position')} - ${fd.get('name')}`,
          이름: fd.get('name'),
          생년월일: fd.get('birth'),
          성별: fd.get('gender'),
          이메일: fd.get('email'),
          휴대폰: fd.get('phone'),
          주소: fd.get('address'),
          지원포지션: fd.get('position'),
          학력: eduText,
          경력: careerText,
          자격증: licenseText,
          어학: langText,
          스킬: fd.get('skills'),
          성격장단점: fd.get('personality'),
          지원동기: fd.get('motive'),
          입사후포부: fd.get('aspiration'),
        }),
      });
      if (!res.ok) throw new Error();
      alert('이력서가 성공적으로 제출되었습니다. 담당자가 확인 후 연락드리겠습니다.');
      window.location.hash = '#recruitment-jobs';
    } catch {
      alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-hero">
        <div className="container">
          <span className="resume-hero-tag">APPLY</span>
          <h1>입사지원서</h1>
          <p>씨엘아이티와 함께 성장하세요</p>
        </div>
      </div>

      <div className="resume-body">
        <form className="resume-form" onSubmit={handleSubmit}>

          {/* 지원 포지션 */}
          <section className="rs-section">
            <h2 className="rs-title">지원 정보</h2>
            <div className="rs-row">
              <div className="rs-field">
                <label>지원 포지션 <span className="req">*</span></label>
                <select name="position" required>
                  <option value="">선택</option>
                  <option value="네트워크 엔지니어">네트워크 엔지니어</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
          </section>

          {/* 기본정보 */}
          <section className="rs-section">
            <h2 className="rs-title">기본정보</h2>
            <div className="rs-row">
              <div className="rs-field">
                <label>이름 <span className="req">*</span></label>
                <input name="name" type="text" placeholder="홍길동" required />
              </div>
              <div className="rs-field">
                <label>생년월일</label>
                <input name="birth" type="date" />
              </div>
              <div className="rs-field">
                <label>성별</label>
                <select name="gender">
                  <option value="">선택</option>
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </div>
            </div>
            <div className="rs-row">
              <div className="rs-field">
                <label>이메일 <span className="req">*</span></label>
                <input name="email" type="email" placeholder="example@email.com" required />
              </div>
              <div className="rs-field">
                <label>휴대폰 <span className="req">*</span></label>
                <input name="phone" type="tel" placeholder="010-0000-0000" required />
              </div>
            </div>
            <div className="rs-row">
              <div className="rs-field full">
                <label>주소</label>
                <input name="address" type="text" placeholder="거주지 주소" />
              </div>
            </div>
          </section>

          {/* 학력사항 */}
          <section className="rs-section">
            <div className="rs-section-head">
              <h2 className="rs-title">학력사항</h2>
              <button type="button" className="rs-add-btn"
                onClick={() => setEducations([...educations, { school: '', major: '', from: '', to: '', degree: '', gpa: '' }])}>
                + 추가
              </button>
            </div>
            {educations.map((ed, i) => (
              <div key={i} className="rs-block">
                <div className="rs-row">
                  <div className="rs-field">
                    <label>학교명</label>
                    <input type="text" placeholder="학교명" value={ed.school} onChange={e => updateEdu(i, 'school', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>전공</label>
                    <input type="text" placeholder="전공" value={ed.major} onChange={e => updateEdu(i, 'major', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>졸업구분</label>
                    <select value={ed.degree} onChange={e => updateEdu(i, 'degree', e.target.value)}>
                      <option value="">선택</option>
                      <option>졸업</option>
                      <option>재학중</option>
                      <option>휴학중</option>
                      <option>중퇴</option>
                      <option>수료</option>
                    </select>
                  </div>
                </div>
                <div className="rs-row">
                  <div className="rs-field">
                    <label>입학년월</label>
                    <input type="month" value={ed.from} onChange={e => updateEdu(i, 'from', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>졸업년월</label>
                    <input type="month" value={ed.to} onChange={e => updateEdu(i, 'to', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>학점 (선택)</label>
                    <input type="text" placeholder="예: 3.8 / 4.5" value={ed.gpa} onChange={e => updateEdu(i, 'gpa', e.target.value)} />
                  </div>
                </div>
                {educations.length > 1 && (
                  <button type="button" className="rs-remove-btn" onClick={() => setEducations(educations.filter((_, idx) => idx !== i))}>삭제</button>
                )}
              </div>
            ))}
          </section>

          {/* 경력사항 */}
          <section className="rs-section">
            <div className="rs-section-head">
              <h2 className="rs-title">경력사항</h2>
              <button type="button" className="rs-add-btn"
                onClick={() => setCareers([...careers, { company: '', dept: '', position: '', from: '', to: '', current: false, tasks: '', reason: '' }])}>
                + 추가
              </button>
            </div>
            {careers.map((c, i) => (
              <div key={i} className="rs-block">
                <div className="rs-row">
                  <div className="rs-field">
                    <label>회사명</label>
                    <input type="text" placeholder="회사명" value={c.company} onChange={e => updateCareer(i, 'company', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>부서</label>
                    <input type="text" placeholder="부서명" value={c.dept} onChange={e => updateCareer(i, 'dept', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>직급/직위</label>
                    <input type="text" placeholder="직급/직위" value={c.position} onChange={e => updateCareer(i, 'position', e.target.value)} />
                  </div>
                </div>
                <div className="rs-row">
                  <div className="rs-field">
                    <label>입사년월</label>
                    <input type="month" value={c.from} onChange={e => updateCareer(i, 'from', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>퇴사년월</label>
                    <input type="month" value={c.to} disabled={c.current} onChange={e => updateCareer(i, 'to', e.target.value)} />
                  </div>
                  <div className="rs-field rs-check-field">
                    <label className="rs-checkbox-label">
                      <input type="checkbox" checked={c.current} onChange={e => updateCareer(i, 'current', e.target.checked)} />
                      현재 재직중
                    </label>
                  </div>
                </div>
                <div className="rs-row">
                  <div className="rs-field full">
                    <label>담당업무</label>
                    <textarea placeholder="담당 업무 및 주요 성과를 입력해주세요." rows={3} value={c.tasks} onChange={e => updateCareer(i, 'tasks', e.target.value)} />
                  </div>
                </div>
                <div className="rs-row">
                  <div className="rs-field">
                    <label>이직사유 (선택)</label>
                    <input type="text" placeholder="이직사유" value={c.reason} onChange={e => updateCareer(i, 'reason', e.target.value)} />
                  </div>
                </div>
                {careers.length > 1 && (
                  <button type="button" className="rs-remove-btn" onClick={() => setCareers(careers.filter((_, idx) => idx !== i))}>삭제</button>
                )}
              </div>
            ))}
          </section>

          {/* 자격/어학 */}
          <section className="rs-section">
            <h2 className="rs-title">자격 / 어학</h2>

            <div className="rs-subsection-head">
              <span className="rs-subtitle">자격증</span>
              <button type="button" className="rs-add-btn"
                onClick={() => setLicenses([...licenses, { name: '', issuer: '', date: '' }])}>
                + 추가
              </button>
            </div>
            {licenses.map((l, i) => (
              <div key={i} className="rs-inline-block">
                <div className="rs-row">
                  <div className="rs-field">
                    <label>자격증명</label>
                    <input type="text" placeholder="예: CCNA" value={l.name} onChange={e => updateLicense(i, 'name', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>발급기관</label>
                    <input type="text" placeholder="발급기관" value={l.issuer} onChange={e => updateLicense(i, 'issuer', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>취득일</label>
                    <input type="month" value={l.date} onChange={e => updateLicense(i, 'date', e.target.value)} />
                  </div>
                  {licenses.length > 1 && (
                    <button type="button" className="rs-remove-inline" onClick={() => setLicenses(licenses.filter((_, idx) => idx !== i))}>✕</button>
                  )}
                </div>
              </div>
            ))}

            <div className="rs-subsection-head" style={{ marginTop: 20 }}>
              <span className="rs-subtitle">어학</span>
              <button type="button" className="rs-add-btn"
                onClick={() => setLanguages([...languages, { lang: '', test: '', score: '' }])}>
                + 추가
              </button>
            </div>
            {languages.map((l, i) => (
              <div key={i} className="rs-inline-block">
                <div className="rs-row">
                  <div className="rs-field">
                    <label>언어</label>
                    <input type="text" placeholder="예: 영어" value={l.lang} onChange={e => updateLang(i, 'lang', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>시험명</label>
                    <input type="text" placeholder="예: TOEIC" value={l.test} onChange={e => updateLang(i, 'test', e.target.value)} />
                  </div>
                  <div className="rs-field">
                    <label>점수/등급</label>
                    <input type="text" placeholder="예: 850" value={l.score} onChange={e => updateLang(i, 'score', e.target.value)} />
                  </div>
                  {languages.length > 1 && (
                    <button type="button" className="rs-remove-inline" onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}>✕</button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* 스킬 */}
          <section className="rs-section">
            <h2 className="rs-title">스킬</h2>
            <div className="rs-field">
              <label>보유 기술</label>
              <input name="skills" type="text" placeholder="예: Cisco IOS, Juniper JunOS, Linux, Python (쉼표로 구분)" />
            </div>
          </section>

          {/* 자기소개서 */}
          <section className="rs-section">
            <h2 className="rs-title">자기소개서</h2>
            {[
              { name: 'personality', label: '성격의 장단점', placeholder: '본인의 장단점을 작성해주세요.' },
              { name: 'motive', label: '지원동기', placeholder: '지원 동기를 작성해주세요.' },
              { name: 'aspiration', label: '입사 후 포부', placeholder: '입사 후 포부를 작성해주세요.' },
            ].map(item => (
              <div key={item.name} className="rs-field" style={{ marginBottom: 20 }}>
                <label>{item.label}</label>
                <textarea name={item.name} placeholder={item.placeholder} rows={5} />
              </div>
            ))}
          </section>

          {/* 개인정보 동의 */}
          <section className="rs-section rs-privacy">
            <h2 className="rs-title">개인정보 수집 및 이용 동의</h2>
            <div className="rs-privacy-box">
              <p><strong>수집 항목:</strong> 성명, 연락처, 이메일, 생년월일, 주소, 학력, 경력, 자격증</p>
              <p><strong>수집 목적:</strong> 채용 전형 진행 및 결과 통보</p>
              <p><strong>보유 기간:</strong> 채용 절차 완료 후 6개월 이내 파기 (불합격자 즉시 파기)</p>
            </div>
            <label className="rs-consent-label">
              <input type="checkbox" checked={privacyConsent} onChange={e => setPrivacyConsent(e.target.checked)} />
              위 개인정보 수집 및 이용에 동의합니다. <span className="req">*</span>
            </label>
          </section>

          <div className="rs-actions">
            <button type="button" className="rs-cancel" onClick={() => { window.location.hash = '#recruitment-jobs'; }}>취소</button>
            <button type="submit" className="rs-submit" disabled={isSending}>
              {isSending ? '제출 중...' : '이력서 제출'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
