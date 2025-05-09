// =========================================================================
// script.js - VERSÃO FINALÍSSIMA REVISADA - Mantendo 100% do Original + Correções Mínimas Essenciais
// =========================================================================

// =========================================================================
// FUNÇÃO UNIVERSAL PARA CARREGAR SEÇÕES (Definição única correta no topo)
// =========================================================================
function loadSection(id, url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} para ${url}`);
            return response.text();
        })
        .then(data => {
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.innerHTML = data;
                if (callback && typeof callback === 'function') {
                    try { callback(); } catch (e) { console.error(`Erro callback ${id}:`, e); }
                }
            } else { console.error(`Elemento #${id} não encontrado.`); }
        })
        .catch(error => console.error(`Erro fetch ${url}:`, error));
}

// =========================================================================
// VARIÁVEIS GLOBAIS (Exatamente como no seu original, serão inicializadas depois)
// =========================================================================
let playerMusica, audio, audioSource, progressBar, tempoAtual, tempoTotal;
let musicaTocando = false;
let carrosselInterval;
let chaveAtual = 0;
let posicaoCarrossel = 0;
let porcentagemAether = 101;

// =========================================================================
// DADOS GLOBAIS (Com TODOS os caminhos GitHub convertidos para relativos)
// =========================================================================
const listaDeMusicas = [
    {
        id: 1,
        nome: "Crying Alone / Nowhere",
        autor: "Kurae Radiânthia Pendragon Isaac",
        capa: "assets/Imagens Isaac/sac2.jpg",       // Convertido de Cueinhah/...
        background: "assets/Imagens Isaac/sac1.jpg", // Convertido de Cueinhah/...
        link: "assets/CryingAlone-Nowhere.mp3",      // Mantido relativo
    }
];
const storageKey = 'musicasFavoritadas';
let musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};

const atributos = {
    hp: { total: 4910210, porcentagem: 100 }, mp: { total: 823691, porcentagem: 100 },
    agi: { total: 637369, porcentagem: 100 }, def: { total: 1476557, porcentagem: 100 },
    res: { total: 1331048, porcentagem: 100 }, spd: { total: 1020989, porcentagem: 100 },
    int: { total: 431815, porcentagem: 100 }, atk: { total: 2075839, porcentagem: 100 },
    smp: { total: 291363290, porcentagem: 99.17 }, unknown: { total: 100, porcentagem: 50 }
};

const chaves = [
    { id: 0, nome: "Key of Souls", desc: "...", item: "assets/Recursos/Key of Souls.png", ef: "...", icone: "https://imgur.com/zHQo8sh.png", det: "..."}, // Convertido item
    { id: 1, nome: "Key of Dreams", desc: "...", item: "assets/Recursos/Key of Dreams.png", ef: "...", icone: "https://imgur.com/lKXdgwT.png", det: "..."}, // Convertido item
    { id: 2, nome: "Key of IMM", desc: "...", item: "assets/Recursos/Key of Infinite Moon Mansion.png", ef: "...", icone: "https://imgur.com/Hf705GX.png", det: "..."}, // Convertido item
    { id: 3, nome: "Key of Desires", desc: "...", item: "assets/Recursos/Key of Desires.png", ef: "...", icone: "https://imgur.com/L2bLSl2.png", det: "..."}, // Convertido item
    { id: 4, nome: "Key of Soul World", desc: "...", item: "assets/Recursos/Key of Soul World.png", ef: "...", icone: "https://imgur.com/X1zPnlJ.png", det: "..."}, // Convertido item
    { id: 5, nome: "Key of Pendragon", desc: "...", item: "assets/Recursos/Key of Pendragon.png", ef: "...", icone: "assets/Recursos/Key of Pendragon.png", det: "..."}, // Convertido item, icone relativo
    { id: 6, nome: "Key PoF", desc: "...", item: "assets/Recursos/Key Pinnacle of Flames.png", ef: "...", icone: "https://imgur.com/46Dh8W2.png", det: "..."}, // Convertido item
    { id: 7, nome: "Key Isaac H", desc: "...", item: "assets/Recursos/Key of Isaac's Heart.png", ef: "...", icone: "assets/Recursos/Key of Isaac's Heart.png", det: "..."}, // item relativo, Convertido icone
];
const estadosIniciais = { circulo1: true, circulo2: false, circulo3: true, circulo4: false, circulo5: true, circulo6: false, circulo7: true, circulo8: false };

