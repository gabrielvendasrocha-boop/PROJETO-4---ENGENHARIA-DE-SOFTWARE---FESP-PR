// ============================================================================
// IMPORTAÇÕES E ÍCONES
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Heart,
  Home,
  Info,
  Lock,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  Users,
  Volume2,
  X
} from 'lucide-react'
import { askGemini } from './services/gemini'

// ============================================================================
// TIPOS E ESTRUTURAS DE DADOS
// ============================================================================
type Section = 'inicio' | 'conversa' | 'trilhas' | 'sobre' | 'configuracoes' | 'ajuda'

type Message = {
  id: string
  role: 'assistant' | 'user'
  text: string
  isStreaming?: boolean
}

type Lesson = {
  id: string
  title: string
  description: string
  level: string
  icon: typeof Smartphone
  steps: string[]
}

// Tipos para suporte ao reconhecimento de voz do navegador
type SpeechRecognitionResultLike = {
  0: { transcript: string }
  isFinal: boolean
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike
  webkitSpeechRecognition?: new () => SpeechRecognitionLike
}

// ============================================================================
// CONTEÚDO ESTÁTICO (TRILHAS E MENU)
// ============================================================================
const lessons: Lesson[] = [
  {
    id: '01',
    title: 'Aprendendo a usar o celular',
    description: 'Conheça os botões, ajuste o volume e aumente o tamanho das letras.',
    level: 'Iniciante',
    icon: Smartphone,
    steps: [
      'Localize o botão de ligar e desligar e pressione-o brevemente para acender a tela.',
      'Use os botões laterais para aumentar ou diminuir o volume.',
      'Abra as configurações do aparelho e procure “Tela” ou “Acessibilidade” para ajustar o tamanho do texto.',
      'Pratique com calma. Os nomes dos menus podem variar conforme o modelo do celular.'
    ]
  },
  {
    id: '02',
    title: 'Conversando com assistentes digitais',
    description: 'Descubra como fazer perguntas e pedir explicações.',
    level: 'Iniciante',
    icon: MessageCircle,
    steps: [
      'Diga ou escreva sua dúvida usando palavras simples.',
      'Explique o contexto quando a resposta não for suficiente.',
      'Peça para explicar de outra forma ou dividir a tarefa em etapas.',
      'Confira informações importantes em fontes confiáveis: uma resposta automática pode conter erros.'
    ]
  },
  {
    id: '03',
    title: 'Mensagens e videochamadas',
    description: 'Aprenda os conceitos básicos para se comunicar com quem você gosta.',
    level: 'Intermediário',
    icon: Users,
    steps: [
      'Abra o aplicativo de mensagens que você já utiliza.',
      'Escolha um contato conhecido e confira o nome antes de enviar.',
      'Escreva uma mensagem curta e toque em enviar.',
      'Para uma chamada de vídeo, procure o ícone de câmera e confirme que deseja iniciar a chamada.'
    ]
  },
  {
    id: '04',
    title: 'Segurança na internet',
    description: 'Reconheça mensagens suspeitas e proteja seus dados.',
    level: 'Importante',
    icon: Lock,
    steps: [
      'Não compartilhe senhas, códigos recebidos por SMS ou dados bancários.',
      'Desconfie de mensagens com urgência, prêmios inesperados ou pedidos de dinheiro.',
      'Não abra links inesperados; confirme com a pessoa por outro canal conhecido.',
      'Se suspeitar de golpe, interrompa a conversa e peça orientação a alguém de confiança ou ao seu banco por um canal oficial.'
    ]
  }
]

const navItems: { id: Section; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'conversa', label: 'Conversar com a IA', icon: MessageCircle },
  { id: 'trilhas', label: 'Trilhas de Sucesso', icon: BookOpen },
  { id: 'sobre', label: 'Sobre a IA', icon: Info },
  { id: 'configuracoes', label: 'Acessibilidade', icon: Accessibility },
  { id: 'ajuda', label: 'Ajuda / Socorro', icon: CircleHelp }
]

