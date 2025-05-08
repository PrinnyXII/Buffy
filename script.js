// =========================================================================
// script.js - VERSÃO FINALÍSSIMA - Baseado 100% no Original + Correções Mínimas
// =========================================================================

// =========================================================================
// FUNÇÃO UNIVERSAL PARA CARREGAR SEÇÕES (Definição única no topo)
// =========================================================================
// Mantendo a versão que aceita callback, que estava por último no seu script original
function loadSection(id, url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Lançar um erro é melhor para parar a execução se a seção falhar
                throw new Error(`HTTP error! status: ${response.status} ao carregar ${url}`);
            }
            return response.text();
        })
        .then(data => {
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.innerHTML = data;
                // Executa o callback DEPOIS que o HTML foi injetado
                if (callback && typeof callback === 'function') {
                    try {
                        callback();
                    } catch (e) {
                        console.error(`Erro dentro do callback de loadSection para ${id} (${url}):`, e);
                    }
                }
            } else {
                console.error(`Elemento com ID '${id}' não encontrado no HTML principal para carregar ${url}.`);
            }
        })
        .catch(error => console.error(`Erro geral ao carregar a seção ${url} para #${id}:`, error));
}


// =========================================================================
// DEFINIÇÕES DE FUNÇÕES GLOBAIS (Exatamente como no seu original)
// =========================================================================

// --- Buffy Música ---
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    if(janela) { // Adicionada verificação
        if (janela.style.display === 'none' || janela.style.display === '') {
            janela.style.display = 'block';
        } else {
            janela.style.display = 'none';
        }
    }
}

// --- Classes ---
function mostrarTexto() {
    // Será chamado pelo onclick, tentará encontrar '.expandido' no DOM global ou dentro de #secao-classes
    const expandido = document.querySelector('#secao-classes .expandido') || document.querySelector('.expandido');
    if (expandido) {
        expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
    } else {
        console.error("Elemento '.expandido' não encontrado!");
    }
}

// --- Características ---
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if(detalhes) {
        if (detalhes.style.display === 'none' || detalhes.style.display === '') {
            detalhes.style.display = 'block';
        } else {
            detalhes.style.display = 'none';
        }
    }
}

// --- Estado Civil ---
function abrirJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    const textoCasada = document.querySelector(".texto-clicavel-isaac");
    if (janela && textoCasada) {
        const rect = textoCasada.getBoundingClientRect();
        const offsetX = window.pageXOffset || document.documentElement.scrollLeft;
        const offsetY = window.pageYOffset || document.documentElement.scrollTop;
        janela.style.left = `${rect.right + offsetX + 10}px`;
        janela.style.top = `${rect.top + offsetY}px`;
        janela.style.display = "block";
    }
}
function fecharJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    if(janela) janela.style.display = "none";
}

