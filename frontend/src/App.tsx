'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Bell, Check, ChevronDown, CircleHelp, Clock3, CreditCard,
  FileText, Heart, House, LayoutGrid, Leaf, MapPin, Menu, MessageCircle, Mic, Package,
  Plus, Search, Settings, ShieldCheck, Sparkles, Star, UserRound, X, Upload,
  WalletCards, Volume2, Truck, Users, BarChart3, ImageIcon, Languages
} from 'lucide-react'

type View = 'home' | 'catalogue' | 'product' | 'studio' | 'matches' | 'proposals' | 'checkout' | 'orders' | 'passport' | 'artisans' | 'artisan-profile' | 'profile' | 'customer-dashboard' | 'artisan' | 'listings' | 'requests' | 'production' | 'bulk' | 'bulk-orders' | 'earnings' | 'admin' | 'help' | 'login' | 'cart' | 'confirmation' | 'tracking' | 'custom-requests' | 'messages' | 'notifications' | 'backup-offers' | 'reviews' | 'settings' | 'about' | 'privacy' | 'terms' | 'registration' | 'verification' | 'create-listing' | 'listing-preview' | 'incoming-orders' | 'request-details' | 'proposal-builder' | 'proposal-status' | 'progress' | 'backup-pool' | 'craft-story' | 'bulk-requests' | 'verification-queue' | 'listing-review' | 'order-support' | 'bulk-management' | 'assisted-access' | 'craftcircle' | 'pages'
const validViews: View[] = ['home', 'catalogue', 'product', 'studio', 'matches', 'proposals', 'checkout', 'orders', 'passport', 'artisans', 'artisan-profile', 'profile', 'customer-dashboard', 'artisan', 'listings', 'requests', 'production', 'bulk', 'bulk-orders', 'earnings', 'admin', 'help', 'login', 'cart', 'confirmation', 'tracking', 'custom-requests', 'messages', 'notifications', 'backup-offers', 'reviews', 'settings', 'about', 'privacy', 'terms', 'registration', 'verification', 'create-listing', 'listing-preview', 'incoming-orders', 'request-details', 'proposal-builder', 'proposal-status', 'progress', 'backup-pool', 'craft-story', 'bulk-requests', 'verification-queue', 'listing-review', 'order-support', 'bulk-management', 'assisted-access', 'craftcircle', 'pages']

type ChatMessage = { id: number; from: 'you' | 'artisan'; text: string; time: string }

type Thread = {
  id: number
  title: string
  subtitle: string
  subject: string
  context: string
  productId: number | null
  orderId: string | null
  initials: string
  tone: string
  status: string
  due: string
  messages: ChatMessage[]
}

type OrderStage = 'completed' | 'in-progress' | 'shipped'

type PoolItem = {
  orderId: string
  productName: string
  craft: string
  price: string
  place: string
  tone: string
  stage: OrderStage
  cancelledOn: string
  offered: boolean
}

type BuyerInterest = {
  buyer: string
  initials: string
  crafts: string[]
  note: string
}

type OfferStatus = 'offered' | 'accepted' | 'declined' | 'unavailable'

type BackupOffer = {
  id: string
  orderId: string
  productName: string
  craft: string
  price: string
  tone: string
  buyer: string
  initials: string
  matchReason: string
  status: OfferStatus
}

const isEligible = (item: PoolItem) => item.stage === 'completed' || item.stage === 'in-progress'
const eligibilityNote = (item: PoolItem) => item.stage === 'completed'
  ? 'Completed piece · ready to re-offer'
  : item.stage === 'in-progress'
    ? 'In progress · can be finished for a new buyer'
    : 'Already shipped · not eligible for a backup offer'
const offerStatusTone: Record<OfferStatus, string> = {
  offered: 'bg-[#ead8a8] text-[#8a6d59]',
  accepted: 'bg-[#d8e0cf] text-[#5b795d]',
  declined: 'bg-[#f0ebe4] text-[#8c8278]',
  unavailable: 'bg-[#f0ebe4] text-[#8c8278]',
}
const offerStatusLabel: Record<OfferStatus, string> = {
  offered: 'Awaiting reply',
  accepted: 'Accepted',
  declined: 'Declined',
  unavailable: 'No longer available',
}

const buyerInterests: BuyerInterest[] = [
  { buyer: 'You', initials: 'ME', crafts: ['Kasuti embroidery', 'Coastal weaving'], note: 'Saved 2 Kasuti designs and the Coastal Bloom Pouch · enquired about the Garden Tote' },
  { buyer: 'Arjun Rao', initials: 'AR', crafts: ['Coastal weaving'], note: 'Saved the Coastal Bloom Pouch · asked about woven gift sets' },
  { buyer: 'Divya Shetty', initials: 'DS', crafts: ['Kasuti embroidery'], note: 'Saved the Lotus Wall Panel · hearted three Kasuti pieces' },
  { buyer: 'Sowmya Kamat', initials: 'SK', crafts: ['Beedu craft'], note: 'Saved the Beedu Moon Lamp · asked about areca lighting' },
]

const matchedBuyers = (item: PoolItem) => buyerInterests.filter((interest) => interest.crafts.includes(item.craft))

const seedPool: PoolItem[] = [
  { orderId: 'CB-2051', productName: 'Coastal Bloom commission', craft: 'Coastal weaving', price: '₹1,960', place: 'Mangaluru, Karnataka', tone: 'bg-[#d7bc78]', stage: 'in-progress', cancelledOn: 'Oct 22, 2026', offered: true },
  { orderId: 'CB-2044', productName: 'Temple Border commission', craft: 'Handloom weaving', price: '₹3,200', place: 'Mysuru, Karnataka', tone: 'bg-[#c9a8bd]', stage: 'shipped', cancelledOn: 'Oct 15, 2026', offered: false },
]

const seedOffers: BackupOffer[] = [
  { id: 'CB-2051:You', orderId: 'CB-2051', productName: 'Coastal Bloom commission', craft: 'Coastal weaving', price: '₹1,960', tone: 'bg-[#d7bc78]', buyer: 'You', initials: 'ME', matchReason: 'Saved the Coastal Bloom Pouch', status: 'offered' },
  { id: 'CB-2051:Arjun Rao', orderId: 'CB-2051', productName: 'Coastal Bloom commission', craft: 'Coastal weaving', price: '₹1,960', tone: 'bg-[#d7bc78]', buyer: 'Arjun Rao', initials: 'AR', matchReason: 'Saved the Coastal Bloom Pouch', status: 'offered' },
]

const navGroups: { label: string; hint: string; links: { label: string; target: View }[] }[] = [
  { label: 'Shop', hint: 'Buy handmade', links: [
    { label: 'Explore crafts', target: 'catalogue' },
    { label: 'Meet the makers', target: 'artisans' },
    { label: 'Bulk gifts · CraftCircle', target: 'craftcircle' },
    { label: 'About CraftBridge', target: 'about' },
  ] },
  { label: 'Create', hint: 'Commission a piece', links: [
    { label: 'Design studio', target: 'studio' },
    { label: 'Your matches', target: 'matches' },
    { label: 'Compare proposals', target: 'proposals' },
    { label: 'Custom requests', target: 'custom-requests' },
    { label: 'Cart', target: 'cart' },
  ] },
  { label: 'Sell', hint: 'Your maker side', links: [
    { label: 'Maker workspace', target: 'artisan' },
    { label: 'My products', target: 'listings' },
    { label: 'Create listing', target: 'create-listing' },
    { label: 'Requests from buyers', target: 'requests' },
    { label: 'Production orders', target: 'production' },
    { label: 'FairCraft earnings', target: 'earnings' },
  ] },
  { label: 'Account', hint: 'One account, both sides', links: [
    { label: 'My CraftBridge', target: 'profile' },
    { label: 'My orders', target: 'orders' },
    { label: 'Messages', target: 'messages' },
    { label: 'Craft passport', target: 'passport' },
    { label: 'Notifications', target: 'notifications' },
    { label: 'Settings', target: 'settings' },
  ] },
]

const products = [
  { id: 1, name: 'Kasuti Garden Tote', artisan: 'Shobha Hegde', place: 'Dharwad, Karnataka', price: '₹1,850', craft: 'Kasuti embroidery', tag: 'Best seller', tone: 'bg-[#dfb49b]', description: 'A sturdy everyday tote with hand-stitched marigold and peacock motifs.' },
  { id: 2, name: 'Beedu Moon Lamp', artisan: 'Suma Shetty', place: 'Udupi, Karnataka', price: '₹2,400', craft: 'Beedu craft', tag: 'Made to order', tone: 'bg-[#b7c5a4]', description: 'Warm, sculptural lighting shaped from coastal areca sheath.' },
  { id: 3, name: 'Coastal Bloom Pouch', artisan: 'Parvathi Rai', place: 'Mangaluru, Karnataka', price: '₹980', craft: 'Coastal weaving', tag: 'Ready to ship', tone: 'bg-[#d7bc78]', description: 'A compact woven pouch carrying the colors of the Konkan coast.' },
  { id: 4, name: 'Temple Border Stole', artisan: 'Lakshmi Rao', place: 'Mysuru, Karnataka', price: '₹3,200', craft: 'Handloom weaving', tag: 'New', tone: 'bg-[#c9a8bd]', description: 'Soft cotton-silk stole finished with a traditional temple border.' },
  { id: 5, name: 'Lotus Wall Panel', artisan: 'Meenakshi K', place: 'Hassan, Karnataka', price: '₹1,650', craft: 'Kasuti embroidery', tag: 'Ready to ship', tone: 'bg-[#a8c6c8]', description: 'Geometric lotus embroidery mounted on natural linen.' },
  { id: 6, name: 'Areca Keepsake Box', artisan: 'Ravi Naik', place: 'Kundapura, Karnataka', price: '₹1,150', craft: 'Beedu craft', tag: 'Limited', tone: 'bg-[#d8b18e]', description: 'A lightweight keepsake box made with rescued areca sheath.' },
  { id: 7, name: 'Indigo Kasuti Pouch', artisan: 'Shobha Hegde', place: 'Dharwad, Karnataka', price: '₹1,280', craft: 'Kasuti embroidery', tag: 'Ready to ship', tone: 'bg-[#8fa7b8]', description: 'A hand-stitched indigo pouch with a traditional rangoli border.' },
  { id: 8, name: 'Coastal Gift Set', artisan: 'Anitha Bhat', place: 'Kundapura, Karnataka', price: '₹2,850', craft: 'Coastal weaving', tag: 'Bulk friendly', tone: 'bg-[#c6ae82]', description: 'A thoughtful set of woven keepsakes made for Karnataka celebrations.' },
]
const artisans = [
  { name: 'Shobha Hegde', craft: 'Kasuti embroidery', place: 'Dharwad', initials: 'SH', tone: 'bg-[#dfb49b]', rating: '4.9', orders: '128' },
  { name: 'Suma Shetty', craft: 'Beedu craft', place: 'Udupi', initials: 'SS', tone: 'bg-[#b7c5a4]', rating: '4.8', orders: '94' },
  { name: 'Parvathi Rai', craft: 'Coastal weaving', place: 'Mangaluru', initials: 'PR', tone: 'bg-[#d7bc78]', rating: '5.0', orders: '76' },
  { name: 'Anitha Bhat', craft: 'Coastal weaving', place: 'Kundapura', initials: 'AB', tone: 'bg-[#c6ae82]', rating: '4.9', orders: '61' },
]

