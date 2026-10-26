import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowUpRight, Check, Clock3, Gift, Heart, Music2,
  Pause, Play, Sparkles, Volume2, VolumeX
} from "lucide-react";

const PHOTO_MEMORIES = [
  {
    image: "/photos/memory-1.jpg",
    date: "A favourite chapter",
    caption: "Some moments become memories. Some people make every moment special."
  },
  {
    image: "/photos/memory-2.jpg",
    date: "My safe place",
    caption: "In a world that never slows down, you will always be my home."
  },
  {
    image: "/photos/memory-3.jpg",
    date: "Us, always",
    caption: "My favourite plans are the ones that have you in every tomorrow."
  },
  {
    image: "/photos/memory-4.jpg",
    caption: "Your smile, my favourite view",
    date: "LITTLE MOMENTS",
  },
  {
    image: "/photos/memory-5.jpg",
    caption: "Every day with you",
    date: "JUST US",
  },
   {
    image: "/photos/memory-6.jpg",
    caption: "You make life magical",
    date: "MY HAPPINESS",
  },
    {
    image: "/photos/memory-7.jpg",
    caption: "A thousand reasons to smile",
    date: "MY FAVOURITE DAYS",
  },
   {
    image: "/photos/memory-8.jpg",
    caption: "And our story continues…",
    date: "TO BE CONTINUED",
  },
];

function MoonScene() {
  return (
    <div className="sky-scene" aria-hidden="true">
      <div className="sky-glow" />
      <div className="moon">
        <span className="moon-crater crater-one" />
        <span className="moon-crater crater-two" />
        <span className="moon-crater crater-three" />
      </div>
      <span className="star star-a">✦</span>
      <span className="star star-b">✧</span>
      <span className="star star-c">✦</span>
      <span className="star star-d">·</span>
      <span className="star star-e">✧</span>
      <span className="star star-f">·</span>
      <span className="horizon horizon-one" />
      <span className="horizon horizon-two" />
    </div>
  );
}

function Countdown({ targetDate }) {
  const getRemaining = () => {
    const difference = new Date(targetDate).getTime() - Date.now();
    if (!Number.isFinite(difference) || difference <= 0) return null;
    return {
      hours: Math.floor(difference / 3_600_000),
      minutes: Math.floor((difference % 3_600_000) / 60_000),
      seconds: Math.floor((difference % 60_000) / 1000)
    };
  };
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return <p className="countdown-note">Set your local moonrise time in the server config to start the countdown.</p>;
  }

  return (
    <div className="countdown" aria-live="polite">
      {remaining ? (
        <>
          <div className="time-unit"><strong>{String(remaining.hours).padStart(2, "0")}</strong><span>Hours</span></div>
          <span className="time-colon">:</span>
          <div className="time-unit"><strong>{String(remaining.minutes).padStart(2, "0")}</strong><span>Minutes</span></div>
          <span className="time-colon">:</span>
          <div className="time-unit"><strong>{String(remaining.seconds).padStart(2, "0")}</strong><span>Seconds</span></div>
        </>
      ) : (
        <p className="moon-arrived"><Sparkles size={18} /> May your evening be filled with love and light.</p>
      )}
    </div>
  );
}