// ============================================================================
// FORMATADOR DE TEXTO ESTILO GEMINI (TEXTO LIMPO DIRETO NO CANVAS, SEM CAIXAS)
// ============================================================================
function FormattedMessage({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
  // Trata markdown inline (**negrito**, *itálico* e `código`), inclusive durante o streaming
  const parseInline = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={index}>{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={index} className="gemini-inline-code">
            {part.slice(1, -1)}
          </code>
        )
      }
      return part.replace(/\*\*/g, '')
    })
  }

  const lines = text.split('\n')

  return (
    <div className={`gemini-response-prose ${isStreaming ? 'is-streaming' : ''}`}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim()
        const isLastLine = index === lines.length - 1

        if (!line) {
          return <div key={index} className="gemini-spacer" />
        }

        // Reconhece passos numerados no estilo Gemini ("1. Texto...")
        const stepMatch = line.match(/^(\d+)[\.\)]\s*(.*)/)
        if (stepMatch) {
          return (
            <div key={index} className="gemini-list-item numbered">
              <span className="gemini-list-num">{stepMatch[1]}.</span>
              <div className="gemini-list-body">
                {parseInline(stepMatch[2])}
                {isStreaming && isLastLine && <span className="stream-cursor" />}
              </div>
            </div>
          )
        }

        // Reconhece sub-itens ou marcadores (ex: "- Item", "• Item", "* Item")
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ') || line.startsWith('o ')) {
          return (
            <div key={index} className="gemini-list-item bulleted">
              <span className="gemini-list-bullet">◦</span>
              <div className="gemini-list-body">
                {parseInline(line.slice(2))}
                {isStreaming && isLastLine && <span className="stream-cursor" />}
              </div>
            </div>
          )
        }

        return (
          <p key={index} className="gemini-paragraph">
            {parseInline(line)}
            {isStreaming && isLastLine && <span className="stream-cursor" />}
          </p>
        )
      })}
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function App() {
  // Estados de navegação e perfil do usuário
  const [section, setSection] = useState<Section>('inicio')
  const [name, setName] = useState('Amigo(a)')
  const [nameInput, setNameInput] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)

  // Estados do chat e assistente virtual (sem mensagem padrão fixa)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<'Ocioso' | 'Ouvindo' | 'Processando' | 'Resposta'>('Ocioso')
  const [helpMessage, setHelpMessage] = useState('')

  // Estados de acessibilidade e trilhas
  const [fontScale, setFontScale] = useState(1)
  const [highContrast, setHighContrast] = useState(false)
  const [speechRate, setSpeechRate] = useState('normal')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  // Título dinâmico da seção atual
  const title = useMemo(
    () => navItems.find(item => item.id === section)?.label ?? 'Início',
    [section]
  )

  // Verifica se há mensagens enviadas pelo usuário
  const hasUserMessages = messages.length > 0

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (section === 'conversa' && hasUserMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, status, section, hasUserMessages])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
    }
  }, [])

  // Limpa a conversa e volta ao estado inicial centralizado
  function resetConversation() {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
    setMessages([])
    setMessageInput('')
    setStatus('Ocioso')
  }

  // --------------------------------------------------------------------------
  // FUNÇÕES DE NAVEGAÇÃO E INTERAÇÃO
  // --------------------------------------------------------------------------

  // Troca de tela e fecha o menu lateral no celular
  function navigate(next: Section) {
    setSection(next)
    setMobileMenu(false)
  }

  // Envia mensagem do usuário e revela a resposta aos poucos em tempo real (estilo Gemini)
  async function sendMessage(text = messageInput) {
    const clean = text.trim()
    if (!clean || status === 'Processando') return

    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: clean
    }

    const assistantId = `ai-${Date.now() + 1}`
    const placeholderAiMsg: Message = {
      id: assistantId,
      role: 'assistant',
      text: '',
      isStreaming: true
    }

    const historySnapshot = messages.map(m => ({ role: m.role, text: m.text }))

    setMessages(prev => [...prev, userMsg, placeholderAiMsg])
    setMessageInput('')
    setStatus('Processando')

    let targetText = ''
    let displayedLength = 0
    let streamFinished = false

    const startSmoothReveal = () => {
      if (typingTimerRef.current) return

      typingTimerRef.current = window.setInterval(() => {
        if (displayedLength < targetText.length) {
          const remaining = targetText.length - displayedLength
          const step = Math.max(2, Math.min(6, Math.ceil(remaining * 0.14)))
          displayedLength = Math.min(targetText.length, displayedLength + step)
          const currentSlice = targetText.slice(0, displayedLength)

          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, text: currentSlice, isStreaming: true }
                : m
            )
          )
        } else if (streamFinished) {
          if (typingTimerRef.current) {
            window.clearInterval(typingTimerRef.current)
            typingTimerRef.current = null
          }
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, text: targetText, isStreaming: false }
                : m
            )
          )
          setStatus('Ocioso')
        }
      }, 18)
    }

    try {
      const finalResponse = await askGemini(historySnapshot, clean, name, partial => {
        targetText = partial
        startSmoothReveal()
      })

      targetText = finalResponse
      streamFinished = true
      startSmoothReveal()
    } catch {
      targetText =
        'Tive uma pequena oscilação na conexão, mas estou aqui. Poderia repetir sua pergunta com calma?'
      streamFinished = true
      startSmoothReveal()
    }
  }

  // Captura voz do microfone e transforma em texto
  function startVoiceRecognition() {
    const speechWindow = window as SpeechWindow
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition

    if (!Recognition) {
      setHelpMessage(
        'O reconhecimento de voz não está disponível neste navegador. Você pode digitar sua pergunta normalmente. Em alguns navegadores, a função também exige conexão segura (HTTPS).'
      )
      return
    }

    setHelpMessage('')
    const recognition = new Recognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = event => {
      const transcript = event.results[event.resultIndex]?.[0]?.transcript?.trim()
      if (transcript) {
        setMessageInput(transcript)
        setStatus('Ocioso')
      }
    }

    recognition.onerror = event => {
      setStatus('Ocioso')
      const errorMessages: Record<string, string> = {
        'not-allowed':
          'O microfone foi bloqueado. Permita o acesso ao microfone nas configurações do navegador ou digite sua pergunta.',
        'no-speech': 'Não identificamos fala. Tente novamente ou digite sua pergunta.',
        'audio-capture':
          'Não foi possível acessar um microfone. Verifique o dispositivo ou digite sua pergunta.'
      }
      setHelpMessage(
        errorMessages[event.error] ??
          'Não foi possível reconhecer a fala. Tente novamente ou digite sua pergunta.'
      )
    }

    recognition.onend = () => setStatus('Ocioso')

    try {
      setStatus('Ouvindo')
      recognition.start()
    } catch {
      setStatus('Ocioso')
      setHelpMessage(
        'Não foi possível iniciar o microfone agora. Tente novamente em alguns instantes.'
      )
    }
  }

  // Lê um texto em voz alta usando a síntese de voz do navegador
  function speak(text: string) {
    if (!('speechSynthesis' in window)) {
      setHelpMessage('A leitura em voz alta não está disponível neste navegador.')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = speechRate === 'lenta' ? 0.8 : speechRate === 'rapida' ? 1.15 : 0.95
    window.speechSynthesis.speak(utterance)
  }

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO DA INTERFACE
  // --------------------------------------------------------------------------
  return (
    <div
      className={highContrast ? 'app high-contrast' : 'app'}
      style={{ zoom: fontScale } as React.CSSProperties}
    >
      {/* CABEÇALHO SUPERIOR */}
      <header className="topbar">
        <button
          className="mobile-menu icon-button"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Abrir menu"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <button
          className="brand"
          onClick={() => navigate('inicio')}
          aria-label="Conecta IA, ir para início"
        >
          <span className="brand-mark" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="12 10 216 200"
              className="brand-logo-svg"
            >
              {/* Coração Externo (Lado Esquerdo Verde Profundo #135340) */}
              <path
                d="M 120,44 C 95,4 18,8 18,82 C 18,136 75,168 120,204 C 165,168 222,136 222,82 C 222,8 145,4 120,44 Z"
                fill="#135340"
              />

              {/* Coração Externo (Lado Direito Verde Conexão #2E856E com dobra sutil na ponta inferior) */}
              <path
                d="M 120,44 C 145,4 222,8 222,82 C 222,136 165,168 120,204 C 115,200 112,194 115,186 L 120,44 Z"
                fill="#2E856E"
              />

              {/* Coração Interno Deslocado (Preenchimento Menta Claro #E2F4EE) */}
              <path
                d="M 122,62 C 144,26 202,34 202,89 C 202,130 159,156 121,184 C 96,163 82,136 88,98 C 92,74 108,67 122,62 Z"
                fill="#E2F4EE"
              />

              {/* Halo / Recorte Menta (#E2F4EE) ao redor dos nós esquerdos */}
              <g
                stroke="#E2F4EE"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <line x1="115" y1="68" x2="73" y2="93" />
                <line x1="73" y1="93" x2="96" y2="148" />
                <line x1="115" y1="68" x2="96" y2="148" />
                <circle cx="115" cy="68" r="7.5" fill="#E2F4EE" />
                <circle cx="73" cy="93" r="7.5" fill="#E2F4EE" />
                <circle cx="96" cy="148" r="7.5" fill="#E2F4EE" />
              </g>

              {/* Malha / Constelação da Rede de Inteligência Artificial (#2E856E) */}
              <g
                stroke="#2E856E"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <polygon points="115,68 168,85 156,128 96,148 73,93" />
                <line x1="115" y1="68" x2="96" y2="148" />
                <line x1="115" y1="68" x2="156" y2="128" />
                <line x1="73" y1="93" x2="156" y2="128" />
              </g>

              {/* Nós (Círculos) da Constelação IA */}
              <g fill="#2E856E">
                <circle cx="115" cy="68" r="11.5" />
                <circle cx="73" cy="93" r="11.5" />
                <circle cx="96" cy="148" r="11.5" />
                <circle cx="168" cy="85" r="10.5" />
                <circle cx="156" cy="128" r="11.5" />
              </g>
            </svg>
          </span>
          <span className="brand-copy">
            <strong className="brand-wordmark">
              <span className="brand-conecta">Conecta </span>
              <span className="brand-ia">IA</span>
            </strong>
            <small>Tecnologia mais humana</small>
          </span>
        </button>

        <div className="topbar-right">
          <span className="status-pill">
            <span className="status-dot" /> Ambiente de demonstração
          </span>
          <button
            className="profile"
            onClick={() => setShowWelcome(true)}
            aria-label="Editar perfil"
          >
            <span className="avatar">
              <UserRound size={18} />
            </span>
            <span>Olá, {name}</span>
          </button>
        </div>
      </header>

      <div className="layout">
        {/* MENU LATERAL */}
        <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
          <p className="nav-caption">MENU PRINCIPAL</p>

          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item ${section === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={21} />
                <span>{item.label}</span>
                {section === item.id && <ChevronRight size={18} className="nav-chevron" />}
              </button>
            )
          })}

          <div className="sidebar-help">
            <div className="help-icon">
              <Heart size={22} />
            </div>
            <strong>Você não está só.</strong>
            <p>Estamos aqui para ajudar você a descobrir a tecnologia no seu ritmo.</p>
            <button className="text-button" onClick={() => navigate('ajuda')}>
              Preciso de ajuda <ArrowRight size={16} />
            </button>
          </div>

          <div className="sidebar-footer">
            Feito com carinho <Heart size={13} fill="currentColor" />
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className={`main-content ${section === 'conversa' ? 'in-chat' : ''}`}>
          {/* Título da página e atalho de acessibilidade (oculto no modo conversa imersivo) */}
          {section !== 'conversa' && (
            <div className="page-heading">
              <div>
                <span className="eyebrow">CONECTANDO PESSOAS</span>
                <h1>{title}</h1>
              </div>
              <button className="access-shortcut" onClick={() => navigate('configuracoes')}>
                <Accessibility size={19} /> Ajustar leitura
              </button>
            </div>
          )}

          {/* SEÇÃO: INÍCIO */}
          {section === 'inicio' && (
            <section className="page-body">
              <div className="hero">
                <div className="hero-copy">
                  <span className="hero-label">
                    <Sparkles size={16} /> UM JEITO SIMPLES DE APRENDER
                  </span>
                  <h2>
                    Olá, {name}!<br />
                    <span>A tecnologia pode ser mais fácil.</span>
                  </h2>
                  <p>
                    Explore, pergunte e aprenda no seu ritmo. Estou aqui para ajudar você, um
                    passo de cada vez.
                  </p>
                  <button className="primary-button" onClick={() => navigate('conversa')}>
                    Vamos conversar <ArrowRight size={19} />
                  </button>
                </div>

                <div className="hero-art" aria-hidden="true">
                  <svg
                    viewBox="0 0 320 200"
                    className="hero-svg-art"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Sol suave ao fundo */}
                    <circle cx="215" cy="100" r="78" fill="#fdeecf" />
                    <circle cx="215" cy="100" r="60" fill="#fae2b8" opacity="0.6" />

                    {/* Folhagens decorativas na lateral */}
                    <path
                      d="M 50 200 Q 55 155 75 145 Q 65 175 60 200"
                      fill="#7fae91"
                      opacity="0.85"
                    />
                    <path
                      d="M 70 200 Q 78 165 98 160 Q 88 185 80 200"
                      fill="#6b9e80"
                      opacity="0.9"
                    />

                    {/* Corpo e Suéter */}
                    <path
                      d="M 135 200 C 135 155, 170 138, 215 138 C 260 138, 295 155, 295 200 Z"
                      fill="#387a67"
                    />
                    {/* Gola da camisa */}
                    <path
                      d="M 199 138 L 215 152 L 231 138"
                      stroke="#ffffff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Pescoço */}
                    <rect x="203" y="118" width="24" height="22" rx="4" fill="#f4b288" />

                    {/* Rosto */}
                    <ellipse cx="215" cy="95" rx="32" ry="35" fill="#ffc29b" />

                    {/* Orelhas */}
                    <circle cx="181" cy="98" r="6" fill="#ffc29b" />
                    <circle cx="249" cy="98" r="6" fill="#ffc29b" />

                    {/* Cabelo acolhedor */}
                    <path
                      d="M 179 88 C 177 56, 201 44, 215 44 C 238 44, 252 56, 250 88 C 244 74, 234 66, 215 66 C 196 66, 185 74, 179 88 Z"
                      fill="#81918a"
                    />

                    {/* Sobrancelhas */}
                    <path
                      d="M 193 83 Q 200 79 207 82"
                      stroke="#566862"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 223 82 Q 230 79 237 83"
                      stroke="#566862"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Óculos amigáveis */}
                    <rect
                      x="190"
                      y="86"
                      width="21"
                      height="17"
                      rx="6"
                      fill="#ffffff30"
                      stroke="#176b5b"
                      strokeWidth="2.6"
                    />
                    <rect
                      x="219"
                      y="86"
                      width="21"
                      height="17"
                      rx="6"
                      fill="#ffffff30"
                      stroke="#176b5b"
                      strokeWidth="2.6"
                    />
                    <line
                      x1="211"
                      y1="94"
                      x2="219"
                      y2="94"
                      stroke="#176b5b"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />

                    {/* Olhos sorridentes */}
                    <path
                      d="M 195 94 Q 200 90 206 94"
                      stroke="#1e3a32"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 224 94 Q 229 90 235 94"
                      stroke="#1e3a32"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Nariz simpático */}
                    <path
                      d="M 215 97 Q 217 104 213 106"
                      stroke="#d8966e"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    {/* Bochechas coradas */}
                    <ellipse cx="191" cy="103" rx="5" ry="3" fill="#f98972" opacity="0.45" />
                    <ellipse cx="239" cy="103" rx="5" ry="3" fill="#f98972" opacity="0.45" />

                    {/* Sorriso acolhedor */}
                    <path
                      d="M 205 112 Q 215 120 225 112"
                      stroke="#a43e2f"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="chat-float">
                    Olá! Como posso ajudar? <Heart size={14} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="section-title">
                <div>
                  <h2>Por onde você quer começar?</h2>
                  <p>Escolha uma opção para explorar.</p>
                </div>
              </div>

              <div className="feature-grid">
                <button className="feature-card card-mint" onClick={() => navigate('conversa')}>
                  <span className="feature-icon">
                    <MessageCircle />
                  </span>
                  <strong>Conversar com a IA</strong>
                  <p>Faça perguntas usando palavras simples ou experimente a conversa por voz.</p>
                  <span className="card-link">
                    Começar conversa <ArrowRight size={16} />
                  </span>
                </button>

                <button className="feature-card card-peach" onClick={() => navigate('trilhas')}>
                  <span className="feature-icon">
                    <BookOpen />
                  </span>
                  <strong>Trilhas de Sucesso</strong>
                  <p>Aprenda tarefas digitais com explicações passo a passo.</p>
                  <span className="card-link">
                    Explorar trilhas <ArrowRight size={16} />
                  </span>
                </button>

                <button className="feature-card card-lavender" onClick={() => navigate('sobre')}>
                  <span className="feature-icon">
                    <Sparkles />
                  </span>
                  <strong>Conheça a inteligência artificial</strong>
                  <p>Descubra o que é IA e como ela pode ajudar no cotidiano.</p>
                  <span className="card-link">
                    Aprender mais <ArrowRight size={16} />
                  </span>
                </button>
              </div>

              <div className="gentle-note">
                <span className="note-icon">
                  <ShieldCheck />
                </span>
                <p>
                  <strong>Uma dica importante:</strong> nunca compartilhe senhas, códigos
                  bancários ou informações pessoais sensíveis em uma conversa. Na dúvida, peça
                  ajuda a alguém de confiança.
                </p>
              </div>
            </section>
          )}

          {/* SEÇÃO: CONVERSAR COM A IA (NOTEBOOKLM / GEMINI GLOW CANVAS) */}
          {section === 'conversa' && (
            <section className="lm-chat-container">
              <div
                className={`chat-window center-input-layout show-lm-background lm-canvas-styling ${
                  hasUserMessages ? 'has-dialogue' : 'is-empty'
                }`}
              >
                {/* Bloom/Glow verde esmeralda ConectaIA */}
                <div className="lm-glow" aria-hidden="true" />

                {/* ESTADO 1: INICIAL CENTRALIZADO (EXATAMENTE COMO A FOTO) */}
                {!hasUserMessages && (
                  <div className="lm-center-hero">
                    <h1 className="lm-center-title">Como posso ajudar você hoje?</h1>

                    <form
                      className="lm-pill-input"
                      onSubmit={e => {
                        e.preventDefault()
                        sendMessage()
                      }}
                    >
                      <input
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        placeholder="Digite aqui sua pergunta"
                        aria-label="Digite sua pergunta"
                      />
                      <button
                        type="button"
                        className={`lm-mic-btn ${status === 'Ouvindo' ? 'listening' : ''}`}
                        onClick={startVoiceRecognition}
                        aria-label="Falar pelo microfone"
                      >
                        <Mic size={21} />
                      </button>
                      {messageInput.trim() && (
                        <button
                          type="submit"
                          className="lm-send-btn"
                          aria-label="Enviar mensagem"
                        >
                          <Send size={18} />
                        </button>
                      )}
                    </form>

                    {/* Sugestões rápidas centralizadas */}
                    <div className="lm-suggestions">
                      <button onClick={() => sendMessage('Como posso usar melhor meu celular?')}>
                        Como usar o celular?
                      </button>
                      <button onClick={() => sendMessage('Me explique o que é inteligência artificial')}>
                        O que é IA?
                      </button>
                      <button onClick={() => sendMessage('Bom dia!')}>Diga bom dia</button>
                    </div>

                    {helpMessage && (
                      <div className="inline-notice voice-notice" role="status">
                        <Info size={18} />
                        <span>{helpMessage}</span>
                        <button onClick={() => setHelpMessage('')} aria-label="Fechar aviso">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ESTADO 2: LEITURA LIMPA ESTILO GEMINI (SEM BALÕES DE CHAT) */}
                {hasUserMessages && (
                  <div className="lm-dialogue-layout">
                    {/* Barra de status superior sutil */}
                    <div className="lm-dialogue-header">
                      <span className="lm-status-indicator">
                        <span className="status-dot" />
                        {status === 'Processando' ? 'Respondendo...' : 'ConectaIA Online'}
                      </span>
                      <button
                        className="lm-reset-btn"
                        onClick={resetConversation}
                        title="Iniciar nova conversa"
                      >
                        <RotateCcw size={14} /> Nova conversa
                      </button>
                    </div>

                    {/* Fluxo de leitura estilo Gemini */}
                    <div className="lm-messages-stream">
                      {messages.map(m => (
                        <div key={m.id} className={`gemini-turn ${m.role}`}>
                          {m.role === 'user' ? (
                            <div className="gemini-user-pill">{m.text}</div>
                          ) : (
                            <div className="gemini-ai-block">
                              {!m.text ? (
                                <div className="instant-thinking" aria-label="Gerando resposta">
                                  <span className="dot-pulse" />
                                  <span className="dot-pulse" />
                                  <span className="dot-pulse" />
                                </div>
                              ) : (
                                <>
                                  <FormattedMessage text={m.text} isStreaming={m.isStreaming} />
                                  {!m.isStreaming && m.text && (
                                    <div className="gemini-ai-actions">
                                      <button className="speak-button" onClick={() => speak(m.text)}>
                                        <Volume2 size={16} /> Ouvir resposta
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Barra pill fixada na base */}
                    <div className="lm-dialogue-bottom">
                      <form
                        className="lm-pill-input floating-pill"
                        onSubmit={e => {
                          e.preventDefault()
                          sendMessage()
                        }}
                      >
                        <input
                          value={messageInput}
                          onChange={e => setMessageInput(e.target.value)}
                          placeholder="Peça ao ConectaIA"
                          aria-label="Digite sua pergunta"
                        />
                        <button
                          type="button"
                          className={`lm-mic-btn ${status === 'Ouvindo' ? 'listening' : ''}`}
                          onClick={startVoiceRecognition}
                          aria-label="Falar pelo microfone"
                        >
                          <Mic size={21} />
                        </button>
                        <button
                          type="submit"
                          className="lm-send-btn"
                          aria-label="Enviar mensagem"
                          disabled={!messageInput.trim() || status === 'Processando'}
                        >
                          <Send size={18} />
                        </button>
                      </form>

                      <small className="gemini-disclaimer">
                        O ConectaIA é uma IA e pode cometer erros.
                      </small>

                      {helpMessage && (
                        <div className="inline-notice voice-notice" role="status">
                          <Info size={18} />
                          <span>{helpMessage}</span>
                          <button onClick={() => setHelpMessage('')} aria-label="Fechar aviso">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SEÇÃO: TRILHAS DE SUCESSO */}
          {section === 'trilhas' && (
            <section className="page-body">
              <div className="intro-panel">
                <div className="intro-icon">
                  <BookOpen />
                </div>
                <div>
                  <h2>Aprender, passo a passo</h2>
                  <p>Pequenas lições para ganhar confiança no mundo digital.</p>
                </div>
              </div>

              <div className="lesson-list">
                {lessons.map(lesson => {
                  const LessonIcon = lesson.icon
                  return (
                    <article className="lesson-card" key={lesson.id}>
                      <span className="lesson-number">{lesson.id}</span>
                      <span className="lesson-emoji">
                        <LessonIcon size={22} />
                      </span>
                      <div className="lesson-info">
                        <strong>{lesson.title}</strong>
                        <p>{lesson.description}</p>
                        <span className="lesson-level">{lesson.level}</span>
                      </div>
                      <button className="outline-button" onClick={() => setSelectedLesson(lesson)}>
                        Abrir trilha <ArrowRight size={16} />
                      </button>
                    </article>
                  )
                })}
              </div>

              {helpMessage && (
                <div className="inline-notice">
                  <Info size={18} />
                  {helpMessage}
                  <button onClick={() => setHelpMessage('')} aria-label="Fechar aviso">
                    <X size={16} />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* SEÇÃO: SOBRE A IA */}
          {section === 'sobre' && (
            <section className="page-body">
              <div className="about-hero">
                <div className="about-orb">
                  <Sparkles size={44} />
                </div>
                <span className="eyebrow">INTELIGÊNCIA ARTIFICIAL SEM COMPLICAÇÃO</span>
                <h2>O que é inteligência artificial?</h2>
                <p>
                  É uma tecnologia que pode reconhecer padrões, interpretar informações e ajudar a
                  responder perguntas. Ela pode ser útil, mas também pode cometer erros.
                </p>
              </div>

              <div className="about-grid">
                <article className="info-card">
                  <span className="info-symbol green">
                    <Check />
                  </span>
                  <h3>Como ela pode ajudar?</h3>
                  <p>
                    Explicar assuntos, organizar ideias, sugerir passos e ajudar você a aprender
                    algo novo.
                  </p>
                </article>

                <article className="info-card">
                  <span className="info-symbol orange">
                    <ShieldCheck />
                  </span>
                  <h3>O que devo lembrar?</h3>
                  <p>
                    Nem toda resposta está correta. Evite compartilhar senhas e confirme
                    informações importantes com fontes confiáveis.
                  </p>
                </article>

                <article className="info-card">
                  <span className="info-symbol purple">
                    <Heart />
                  </span>
                  <h3>Ela substitui pessoas?</h3>
                  <p>
                    Não. A tecnologia pode apoiar tarefas, mas não substitui o cuidado, a amizade
                    ou a orientação de profissionais.
                  </p>
                </article>
              </div>
            </section>
          )}

          {/* SEÇÃO: ACESSIBILIDADE / CONFIGURAÇÕES */}
          {section === 'configuracoes' && (
            <section className="page-body">
              <div className="settings-intro">
                <div className="settings-symbol">
                  <Accessibility size={30} />
                </div>
                <div>
                  <h2>Deixe do seu jeito</h2>
                  <p>Personalize a leitura e a experiência para ficar mais confortável.</p>
                </div>
              </div>

              <div className="settings-card">
                <div className="setting-copy">
                  <strong>Tamanho das letras</strong>
                  <p>Aumente ou diminua o texto em toda a página.</p>
                </div>
                <div className="font-controls">
                  <button
                    onClick={() => setFontScale(s => Math.max(0.9, +(s - 0.1).toFixed(1)))}
                    aria-label="Diminuir letras"
                  >
                    <Minus />
                  </button>
                  <span>{Math.round(fontScale * 100)}%</span>
                  <button
                    onClick={() => setFontScale(s => Math.min(1.3, +(s + 0.1).toFixed(1)))}
                    aria-label="Aumentar letras"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <div className="settings-card">
                <div className="setting-copy">
                  <strong>Alto contraste</strong>
                  <p>Realça as cores para facilitar a leitura.</p>
                </div>
                <button
                  className={`toggle ${highContrast ? 'on' : ''}`}
                  onClick={() => setHighContrast(!highContrast)}
                  role="switch"
                  aria-checked={highContrast}
                >
                  <span />
                </button>
              </div>

              <div className="settings-card">
                <div className="setting-copy">
                  <strong>Velocidade da leitura em voz alta</strong>
                  <p>Escolha o ritmo mais confortável para ouvir.</p>
                </div>
                <select value={speechRate} onChange={e => setSpeechRate(e.target.value)}>
                  <option value="lenta">Mais lenta</option>
                  <option value="normal">Normal</option>
                  <option value="rapida">Mais rápida</option>
                </select>
              </div>

              <button
                className="outline-button reset-button"
                onClick={() => {
                  setFontScale(1)
                  setHighContrast(false)
                  setSpeechRate('normal')
                }}
              >
                <RotateCcw size={17} /> Restaurar configurações
              </button>
            </section>
          )}

          {/* SEÇÃO: AJUDA / SOCORRO */}
          {section === 'ajuda' && (
            <section className="page-body">
              <div className="help-hero">
                <div className="help-big-icon">
                  <CircleHelp size={42} />
                </div>
                <h2>Como podemos ajudar?</h2>
                <p>Não tem problema pedir ajuda. Escolha uma opção abaixo.</p>
              </div>

              <div className="help-options">
                <button onClick={() => navigate('conversa')}>
                  <MessageCircle />
                  <span>
                    <strong>Quero conversar</strong>
                    <small>Faça uma pergunta ao assistente.</small>
                  </span>
                  <ChevronRight />
                </button>

                <button onClick={() => navigate('trilhas')}>
                  <BookOpen />
                  <span>
                    <strong>Quero aprender</strong>
                    <small>Veja as trilhas com dicas digitais.</small>
                  </span>
                  <ChevronRight />
                </button>

                <button onClick={() => navigate('configuracoes')}>
                  <Accessibility />
                  <span>
                    <strong>Preciso ajustar a leitura</strong>
                    <small>Aumente as letras ou mude o contraste.</small>
                  </span>
                  <ChevronRight />
                </button>
              </div>

              <div className="emergency-note">
                <Heart size={22} />
                <div>
                  <strong>Precisa de ajuda urgente?</strong>
                  <p>
                    Este botão não chama serviços de emergência. Se você estiver em perigo
                    imediato, procure alguém próximo ou ligue para o serviço de emergência local.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* RODAPÉ (oculto no modo conversa imersivo) */}
          {section !== 'conversa' && (
            <footer className="page-footer">
              <span>© 2026 ConectaIA · Protótipo acadêmico</span>
              <span>
                Feito para conectar, acolher e aprender <Heart size={13} fill="currentColor" />
              </span>
            </footer>
          )}
        </main>
      </div>

      {/* MODAL DE LEITURA DE TRILHA */}
      {selectedLesson && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-title"
        >
          <div className="welcome-modal lesson-modal">
            <button
              className="modal-close"
              onClick={() => setSelectedLesson(null)}
              aria-label="Fechar trilha"
            >
              <X />
            </button>
            <div className="welcome-heart">
              <BookOpen size={32} />
            </div>
            <span className="eyebrow">
              TRILHA {selectedLesson.id} · {selectedLesson.level.toUpperCase()}
            </span>
            <h2 id="lesson-title">{selectedLesson.title}</h2>
            <p>{selectedLesson.description}</p>

            <ol className="lesson-steps">
              {selectedLesson.steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>

            <button className="primary-button" onClick={() => setSelectedLesson(null)}>
              Concluir leitura <Check size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE BOAS-VINDAS / IDENTIFICAÇÃO */}
      {showWelcome && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <div className="welcome-modal">
            <button
              className="modal-close"
              onClick={() => setShowWelcome(false)}
              aria-label="Fechar"
            >
              <X />
            </button>
            <div className="welcome-heart">
              <Heart size={34} fill="currentColor" />
            </div>
            <span className="eyebrow">SEJA BEM-VINDO(A)</span>
            <h2 id="welcome-title">Vamos nos conhecer?</h2>
            <p>Como você gostaria de ser chamado(a)?</p>

            <form
              onSubmit={e => {
                e.preventDefault()
                if (nameInput.trim()) setName(nameInput.trim())
                setShowWelcome(false)
              }}
            >
              <label htmlFor="user-name">Seu nome ou apelido</label>
              <input
                id="user-name"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Digite aqui seu nome (opcional)"
              />
              <button className="primary-button" type="submit">
                Entrar no ConectaIA <ArrowRight size={18} />
              </button>
              <button
                className="skip-button"
                type="button"
                onClick={() => setShowWelcome(false)}
              >
                Prefiro continuar sem informar
              </button>
            </form>

            <small>
              Você não precisa compartilhar informações pessoais para experimentar este protótipo.
            </small>
          </div>
        </div>
      )}
    </div>
  )
}

