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

const fallbackProfile: ProfileResponse = {
  companyName: 'NovaForge Labs',
  headline: 'Enterprise-grade IT products with unforgettable design.',
  subHeadline: 'We help ambitious businesses build secure, scalable and premium digital experiences.',
  highlights: [
    { title: 'Cloud Engineering', description: 'Resilient cloud-native architecture with observability-first delivery.', icon: '☁️' },
    { title: 'Product Design', description: 'High-converting UX/UI systems for web and mobile products.', icon: '🎨' },
    { title: 'AI Automation', description: 'Smart automation that cuts process time and boosts team efficiency.', icon: '🤖' },
  ],
  stats: ['150+ enterprise launches', '24/7 monitoring', '30+ engineers'],
  techStack: ['Spring Boot', 'TypeScript', 'React', 'Kubernetes', 'AWS', 'PostgreSQL'],
}

const services: Service[] = [
  {
    name: 'Custom Software Development',
    short: 'Build modern software products tailored to your business goals.',
    details:
      'From architecture planning to production deployment, we deliver secure software with clean code standards and long-term maintainability.',
    deliverables: ['Discovery workshop', 'Architecture blueprint', 'CI/CD setup', 'Production rollout'],
    icon: '🧩',
  },
  {
    name: 'Managed Cloud & DevOps',
    short: 'Scale safely with optimized infrastructure and reliable delivery pipelines.',
    details:
      'We set up IaC, autoscaling, cost-optimization, and observability so your platform remains fast, stable, and easy to operate.',
    deliverables: ['Kubernetes ops', 'Infrastructure as Code', 'Performance audits', 'SLA reporting'],
    icon: '🚀',
  },
  {
    name: 'Cybersecurity Consulting',
    short: 'Protect apps and infrastructure with modern security practices.',
    details:
      'We assess vulnerabilities, secure APIs, enforce zero-trust principles, and establish practical security workflows for engineering teams.',
    deliverables: ['Security assessment', 'Pen-test support', 'Threat modeling', 'Compliance guidance'],
    icon: '🛡️',
  },
]

const caseStudies = [
  { title: 'Fintech Revamp', impact: '+42% faster onboarding', summary: 'Rebuilt a legacy banking portal with microservices and a modern UI.' },
  { title: 'Logistics Platform', impact: '-31% operational cost', summary: 'Implemented route optimization dashboard and real-time fleet insights.' },
  { title: 'Health Portal', impact: '99.98% uptime', summary: 'Migrated critical healthcare workflows to a secure cloud architecture.' },
]

const faqs = [
  {
    q: 'How soon can we start?',
    a: 'Most projects start within 1-2 weeks after discovery and alignment on scope.',
  },
  {
    q: 'Do you handle design and development?',
    a: 'Yes. We provide end-to-end support from product strategy and UX to development and launch.',
  },
  {
    q: 'Can you work with our existing team?',
    a: 'Absolutely. We can augment your team, own a full delivery stream, or run hybrid collaboration.',
  },
]

const quickReplies = ['Pricing', 'Project timeline', 'Book a call']
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export default function App() {
  const [profile, setProfile] = useState<ProfileResponse>(fallbackProfile)
  const [activePage, setActivePage] = useState<PageKey>('home')
  const [activeService, setActiveService] = useState<number>(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { author: 'bot', text: 'Hi 👋 I am Nova. Ask me about pricing, timeline, or how our IT services work.' },
  ])
  const [chatInput, setChatInput] = useState('')
  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load profile'))))
      .then((data: ProfileResponse) => setProfile(data))
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
      setNotice('Request failed. Please email hello@novaforge.io directly.')
    }
  }

  const craftBotReply = (input: string): string => {
    const text = input.toLowerCase()
    if (text.includes('price') || text.includes('cost')) {
      return 'Typical projects start at $10k. We can tailor a fixed scope or a sprint-based monthly model.'
    }
    if (text.includes('timeline') || text.includes('time') || text.includes('deadline')) {
      return 'Most products launch in 4-10 weeks depending on complexity. We also offer accelerated MVP tracks.'
    }
    if (text.includes('call') || text.includes('meeting') || text.includes('book')) {
      return 'Perfect. Fill the Contact page and mention “Discovery Call”; we will send available slots within one business day.'
    }
    return 'Great question. We usually start with a discovery workshop, then provide architecture + delivery roadmap.'
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
      <section className="hero">
        <p className="eyebrow">IT company website</p>
        <h1>{profile.headline}</h1>
        <p>{profile.subHeadline}</p>
        <div className="chips">
          {profile.stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </div>
      </section>

      <section className="section card-grid">
        {profile.highlights.map((item) => (
          <article key={item.title} className="glass-card">
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

      <article className="service-detail glass-card">
        <h2>{services[activeService].name}</h2>
        <p>{services[activeService].details}</p>
        <ul>
          {services[activeService].deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  )

  const renderWorkPage = () => (
    <section className="section card-grid">
      {caseStudies.map((item) => (
        <article className="glass-card case" key={item.title}>
          <p className="impact">{item.impact}</p>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </article>
      ))}
    </section>
  )

  const renderAboutPage = () => (
    <section className="section about-grid">
      <article className="glass-card">
        <h2>Why teams choose NovaForge</h2>
        <p>
          We are a product-minded IT partner focused on long-term quality, transparent communication, and measurable business impact.
        </p>
        <div className="stack-list">
          {profile.techStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </article>

      <article className="glass-card faq">
        <h2>Frequently asked questions</h2>
        {faqs.map((item, idx) => (
          <div key={item.q} className="faq-item">
            <button type="button" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              {item.q}
            </button>
            {openFaq === idx && <p>{item.a}</p>}
          </div>
        ))}
      </article>
    </section>
  )

  const renderContactPage = () => (
    <section className="section contact-grid">
      <article className="glass-card">
        <h2>Contact us</h2>
        <p>Tell us about your idea, your current challenges, and your target launch date.</p>
        <p><strong>Email:</strong> hello@novaforge.io</p>
        <p><strong>Office:</strong> London • Dubai • Remote</p>
      </article>

      <form onSubmit={submitForm} className="contact-form">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required minLength={2} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Work email" required />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required minLength={2} />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Project details" required minLength={15} rows={5} />
        <button type="submit">Send message</button>
        {notice && <p className="notice">{notice}</p>}
      </form>
    </section>
  )

  return (
    <div className="page">
      <header className="top-nav">
        <strong>{profile.companyName}</strong>
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
            <p>Use our live assistant to instantly get details about pricing, timeline, and engagement models.</p>
          </div>

          <div className="chat-widget" role="region" aria-label="Chat with NovaForge Labs">
            <div className="chat-header">
              <div>
                <strong>Nova Live Concierge</strong>
                <p>Online now • quick response</p>
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

      <footer>© {year} {profile.companyName}. Spring Boot + TypeScript enterprise website starter.</footer>
    </div>
  )
}