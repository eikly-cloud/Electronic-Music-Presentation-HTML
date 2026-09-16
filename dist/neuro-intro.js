/* Local CSS 3D jewel cases; no runtime dependencies. */
(()=>{
 const END_MS=4000,deck=document.getElementById('deck'),edition=document.querySelector('.edition');
 const songMarkup='<img class="song-cover" src="rainshower-cover.jpg" alt="In My Heart — Silentroom"><div class="song-copy"><b lang="ja">驟雨の狭間</b><span class="song-original">RAINSHOWER</span><small>SILENTROOM <i>/</i> NEUROFUNK <i>/</i> 180 BPM</small></div>';
 edition.innerHTML=`<div class="edition-default">${edition.innerHTML}</div><div class="song-dock">${songMarkup}</div>`;
 const root=document.createElement('aside');root.className='neuro-intro cd-intro';root.hidden=true;
 root.setAttribute('aria-label','Selecting 驟雨の狭間 by Silentroom from the record collection');
 root.innerHTML='<div class="cd-heading"><span>ARCHIVE / SELECT 003</span><b>FIND THE FREQUENCY.</b></div><div class="cd-camera"><div class="cd-shelf"></div></div><div class="cd-caption"><b lang="ja">驟雨の狭間</b><span>SILENTROOM / NEUROFUNK / 180 BPM</span></div><button class="intro-skip" type="button">SKIP INTRO ↗</button>';
 deck.append(root);
 const shelf=root.querySelector('.cd-shelf'),camera=root.querySelector('.cd-camera'),caption=root.querySelector('.cd-caption');
 const archiveCovers=window.ARCHIVE_COVERS;
 const ROWS=31,LANES=9,SELECTED=139,cases=[];
 for(let i=0;i<ROWS*LANES;i++){
   const selected=i===SELECTED,el=document.createElement('div');el.className='cd-case'+(selected?' cd-selected':'');
   el.innerHTML=`<div class="cd-tray"><div class="cd-disc"><span>${selected?'SILENTROOM':'WAVE FIELD'}</span></div></div><div class="cd-lid">${selected?'<img src="rainshower-cover.jpg" alt="驟雨の狭間 — Silentroom">':'<div class="cd-sleeve"><small>W/F — SOUND ARCHIVE</small><b>'+String(i+1).padStart(2,'0')+'</b><span>'+['NEUROFUNK','HARDSTYLE','CLASSIC TRANCE'][i%3]+'</span></div>'}<i></i></div><div class="cd-top-edge"></div><div class="cd-right-edge"></div><div class="cd-spine">${selected?'驟雨の狭間 / SILENTROOM':'WAVE FIELD / ARCHIVE 00'+(i+1)}</div>`;
   if(!selected){const cover=archiveCovers[i];el.innerHTML='<div class="cd-solid"><img class="archive-cover" src="'+cover.file+'" alt="'+cover.title+' album artwork" decoding="async"></div><div class="cd-top-edge"></div><div class="cd-right-edge"></div><div class="cd-spine">'+cover.title+'</div>';}
   shelf.append(el);cases.push(el);
 }
 const lid=cases[SELECTED].querySelector('.cd-lid'),disc=cases[SELECTED].querySelector('.cd-disc');
 const clamp=x=>Math.max(0,Math.min(1,x)),range=(t,a,b)=>clamp((t-a)/(b-a));
 const ease=x=>x*x*x*(10+x*(-15+6*x));
 const out=x=>1-(1-x)**3;
 // One continuous surface shared by all columns; selection sends a soft radial wake.
 function fieldAt(row,lane,t){
   const bell=(x,w)=>Math.exp(-.5*(x/w)**2);
   const scan=ease(range(t,100,2000));
   const distance=row+lane*.8-(-10+22*scan);
   const envelope=ease(range(t,0,450))*(1-ease(range(t,1600,2550)));
   const crest=(.32*bell(distance,2.6)-.075*bell(distance-4,3))*envelope;
   const radius=Math.hypot(row*.55,lane*1.25),age=(t-1050)/1000;
   const wake=age>0?.085*Math.sin((radius-age*5)*1.2)*bell(radius-age*5,2.4)*Math.exp(-age*1.8)*ease(range(t,1050,1400))*(1-ease(range(t,2300,3000))):0;
   return crest+wake;
 }
 function motionAt(t){return {enter:out(range(t,0,400)),flow:ease(range(t,150,1400)),pick:ease(range(t,1050,2450)),open:ease(range(t,2100,3100)),dive:ease(range(t,2700,3900)),fade:ease(range(t,3150,4000))};}
 function render(t){
   const m=motionAt(t),size=Math.min(innerWidth*.24,innerHeight*.36,270);
   root.style.setProperty('--cd-size',size+'px');
   root.style.setProperty('--backdrop-opacity',String(1-m.fade));
   root.querySelector('.cd-heading').style.opacity=String(m.enter*(1-m.pick));
   caption.style.opacity=String(m.pick*(1-m.fade));
   shelf.style.transform=`rotateX(${-24*(1-m.pick)}deg) rotateY(${-32*(1-m.pick)}deg)`;
   camera.style.transform=`scale(${.92+.08*m.enter+3.6*m.dive}) translateY(${-4*m.dive}%)`;
   camera.style.opacity=String(m.enter*(1-m.fade));camera.style.filter=`blur(${m.dive*15}px)`;
   cases.forEach((el,i)=>{

     const target=SELECTED;
     const slot=i===SELECTED?target:i===target?SELECTED:i;
     const row=slot%ROWS-15,lane=Math.floor(slot/ROWS)-4,selected=i===SELECTED;
     const travel=4.2*(1-m.flow)-.45*m.pick;
     const wave=fieldAt(row,lane,t)*(selected?1-m.pick:1);
     const lift=selected?size*1.08*m.pick:0;
     const frameOffset=0;
     const x=(lane+frameOffset*(1-m.pick))*size*1.16;
     const y=size*.7-lift-size*wave;
     const wrapped=((row+travel+15)%ROWS+ROWS)%ROWS-15;
     const z=wrapped*size*.3;
     const align=selected?m.pick:0;
     el.style.transform=`translate3d(${x*(1-align)}px,${y-size*.02*align}px,${z*(1-align)+size*.8*align}px)`;
     el.style.opacity=String(selected?1:1-.72*ease(range(t,2100,3300)));

   });
   lid.style.transform=`translateZ(9px) rotateY(${-148*m.open}deg)`;
   disc.style.transform=`rotate(${60*m.open+110*m.dive}deg)`;
   if(t>=3150)deck.classList.add('neuro-handoff');
 }
 let running=false,raf=0,start=0,finishing=null;
 const songs={
  2:{title:'驟雨の狭間',subtitle:'RAINSHOWER',artist:'SILENTROOM',meta:'NEUROFUNK / 180 BPM',lang:'ja',image:'rainshower-cover.jpg'},
  3:{title:'SATELLITE',subtitle:'',artist:'かめりあ',meta:'HARD DANCE / 150 BPM',lang:'en',image:'covers/satellite.jpg'},
  4:{title:'Ushio',subtitle:'Emotional Intro Mix',artist:'New World',meta:'TRANCE / 139 BPM',lang:'en',image:'covers/ushio.jpg'}
 };
 let selectedSlide=2;
 function setSlide(index){
  const song=songs[index];edition.classList.toggle('edition-song',!!song);
  if(!song)return;selectedSlide=index;
  const cover=song.image?`<img class="song-cover" src="${song.image}" alt="${song.title} — ${song.artist}">`:`<div class="song-cover type-cover">${song.label}</div>`;
  edition.querySelector('.song-dock').innerHTML=`${cover}<div class="song-copy"><b lang="${song.lang}">${song.title}</b><span class="song-original">${song.subtitle}</span><small><span lang="ja">${song.artist}</span> / ${song.meta}</small></div>`;
  lid.innerHTML=(song.image?`<img src="${song.image}" alt="${song.title}">`:`<div class="cd-sleeve cd-song-sleeve"><small>W/F — SELECTED RECORD</small><b>${song.label}</b><span>${song.subtitle}<br><span lang="ja">${song.artist}</span></span></div>`)+'<i></i>';
  disc.querySelector('span').textContent=song.artist;
  cases[SELECTED].querySelector('.cd-spine').textContent=song.title+' / '+song.artist;
  caption.innerHTML=`<b lang="${song.lang}">${song.title}</b><span>${song.subtitle? song.subtitle+' / ':''}<span lang="ja">${song.artist}</span> / ${song.meta}</span>`;
  root.querySelector('.cd-heading span').textContent='ARCHIVE / SELECT 00'+(index+1);
  root.setAttribute('aria-label','Selecting '+song.title+' '+song.subtitle+' by '+song.artist);
 }
 function stop(){const was=running;running=false;cancelAnimationFrame(raf);root.hidden=true;deck.classList.remove('neuro-entering','neuro-handoff');if(was&&finishing){const fn=finishing;finishing=null;fn();}return was;}
 function update(now){if(!running)return;render(now-start);if(now-start>=END_MS){stop();return;}raf=requestAnimationFrame(update);}
 function play(onFinish){stop();setSlide(selectedSlide);if(matchMedia('(prefers-reduced-motion: reduce)').matches){onFinish?.();return;}finishing=onFinish;running=true;root.hidden=false;deck.classList.add('neuro-completed','neuro-entering');render(0);start=performance.now();raf=requestAnimationFrame(update);}
 root.querySelector('.intro-skip').onclick=stop;
 document.addEventListener('keydown',e=>{if(running&&['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Escape'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();stop();}},true);
 window.NeuroIntro={play,skip:stop,setSlide,get active(){return running;},motionAt,fieldAt,timing:{total:END_MS}};
})();
