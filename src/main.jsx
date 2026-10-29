import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownRight, ArrowUpRight, AudioLines, ChevronLeft, ChevronRight, Disc3, Headphones, Heart, Menu, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import './styles.css';

const base = import.meta.env.BASE_URL;
const film = `${base}media/ju-jingyi-film.mp4`;
const track = `${base}media/blue-hour.mp3`;
const moments = [
  { src: `${base}media/gallery/ju-jingyi-11.jpg`, number: '01', title: 'The timeless gaze', note: 'A frame to keep' },
  { src: `${base}media/gallery/ju-jingyi-10.jpg`, number: '02', title: 'A moment in blue', note: 'Between light & shadow' },
  { src: `${base}media/gallery/ju-jingyi-09.jpg`, number: '03', title: 'Veiled in dreams', note: 'A little moment of magic' },
  { src: `${base}media/gallery/ju-jingyi-08.jpg`, number: '04', title: 'Golden hour', note: 'Where the light stays' },
  { src: `${base}media/gallery/ju-jingyi-07.jpg`, number: '05', title: 'Softly, she shines', note: 'A softer kind of light' },
  { src: `${base}media/gallery/ju-jingyi-06.jpg`, number: '06', title: 'A quiet afternoon', note: 'Little things, remembered' },
  { src: `${base}media/gallery/ju-jingyi-05.jpg`, number: '07', title: 'Between the pages', note: 'A story of her own' },
  { src: `${base}media/gallery/ju-jingyi-04.jpg`, number: '08', title: 'Monochrome mood', note: 'Beauty in the stillness' },
  { src: `${base}media/gallery/ju-jingyi-03.jpg`, number: '09', title: 'Crimson afterglow', note: 'A different kind of magic' },
  { src: `${base}media/gallery/ju-jingyi-02.jpg`, number: '10', title: 'Into the red', note: 'Bold as a daydream' },
  { src: `${base}media/gallery/ju-jingyi-01.jpg`, number: '11', title: 'A final little moment', note: 'Until the next scene' },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function App() {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [activeMoment, setActiveMoment] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bars, setBars] = useState(Array.from({ length: 34 }, (_, i) => 5 + ((i * 13) % 18)));
  useReveal();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let raf;
    const animate = () => {
      if (playing) setBars(Array.from({ length: 34 }, () => 4 + Math.random() * 28));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveMoment(null);
      if (activeMoment !== null && e.key === 'ArrowRight') setActiveMoment((v) => (v + 1) % moments.length);
      if (activeMoment !== null && e.key === 'ArrowLeft') setActiveMoment((v) => (v - 1 + moments.length) % moments.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeMoment]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { try { await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); } }
  };
  const formatTime = (time) => `${Math.floor(time / 60).toString().padStart(2, '0')}:${Math.floor(time % 60).toString().padStart(2, '0')}`;
  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setProgress(pct * duration);
  };
  const jumpTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return <>
    <div className="scroll-line" style={{ transform: `scaleX(${scrollProgress})` }} />
    <header className="nav">
      <a className="brand" href="#home" aria-label="Blue Hour home"><span className="brand-mark">J</span><span>BLUE HOUR<span className="brand-sub">A FAN TRIBUTE</span></span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <button onClick={() => jumpTo('story')}>THE STORY</button><button onClick={() => jumpTo('film')}>THE FILM</button><button onClick={() => jumpTo('moments')}>MOMENTS</button><button onClick={() => jumpTo('letter')}>A LETTER</button>
      </nav>
      <button className="nav-music" onClick={togglePlay} aria-label={playing ? 'Pause music' : 'Play music'}>{playing ? <Pause size={14}/> : <Play size={14}/>} <span>{playing ? 'PAUSE SOUND' : 'PLAY SOUND'}</span></button>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <video className="hero-video" ref={videoRef} src={film} autoPlay muted loop playsInline preload="metadata" />
        <div className="hero-overlay" />
        <div className="hero-grain" />
        <div className="hero-side-label">AN APPRECIATION IN MOTION <span /> 2026</div>
        <div className="hero-content">
          <p className="eyebrow reveal-delay">A LITTLE WORLD, MADE FOR YOU</p>
          <h1 className="hero-title"><span>JU</span><span className="title-second">JINGYI<span className="title-period">.</span></span></h1>
          <div className="hero-bottomline"><p>Some people feel like a scene<br/>you never want to leave.</p><button className="circle-link" onClick={() => jumpTo('story')} aria-label="Scroll to story"><ArrowDown size={20}/></button></div>
        </div>
        <div className="hero-index"><span>01</span><i /> <span>04</span></div>
        <div className="hero-caption">鞠婧祎 <span>—</span> THE BLUE HOUR EDITION</div>
      </section>

      <section className="intro section-pad" id="story">
        <div className="section-kicker" data-reveal><span>01 / THE STORY</span><span className="kicker-line"/><span>AN OPEN LETTER</span></div>
        <div className="intro-grid">
          <div className="intro-heading" data-reveal><p className="eyebrow">WHEN THE WORLD SLOWS DOWN</p><h2>For the moments<br/>that <em>stay.</em></h2></div>
          <div className="intro-copy" data-reveal><span className="quote-mark">“</span><p>There is a kind of light that never asks for attention. It simply arrives, softens the edges of the day, and makes an ordinary moment feel unforgettable.</p><p className="muted-copy">This little corner of the internet is for that feeling — and for Ju Jingyi, whose moments on screen we return to, again and again.</p><div className="signature">WITH LOVE, ALWAYS <span>♡</span></div></div>
        </div>
        <div className="intro-foot" data-reveal><span>NOT AN OFFICIAL WEBSITE</span><span>MADE WITH ADMIRATION & CARE</span></div>
      </section>

      <div className="marquee" aria-label="A tribute to Ju Jingyi"><div className="marquee-track">{Array.from({length: 4}, (_, i) => <React.Fragment key={i}><span>Every frame, a feeling</span><b>✳</b><span>鞠婧祎 · Ju Jingyi</span><b>✳</b><span>Stay a little longer</span><b>✳</b></React.Fragment>)}</div></div>

      <section className="film-section" id="film">
        <div className="film-heading section-pad" data-reveal><div><div className="section-kicker"><span>02 / MOVING PICTURE</span><span className="kicker-line"/></div><h2>A moment, <em>in motion.</em></h2></div><p>Press play. Stay awhile.<br/>Let the feeling find you.</p></div>
        <div className="film-frame" data-reveal><video src={film} controls playsInline preload="metadata" poster={`${base}media/gallery/ju-jingyi-11.jpg`}/><div className="film-frame-label"><span>JU JINGYI — VISUAL DIARY</span><span>00:29 / A MEMORY</span></div></div>
      </section>

      <section className="sound-section section-pad" id="sound">
        <div className="sound-orb" aria-hidden="true"><div className="orb-ring ring-one"/><div className="orb-ring ring-two"/><Disc3 className={playing ? 'disc spinning' : 'disc'} strokeWidth={0.7}/><span className="orb-star">✳</span></div>
        <div className="sound-copy" data-reveal><div className="section-kicker"><span>03 / THE SOUNDTRACK</span><span className="kicker-line"/></div><p className="eyebrow">A SOUND FOR THE SOFTER HOURS</p><h2>Let the music<br/><em>say it for you.</em></h2><p className="sound-description">A melody to accompany the little things — the scenes, the memories, the feelings that words can’t quite hold.</p>
          <div className="audio-player"><button className="play-button" onClick={togglePlay} aria-label={playing ? 'Pause soundtrack' : 'Play soundtrack'}>{playing ? <Pause fill="currentColor" size={18}/> : <Play fill="currentColor" size={18}/>}</button><div className="player-main"><div className="player-meta"><span>BLUE HOUR — SOUNDTRACK</span><span>{formatTime(progress)} <i>/</i> {formatTime(duration)}</span></div><div className="visualizer" onClick={seek} role="slider" aria-label="Seek soundtrack" aria-valuemin={0} aria-valuemax={Math.floor(duration)} aria-valuenow={Math.floor(progress)}>{bars.map((height, i) => <span key={i} style={{ height: `${playing ? height : 5 + (i % 4) * 2}px` }}/>)}</div></div><button className="volume-button" onClick={() => { if (audioRef.current) { audioRef.current.muted = !muted; setMuted(!muted); } }} aria-label={muted ? 'Unmute soundtrack' : 'Mute soundtrack'}>{muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button></div>
          <audio ref={audioRef} src={track} preload="metadata" onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)} onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
          <p className="audio-hint"><Headphones size={13}/> Best enjoyed with headphones <span>·</span> Sound starts when you press play</p>
        </div>
      </section>

      <section className="moments-section section-pad" id="moments">
        <div className="moments-heading" data-reveal><div><div className="section-kicker"><span>04 / LITTLE MOMENTS</span><span className="kicker-line"/></div><h2>Collected <em>in light.</em></h2></div><p>Little moments from a world<br/>we’d visit a thousand times.</p></div>
        <div className="gallery-grid">{moments.map((moment, i) => <button className={`gallery-card card-${i + 1}`} key={moment.number} onClick={() => setActiveMoment(i)} data-reveal style={{'--delay': `${i * 100}ms`}}><div className="gallery-image-wrap"><img src={moment.src} alt={`Ju Jingyi — ${moment.title}`} loading="lazy"/><span className="gallery-open"><ArrowUpRight size={18}/></span></div><div className="gallery-meta"><span>{moment.number} / {moment.note}</span><span>{moment.title}</span></div></button>)}</div>
        <div className="gallery-bottom" data-reveal><span>EVERY FRAME, A FEELING.</span><span className="tiny-star">✳</span><span>SCROLL SLOWLY, STAY LONGER.</span></div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-bg" />
        <div className="letter-content" data-reveal><p className="eyebrow">A NOTE FOR YOU</p><div className="letter-flower">✳</div><h2>May you always find<br/>your way <em>to the light.</em></h2><p className="letter-body">Thank you for the stories, the little sparks of joy, and the moments that somehow make an ordinary day feel a little more beautiful.</p><p className="letter-sign">Until the next scene, <span>♡</span></p><div className="letter-rule"/><span className="letter-credit">A FAN-MADE TRIBUTE TO JU JINGYI · 鞠婧祎</span></div>
      </section>
    </main>

    <footer className="footer"><a className="footer-brand" href="#home">BLUE HOUR<span>JU JINGYI TRIBUTE</span></a><span>MADE WITH A LITTLE EXTRA HEART <Heart size={12} fill="currentColor"/></span><button onClick={() => jumpTo('home')}>BACK TO THE TOP <ArrowUpRight size={14}/></button></footer>

    <div className={`mini-player ${playing ? 'mini-playing' : ''}`}><button onClick={togglePlay} aria-label={playing ? 'Pause soundtrack' : 'Play soundtrack'}>{playing ? <Pause size={14}/> : <Play size={14}/>}</button><div className="mini-track"><span>BLUE HOUR</span><div><i style={{width: `${duration ? (progress / duration) * 100 : 0}%`}}/></div></div><AudioLines size={15}/></div>

    {activeMoment !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onClick={() => setActiveMoment(null)}><button className="lightbox-close" onClick={() => setActiveMoment(null)} aria-label="Close gallery"><X/></button><button className="lightbox-arrow left" onClick={(e) => {e.stopPropagation(); setActiveMoment((activeMoment - 1 + moments.length) % moments.length)}} aria-label="Previous image"><ChevronLeft/></button><div className="lightbox-content" onClick={(e) => e.stopPropagation()}><img src={moments[activeMoment].src} alt={moments[activeMoment].title}/><div className="lightbox-caption"><span>{moments[activeMoment].number} / {moments[activeMoment].note}</span><h3>{moments[activeMoment].title}</h3></div></div><button className="lightbox-arrow right" onClick={(e) => {e.stopPropagation(); setActiveMoment((activeMoment + 1) % moments.length)}} aria-label="Next image"><ChevronRight/></button></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
