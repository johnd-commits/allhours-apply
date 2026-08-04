'use client';
import { useState } from 'react';

const C = {
  primary: '#1B3B6F',
  primaryDark: '#122850',
  primaryLight: '#E8EEF7',
  accent: '#F5A623',
  accentLight: '#FEF8EC',
  text: '#1A2332',
  textMid: '#4A5568',
  textLight: '#9AABB8',
  border: '#D1DCE8',
  surface: '#FFFFFF',
  bg: '#F5F7FA',
  inputBg: '#EEF2F7',
  low: '#38A169',
  lowLight: '#F0FFF4',
  high: '#E53E3E',
  highLight: '#FFF5F5',
};

const font = "'Inter', system-ui, sans-serif";

const POSITIONS = ['Registered Nurse (RN)', 'Licensed Practical Nurse (LPN)', 'Certified Nursing Assistant (CNA)', 'Home Health Aide (HHA)', 'Physical Therapist', 'Occupational Therapist', 'Speech Therapist', 'Other Therapist', 'Administrative / Office', 'Other'];
const CREDENTIALS = ['RN', 'BSN', 'MSN', 'LPN', 'CNA', 'HHA', 'CMA', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'Portuguese', 'Haitian Creole', 'French', 'Mandarin', 'Cantonese', 'Arabic', 'Vietnamese', 'Cape Verdean Creole', 'Other'];
const HOURS = ['Under 10 hrs/week', '10–20 hrs/week', '20–30 hrs/week', '30–40 hrs/week', 'Full time (40+)'];
const SHIFT_TYPES = ['Full-time', 'Part-time', 'Per Diem', 'Overnight', 'Weekends only', 'Live-in'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OFFICE_SKILLS = ['Microsoft Word', 'Microsoft Excel', 'Electronic Health Records (EHR)', 'Medical billing', 'Scheduling software', 'None'];
const HOW_HEARD = ['Indeed', 'LinkedIn', 'Facebook', 'Instagram', 'Google', 'Employee referral', 'Job fair', 'School / nursing program', 'Other'];
const EDUCATION = ['High School Diploma / GED', 'Some College', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Vocational / Trade School', 'Other'];
const LICENSE_TYPES = ['Class A', 'Class B', 'Class C', 'Class D', 'Motorcycle', 'CDL'];

const emptyJob = () => ({ company: '', phone: '', address: '', dates: '', title: '', description: '', startingPay: '', reasonLeaving: '' });
const emptyRef = () => ({ name: '', address: '', phone: '' });

const INITIAL = {
  fullName: '', dateOfApplication: new Date().toISOString().slice(0, 10),
  address: '', phone: '', email: '', ssn: '', dob: '', emergencyContact: '',
  position: '', therapyType: '', credentials: [], salaryDesired: '',
  languages: [], hoursPerWeek: '', willingToWork: [], daysAvailable: [],
  officeSkills: [], howDidYouHear: '',
  appliedBefore: '', legallyEligible: '', hasDriversLicense: '',
  licenseNumber: '', licenseState: '', licenseType: '', accidentHistory: '',
  armedForces: '', nationalGuard: '', militaryDetails: '',
  convicted: '', convictionDetails: '',
  currentlyEmployed: '', contactCurrentEmployer: '',
  education: '', fieldOfStudy: '', lastNameDifferent: '', previousName: '',
  jobs: [emptyJob(), emptyJob(), emptyJob()],
  reliableTransportation: '', capableOfJob: '', jobRequirementCantMeet: '',
  stateLicenses: '', specialSkills: '',
  references: [emptyRef(), emptyRef(), emptyRef()],
  certifyTrue: false, authorizeInvestigation: false,
  atWillAgreement: false, applicationPeriod: false,
  date: new Date().toISOString().slice(0, 10),
  eSignature: '', confirmEmail: '',
};

function Pill({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
      border: `1px solid ${selected ? C.primary : C.border}`,
      background: selected ? C.primary : C.surface,
      color: selected ? '#fff' : C.textMid,
      fontSize: 13, fontWeight: selected ? 600 : 400,
      fontFamily: font, transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{selected ? '✓ ' : ''}{label}</button>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontFamily: font }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 12, color: C.high, marginTop: 4, fontFamily: font }}>{error}</div>}
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '11px 14px',
  background: C.inputBg, border: `1px solid transparent`,
  borderRadius: 10, fontSize: 14, fontFamily: font,
  color: C.text, outline: 'none', display: 'block',
};