function MemoryCard({ memory, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className={`memory-card memory-card-${index + 1}`}>
      <div className={`memory-image ${imageFailed ? "image-placeholder" : ""}`}>
        {!imageFailed ? (
          <img src={memory.image} alt={`Memory ${index + 1}`} onError={() => setImageFailed(true)} />
        ) : (
          <div className="placeholder-content">
            <Heart size={30} strokeWidth={1.2} />
            <span>Add your photo</span>
            <small>{memory.image.replace("/photos/", "")}</small>
          </div>
        )}
        <span className="image-number">0{index + 1}</span>
      </div>
      <div className="memory-copy">
        <span className="eyebrow">{memory.date}</span>
        <p>{memory.caption}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [surprise, setSurprise] = useState(null);
  const [error, setError] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicError, setMusicError] = useState(false);

  useEffect(() => {
    fetch("/api/surprise")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the surprise.");
        return response.json();
      })
      .then(setSurprise)
      .catch(() => setError("The love note couldn't load from the server. Please make sure the Express server is running."));
  }, []);

  const memories = useMemo(() => PHOTO_MEMORIES, []);

  const toggleMusic = async () => {
    const audio = document.getElementById("background-music");
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    try {
      await audio.play();
      setMusicOn(true);
      setMusicError(false);
    } catch {
      setMusicError(true);
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main>
      <audio id="background-music" src="/music/our-song.mp3" loop preload="none" onError={() => setMusicError(true)} />
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Back to top"><span className="brand-mark">P<span>♥</span>S</span><span className="brand-label">A little love story</span></a>
        <div className="top-actions">
          <span className="top-note"><span className="live-dot" /> Made just for you</span>
          <button className="music-button" onClick={toggleMusic} aria-label={musicOn ? "Pause music" : "Play music"}>
            {musicOn ? <Pause size={16} /> : <Music2 size={16} />}
            <span>{musicOn ? "Pause music" : "Play music"}</span>
          </button>
        </div>
      </header>

      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <div className="overline"><span /> KARWA CHAUTH · A NOTE FROM THE HEART <span /></div>
          <h1>For my moon,<br /><em>my Surbhi.</em></h1>
          <p className="hero-intro">If I could ask the moon for one thing tonight, it would be to keep bringing me back to you—in every lifetime, in every little moment.</p>
          <div className="hero-signature"><span className="signature-line" /><span>Forever yours, Pallav</span></div>
          <button className="primary-button" onClick={() => scrollTo("letter")}>Open your little surprise <Heart size={17} fill="currentColor" /></button>
          <div className="scroll-cue" onClick={() => scrollTo("memories")} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && scrollTo("memories")}><span className="scroll-icon"><ArrowDown size={14} /></span> A little further, my love</div>
        </div>
        <div className="hero-art">
          <MoonScene />
          <div className="moon-caption"><span className="caption-rule" /><span>Even the moon knows<br />you are my favourite.</span></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <span className="floating-heart heart-one">♥</span><span className="floating-heart heart-two">♡</span>
        </div>
        <div className="hero-bottom-note"><Sparkles size={14} /> A tiny corner of the internet, made with a whole lot of love.</div>
      </section>

      <section className="dedication section-shell" id="letter">
        <div className="section-kicker"><span>01</span><span className="kicker-line" /> THE WORDS I WANT YOU TO KEEP</div>
        <div className="dedication-grid">
          <div className="dedication-heading">
            <span className="mini-flower">✳</span>
            <h2>Some things are<br />better said <em>from the heart.</em></h2>
            <p>Today is a reminder of the love we share—and of all the ordinary, beautiful days I still want with you.</p>
            <button className="text-button" onClick={() => setLetterOpen((value) => !value)}>
              {letterOpen ? "Fold the letter" : "Read your letter"} {letterOpen ? <ArrowDown size={16} /> : <ArrowUpRight size={16} />}
            </button>
          </div>
          <div className={`letter-card ${letterOpen ? "letter-card-open" : ""}`}>
            <div className="letter-top"><span>To my dearest Surbhi</span><Heart size={17} /></div>
            <div className="letter-decoration">❧</div>
            {letterOpen ? (
              <div className="letter-body">
                <p>My dearest Surbhi,</p>
                <p>Happy Karwa Chauth, my love. ❤️</p>
                <p>There are a thousand ways to say “I love you,” but none of them feels big enough for what you mean to me. You make the ordinary feel special, the difficult feel possible, and every place feel a little more like home.</p>
                <p>Today, I don't just celebrate our love. I celebrate you—your smile, your kindness, your little ways of making my world better. Thank you for being my partner, my peace, and my favourite person.</p>
                <p>May we keep choosing each other, laughing together, growing together, and finding new reasons to fall in love in all the years ahead.</p>
                <p>All my love, today and always,</p>
                <p className="letter-sign">Your Pallav <span>♥</span></p>
              </div>
            ) : (
              <div className="letter-teaser">
                <span className="letter-script">My dearest Surbhi,</span>
                <p>There are a thousand ways to say “I love you,” but none of them feels big enough...</p>
                <button className="letter-open" onClick={() => setLetterOpen(true)}>Unfold this letter <span>↗</span></button>
              </div>
            )}
            <div className="letter-footer"><span>MADE WITH LOVE</span><span>✦</span><span>ALWAYS & FOREVER</span></div>
          </div>
        </div>
      </section>

      
      <section className="memories-section" id="memories">
        <div className="section-shell memories-inner">

          <div className="section-kicker">
            <span>02</span>
            <span className="kicker-line" />
            OUR LITTLE WORLD
            <span className="kicker-line" />
            <span>♥</span>
          </div>

          <div className="memories-heading">
            <div className="memories-heading-copy">
              <p className="memories-overline">A LOVE THAT LIVES IN EVERY MOMENT</p>
              <h2>
                Every picture tells
                <br />
                <em>our love story.</em>
              </h2>
            </div>

            <div className="memories-intro">
              <span className="memories-heart">♡</span>
              <p>
                From little smiles to unforgettable days,
                every memory becomes more beautiful
                because I get to share it with you, Surbhi.
              </p>
              <span className="memories-signature">Forever yours, Pallav</span>
            </div>
          </div>

          <div className="memories-gallery-top">
            <span className="gallery-caption">
              <span className="gallery-caption-dot" />
              OUR PRECIOUS MOMENTS
            </span>

            <span className="gallery-count">
              <strong>{String(memories.length).padStart(2, "0")}</strong>
              <span> BEAUTIFUL MEMORIES</span>
            </span>
          </div>

          <div className="memories-gallery-frame">
            <div className="memories-gallery-decoration decoration-top">
              ✧
            </div>
            <div className="memories-gallery-decoration decoration-bottom">
              ✧
            </div>

            <div className="memories-grid">
              {memories.map((memory, index) => (
                <MemoryCard
                  key={memory.image}
                  memory={memory}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="memories-footer">
            <span className="memories-footer-line" />
            <span className="memories-footer-heart">♥</span>
            <p>My favourite place will always be beside you.</p>
            <span className="memories-footer-line" />
          </div>

          <p className="photo-tip">
            <Sparkles size={14} />
            Every photo is a little piece of our forever. Add more memories
            to make this gallery uniquely ours.
          </p>

        </div>
      </section>


      <section className="moonrise section-shell" id="moonrise">
        <div className="moonrise-art"><MoonScene /><span className="moonrise-orbit" /></div>
        <div className="moonrise-copy">
          <div className="section-kicker"><span>03</span><span className="kicker-line" /> UNDER THE SAME SKY</div>
          <h2>Waiting for the moon,<br /><em>thinking of you.</em></h2>
          <p>Every second brings us closer to that beautiful moonlit moment. Until then, here's a little countdown to make the waiting sweeter.</p>
          <div className="countdown-label"><Clock3 size={15} /> TIME UNTIL YOUR MOONLIT MOMENT</div>
          <Countdown targetDate={surprise?.moonriseAt} />
          <p className="countdown-note">{surprise?.moonriseLabel || "Remember to set the moonrise time for your city and date."}</p>
        </div>
      </section>

      <section className="gift-section" id="gift">
        <div className="gift-spark gift-spark-one">✦</div><div className="gift-spark gift-spark-two">✧</div>
        <div className="gift-content">
          <div className="section-kicker centered"><span>04</span><span className="kicker-line" /> ONE LAST LITTLE THING <span className="kicker-line" /></div>
          <div className={`gift-illustration ${giftOpen ? "gift-open" : ""}`} aria-hidden="true">
            <div className="gift-glow" /><div className="gift-box"><div className="gift-lid" /><div className="gift-ribbon-v" /><div className="gift-ribbon-h" /><div className="gift-bow bow-left" /><div className="gift-bow bow-right" /></div>
            {giftOpen && <div className="gift-hearts"><span>♥</span><span>✦</span><span>♥</span><span>✧</span><span>♥</span></div>}
          </div>
          {!giftOpen ? (
            <>
              <h2>There's one more thing,<br /><em>my love.</em></h2>
              <p>A little promise, wrapped up just for you.</p>
              <button className="primary-button gift-button" onClick={() => setGiftOpen(true)}><Gift size={17} /> Reveal your surprise</button>
            </>
          ) : (
            <div className="gift-reveal">
              <span className="reveal-label"><Sparkles size={15} /> YOUR LITTLE PROMISE</span>
              <h2>My gift is <em>always you.</em></h2>
              <p>I promise to keep showing up for you, to celebrate your wins, hold your hand through the hard days, make you laugh when you need it most, and never stop finding new ways to love you.</p>
              <p className="gift-signature">Happy Karwa Chauth, Surbhi. ❤️<br /><span>— Pallav, your person for all seasons.</span></p>
              <button className="text-button" onClick={() => setGiftOpen(false)}>Wrap it up again <ArrowUpRight size={15} /></button>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-mark">P<span>♥</span>S</div>
        <p>For Surbhi, with all the love in the world.</p>
        <span className="footer-date">MADE FOR KARWA CHAUTH · ALWAYS YOURS, PALLAV</span>
        {error && <p className="api-error" role="status">{error}</p>}
        {musicError && <p className="api-error" role="status">Add your own MP3 at <code>client/public/music/our-song.mp3</code> to enable music.</p>}
        {surprise?.message && <span className="sr-only">{surprise.message}</span>}
      </footer>
    </main>
  );
}



// import { useEffect, useState } from "react";
// import "./style.css";

// const memories = [
//   { src: "/photos/memory-1.jpg", caption: "My favourite person ❤️" },
//   { src: "/photos/memory-2.jpg", caption: "A memory I treasure ✨" },
//   { src: "/photos/memory-3.jpg", caption: "You make life beautiful 🌹" },
//   { src: "/photos/memory-4.jpg", caption: "Forever, you and me 💕" },
// ];

// const letter = [
//   "My dearest Surbhi,",
//   "If I could make one wish every day, it would always be to see you smile.",
//   "You make ordinary moments feel magical, and every day with you is a gift I never want to take for granted.",
//   "On this Karwa Chauth, I wish you happiness, good health, endless love, and all the beautiful things your heart dreams of.",
//   "No matter how many moons rise, my heart will keep choosing you.",
//   "Thank you for being my love, my happiness, and my favourite part of life.",
//   "With all my love, today and always,",
//   "Yours forever, Pallav ❤️",
// ];

// function getCountdown(target) {
//   const remaining = Math.max(0, target - Date.now());

//   return {
//     days: Math.floor(remaining / 86400000),
//     hours: Math.floor((remaining / 3600000) % 24),
//     minutes: Math.floor((remaining / 60000) % 60),
//     seconds: Math.floor((remaining / 1000) % 60),
//     finished: remaining === 0,
//   };
// }

// function App() {
//   const [moonrise, setMoonrise] = useState(null);
//   const [countdown, setCountdown] = useState(null);
//   const [letterOpen, setLetterOpen] = useState(false);
//   const [giftOpen, setGiftOpen] = useState(false);
//   const [selectedPhoto, setSelectedPhoto] = useState(null);
//   const [musicPlaying, setMusicPlaying] = useState(false);
//   const [photoErrors, setPhotoErrors] = useState({});
//   const [musicError, setMusicError] = useState(false);

//   useEffect(() => {
//     let timer;
//     let cancelled = false;

//     async function loadMoonrise() {
//       try {
//         const response = await fetch("/api/surprise");
//         if (!response.ok) throw new Error("Countdown unavailable");

//         const data = await response.json();
//         const date = new Date(data.moonriseAt);

//         if (!Number.isNaN(date.getTime()) && !cancelled) {
//           setMoonrise(date);
//           setCountdown(getCountdown(date.getTime()));
//         }
//       } catch {
//         // The site still works if the countdown API is unavailable.
//         console.warn("Could not load moonrise time from /api/surprise.");
//       }
//     }

//     loadMoonrise();

//     timer = window.setInterval(() => {
//       setMoonrise((date) => {
//         if (date) {
//           setCountdown(getCountdown(date.getTime()));
//         }
//         return date;
//       });
//     }, 1000);

//     return () => {
//       cancelled = true;
//       window.clearInterval(timer);
//     };
//   }, []);

//   async function toggleMusic() {
//     const audio = document.getElementById("love-song");
//     if (!audio) return;

//     if (musicPlaying) {
//       audio.pause();
//       setMusicPlaying(false);
//       return;
//     }

//     try {
//       await audio.play();
//       setMusicPlaying(true);
//       setMusicError(false);
//     } catch {
//       setMusicError(true);
//     }
//   }

//   return (
//     <main className="site-shell">
//       <div className="stars" aria-hidden="true" />
//       <div className="glow glow-one" aria-hidden="true" />
//       <div className="glow glow-two" aria-hidden="true" />

//       <audio
//         id="love-song"
//         src="/music/our-song.mp3"
//         loop
//         onEnded={() => setMusicPlaying(false)}
//         onPause={() => setMusicPlaying(false)}
//         onPlay={() => setMusicPlaying(true)}
//         onError={() => setMusicError(true)}
//       />

//       <nav className="topbar">
//         <a className="brand" href="#home">S <span>♥</span> P</a>
//         <button className="music-button" onClick={toggleMusic}>
//           {musicPlaying ? "Ⅱ Pause music" : "♫ Play our song"}
//         </button>
//       </nav>

//       <section className="hero section" id="home">
//         <div className="moon-wrap" aria-hidden="true">
//           <div className="moon">☾</div>
//           <span className="moon-spark spark-a">✧</span>
//           <span className="moon-spark spark-b">✦</span>
//           <span className="moon-spark spark-c">✧</span>
//         </div>

//         <p className="eyebrow">A little surprise, made with love</p>
//         <h1>For my beloved <em>Surbhi</em></h1>
//         <p className="hero-copy">
//           Tonight, the moon shines a little brighter,
//           because my world is filled with you.
//         </p>

//         <div className="names">Pallav <span>♥</span> Surbhi</div>
//         <a className="gold-button" href="#memories">Open your surprise ↓</a>

//         <div className="countdown-card">
//           <p className="eyebrow">Until our moonlit moment</p>
//           {countdown ? (
//             countdown.finished ? (
//               <p className="moon-message">The moment is here. Look up, my love! 🌙</p>
//             ) : (
//               <div className="countdown">
//                 {[
//                   ["Days", countdown.days],
//                   ["Hours", countdown.hours],
//                   ["Minutes", countdown.minutes],
//                   ["Seconds", countdown.seconds],
//                 ].map(([label, value]) => (
//                   <div className="time-unit" key={label}>
//                     <strong>{String(value).padStart(2, "0")}</strong>
//                     <span>{label}</span>
//                   </div>
//                 ))}
//               </div>
//             )
//           ) : (
//             <p className="moon-message">Counting down to our special moment…</p>
//           )}
//           {!moonrise && (
//             <p className="small-note">
//               Make sure your Express server provides the moonrise time.
//             </p>
//           )}
//         </div>
//         <a className="scroll-link" href="#letter">A message from my heart ↓</a>
//       </section>

//       <section className="section letter-section" id="letter">
//         <p className="eyebrow">Written only for you</p>
//         <h2>A letter from <em>my heart</em></h2>
//         <div className={`letter-card ${letterOpen ? "letter-open" : ""}`}>
//           <div className="letter-decoration">❦</div>
//           {!letterOpen ? (
//             <>
//               <div className="letter-seal">♥</div>
//               <p className="letter-teaser">
//                 There are a thousand things I want to tell you, Surbhi…
//               </p>
//               <button className="gold-button" onClick={() => setLetterOpen(true)}>
//                 Open my letter 💌
//               </button>
//             </>
//           ) : (
//             <div className="letter-content">
//               {letter.map((line, index) => (
//                 <p
//                   className="letter-line"
//                   key={line}
//                   style={{ animationDelay: `${index * 0.65}s` }}
//                 >
//                   {line}
//                 </p>
//               ))}
//               <button className="text-button" onClick={() => setLetterOpen(false)}>
//                 Fold the letter ↑
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="section memories-section" id="memories">
//         <p className="eyebrow">Little moments, endless love</p>
//         <h2>Our beautiful <em>memories</em></h2>
//         <p className="section-intro">
//           Every picture holds a piece of my heart. Tap a photo to see it closer.
//         </p>

//         <div className="gallery">
//           {memories.map((photo, index) => (
//             <button
//               className={`photo-card photo-${index + 1}`}
//               key={photo.src}
//               onClick={() => !photoErrors[photo.src] && setSelectedPhoto(photo)}
//               aria-label={`View photo: ${photo.caption}`}
//             >
//               {photoErrors[photo.src] ? (
//                 <span className="photo-placeholder">
//                   <span>♡</span>
//                   <strong>Add your photo</strong>
//                   <small>{photo.src.split("/").pop()}</small>
//                 </span>
//               ) : (
//                 <img
//                   src={photo.src}
//                   alt={photo.caption}
//                   loading="lazy"
//                   onError={() =>
//                     setPhotoErrors((previous) => ({
//                       ...previous,
//                       [photo.src]: true,
//                     }))
//                   }
//                 />
//               )}
//               <span className="photo-caption">{photo.caption}</span>
//             </button>
//           ))}
//         </div>
//         <p className="small-note">
//           Add your pictures to the public/photos folder using the filenames shown above.
//         </p>
//       </section>

//       <section className="section gift-section" id="surprise">
//         <p className="eyebrow">There's one more thing…</p>
//         <h2>A little gift for <em>my favourite person</em></h2>
//         <p className="section-intro">
//           Made with love, wrapped with hugs, and meant just for you.
//         </p>

//         <button
//           className={`gift-box ${giftOpen ? "gift-open" : ""}`}
//           onClick={() => setGiftOpen((open) => !open)}
//           aria-label={giftOpen ? "Close surprise gift" : "Open surprise gift"}
//         >
//           <span className="gift-lid">
//             <span className="gift-bow">∞</span>
//           </span>
//           <span className="gift-body">
//             <span className="gift-ribbon" />
//             <span className="gift-heart">♥</span>
//           </span>
//           <span className="gift-sparkle">✦</span>
//         </button>

//         <p className="gift-hint">
//           {giftOpen ? "Your surprise is open 💖" : "Tap the gift to open it"}
//         </p>

//         {giftOpen && (
//           <div className="gift-reveal">
//             <div className="reveal-heart">♥</div>
//             <h3>My forever is with you, Surbhi.</h3>
//             <p>
//               My greatest gift isn't something I can wrap.
//               It's every tomorrow I get to spend loving you.
//               Whatever life brings, I want to keep choosing you,
//               holding your hand, and making new memories together.
//             </p>
//             <p className="signature">Forever yours, Pallav ✨</p>
//           </div>
//         )}
//       </section>

//       <section className="final-note">
//         <div className="final-moon">☾</div>
//         <p className="eyebrow">This Karwa Chauth and always</p>
//         <h2>You are my today, <em>my tomorrow,</em><br />my always.</h2>
//         <p>With all my love,</p>
//         <div className="signature final-signature">Pallav ♥ Surbhi</div>
//       </section>

//       <footer className="footer">
//         Made with all the love in my heart <span>♥</span> for Surbhi
//       </footer>

//       {musicError && (
//         <div className="toast" role="status">
//           Add your-song.mp3 to public/music to play your song.
//           <button onClick={() => setMusicError(false)} aria-label="Dismiss">×</button>
//         </div>
//       )}

//       {selectedPhoto && (
//         <div
//           className="photo-modal"
//           role="dialog"
//           aria-modal="true"
//           aria-label="Photo viewer"
//           onClick={() => setSelectedPhoto(null)}
//           onKeyDown={(event) => {
//             if (event.key === "Escape") setSelectedPhoto(null);
//           }}
//         >
//           <button
//             className="modal-close"
//             onClick={() => setSelectedPhoto(null)}
//             aria-label="Close photo"
//           >
//             ×
//           </button>
//           <img
//             src={selectedPhoto.src}
//             alt={selectedPhoto.caption}
//             onClick={(event) => event.stopPropagation()}
//           />
//           <p>{selectedPhoto.caption}</p>
//         </div>
//       )}
//     </main>
//   );
// }

// export default App;