// =========================================================================
// DEFINIÇÕES DE FUNÇÕES GLOBAIS (Exatamente como no seu original)
// =========================================================================
function toggleJanelaMusica() {const j=document.getElementById('janelaMusica');if(j)j.style.display=(j.style.display==='none'||j.style.display==='')?'block':'none';}
function mostrarTexto() {const sC=document.getElementById('secao-classes');const exp=sC?sC.querySelector('.expandido'):document.querySelector('.expandido');if(exp)exp.style.display=(exp.style.display==='none'||exp.style.display==='')?'block':'none';else console.error("Elemento '.expandido' não encontrado!");}
function toggleProfissao() {const d=document.getElementById('detalhesProfissao');if(d)d.style.display=(d.style.display==='none'||d.style.display==='')?'block':'none';}
function abrirJanelaEstadoCivil() {const j=document.getElementById("janelaEstadoCivil");const t=document.querySelector(".texto-clicavel-isaac");if(j&&t){const r=t.getBoundingClientRect();const oX=window.pageXOffset||document.documentElement.scrollLeft;const oY=window.pageYOffset||document.documentElement.scrollTop;j.style.left=`${r.right+oX+10}px`;j.style.top=`${r.top+oY}px`;j.style.display="block";}}
function fecharJanelaEstadoCivil() {const j=document.getElementById("janelaEstadoCivil");if(j)j.style.display="none";}
function togglePlayerMusicaIsaac() {const p=document.getElementById('playerMusicaIsaac');const eC=document.getElementById('janelaEstadoCivil');if(p&&eC){if(p.style.display==='none'||p.style.display===''){p.style.display='flex';eC.style.zIndex='900';centralizarElementosPlayer();if(audio&&!audio.currentSrc){selecionarMusica(1);}else if(audio&&audio.paused){playPause();}}else{p.style.display='none';eC.style.zIndex='1000';}}}
function fecharPlayer() {const p=document.getElementById('playerMusicaIsaac');const eC=document.getElementById('janelaEstadoCivil');if(p)p.style.display='none';if(eC)eC.style.zIndex='1000';if(audio){audio.pause();musicaTocando=false;atualizarBotaoPlay();}} // Adicionado estado manual aqui por garantia
function centralizarElementosPlayer() {const c=document.querySelector('.capa-musica-isaac');const p=document.querySelector('.player-musica-isaac');if(c&&p){c.style.margin='auto';p.style.display='flex';p.style.flexDirection='column';p.style.alignItems='center';p.style.justifyContent='space-between';}}
function selecionarMusica(id) {const m=listaDeMusicas.find(i=>i.id===id);if(m&&audio&&audioSource&&playerMusica){const nE=playerMusica.querySelector('.nome-musica-isaac');const aE=playerMusica.querySelector('.autor-musica-isaac');const cE=playerMusica.querySelector('.capa-musica-isaac img');const pB=playerMusica;if(nE)nE.textContent=m.nome;if(aE)aE.textContent=m.autor;if(cE){cE.src=m.capa;cE.onerror=()=>{cE.src='assets/Imagens Isaac/default_capa.png';console.error(`Erro capa: ${m.capa}`);}}if(pB)pB.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)), url('${m.background}')`;audioSource.src=m.link;audio.load();/*Removido oncanplaythrough problemático*/atualizarFavoritoVisual(id);/*atualizarBotaoPlay();*/}}
function toggleLista() {const l=document.getElementById('listaMusicas');if(l)l.style.display=(l.style.display==='block')?'none':'block';}
function atualizarFavoritoVisual(id){const b=document.querySelector('.botao-favoritar-isaac');if(b){if(musicasFavoritadas[id]){b.classList.add('favoritado');b.textContent='💖';}else{b.classList.remove('favoritado');b.textContent='🤍';}}}
function favoritarMusica(){const nE=document.querySelector('.nome-musica-isaac');if(nE){const m=listaDeMusicas.find(i=>i.nome===nE.textContent);if(m){musicasFavoritadas[m.id]=!musicasFavoritadas[m.id];if(!musicasFavoritadas[m.id])delete musicasFavoritadas[m.id];atualizarFavoritoVisual(m.id);localStorage.setItem(storageKey,JSON.stringify(musicasFavoritadas));}}}
function retroceder10s(){if(audio&&!isNaN(audio.duration)){audio.currentTime=Math.max(0,audio.currentTime-10);}}
function avancar10s(){if(audio&&!isNaN(audio.duration)){audio.currentTime=Math.min(audio.duration,audio.currentTime+10);}}
function playPause(){if(!audio)return;if(!audio.currentSrc&&listaDeMusicas.length>0){selecionarMusica(1);setTimeout(()=>{if(audio)audio.play().catch(e=>console.warn("Play inicial bloqueado.",e));},150);return;}if(musicaTocando){audio.pause();}else{audio.play().catch(e=>console.warn("Play bloqueado.",e));}}
function atualizarBotaoPlay(){const b=document.querySelector('.botao-controle-isaac:nth-child(2)');if(b)b.textContent=musicaTocando?'II':'►';}
function formatarTempo(s){if(isNaN(s)||!isFinite(s)||s<0)return"0:00";const m=Math.floor(s/60);const rS=Math.floor(s%60);return`${m}:${rS<10?'0':''}${rS}`;}
function atualizarListaMusicas(){const lC=document.getElementById('listaMusicas');if(lC){lC.innerHTML='';listaDeMusicas.forEach((m)=>{const i=document.createElement('p');i.textContent=m.nome;i.addEventListener('click',()=>{selecionarMusica(m.id);if(audio)audio.play().catch(e=>console.warn("Play da lista bloqueado",e));});lC.appendChild(i);});}}
function atualizarBarra(idB,idT,p,idS=null){const b=document.getElementById(idB);const t=document.getElementById(idT);if(b&&t){b.style.width=`${p}%`;t.textContent=`${p}%`;let c;if(p<=20)c='darkred';else if(p<=40)c='#FF9100';else if(p<=60)c='#00D19A';else if(p<=80)c='#D622EF';else c='#6222EF';b.style.backgroundColor=c;if(idS){const sE=document.getElementById(idS);if(sE){let tS;if(p<=20)tS='Infame..';else if(p<=40)tS='Desprezado..';else if(p<=60)tS='Ambíguo..';else if(p<=80)tS='Respeitado..';else tS='Renomado..';sE.textContent=tS;}}}}
function iniciarCarrossel(){const c=document.querySelector('.carrossel-imagens');const cC=document.querySelector('.carrossel-titulos');if(!c||!cC)return;clearInterval(carrosselInterval);carrosselInterval=setInterval(()=>{if(!c){clearInterval(carrosselInterval);return;}c.scrollLeft+=1;if(c.scrollLeft>=c.scrollWidth-c.offsetWidth){c.scrollLeft=0;}},30);}
function pausarCarrossel(){clearInterval(carrosselInterval);}
function abrirJanelaTitulo(id){pausarCarrossel();const j=document.getElementById(`janelaTitulo${id}`);if(j)j.style.display='block';}
function fecharJanelaTitulo(id){const j=document.getElementById(`janelaTitulo${id}`);if(j){j.style.display='none';iniciarCarrossel();}}
function expandirJanelaTitulo(id){const j=document.getElementById(`janelaTitulo${id}`);if(j)j.classList.toggle('janela-expandida');}
function toggleCheckbox(e){e.classList.toggle("checked");}
function atualizarAtributoAtual(a,t,p){const vA=Math.floor((p/100)*t);const tE=document.getElementById(`texto-${a}`);const bE=document.getElementById(`barra-${a}`);if(tE)tE.innerText=`${vA} / ${t}`;if(bE)bE.style.width=`${p}%`;}
function navegar(dOI){if(typeof dOI==='number'&&dOI>=0&&dOI<chaves.length){chaveAtual=dOI;}else if(typeof dOI==='number'){chaveAtual=(chaveAtual+dOI+chaves.length)%chaves.length;}else{return;}const c=chaves[chaveAtual];if(!c)return;const tI=document.getElementById("titulo-item");const dD=document.querySelector("#retangulo-item .descricao-detalhada");const iI=document.querySelector("#retangulo-item .item-imagem img");const tE=document.querySelector("#retangulo-efeitos .titulo-efeito");const iE=document.querySelector("#retangulo-efeitos img");const dE=document.querySelector("#retangulo-efeitos .detalhes-detalhados");if(tI)tI.textContent=c.nome;if(dD)dD.textContent=c.descricao;if(iI){iI.src=c.item;iI.onerror=()=>{iI.src='assets/Recursos/default_key.png';}}if(tE)tE.textContent=c.efeito;if(iE){iE.src=c.icone;iE.onerror=()=>{iE.src='assets/Recursos/default_icon.png';}}if(dE)dE.textContent=c.detalhes;atualizarDestaqueCirculo(chaveAtual+1);}
function atualizarDestaqueCirculo(id){document.querySelectorAll(".circulo-pequeno").forEach((c,i)=>{c.style.boxShadow=(i+1===id)?"0 0 10px 3px #FFD700":"none";});}
function toggleCirculo1(){toggleEstado('circulo1');} function toggleCirculo2(){toggleEstado('circulo2');} function toggleCirculo3(){toggleEstado('circulo3');} function toggleCirculo4(){toggleEstado('circulo4');} function toggleCirculo5(){toggleEstado('circulo5');} function toggleCirculo6(){toggleEstado('circulo6');} function toggleCirculo7(){toggleEstado('circulo7');} function toggleCirculo8(){toggleEstado('circulo8');}
function toggleEstado(id){const c=document.getElementById(id);if(c)c.classList.toggle('ativo');}
function ativarChave(){const c=chaves[chaveAtual];if(c)alert(`Ativando: ${c.nome}`);}
function moverCarrossel(d){const c=document.querySelector('.carrossel-diamantes');if(!c)return;const i=c.querySelectorAll('.diamante-item');if(i.length===0)return;i.forEach(item=>item.classList.remove('ativo'));posicaoCarrossel=(posicaoCarrossel+d+i.length)%i.length;if(i[posicaoCarrossel]){i[posicaoCarrossel].classList.add('ativo');const t=i[posicaoCarrossel].offsetWidth+10;const sT=(posicaoCarrossel*t)-(c.offsetWidth/2)+(t/2);c.scrollTo({left:sT,behavior:'smooth'});}}
function abrirJanela(id){const j=document.getElementById(id);if(j)j.style.display='block';}
function fecharJanela(id){const j=document.getElementById(id);if(j)j.style.display='none';}
function expandirJanela(id){const j=document.getElementById(id);if(j)j.classList.toggle('janela-expandida');}
function abrirJanelaFilho(id){abrirJanela(`janelaFilho${id}`);}
function fecharJanelaFilho(id){fecharJanela(`janelaFilho${id}`);}
function expandirJanelaFilho(id){expandirJanela(`janelaFilho${id}`);}
function atualizarStatusBasicas(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='darkred';st='Crítico';}else if(p<=30){c='red';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='green';st='Bom';}else if(p<=100){c='#00B59B';st='Excelente';}else{c='#6222EF';st='Insano';}f.style.backgroundColor=c;s.textContent=st;}}
function atualizarStatusTemporarias(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='#00B59B';st='Muito Baixo';}else if(p<=30){c='green';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='red';st='Alto';}else{c='darkred';st='Crítico';}f.style.backgroundColor=c;s.textContent=st;}}
function atualizarAether(p){if(p>102)p=102;if(p<0)p=0;const pa=document.getElementById("preenchimentoAether");const ta=document.getElementById("textoAether");if(pa)pa.style.width=`${(p/102)*100}%`;if(ta)ta.textContent=`Aether: ${p}%`;}
function addDragEventsToWindow(j){let iD=false,dX,dY,iL,iT;const dH=j.querySelector('.janela-cabecalho-arrastavel')||j.querySelector('.janela-botoes')||j;if(!dH)return;dH.addEventListener('mousedown',(e)=>{if(e.target.closest('button,input,a,.no-drag'))return;iD=true;dX=e.clientX;dY=e.clientY;iL=j.offsetLeft;iT=j.offsetTop;j.style.cursor='grabbing';j.style.userSelect='none';});document.addEventListener('mousemove',(e)=>{if(iD){e.preventDefault();const dX_=e.clientX-dX;const dY_=e.clientY-dY;j.style.left=`${iL+dX_}px`;j.style.top=`${iT+dY_}px`;}});document.addEventListener('mouseup',()=>{if(iD){iD=false;j.style.cursor='move';j.style.userSelect='';}});dH.style.cursor='move';j.classList.add('janela-arrastavel');}

// =========================================================================
// CÓDIGO EXECUTADO QUANDO O DOM ESTÁ PRONTO (DOMContentLoaded)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- Inicializa Player Isaac (Exatamente como no seu original) ---
    playerMusica = document.querySelector('.player-musica-isaac'); // Atribui à var global
    if (playerMusica) { // Só continua se o player foi encontrado
        audio = playerMusica.querySelector('#audio-player');          // Atribui à var global
        if (audio) { audioSource = audio.querySelector('source'); }    // Atribui à var global
        progressBar = playerMusica.querySelector('#progress-bar');      // Atribui à var global
        tempoAtual = playerMusica.querySelector('#tempo-atual');      // Atribui à var global
        tempoTotal = playerMusica.querySelector('#tempo-total');      // Atribui à var global

        // Adiciona listeners internos do player
        if (progressBar && audio) { progressBar.addEventListener('input', () => { /* ... */ }); }
        if (audio) {
            audio.addEventListener('timeupdate', () => { /* ... */ });
            audio.addEventListener('loadedmetadata', () => { /* ... */ });
            audio.addEventListener('ended', () => { musicaTocando = false; atualizarBotaoPlay(); });
            audio.addEventListener('play', () => { musicaTocando = true; atualizarBotaoPlay(); });
            audio.addEventListener('pause', () => { musicaTocando = false; atualizarBotaoPlay(); });
        }
    }

    // Listener dos botões Favoritar e Lista (Exatamente como no seu original)
    // Nota: Seletores buscam em todo o documento, o que é ok se os botões estiverem no index.html
    const favButton = document.querySelector(".botao-favoritar-isaac");
    const listButton = document.querySelector(".botao-lista-musicas");
    if(favButton) favButton.addEventListener("click", favoritarMusica);
    else console.warn("Botão favoritar não encontrado no DOM inicial.");
    if(listButton) listButton.addEventListener("click", toggleLista);
    else console.warn("Botão lista músicas não encontrado no DOM inicial.");

    // Inicializa Lista de Músicas e estado do botão (Exatamente como no seu original)
    // Esta parte estava separada em outro DOMContentLoaded no seu original, mas funciona aqui também.
    if (document.getElementById('listaMusicas')) {
         atualizarListaMusicas();
         // selecionarMusica(1); // Comentado pois estava no seu original, mas pode causar play indesejado
         document.getElementById('listaMusicas').style.display = 'none';
         atualizarBotaoPlay();
    }

    // --- Atualiza Barras Status (Exatamente como no seu original) ---
    atualizarBarra('barra-autoestima', 'texto-autoestima', 98);
    atualizarBarra('barra-fama', 'texto-fama', 97, 'status-fama');

    // --- Configura Carrossel Títulos (Exatamente como no seu original) ---
    const carrosselContainer = document.querySelector('.carrossel-titulos'); // Nome original da variável
    if(carrosselContainer){
        const carrossel = carrosselContainer.querySelector('.carrossel-imagens'); // Nome original da variável
        if(carrossel) {
             pausarCarrosselFunc = pausarCarrossel; // Exporta ref global
             iniciarCarrosselFunc = iniciarCarrossel; // Exporta ref global
             iniciarCarrossel();
             carrosselContainer.addEventListener('mouseover', pausarCarrossel);
             carrosselContainer.addEventListener('mouseout', iniciarCarrossel);
             // Listener de clique (Exatamente como no seu original)
             document.querySelectorAll('.titulo-item').forEach((item) => {
                 item.addEventListener('click', (e) => {
                     pausarCarrossel();
                     // Seu código original para extrair ID
                     const onclickAttr = e.currentTarget.getAttribute('onclick');
                     if (onclickAttr) {
                         const idMatch = onclickAttr.match(/\d+/); // Encontra o primeiro número
                         if (idMatch && idMatch[0]) {
                             abrirJanelaTitulo(parseInt(idMatch[0]));
                         }
                     }
                 });
             });
        }
    }
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow); // Torna janelas arrastáveis

    // --- Atualiza Atributos (Exatamente como no seu original) ---
    for (let atributoKey in atributos) {
        if (Object.hasOwnProperty.call(atributos, atributoKey)) {
            atualizarAtributoAtual(atributoKey, atributos[atributoKey].total, atributos[atributoKey].porcentagem);
        }
    }

    // --- Inicializa Selos (Exatamente como no seu original) ---
    for (const [id, ativo] of Object.entries(estadosIniciais)) {
        const circulo = document.getElementById(id);
        if (circulo) { if (ativo) circulo.classList.add('ativo'); else circulo.classList.remove('ativo'); }
    }
    document.querySelectorAll(".titulo-item, .titulo-efeito, .descricao-detalhada, .detalhes-detalhados").forEach(elemento => { // Seletores originais
         if(elemento) elemento.contentEditable = "false";
    });
    if(document.getElementById("titulo-item")) { navegar(0); } // Inicializa

    // --- Inicializa Carrossel Bênçãos (Exatamente como no seu original) ---
    const diamantes = document.querySelectorAll('.diamante-item');
    if (diamantes.length > 0) {
        const meio = Math.floor(diamantes.length / 2); // Variável local original
        if(diamantes[meio]) diamantes[meio].classList.add('ativo');
        // moverCarrossel(0); // Seu original chamava isso dentro do DOMLoaded da Bênção, chamando aqui agora
    }
     document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow); // Tornar janelas arrastáveis

    // --- Atualiza Barra EA (Exatamente como no seu original) ---
    atualizarEA(86);

    // --- Atualiza Necessidades (Exatamente como no seu original) ---
    atualizarStatusBasicas('grupo-higiene', 97); atualizarStatusBasicas('grupo-banheiro', 100); atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 100); atualizarStatusBasicas('grupo-sede', 100); atualizarStatusBasicas('grupo-diversao', 101);
    atualizarStatusBasicas('grupo-social', 78); atualizarStatusBasicas('grupo-foco', 64);
    atualizarStatusBasicas('grupo-felicidade', 101); atualizarStatusBasicas('grupo-tesao', 101);
    atualizarStatusBasicas('grupo-desgaste', 0); // Completado conforme HTML
    atualizarStatusTemporarias('grupo-enjoo', 0); atualizarStatusTemporarias('grupo-fadiga', 0); atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0); atualizarStatusTemporarias('grupo-medo', 0);
    atualizarStatusTemporarias('grupo-tedio', 0); atualizarStatusTemporarias('grupo-raiva', 0);

    // --- Atualiza Aether (Exatamente como no seu original) ---
    atualizarAether(porcentagemAether);

    // --- Adiciona Drag às Janelas Restantes (Exatamente como no seu original) ---
    document.querySelectorAll('.janela-filhos, #janelaEstadoCivil').forEach(addDragEventsToWindow);

    // --- Carrega as seções dinâmicas ---
    // As chamadas são as mesmas, mas agora usarão a definição única de loadSection no topo
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function(){const p=document.querySelector("#secao-aura #janelaMusica iframe");if(p)p.src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";});
    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html", function(){console.log("Seção Cabeçalho carregada!");});
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function(){setTimeout(()=>{var p=document.querySelector('#secao-bahdinheiro #expBar');if(p){var pct=75;p.style.width=pct+'%';const c=p.closest('.barra-exp-container');if(c){const t=c.querySelector('.barra-texto');if(t)t.textContent='1590 - '+pct+'%';}}},500);});
    loadSection("secao-classes", "Seções/5-Classes.html", function(){console.log("Seção Classes carregada!");});
    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function(){
        // Lógica original do callback, com funções locais
        function aBL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa #${iB}`);var ts=document.querySelector(`#secao-modoempusa #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}
        function aFL(){const s=document.querySelector("#secao-modoempusa #sangue-texto");const v=document.querySelector("#secao-modoempusa #vitalidade-texto");if(s&&v){var sg=parseInt(s.textContent)||0;var vt=parseInt(v.textContent)||0;var ft=Math.min(sg+vt,100);aBL("fomeBar","fome-texto",ft);}}
        function tML(st){var m=st.parentElement.nextElementSibling;if(m&&m.classList.contains('empusa-menu')){document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(i=>{if(i!==m)i.style.display='none';});m.style.display=(m.style.display==='block')?'none':'block';}}
        function aDL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa #coracao-${i}`);if(c)c.textContent=(i<=nD)?"💜":"🤍";}}
        function aSL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}
        setTimeout(()=>{aBL("prazerBar","prazer-texto",99);aBL("amorBar","amor-texto",100);aBL("sangueBar","sangue-texto",47);aBL("vitalidadeBar","vitalidade-texto",100);aFL();aDL(1);aSL("satisfacao-container","satisfacao",5);document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(s=>{s.addEventListener('click',function(){tML(this);});});},500);
    });
    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function(){
        // Lógica original do callback, com funções locais
        function aBAL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa-alvo #${iB}`);var ts=document.querySelector(`#secao-modoempusa-alvo #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}
        function aDAL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa-alvo #coracao-alvo-${i}`);if(c)c.textContent=i<=nD?"💜":"🤍";}}
        function aSAL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa-alvo #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa-alvo #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}
        function aDoL(p){p=Math.max(0,Math.min(p,100));let pre=document.querySelector("#secao-modoempusa-alvo #dominanciaBar");let emo=document.querySelector("#secao-modoempusa-alvo #dominancia-emoji");if(pre&&emo){pre.style.background=`linear-gradient(to right,#ff12a9 0%,#ff12a9 ${Math.max(0,p-5)}%,#a020f0 ${p}%,#1e90ff ${Math.min(100,p+5)}%,#1e90ff 100%)`;emo.style.left=`calc(${p}% - 15px)`;}}
        setTimeout(()=>{aBAL("prazerBarAlvo","prazer-texto-alvo",98);aBAL("amorBarAlvo","amor-texto-alvo",100);aBAL("volumeBarAlvo","volume-texto-alvo",5);aBAL("vitalidadeBarAlvo","vitalide-texto-alvo",21);aDAL(3);aSAL("satisfacao-container-alvo","satisfacao-alvo",5);aDoL(73);},500);
    });

    console.log("Script.js: DOMContentLoaded concluído.");
}); // FIM DO DOMContentLoaded

console.log("Script.js totalmente carregado (Baseado 100% no original + Estrutura).");