const textareaStyle = { ...inputStyle, resize: 'vertical', lineHeight: 1.5 };

const yesNo = (val, onChange) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {['Yes', 'No'].map(v => (
      <button key={v} type="button" onClick={() => onChange(v)} style={{
        padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
        border: `1px solid ${val === v ? C.primary : C.border}`,
        background: val === v ? C.primary : C.surface,
        color: val === v ? '#fff' : C.textMid,
        fontSize: 14, fontWeight: 600, fontFamily: font,
      }}>{v}</button>
    ))}
  </div>
);

export default function AllHoursApp() {
  const [step, setStep] = useState(1);
  const TOTAL = 6;
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [jobCount, setJobCount] = useState(1);
  const [refCount, setRefCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  const setJob = (i, k, v) => setForm(f => { const jobs = [...f.jobs]; jobs[i] = { ...jobs[i], [k]: v }; return { ...f, jobs }; });
  const setRef = (i, k, v) => setForm(f => { const references = [...f.references]; references[i] = { ...references[i], [k]: v }; return { ...f, references }; });

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Required';
      if (!form.address.trim()) e.address = 'Required';
      if (!form.phone.trim()) e.phone = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      if (!form.dob) e.dob = 'Required';
      if (!form.emergencyContact.trim()) e.emergencyContact = 'Required';
    }
    if (step === 2) {
      if (!form.position) e.position = 'Please select a position';
      if (!form.legallyEligible) e.legallyEligible = 'Required';
    }
    if (step === 6) {
      if (!form.eSignature.trim()) e.eSignature = 'Please type your full name as your e-signature';
      if (!form.certifyTrue) e.certifyTrue = 'You must certify this information is true';
      if (!form.authorizeInvestigation) e.authorizeInvestigation = 'Required';
      if (!form.atWillAgreement) e.atWillAgreement = 'Required';
      if (!form.applicationPeriod) e.applicationPeriod = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) { setStep(s => s + 1); window.scrollTo(0, 0); } };
  const back = () => { setStep(s => s - 1); window.scrollTo(0, 0); };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setSubmitError('Submission failed. Please try again or call us at (978) 933-7131.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step - 1) / TOTAL) * 100;

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: font }}>
      <div style={{ background: C.surface, borderRadius: 20, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 26, color: C.primary, marginBottom: 12 }}>Application Submitted!</h2>
        <p style={{ color: C.textMid, lineHeight: 1.6, marginBottom: 20 }}>
          Thank you, <strong>{form.fullName}</strong>. We have received your application and our HR team will be in touch shortly.
        </p>
        <div style={{ background: C.primaryLight, borderRadius: 12, padding: '14px 16px', fontSize: 13, color: C.textMid }}>
          Questions? Call us at <strong style={{ color: C.primary }}>(978) 933-7131</strong> or email <strong style={{ color: C.primary }}>HR@allhourshomehealth.com</strong>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font }}>
      {/* Header */}
      <div style={{ background: C.primary, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>All Hours Home Healthcare</div>
              <div style={{ fontSize: 17, color: '#fff', fontWeight: 700 }}>Employment Application</div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Step {step} of {TOTAL}</div>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
            <div style={{ height: '100%', width: `${progress + (100 / TOTAL)}%`, background: C.accent, borderRadius: 999, transition: 'width 0.4s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {['Personal', 'Position', 'Background', 'Work History', 'References', 'Legal'].map((label, i) => (
              <div key={label} style={{ fontSize: 9, color: step > i ? C.accent : 'rgba(255,255,255,0.4)', fontWeight: step === i + 1 ? 700 : 400, textAlign: 'center', flex: 1 }}>{label}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 100px' }}>

        {/* STEP 1 — Personal Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, color: C.primary, marginBottom: 4 }}>Personal Information</h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24, lineHeight: 1.5 }}>All information is kept confidential.</p>

            <Field label="Full Name *" error={errors.fullName}>
              <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="First and last name" style={inputStyle} />
            </Field>
            <Field label="Present Address *" error={errors.address}>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, City, State, ZIP" style={inputStyle} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Phone Number *" error={errors.phone}>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(978) 000-0000" type="tel" style={inputStyle} />
              </Field>
              <Field label="Email *" error={errors.email}>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" type="email" style={inputStyle} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Date of Birth *" error={errors.dob}>
                <input value={form.dob} onChange={e => set('dob', e.target.value)} type="date" style={inputStyle} />
              </Field>
              <Field label="Social Security Number">
                <input value={form.ssn} onChange={e => set('ssn', e.target.value)} placeholder="XXX-XX-XXXX" style={inputStyle} />
              </Field>
            </div>
            <Field label="Emergency Contact — Name & Phone *" error={errors.emergencyContact}>
              <input value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} placeholder="Jane Doe — (978) 000-0000" style={inputStyle} />
            </Field>
          </div>
        )}

        {/* STEP 2 — Position & Availability */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, color: C.primary, marginBottom: 4 }}>Position & Availability</h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>Tell us about the role you're interested in.</p>

            <Field label="Are you legally eligible to work in the US? *" error={errors.legallyEligible}>
              {yesNo(form.legallyEligible, v => set('legallyEligible', v))}
            </Field>

            <Field label="Position Applying For *" error={errors.position}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {POSITIONS.map(p => <Pill key={p} label={p} selected={form.position === p} onClick={() => set('position', p)} />)}
              </div>
            </Field>

            {form.position?.includes('Therapist') && (
              <Field label="Type of Therapy">
                <input value={form.therapyType} onChange={e => set('therapyType', e.target.value)} placeholder="e.g. Physical, Occupational, Speech…" style={inputStyle} />
              </Field>
            )}

            <Field label="Credentials (select all that apply)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CREDENTIALS.map(c => <Pill key={c} label={c} selected={form.credentials.includes(c)} onClick={() => toggle('credentials', c)} />)}
              </div>
            </Field>

            <Field label="Salary Desired">
              <input value={form.salaryDesired} onChange={e => set('salaryDesired', e.target.value)} placeholder="e.g. $30/hr or open" style={inputStyle} />
            </Field>

            <Field label="Languages Fluent In (select all that apply)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {LANGUAGES.map(l => <Pill key={l} label={l} selected={form.languages.includes(l)} onClick={() => toggle('languages', l)} />)}
              </div>
            </Field>

            <Field label="Hours Available Per Week">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HOURS.map(h => <Pill key={h} label={h} selected={form.hoursPerWeek === h} onClick={() => set('hoursPerWeek', h)} />)}
              </div>
            </Field>

            <Field label="Willing to Work (select all that apply)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SHIFT_TYPES.map(s => <Pill key={s} label={s} selected={form.willingToWork.includes(s)} onClick={() => toggle('willingToWork', s)} />)}
              </div>
            </Field>

            <Field label="Days Available (select all that apply)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DAYS.map(d => <Pill key={d} label={d} selected={form.daysAvailable.includes(d)} onClick={() => toggle('daysAvailable', d)} />)}
              </div>
            </Field>

            <Field label="Office Skills (select all that apply)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {OFFICE_SKILLS.map(o => <Pill key={o} label={o} selected={form.officeSkills.includes(o)} onClick={() => toggle('officeSkills', o)} />)}
              </div>
            </Field>

            <Field label="How Did You Hear About Us?">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HOW_HEARD.map(h => <Pill key={h} label={h} selected={form.howDidYouHear === h} onClick={() => set('howDidYouHear', h)} />)}
              </div>
            </Field>

            <Field label="Have you applied to this agency before?">
              {yesNo(form.appliedBefore, v => set('appliedBefore', v))}
            </Field>
          </div>
        )}

        {/* STEP 3 — Background & Driving */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, color: C.primary, marginBottom: 4 }}>Background & Driving</h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>All responses are handled with confidentiality.</p>

            <Field label="Do you have a valid driver's license?">
              {yesNo(form.hasDriversLicense, v => set('hasDriversLicense', v))}
            </Field>

            {form.hasDriversLicense === 'Yes' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="License Number">
                    <input value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} placeholder="License #" style={inputStyle} />
                  </Field>
                  <Field label="State of Issue">
                    <input value={form.licenseState} onChange={e => set('licenseState', e.target.value)} placeholder="e.g. MA" style={inputStyle} />
                  </Field>
                </div>
                <Field label="License Type">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {LICENSE_TYPES.map(t => <Pill key={t} label={t} selected={form.licenseType === t} onClick={() => set('licenseType', t)} />)}
                  </div>
                </Field>
                <Field label="Accident History — Last 3 Years">
                  <textarea value={form.accidentHistory} onChange={e => set('accidentHistory', e.target.value)} rows={2} placeholder="Describe any accidents or 'None'" style={textareaStyle} />
                </Field>
              </>
            )}

            <Field label="Do you have reliable transportation?">
              {yesNo(form.reliableTransportation, v => set('reliableTransportation', v))}
            </Field>

            <Field label="Have you ever served in the Armed Forces?">
              {yesNo(form.armedForces, v => set('armedForces', v))}
            </Field>

            {form.armedForces === 'Yes' && (
              <>
                <Field label="Are you an active member of the National Guard?">
                  {yesNo(form.nationalGuard, v => set('nationalGuard', v))}
                </Field>
                <Field label="Specialty, date entered, and discharge date">
                  <textarea value={form.militaryDetails} onChange={e => set('militaryDetails', e.target.value)} rows={2} placeholder="Specialty, entered MM/YYYY, discharged MM/YYYY" style={textareaStyle} />
                </Field>
              </>
            )}

            <Field label="Have you been convicted of a crime in the past 5 years that would bar employment at a Home Care agency?">
              {yesNo(form.convicted, v => set('convicted', v))}
            </Field>
            {form.convicted === 'Yes' && (
              <Field label="Please describe in full (conviction will not necessarily disqualify you)">
                <textarea value={form.convictionDetails} onChange={e => set('convictionDetails', e.target.value)} rows={3} placeholder="Describe the conviction…" style={textareaStyle} />
              </Field>
            )}
          </div>
        )}

        {/* STEP 4 — Work History & Education */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 22, color: C.primary, marginBottom: 4 }}>Work History & Education</h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>List your most recent jobs first.</p>

            <Field label="Are you currently employed?">
              {yesNo(form.currentlyEmployed, v => set('currentlyEmployed', v))}
            </Field>
            {form.currentlyEmployed === 'Yes' && (
              <Field label="May we contact your current employer?">
                {yesNo(form.contactCurrentEmployer, v => set('contactCurrentEmployer', v))}
              </Field>
            )}

            <Field label="Highest Level of Education">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {EDUCATION.map(e => <Pill key={e} label={e} selected={form.education === e} onClick={() => set('education', e)} />)}
              </div>
            </Field>
            <Field label="Field of Study / Trade">
              <input value={form.fieldOfStudy} onChange={e => set('fieldOfStudy', e.target.value)} placeholder="e.g. Nursing, Medical Assisting…" style={inputStyle} />
            </Field>

            {[0, 1, 2].slice(0, jobCount).map(i => (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {i === 0 ? 'Most Recent Job' : `Previous Job ${i + 1}`}
                </div>
                <Field label="Company Name">
                  <input value={form.jobs[i].company} onChange={e => setJob(i, 'company', e.target.value)} placeholder="Company name" style={inputStyle} />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Company Phone">
                    <input value={form.jobs[i].phone} onChange={e => setJob(i, 'phone', e.target.value)} placeholder="Phone" style={inputStyle} />
                  </Field>
                  <Field label="Dates of Employment">
                    <input value={form.jobs[i].dates} onChange={e => setJob(i, 'dates', e.target.value)} placeholder="MM/YYYY – MM/YYYY" style={inputStyle} />
                  </Field>
                </div>
                <Field label="Company Address">
                  <input value={form.jobs[i].address} onChange={e => setJob(i, 'address', e.target.value)} placeholder="Street, City, State" style={inputStyle} />
                </Field>
                <Field label="Job Title">
                  <input value={form.jobs[i].title} onChange={e => setJob(i, 'title', e.target.value)} placeholder="Your role" style={inputStyle} />
                </Field>
                <Field label="Description of Work">
                  <textarea value={form.jobs[i].description} onChange={e => setJob(i, 'description', e.target.value)} rows={2} placeholder="Brief description of responsibilities…" style={textareaStyle} />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Starting Pay">
                    <input value={form.jobs[i].startingPay} onChange={e => setJob(i, 'startingPay', e.target.value)} placeholder="e.g. $25/hr" style={inputStyle} />
                  </Field>
                  <Field label="Reason for Leaving">
                    <input value={form.jobs[i].reasonLeaving} onChange={e => setJob(i, 'reasonLeaving', e.target.value)} placeholder="Reason" style={inputStyle} />
                  </Field>
                </div>
              </div>
            ))}

            {jobCount < 3 && (
              <button type="button" onClick={() => setJobCount(c => c + 1)} style={{
                width: '100%', padding: '12px', borderRadius: 12, border: `2px dashed ${C.border}`,
                background: 'transparent', color: C.primary, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: font, marginBottom: 16,
              }}>+ Add Another Job</button>
            )}

            <Field label="Was your last name different during any of the above jobs?">
              {yesNo(form.lastNameDifferent, v => set('lastNameDifferent', v))}
            </Field>
            {form.lastNameDifferent === 'Yes' && (
              <Field label="Previous Last Name">
                <input value={form.previousName} onChange={e => set('previousName', e.target.value)} placeholder="Previous last name" style={inputStyle} />
              </Field>
            )}
          </div>
        )}

        {/* STEP 5 — References & Licensing */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 22, color: C.primary, marginBottom: 4 }}>References & Licensing</h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>Professional references preferred.</p>

            {[0, 1, 2].slice(0, refCount).map(i => (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reference {i + 1}
                </div>
                <Field label="Name"><input value={form.references[i].name} onChange={e => setRef(i, 'name', e.target.value)} placeholder="Full name" style={inputStyle} /></Field>
                <Field label="Business / Address"><input value={form.references[i].address} onChange={e => setRef(i, 'address', e.target.value)} placeholder="Company or address" style={inputStyle} /></Field>
                <Field label="Phone / Fax"><input value={form.references[i].phone} onChange={e => setRef(i, 'phone', e.target.value)} placeholder="Phone number" style={inputStyle} /></Field>
              </div>
            ))}

            {refCount < 3 && (
              <button type="button" onClick={() => setRefCount(c => c + 1)} style={{
                width: '100%', padding: '12px', borderRadius: 12, border: `2px dashed ${C.border}`,
                background: 'transparent', color: C.primary, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: font, marginBottom: 16,
              }}>+ Add Another Reference</button>
            )}

            <Field label="Are you capable of performing the job as described?">
              {yesNo(form.capableOfJob, v => set('capableOfJob', v))}
            </Field>
            {form.capableOfJob === 'No' && (
              <Field label="Which job requirement can you not meet?">
                <textarea value={form.jobRequirementCantMeet} onChange={e => set('jobRequirementCantMeet', e.target.value)} rows={2} style={textareaStyle} />
              </Field>
            )}

            <Field label="State Nursing License(s) — List state, registration number, and expiration date">
              <textarea value={form.stateLicenses} onChange={e => set('stateLicenses', e.target.value)} rows={3} placeholder="e.g. MA — RN #123456 exp 06/2026&#10;NH — RN #789012 exp 12/2026" style={textareaStyle} />
            </Field>

            <Field label="Special Skills & Qualifications">
              <textarea value={form.specialSkills} onChange={e => set('specialSkills', e.target.value)} rows={3} placeholder="Summarize special skills and qualifications from employment or other experience…" style={textareaStyle} />
            </Field>
          </div>
        )}

        {/* STEP 6 — Legal & Signature */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize: 22, color: C.primary, marginBottom: 4 }}>Legal & E-Signature</h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>Please read and acknowledge each statement below.</p>

            {[
              { key: 'certifyTrue', text: 'I certify that the facts contained in this application are true and complete to the best of my knowledge, and understand that falsified statements shall be grounds for dismissal.', error: errors.certifyTrue },
              { key: 'authorizeInvestigation', text: 'I authorize complete investigation of all statements contained herein and give full permission for the Agency to contact all persons and entities listed to discuss my background and history.', error: errors.authorizeInvestigation },
              { key: 'atWillAgreement', text: 'I understand that if hired, my employment is for no definite period and may be terminated at any time for any lawful reason, without prior notice and with or without cause.', error: errors.atWillAgreement },
              { key: 'applicationPeriod', text: 'I understand this application is active for 45 days. If I wish to be considered beyond this period, I must reapply.', error: errors.applicationPeriod },
            ].map(({ key, text, error }) => (
              <div key={key} style={{ background: C.surface, border: `1px solid ${error ? C.high : C.border}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <button type="button" onClick={() => set(key, !form[key])} style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    border: `2px solid ${form[key] ? C.primary : C.border}`,
                    background: form[key] ? C.primary : C.surface,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {form[key] && <span style={{ color: '#fff', fontSize: 14 }}>✓</span>}
                  </button>
                  <span style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, fontFamily: font }}>{text}</span>
                </div>
                {error && <div style={{ fontSize: 12, color: C.high, marginTop: 6, paddingLeft: 36 }}>{error}</div>}
              </div>
            ))}

            <Field label="E-Signature — Type your full legal name *" error={errors.eSignature}>
              <input value={form.eSignature} onChange={e => set('eSignature', e.target.value)} placeholder="Your full legal name" style={{ ...inputStyle, fontStyle: 'italic', fontSize: 16 }} />
            </Field>

            <Field label="Confirm Your Email Address">
              <input value={form.confirmEmail} onChange={e => set('confirmEmail', e.target.value)} placeholder="Email address" type="email" style={inputStyle} />
            </Field>

            <div style={{ background: C.primaryLight, borderRadius: 12, padding: '12px 14px', fontSize: 12, color: C.textMid, marginBottom: 16, lineHeight: 1.6 }}>
              By submitting this form you attest that all information is true and correct, and you acknowledge you have read and understood all statements above.
            </div>

            {submitError && (
              <div style={{ background: C.highLight, border: `1px solid ${C.high}`, borderRadius: 10, padding: '12px 14px', fontSize: 13, color: C.high, marginBottom: 16 }}>
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          {step > 1 && (
            <button type="button" onClick={back} style={{
              flex: 1, padding: '15px', borderRadius: 14, border: `1px solid ${C.border}`,
              background: C.surface, color: C.textMid, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: font,
            }}>← Back</button>
          )}
          {step < TOTAL ? (
            <button type="button" onClick={next} style={{
              flex: 2, padding: '15px', borderRadius: 14, border: 'none',
              background: `linear-gradient(135deg, ${C.primary}, #2A5BA0)`,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: font,
              boxShadow: `0 4px 16px ${C.primary}40`,
            }}>Continue →</button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} style={{
              flex: 2, padding: '15px', borderRadius: 14, border: 'none',
              background: submitting ? C.border : `linear-gradient(135deg, ${C.accent}, #E8920A)`,
              color: submitting ? C.textLight : '#fff', fontSize: 15, fontWeight: 700,
              cursor: submitting ? 'wait' : 'pointer', fontFamily: font,
              boxShadow: submitting ? 'none' : `0 4px 16px ${C.accent}60`,
            }}>{submitting ? 'Submitting…' : '✅ Submit Application'}</button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: C.primary, padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
          All Hours Home Healthcare LLC · 17 Conant St Ste 213, Danvers, MA 01923<br />
          (978) 933-7131 · HR@allhourshomehealth.com
        </div>
      </div>
    </div>
  );
}