// --- Player de Música Isaac ---
function togglePlayerMusicaIsaac() {
    const player = document.getElementById('playerMusicaIsaac'); // Usa getElementById que é mais rápido
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if(player && estadoCivil) { // Garante que ambos existam
        if (player.style.display === 'none' || player.style.display === '') {
            player.style.display = 'flex';
            estadoCivil.style.zIndex = '900';
            centralizarElementosPlayer(); // Chama a função interna
            // Seleciona a primeira música APENAS se o áudio não tiver fonte ou estiver pausado
            if (audio && (!audio.currentSrc || audio.paused)) {
                selecionarMusica(1);
            } else if (audio && audio.paused) {
                playPause(); // Tenta retomar se estava pausado
            }
        } else {
            player.style.display = 'none';
            estadoCivil.style.zIndex = '1000';
            // Não pausa aqui, deixa o fecharPlayer ou playPause tratar
        }
    }
}
function fecharPlayer() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if(player) player.style.display = 'none';
    if(estadoCivil) estadoCivil.style.zIndex = '1000';
    // Pausa o áudio SE ele existir e estiver tocando
    if (audio && !audio.paused) {
        audio.pause(); // O evento 'pause' atualizará o estado visual
    } else {
        // Garante que o estado visual esteja correto mesmo se não estava tocando
        musicaTocando = false;
        atualizarBotaoPlay();
    }
}
function centralizarElementosPlayer() {
    // Seletores originais, mas verificando se player existe
    const player = document.querySelector('.player-musica-isaac');
    if (player) {
        const capaMusica = player.querySelector('.capa-musica-isaac');
        if(capaMusica) capaMusica.style.margin = 'auto';
        player.style.display = 'flex';
        player.style.flexDirection = 'column';
        player.style.alignItems = 'center';
        player.style.justifyContent = 'space-between';
    }
}
function selecionarMusica(id) {
    const musicaSelecionada = listaDeMusicas.find((musica) => musica.id === id);
    // Garante que os elementos globais foram inicializados
    if (!audio || !audioSource || !playerMusica) { return; }

    if (musicaSelecionada) {
        const nomeEl = playerMusica.querySelector('.nome-musica-isaac');
        const autorEl = playerMusica.querySelector('.autor-musica-isaac');
        const capaImgEl = playerMusica.querySelector('.capa-musica-isaac img');
        const playerBgEl = playerMusica;

        if(nomeEl) nomeEl.textContent = musicaSelecionada.nome;
        if(autorEl) autorEl.textContent = musicaSelecionada.autor;
        if(capaImgEl) {
             // Usa o caminho original (links externos Cueinhah ou relativo assets/)
            capaImgEl.src = musicaSelecionada.capa;
            capaImgEl.onerror = () => { capaImgEl.src='assets/Imagens Isaac/default_capa.png'; console.error(`Erro capa: ${musicaSelecionada.capa}`); };
        }
        if(playerBgEl) playerBgEl.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)), url('${musicaSelecionada.background}')`; // Usa link externo

        audioSource.src = musicaSelecionada.link; // Usa caminho relativo assets/
        audio.load();
        // REMOVIDO PLAY AUTOMÁTICO e oncanplaythrough do original que causava problemas
        atualizarFavoritoVisual(id);
        // Não precisa chamar atualizarBotaoPlay aqui, pois play/pause/ended o farão
    }
}
function toggleLista() {
    const lista = document.getElementById('listaMusicas');
    if(lista) lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
}
function atualizarFavoritoVisual(id) {
    const botaoFavoritar = document.querySelector('.botao-favoritar-isaac');
    if (botaoFavoritar) {
        if (musicasFavoritadas[id]) { botaoFavoritar.classList.add('favoritado'); botaoFavoritar.textContent = '💖'; }
        else { botaoFavoritar.classList.remove('favoritado'); botaoFavoritar.textContent = '🤍'; }
    }
}
function favoritarMusica() {
    const nomeMusicaEl = document.querySelector('.nome-musica-isaac');
    if (nomeMusicaEl) {
        const musicaAtual = listaDeMusicas.find((musica) => musica.nome === nomeMusicaEl.textContent);
        if (musicaAtual) {
            musicasFavoritadas[musicaAtual.id] = !musicasFavoritadas[musicaAtual.id];
            if (!musicasFavoritadas[musicaAtual.id]) delete musicasFavoritadas[musicaAtual.id];
            atualizarFavoritoVisual(musicaAtual.id);
            localStorage.setItem(storageKey, JSON.stringify(musicasFavoritadas));
        }
    }
}
function retroceder10s() { if (audio && !isNaN(audio.duration)) { audio.currentTime = Math.max(0, audio.currentTime - 10); } }
function avancar10s() { if (audio && !isNaN(audio.duration)) { audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); } }
function playPause() {
    if (!audio) return;
    if (!audio.currentSrc && listaDeMusicas.length > 0) {
        selecionarMusica(listaDeMusicas[0].id);
        // Adia a tentativa de play para dar tempo de carregar
        setTimeout(() => { if(audio) audio.play().catch(e => console.warn("Play inicial bloqueado.", e)); }, 150);
        return;
    }
    if (musicaTocando) { audio.pause(); } else { audio.play().catch(e => console.warn("Play bloqueado.", e)); }
}
function atualizarBotaoPlay() { const b = document.querySelector('.botao-controle-isaac:nth-child(2)'); if(b) b.textContent = musicaTocando ? 'II' : '►'; }

// --- Fama/Moral ---
function atualizarBarra(idBarra, idTexto, porcentagem, idStatus = null) {
    const barra = document.getElementById(idBarra); const texto = document.getElementById(idTexto);
    if (barra && texto) {
        barra.style.width = `${porcentagem}%`; texto.textContent = `${porcentagem}%`; let cor;
        if (porcentagem <= 20) cor = 'darkred'; else if (porcentagem <= 40) cor = '#FF9100';
        else if (porcentagem <= 60) cor = '#00D19A'; else if (porcentagem <= 80) cor = '#D622EF'; else cor = '#6222EF';
        barra.style.backgroundColor = cor;
        if (idStatus) {
            const statusEl = document.getElementById(idStatus);
            if (statusEl) { let textoStatus;
                if (porcentagem <= 20) textoStatus = 'Infame - Condenado - Vilão - Corrupto';
                else if (porcentagem <= 40) textoStatus = 'Desprezado - Mal-Visto - Suspeito - Anti-Herói';
                else if (porcentagem <= 60) textoStatus = 'Ambíguo - Neutro - Indiferente - Equilibrado';
                else if (porcentagem <= 80) textoStatus = 'Respeitado - Admirado - Herói - Protetor'; else textoStatus = 'Renomado - Lendário - Venerado - Salvador';
                statusEl.textContent = textoStatus;
            }
        }
    }
}

// --- Títulos ---
function iniciarCarrossel() { const c = document.querySelector('.carrossel-imagens'); if (!c) return; clearInterval(carrosselInterval); carrosselInterval = setInterval(() => { if(!c){clearInterval(carrosselInterval);return;} c.scrollLeft += 1; if (c.scrollLeft >= c.scrollWidth - c.offsetWidth) { c.scrollLeft = 0; } }, 30); }
function pausarCarrossel() { clearInterval(carrosselInterval); }
function abrirJanelaTitulo(id) { pausarCarrossel(); const j = document.getElementById(`janelaTitulo${id}`); if(j) j.style.display = 'block'; }
function fecharJanelaTitulo(id) { const j = document.getElementById(`janelaTitulo${id}`); if(j) j.style.display = 'none'; iniciarCarrossel(); }
function expandirJanelaTitulo(id) { const j = document.getElementById(`janelaTitulo${id}`); if(j) j.classList.toggle('janela-expandida'); }

// --- Atributos ---
function toggleCheckbox(element) { element.classList.toggle("checked"); }
function atualizarAtributoAtual(atributo, total, porcentagem) { const vA=Math.floor((porcentagem/100)*total); const tE=document.getElementById(`texto-${atributo}`); const bE=document.getElementById(`barra-${atributo}`); if(tE)tE.innerText=`${vA} / ${total}`; if(bE)bE.style.width=`${porcentagem}%`; }

// --- Selos ---
function navegar(direcao) {
    // Lógica original para aceitar índice ou direção
    if (typeof direcao === 'number' && direcao >= 0 && direcao < chaves.length) { chaveAtual = direcao; }
    else if (typeof direcao === 'number') { chaveAtual = (chaveAtual + direcao + chaves.length) % chaves.length; }
    else { return; }
    const chave = chaves[chaveAtual]; if (!chave) return;
    const tI=document.getElementById("titulo-item");const dD=document.querySelector("#retangulo-item .descricao-detalhada");const iI=document.querySelector("#retangulo-item .item-imagem img");const tE=document.querySelector("#retangulo-efeitos .titulo-efeito");const iE=document.querySelector("#retangulo-efeitos img");const dE=document.querySelector("#retangulo-efeitos .detalhes-detalhados");
    if(tI)tI.textContent=chave.nome; if(dD)dD.textContent=chave.descricao;
    if(iI){iI.src=chave.item;iI.onerror=()=>{iI.src='assets/Recursos/default_key.png';}} // Usa link Cueinhah ou relativo assets/
    if(tE)tE.textContent=chave.efeito;
    if(iE){iE.src=chave.icone;iE.onerror=()=>{iE.src='assets/Recursos/default_icon.png';}} // Usa link Imgur, Cueinhah ou relativo assets/
    if(dE)dE.textContent=chave.detalhes;
    atualizarDestaqueCirculo(chaveAtual + 1);
}
function atualizarDestaqueCirculo(id) { document.querySelectorAll(".circulo-pequeno").forEach((c,i)=>{c.style.boxShadow=(i+1===id)?"0 0 10px 3px #FFD700":"none";}); }
function toggleCirculo1(){toggleEstado('circulo1');} function toggleCirculo2(){toggleEstado('circulo2');} function toggleCirculo3(){toggleEstado('circulo3');} function toggleCirculo4(){toggleEstado('circulo4');} function toggleCirculo5(){toggleEstado('circulo5');} function toggleCirculo6(){toggleEstado('circulo6');} function toggleCirculo7(){toggleEstado('circulo7');} function toggleCirculo8(){toggleEstado('circulo8');}
function toggleEstado(id){const c=document.getElementById(id);if(c)c.classList.toggle('ativo');}
function ativarChave() { const c=chaves[chaveAtual];if(c)alert(`Ativando: ${c.nome}`);} // Placeholder original

// --- Bençãos/Maldições ---
function moverCarrossel(d){const c=document.querySelector('.carrossel-diamantes');if(!c)return;const i=c.querySelectorAll('.diamante-item');if(i.length===0)return;i.forEach(item=>item.classList.remove('ativo'));posicaoCarrossel=(posicaoCarrossel+d+i.length)%i.length;if(i[posicaoCarrossel]){i[posicaoCarrossel].classList.add('ativo');const t=i[posicaoCarrossel].offsetWidth+10;const sT=(posicaoCarrossel*t)-(c.offsetWidth/2)+(t/2);c.scrollTo({left:sT,behavior:'smooth'});}}

// --- Barra EA ---
function atualizarEA(p){const b=document.getElementById('preenchimento-ea');const t=document.getElementById('texto-ea');if(b&&t){p=Math.max(0,Math.min(100,p));b.style.width=`${p}%`;t.textContent=`EA: ${p}%`;}}

// --- Filhos ---
function abrirJanelaFilho(id){abrirJanela(`janelaFilho${id}`);}
function fecharJanelaFilho(id){fecharJanela(`janelaFilho${id}`);}
function expandirJanelaFilho(id){expandirJanela(`janelaFilho${id}`);}

// --- Necessidades ---
function atualizarStatusBasicas(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='darkred';st='Crítico';}else if(p<=30){c='red';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='green';st='Bom';}else if(p<=100){c='#00B59B';st='Excelente';}else{c='#6222EF';st='Insano';}f.style.backgroundColor=c;s.textContent=st;}}
function atualizarStatusTemporarias(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='#00B59B';st='Muito Baixo';}else if(p<=30){c='green';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='red';st='Alto';}else{c='darkred';st='Crítico';}f.style.backgroundColor=c;s.textContent=st;}}

// --- Aether ---
function atualizarAether(p){if(p>102)p=102;if(p<0)p=0;const pa=document.getElementById("preenchimentoAether");const ta=document.getElementById("textoAether");if(pa)pa.style.width=`${(p/102)*100}%`;if(ta)ta.textContent=`Aether: ${p}%`;}

// --- Drag and Drop ---
function addDragEventsToWindow(j){let iD=false,dX,dY,iL,iT;const dH=j.querySelector('.janela-cabecalho-arrastavel')||j.querySelector('.janela-botoes')||j;if(!dH)return;dH.addEventListener('mousedown',(e)=>{if(e.target.closest('button,input,a,.no-drag'))return;iD=true;dX=e.clientX;dY=e.clientY;iL=j.offsetLeft;iT=j.offsetTop;j.style.cursor='grabbing';j.style.userSelect='none';});document.addEventListener('mousemove',(e)=>{if(iD){e.preventDefault();const dX_=e.clientX-dX;const dY_=e.clientY-dY;j.style.left=`${iL+dX_}px`;j.style.top=`${iT+dY_}px`;}});document.addEventListener('mouseup',()=>{if(iD){iD=false;j.style.cursor='move';j.style.userSelect='';}});dH.style.cursor='move';j.classList.add('janela-arrastavel');}


// =========================================================================
// CÓDIGO EXECUTADO QUANDO O DOM ESTÁ PRONTO (DOMContentLoaded)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // Inicializa variáveis globais do Player Isaac
    playerMusica = document.querySelector('.player-musica-isaac');
    if (playerMusica) {
        audio = playerMusica.querySelector('#audio-player');
        if (audio) { audioSource = audio.querySelector('source'); }
        progressBar = playerMusica.querySelector('#progress-bar');
        tempoAtual = playerMusica.querySelector('#tempo-atual');
        tempoTotal = playerMusica.querySelector('#tempo-total');

        // Adiciona listeners internos do player
        if (progressBar && audio) { progressBar.addEventListener('input',()=>{if(audio&&!isNaN(audio.duration)&&isFinite(audio.duration)&&audio.duration>0){audio.currentTime=(progressBar.value/100)*audio.duration;}}); }
        if (audio) {
            audio.addEventListener('timeupdate',()=>{if(tempoAtual&&!isNaN(audio.currentTime))tempoAtual.textContent=formatarTempo(audio.currentTime);if(progressBar&&audio.duration&&!isNaN(audio.duration)&&audio.duration>0)progressBar.value=(audio.currentTime/audio.duration)*100;});
            audio.addEventListener('loadedmetadata',()=>{if(tempoTotal&&!isNaN(audio.duration)&&audio.duration>0)tempoTotal.textContent=formatarTempo(audio.duration);else if(tempoTotal)tempoTotal.textContent="0:00";});
            audio.addEventListener('ended',()=>{musicaTocando=false;atualizarBotaoPlay();});
            audio.addEventListener('play',()=>{musicaTocando=true;atualizarBotaoPlay();});
            audio.addEventListener('pause',()=>{musicaTocando=false;atualizarBotaoPlay();});
        }
        // Listeners dos botões Favoritar e Lista (adicionados aqui conforme original)
        const favButton = playerMusica.querySelector(".botao-favoritar-isaac");
        const listButton = playerMusica.querySelector(".botao-lista-musicas");
        if(favButton) favButton.addEventListener("click", favoritarMusica);
        if(listButton) listButton.addEventListener("click", toggleLista);

        // Carrega a lista de músicas e atualiza estado inicial
        if (document.getElementById('listaMusicas')) {
            atualizarListaMusicas();
            // selecionarMusica(1); // Originalmente chamava aqui, mas pode causar play automático indesejado
            document.getElementById('listaMusicas').style.display = 'none';
            atualizarBotaoPlay();
        }
    }

    // Atualiza Barras Status
    atualizarBarra('barra-autoestima', 'texto-autoestima', 98);
    atualizarBarra('barra-fama', 'texto-fama', 97, 'status-fama');

    // Configura Carrossel Títulos
    const carrosselContainer = document.querySelector('.carrossel-titulos'); // Nome da variável original
    if(carrosselContainer){ // Verifica se o container existe
        const carrossel = carrosselContainer.querySelector('.carrossel-imagens'); // Nome da variável original
        if(carrossel) {
             // Atribui as funções locais às globais para referência externa
             pausarCarrosselFunc = pausarCarrossel;
             iniciarCarrosselFunc = iniciarCarrossel;
             iniciarCarrossel(); // Inicia o carrossel
             carrosselContainer.addEventListener('mouseover', pausarCarrossel);
             carrosselContainer.addEventListener('mouseout', iniciarCarrossel);
             // Listener de clique nos itens removido daqui, pois está no onclick do HTML
        }
    }
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow);

    // Atualiza Atributos
    for (let atributoKey in atributos) {
        if (Object.hasOwnProperty.call(atributos, atributoKey)) {
            atualizarAtributoAtual(atributoKey, atributos[atributoKey].total, atributos[atributoKey].porcentagem);
        }
    }

    // Inicializa Selos
    for (const [id, ativo] of Object.entries(estadosIniciais)) {
        const circulo = document.getElementById(id);
        if (circulo) { if (ativo) circulo.classList.add('ativo'); else circulo.classList.remove('ativo'); }
    }
    document.querySelectorAll(".titulo-item, .titulo-efeito, .descricao-detalhada, .detalhes-detalhados").forEach(elemento => {
        if(elemento) elemento.contentEditable = "false";
    });
    if(document.getElementById("titulo-item")) { navegar(0); } // Inicializa o display dos selos

    // Inicializa Carrossel Bênçãos
    const diamantes = document.querySelectorAll('.diamante-item');
    if (diamantes.length > 0) {
        posicaoCarrossel = Math.floor(diamantes.length / 2);
        if(diamantes[posicaoCarrossel]) diamantes[posicaoCarrossel].classList.add('ativo');
        moverCarrossel(0); // Ajusta scroll inicial
    }
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);

    // Atualiza Barra EA
    atualizarEA(86);

    // Atualiza Necessidades
    atualizarStatusBasicas('grupo-higiene', 97); atualizarStatusBasicas('grupo-banheiro', 100); atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 100); atualizarStatusBasicas('grupo-sede', 100); atualizarStatusBasicas('grupo-diversao', 101);
    atualizarStatusBasicas('grupo-social', 78); atualizarStatusBasicas('grupo-foco', 64);
    atualizarStatusBasicas('grupo-felicidade', 101); atualizarStatusBasicas('grupo-tesao', 101);
    atualizarStatusBasicas('grupo-desgaste', 0);
    atualizarStatusTemporarias('grupo-enjoo', 0); atualizarStatusTemporarias('grupo-fadiga', 0); atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0); atualizarStatusTemporarias('grupo-medo', 0);
    atualizarStatusTemporarias('grupo-tedio', 0); atualizarStatusTemporarias('grupo-raiva', 0);

    // Atualiza Aether
    atualizarAether(porcentagemAether);

    // Adiciona Drag às Janelas Restantes
    document.querySelectorAll('.janela-filhos, #janelaEstadoCivil').forEach(addDragEventsToWindow);

    // --- Carrega as seções dinâmicas ---
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function(){const p=document.querySelector("#secao-aura #janelaMusica iframe");if(p)p.src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";});
    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html");
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function(){setTimeout(()=>{var p=document.querySelector('#secao-bahdinheiro #expBar');if(p){var pct=75;p.style.width=pct+'%';const c=p.closest('.barra-exp-container');if(c){const t=c.querySelector('.barra-texto');if(t)t.textContent='1590 - '+pct+'%';}}},500);});
    loadSection("secao-classes", "Seções/5-Classes.html");
    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function(){
        function aBL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa #${iB}`);var ts=document.querySelector(`#secao-modoempusa #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}
        function aFL(){const s=document.querySelector("#secao-modoempusa #sangue-texto");const v=document.querySelector("#secao-modoempusa #vitalidade-texto");if(s&&v){var sg=parseInt(s.textContent)||0;var vt=parseInt(v.textContent)||0;var ft=Math.min(sg+vt,100);aBL("fomeBar","fome-texto",ft);}}
        function tML(st){var m=st.parentElement.nextElementSibling;if(m&&m.classList.contains('empusa-menu')){document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(i=>{if(i!==m)i.style.display='none';});m.style.display=(m.style.display==='block')?'none':'block';}}
        function aDL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa #coracao-${i}`);if(c)c.textContent=(i<=nD)?"💜":"🤍";}}
        function aSL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}
        setTimeout(()=>{aBL("prazerBar","prazer-texto",99);aBL("amorBar","amor-texto",100);aBL("sangueBar","sangue-texto",47);aBL("vitalidadeBar","vitalidade-texto",100);aFL();aDL(1);aSL("satisfacao-container","satisfacao",5);document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(s=>{s.addEventListener('click',function(){tML(this);});});},500);
    });
    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function(){
        function aBAL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa-alvo #${iB}`);var ts=document.querySelector(`#secao-modoempusa-alvo #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}
        function aDAL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa-alvo #coracao-alvo-${i}`);if(c)c.textContent=i<=nD?"💜":"🤍";}}
        function aSAL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa-alvo #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa-alvo #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}
        function aDoL(p){p=Math.max(0,Math.min(p,100));let pre=document.querySelector("#secao-modoempusa-alvo #dominanciaBar");let emo=document.querySelector("#secao-modoempusa-alvo #dominancia-emoji");if(pre&&emo){pre.style.background=`linear-gradient(to right,#ff12a9 0%,#ff12a9 ${Math.max(0,p-5)}%,#a020f0 ${p}%,#1e90ff ${Math.min(100,p+5)}%,#1e90ff 100%)`;emo.style.left=`calc(${p}% - 15px)`;}}
        setTimeout(()=>{aBAL("prazerBarAlvo","prazer-texto-alvo",98);aBAL("amorBarAlvo","amor-texto-alvo",100);aBAL("volumeBarAlvo","volume-texto-alvo",5);aBAL("vitalidadeBarAlvo","vitalide-texto-alvo",21);aDAL(3);aSAL("satisfacao-container-alvo","satisfacao-alvo",5);aDoL(73);},500);
    });

    console.log("Script.js: DOMContentLoaded concluído.");
}); // FIM DO DOMContentLoaded

// As definições duplicadas de loadSection do final do seu script original foram REMOVIDAS.

console.log("Script.js totalmente carregado (Baseado 100% no original + Estrutura + Caminhos relativos 'rep/').");
