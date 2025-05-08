// =========================================================================
// script.js COMPLETO - vFinal com Caminhos Relativos e Dados Restaurados
// =========================================================================

// =========================================================================
// FUNÇÃO UNIVERSAL PARA CARREGAR SEÇÕES
// =========================================================================
function loadSection(id, url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ao carregar ${url}`);
            }
            return response.text();
        })
        .then(data => {
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.innerHTML = data;
                if (callback) {
                    try {
                        callback();
                    } catch (e) {
                        console.error(`Erro no callback de loadSection para ${id} (${url}):`, e);
                    }
                }
            } else {
                console.error(`Elemento com ID '${id}' não encontrado para carregar ${url}. Verifique o HTML principal.`);
            }
        })
        .catch(error => console.error(`Erro geral ao carregar a seção ${url} em #${id}:`, error));
}

// =========================================================================
// VARIÁVEIS GLOBAIS
// =========================================================================
let playerMusicaIsaacGlob, audioGlob, audioSourceGlob, progressBarGlob, tempoAtualGlob, tempoTotalGlob;
let musicaTocandoGlob = false;
let carrosselTitulosInterval; // Para carrossel de títulos
let pausarCarrosselTitulosFunc, iniciarCarrosselTitulosFunc; // Funções do carrossel para acesso global
let chaveAtualSelos = 0;
let posicaoCarrosselBencaos = 0;
let porcentagemAether = 101; // Valor inicial do Aether

// =========================================================================
// DADOS (com caminhos relativos)
// =========================================================================

// --- PLAYER DE MÚSICA ISAAC ---
// !!! VERIFIQUE SE ESTES CAMINHOS CORRESPONDEM À ESTRUTURA NO REPO 'Buffy' !!!
const listaDeMusicasIsaac = [
    {
        id: 1,
        nome: "Crying Alone / Nowhere",
        autor: "Kurae Radiânthia Pendragon Isaac",
        capa: "assets/Imagens Isaac/sac2.jpg",       // Caminho relativo deduzido
        background: "assets/Imagens Isaac/sac1.jpg", // Caminho relativo deduzido
        link: "assets/CryingAlone-Nowhere.mp3",      // Caminho relativo (confirmar localização)
    }
];
const storageKeyIsaac = 'musicasFavoritadasIsaac';
let musicasFavoritadasIsaac = JSON.parse(localStorage.getItem(storageKeyIsaac)) || {};

