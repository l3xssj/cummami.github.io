(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORE = 'toni-birthday-gift-v1';
  const initial = { opened: [], coupons: [], experiences: [], movies: [], wishes: [], journal: [], evening: [] };
  let state;
  try {
    const stored = JSON.parse(localStorage.getItem(STORE) || '{}');
    state = { ...initial, ...(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}) };
  } catch { state = { ...initial }; }
  for (const key of Object.keys(initial)) if (!Array.isArray(state[key])) state[key] = [];
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { toast('No se pudo guardar en este navegador.'); } };
  const toast = (text) => { const el = $('#toast'); el.textContent = text; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2600); };
  const escapeHTML = (text) => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const gifts = [
    ['Una carta especial','✉','leer'],['Vale para un paseo','↗','paseo'],['Ruleta de experiencias','◉','ruleta'],['Flores para ti','✿','flores'],['Un mensaje bonito','“','mensaje'],['Tarde de cine','▣','cine'],['Sorpresa musical','♫','musica'],['Tarde juntas','♡','juntas'],['Trivial sin presión','?','trivial'],['Mensajes secretos','▤','secreto'],['Pasaporte de planes','⌖','pasaporte'],['Un plan al azar','✳','plan'],['Chistes malos','☻','chiste'],['Reto exprés','⚡','reto'],['Tarde de música','♪','tarde-musica'],['Tú eliges el plan','☷','elige'],['Cápsula del tiempo','◷','capsula'],['Lista de deseos','☆','deseos'],['Un minuto de calma','◌','calma'],['Ruleta de cine','▰','pelicula'],['Humor de madre','☺','boomer'],['Frase para hoy','✧','positiva'],['Vale de ayuda','⌂','ayuda'],['Mini reto divertido','➜','mini-reto'],['Una sorpresa cambiante','✹','sorpresa'],['Dedicatoria final','♥','final']
  ];
  const coupons = [
    ['Un paseo donde tú elijas','Tú decides el rumbo y yo pongo la compañía.'],['Una tarde juntas','Una tarde para compartir sin mirar el reloj.'],['Una tarde musical','Elegimos música y la escuchamos juntas.'],['Elegir la película','Tu elección, sin debate sobre el mando.'],['Cine en casa','Película, sofá y plan a tu gusto.'],['Una tarde de relax','Hoy el plan es bajar el ritmo.'],['Actividad sorpresa','Yo preparo una actividad y tú decides cuándo.'],['Un día sin preocupaciones','Me encargo de una tarea que te venga bien.'],['Ayuda con algo','Canjeable por una mano extra cuando quieras.'],['Una conversación sin prisas','Un rato para hablar de lo que te apetezca.'],['Un plan organizado','Tú eliges el estilo; yo me encargo de organizarlo.'],['Una tarde de risas','Comedia, chistes malos o lo que nos haga reír.'],['Próxima aventura','Tú escoges nuestra siguiente salida.'],['Una tarde de series','Tú eliges qué vemos y cuánto vemos.'],['Sorpresa preparada en casa','Un pequeño plan hecho con cariño.'],['Un abrazo cuando quieras','Válido sin fecha ni motivo.'],['Escuchar música juntas','Tu playlist y un rato para disfrutarla.'],['Un paseo especial','Un paseo sin destino fijo y a tu ritmo.'],['Algo que te haga ilusión','Cuéntame qué te apetece y lo hacemos posible.'],['Una tarde sin prisas','Sin agenda, sin apuro y contigo al mando.'],['Elegir qué hacemos','Hoy la última palabra es tuya.'],['Una tarde diferente','Un plan nuevo, elegido entre las dos.'],['Un día dedicado a ti','Un día con actividades elegidas por ti.'],['Una pequeña aventura','Salir a explorar algo distinto, cerca o lejos.'],['Una experiencia especial','La pensamos juntas y la hacemos realidad.']
  ];
  const passport = ['Dar un paseo sin prisa','Escuchar un álbum de principio a fin','Ver una película elegida por ti','Descubrir un sitio nuevo','Hacer un plan improvisado','Tener una tarde de desconexión','Reírnos con algo muy malo','Compartir una tarde juntas'];
  const activities = ['Paseo tranquilo','Música favorita','Película en casa','Merienda sin prisa','Salir a descubrir','Una buena conversación'];
  const plans = ['Paseo por un lugar nuevo y parada para tomar algo.','Tarde de cine en casa: tú eliges la película y yo preparo el ambiente.','Ponemos tu playlist y cada una elige una canción para compartir.','Un rato sin pantallas, con charla y algo rico para picar.','Salimos a dar una vuelta y dejamos que el camino elija el plan.','Una tarde de descanso: música suave, sofá y cero obligaciones.','Buscamos un concierto o actividad que nos apetezca y lo planeamos juntas.','Elige una receta sencilla y hacemos una merienda especial.','Ruta corta, fotos del paisaje si apetece y regreso sin mirar la hora.','Tarde de comedia romántica y debate amable sobre el final.'];
  const positive = ['No hace falta tenerlo todo resuelto para disfrutar de un buen momento.','Un día tranquilo también puede ser un día estupendo.','Siempre hay sitio para una canción que te cambie el ánimo.','Los planes sencillos también se convierten en recuerdos bonitos.','Hoy puedes ir a tu ritmo. Ese también es un buen ritmo.','Mereces un rato solo para disfrutar.'];
  const conversationQuestions = ['¿Qué plan sencillo te gustaría repetir algún día?','¿Qué canción te apetece escuchar ahora mismo?','¿Te apetece más una tarde de paseo, música o película?','¿Qué lugar cercano te gustaría descubrir juntas?','¿Qué hace que una tarde normal se convierta en una tarde bonita?','¿Qué película romántica o de adolescentes te gustaría volver a ver?','Si hoy no hubiera prisa, ¿cómo sería tu tarde ideal?','¿Qué concierto o artista te gustaría tener la oportunidad de ver?','¿Qué comida o merienda pegaría con una tarde de cine?','¿Qué pequeño plan podríamos improvisar esta semana?','¿Prefieres un paseo con destino o dejar que el camino nos sorprenda?','¿Qué canción pondrías para empezar un día con buen ánimo?','¿Qué experiencia nueva te gustaría probar a tu ritmo?','¿Qué detalle sencillo te alegra un día?','¿Qué plan te gustaría guardar para un día especial?','¿Qué género de película te apetece últimamente?'];

  // Descarta datos antiguos o dañados para que no rompan los renderizados.
  state.opened=[...new Set(state.opened.filter(n=>Number.isInteger(n)&&n>=1&&n<=gifts.length))];
  state.coupons=[...new Set(state.coupons.filter(i=>Number.isInteger(i)&&i>=0&&i<coupons.length))];
  state.experiences=[...new Set(state.experiences.filter(i=>Number.isInteger(i)&&i>=0&&i<passport.length))];
  state.evening=[...new Set(state.evening.filter(i=>Number.isInteger(i)&&i>=0&&i<activities.length))];
  state.movies=state.movies.filter(m=>m&&typeof m==='object'&&typeof m.title==='string').map(m=>({title:m.title.slice(0,80),category:typeof m.category==='string'?m.category:'Otra',watched:Boolean(m.watched)}));
  state.wishes=state.wishes.filter(x=>typeof x==='string').map(x=>x.slice(0,100));
  state.journal=state.journal.filter(x=>x&&typeof x==='object'&&typeof x.text==='string').map(x=>({text:x.text.slice(0,400),date:typeof x.date==='string'?x.date:''}));

  $('#conversationPrompt').textContent=conversationQuestions[0];
  $('#nextQuestion').addEventListener('click',()=>{const current=$('#conversationPrompt').textContent;const options=conversationQuestions.filter(q=>q!==current);$('#conversationPrompt').textContent=options[Math.floor(Math.random()*options.length)];});

  function renderGifts(){ $('#giftGrid').innerHTML = gifts.map(([title,icon],i)=>`<button class="gift-tile ${state.opened.includes(i+1)?'is-opened':''}" data-gift="${i+1}" aria-label="Abrir regalo ${i+1}: ${title}"><span class="tile-num">REGALO ${String(i+1).padStart(2,'0')}</span><span class="tile-icon" aria-hidden="true">${icon}</span><strong>${title}</strong><span class="tile-open">${state.opened.includes(i+1)?'Volver a abrir ↗':'Descubrir ↗'}</span></button>`).join('');$('#giftProgress').textContent=`${state.opened.length} de 26 descubiertos`; }
  function renderCoupons(){ $('#couponGrid').innerHTML=coupons.map(([title,desc],i)=>`<article class="coupon-card ${state.coupons.includes(i)?'redeemed':''}"><span class="coupon-no">VALE Nº ${String(i+1).padStart(2,'0')}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(desc)}</p><div class="coupon-bottom"><span>${state.coupons.includes(i)?'CANJEADO':'SIN CADUCIDAD'}</span><button data-coupon="${i}">${state.coupons.includes(i)?'Deshacer':'Canjear ↗'}</button></div></article>`).join('');$('#couponCount').textContent=`${coupons.length-state.coupons.length} vales disponibles`; }
  function renderPassport(){ $('#passportList').innerHTML=passport.map((name,i)=>`<label class="passport-item"><input type="checkbox" data-experience="${i}" ${state.experiences.includes(i)?'checked':''}><span>${escapeHTML(name)}</span></label>`).join('');const n=state.experiences.length;$('#experienceProgressText').textContent=`${n} / ${passport.length} experiencias`,$('#experienceProgressBar').style.width=`${n/passport.length*100}%`; }
  function renderEvening(){ $('#activityList').innerHTML=activities.map((name,i)=>`<button class="activity-chip ${state.evening.includes(i)?'selected':''}" data-activity="${i}" aria-pressed="${state.evening.includes(i)}">${escapeHTML(name)}</button>`).join('');$('#eveningSummary').textContent=state.evening.length?`Tu tarde: ${state.evening.map(i=>activities[i].toLowerCase()).join(' · ')}`:'Elige actividades para montar el plan.'; }
  function renderMovies(){ $('#movieList').innerHTML=state.movies.map((m,i)=>`<li class="movie-row ${m.watched?'watched':''}"><span>${escapeHTML(m.title)}</span><small>${escapeHTML(m.category)}</small><button data-watch-movie="${i}" aria-label="${m.watched?'Marcar pendiente':'Marcar vista'}">${m.watched?'Vista ✓':'Marcar vista'}</button><button data-delete-movie="${i}" aria-label="Eliminar ${escapeHTML(m.title)}">×</button></li>`).join('');const pending=state.movies.filter(m=>!m.watched).length;$('#movieCount').textContent=`${pending} pendiente${pending===1?'':'s'}`; }
  function renderLists(){ $('#wishList').innerHTML=state.wishes.map((x,i)=>`<li>${escapeHTML(x)}<button data-delete-wish="${i}" aria-label="Eliminar deseo">×</button></li>`).join('');$('#journalList').innerHTML=state.journal.slice(0,4).map((x,i)=>`<li><span>${escapeHTML(x.text)} <small>· ${escapeHTML(x.date)}</small></span><button data-delete-journal="${i}" aria-label="Eliminar nota">×</button></li>`).join(''); }

  const modal=$('#modal'), modalContent=$('#modalContent'); let previousFocus;
  function openModal(html){previousFocus=document.activeElement;modalContent.innerHTML=html;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>$('.modal-close').focus(),20);}
  function closeModal(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');if(previousFocus)previousFocus.focus();}
  function shell(kicker,title,content,actions=''){return `<p class="eyebrow">${kicker}</p><h2 id="modalTitle">${title}</h2>${content}${actions?`<div class="modal-action-row">${actions}</div>`:''}`;}
  function letterModal(){openModal(shell('UNA CARTA PARA TI','Feliz cumpleaños, mamá.',`<div class="letter-paper"><p>Hoy cumples 54 y quería regalarte algo que no se quedara en un paquete. He preparado esta pequeña web para que puedas abrirla cuando quieras, elegir un plan, escuchar tu música y encontrar alguna sorpresa.</p><p>Ojalá este nuevo año te traiga paseos agradables, canciones que te gusten, buenas historias y muchas experiencias bonitas. Y ojalá compartamos unas cuantas.</p><p>Gracias por ser tú. Disfruta mucho de tu día, hoy y siempre.</p><p class="letter-sign">Con todo mi cariño,<br>tu hijo</p></div>`,'<button class="button button-dark" data-close-modal>Cerrar la carta <span>♡</span></button>'));}
  function surpriseMarkup(type){
    switch(type){
      case 'leer': return {title:'Una carta para ti',text:'La he escrito pensando en ti. Léela cuando tengas un ratito tranquilo.',action:'Leer la carta completa',button:'data-letter'};
      case 'paseo': return {title:'Vale por un paseo',text:'Tú eliges el camino, la hora y si damos una vuelta corta o larga. Yo pongo la compañía.',action:'Guardar este vale',button:'data-quick-coupon="0"'};
      case 'ruleta': return {title:'La suerte está echada',text:'Gira la ruleta de experiencias de la página y deja que el azar elija el siguiente plan.',action:'Ir a la ruleta',button:'data-go="experiencias"'};
      case 'flores': return {title:'Un ramito digital',text:'No necesita agua ni jarrón, pero viene con todo el cariño. Pulsa para que florezca.',flower:true,action:'Hacer florecer',button:'data-bloom'};
      case 'mensaje': return {title:'Un mensaje solo para hoy',text:'Pulsa para recibir una frase bonita. Puedes volver a generar otra cuando quieras.',action:'Generar mensaje',button:'data-generate-positive'};
      case 'cine': return {title:'Una tarde de cine',text:'Elige película, prepara algo para picar y haz de la pausa una parte del plan.',action:'Preparar noche de cine',button:'data-cinema-night'};
      case 'musica': return {title:'Una canción para el momento',text:'Abre tu playlist y deja que la música elija el ambiente. Sin reproducción automática, siempre a tu ritmo.',action:'Abrir tu rincón musical',button:'data-go="musica"'};
      case 'juntas': return {title:'Vale por una tarde juntas',text:'Canjeable cuando quieras. El plan lo eliges tú y el tiempo lo ponemos las dos.',action:'Guardar este vale',button:'data-quick-coupon="1"'};
      case 'trivial': return {title:'Trivial tecnológico',text:'Pregunta: ¿qué suele arreglar muchos problemas de tecnología?',quiz:true};
      case 'secreto': return {title:'Un mensaje secreto',text:'No hace falta una ocasión especial para que alguien te recuerde lo mucho que te quiere.',highlight:'Si has llegado hasta aquí, ya has encontrado el secreto: eres muy querida.'};
      case 'pasaporte': return {title:'Tu pasaporte de experiencias',text:'Marca las pequeñas aventuras que hagas en la sección de experiencias. Sin prisas ni fechas límite.',action:'Ver tu pasaporte',button:'data-go="experiencias"'};
      case 'plan': return {title:'Plan sorpresa',text:'Una propuesta aleatoria para el día que quieras improvisar.',dynamic:true};
      case 'chiste': return {title:'Chiste malo, cariño bueno',text:'¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',action:'Otro chiste',button:'data-another-joke'};
      case 'reto': return {title:'Reto exprés',text:'Elige una canción que te ponga de buen humor y escúchala completa sin hacer otra cosa.',action:'Acepto el reto',button:'data-toast="Reto aceptado. A disfrutar de la canción."'};
      case 'tarde-musica': return {title:'Una tarde con banda sonora',text:'Pon tu playlist, elige una bebida rica y escucha unas canciones sin hacer nada más. La tarde ya tiene plan.',action:'Ir a la playlist',button:'data-go="musica"'};
      case 'elige': return {title:'Hoy mandas tú',text:'Elige una idea para abrir el apetito. Si ninguna encaja, la cambiamos.',choices:['Paseo sin rumbo','Cine en casa','Música y charla','Tarde de relax']};
      case 'capsula': return {title:'Cápsula del tiempo',text:'Escribe una nota para tu yo del futuro. Se guardará en este dispositivo.',input:true,action:'Guardar mi nota',button:'data-save-capsule'};
      case 'deseos': return {title:'Un deseo para guardar',text:'Apunta algo que te gustaría hacer. Aparecerá también en tu rincón personal.',input:true,action:'Guardar deseo',button:'data-save-wish'};
      case 'calma': return {title:'Un minuto de calma',text:'Sigue el ritmo del círculo: inspira cuando se expande y suelta el aire cuando vuelve.',action:'Empezar la pausa',button:'data-breathe'};
      case 'pelicula': return {title:'Género de cine al azar',text:'La ruleta del rincón de cine elige una categoría, no una película concreta. Tú tienes la última palabra.',action:'Ir al rincón de cine',button:'data-go="cine"'};
      case 'boomer': return {title:'La sabiduría tecnológica de mamá',text:'«Si lo apagas y lo vuelves a encender, a veces hasta el día mejora».',action:'Generar otra frase',button:'data-mother-phrase'};
      case 'positiva': return {title:'Una frase para llevarte',text:positive[Math.floor(Math.random()*positive.length)],action:'Otra frase',button:'data-generate-positive'};
      case 'ayuda': return {title:'Vale por una mano extra',text:'Canjeable por ayuda con una tarea que te venga bien. Solo tienes que decirme cuál.',action:'Guardar este vale',button:'data-quick-coupon="8"'};
      case 'mini-reto': return {title:'Mini reto',text:'Durante un minuto, baila o muévete al ritmo de una canción que te guste. Nivel de exigencia: cero.',action:'¡Hecho!',button:'data-toast="Reto completado. Diploma imaginario concedido."'};
      case 'sorpresa': return {title:'Una sorpresa cambiante',text:['Hoy te toca: una tarde sin reloj.','Sorpresa: elige una canción y ponla a todo lo que te apetezca.','Un plan sorpresa: paseo corto y parada donde tú quieras.','Tu misión secreta: regalarte un rato de descanso.','Hoy la sorpresa es sencilla: alguien te quiere mucho.'][Math.floor(Math.random()*5)],action:'Otra sorpresa',button:'data-another-surprise'};
      case 'final': return {title:'Lo más importante',text:'Gracias por abrir esta caja. Que los 54 vengan llenos de experiencias bonitas, y que encontremos muchas para compartir.',highlight:'Feliz cumpleaños, mamá. Te quiero.',action:'Volver a leer tu carta',button:'data-letter'};
      default:return {title:'Una sorpresa para ti',text:'Hecha especialmente para tu cumpleaños.'};
    }
  }
  function openGift(num){const gift=gifts[num-1];if(!gift)return; if(!state.opened.includes(num)){state.opened.push(num);save();renderGifts();}const detail=surpriseMarkup(gift[2]);let content=detail.text?`<p>${escapeHTML(detail.text)}</p>`:'';if(detail.highlight)content+=`<div class="modal-highlight">${escapeHTML(detail.highlight)}</div>`;if(detail.flower)content+=`<div class="modal-flower" id="modalFlower" aria-hidden="true">✿</div>`;if(detail.dynamic)content+=`<div class="modal-highlight" id="dynamicPlan">${escapeHTML(plans[Math.floor(Math.random()*plans.length)])}</div>`;if(detail.input)content+=`<label class="sr-only" for="modalInput">${detail.title}</label><textarea class="modal-input" id="modalInput" rows="3" maxlength="250" placeholder="Escribe aquí…"></textarea>`;if(detail.quiz)content+=`<div class="modal-options"><button data-quiz-answer="Exacto: reiniciarlo">Reiniciarlo</button><button data-quiz-answer="También ayuda pedir ayuda">Pedir ayuda</button><button data-quiz-answer="A veces, leer las instrucciones">Leer las instrucciones</button></div><div class="modal-output" id="quizOutput"></div>`;if(detail.choices)content+=`<div class="modal-options">${detail.choices.map(x=>`<button data-choice="${escapeHTML(x)}">${escapeHTML(x)}</button>`).join('')}</div><div class="modal-output" id="choiceOutput"></div>`;const action=detail.action?`<button class="button button-dark" ${detail.button||''}>${detail.action} <span>↗</span></button>`:'';openModal(shell(`REGALO ${String(num).padStart(2,'0')} · ${gift[0].toUpperCase()}`,detail.title,content,action));}

  renderGifts();renderCoupons();renderPassport();renderEvening();renderMovies();renderLists();
  $('#enterButton').addEventListener('click',()=>{$('#intro').classList.add('is-hidden');setTimeout(()=>$('#intro').remove(),850);});
  $('#menuToggle').addEventListener('click',()=>{const nav=$('#mainNav'),open=nav.classList.toggle('is-open');$('#menuToggle').setAttribute('aria-expanded',String(open));$('#menuToggle').textContent=open?'×':'☰';});
  $('#mainNav').addEventListener('click',e=>{if(e.target.closest('a')){$('#mainNav').classList.remove('is-open');$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').textContent='☰';}});
  document.addEventListener('click',e=>{const gift=e.target.closest('[data-gift]');if(gift){openGift(Number(gift.dataset.gift));return;}if(e.target.closest('[data-open-letter]')||e.target.closest('[data-letter]')){letterModal();return;}if(e.target.closest('[data-close-modal]')){closeModal();return;}
    const coupon=e.target.closest('[data-coupon]');if(coupon){const i=Number(coupon.dataset.coupon);state.coupons=state.coupons.includes(i)?state.coupons.filter(x=>x!==i):[...state.coupons,i];save();renderCoupons();toast(state.coupons.includes(i)?'Vale marcado como canjeado.':'Vale disponible de nuevo.');return;}
    const quick=e.target.closest('[data-quick-coupon]');if(quick){const i=Number(quick.dataset.quickCoupon);if(!state.coupons.includes(i)){state.coupons.push(i);save();renderCoupons();}toast('Vale guardado en tu talonario.');return;}
    const go=e.target.closest('[data-go]');if(go){closeModal();document.getElementById(go.dataset.go)?.scrollIntoView({behavior:'smooth'});return;}
    if(e.target.closest('[data-bloom]')){$('#modalFlower').classList.toggle('bloom');$('#modalFlower').style.transform='scale(1.2) rotate(14deg)';toast('Un ramito virtual, solo para ti.');return;}
    if(e.target.closest('[data-generate-positive]')){$('.modal-content>p:not(.eyebrow)')?.replaceWith(Object.assign(document.createElement('p'),{textContent:positive[Math.floor(Math.random()*positive.length)]}));return;}
    if(e.target.closest('[data-cinema-night]')){closeModal();$('#cinemaNight').click();return;}
    if(e.target.closest('[data-another-joke]')){const jokes=['¿Qué le dice un techo a otro? Techo de menos.','¿Qué hace una abeja en el gimnasio? ¡Zum-ba!','¿Cuál es el colmo de un jardinero? Que siempre lo dejen plantado.','¿Qué hace una caja en el gimnasio? ¡Caja fuerte!'];$('.modal-content>p:not(.eyebrow)').textContent=jokes[Math.floor(Math.random()*jokes.length)];return;}
    if(e.target.closest('[data-another-surprise]')){const p=$('.modal-content>p:not(.eyebrow)');p.textContent=['Hoy te toca: una tarde sin reloj.','Sorpresa: elige una canción y ponla a todo lo que te apetezca.','Un plan sorpresa: paseo corto y parada donde tú quieras.','Tu misión secreta: regalarte un rato de descanso.','Hoy la sorpresa es sencilla: alguien te quiere mucho.'][Math.floor(Math.random()*5)];return;}
    const quiz=e.target.closest('[data-quiz-answer]');if(quiz){$('#quizOutput').textContent=quiz.dataset.quizAnswer;return;}
    const choice=e.target.closest('[data-choice]');if(choice){$('#choiceOutput').textContent=`Plan elegido: ${choice.dataset.choice}. ¡Ya solo falta decidir cuándo!`;return;}
    if(e.target.closest('[data-save-capsule]')){const val=$('#modalInput')?.value.trim();if(!val){toast('Escribe primero tu nota.');return;}state.journal.unshift({text:`Cápsula: ${val}`,date:new Date().toLocaleDateString('es-ES')});save();renderLists();toast('Tu cápsula quedó guardada en el diario.');closeModal();return;}
    if(e.target.closest('[data-save-wish]')){const val=$('#modalInput')?.value.trim();if(!val){toast('Escribe primero tu deseo.');return;}state.wishes.unshift(val);save();renderLists();toast('Deseo guardado en tu lista.');closeModal();return;}
    if(e.target.closest('[data-breathe]')){closeModal();$('#breathButton').click();return;}
    if(e.target.closest('[data-mother-phrase]')){closeModal();$('#motherPhrase').click();return;}
    const t=e.target.closest('[data-toast]');if(t){toast(t.dataset.toast);return;}
    const delWish=e.target.closest('[data-delete-wish]');if(delWish){state.wishes.splice(Number(delWish.dataset.deleteWish),1);save();renderLists();return;}
    const delJournal=e.target.closest('[data-delete-journal]');if(delJournal){state.journal.splice(Number(delJournal.dataset.deleteJournal),1);save();renderLists();return;}
    const watch=e.target.closest('[data-watch-movie]');if(watch){const i=Number(watch.dataset.watchMovie);state.movies[i].watched=!state.movies[i].watched;save();renderMovies();return;}
    const deleteMovie=e.target.closest('[data-delete-movie]');if(deleteMovie){state.movies.splice(Number(deleteMovie.dataset.deleteMovie),1);save();renderMovies();return;}
    const activity=e.target.closest('[data-activity]');if(activity){const i=Number(activity.dataset.activity);state.evening=state.evening.includes(i)?state.evening.filter(x=>x!==i):[...state.evening,i];save();renderEvening();return;}
    const exp=e.target.closest('[data-experience]');if(exp){const i=Number(exp.dataset.experience);state.experiences=exp.checked?[...state.experiences,i]:state.experiences.filter(x=>x!==i);save();renderPassport();return;}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal();if(e.key==='Escape'){$('#mainNav').classList.remove('is-open');$('#menuToggle').setAttribute('aria-expanded','false');}});
  let wheelAngle=0;
  let wheelAnimation=null;
  let wheelWatchdog=0;
  let wheelSpinId=0;
  const spinButton=$('#spinButton');
  const wheelLabels=['Paseo sin prisa juntas','Música para compartir','Cine romántico en casa','Tarde de relax sin reloj','Concierto o plan musical','Pequeña aventura juntas'];
  const wheelDescriptions=[
    'Paseo por un lugar nuevo y una parada donde te apetezca.',
    'Ponemos tu playlist y elegimos canciones para escuchar juntas.',
    'Tú eliges una película romántica y preparamos algo rico.',
    'Una tarde tranquila, a tu ritmo y sin obligaciones.',
    'Buscamos un concierto o plan musical que te apetezca.',
    'Elegimos una pequeña aventura y decidimos el rumbo juntas.'
  ];
  function finishWheelSpin(id,index,end){
    if(id!==wheelSpinId)return;
    clearTimeout(wheelWatchdog);
    const wheel=$('#experienceWheel');
    wheelAngle=((end%360)+360)%360;
    wheel.style.transform=`rotate(${wheelAngle}deg)`;
    wheel.style.transition='none';
    if(wheelAnimation){wheelAnimation.onfinish=null;wheelAnimation.cancel();wheelAnimation=null;}
    spinButton.disabled=false;
    spinButton.removeAttribute('aria-busy');
    $('#wheelResult').textContent=`${wheelLabels[index]}: ${wheelDescriptions[index]}`;
  }
  spinButton.addEventListener('click',()=>{
    if(spinButton.disabled)return;
    const wheel=$('#experienceWheel');
    const index=Math.floor(Math.random()*wheelLabels.length);
    const target=(330-index*60+360)%360;
    const start=wheelAngle;
    const end=start+1800+((target-start%360+360)%360);
    const id=++wheelSpinId;
    spinButton.disabled=true;
    spinButton.setAttribute('aria-busy','true');
    $('#wheelResult').textContent='La ruleta está girando…';

    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      finishWheelSpin(id,index,end);
      return;
    }

    if(typeof wheel.animate==='function'){
      try{
        wheelAnimation=wheel.animate(
          [{transform:`rotate(${start}deg)`},{transform:`rotate(${end}deg)`}],
          {duration:2200,easing:'cubic-bezier(.12,.75,.12,1)'}
        );
        wheelAnimation.onfinish=()=>finishWheelSpin(id,index,end);
      }catch{
        wheelAnimation=null;
      }
    }
    if(!wheelAnimation){
      wheel.style.transition='none';
      wheel.style.transform=`rotate(${start}deg)`;
      void wheel.offsetWidth;
      wheel.style.transition='transform 2.2s cubic-bezier(.12,.75,.12,1)';
      wheel.style.transform=`rotate(${end}deg)`;
    }
    // Respaldo por si el navegador no emite el evento de fin de animación.
    wheelWatchdog=setTimeout(()=>finishWheelSpin(id,index,end),2600);
  });
  const moods={salir:'Plan para salir: paseo a tu ritmo por un sitio distinto, con una parada donde te apetezca.',descansar:'Plan de descanso: música tranquila, una bebida rica y una tarde sin obligaciones.',musica:'Plan musical: abre tu playlist, ponte cómoda y elige una canción para escuchar con atención.',reir:'Plan para reír: elige una comedia o deja que el generador boomer haga su trabajo.',cine:'Plan de peli: decide el género, prepara algo para picar y elige tú el título.',juntos:'Plan acompañada: escoge un vale del talonario y montamos algo juntas.'};
  $('#moodChoices').addEventListener('click',e=>{const b=e.target.closest('[data-mood]');if(!b)return;$$('#moodChoices button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#moodResult').textContent=moods[b.dataset.mood];});
  $('#planButton').addEventListener('click',()=>{$('#planResult').textContent=plans[Math.floor(Math.random()*plans.length)];});
  const comboParts={place:['en un paseo sin rumbo','en casa con una película','en un sitio nuevo cerca','en una tarde tranquila'],sound:['con tu playlist favorita','con canciones elegidas por las dos','con música suave de fondo','con una canción para cada momento'],extra:['y una merienda rica','y una charla sin mirar el reloj','y una parada para tomar algo','y cero obligaciones']};
  const pickRandom=list=>list[Math.floor(Math.random()*list.length)];
  $('#comboPlanButton').addEventListener('click',()=>{$('#comboPlanResult').textContent=`Plan: ${pickRandom(comboParts.place)}, ${pickRandom(comboParts.sound)}, ${pickRandom(comboParts.extra)}.`;});
  $('#saveEvening').addEventListener('click',()=>{if(!state.evening.length){toast('Elige al menos una actividad primero.');return;}toast('Tu tarde está guardada en este dispositivo.');});
  $('#movieSpin').addEventListener('click',()=>{$('#movieGenre').textContent=['Romance','Comedia romántica','Adolescente','Para emocionarse','Divertida'][Math.floor(Math.random()*5)];});
  $('#movieForm').addEventListener('submit',e=>{e.preventDefault();const title=$('#movieTitle').value.trim();if(!title)return;state.movies.unshift({title,category:$('#movieCategory').value,watched:false});save();renderMovies();e.target.reset();$('#movieResult').textContent='Añadida a tu lista. ¡Buena elección!';});
  $('#randomMovie').addEventListener('click',()=>{const pending=state.movies.filter(m=>!m.watched);$('#movieResult').textContent=pending.length?`Esta noche podrías ver: ${pending[Math.floor(Math.random()*pending.length)].title}`:'Aún no tienes películas pendientes. Añade una que te apetezca.';});
  $('#cinemaNight').addEventListener('click',()=>{$('#movieResult').textContent='Noche de cine lista: elige una peli pendiente, prepara algo rico, baja un poco las luces y ponte cómoda. Tú decides cuándo empieza.';$('#cine').scrollIntoView({behavior:'smooth'});});
  const motherPhrases=['Yo no me he perdido, estoy explorando una ruta alternativa.','¿Has probado a apagarlo y volverlo a encender? Si funciona conmigo, funciona con el móvil.','No hace falta internet para saber que ya es hora de comer.','Mándame un mensaje cuando llegues. Y otro cuando lo leas.','¿Eso se guarda solo? Pues guárdalo también en un sitio seguro.','Yo no discuto con la tecnología: le explico las cosas con firmeza.'];
  $('#motherPhrase').addEventListener('click',()=>{$('#boomerQuote').querySelector('p').textContent=motherPhrases[Math.floor(Math.random()*motherPhrases.length)];$('#boomerResult').textContent='Frase nueva generada con cariño y cero juicio.';});
  const excuses=['La aplicación está actualizando mi paciencia.','No es que no responda: estoy dejando que el mensaje madure.','El móvil estaba en silencio para que pudiera pensar mejor.','No me he perdido; estoy comprobando si el GPS sabe lo que hace.'];
  $('#excuseButton').addEventListener('click',()=>{$('#boomerResult').textContent=excuses[Math.floor(Math.random()*excuses.length)];});
  $('#boomerQuiz').addEventListener('click',()=>{$('#boomerResult').textContent='Pregunta: si el móvil se queda sin batería, ¿qué haces? A) Buscas el cargador. B) Lo pones cerca del router para que coja cobertura. C) Descansas un rato. Todas son respuestas válidas.';});
  $('#diplomaButton').addEventListener('click',()=>openModal(shell('RECONOCIMIENTO OFICIAL','Diploma de madre legendaria',`<div class="modal-highlight">Se concede a Mamá por su talento para estar pendiente, su capacidad para resolverlo todo y su derecho inalienable a decir «te lo dije».</div><p>Válido para siempre. No requiere impresora, aunque puedes hacer una captura si quieres guardarlo.</p>`,'<button class="button button-dark" data-close-modal>Recibir mi diploma <span>✳</span></button>')));
  $('#journalForm').addEventListener('submit',e=>{e.preventDefault();const text=$('#journalEntry').value.trim();if(!text)return;state.journal.unshift({text,date:new Date().toLocaleDateString('es-ES')});save();renderLists();e.target.reset();toast('Nota guardada en tu diario.');});
  $('#wishForm').addEventListener('submit',e=>{e.preventDefault();const text=$('#wishEntry').value.trim();if(!text)return;state.wishes.unshift(text);save();renderLists();e.target.reset();toast('Deseo guardado.');});
  let breathing=false;$('#breathButton').addEventListener('click',()=>{if(breathing)return;breathing=true;const circle=$('#breathCircle'),label=$('#breathLabel'),button=$('#breathButton');button.disabled=true;let count=0;const cycle=()=>{if(count>=6){circle.classList.remove('breathing','exhale');label.textContent='lista';button.disabled=false;button.innerHTML='Empezar un minuto <span>↗</span>';breathing=false;toast('Un minuto para ti. Bien hecho.');return;}circle.classList.remove('exhale');circle.classList.add('breathing');label.textContent='inspira';setTimeout(()=>{circle.classList.add('exhale');label.textContent='suelta';},4000);setTimeout(()=>{count++;cycle();},8000);};button.textContent='Pausa en curso…';cycle();});
  $('#newQuote').addEventListener('click',()=>{$('#positiveQuote').textContent=positive[Math.floor(Math.random()*positive.length)];});
  $('#secretButton').addEventListener('click',()=>toast('Pista secreta: prueba a escribir TOÑI con cariño.'));$('#footerSecret').addEventListener('click',()=>openModal(shell('UN ÚLTIMO DETALLE','Tu regalo no tiene fecha de cierre.',`<p>Puedes volver a esta página cuando quieras. Los planes, tu música y la carta seguirán aquí. Lo que guardes en listas y diarios permanece únicamente en este navegador.</p><div class="modal-highlight">Pista: la palabra secreta es TOÑI. Escríbela en la caja misteriosa. ♡</div>`,'<button class="button button-dark" data-close-modal>Me lo guardo <span>♡</span></button>')));
  // El código secreto solo escucha teclas fuera de campos de escritura.
  let secretKeys='';document.addEventListener('keydown',e=>{if(e.key.length!==1||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;secretKeys=(secretKeys+e.key.toLocaleUpperCase('es')).slice(-4);if(secretKeys==='MAMÁ'||secretKeys==='MAMA'){toast('¡Código secreto encontrado! Feliz cumpleaños, Mamá ✨');openGift(26);secretKeys='';}});
})();
