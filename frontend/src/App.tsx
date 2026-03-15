import { useEffect, useMemo, useState } from 'react'

type Highlight = { title: string; description: string; icon: string }

type ProfileResponse = {
  companyName: string
  headline: string
  subHeadline: string
  highlights: Highlight[]
  stats: string[]
  techStack: string[]
}

type ChatMessage = {
  author: 'bot' | 'user'
  text: string
}

type PageKey = 'home' | 'services' | 'work' | 'about' | 'contact'

type Service = {
  name: string
  short: string
  details: string
  deliverables: string[]
  icon: string
}

type Award = {
  title: string
  description: string
  image: string
}

const brandName = 'AuditIT'

const fallbackProfile: ProfileResponse = {
  companyName: brandName,
  headline: 'Trusted IT auditing for secure, compliant, and resilient businesses.',
  subHeadline: 'We help organizations reduce technology risk with modern audit frameworks, transparent reporting, and actionable recommendations.',
  highlights: [
    { title: 'Security Audits', description: 'Independent reviews of infrastructure, applications, and access controls.', icon: '🔒' },
    { title: 'Compliance Readiness', description: 'Preparation for ISO 27001, SOC 2, GDPR, and internal policy controls.', icon: '✅' },
    { title: 'Risk Intelligence', description: 'Prioritized risk register and remediation roadmap aligned with business impact.', icon: '📊' },
  ],
  stats: ['100,000+ users protected', '650+ advisory briefs', '125 cities supported'],
  techStack: ['NIST', 'ISO 27001', 'SOC 2', 'CIS Controls', 'Cloud Security', 'Zero Trust'],
}

const services: Service[] = [
  {
    name: 'Infrastructure & Cloud Audit',
    short: 'Assess cloud posture, network controls, and operational resilience.',
    details:
      'We evaluate architecture, identity and access, backup strategy, and monitoring controls to identify security and reliability gaps.',
    deliverables: ['Current-state control map', 'Risk-ranked findings', 'Remediation playbook', 'Executive summary deck'],
    icon: '☁️',
  },
  {
    name: 'Application Security Audit',
    short: 'Review web apps, APIs, SDLC controls, and release governance.',
    details:
      'Our auditors inspect authentication, authorization, secrets handling, logging, and deployment policies across your software lifecycle.',
    deliverables: ['Application control checklist', 'API threat findings', 'SDLC governance report', 'Developer action list'],
    icon: '🧪',
  },
  {
    name: 'Compliance & Policy Audit',
    short: 'Map technical controls to standards and regulatory obligations.',
    details:
      'We align your operating model with frameworks such as ISO 27001 and SOC 2 while producing audit-friendly evidence references.',
    deliverables: ['Control-to-framework matrix', 'Policy gap analysis', 'Evidence tracker template', 'Quarterly audit cadence plan'],
    icon: '📁',
  },
]

const awards: Award[] = [
  {
    title: 'ISO 27001 Lead Auditor Team',
    description: 'Certified lead auditors with enterprise-grade information security audit experience.',
    image: 'https://img.icons8.com/color/96/certificate.png',
  },
  {
    title: 'SOC 2 Readiness Specialist',
    description: 'Recognized methodology for building practical compliance programs for growing teams.',
    image: 'https://img.icons8.com/color/96/verified-account.png',
  },
  {
    title: 'Cloud Security Excellence 2025',
    description: 'Awarded for audit transformation outcomes across multi-cloud environments.',
    image: 'https://img.icons8.com/color/96/trophy.png',
  },
]