// --- SELOS ---
// !!! VERIFIQUE SE ESTES CAMINHOS CORRESPONDEM À ESTRUTURA NO REPO 'Buffy' !!!
const selosChavesData = [
    { id: 0, nome: "Key of Souls", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Souls.png", efeito: "À descobrir 01.", icone: "https://imgur.com/zHQo8sh.png", detalhes: "..."},
    { id: 1, nome: "Key of Dreams", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Dreams.png", efeito: "À descobrir 02.", icone: "https://imgur.com/lKXdgwT.png", detalhes: "..."},
    { id: 2, nome: "Key of Infinite Moon Mansion", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Infinite Moon Mansion.png", efeito: "À descobrir 03.", icone: "https://imgur.com/Hf705GX.png", detalhes: "..."},
    { id: 3, nome: "Key of Desires", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Desires.png", efeito: "À descobrir 04.", icone: "https://imgur.com/L2bLSl2.png", detalhes: "..."},
    { id: 4, nome: "Key of Soul World", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Soul World.png", efeito: "À descobrir 05.", icone: "https://imgur.com/X1zPnlJ.png", detalhes: "..."},
    { id: 5, nome: "Key of Pendragon", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Pendragon.png", efeito: "À descobrir 06.", icone: "assets/Recursos/Key of Pendragon.png", detalhes: "..."},
    { id: 6, nome: "Key Pinnacle of Flames", descricao: "Nenhuma informação...", item: "assets/Recursos/Key Pinnacle of Flames.png", efeito: "À descobrir 07.", icone: "https://imgur.com/46Dh8W2.png", detalhes: "..."},
    { id: 7, nome: "Key of Isaac's Heart", descricao: "Nenhuma informação...", item: "assets/Recursos/Key of Isaac's Heart.png", efeito: "À descobrir 08.", icone: "assets/Recursos/Key of Isaac's Heart.png", detalhes: "..."},
];
const selosEstadosIniciais = { circulo1: true, circulo2: false, circulo3: true, circulo4: false, circulo5: true, circulo6: false, circulo7: true, circulo8: false };

// --- ATRIBUTOS ---
const atributosData = {
    hp: { total: 4910210, porcentagem: 100 }, mp: { total: 823691, porcentagem: 100 },
    agi: { total: 637369, porcentagem: 100 }, def: { total: 1476557, porcentagem: 100 },
    res: { total: 1331048, porcentagem: 100 }, spd: { total: 1020989, porcentagem: 100 },
    int: { total: 431815, porcentagem: 100 }, atk: { total: 2075839, porcentagem: 100 },
    smp: { total: 291363290, porcentagem: 99.17 }, unknown: { total: 100, porcentagem: 50 }
};

// =========================================================================
// DEFINIÇÕES DE FUNÇÕES GLOBAIS (Chamadas pelo HTML via onclick)
// =========================================================================

// --- GERAL ---
function abrirJanela(idJanela) { const j=document.getElementById(idJanela); if(j) j.style.display='block'; }
function fecharJanela(idJanela) { const j=document.getElementById(idJanela); if(j) j.style.display='none'; }
function expandirJanela(idJanela) { const j=document.getElementById(idJanela); if(j) j.classList.toggle('janela-expandida'); }

// --- BUFFY MÚSICA ---
function toggleJanelaMusica() { const j=document.getElementById('janelaMusica'); if(j) j.style.display=(j.style.display==='none'||j.style.display==='')?'block':'none'; }

// --- CLASSES ---
function mostrarTexto() {
    const sC=document.getElementById('secao-classes'); if(!sC)return; const exp=sC.querySelector('.expandido');
    if(exp) exp.style.display=(exp.style.display==='none'||exp.style.display==='')?'block':'none';
}

// --- CARACTERÍSTICAS ---
function toggleProfissao() { const d=document.getElementById('detalhesProfissao'); if(d) d.style.display=(d.style.display==='none'||d.style.display==='')?'block':'none'; }
function abrirJanelaEstadoCivil() { const j=document.getElementById("janelaEstadoCivil");const t=document.querySelector(".texto-clicavel-isaac");if(j&&t){const r=t.getBoundingClientRect();j.style.left=`${r.right+window.scrollX+10}px`;j.style.top=`${r.top+window.scrollY}px`;j.style.display="block";} }
function fecharJanelaEstadoCivil() { const j=document.getElementById("janelaEstadoCivil"); if(j) j.style.display="none"; }

// --- PLAYER ISAAC ---
function togglePlayerMusicaIsaac() { const p=playerMusicaIsaacGlob;const eC=document.getElementById('janelaEstadoCivil');if(!p)return; if(p.style.display==='none'||p.style.display===''){p.style.display='flex';if(eC)eC.style.zIndex='900';centralizarElementosPlayerIsaac();if(audioGlob&&!audioGlob.currentSrc&&listaDeMusicasIsaac.length>0){selecionarMusicaIsaac(listaDeMusicasIsaac[0].id);}else if(audioGlob&&audioGlob.paused){playPause();}}else{p.style.display='none';if(eC)eC.style.zIndex='1000';} }
function fecharPlayer() { const p=playerMusicaIsaacGlob;const eC=document.getElementById('janelaEstadoCivil');if(p)p.style.display='none';if(eC)eC.style.zIndex='1000';if(audioGlob)audioGlob.pause();}
function toggleLista() { const l=document.getElementById('listaMusicas');if(l)l.style.display=(l.style.display==='block')?'none':'block';}
function favoritarMusica() { if(!playerMusicaIsaacGlob)return;const nE=playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');if(nE&&nE.textContent){const m=listaDeMusicasIsaac.find(i=>i.nome===nE.textContent);if(m){musicasFavoritadasIsaac[m.id]=!musicasFavoritadasIsaac[m.id];if(!musicasFavoritadasIsaac[m.id])delete musicasFavoritadasIsaac[m.id];atualizarFavoritoVisualIsaac(m.id);localStorage.setItem(storageKeyIsaac,JSON.stringify(musicasFavoritadasIsaac));}}}
function retroceder10s() { if(audioGlob&&!isNaN(audioGlob.duration)){audioGlob.currentTime=Math.max(0,audioGlob.currentTime-10);} }
function avancar10s() { if(audioGlob&&!isNaN(audioGlob.duration)){audioGlob.currentTime=Math.min(audioGlob.duration,audioGlob.currentTime+10);} }
function playPause() { if(!audioGlob)return;if(!audioGlob.currentSrc&&listaDeMusicasIsaac.length>0){selecionarMusicaIsaac(listaDeMusicasIsaac[0].id);audioGlob.play().catch(e=>console.warn("Play inicial bloqueado.",e));return;}if(musicaTocandoGlob){audioGlob.pause();}else{audioGlob.play().catch(e=>console.warn("Play bloqueado.",e));}}

// --- TÍTULOS ---
function abrirJanelaTitulo(id) { if(typeof pausarCarrosselTitulosFunc==='function')pausarCarrosselTitulosFunc(); const j=document.getElementById(`janelaTitulo${id}`);if(j)j.style.display='block'; }
function fecharJanelaTitulo(id) { const j=document.getElementById(`janelaTitulo${id}`);if(j){j.style.display='none';if(typeof iniciarCarrosselTitulosFunc==='function')iniciarCarrosselTitulosFunc();}}
function expandirJanelaTitulo(id) { const j=document.getElementById(`janelaTitulo${id}`);if(j)j.classList.toggle('janela-expandida'); }

// --- ATRIBUTOS ---
function toggleCheckbox(element) { element.classList.toggle("checked"); }

// --- SELOS ---
function navegar(dOI) { if(typeof dOI==='number'&&dOI>=0&&dOI<selosChavesData.length){chaveAtualSelos=dOI;}else if(typeof dOI==='number'){chaveAtualSelos=(chaveAtualSelos+dOI+selosChavesData.length)%selosChavesData.length;}else{return;} const c=selosChavesData[chaveAtualSelos];if(!c)return; const tI=document.getElementById("titulo-item");const dD=document.querySelector("#retangulo-item .descricao-detalhada");const iI=document.querySelector("#retangulo-item .item-imagem img");const tE=document.querySelector("#retangulo-efeitos .titulo-efeito");const iE=document.querySelector("#retangulo-efeitos img");const dE=document.querySelector("#retangulo-efeitos .detalhes-detalhados"); if(tI)tI.textContent=c.nome;if(dD)dD.textContent=c.descricao;if(iI){iI.src=c.item;iI.onerror=()=>{iI.src='assets/Recursos/default_key.png';console.error(`Erro item selo: ${c.item}`);}} if(tE)tE.textContent=c.efeito;if(iE){iE.src=c.icone;iE.onerror=()=>{iE.src='assets/Recursos/default_icon.png';console.error(`Erro icone selo: ${c.icone}`);}} if(dE)dE.textContent=c.detalhes; atualizarDestaqueCirculoSelos(chaveAtualSelos);}
function toggleCirculo1(){const c=document.getElementById('circulo1');if(c)c.classList.toggle('ativo');} function toggleCirculo2(){const c=document.getElementById('circulo2');if(c)c.classList.toggle('ativo');} function toggleCirculo3(){const c=document.getElementById('circulo3');if(c)c.classList.toggle('ativo');} function toggleCirculo4(){const c=document.getElementById('circulo4');if(c)c.classList.toggle('ativo');} function toggleCirculo5(){const c=document.getElementById('circulo5');if(c)c.classList.toggle('ativo');} function toggleCirculo6(){const c=document.getElementById('circulo6');if(c)c.classList.toggle('ativo');} function toggleCirculo7(){const c=document.getElementById('circulo7');if(c)c.classList.toggle('ativo');} function toggleCirculo8(){const c=document.getElementById('circulo8');if(c)c.classList.toggle('ativo');}
function ativarChave() { const c=selosChavesData[chaveAtualSelos];if(c)alert(`Ativando: ${c.nome}`); }

// --- BENÇÃOS/MALDIÇÕES ---
function moverCarrossel(d) { const c=document.querySelector('.carrossel-diamantes');if(!c)return;const i=c.querySelectorAll('.diamante-item');if(i.length===0)return;i.forEach(item=>item.classList.remove('ativo'));posicaoCarrosselBencaos=(posicaoCarrosselBencaos+d+i.length)%i.length;if(i[posicaoCarrosselBencaos]){i[posicaoCarrosselBencaos].classList.add('ativo');const t=i[posicaoCarrosselBencaos].offsetWidth+10;const sT=(posicaoCarrosselBencaos*t)-(c.offsetWidth/2)+(t/2);c.scrollTo({left:sT,behavior:'smooth'});}}

// =========================================================================
// FUNÇÕES INTERNAS (Não chamadas diretamente pelo HTML)
// =========================================================================
function centralizarElementosPlayerIsaac() { const p=playerMusicaIsaacGlob;const c=p?p.querySelector('.capa-musica-isaac'):null;if(c&&p){c.style.margin='auto';p.style.display='flex';p.style.flexDirection='column';p.style.alignItems='center';p.style.justifyContent='space-between';}}
function atualizarFavoritoVisualIsaac(id) { const b=playerMusicaIsaacGlob?playerMusicaIsaacGlob.querySelector('.botao-favoritar-isaac'):null;if(b){if(musicasFavoritadasIsaac[id]){b.classList.add('favoritado');b.textContent='💖';}else{b.classList.remove('favoritado');b.textContent='🤍';}}}
function atualizarBotaoPlayIsaac() { const b=playerMusicaIsaacGlob?playerMusicaIsaacGlob.querySelector('.controles-isaac .botao-controle-isaac:nth-child(2)'):null;if(b){b.textContent=musicaTocandoGlob?'II':'►';}}
function formatarTempo(s) { if(isNaN(s)||!isFinite(s)||s<0)return"0:00";const m=Math.floor(s/60);const rS=Math.floor(s%60);return`${m}:${rS<10?'0':''}${rS}`; }
function atualizarListaMusicasIsaac() { const lC=document.getElementById('listaMusicas');if(lC){lC.innerHTML='';listaDeMusicasIsaac.forEach((m)=>{const i=document.createElement('p');i.textContent=m.nome;i.addEventListener('click',()=>{selecionarMusicaIsaac(m.id);if(audioGlob)audioGlob.play().catch(e=>console.warn("Play da lista bloqueado",e));});lC.appendChild(i);});}}
function atualizarDestaqueCirculoSelos(idx) { document.querySelectorAll(".circulo-pequeno").forEach((c,i)=>{c.style.boxShadow=(i===idx)?"0 0 10px 3px #FFD700":"none";}); }
function addDragEventsToWindow(j) { let iD=false,dX,dY,iL,iT;const dH=j.querySelector('.janela-cabecalho-arrastavel')||j.querySelector('.janela-botoes')||j;if(!dH)return;dH.addEventListener('mousedown',(e)=>{if(e.target.closest('button,input,a,.no-drag'))return;iD=true;dX=e.clientX;dY=e.clientY;iL=j.offsetLeft;iT=j.offsetTop;j.style.cursor='grabbing';j.style.userSelect='none';});document.addEventListener('mousemove',(e)=>{if(iD){e.preventDefault();const dX_=e.clientX-dX;const dY_=e.clientY-dY;j.style.left=`${iL+dX_}px`;j.style.top=`${iT+dY_}px`;}});document.addEventListener('mouseup',()=>{if(iD){iD=false;j.style.cursor='move';j.style.userSelect='';}});dH.style.cursor='move';j.classList.add('janela-arrastavel');}

// =========================================================================
// CÓDIGO EXECUTADO QUANDO O DOM ESTÁ PRONTO
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- Inicializa Player Isaac ---
    playerMusicaIsaacGlob = document.getElementById('playerMusicaIsaac');
    if (playerMusicaIsaacGlob) {
        audioGlob = playerMusicaIsaacGlob.querySelector('#audio-player');
        if (audioGlob) { audioSourceGlob = audioGlob.querySelector('source'); }
        progressBarGlob = playerMusicaIsaacGlob.querySelector('#progress-bar');
        tempoAtualGlob = playerMusicaIsaacGlob.querySelector('#tempo-atual');
        tempoTotalGlob = playerMusicaIsaacGlob.querySelector('#tempo-total');
        if (progressBarGlob && audioGlob) { progressBarGlob.addEventListener('input',()=>{if(audioGlob&&!isNaN(audioGlob.duration)&&isFinite(audioGlob.duration)&&audioGlob.duration>0){audioGlob.currentTime=(progressBarGlob.value/100)*audioGlob.duration;}}); }
        if (audioGlob) {
            audioGlob.addEventListener('timeupdate',()=>{if(tempoAtualGlob&&!isNaN(audioGlob.currentTime))tempoAtualGlob.textContent=formatarTempo(audioGlob.currentTime);if(progressBarGlob&&audioGlob.duration&&!isNaN(audioGlob.duration)&&audioGlob.duration>0)progressBarGlob.value=(audioGlob.currentTime/audioGlob.duration)*100;});
            audioGlob.addEventListener('loadedmetadata',()=>{if(tempoTotalGlob&&!isNaN(audioGlob.duration)&&audioGlob.duration>0)tempoTotalGlob.textContent=formatarTempo(audioGlob.duration);else if(tempoTotalGlob)tempoTotalGlob.textContent="0:00";});
            audioGlob.addEventListener('ended',()=>{musicaTocandoGlob=false;atualizarBotaoPlayIsaac();});
            audioGlob.addEventListener('play',()=>{musicaTocandoGlob=true;atualizarBotaoPlayIsaac();});
            audioGlob.addEventListener('pause',()=>{musicaTocandoGlob=false;atualizarBotaoPlayIsaac();});
        }
        if (document.getElementById('listaMusicas')) { atualizarListaMusicasIsaac(); document.getElementById('listaMusicas').style.display='none'; atualizarBotaoPlayIsaac(); }
    }

    // --- Atualiza Barras Status (Fama/Autoestima) ---
    function atualizarBarraStatusGeralLocal(idB, idT, p, idS = null) { const b=document.getElementById(idB);const t=document.getElementById(idT);if(!b||!t)return;b.style.width=`${p}%`;t.textContent=`${p}%`;let c;if(p<=20)c='darkred';else if(p<=40)c='#FF9100';else if(p<=60)c='#00D19A';else if(p<=80)c='#D622EF';else c='#6222EF';b.style.backgroundColor=c;if(idS){const sE=document.getElementById(idS);if(sE){let tS;if(p<=20)tS='Infame..';else if(p<=40)tS='Desprezado..';else if(p<=60)tS='Ambíguo..';else if(p<=80)tS='Respeitado..';else tS='Renomado..';sE.textContent=tS;}}}
    atualizarBarraStatusGeralLocal('barra-autoestima', 'texto-autoestima', 98);
    atualizarBarraStatusGeralLocal('barra-fama', 'texto-fama', 97, 'status-fama');

    // --- Configura Carrossel Títulos ---
    const cTE = document.querySelector('.carrossel-titulos .carrossel-imagens'); const cCTE = document.querySelector('.carrossel-titulos');
    function iCTL(){if(!cTE)return;clearInterval(carrosselTitulosInterval);carrosselTitulosInterval=setInterval(()=>{if(!cTE){clearInterval(carrosselTitulosInterval);return;}cTE.scrollLeft+=1;if(cTE.scrollLeft>=cTE.scrollWidth-cTE.offsetWidth-1)cTE.scrollLeft=0;},30);}
    function pCTL(){clearInterval(carrosselTitulosInterval);}
    pausarCarrosselTitulosFunc = pCTL; iniciarCarrosselTitulosFunc = iCTL; // Exporta para funções globais
    if(cTE && cCTE){iCTL();cCTE.addEventListener('mouseover',pCTL);cCTE.addEventListener('mouseout',iCTL);}
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow);

    // --- Atualiza Atributos ---
    function atualizarAtributoAtualLocal(a, t, p) {const vA=Math.floor((p/100)*t); const tE=document.getElementById(`texto-${a}`); const bE=document.getElementById(`barra-${a}`); if(tE)tE.innerText=`${vA} / ${t}`; if(bE)bE.style.width=`${p}%`;}
    for(let a in atributosData){atualizarAtributoAtualLocal(a,atributosData[a].total,atributosData[a].porcentagem);}

    // --- Inicializa Selos ---
    for(const[id,at] of Object.entries(selosEstadosIniciais)){const c=document.getElementById(id);if(c){if(at)c.classList.add('ativo');else c.classList.remove('ativo');}}
    document.querySelectorAll("#retangulo-item .titulo-item,#retangulo-efeitos .titulo-efeito,#retangulo-item .descricao-detalhada,#retangulo-efeitos .detalhes-detalhados").forEach(el=>{if(el)el.contentEditable="false";});
    if(document.getElementById("titulo-item")){navegar(0);} // Chama função global

    // --- Inicializa Carrossel Bênçãos ---
    const dC=document.querySelectorAll('.carrossel-diamantes .diamante-item');if(dC.length>0){posicaoCarrosselBencaos=Math.floor(dC.length/2);if(dC[posicaoCarrosselBencaos]){dC[posicaoCarrosselBencaos].classList.add('ativo');}moverCarrossel(0);} // Chama função global
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);

    // --- Atualiza EA ---
    function atualizarEALocal(p){const b=document.getElementById('preenchimento-ea');const t=document.getElementById('texto-ea');if(b&&t){p=Math.max(0,Math.min(100,p));b.style.width=`${p}%`;t.textContent=`EA: ${p}%`;}}
    atualizarEALocal(86);

    // --- Atualiza Necessidades ---
    function aSBL(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='darkred';st='Crítico';}else if(p<=30){c='red';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='green';st='Bom';}else if(p<=100){c='#00B59B';st='Excelente';}else{c='#6222EF';st='Insano';}f.style.backgroundColor=c;s.textContent=st;}}
    function aSTL(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='#00B59B';st='Muito Baixo';}else if(p<=30){c='green';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='red';st='Alto';}else{c='darkred';st='Crítico';}f.style.backgroundColor=c;s.textContent=st;}}
    aSBL('grupo-higiene',97);aSBL('grupo-banheiro',100);aSBL('grupo-sono',100);aSBL('grupo-fome',100);aSBL('grupo-sede',100);aSBL('grupo-diversao',101);aSBL('grupo-social',78);aSBL('grupo-foco',64);aSBL('grupo-felicidade',101);aSBL('grupo-tesao',101);aSBL('grupo-desgaste',0);
    aSTL('grupo-enjoo',0);aSTL('grupo-fadiga',0);aSTL('grupo-estresse',0);aSTL('grupo-ansiedade',0);aSTL('grupo-medo',0);aSTL('grupo-tedio',0);aSTL('grupo-raiva',0);

    // --- Atualiza Aether ---
    function atualizarAetherLocal(p){if(p>102)p=102;if(p<0)p=0;const pa=document.getElementById("preenchimentoAether");const ta=document.getElementById("textoAether");if(pa)pa.style.width=`${(p/102)*100}%`;if(ta)ta.textContent=`Aether: ${p}%`;}
    atualizarAetherLocal(porcentagemAether);

    // --- Adiciona Drag às Janelas Restantes ---
    document.querySelectorAll('.janela-filhos, #janelaEstadoCivil').forEach(addDragEventsToWindow);

    // --- Carrega Seções Dinâmicas ---
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function(){const p=document.querySelector("#secao-aura #janelaMusica iframe");if(p)p.src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";});
    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html");
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function(){setTimeout(()=>{var p=document.querySelector('#secao-bahdinheiro #expBar');if(p){var pct=75;p.style.width=pct+'%';const c=p.closest('.barra-exp-container');if(c){const t=c.querySelector('.barra-texto');if(t)t.textContent='1590 - '+pct+'%';}}},500);});
    loadSection("secao-classes", "Seções/5-Classes.html");
    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function(){function aBL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa #${iB}`);var ts=document.querySelector(`#secao-modoempusa #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}function aFL(){const s=document.querySelector("#secao-modoempusa #sangue-texto");const v=document.querySelector("#secao-modoempusa #vitalidade-texto");if(s&&v){var sg=parseInt(s.textContent)||0;var vt=parseInt(v.textContent)||0;var ft=Math.min(sg+vt,100);aBL("fomeBar","fome-texto",ft);}}function tML(st){var m=st.parentElement.nextElementSibling;if(m&&m.classList.contains('empusa-menu')){document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(i=>{if(i!==m)i.style.display='none';});m.style.display=(m.style.display==='block')?'none':'block';}}function aDL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa #coracao-${i}`);if(c)c.textContent=(i<=nD)?"💜":"🤍";}}function aSL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}setTimeout(()=>{aBL("prazerBar","prazer-texto",99);aBL("amorBar","amor-texto",100);aBL("sangueBar","sangue-texto",47);aBL("vitalidadeBar","vitalidade-texto",100);aFL();aDL(1);aSL("satisfacao-container","satisfacao",5);document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(s=>{s.addEventListener('click',function(){tML(this);});});},500);});
    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function(){function aBAL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa-alvo #${iB}`);var ts=document.querySelector(`#secao-modoempusa-alvo #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}function aDAL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa-alvo #coracao-alvo-${i}`);if(c)c.textContent=i<=nD?"💜":"🤍";}}function aSAL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa-alvo #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa-alvo #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}function aDoL(p){p=Math.max(0,Math.min(p,100));let pre=document.querySelector("#secao-modoempusa-alvo #dominanciaBar");let emo=document.querySelector("#secao-modoempusa-alvo #dominancia-emoji");if(pre&&emo){pre.style.background=`linear-gradient(to right, #ff12a9 0%, #ff12a9 ${Math.max(0,p-5)}%, #a020f0 ${p}%, #1e90ff ${Math.min(100,p+5)}%, #1e90ff 100%)`;emo.style.left=`calc(${p}% - 15px)`;}}setTimeout(()=>{aBAL("prazerBarAlvo","prazer-texto-alvo",98);aBAL("amorBarAlvo","amor-texto-alvo",100);aBAL("volumeBarAlvo","volume-texto-alvo",5);aBAL("vitalidadeBarAlvo","vitalide-texto-alvo",21);aDAL(3);aSAL("satisfacao-container-alvo","satisfacao-alvo",5);aDoL(73);},500);});

    console.log("Script.js: DOMContentLoaded concluído e seções carregando.");
}); // FIM DO DOMContentLoaded

console.log("Script.js totalmente carregado (vFinal com dados e caminhos RELATIVOS).");