function Logo({ onClick }: { onClick?: () => void }) { return <button onClick={onClick} className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#d96c45] text-[#fffaf4]"><Leaf /></span><span className="font-serif text-2xl tracking-[-0.04em]">craft<span className="text-[#d96c45]">bridge</span></span></button> }
function Pill({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-[#dfd3c6] bg-[#fdfaf5] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#8a6d59]">{children}</span> }
function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) { return <div className="rounded-2xl border border-[#e5ddd3] bg-white p-6"><span className="flex size-11 items-center justify-center rounded-xl bg-[#fffaf4] text-[#d96c45]"><Icon /></span><p className="mt-6 text-2xl font-bold">{value}</p><p className="mt-1.5 text-sm text-[#8c8278]">{label}</p></div> }
function speakText(text: string, onUnavailable?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onUnavailable?.()
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-IN'
  utterance.rate = 0.92
  window.speechSynthesis.speak(utterance)
}

export default function Page() {
  const requestedView = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('view') || window.location.pathname.replace(/^\//, '')
    : ''
  const [view, setView] = useState<View>(validViews.includes(requestedView as View) ? requestedView as View : 'home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [liked, setLiked] = useState<number[]>([])
  const [selected, setSelected] = useState(products[0])
  const [studioStep, setStudioStep] = useState(1)
  const [toast, setToast] = useState('')
  const [language, setLanguage] = useState('EN')
  const [orderStatus, setOrderStatus] = useState(2)
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 1,
      title: 'Shobha Hegde',
      subtitle: 'Kasuti embroidery · usually replies within a day',
      subject: 'Kasuti Garden Tote',
      context: 'Order CB-2048',
      productId: 1,
      orderId: 'CB-2048',
      initials: 'SH',
      tone: 'bg-[#dfb49b]',
      status: 'In progress',
      due: 'Due Nov 25',
      messages: [
        { id: 1, from: 'artisan', text: 'Thank you for booking CB-2048! I have your brief and will start once the cotton arrives.', time: '09:41' },
        { id: 2, from: 'you', text: 'Lovely. Could we keep the marigold but make the strap a little longer?', time: '09:44' },
        { id: 3, from: 'artisan', text: 'Of course. I will send a photo of the strap length before I stitch it.', time: '09:46' },
      ],
    },
    {
      id: 2,
      title: 'Suma Shetty',
      subtitle: 'Beedu craft · usually replies within a day',
      subject: 'Beedu Moon Lamp',
      context: 'Product enquiry',
      productId: 2,
      orderId: null,
      initials: 'SS',
      tone: 'bg-[#b7c5a4]',
      status: 'Pre-sale question',
      due: 'Replies within a day',
      messages: [
        { id: 1, from: 'you', text: 'Is the Moon Lamp warm white, and can the base be left natural?', time: '11:02' },
        { id: 2, from: 'artisan', text: 'Namaskara! Yes, the bulb is warm white and I can leave the areca base natural, just oiled.', time: '11:20' },
      ],
    },
  ])
  const [activeThreadId, setActiveThreadId] = useState(1)
  const [poolItems, setPoolItems] = useState<PoolItem[]>(seedPool)
  const [offers, setOffers] = useState<BackupOffer[]>(seedOffers)

  const cancelCustomOrder = () => {
    const orderId = 'CB-2062'
    if (poolItems.some((item) => item.orderId === orderId)) return
    const item: PoolItem = { orderId, productName: 'Indigo Kasuti commission', craft: 'Kasuti embroidery', price: '₹1,280', place: 'Dharwad, Karnataka', tone: 'bg-[#8fa7b8]', stage: 'in-progress', cancelledOn: 'Oct 25, 2026', offered: false }
    const matched = matchedBuyers(item)
    const newOffers: BackupOffer[] = matched.map((interest) => ({
      id: `${orderId}:${interest.buyer}`,
      orderId,
      productName: item.productName,
      craft: item.craft,
      price: item.price,
      tone: item.tone,
      buyer: interest.buyer,
      initials: interest.initials,
      matchReason: interest.note,
      status: 'offered',
    }))
    setPoolItems((items) => [ { ...item, offered: newOffers.length > 0 }, ...items ])
    setOffers((items) => [...items, ...newOffers])
    notify(newOffers.length
      ? `Order cancelled. Backup offers sent to ${newOffers.length} interested buyer${newOffers.length === 1 ? '' : 's'}.`
      : 'Order cancelled. No buyers have expressed interest in a similar design yet.')
  }
  const sendBackupOffers = (orderId: string) => {
    const item = poolItems.find((i) => i.orderId === orderId)
    if (!item || !isEligible(item)) return
    const matched = matchedBuyers(item).filter((interest) => !offers.some((o) => o.id === `${orderId}:${interest.buyer}`))
    if (!matched.length) { notify('No new matches for this design.'); return }
    setOffers((prev) => [...prev, ...matched.map((interest) => ({
      id: `${orderId}:${interest.buyer}`,
      orderId,
      productName: item.productName,
      craft: item.craft,
      price: item.price,
      tone: item.tone,
      buyer: interest.buyer,
      initials: interest.initials,
      matchReason: interest.note,
      status: 'offered' as OfferStatus,
    }))])
    setPoolItems((items) => items.map((i) => i.orderId === orderId ? { ...i, offered: true } : i))
    notify(`Offer sent to ${matched.length} interested buyer${matched.length > 1 ? 's' : ''}.`)
  }
  const respondToOffer = (id: string, status: OfferStatus) => {
    const offer = offers.find((candidate) => candidate.id === id)
    if (!offer || offer.status !== 'offered' || status === 'unavailable') return
    if (status === 'accepted' && offers.some((candidate) => candidate.orderId === offer.orderId && candidate.status === 'accepted')) {
      setOffers((prev) => prev.map((candidate) => candidate.orderId === offer.orderId && candidate.status === 'offered' ? { ...candidate, status: 'unavailable' } : candidate))
      notify('This piece has already been reserved by another buyer.')
      return
    }
    setOffers((prev) => prev.map((candidate) => candidate.orderId === offer.orderId && status === 'accepted' && candidate.status === 'offered'
      ? { ...candidate, status: candidate.id === id ? 'accepted' : 'unavailable' }
      : candidate.id === id ? { ...candidate, status } : candidate))
    notify(status === 'accepted'
      ? 'Offer accepted. This piece is reserved for you.'
      : status === 'declined'
        ? 'Declined. Nothing more to do — interest is never a purchase.'
        : 'Offer restored to your reply list.')
  }
  const myOffers = offers.filter((o) => o.buyer === 'You')
  const pendingInterests = myOffers.filter((o) => o.status === 'offered').length

  useEffect(() => {
    const syncView = () => {
      const next = new URLSearchParams(window.location.search).get('view') || window.location.pathname.replace(/^\//, '')
      if (validViews.includes(next as View)) setView(next as View)
    }
    window.addEventListener('popstate', syncView)
    return () => window.removeEventListener('popstate', syncView)
  }, [])

  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(''), 2600) }
  const sendMessage = (text: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
    const id = Date.now()
    setThreads((items) => items.map((t) => t.id === activeThreadId ? { ...t, messages: [...t.messages, { id, from: 'you', text, time }] } : t))
    const replies = [
      'Noted — I will factor that into the making and update you here.',
      'Thank you. I will send a progress photo before the next step.',
      'Understood, that works. I will keep you posted in this thread.',
    ]
    window.setTimeout(() => setThreads((items) => items.map((t) => t.id === activeThreadId ? { ...t, messages: [...t.messages, { id: id + 1, from: 'artisan', text: replies[t.messages.filter((m) => m.from === 'you').length % replies.length], time }] } : t)), 1400)
  }
  const openProductChat = (product: typeof products[0]) => {
    const existing = threads.find((t) => t.productId === product.id)
    if (existing) { setActiveThreadId(existing.id); go('messages'); return }
    const id = Date.now()
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
    const maker = artisans.find((a) => a.name === product.artisan)
    setThreads((items) => [...items, {
      id,
      title: product.artisan,
      subtitle: `${product.craft} · usually replies within a day`,
      subject: product.name,
      context: 'Product enquiry',
      productId: product.id,
      orderId: null,
      initials: maker?.initials ?? product.artisan.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      tone: maker?.tone ?? product.tone,
      status: 'Pre-sale question',
      due: 'Replies within a day',
      messages: [{ id: id + 1, from: 'artisan', text: `Namaskara! Happy to talk about the ${product.name} — materials, colours, sizing or delivery. Each piece is made by hand to order.`, time }],
    }])
    setActiveThreadId(id)
    go('messages')
  }
  const go = (next: View) => {
    setView(next)
    setMobileOpen(false)
    setOpenMenu(null)
    window.history.pushState({ view: next }, '', next === 'home' ? '/' : `/${next}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const toggleLike = (id: number) => setLiked((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id])

  return <main className={`min-h-screen text-[#302c27] ${view === 'home' ? 'landing-backdrop' : 'craft-page-backdrop'}`}>
    <header className={`sticky top-0 z-30 border-b border-[#e5ddd3] backdrop-blur ${view === 'home' ? 'bg-white/70' : 'bg-[#f7f3ed]/95'}`}>
    {openMenu && <button aria-label="Close menu" onClick={() => setOpenMenu(null)} className="fixed inset-0 z-20 cursor-default" />}
    <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
      <Logo onClick={() => go('home')} />
      <div className="hidden items-center gap-1 text-sm font-semibold text-[#696158] lg:flex">
        {navGroups.map((group) => (
          <div key={group.label} className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
              aria-expanded={openMenu === group.label}
              className={`flex items-center gap-1 rounded-full px-3 py-2 ${openMenu === group.label || group.links.some((l) => l.target === view) ? 'bg-white text-[#302c27] shadow-sm' : 'hover:bg-white/70'}`}
            >
              {group.label}
              <ChevronDown className={`size-4 transition ${openMenu === group.label ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === group.label && (
              <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-2xl border border-[#e5ddd3] bg-white p-2 shadow-xl">
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a6d59]">{group.hint}</p>
                {group.links.map((link) => (
                  <button
                    key={link.target}
                    onClick={() => { go(link.target); setOpenMenu(null) }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${view === link.target ? 'bg-[#fffaf4] text-[#d96c45]' : 'hover:bg-[#f7f3ed]'}`}
                  >
                    {link.label}
                    <ArrowRight className="size-4 shrink-0 text-[#8c8278]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <button onClick={() => go('pages')} className={`rounded-full px-3 py-2 ${view === 'pages' ? 'bg-white text-[#302c27] shadow-sm' : 'hover:bg-white/70'}`}>All pages</button>
        <button onClick={() => go('help')} className={`rounded-full px-3 py-2 ${view === 'help' ? 'bg-white text-[#302c27] shadow-sm' : 'hover:bg-white/70'}`}>Help</button>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => speakText('CraftBridge voice guidance is ready.', () => notify('Voice guidance is unavailable on this device.'))} className="flex size-10 items-center justify-center rounded-full border border-[#d9d0c5]" aria-label="Read voice guidance" title="Voice guidance"><Volume2 /></button>
        <button onClick={() => setLanguage(language === 'EN' ? 'ಕನ್ನಡ' : 'EN')} className="hidden rounded-full border border-[#d9d0c5] px-3 py-2 text-xs font-bold sm:block">{language} <ChevronDown className="inline" /></button>
        <button onClick={() => go('orders')} className="hidden size-10 items-center justify-center rounded-full border border-[#d9d0c5] sm:flex" aria-label="Notifications"><Bell /></button>
        <button onClick={() => go('profile')} className="hidden size-10 items-center justify-center rounded-full border border-[#d9d0c5] sm:flex" aria-label="My CraftBridge" title="My CraftBridge"><UserRound /></button>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="flex size-10 items-center justify-center rounded-full border border-[#d9d0c5] lg:hidden" aria-label="Open menu">{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </nav>
    {mobileOpen && (
      <div className="max-h-[70vh] overflow-y-auto border-t border-[#e5ddd3] bg-[#fffaf4] p-5 lg:hidden">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6d59]">{group.hint}</p>
            <div className="mt-2 flex flex-col">
              {group.links.map((link) => (
                <button key={link.target} onClick={() => { go(link.target); setMobileOpen(false) }} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${view === link.target ? 'bg-white text-[#d96c45]' : ''}`}>
                  {link.label}
                  <ArrowRight className="size-4 shrink-0 text-[#8c8278]" />
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#e5ddd3] pt-4">
          <button onClick={() => { go('pages'); setMobileOpen(false) }} className="rounded-full bg-[#302c27] px-4 py-2 text-sm font-bold text-white">All pages</button>
          <button onClick={() => { go('help'); setMobileOpen(false) }} className="rounded-full border border-[#d9d0c5] px-4 py-2 text-sm font-bold">Help & language</button>
          <button onClick={() => { go('admin'); setMobileOpen(false) }} className="rounded-full border border-[#d9d0c5] px-4 py-2 text-sm font-bold">Admin demo</button>
        </div>
      </div>
    )}
  </header>

    {view === 'home' && <Home go={go} />}
    {view === 'catalogue' && <Catalogue go={go} selected={selected} setSelected={setSelected} liked={liked} toggleLike={toggleLike} />}
    {view === 'product' && <Product go={go} product={selected} onDiscuss={openProductChat} />}
    {view === 'studio' && <Studio go={go} step={studioStep} setStep={setStudioStep} notify={notify} />}
    {view === 'matches' && <Matches go={go} />}
    {view === 'proposals' && <Proposals go={go} notify={notify} />}
    {view === 'checkout' && <Checkout go={go} notify={notify} />}
    {view === 'orders' && <Orders go={go} status={orderStatus} setStatus={setOrderStatus} cancelled={poolItems.some((i) => i.orderId === 'CB-2062')} onCancel={cancelCustomOrder} />}
    {view === 'passport' && <Passport go={go} />}
    {view === 'artisans' && <ArtisanDirectory go={go} />}
    {view === 'artisan-profile' && <ArtisanProfile go={go} />}
    {['profile', 'customer-dashboard'].includes(view) && <AccountHub go={go} interestCount={pendingInterests} />}
    {view === 'artisan' && <ArtisanDashboard go={go} notify={notify} />}
    {view === 'listings' && <Listings go={go} notify={notify} />}
    {view === 'requests' && <Requests go={go} notify={notify} />}
    {view === 'production' && <Production go={go} notify={notify} />}
    {view === 'bulk' && <BulkOrders go={go} notify={notify} />}
    {view === 'earnings' && <Earnings go={go} />}
    {view === 'admin' && <AdminDashboard go={go} notify={notify} />}
    {view === 'help' && <HelpPage go={go} />}
    {view === 'login' && <AuthPage go={go} notify={notify} />}
    {view === 'registration' && <ArtisanRegistration go={go} notify={notify} />}
    {view === 'messages' && <Conversation go={go} threads={threads} activeThreadId={activeThreadId} onSelect={setActiveThreadId} onSend={sendMessage} onViewProduct={(id) => { const p = products.find((x) => x.id === id); if (p) { setSelected(p); go('product') } }} notify={notify} />}
    {view === 'backup-pool' && <BackupPool go={go} notify={notify} items={poolItems} offers={offers} onOffer={sendBackupOffers} />}
    {view === 'backup-offers' && <BackupOffers go={go} notify={notify} offers={myOffers} onRespond={respondToOffer} />}
    {memberViews.includes(view) && view !== 'messages' && view !== 'backup-pool' && view !== 'backup-offers' && <MemberPage view={view} go={go} notify={notify} />}
    {view === 'pages' && <PageDirectory go={go} />}

    <footer className={`border-t border-[#e5ddd3] ${view === 'home' ? 'bg-white/55' : 'bg-[#fffaf4]'}`}><div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-14 text-sm text-[#8c8278] sm:flex-row sm:items-center sm:justify-between lg:px-10"><Logo onClick={() => go('home')} /><span>Handmade with intention · Karnataka, India</span><div className="flex flex-wrap gap-6"><button onClick={() => go('pages')} className="hover:text-[#302c27]">All pages</button><button onClick={() => go('help')} className="hover:text-[#302c27]">Help</button><button onClick={() => go('profile')} className="hover:text-[#302c27]">My CraftBridge</button><button onClick={() => go('artisan')} className="hover:text-[#302c27]">Maker workspace</button><button onClick={() => go('admin')} className="hover:text-[#302c27]">Admin demo</button></div></div></footer>
    {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white shadow-xl">{toast}</div>}
  </main>
}

function Home({ go }: { go: (v: View) => void }) { return <div>
  <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-10 lg:pb-32 lg:pt-24"><div className="max-w-xl"><Pill>Rooted in Karnataka</Pill><h1 className="mt-7 font-serif text-[clamp(3.5rem,8vw,6.8rem)] leading-[.91] tracking-[-0.07em]">Your ideas.<br /><em className="font-normal text-[#d96c45]">Their craft.</em><br />One story.</h1><p className="mt-8 max-w-md text-xl leading-9 text-[#6f665d]">A thoughtful marketplace where every handmade piece begins with a person, a place, and a little bit of magic.</p><div className="mt-10 flex flex-wrap gap-4"><button onClick={() => go('catalogue')} className="rounded-full bg-[#d96c45] px-7 py-4 text-sm font-bold text-white">Explore crafts <ArrowRight className="ml-2 inline" /></button><button onClick={() => go('studio')} className="rounded-full border border-[#d9d0c5] px-7 py-4 text-sm font-bold"><Sparkles className="mr-2 inline" /> Create your design</button></div><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => go('login')} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold">Login / Register</button><button onClick={() => go('registration')} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold">Become an artisan</button></div><div className="mt-14 flex items-center gap-4 text-sm text-[#8c8278]"><div className="flex -space-x-2"><span className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#dfb49b] text-[10px] font-bold">SH</span><span className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#b7c5a4] text-[10px] font-bold">SS</span><span className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#d7bc78] text-[10px] font-bold">PR</span></div><span><strong className="text-[#302c27]">240+</strong> makers already on the bridge</span></div></div><div className="relative mx-auto w-full max-w-lg"><div className="absolute -inset-5 -z-0 rounded-[12rem_12rem_2rem_2rem] bg-[radial-gradient(ellipse_at_center,_#f7e8dc_0%,_#fffaf6_54%,_transparent_74%)]" /><div className="absolute -right-3 -top-5 z-20 flex size-24 rotate-12 items-center justify-center rounded-full bg-[#d7bc78] p-4 text-center font-serif text-sm leading-4 shadow-lg">Made slowly,<br />made well</div><div className="relative aspect-[.88] overflow-hidden rounded-[11rem_11rem_1.5rem_1.5rem] bg-[#f1e3d8] shadow-[0_24px_70px_rgba(93,63,43,0.18)] ring-8 ring-white"><img src="/craftbridge-hero.png" alt="Artisan creating colorful embroidery by hand" className="size-full object-cover" /></div><div className="absolute -bottom-5 -left-5 z-10 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-[#eee7df]"><div className="flex gap-1 text-[#d7a63f]"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div><p className="font-serif text-lg">“You can feel the care.”</p><p className="text-xs text-[#8c8278]">— Meera, Bengaluru</p></div></div></section>
  <section className="border-y border-[#eee9e2] bg-[#fffdfa] py-24 lg:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Pill>The collection</Pill><h2 className="mt-5 font-serif text-5xl tracking-[-0.05em]">Made for keeping.</h2></div><button onClick={() => go('catalogue')} className="font-bold text-[#d96c45]">View all crafts <ArrowRight className="ml-1 inline" /></button></div><div className="mt-14 grid gap-7 md:grid-cols-3">{products.slice(0,3).map((p) => <button key={p.id} onClick={() => go('catalogue')} className="group text-left"><div className={`flex aspect-square items-end rounded-3xl ${p.tone} p-6 transition group-hover:-translate-y-1`}><div className="rounded-2xl bg-white/90 p-5"><p className="font-serif text-xl">{p.name}</p><p className="mt-1 text-sm text-[#8c8278]">{p.craft}</p></div></div></button>)}</div></div></section>
  <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><Pill>More than a marketplace</Pill><h2 className="mt-6 max-w-md font-serif text-5xl leading-[.98] tracking-[-0.05em]">A bridge between <em className="font-normal text-[#d96c45]">imagination</em> and making.</h2><p className="mt-7 max-w-md leading-7 text-[#6f665d]">Describe an idea, discover the right maker, approve a fair proposal and follow the making journey.</p><button onClick={() => go('studio')} className="mt-8 rounded-full bg-[#302c27] px-6 py-4 text-sm font-bold text-white">Start with an idea <ArrowRight className="ml-2 inline" /></button></div><div className="grid gap-6 sm:grid-cols-3">{[['Describe', 'Your occasion, colors, or a feeling. In any language.', Sparkles], ['Discover', 'A maker whose hands fit your vision.', Users], ['Co-create', 'Approve a fair proposal and watch it take shape.', Check]].map(([title, copy, Icon], i) => <div key={title as string} className={`rounded-3xl p-8 ${i === 0 ? 'bg-[#e8d8c6] sm:translate-y-8' : i === 1 ? 'bg-[#d8e0cf]' : 'bg-[#ead8a8] sm:translate-y-8'}`}><span className="flex size-12 items-center justify-center rounded-full bg-[#fffaf4]"><Icon /></span><h3 className="mt-14 font-serif text-2xl">{title as string}</h3><p className="mt-3 text-sm leading-6 text-[#6f665d]">{copy as string}</p></div>)}</div></div></section>
  <section className="border-t border-[#eee9e2] bg-[#fffdfa] py-24 text-[#302c27]"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08b3d]">The people behind it</p><h2 className="mt-4 font-serif text-5xl">Meet the makers.</h2></div><p className="max-w-xs text-sm leading-6 text-[#6f665d]">Every purchase supports a living tradition and a person who chose to keep making.</p></div><div className="mt-14 grid gap-6 md:grid-cols-3">{artisans.map((a) => <button key={a.name} onClick={() => go('artisans')} className="flex items-center gap-5 rounded-3xl border border-[#eee7df] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className={`flex size-16 items-center justify-center rounded-full ${a.tone} font-serif text-lg text-[#302c27]`}>{a.initials}</div><div><h3 className="font-serif text-xl">{a.name}</h3><p className="text-sm text-[#6f665d]">{a.craft}</p><p className="text-xs text-[#8c8278]">{a.place}</p></div><ArrowRight className="ml-auto text-[#d7bc78]" /></button>)}</div></div></section>
</div> }

function Shell({ title, eyebrow, go, children, action }: { title: string; eyebrow?: string; go: (v: View) => void; children: React.ReactNode; action?: React.ReactNode }) { return <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20"><button onClick={() => go('home')} className="inline-flex items-center gap-2 rounded-full border border-[#d9d0c5] bg-white px-4 py-2 text-sm font-bold text-[#696158] transition hover:bg-[#fffaf4]"><ArrowLeft className="size-4" /> Back home</button><div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div className="max-w-2xl">{eyebrow && <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d96c45]">{eyebrow}</p>}<h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.05em]">{title}</h1></div>{action}</div><div className="mt-12 lg:mt-16">{children}</div></section> }

function Catalogue({ go, selected, setSelected, liked, toggleLike }: { go: (v: View) => void; selected: typeof products[0]; setSelected: (p: typeof products[0]) => void; liked: number[]; toggleLike: (id: number) => void }) { const [query, setQuery] = useState(''); const [filter, setFilter] = useState('All'); const filtered = products.filter((p) => (filter === 'All' || p.craft.includes(filter)) && `${p.name} ${p.artisan}`.toLowerCase().includes(query.toLowerCase())); return <Shell go={go} title="Explore crafts" eyebrow="The catalogue" action={<button onClick={() => go('artisans')} className="rounded-full border border-[#d9d0c5] px-4 py-2 text-sm font-bold"><Users className="mr-2 inline" /> Find an artisan</button>}><div className="flex flex-col gap-4 rounded-3xl border border-[#e5ddd3] bg-white p-4 md:flex-row"><div className="flex flex-1 items-center gap-3 px-4"><Search className="text-[#8c8278]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, crafts or makers" className="w-full bg-transparent py-2.5 outline-none" /></div><div className="flex gap-2 overflow-x-auto">{['All', 'Kasuti', 'Beedu', 'Coastal', 'Handloom'].map((f) => <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold ${filter === f ? 'bg-[#302c27] text-white' : 'bg-[#f7f3ed]'}`}>{f}</button>)}</div></div><div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p) => <article key={p.id} className="group"><div className={`relative flex aspect-square items-end overflow-hidden rounded-[2rem] ${p.tone} p-6`}><span className="absolute left-4 top-4 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{p.tag}</span><button onClick={() => toggleLike(p.id)} aria-label={`Save ${p.name}`} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-[#fffaf4]/90"><Heart fill={liked.includes(p.id) ? 'currentColor' : 'none'} className={liked.includes(p.id) ? 'text-[#d96c45]' : ''} /></button><button onClick={() => { setSelected(p); go('product') }} className="w-full rounded-2xl bg-[#fffaf4]/90 p-5 text-left transition group-hover:bg-white"><p className="font-serif text-xl">{p.name}</p><p className="mt-1.5 text-sm text-[#8c8278]">{p.craft} · {p.place}</p></button></div><div className="flex items-start justify-between gap-4 pt-5"><div><h3 className="font-serif text-xl">{p.name}</h3><p className="mt-1.5 text-sm text-[#8c8278]">{p.artisan}</p></div><p className="whitespace-nowrap font-semibold">{p.price}</p></div></article>)}</div></Shell> }

function Product({ go, product, onDiscuss }: { go: (v: View) => void; product: typeof products[0]; onDiscuss: (p: typeof products[0]) => void }) { return <Shell go={go} title={product.name} eyebrow="Product details"><div className="grid gap-14 lg:grid-cols-2"><div className={`flex min-h-[480px] items-end rounded-[3rem] ${product.tone} p-9`}><div className="rounded-2xl bg-[#fffaf4]/90 p-6"><Pill>{product.craft}</Pill><p className="mt-3 font-serif text-3xl">Made by {product.artisan}</p></div></div><div><p className="text-4xl font-bold">{product.price}</p><p className="mt-6 text-lg leading-9 text-[#6f665d]">{product.description} Each piece is made slowly, with materials chosen by the maker.</p><div className="my-10 grid grid-cols-2 gap-4"><Stat icon={Clock3} label="Delivery estimate" value="10–14 days" /><Stat icon={ShieldCheck} label="Craft passport" value="Verified" /></div><div className="rounded-3xl border border-[#e5ddd3] bg-white p-7"><p className="font-bold">FairCraft price breakdown</p><div className="mt-5 flex flex-col gap-4 text-sm text-[#6f665d]"><div className="flex justify-between"><span>Materials</span><span>₹420</span></div><div className="flex justify-between"><span>Maker labour</span><span>₹1,080</span></div><div className="flex justify-between"><span>Packaging & platform</span><span>₹350</span></div><div className="flex justify-between border-t pt-3 font-bold text-[#302c27]"><span>Artisan expected earnings</span><span>₹1,500</span></div></div></div><div className="mt-8 flex flex-wrap gap-4"><button onClick={() => go('checkout')} className="rounded-full bg-[#d96c45] px-7 py-4 text-sm font-bold text-white">Buy now <ArrowRight className="ml-2 inline" /></button><button onClick={() => go('cart')} className="rounded-full border border-[#d9d0c5] px-6 py-4 text-sm font-bold"><Package className="mr-2 inline" /> Add to cart</button><button onClick={() => onDiscuss(product)} className="rounded-full border border-[#d9d0c5] px-6 py-4 text-sm font-bold"><MessageCircle className="mr-2 inline" /> Message seller</button><button onClick={() => go('studio')} className="rounded-full border border-[#d9d0c5] px-6 py-4 text-sm font-bold">Request customization</button><button onClick={() => go('passport')} className="rounded-full border border-[#d9d0c5] px-6 py-4 text-sm font-bold">View craft passport</button></div></div></div></Shell> }

function Studio({ go, step, setStep, notify }: { go: (v: View) => void; step: number; setStep: (n: number) => void; notify: (m: string) => void }) { return <Shell go={go} title="What are you imagining?" eyebrow="AI custom design studio"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[2rem] bg-[#302c27] p-9 text-[#fffaf4] sm:p-11"><div className="flex items-center justify-between"><Pill>Step {step} of 3</Pill><Sparkles className="text-[#d7bc78]" /></div><h2 className="mt-12 font-serif text-4xl">Turn a feeling into a handmade piece.</h2><p className="mt-6 text-lg leading-8 text-[#b9afa4]">Tell us in your own words, upload a spark or use your voice. We will find the right craft tradition for your idea.</p><div className="mt-11 flex gap-2">{[1,2,3].map((n) => <span key={n} className={`h-1 flex-1 rounded-full ${n <= step ? 'bg-[#d96c45]' : 'bg-white/20'}`} />)}</div></div><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10">{step === 1 && <><label className="font-bold">Describe your idea</label><textarea className="mt-3 min-h-40 w-full rounded-2xl bg-[#f7f3ed] p-4 outline-none" placeholder="A Kasuti tote for my sister's wedding, with marigolds..." /><div className="mt-4 flex gap-3"><button className="rounded-full border border-[#d9d0c5] px-4 py-2 text-sm font-bold"><Mic className="mr-2 inline" /> Speak instead</button><button className="rounded-full border border-dashed border-[#d9d0c5] px-4 py-2 text-sm font-bold"><Upload className="mr-2 inline" /> Add inspiration</button></div></>}{step === 2 && <><label className="font-bold">Shape the details</label><div className="mt-4 grid gap-4 sm:grid-cols-2"><select className="rounded-xl border p-3"><option>Product: Tote bag</option><option>Wall art</option><option>Stole</option></select><select className="rounded-xl border p-3"><option>Colors: Marigold & indigo</option><option>Earthy neutrals</option><option>Coastal blue</option></select><select className="rounded-xl border p-3"><option>Budget: ₹1,500–₹3,000</option><option>Under ₹1,500</option><option>₹3,000+</option></select><select className="rounded-xl border p-3"><option>Needed by: Flexible</option><option>Within 2 weeks</option><option>Within a month</option></select></div><div className="mt-5 rounded-2xl bg-[#ead8a8] p-5"><p className="text-xs font-bold uppercase tracking-wider">Your brief</p><p className="mt-2 font-serif text-2xl">Wedding tote · marigold motifs · fair budget</p></div></>}{step === 3 && <><div className="flex items-center justify-between"><div><Pill>AI concept preview</Pill><h3 className="mt-4 font-serif text-3xl">Kasuti Garden Tote</h3></div><Sparkles className="text-[#d96c45]" /></div><div className="mt-5 flex min-h-56 items-center justify-center rounded-2xl bg-[#dfb49b] p-6"><div className="rounded-2xl bg-[#fffaf4]/90 p-6 text-center"><ImageIcon className="mx-auto text-[#d96c45]" /><p className="mt-3 font-serif text-2xl">Marigold garden pattern</p><p className="mt-2 text-sm text-[#6f665d]">AI Concept Preview — Not the Final Handmade Product</p></div></div></>}<div className="mt-7 flex justify-between">{step > 1 ? <button onClick={() => setStep(step - 1)} className="rounded-full border px-5 py-3 text-sm font-bold">Back</button> : <span />}{step < 3 ? <button onClick={() => setStep(step + 1)} className="rounded-full bg-[#d96c45] px-5 py-3 text-sm font-bold text-white">Continue <ArrowRight className="ml-2 inline" /></button> : <button onClick={() => { notify('Design brief sent to 3 suitable artisans'); go('matches') }} className="rounded-full bg-[#d96c45] px-5 py-3 text-sm font-bold text-white">Find artisans <ArrowRight className="ml-2 inline" /></button>}</div></div></div></Shell> }

function Matches({ go }: { go: (v: View) => void }) { return <Shell go={go} title="Artisans matched to your idea" eyebrow="Your design brief"><div className="rounded-3xl bg-[#ead8a8] p-7"><p className="text-xs font-bold uppercase tracking-wider">Looking for</p><p className="mt-3 font-serif text-2xl">Kasuti tote · marigold garden pattern · ₹1,500–₹3,000</p></div><div className="mt-8 grid gap-6">{artisans.map((a, i) => <div key={a.name} className="flex flex-col gap-6 rounded-[2rem] border border-[#e5ddd3] bg-white p-7 md:flex-row md:items-center"><div className={`flex size-20 shrink-0 items-center justify-center rounded-full ${a.tone} font-serif text-2xl`}>{a.initials}</div><div className="flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="font-serif text-2xl">{a.name}</h3><Pill>{i === 0 ? 'Best match' : 'Good match'}</Pill></div><p className="mt-1 text-[#6f665d]">{a.craft} · {a.place}</p><div className="mt-3 flex gap-5 text-sm"><span><Star className="mr-1 inline text-[#d7a63f]" fill="currentColor" /> {a.rating}</span><span>{a.orders} completed orders</span><span>Replies in {i + 1} days</span></div></div><button onClick={() => go('proposals')} className="rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Request proposal</button></div>)}</div></Shell> }

function Proposals({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { const [approved, setApproved] = useState(false); return <Shell go={go} title="Compare proposals" eyebrow="Custom request · CB-2048"><div className="grid gap-7 lg:grid-cols-2">{artisans.slice(0,2).map((a, i) => <div key={a.name} className={`rounded-[2rem] border p-8 ${i === 0 ? 'border-[#d96c45] bg-[#fffaf4]' : 'border-[#e5ddd3] bg-white'}`}><div className="flex items-center gap-3"><div className={`flex size-12 items-center justify-center rounded-full ${a.tone} font-bold`}>{a.initials}</div><div><h3 className="font-serif text-xl">{a.name}</h3><p className="text-sm text-[#8c8278]">{a.craft}</p></div>{i === 0 && <Pill>Recommended</Pill>}</div><div className="mt-7 rounded-2xl bg-[#ead8a8] p-5"><p className="font-serif text-2xl">{i === 0 ? '₹2,250' : '₹2,650'}</p><p className="mt-1 text-sm">{i === 0 ? '12–14 days' : '18–20 days'} · Hand-stitched</p></div><div className="mt-5 flex flex-col gap-3 text-sm text-[#6f665d]"><p><Check className="mr-2 inline text-[#5b795d]" /> Marigold garden motif</p><p><Check className="mr-2 inline text-[#5b795d]" /> Progress photos included</p><p><Check className="mr-2 inline text-[#5b795d]" /> Craft passport included</p></div><button onClick={() => { if (i === 0) { setApproved(true); notify('Proposal approved. Continue to checkout.'); } }} className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-bold ${i === 0 ? 'bg-[#d96c45] text-white' : 'border border-[#d9d0c5]'}`}>{i === 0 && approved ? 'Approved' : 'Approve & continue'}</button><button className="mt-3 w-full text-sm font-bold text-[#8c8278]">Ask a question</button></div>)}</div>{approved && <button onClick={() => go('checkout')} className="mt-6 rounded-full bg-[#302c27] px-6 py-3.5 text-sm font-bold text-white">Continue to secure checkout <ArrowRight className="ml-2 inline" /></button>}</Shell> }

function ArtisanProfile({ go }: { go: (v: View) => void }) { const artisan = artisans[0]; return <Shell go={go} title={artisan.name} eyebrow="Artisan profile"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div className={`flex min-h-80 flex-col justify-end rounded-[2rem] ${artisan.tone} p-9`}><div className="flex size-20 items-center justify-center rounded-full bg-white/70 text-2xl font-bold">{artisan.initials}</div><h2 className="mt-6 font-serif text-4xl">{artisan.craft}</h2><p className="mt-2">{artisan.place}, Karnataka · ★ {artisan.rating}</p></div><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-9"><Pill>Verified maker</Pill><h2 className="mt-6 font-serif text-3xl">A living tradition, thoughtfully carried forward.</h2><p className="mt-5 leading-8 text-[#6f665d]">Shobha learned Kasuti embroidery from her grandmother and works with cotton, natural dyes and patient hand-stitching.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><Stat icon={Star} label="Customer rating" value={artisan.rating} /><Stat icon={Package} label="Completed orders" value={artisan.orders} /><Stat icon={Clock3} label="Typical lead time" value="12 days" /></div><div className="mt-8 flex flex-wrap gap-4"><button onClick={() => go('custom-requests')} className="rounded-full bg-[#d96c45] px-7 py-4 text-sm font-bold text-white">Request custom order</button><button onClick={() => go('catalogue')} className="rounded-full border border-[#d9d0c5] px-6 py-4 text-sm font-bold">View products</button></div></div></div></Shell> }

function Checkout({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { const [paid, setPaid] = useState(false); return <Shell go={go} title={paid ? 'Order confirmed' : 'Checkout'} eyebrow="Secure demo checkout"><div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">{!paid ? <div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10"><h2 className="font-serif text-3xl">Where should we send it?</h2><div className="mt-7 grid gap-4 sm:grid-cols-2"><input className="rounded-xl border p-3.5" placeholder="Full name" /><input className="rounded-xl border p-3.5" placeholder="Phone number" /><input className="rounded-xl border p-3.5 sm:col-span-2" placeholder="Address" /><input className="rounded-xl border p-3.5" placeholder="City" /><input className="rounded-xl border p-3.5" placeholder="Pincode" /></div><h3 className="mt-9 font-serif text-2xl">Payment method</h3><button className="mt-5 flex w-full items-center gap-3 rounded-2xl border-2 border-[#d96c45] p-5 text-left"><CreditCard className="text-[#d96c45]" /><span><strong>Demo card payment</strong><span className="block text-sm text-[#8c8278]">No real payment will be charged</span></span><Check className="ml-auto text-[#d96c45]" /></button><button onClick={() => { setPaid(true); notify('Payment simulated successfully') }} className="mt-8 w-full rounded-full bg-[#d96c45] px-6 py-4 text-sm font-bold text-white">Place order · ₹2,250</button></div> : <div className="rounded-[2rem] bg-[#d8e0cf] p-10"><span className="flex size-14 items-center justify-center rounded-full bg-[#fffaf4]"><Check /></span><h2 className="mt-8 font-serif text-4xl">Your story is now in motion.</h2><p className="mt-5 text-lg leading-8 text-[#6f665d]">Order CB-2048 is confirmed. Shobha will begin after reviewing your brief. You will receive progress updates here.</p><button onClick={() => go('orders')} className="mt-9 rounded-full bg-[#302c27] px-7 py-4 text-sm font-bold text-white">Track my order <ArrowRight className="ml-2 inline" /></button><button onClick={() => go('messages')} className="mt-3 w-full rounded-full border border-[#a9bb9a] px-6 py-3 text-sm font-bold"><MessageCircle className="mr-2 inline" /> Message Shobha</button></div>}<div className="h-fit rounded-[2rem] bg-[#302c27] p-8 text-[#fffaf4]"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7bc78]">Order summary</p><h3 className="mt-6 font-serif text-2xl">Custom Kasuti Garden Tote</h3><div className="mt-8 flex flex-col gap-4 text-[15px] text-[#b9afa4]"><div className="flex justify-between"><span>Approved proposal</span><span>₹2,250</span></div><div className="flex justify-between"><span>Shipping</span><span>Included</span></div><div className="flex justify-between border-t border-white/10 pt-4 font-bold text-white"><span>Total</span><span>₹2,250</span></div></div></div></div></Shell> }

function Orders({ go, status, setStatus, cancelled, onCancel }: { go: (v: View) => void; status: number; setStatus: (n: number) => void; cancelled: boolean; onCancel: () => void }) { const [confirming, setConfirming] = useState(false); const steps = ['Order confirmed', 'Design approved', 'In progress', 'Quality check', 'Shipped', 'Delivered']; return <Shell go={go} title="My orders" eyebrow="Your making journeys"><div className="flex flex-col gap-7"><div className="rounded-3xl border border-[#e5ddd3] bg-white p-7 sm:p-9"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><Pill>Custom commission</Pill><h2 className="mt-4 font-serif text-3xl">Kasuti Garden Tote</h2><p className="mt-1 text-sm text-[#8c8278]">Order CB-2048 · Shobha Hegde</p></div><button onClick={() => go('passport')} className="h-fit rounded-full border border-[#d9d0c5] px-4 py-2 text-sm font-bold">Craft passport</button></div><div className="mt-12 flex flex-col gap-5 md:flex-row md:justify-between">{steps.map((s, i) => <button key={s} onClick={() => setStatus(i)} className="flex items-center gap-3 text-left md:block md:flex-1"><span className={`flex size-9 items-center justify-center rounded-full md:mx-auto ${i <= status ? 'bg-[#d96c45] text-white' : 'bg-[#f0ebe4] text-[#8c8278]'}`}>{i < status ? <Check /> : i + 1}</span><span className={`text-sm md:mt-3 md:block md:text-center ${i === status ? 'font-bold' : 'text-[#8c8278]'}`}>{s}</span></button>)}</div><div className="mt-10 rounded-3xl bg-[#ead8a8] p-6"><p className="font-bold">Maker update</p><p className="mt-2 text-sm leading-6 text-[#6f665d]">“The first flower row is complete. The marigold thread is especially lovely today.”</p><p className="mt-3 text-xs text-[#8c8278]">Updated 2 hours ago · progress photo attached</p></div><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => go('messages')} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold"><MessageCircle className="mr-2 inline" /> Message artisan</button><button onClick={() => go('passport')} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold">View making journey</button></div></div><div className="rounded-3xl border border-[#e5ddd3] bg-white p-7 sm:p-9">{!cancelled ? <>
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div><Pill>Custom commission</Pill><h2 className="mt-4 font-serif text-3xl">Indigo Kasuti Pouch</h2><p className="mt-1 text-sm text-[#8c8278]">Order CB-2062 · Shobha Hegde</p></div>
      <span className="h-fit rounded-full bg-[#ead8a8] px-4 py-2 text-sm font-bold text-[#8a6d59]">In progress · due Dec 8</span>
    </div>
    <p className="mt-5 max-w-2xl text-sm leading-6 text-[#6f665d]">The indigo border is stitched and the lining is being finished. You can cancel free of charge until the piece is shipped.</p>
    <div className="mt-6 flex flex-wrap gap-3">{!confirming ? <>
      <button onClick={() => setConfirming(true)} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold text-[#b4553c]">Cancel order</button>
      <button onClick={() => go('messages')} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold"><MessageCircle className="mr-2 inline" /> Message artisan</button>
    </> : <>
      <button onClick={() => { setConfirming(false); onCancel() }} className="rounded-full bg-[#d96c45] px-5 py-3 text-sm font-bold text-white">Confirm cancellation</button>
      <button onClick={() => setConfirming(false)} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold">Keep my order</button>
    </>}</div>
    {confirming && <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8c8278]">Cancelling releases the in-progress piece to the backup buyer pool — a customer who saved a similar design may love it. Nobody is obligated to take it.</p>}
  </> : <>
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div><Pill>Cancelled</Pill><h2 className="mt-4 font-serif text-3xl">Indigo Kasuti Pouch</h2><p className="mt-1 text-sm text-[#8c8278]">Order CB-2062 · Shobha Hegde · cancelled today</p></div>
      <span className="h-fit rounded-full bg-[#f0ebe4] px-4 py-2 text-sm font-bold text-[#8c8278]">Refund in 3–5 days</span>
    </div>
    <p className="mt-5 max-w-2xl text-sm leading-6 text-[#6f665d]">Your cancellation is complete. The in-progress piece can now be offered to customers who previously expressed interest in similar designs — every buyer stays free to accept or decline.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <button onClick={() => go('backup-pool')} className="rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">See backup buyer pool <ArrowRight className="ml-2 inline" /></button>
      <button onClick={() => go('backup-offers')} className="rounded-full border border-[#d9d0c5] px-5 py-3 text-sm font-bold">See your backup offers</button>
    </div>
  </>}</div></div></Shell> }

function Passport({ go }: { go: (v: View) => void }) { return <Shell go={go} title="Digital craft passport" eyebrow="CB-PASS-2048"><div className="grid gap-10 lg:grid-cols-[1fr_.8fr]"><div className="rounded-[2rem] bg-[#302c27] p-9 text-[#fffaf4]"><div className="flex items-center justify-between"><ShieldCheck className="text-[#d7bc78]" /><Pill>Verified origin</Pill></div><h2 className="mt-14 font-serif text-4xl">Kasuti Garden Tote</h2><p className="mt-3 text-lg text-[#b9afa4]">A living record of the hands, materials and time behind your piece.</p><div className="mt-11 grid gap-6 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wider text-[#8f877f]">Maker</p><p className="mt-1 font-bold">Shobha Hegde</p></div><div><p className="text-xs uppercase tracking-wider text-[#8f877f]">Origin</p><p className="mt-1 font-bold">Dharwad, Karnataka</p></div><div><p className="text-xs uppercase tracking-wider text-[#8f877f]">Technique</p><p className="mt-1 font-bold">Kasuti embroidery</p></div><div><p className="text-xs uppercase tracking-wider text-[#8f877f]">Working hours</p><p className="mt-1 font-bold">18 hours</p></div></div></div><div className="rounded-3xl border border-[#e5ddd3] bg-white p-6"><div className="mx-auto flex size-48 items-center justify-center rounded-2xl bg-[#f7f3ed]"><div className="grid grid-cols-5 gap-2">{Array.from({ length: 25 }).map((_, i) => <span key={i} className={`size-5 ${i % 3 === 0 || i % 7 === 0 ? 'bg-[#302c27]' : 'bg-[#d7bc78]'}`} />)}</div></div><p className="mt-5 text-center text-sm text-[#8c8278]">Scan to share this piece&apos;s story</p><div className="mt-7 flex flex-col gap-4 text-sm"><div className="flex justify-between"><span>Materials</span><strong>Natural cotton, silk thread</strong></div><div className="flex justify-between"><span>Claims</span><strong className="text-[#5b795d]">Seller declared</strong></div><div className="flex justify-between"><span>Last verified</span><strong>Oct 24, 2026</strong></div></div></div></div></Shell> }

function ArtisanDirectory({ go }: { go: (v: View) => void }) { return <Shell go={go} title="Meet the makers" eyebrow="Find an artisan"><div className="grid gap-7 md:grid-cols-3">{artisans.map((a) => <div key={a.name} className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8"><div className={`flex size-20 items-center justify-center rounded-full ${a.tone} font-serif text-2xl`}>{a.initials}</div><h3 className="mt-7 font-serif text-2xl">{a.name}</h3><p className="mt-1.5 text-[#8c8278]">{a.craft} · {a.place}</p><div className="mt-6 flex justify-between text-sm"><span><Star className="mr-1 inline text-[#d7a63f]" fill="currentColor" /> {a.rating}</span><span>{a.orders} orders</span></div><button onClick={() => go('artisan-profile')} className="mt-7 w-full rounded-full bg-[#302c27] px-5 py-3.5 text-sm font-bold text-white">View profile</button></div>)}</div></Shell> }

function AccountHub({ go, interestCount }: { go: (v: View) => void; interestCount: number }) {
  const stats: [React.ElementType, string, string][] = [
    [Package, 'Active orders', '2'], [Sparkles, 'Saved designs', '4'], [Heart, 'Backup interests', String(interestCount)],
    [FileText, 'Listings live', '6'], [MessageCircle, 'Requests waiting', '2'], [WalletCards, 'Earnings this month', '₹48,200'],
  ]
  const cards: { pill: string; heading: string; copy: string; panel: string; tone: string; links: [string, React.ElementType, View][] }[] = [
    { pill: 'Buying side', heading: 'Shop and commission', copy: 'Explore crafts, create a design, compare proposals and follow every order you buy from another maker.', panel: 'bg-white', tone: 'text-[#d96c45]', links: [['Shop crafts', Search, 'catalogue'], ['My orders', Package, 'orders'], ['Messages', MessageCircle, 'messages'], ['Custom design', Sparkles, 'studio'], ['Saved interests', Heart, 'backup-offers']] },
    { pill: 'Selling side', heading: 'Make and sell', copy: 'Publish your work, respond to commissions, manage production and receive transparent FairCraft earnings.', panel: 'bg-[#d8e0cf]', tone: 'text-[#5b795d]', links: [['Maker workspace', House, 'artisan'], ['My products', Package, 'listings'], ['Custom requests', MessageCircle, 'requests'], ['My earnings', WalletCards, 'earnings']] },
  ]
  return <Shell go={go} title="My CraftBridge" eyebrow="One account · buying and selling together">
    <div className="rounded-[2rem] bg-[#302c27] p-8 text-[#fffaf4] sm:p-11">
      <p className="max-w-2xl font-serif text-4xl leading-tight">Buy from makers. Sell what you make. Same person, same sign-in.</p>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[#b9afa4]">There is no separate customer account and artisan account. Your orders, your listings, your messages and your settings all live on this one page.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button onClick={() => go('artisan')} className="rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white"><House className="mr-2 inline" /> Open maker workspace</button>
        <button onClick={() => go('orders')} className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold"><Package className="mr-2 inline" /> Open my orders</button>
        <button onClick={() => go('registration')} className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold"><Leaf className="mr-2 inline" /> Add a maker profile</button>
      </div>
    </div>
    <div className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-6">{stats.map(([Icon, label, value]) => <Stat key={label} icon={Icon} label={label} value={value} />)}</div>
    <div className="mt-8 grid gap-7 lg:grid-cols-2">{cards.map((card) => <div key={card.pill} className={`rounded-[2rem] border border-[#e5ddd3] ${card.panel} p-8 sm:p-10`}><Pill>{card.pill}</Pill><h2 className="mt-6 font-serif text-3xl">{card.heading}</h2><p className="mt-4 leading-7 text-[#6f665d]">{card.copy}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{card.links.map(([label, Icon, target]) => <button key={label} onClick={() => go(target)} className={`rounded-2xl p-5 text-left font-bold ${card.panel === 'bg-white' ? 'bg-[#fffaf4]' : 'bg-white/70'}`}><Icon className={card.tone} /><span className="mt-4 block">{label}</span></button>)}</div></div>)}</div>
    <button onClick={() => go('pages')} className="mt-8 flex w-full items-center gap-6 rounded-[2rem] border border-[#e5ddd3] bg-white p-8 text-left transition hover:-translate-y-1 sm:p-10"><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#f7f3ed] text-[#d96c45]"><LayoutGrid /></span><span className="flex-1"><span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#d96c45]">Everything in one place</span><span className="mt-3 block font-serif text-3xl">All your pages, together</span><span className="mt-2 block leading-7 text-[#6f665d]">Every buying, selling and account screen lives in one searchable directory — no hunting through menus.</span></span><span className="hidden shrink-0 rounded-full bg-[#302c27] px-6 py-3.5 text-sm font-bold text-white sm:block">Open directory <ArrowRight className="ml-1 inline" /></span></button>
  </Shell>
}

function ArtisanDashboard({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { const actions: [string, React.ElementType, View, string][] = [['Listen to orders', Volume2, 'requests', '2 new'], ['My products', Package, 'listings', '6 listed'], ['Create listing', Plus, 'listings', 'Add a piece'], ['Custom requests', Sparkles, 'requests', '2 waiting'], ['Bulk orders', Users, 'bulk', '1 request'], ['My earnings', WalletCards, 'earnings', '₹48,200']]; return <Shell go={go} title="Good morning, Shobha" eyebrow="Maker workspace · part of your one account" action={<div className="flex flex-wrap justify-end gap-2"><button onClick={() => go('orders')} className="rounded-full border border-[#d9d0c5] px-4 py-3 text-sm font-bold"><Package className="mr-2 inline" /> Buying side</button><button onClick={() => notify('Voice mode is listening for Kannada or English')} className="rounded-full bg-[#d96c45] px-4 py-3 text-sm font-bold text-white"><Mic className="mr-2 inline" /> Voice mode</button></div>}><div className="rounded-[2rem] bg-[#d8e0cf] p-8"><div className="flex items-center gap-5"><div className="flex size-14 items-center justify-center rounded-full bg-[#dfb49b] font-serif text-xl">SH</div><div><p className="font-serif text-2xl">You have 2 things to review</p><p className="mt-1 text-sm text-[#6f665d]">We can read them aloud whenever you&apos;re ready. Your orders from other makers are one tap away.</p></div></div></div><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{actions.map(([label, Icon, target, sub]) => <button key={label} onClick={() => go(target)} className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8 text-left transition hover:-translate-y-1"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#f7f3ed] text-[#d96c45]"><Icon /></span><h3 className="mt-7 font-serif text-2xl">{label}</h3><p className="mt-1.5 text-sm text-[#8c8278]">{sub}</p></button>)}</div><button onClick={() => go('help')} className="mt-8 flex items-center gap-3 rounded-2xl border border-[#e5ddd3] bg-white p-5 text-left"><CircleHelp className="text-[#d96c45]" /><span><strong>Get help</strong><span className="ml-2 text-sm text-[#8c8278]">Talk to a facilitator or change language</span></span></button></Shell> }

function MemberShell({ title, eyebrow, go, side, children, action }: { title: string; eyebrow: string; go: (v: View) => void; side: MemberSide; children: React.ReactNode; action?: React.ReactNode }) {
  return <Shell go={go} title={title} eyebrow={eyebrow} action={action}>
    <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-[#e5ddd3] bg-white px-5 py-4">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6d59]">{sideNames[side]} pages</span>
      <span className="hidden text-sm text-[#8c8278] md:inline">Buying and selling live together in one account.</span>
      <div className="ml-auto flex gap-1 rounded-full bg-[#f7f3ed] p-1">{sideTabs.map((tab) => <button key={tab.side} onClick={() => go(tab.target)} className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab.side === side ? 'bg-[#302c27] text-white shadow-sm' : 'text-[#696158] hover:text-[#302c27]'}`}>{tab.label}</button>)}</div>
    </div>
    {children}
  </Shell>
}
function Listings({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { return <MemberShell go={go} side="selling" title="My products" eyebrow="Listing manager"><div className="flex justify-end"><button onClick={() => notify('New listing draft created')} className="rounded-full bg-[#d96c45] px-5 py-3 text-sm font-bold text-white"><Plus className="mr-2 inline" /> Create listing</button></div><div className="mt-7 grid gap-5">{products.slice(0,4).map((p) => <div key={p.id} className="flex items-center gap-5 rounded-2xl border border-[#e5ddd3] bg-white p-5"><div className={`flex size-16 items-center justify-center rounded-xl ${p.tone}`}><Package /></div><div className="flex-1"><h3 className="font-serif text-xl">{p.name}</h3><p className="mt-0.5 text-sm text-[#8c8278]">{p.price} · {p.tag}</p></div><button onClick={() => notify(`${p.name} preview opened`)} className="rounded-full border border-[#d9d0c5] px-5 py-2.5 text-sm font-bold">Edit</button></div>)}</div></MemberShell> }
function Requests({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { return <MemberShell go={go} side="selling" title="Custom requests" eyebrow="Listen, understand, propose"><div className="grid gap-7 lg:grid-cols-2">{['Marigold wedding tote', 'Coastal blue wall panel'].map((r, i) => <div key={r} className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8"><div className="flex items-center justify-between"><Pill>New request</Pill><button onClick={() => notify('Request summary read aloud')}><Volume2 /></button></div><h3 className="mt-6 font-serif text-2xl">{r}</h3><p className="mt-2 leading-7 text-[#6f665d]">Customer wants a meaningful handmade piece, flexible on small details, and needs it for a family celebration.</p><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-[#f7f3ed] p-3"><span className="block text-[#8c8278]">Budget</span><strong>₹2,000–₹3,000</strong></div><div className="rounded-xl bg-[#f7f3ed] p-3"><span className="block text-[#8c8278]">Due by</span><strong>{i ? 'Dec 10' : 'Nov 25'}</strong></div></div><div className="mt-6 flex gap-3"><button onClick={() => notify('Proposal draft saved')} className="flex-1 rounded-full bg-[#d96c45] px-4 py-3 text-sm font-bold text-white">Make proposal</button><button onClick={() => go('messages')} aria-label="Reply to buyer" className="rounded-full border px-4 py-3"><MessageCircle /></button></div></div>)}</div></MemberShell> }
function Production({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { const [step, setStep] = useState(1); const labels = ['Accepted', 'Start making', 'Upload progress', 'Ready to ship', 'Mark shipped']; return <MemberShell go={go} side="selling" title="Production orders" eyebrow="Keep buyers in the loop"><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10"><h2 className="font-serif text-3xl">Kasuti Garden Tote</h2><p className="mt-1.5 text-sm text-[#8c8278]">CB-2048 · Meera · due Nov 25</p><div className="mt-9 grid gap-4 md:grid-cols-5">{labels.map((l, i) => <button key={l} onClick={() => setStep(i)} className={`rounded-2xl p-5 text-left ${i <= step ? 'bg-[#d8e0cf]' : 'bg-[#f7f3ed]'}`}><span className="text-xs font-bold">{i + 1}</span><p className="mt-6 text-sm font-bold">{l}</p></button>)}</div><button onClick={() => { setStep(Math.min(4, step + 1)); notify('Buyer tracking updated') }} className="mt-8 rounded-full bg-[#302c27] px-6 py-3.5 text-sm font-bold text-white">Update to {labels[Math.min(4, step + 1)]} <ArrowRight className="ml-2 inline" /></button><button onClick={() => go('backup-pool')} className="ml-3 rounded-full border border-[#d9d0c5] px-6 py-3.5 text-sm font-bold">Backup buyer pool</button></div></MemberShell> }
function BulkOrders({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { return <MemberShell go={go} side="selling" title="CraftCircle bulk orders" eyebrow="Opportunities for makers"><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10"><Pill>Wedding planner · Bengaluru</Pill><h2 className="mt-6 font-serif text-3xl">120 embroidered welcome pouches</h2><div className="mt-6 grid gap-4 sm:grid-cols-3"><Stat icon={Package} label="Quantity" value="120" /><Stat icon={WalletCards} label="Budget per piece" value="₹850" /><Stat icon={Clock3} label="Deadline" value="45 days" /></div><p className="mt-7 text-lg leading-8 text-[#6f665d]">Looking for Kasuti or coastal embroidery with a warm, festive palette. Materials can be discussed.</p><button onClick={() => notify('Bulk proposal draft opened')} className="mt-7 rounded-full bg-[#d96c45] px-7 py-4 text-sm font-bold text-white">Submit bulk proposal <ArrowRight className="ml-2 inline" /></button></div></MemberShell> }
function Earnings({ go }: { go: (v: View) => void }) { return <MemberShell go={go} side="selling" title="FairCraft earnings" eyebrow="Know what your work earns"><div className="grid gap-6 sm:grid-cols-3"><Stat icon={WalletCards} label="Settled this month" value="₹48,200" /><Stat icon={BarChart3} label="In production" value="₹12,850" /><Stat icon={Package} label="Completed orders" value="24" /></div><div className="mt-10 rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10"><h2 className="font-serif text-2xl">This month&apos;s breakdown</h2><div className="mt-7 flex flex-col gap-5 text-[15px]">{[['Buyer payments', '₹58,500'], ['Materials', '− ₹6,800'], ['Packaging & platform', '− ₹3,500'], ['Your expected earnings', '₹48,200']].map(([l, v], i) => <div key={l} className={`flex justify-between ${i === 3 ? 'border-t pt-4 font-bold text-[#d96c45]' : 'text-[#6f665d]'}`}><span>{l}</span><span>{v}</span></div>)}</div></div></MemberShell> }
function AdminDashboard({ go, notify }: { go: (v: View) => void; notify: (m: string) => void }) { return <Shell go={go} title="Facilitator dashboard" eyebrow="Admin & assisted access"><div className="grid gap-6 sm:grid-cols-3"><Stat icon={Users} label="Artisans to verify" value="8" /><Stat icon={FileText} label="Listings to review" value="14" /><Stat icon={MessageCircle} label="Open support cases" value="3" /></div><div className="mt-10 grid gap-7 lg:grid-cols-2"><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8"><h2 className="font-serif text-2xl">Verification queue</h2><div className="mt-5">{['Anitha · Ilkal saree weaving', 'Ravi · Areca craft', 'Meenakshi · Kasuti'].map((x) => <div key={x} className="flex items-center justify-between gap-4 border-b py-5 last:border-0"><span>{x}</span><button onClick={() => notify(`${x.split(' · ')[0]} marked approved`)} className="rounded-full bg-[#d8e0cf] px-5 py-2.5 text-sm font-bold">Review</button></div>)}</div></div><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8"><h2 className="font-serif text-2xl">Safety & support</h2><div className="mt-6 flex flex-col gap-4"><button onClick={() => go('help')} className="flex items-center gap-3 rounded-2xl bg-[#f7f3ed] p-5 text-left"><CircleHelp className="text-[#d96c45]" /> Assisted registration</button><button onClick={() => notify('Translation support opened')} className="flex items-center gap-3 rounded-2xl bg-[#f7f3ed] p-5 text-left"><Volume2 className="text-[#d96c45]" /> Translation support</button><button onClick={() => notify('Dispute queue opened')} className="flex items-center gap-3 rounded-2xl bg-[#f7f3ed] p-5 text-left"><ShieldCheck className="text-[#d96c45]" /> Order disputes</button></div></div></div></Shell> }
function HelpPage({ go }: { go: (v: View) => void }) { return <Shell go={go} title="Help & language" eyebrow="You are not alone"><div className="grid gap-7 lg:grid-cols-2"><div className="rounded-[2rem] bg-[#302c27] p-9 text-[#fffaf4] sm:p-11"><Mic className="text-[#d7bc78]" /><h2 className="mt-9 font-serif text-4xl">Need a hand?</h2><p className="mt-5 text-lg leading-8 text-[#b9afa4]">Use voice guidance in Kannada or English, or ask a CraftBridge facilitator to help you register, list a product or understand an order.</p><button className="mt-9 rounded-full bg-[#d96c45] px-7 py-4 text-sm font-bold text-white">Talk to a facilitator</button></div><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-9"><h2 className="font-serif text-2xl">Frequently asked</h2><div className="mt-4">{['How does fair pricing work?', 'What is a craft passport?', 'Can I cancel a custom order?', 'How do I join as an artisan?'].map((q) => <button key={q} className="flex w-full items-center justify-between border-b py-6 text-left text-sm font-bold last:border-0">{q}<ChevronDown /></button>)}</div><div className="mt-7 flex gap-3"><button className="rounded-full bg-[#302c27] px-5 py-2.5 text-sm font-bold text-white">English</button><button className="rounded-full border border-[#d9d0c5] px-5 py-2.5 text-sm font-bold">ಕನ್ನಡ</button><button className="rounded-full border border-[#d9d0c5] px-5 py-2.5 text-sm font-bold">हिन्दी</button></div></div></div></Shell> }

type MemberSide = 'buying' | 'selling' | 'account'
type MemberPageData = { title: string; eyebrow: string; description: string; action: string; target: View; side: MemberSide }

const sideTabs: { side: MemberSide; label: string; target: View }[] = [
  { side: 'buying', label: 'Buying', target: 'orders' },
  { side: 'selling', label: 'Selling', target: 'artisan' },
  { side: 'account', label: 'Account', target: 'profile' },
]
const sideNames: Record<MemberSide, string> = { buying: 'Buying', selling: 'Selling', account: 'Account' }

const memberPages: Record<string, MemberPageData> = {
  cart: { side: 'buying', title: 'Your cart', eyebrow: 'Ready when you are', description: 'Kasuti Garden Tote · ₹1,850. Review your item before secure checkout.', action: 'Continue to checkout', target: 'checkout' },
  confirmation: { side: 'buying', title: 'Order confirmation', eyebrow: 'Thank you for supporting handmade', description: 'Order CB-2048 is confirmed. Your maker will begin after reviewing the agreed design.', action: 'Track order', target: 'tracking' },
  tracking: { side: 'buying', title: 'Track your order', eyebrow: 'Making journey', description: 'Your piece is currently in progress. The first flower row is complete and a new photo is available.', action: 'View craft passport', target: 'passport' },
  'custom-requests': { side: 'buying', title: 'Custom requests', eyebrow: 'Your ideas in progress', description: 'Two proposals are waiting for your review. Compare price, time, technique and included updates.', action: 'Compare proposals', target: 'proposals' },
  'backup-offers': { side: 'buying', title: 'Backup buyer offers', eyebrow: 'A second life for handmade work', description: 'A cancelled custom commission matches your saved interest. Accept or decline freely; interest is never a purchase.', action: 'View alternative offer', target: 'confirmation' },
  reviews: { side: 'buying', title: 'Share your experience', eyebrow: 'Review an artisan', description: 'Your review helps makers build trust and helps future buyers choose thoughtfully. Reviews you leave sit beside the pieces you sell.', action: 'Submit review', target: 'orders' },
  craftcircle: { side: 'buying', title: 'CraftCircle', eyebrow: 'Bulk orders', description: 'Companies, hotels and event planners can request Karnataka-themed gifts at scale from suitable artisan groups.', action: 'Create bulk request', target: 'bulk-orders' },
  'bulk-orders': { side: 'buying', title: 'Bulk orders', eyebrow: 'CraftCircle marketplace', description: 'Post a Karnataka-themed gift requirement, compare artisan group proposals and track quality and dispatch across a large order.', action: 'Create bulk request', target: 'craftcircle' },
  messages: { side: 'account', title: 'Messages', eyebrow: 'Your conversations', description: 'Discuss a product before you buy, ask questions during an order, or reply to buyers about your own listings — one shared inbox for both sides of every trade.', action: 'View custom requests', target: 'proposals' },
  notifications: { side: 'account', title: 'Notifications', eyebrow: 'Stay in the loop', description: 'Two new updates: Shobha uploaded a progress photo and a backup buyer offer is available.', action: 'Open backup offers', target: 'backup-offers' },
  settings: { side: 'account', title: 'Profile & accessibility', eyebrow: 'Shared settings', description: 'Choose your language, notification preferences and voice guidance options. Preferences apply to buying and selling alike.', action: 'Save preferences', target: 'profile' },
  about: { side: 'account', title: 'About CraftBridge', eyebrow: 'Our purpose', description: 'We connect local makers with customers while preserving craft, fair pay and the stories behind every piece.', action: 'Explore the catalogue', target: 'catalogue' },
  privacy: { side: 'account', title: 'Privacy', eyebrow: 'Your trust matters', description: 'We only use information needed to connect customers, artisans and facilitators safely.', action: 'Back to home', target: 'home' },
  terms: { side: 'account', title: 'Terms of use', eyebrow: 'CraftBridge policies', description: 'Custom concepts are references, seller-declared claims are clearly marked, and interest never means a confirmed purchase.', action: 'Get help', target: 'help' },
  verification: { side: 'selling', title: 'Verification status', eyebrow: 'Artisan onboarding', description: 'Your selling profile is under review. We will notify you when your craft story and identity are approved — your buying access stays active meanwhile.', action: 'Open maker workspace', target: 'artisan' },
  'create-listing': { side: 'selling', title: 'Create a listing', eyebrow: 'Product listing form', description: 'Add photos, price, materials, availability and the craft story that helps buyers understand your work.', action: 'Preview listing', target: 'listing-preview' },
  'listing-preview': { side: 'selling', title: 'Listing preview', eyebrow: 'Before you publish', description: 'Kasuti Garden Tote · ₹1,850. Your story, FairCraft breakdown and craft passport will appear on the product page.', action: 'Submit for review', target: 'listings' },
  'incoming-orders': { side: 'selling', title: 'Incoming orders', eyebrow: 'Orders to review', description: 'Two new custom requests and one confirmed order are waiting for your attention.', action: 'Open request details', target: 'request-details' },
  'request-details': { side: 'selling', title: 'Request details', eyebrow: 'Listen, understand, propose', description: 'Marigold wedding tote with a ₹2,000–₹3,000 budget, due November 25. The buyer welcomes small design suggestions.', action: 'Create proposal', target: 'proposal-builder' },
  'proposal-builder': { side: 'selling', title: 'Proposal builder', eyebrow: 'FairCraft proposal', description: 'Set a fair price, delivery date, materials and included progress updates. Buyers can request revisions before approving.', action: 'Submit proposal', target: 'proposal-status' },
  'proposal-status': { side: 'selling', title: 'Proposal status', eyebrow: 'Waiting for the buyer', description: 'Your proposal is with Meera. We will notify you when it is approved or when a revision is requested.', action: 'View production', target: 'production' },
  progress: { side: 'selling', title: 'Progress update', eyebrow: 'Production management', description: 'Upload a photo, add a short update and keep the buyer connected to the making process.', action: 'Save progress update', target: 'production' },
  'backup-pool': { side: 'selling', title: 'Backup buyer pool', eyebrow: 'Protect your time', description: 'Register eligible commissions and describe reusable features before offering them to interested buyers.', action: 'Register eligible item', target: 'bulk' },
  'craft-story': { side: 'selling', title: 'Craft story editor', eyebrow: 'Your passport', description: 'Add origin, techniques, materials, working hours and process evidence. Seller-declared claims stay clearly labelled.', action: 'Save craft story', target: 'passport' },
  'bulk-requests': { side: 'selling', title: 'Bulk request catalogue', eyebrow: 'CraftCircle opportunities', description: 'Browse requests from companies, hotels and wedding planners and submit offers as an individual maker or group.', action: 'Open bulk request', target: 'bulk' },
  'bulk-management': { side: 'selling', title: 'Bulk order management', eyebrow: 'CraftCircle operations', description: 'Coordinate quantities, group proposals, quality checks and dispatch for large orders.', action: 'Open CraftCircle', target: 'bulk' },
  'verification-queue': { side: 'selling', title: 'Artisan verification', eyebrow: 'Facilitator workspace', description: 'Review identity, craft evidence, origin and assistance needs before approving a maker profile.', action: 'Review next artisan', target: 'admin' },
  'listing-review': { side: 'selling', title: 'Listing review', eyebrow: 'Facilitator workspace', description: 'Check product details, pricing transparency, claims and images before publishing.', action: 'Open listing queue', target: 'admin' },
  'order-support': { side: 'selling', title: 'Order support', eyebrow: 'Facilitator workspace', description: 'Help buyers and makers resolve delivery, revision, cancellation or payment questions.', action: 'Open support queue', target: 'help' },
  'assisted-access': { side: 'selling', title: 'Assisted access', eyebrow: 'Facilitator tools', description: 'Register makers, translate instructions, read orders aloud and confirm important actions with visual fallbacks.', action: 'Start assisted session', target: 'help' },
}
const memberViews = Object.keys(memberPages) as View[]

type PageSection = 'Discover' | 'Commission' | 'Maker workspace' | 'Account' | 'Help & admin'
type PageEntry = { title: string; blurb: string; section: PageSection; icon: React.ElementType }
const pageSections: PageSection[] = ['Discover', 'Commission', 'Maker workspace', 'Account', 'Help & admin']

const pageDirectory: Record<View, PageEntry> = {
  pages: { title: 'All pages', blurb: 'Search and open every CraftBridge screen from one index.', section: 'Discover', icon: LayoutGrid },
  home: { title: 'Home', blurb: 'Landing page with the collection, the studio and the makers.', section: 'Discover', icon: House },
  catalogue: { title: 'Explore crafts', blurb: 'Search and filter handmade pieces by craft, maker or name.', section: 'Discover', icon: Package },
  product: { title: 'Product details', blurb: 'Price, FairCraft breakdown, buy now or request a customisation.', section: 'Discover', icon: Heart },
  artisans: { title: 'Meet the makers', blurb: 'Directory of verified artisans with ratings and completed orders.', section: 'Discover', icon: Users },
  'artisan-profile': { title: 'Artisan profile', blurb: 'Craft story, origin, ratings and a way to request a custom order.', section: 'Discover', icon: UserRound },
  craftcircle: { title: 'CraftCircle', blurb: 'Bulk Karnataka-themed gift requests from companies and planners.', section: 'Discover', icon: Users },
  'bulk-orders': { title: 'Bulk orders', blurb: 'Post a bulk gift requirement and compare group proposals.', section: 'Discover', icon: Truck },
  about: { title: 'About CraftBridge', blurb: 'Our purpose: fair pay, living craft traditions and honest stories.', section: 'Discover', icon: Leaf },

  studio: { title: 'Design studio', blurb: 'Describe an idea by text or voice and get matched to makers.', section: 'Commission', icon: Sparkles },
  matches: { title: 'Artisan matches', blurb: 'Makers suited to your brief, ranked with ratings and reply time.', section: 'Commission', icon: Users },
  proposals: { title: 'Compare proposals', blurb: 'Price, delivery time and included updates, side by side.', section: 'Commission', icon: FileText },
  'custom-requests': { title: 'Custom requests', blurb: 'Proposals waiting for your review and revision questions.', section: 'Commission', icon: Sparkles },
  checkout: { title: 'Checkout', blurb: 'Delivery details and simulated payment for a demo order.', section: 'Commission', icon: CreditCard },
  cart: { title: 'Your cart', blurb: 'Review saved items before you continue to checkout.', section: 'Commission', icon: Package },
  confirmation: { title: 'Order confirmation', blurb: 'Receipt and next steps once an order is confirmed.', section: 'Commission', icon: Check },
  tracking: { title: 'Track your order', blurb: 'Follow the making journey, updates and progress photos.', section: 'Commission', icon: MapPin },
  orders: { title: 'My orders', blurb: 'Ready-made and custom orders with step-by-step status.', section: 'Commission', icon: Truck },
  passport: { title: 'Digital craft passport', blurb: 'Origin, technique, materials and verification for a piece.', section: 'Commission', icon: ShieldCheck },
  reviews: { title: 'Reviews', blurb: 'Rate a maker after delivery and help other buyers choose.', section: 'Commission', icon: Star },
  'backup-offers': { title: 'Backup buyer offers', blurb: 'Second-chance offers on commissions you saved interest in.', section: 'Commission', icon: Heart },
  messages: { title: 'Messages', blurb: 'Product questions, order updates and replies from both sides of a trade.', section: 'Commission', icon: MessageCircle },

  artisan: { title: 'Maker workspace', blurb: 'Home for everything you sell: orders, listings and earnings.', section: 'Maker workspace', icon: Leaf },
  listings: { title: 'My products', blurb: 'Manage the listings you have published, edit or add new ones.', section: 'Maker workspace', icon: Package },
  'create-listing': { title: 'Create a listing', blurb: 'Photos, price, materials, availability and your craft story.', section: 'Maker workspace', icon: Plus },
  'listing-preview': { title: 'Listing preview', blurb: 'See the product page before you submit it for review.', section: 'Maker workspace', icon: FileText },
  requests: { title: 'Custom requests', blurb: 'New commission briefs you can read and propose for.', section: 'Maker workspace', icon: MessageCircle },
  'incoming-orders': { title: 'Incoming orders', blurb: 'Orders and requests waiting for your attention.', section: 'Maker workspace', icon: Package },
  'request-details': { title: 'Request details', blurb: 'Read the buyer brief, budget and due date in full.', section: 'Maker workspace', icon: FileText },
  'proposal-builder': { title: 'Proposal builder', blurb: 'Set a fair price, delivery date, materials and updates.', section: 'Maker workspace', icon: FileText },
  'proposal-status': { title: 'Proposal status', blurb: 'Track approvals and revision requests from buyers.', section: 'Maker workspace', icon: Clock3 },
  production: { title: 'Production orders', blurb: 'Move an accepted order from making to shipped.', section: 'Maker workspace', icon: Clock3 },
  progress: { title: 'Progress update', blurb: 'Upload a photo and a note so buyers stay in the loop.', section: 'Maker workspace', icon: BarChart3 },
  'backup-pool': { title: 'Backup buyer pool', blurb: 'Re-offer a cancelled commission to interested buyers.', section: 'Maker workspace', icon: Heart },
  'craft-story': { title: 'Craft story editor', blurb: 'Add origin, techniques, materials and process evidence.', section: 'Maker workspace', icon: FileText },
  bulk: { title: 'Bulk opportunities', blurb: 'Open CraftCircle requests you can bid on as a maker.', section: 'Maker workspace', icon: Users },
  'bulk-requests': { title: 'Bulk request catalogue', blurb: 'Browse company, hotel and wedding-planner requirements.', section: 'Maker workspace', icon: Users },
  'bulk-management': { title: 'Bulk order management', blurb: 'Quantities, group proposals, quality checks and dispatch.', section: 'Maker workspace', icon: Truck },
  earnings: { title: 'FairCraft earnings', blurb: 'What your work earns, with a transparent breakdown.', section: 'Maker workspace', icon: WalletCards },
  registration: { title: 'Become an artisan', blurb: 'Guided maker registration with facilitator assistance.', section: 'Maker workspace', icon: Plus },
  verification: { title: 'Verification status', blurb: 'Progress of your maker profile review and next steps.', section: 'Maker workspace', icon: ShieldCheck },

  profile: { title: 'My CraftBridge', blurb: 'One hub holding your buying, selling and account pages.', section: 'Account', icon: UserRound },
  'customer-dashboard': { title: 'My CraftBridge (old link)', blurb: 'The former customer dashboard now opens the same unified hub.', section: 'Account', icon: UserRound },
  settings: { title: 'Profile & accessibility', blurb: 'Language, notifications and voice guidance preferences.', section: 'Account', icon: Settings },
  notifications: { title: 'Notifications', blurb: 'Order updates, progress photos and backup offers in one feed.', section: 'Account', icon: Bell },
  login: { title: 'Sign in', blurb: 'One account for buying from makers and selling your own work.', section: 'Account', icon: UserRound },
  privacy: { title: 'Privacy', blurb: 'How information is used to connect buyers, makers and facilitators.', section: 'Account', icon: ShieldCheck },
  terms: { title: 'Terms of use', blurb: 'Policies for concepts, seller-declared claims and interest.', section: 'Account', icon: FileText },

  help: { title: 'Help & language', blurb: 'Voice guidance, FAQs and a facilitator you can talk to.', section: 'Help & admin', icon: CircleHelp },
  admin: { title: 'Facilitator dashboard', blurb: 'Verification, listing review, disputes and assisted access.', section: 'Help & admin', icon: Users },
  'verification-queue': { title: 'Artisan verification', blurb: 'Review identity, craft evidence and origin before approval.', section: 'Help & admin', icon: ShieldCheck },
  'listing-review': { title: 'Listing review', blurb: 'Check details, pricing transparency, claims and images.', section: 'Help & admin', icon: FileText },
  'order-support': { title: 'Order support', blurb: 'Resolve delivery, revision, cancellation or payment issues.', section: 'Help & admin', icon: CircleHelp },
  'assisted-access': { title: 'Assisted access', blurb: 'Register, translate and read orders aloud with visual fallbacks.', section: 'Help & admin', icon: Mic },
}

function PageDirectory({ go }: { go: (v: View) => void }) {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<'All' | PageSection>('All')
  const views = Object.keys(pageDirectory) as View[]
  const q = query.trim().toLowerCase()
  const matches = (view: View) => {
    const entry = pageDirectory[view]
    const inSection = section === 'All' || entry.section === section
    const inQuery = !q || `${entry.title} ${entry.blurb} ${entry.section} ${view}`.toLowerCase().includes(q)
    return inSection && inQuery
  }
  const visible = views.filter(matches)
  return <Shell go={go} title="All pages" eyebrow={`${views.length} screens · nothing hidden`}>
    <div className="flex flex-col gap-4 rounded-3xl border border-[#e5ddd3] bg-white p-4 md:flex-row md:items-center">
      <div className="flex flex-1 items-center gap-3 px-3"><Search className="text-[#8c8278]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages, e.g. listing, earnings, privacy" className="w-full bg-transparent py-2.5 outline-none" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X className="size-4 text-[#8c8278]" /></button>}</div>
      <div className="flex gap-2 overflow-x-auto">{(['All', ...pageSections] as ('All' | PageSection)[]).map((s) => <button key={s} onClick={() => setSection(s)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold ${section === s ? 'bg-[#302c27] text-white' : 'bg-[#f7f3ed]'}`}>{s}</button>)}</div>
    </div>
    <p className="mt-5 text-sm text-[#8c8278]">Showing {visible.length} of {views.length} pages</p>
    {visible.length === 0
      ? <div className="mt-6 rounded-3xl border border-dashed border-[#d9d0c5] bg-white p-10 text-center"><p className="font-serif text-2xl">No pages match “{query}”.</p><p className="mt-2 text-sm text-[#8c8278]">Try “orders”, “listing”, “earnings” or clear the search.</p><button onClick={() => { setQuery(''); setSection('All') }} className="mt-5 rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Show all pages</button></div>
      : <div className="mt-8 flex flex-col gap-14">{pageSections.map((s) => { const items = visible.filter((v) => pageDirectory[v].section === s); if (!items.length) return null; return <div key={s}><div className="flex items-baseline gap-3"><h2 className="font-serif text-2xl">{s}</h2><span className="text-sm text-[#8c8278]">{items.length} pages</span></div><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((v) => { const entry = pageDirectory[v]; const Icon = entry.icon; return <button key={v} onClick={() => go(v)} className="rounded-3xl border border-[#e5ddd3] bg-white p-7 text-left transition hover:-translate-y-1"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#f7f3ed] text-[#d96c45]"><Icon /></span><h3 className="mt-6 font-serif text-xl">{entry.title}</h3><p className="mt-2 text-sm leading-6 text-[#8c8278]">{entry.blurb}</p><span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.14em] text-[#8a6d59]">{entry.section}</span></button> })}</div></div> })}</div>}
  </Shell>
}

function AuthPage({ go, notify }: { go: (v: View) => void; notify: (message: string) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [interests, setInterests] = useState({ buying: true, selling: true })
  const toggle = (key: 'buying' | 'selling') => setInterests((state) => ({ ...state, [key]: !state[key] }))
  return <Shell go={go} title={mode === 'login' ? 'Welcome back' : 'Create your account'} eyebrow="CraftBridge access"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[2rem] bg-[#302c27] p-9 text-[#fffaf4] sm:p-11"><Pill>One account · buyer and maker</Pill><h2 className="mt-10 font-serif text-4xl">{mode === 'login' ? 'Keep every making journey together.' : 'Buy from makers and sell what you make.'}</h2><p className="mt-5 leading-7 text-[#b9afa4]">Save designs, compare proposals, track orders, list your own work and return to the people you love — all from the same sign-in.</p></div><div className="rounded-3xl border border-[#e5ddd3] bg-white p-7"><div className="flex rounded-full bg-[#f7f3ed] p-1"><button onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${mode === 'login' ? 'bg-white shadow-sm' : 'text-[#8c8278]'}`}>Sign in</button><button onClick={() => setMode('signup')} className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${mode === 'signup' ? 'bg-white shadow-sm' : 'text-[#8c8278]'}`}>Create account</button></div><h3 className="mt-8 font-serif text-3xl">{mode === 'login' ? 'Sign in to CraftBridge' : 'Create your account'}</h3>{mode === 'signup' && <><p className="mt-5 text-sm text-[#6f665d]">One account covers both sides. Choose what you want to do first — you can switch any time.</p><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => toggle('buying')} className={`rounded-2xl border p-4 text-left ${interests.buying ? 'border-[#d96c45] bg-[#fffaf4]' : 'border-[#e5ddd3]'}`}><Search className="text-[#d96c45]" /><strong className="mt-3 block">Buy crafts</strong><span className="text-xs text-[#8c8278]">Shop and commission</span></button><button onClick={() => toggle('selling')} className={`rounded-2xl border p-4 text-left ${interests.selling ? 'border-[#d96c45] bg-[#fffaf4]' : 'border-[#e5ddd3]'}`}><Leaf className="text-[#d96c45]" /><strong className="mt-3 block">Sell crafts</strong><span className="text-xs text-[#8c8278]">List your own work</span></button></div></>}<div className="mt-6 grid gap-4">{mode === 'signup' && <input className="rounded-xl border p-3" placeholder="Full name" required />}<input className="rounded-xl border p-3" placeholder="Email or phone number" required /><input className="rounded-xl border p-3" placeholder="Password" type="password" required /></div><button onClick={() => { notify(mode === 'login' ? 'Signed in successfully' : 'Account created — buying and selling are both ready'); go('profile') }} className="mt-7 w-full rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white">{mode === 'login' ? 'Sign in securely' : 'Create account'} <ArrowRight className="ml-2 inline" /></button>{mode === 'signup' && <button onClick={() => go('registration')} className="mt-3 w-full rounded-full border border-[#d9d0c5] px-4 py-3 text-sm font-bold">Add a maker profile & craft evidence</button>}<p className="mt-5 text-center text-xs text-[#8c8278]">Demo authentication only — no real credentials are stored.</p></div></div></Shell>
}

function ArtisanRegistration({ go, notify }: { go: (v: View) => void; notify: (message: string) => void }) {
  return <Shell go={go} title="Become an artisan" eyebrow="Guided registration"><div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10"><p className="text-lg leading-8 text-[#6f665d]">Tell us about your craft. A facilitator can help you complete this form, upload evidence and choose your preferred language. Your buying access keeps working while this is reviewed.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><input className="rounded-xl border p-3" placeholder="Your full name" required /><input className="rounded-xl border p-3" placeholder="Phone number" required /><select className="rounded-xl border p-3"><option>Kannada</option><option>English</option><option>Hindi</option></select><input className="rounded-xl border p-3" placeholder="Village / city" required /><select className="rounded-xl border p-3 sm:col-span-2"><option>Kasuti embroidery</option><option>Beedu craft</option><option>Coastal weaving</option><option>Handloom weaving</option></select><textarea className="min-h-32 rounded-xl border p-3 sm:col-span-2" placeholder="Tell us how you learned your craft and what you make" /><label className="flex items-center gap-3 rounded-2xl border border-dashed p-4 text-sm font-bold sm:col-span-2"><Upload className="text-[#d96c45]" /> Upload craft evidence <input type="file" className="hidden" /></label></div><button onClick={() => { notify('Registration submitted for verification'); go('verification') }} className="mt-7 rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white">Submit for verification <ArrowRight className="ml-2 inline" /></button></div><div className="h-fit rounded-3xl bg-[#d8e0cf] p-7"><Mic className="text-[#5b795d]" /><h2 className="mt-6 font-serif text-3xl">Need help?</h2><p className="mt-3 leading-7 text-[#6f665d]">Request facilitator assistance or use voice guidance while registering.</p><button onClick={() => notify('Facilitator request received')} className="mt-7 rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Request facilitator help</button></div></div></Shell>
}

function MemberPage({ view, go, notify }: { view: string; go: (v: View) => void; notify: (message: string) => void }) {
  const page = memberPages[view]
  const sideTone: Record<MemberSide, string> = { buying: 'bg-[#ead8a8]', selling: 'bg-[#d8e0cf]', account: 'bg-[#e8d8c6]' }
  const sideCopy: Record<MemberSide, string> = {
    buying: 'Everything you buy sits beside everything you sell — same account, no second login.',
    selling: 'Your maker tools and your shopping share one account, so switching sides takes one tap.',
    account: 'These settings apply to both your buying and your selling activity.',
  }
  const SideIcon = page.side === 'selling' ? Leaf : page.side === 'buying' ? Package : Sparkles
  return <MemberShell go={go} title={page.title} eyebrow={page.eyebrow} side={page.side}>
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      <div className="flex flex-col justify-between rounded-[2rem] border border-[#e5ddd3] bg-white p-8 sm:p-10">
        <div>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fffaf4] text-[#d96c45]"><SideIcon /></span>
          <p className="mt-8 max-w-xl text-xl leading-9 text-[#6f665d]">{page.description}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <button onClick={() => { notify('Saved successfully'); go(page.target) }} className="rounded-full bg-[#d96c45] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#c85f3c">{page.action} <ArrowRight className="ml-2 inline" /></button>
          <button onClick={() => notify('Voice summary started')} className="rounded-full border border-[#d9d0c5] px-7 py-4 text-sm font-bold transition hover:bg-[#f7f3ed]"><Volume2 className="mr-2 inline" /> Read aloud</button>
        </div>
      </div>
      <div className={`flex flex-col justify-between rounded-[2rem] p-8 sm:p-10 ${sideTone[page.side]}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6d59]">{sideNames[page.side]} side</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight">One account, both sides of every trade.</h2>
          <p className="mt-4 text-lg leading-8 text-[#6f665d]">{sideCopy[page.side]}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <button onClick={() => go(sideTabs.find((t) => t.side === page.side)?.target ?? 'profile')} className="rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Open {sideNames[page.side].toLowerCase()} home</button>
          <button onClick={() => go('help')} className="rounded-full border border-[#c9b78e] px-5 py-3 text-sm font-bold">Get help</button>
        </div>
      </div>
    </div>
  </MemberShell>
}

function BackupPool({ go, notify, items, offers, onOffer }: { go: (v: View) => void; notify: (m: string) => void; items: PoolItem[]; offers: BackupOffer[]; onOffer: (orderId: string) => void }) {
  const eligible = items.filter(isEligible)
  const accepted = offers.filter((o) => o.status === 'accepted').length
  return <MemberShell go={go} side="selling" title="Backup buyer pool" eyebrow="Protect your time" action={<button onClick={() => speakText('Backup buyer pool. When a custom order is cancelled, a completed or in-progress piece can be offered to customers who previously expressed interest in similar designs. Buyers may accept or decline freely.', () => notify('Voice guidance is unavailable on this device.'))} className="rounded-full border border-[#d9d0c5] px-4 py-2.5 text-sm font-bold"><Volume2 className="mr-2 inline" /> Read aloud</button>}>
    <div className="grid gap-5 sm:grid-cols-3">
      <Stat icon={Package} label="Eligible cancelled pieces" value={String(eligible.length)} />
      <Stat icon={Heart} label="Offers sent" value={String(offers.length)} />
      <Stat icon={Check} label="Accepted by buyers" value={String(accepted)} />
    </div>
    <div className="mt-7 rounded-3xl border border-[#e5ddd3] bg-white p-6 sm:p-7">
      <p className="max-w-3xl text-sm leading-6 text-[#6f665d]">When a custom order is cancelled, a completed or in-progress piece can be re-offered to customers who previously expressed interest in similar designs. Buyers stay free to accept or decline — an expression of interest is never a purchase.</p>
    </div>
    {items.length === 0
      ? <div className="mt-7 rounded-3xl border border-dashed border-[#d9d0c5] bg-white p-10 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f7f3ed] text-[#d96c45]"><Heart /></span><p className="mt-5 font-serif text-2xl">No cancelled commissions yet.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8c8278]">If a custom order is cancelled, its piece will appear here so you can offer it to interested customers.</p><button onClick={() => go('orders')} className="mt-5 rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Open my orders</button></div>
      : <div className="mt-7 flex flex-col gap-6">{items.map((item) => {
        const eligibleItem = isEligible(item)
        const matched = matchedBuyers(item)
        const itemOffers = offers.filter((o) => o.orderId === item.orderId)
        return (
          <article key={item.orderId} className="rounded-[2rem] border border-[#e5ddd3] bg-white p-7 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className={`flex min-h-28 w-full shrink-0 items-center justify-center rounded-3xl sm:w-28 ${item.tone}`}><Package /></div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>{eligibleItem ? 'Eligible' : 'Not eligible'}</Pill>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${eligibleItem ? 'bg-[#d8e0cf] text-[#5b795d]' : 'bg-[#f0ebe4] text-[#8c8278]'}`}>{item.stage === 'in-progress' ? 'In progress' : item.stage === 'completed' ? 'Completed' : 'Shipped'}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl">{item.productName}</h3>
                <p className="mt-1 text-sm text-[#8c8278]">{item.orderId} · {item.craft} · {item.price} · {item.place}</p>
                <p className="mt-2 text-sm text-[#6f665d]">Cancelled {item.cancelledOn} · {eligibilityNote(item)}</p>
              </div>
            </div>
            {eligibleItem ? <>
              <div className="mt-6 rounded-2xl bg-[#f7f3ed] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6d59]">Previously interested in similar designs ({matched.length})</p>
                <div className="mt-4 flex flex-col gap-3">{matched.map((interest) => {
                  const offer = itemOffers.find((o) => o.buyer === interest.buyer)
                  return (
                    <div key={interest.buyer} className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold">{interest.initials}</span>
                      <div className="min-w-0 flex-1"><p className="text-sm font-bold">{interest.buyer}</p><p className="truncate text-xs text-[#8c8278]">{interest.note}</p></div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${offer ? offerStatusTone[offer.status] : 'bg-white text-[#8c8278]'}`}>{offer ? offerStatusLabel[offer.status] : 'Not offered yet'}</span>
                    </div>
                  )
                })}</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {item.offered
                  ? <span className="rounded-full bg-[#d8e0cf] px-5 py-3 text-sm font-bold text-[#5b795d]"><Check className="mr-2 inline size-4" />Offer sent · waiting for replies</span>
                  : matched.length
                    ? <button onClick={() => onOffer(item.orderId)} className="rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white">Offer to {matched.length} interested buyer{matched.length === 1 ? '' : 's'} <ArrowRight className="ml-2 inline" /></button>
                    : <span className="rounded-full bg-[#f7f3ed] px-5 py-3 text-sm font-bold text-[#8c8278]">No saved interests match this design yet</span>}
                <button onClick={() => go('messages')} className="rounded-full border border-[#d9d0c5] px-6 py-3.5 text-sm font-bold"><MessageCircle className="mr-2 inline" /> Message buyers</button>
              </div>
            </> : (
              <div className="mt-6 rounded-2xl bg-[#f0ebe4] p-5 text-sm leading-6 text-[#6f665d]"><ShieldCheck className="mr-2 inline text-[#8c8278]" />A backup offer can only be made from a completed or in-progress piece. {eligibilityNote(item)}.</div>
            )}
          </article>
        )
      })}</div>}
  </MemberShell>
}

function BackupOffers({ go, notify, offers, onRespond }: { go: (v: View) => void; notify: (m: string) => void; offers: BackupOffer[]; onRespond: (id: string, status: OfferStatus) => void }) {
  const pending = offers.filter((o) => o.status === 'offered')
  const resolved = offers.filter((o) => o.status !== 'offered')
  const acceptedCount = offers.filter((o) => o.status === 'accepted').length
  return <MemberShell go={go} side="buying" title="Backup buyer offers" eyebrow="A second life for handmade work" action={<button onClick={() => speakText('Backup buyer offers. A cancelled custom commission matches a design you saved. You may accept or decline freely. Accepting is optional and interest is never a purchase.', () => notify('Voice guidance is unavailable on this device.'))} className="rounded-full border border-[#d9d0c5] px-4 py-2.5 text-sm font-bold"><Volume2 className="mr-2 inline" /> Read aloud</button>}>
    <div className="rounded-[2rem] bg-[#ead8a8] p-7 sm:p-8">
      <p className="max-w-3xl font-serif text-2xl leading-snug">A cancelled custom commission matches a design you saved.</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6f665d]">Accept if you love it, decline if you don&apos;t — both are free, and expressing interest is never a purchase.</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-[#fffaf4]/80 px-4 py-2 font-bold">{pending.length} awaiting your reply</span><span className="rounded-full bg-[#fffaf4]/80 px-4 py-2 font-bold">{acceptedCount} accepted</span></div>
    </div>
    {offers.length === 0
      ? <div className="mt-7 rounded-3xl border border-dashed border-[#d9d0c5] bg-white p-10 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f7f3ed] text-[#d96c45]"><Heart /></span><p className="mt-5 font-serif text-2xl">No backup offers right now.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8c8278]">Save designs you love and start a conversation with a maker — if a similar custom order is cancelled, we will offer the piece here first.</p><button onClick={() => go('catalogue')} className="mt-5 rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Explore crafts</button></div>
      : <div className="mt-7 flex flex-col gap-6">{[...pending, ...resolved].map((offer) => offer.status === 'declined' || offer.status === 'unavailable'
        ? <div key={offer.id} className="flex items-center gap-4 rounded-2xl border border-[#e5ddd3] bg-white/70 p-5 text-sm text-[#8c8278]"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${offer.tone}`}><Package /></span><p className="flex-1"><strong className="text-[#696158]">{offer.productName}</strong> · {offer.status === 'declined' ? 'declined — hidden from your feed.' : 'another buyer accepted this piece, so this offer is no longer available.'}</p>{offer.status === 'declined' && <button onClick={() => onRespond(offer.id, 'offered')} className="rounded-full border border-[#d9d0c5] px-4 py-2 text-xs font-bold">Undo</button>}</div>
        : (
          <article key={offer.id} className="rounded-[2rem] border border-[#e5ddd3] bg-white p-7 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className={`flex min-h-32 w-full shrink-0 items-end rounded-3xl p-5 sm:w-52 ${offer.tone}`}>
                <span className="rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{offer.craft}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>Backup offer</Pill>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${offerStatusTone[offer.status]}`}>{offer.status === 'accepted' ? 'Reserved for you' : 'Awaiting your reply'}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl">{offer.productName}</h3>
                <p className="mt-1 text-sm text-[#8c8278]">{offer.orderId} · cancelled custom commission · {offer.price}</p>
                <div className="mt-4 rounded-2xl bg-[#f7f3ed] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6d59]">Why this matched</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#6f665d]">Prior interest — {offer.matchReason}.</p>
                </div>
                {offer.status === 'offered' ? <>
                  <p className="mt-4 text-xs leading-5 text-[#8c8278]">Accepting is optional. Declining changes nothing — interest is never a purchase.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => onRespond(offer.id, 'accepted')} className="rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white">Accept this piece <Check className="ml-2 inline size-4" /></button>
                    <button onClick={() => onRespond(offer.id, 'declined')} className="rounded-full border border-[#d9d0c5] px-6 py-3.5 text-sm font-bold">No thanks, decline</button>
                    <button onClick={() => go('messages')} className="rounded-full border border-[#d9d0c5] px-6 py-3.5 text-sm font-bold"><MessageCircle className="mr-2 inline" /> Ask a question</button>
                  </div>
                </> : <>
                  <p className="mt-4 text-sm leading-6 text-[#5b795d]">Accepted — this piece is reserved for you. Nothing is charged until you continue to checkout.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => go('checkout')} className="rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white">Continue to checkout <ArrowRight className="ml-2 inline" /></button>
                    <button onClick={() => go('catalogue')} className="rounded-full border border-[#d9d0c5] px-6 py-3.5 text-sm font-bold">Keep browsing</button>
                  </div>
                </>}
              </div>
            </div>
          </article>
        ))}</div>}
  </MemberShell>
}

function Conversation({ go, threads, activeThreadId, onSelect, onSend, onViewProduct, notify }: { go: (v: View) => void; threads: Thread[]; activeThreadId: number; onSelect: (id: number) => void; onSend: (text: string) => void; onViewProduct: (id: number) => void; notify: (m: string) => void }) {
  const [draft, setDraft] = useState('')
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [translations, setTranslations] = useState<Record<string, { text: string; tl: string; label: string }>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const active = threads.find((t) => t.id === activeThreadId) ?? threads[0]
  const isOrder = Boolean(active.orderId)
  const product = active.productId !== null ? products.find((p) => p.id === active.productId) : undefined
  const send = (value: string) => { const text = value.trim(); if (!text) return; onSend(text); setDraft('') }
  const langOptions: { tl: string; label: string }[] = [{ tl: 'kn', label: 'ಕನ್ನಡ' }, { tl: 'hi', label: 'हिन्दी' }, { tl: 'en', label: 'English' }]
  const translateMsg = async (m: ChatMessage, tl: string, label: string) => {
    const key = `${active.id}:${m.id}`
    setMenuFor(null)
    if (translations[key]?.tl === tl) { setTranslations((s) => { const next = { ...s }; delete next[key]; return next }); return }
    setBusyId(key)
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(m.text)}`)
      const data = await res.json()
      const text = (data?.[0] ?? []).map((seg: unknown[]) => (seg as string[])[0]).join('')
      if (!text) throw new Error('empty translation')
      setTranslations((s) => ({ ...s, [key]: { text, tl, label } }))
    } catch {
      notify('Translation is unavailable right now. Please try again.')
    } finally {
      setBusyId(null)
    }
  }
  const quick = isOrder
    ? ['Is it on track for Nov 25?', 'Could we try a deeper indigo?', 'Thank you so far!']
    : ['What materials do you use?', 'Can it be customised?', 'How long is delivery?']
  return <MemberShell go={go} side="account" title="Messages" eyebrow="One inbox · buying and selling together">
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] xl:grid-cols-[17rem_1fr_.55fr]">
      <div className="h-fit rounded-3xl border border-[#e5ddd3] bg-white p-3">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6d59]">Conversations</p>
          <span className="text-xs text-[#8c8278]">{threads.length}</span>
        </div>
        <div className="flex flex-col gap-1">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1]
            return (
              <button key={t.id} onClick={() => { setMenuFor(null); onSelect(t.id) }} className={`rounded-2xl p-4 text-left ${t.id === active.id ? 'bg-[#fffaf4]' : 'hover:bg-[#f7f3ed]'}`}>
                <div className="flex items-center gap-3">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${t.tone} text-xs font-bold`}>{t.initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{t.title}</p>
                    <p className="truncate text-xs text-[#8c8278]">{t.subject}</p>
                  </div>
                </div>
                <p className="mt-2 truncate text-xs text-[#6f665d]">{last ? `${last.from === 'you' ? 'You: ' : ''}${last.text}` : 'No messages yet'}</p>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${t.orderId ? 'bg-[#ead8a8] text-[#8a6d59]' : 'bg-[#d8e0cf] text-[#5b795d]'}`}>{t.context}</span>
              </button>
            )
          })}
        </div>
        <button onClick={() => go('catalogue')} className="mt-2 w-full rounded-2xl border border-dashed border-[#d9d0c5] px-3 py-3 text-sm font-bold text-[#6f665d] hover:bg-[#f7f3ed]"><Plus className="mr-2 inline size-4" /> Discuss a product</button>
      </div>
      <div className="flex flex-col overflow-hidden rounded-3xl border border-[#e5ddd3] bg-white">
        <div className="flex items-center gap-4 border-b border-[#e5ddd3] bg-[#fffaf4] p-5">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${active.tone} font-bold`}>{active.initials}</div>
          <div className="min-w-0"><p className="truncate font-serif text-xl">{active.title}</p><p className="truncate text-sm text-[#8c8278]">{active.subtitle}</p></div>
          <span className={`ml-auto hidden shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider sm:block ${isOrder ? 'bg-[#ead8a8] text-[#8a6d59]' : 'bg-[#d8e0cf] text-[#5b795d]'}`}>{active.context}</span>
        </div>
        <div className="flex max-h-[30rem] min-h-96 flex-col gap-4 overflow-y-auto bg-[#f7f3ed] p-6">
          {active.messages.map((m) => {
            const key = `${active.id}:${m.id}`
            const trans = translations[key]
            const menuOpen = menuFor === key
            return (
              <div key={m.id} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.from === 'you' ? 'bg-[#d96c45] text-white' : 'border border-[#e5ddd3] bg-white text-[#302c27]'}`}>
                  <p>{m.text}</p>
                  {trans && (
                    <div className={`mt-2 rounded-xl px-3 py-2 text-xs leading-5 ${m.from === 'you' ? 'bg-white/15' : 'bg-[#f7f3ed]'}`}>
                      <p className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${m.from === 'you' ? 'text-white/70' : 'text-[#8a6d59]'}`}>Translated to {trans.label}</p>
                      <p>{trans.text}</p>
                    </div>
                  )}
                  <div className={`mt-1 flex items-center gap-2 text-[11px] ${m.from === 'you' ? 'text-white/70' : 'text-[#8c8278]'}`}>
                    <span>{m.from === 'you' ? 'You' : active.title.split(' ')[0]} · {m.time}</span>
                    <button onClick={() => setMenuFor(menuOpen ? null : key)} title="Translate message" aria-label="Translate message" className={`flex size-5 items-center justify-center rounded-full ${m.from === 'you' ? 'bg-white/15 hover:bg-white/25' : 'bg-[#f0ebe4] hover:bg-[#e5ddd3]'}`}>
                      <Languages className="size-3" />
                    </button>
                  </div>
                  {menuOpen && (
                    <div className="absolute bottom-full right-0 z-20 mb-1 w-28 rounded-xl border border-[#e5ddd3] bg-white p-1 text-[#302c27] shadow-xl">
                      {langOptions.map((opt) => (
                        <button key={opt.tl} onClick={() => translateMsg(m, opt.tl, opt.label)} disabled={busyId === key} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-[#f7f3ed] ${trans?.tl === opt.tl ? 'text-[#d96c45]' : 'text-[#6f665d]'}`}>
                          {opt.label}
                          {trans?.tl === opt.tl && <X className="size-3" />}
                        </button>
                      ))}
                      {busyId === key && <p className="px-2.5 py-1.5 text-[10px] text-[#8c8278]">Translating…</p>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t border-[#e5ddd3] p-5">
          <div className="flex flex-wrap gap-2">{quick.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-[#d9d0c5] px-3.5 py-2 text-xs font-bold text-[#6f665d] hover:bg-[#f7f3ed]">{q}</button>)}</div>
          <div className="mt-4 flex gap-2"><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(draft) }} placeholder={`Write a message to ${active.title.split(' ')[0]}`} className="min-w-0 flex-1 rounded-xl border border-[#d9d0c5] px-4 py-3.5 outline-none" /><button onClick={() => send(draft)} className="rounded-full bg-[#d96c45] px-6 py-3.5 text-sm font-bold text-white">Send</button></div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#8c8278]"><button onClick={() => notify('Voice note recording is a demo')} className="font-bold"><Mic className="mr-1 inline size-4" /> Voice note</button><span>Every message has a translate button — choose ಕನ್ನಡ, हिन्दी or English.</span></div>
        </div>
      </div>
      <div className="h-fit rounded-3xl bg-[#ead8a8] p-8">
        <Pill>{isOrder ? 'Order context' : 'Product context'}</Pill>
        <h2 className="mt-6 font-serif text-2xl">{active.subject}</h2>
        {isOrder ? <>
          <p className="mt-1 text-sm text-[#6f665d]">{active.orderId} · {product?.price} · {active.due}</p>
          <div className="mt-5 flex flex-col gap-3 text-sm"><div className="flex justify-between"><span>Status</span><strong>{active.status}</strong></div><div className="flex justify-between"><span>Delivery estimate</span><strong>10–14 days</strong></div></div>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => go('orders')} className="rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">Track this order <ArrowRight className="ml-2 inline" /></button>
            <button onClick={() => go('passport')} className="rounded-full border border-[#c9b78e] px-5 py-3 text-sm font-bold">View craft passport</button>
            <button onClick={() => go('proposals')} className="rounded-full border border-[#c9b78e] px-5 py-3 text-sm font-bold">Open proposals</button>
          </div>
        </> : <>
          <p className="mt-1 text-sm text-[#6f665d]">{product?.price} · {product?.craft} · {product?.place}</p>
          <p className="mt-4 text-sm leading-6 text-[#6f665d]">{product?.description}</p>
          <div className="mt-5 flex flex-col gap-3 text-sm"><div className="flex justify-between"><span>Maker</span><strong>{active.title}</strong></div><div className="flex justify-between"><span>Reply time</span><strong>{active.due}</strong></div></div>
          <div className="mt-6 flex flex-col gap-3">
            {active.productId !== null && <button onClick={() => onViewProduct(active.productId!)} className="rounded-full bg-[#302c27] px-5 py-3 text-sm font-bold text-white">View product <ArrowRight className="ml-2 inline" /></button>}
            <button onClick={() => go('studio')} className="rounded-full border border-[#c9b78e] px-5 py-3 text-sm font-bold">Request customization</button>
            <button onClick={() => go('catalogue')} className="rounded-full border border-[#c9b78e] px-5 py-3 text-sm font-bold">Browse more crafts</button>
          </div>
        </>}
      </div>
    </div>
  </MemberShell>
}