const caseStudies = [
  {
    title: 'Fintech Audit Program',
    impact: 'Critical findings reduced by 58%',
    summary: 'Structured controls and rapid remediation plan across application and cloud layers.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Healthcare Compliance Sprint',
    impact: 'Audit evidence time reduced by 41%',
    summary: 'Implemented governance templates and policy evidence mapping for recurring audits.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Enterprise Cloud Resilience Review',
    impact: '99.99% recovery readiness',
    summary: 'Validated backup, incident response, and access controls for business continuity.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
]

const contactFaqs = [
  {
    q: 'How long does an IT audit take?',
    a: 'Typical audits run from 2 to 6 weeks depending on scope, evidence availability, and stakeholder response times.',
  },
  {
    q: 'Do you work with startups and enterprise teams?',
    a: 'Yes. We tailor audit depth and reporting format for startup, scaleup, and enterprise governance needs.',
  },
  {
    q: 'Can you support remediation after the audit?',
    a: 'Absolutely. We provide practical remediation planning, owners, timelines, and revalidation checkpoints.',
  },
]

const quickReplies = ['Pricing', 'Timeline', 'Book a call']
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export default function App() {
  const [profile, setProfile] = useState<ProfileResponse>(fallbackProfile)
  const [activePage, setActivePage] = useState<PageKey>('home')
  const [activeService, setActiveService] = useState<number>(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { author: 'bot', text: 'Hi 👋 I can help with AuditIT pricing, timelines, and compliance packages.' },
  ])
  const [chatInput, setChatInput] = useState('')
  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load profile'))))
      .then((data: ProfileResponse) =>
        setProfile({
          ...fallbackProfile,
          ...data,
          companyName: brandName,
        }),
      )
      .catch(() => setProfile(fallbackProfile))
  }, [])

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message }),
      })

      if (!res.ok) {
        throw new Error('Unable to submit')
      }

      const data: { message: string } = await res.json()
      setNotice(data.message)
      setName('')
      setEmail('')
      setCompany('')
      setMessage('')
    } catch {
      setNotice('Request failed. Please email hello@auditit.io directly.')
    }
  }

  const craftBotReply = (input: string): string => {
    const text = input.toLowerCase()
    if (text.includes('price') || text.includes('cost')) {
      return 'Audit packages start from $4,000 depending on systems, locations, and compliance scope.'
    }
    if (text.includes('timeline') || text.includes('time')) {
      return 'Most audits are delivered in 2-6 weeks with staged reporting and clear remediation milestones.'
    }
    if (text.includes('call') || text.includes('book')) {
      return 'Great — use the contact section and mention “Discovery Call” and we will confirm slots in 24 hours.'
    }
    return 'We can tailor an IT audit plan around security, compliance, and governance priorities.'
  }

  const sendChat = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return
    setChatMessages((prev) => [...prev, { author: 'user', text: trimmed }, { author: 'bot', text: craftBotReply(trimmed) }])
    setChatInput('')
  }

  const sendQuickReply = (reply: string) => {
    setChatMessages((prev) => [...prev, { author: 'user', text: reply }, { author: 'bot', text: craftBotReply(reply) }])
  }

  const renderHomePage = () => (
    <>
      <section className="hero-split">
        <div className="hero-left">
          <p className="eyebrow">IT AUDITING COMPANY</p>
          <h1>{profile.headline}</h1>
          <p>{profile.subHeadline}</p>
          <div className="chips">
            {profile.stats.map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
        </div>
        <div className="hero-right">
          <img src="/audit-vault.svg" alt="AuditIT abstract vault illustration" />
        </div>
      </section>

      <section className="section white-card-grid">
        {profile.highlights.map((item) => (
          <article key={item.title} className="white-card">
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </>
  )

  const renderServicesPage = () => (
    <section className="section services-layout">
      <div className="service-list">
        {services.map((service, idx) => (
          <button
            type="button"
            key={service.name}
            className={`service-tile ${activeService === idx ? 'active' : ''}`}
            onClick={() => setActiveService(idx)}
          >
            <span>{service.icon}</span>
            <div>
              <h3>{service.name}</h3>
              <p>{service.short}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="services-right-column">
        <article className="white-card service-detail">
          <h2>{services[activeService].name}</h2>
          <p>{services[activeService].details}</p>
          <ul>
            {services[activeService].deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="white-card awards-block">
          <h2>Certifications & Awards</h2>
          <div className="awards-grid">
            {awards.map((award) => (
              <div key={award.title} className="award-item">
                <img src={award.image} alt={award.title} />
                <div>
                  <h3>{award.title}</h3>
                  <p>{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )

  const renderWorkPage = () => (
    <section className="section case-grid">
      {caseStudies.map((item) => (
        <article className="white-card case" key={item.title}>
          <img src={item.image} alt={item.title} />
          <p className="impact">{item.impact}</p>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </article>
      ))}
    </section>
  )

  const renderAboutPage = () => (
    <section className="section about-columns">
      <article className="about-col dark">
        <h2>About AuditIT</h2>
        <p>
          AuditIT is an independent IT auditing company focused on strengthening security, compliance, and operational trust for modern organizations.
        </p>
      </article>
      <article className="about-col blue">
        <h2>How we work</h2>
        <p>Scope → evidence review → risk ranking → executive briefing → remediation roadmap.</p>
        <img src="/audit-grid.svg" alt="Audit matrix illustration" />
      </article>
      <article className="about-col light">
        <h2>Our framework</h2>
        <p>We blend NIST, ISO 27001, SOC 2, and practical engineering constraints to provide actionable audits, not just checklists.</p>
        <div className="stack-list">
          {profile.techStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </article>
    </section>
  )

  const renderContactPage = () => (
    <section className="section contact-mix-grid">
      <article className="white-card contact-panel">
        <h2>Contact AuditIT</h2>
        <p>Share your environment details and we’ll recommend the right audit scope.</p>
        <p>
          <strong>Email:</strong> hello@auditit.io
        </p>
        <p>
          <strong>Coverage:</strong> Remote + Global
        </p>

        <form onSubmit={submitForm} className="contact-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required minLength={2} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Work email" required />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required minLength={2} />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Audit goals and systems in scope" required minLength={15} rows={5} />
          <button type="submit">Send audit request</button>
          {notice && <p className="notice">{notice}</p>}
        </form>
      </article>

      <article className="white-card faq-panel">
        <h2>Frequently asked questions</h2>
        {contactFaqs.map((item) => (
          <div key={item.q} className="faq-item open">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </article>
    </section>
  )

  return (
    <div className="page">
      <header className="top-nav">
        <div className="brand">
          <span className="logo-mark" aria-hidden="true">
            ◢◤
          </span>
          <strong>{brandName}</strong>
        </div>
        <nav>
          {(['home', 'services', 'work', 'about', 'contact'] as PageKey[]).map((item) => (
            <button key={item} type="button" className={activePage === item ? 'active' : ''} onClick={() => setActivePage(item)}>
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {activePage === 'home' && renderHomePage()}
        {activePage === 'services' && renderServicesPage()}
        {activePage === 'work' && renderWorkPage()}
        {activePage === 'about' && renderAboutPage()}
        {activePage === 'contact' && renderContactPage()}

        <section className="section chat-section">
          <div className="chat-intro">
            <p className="eyebrow">Chat with us</p>
            <h2>Need quick answers?</h2>
            <p>Ask about scope, price, and timelines for your audit cycle.</p>
          </div>

          <div className="chat-widget" role="region" aria-label="Chat with AuditIT">
            <div className="chat-header">
              <div>
                <strong>AuditIT Concierge</strong>
                <p>Online now • response within minutes</p>
              </div>
              <span className="online-dot" />
            </div>

            <div className="quick-replies">
              {quickReplies.map((reply) => (
                <button type="button" key={reply} onClick={() => sendQuickReply(reply)}>
                  {reply}
                </button>
              ))}
            </div>

            <div className="chat-log" aria-live="polite">
              {chatMessages.map((entry, idx) => (
                <p key={`${entry.author}-${idx}`} className={`bubble ${entry.author}`}>
                  {entry.text}
                </p>
              ))}
            </div>

            <form className="chat-form" onSubmit={sendChat}>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type your question..." aria-label="Type your message" />
              <button type="submit">Send</button>
            </form>
          </div>
        </section>
      </main>

      <footer>© {year} {brandName}. Independent IT auditing and risk assurance.</footer>
    </div>
  )
}