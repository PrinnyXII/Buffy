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
let carrosselIntervalGlob;
let chaveAtualSelos = 0;
let posicaoCarrosselBencaos = 0;

// =========================================================================
// DEFINIÇÕES DE FUNÇÕES GLOBAIS (para onclick no HTML)
// =========================================================================

// --- BUFFY MÚSICA (SECAO-AURA) ---
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    if (janela) {
        janela.style.display = (janela.style.display === 'none' || janela.style.display === '') ? 'block' : 'none';
    }
}

// --- CARACTERÍSTICAS (PROFISSÃO, ESTADO CIVIL) ---
function abrirJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    const textoCasada = document.querySelector(".texto-clicavel-isaac");
    if (janela && textoCasada) {
        const rect = textoCasada.getBoundingClientRect();
        janela.style.left = `${rect.right + window.scrollX + 10}px`;
        janela.style.top = `${rect.top + window.scrollY}px`;
        janela.style.display = "block";
    }
}

function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if (detalhes) {
        detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none';
    }
}

function fecharJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    if (janela) janela.style.display = "none";
}

// --- PLAYER DE MÚSICA ISAAC ---
// !! IMPORTANTE !! Mova as imagens para seu projeto e use caminhos relativos!
const listaDeMusicasIsaac = [
    { id: 1, nome: "Crying Alone / Nowhere", autor: "Kurae Radiânthia Pendragon Isaac",
      capa: "assets/Imagens Isaac/sac2.jpg", // <<< SUBSTITUA PELO CAMINHO CORRETO NO SEU PROJETO
      background: "assets/Imagens Isaac/sac1.jpg", // <<< SUBSTITUA PELO CAMINHO CORRETO NO SEU PROJETO
      link: "assets/CryingAlone-Nowhere.mp3" } // Verifique se este MP3 está no seu projeto
];
const storageKeyIsaac = 'musicasFavoritadasIsaac';
let musicasFavoritadasIsaac = JSON.parse(localStorage.getItem(storageKeyIsaac)) || {};

function togglePlayerMusicaIsaac() {
    // Elementos são inicializados no DOMContentLoaded
    const player = playerMusicaIsaacGlob;
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    if (player) {
        if (player.style.display === 'none' || player.style.display === '') {
            player.style.display = 'flex';
            if (estadoCivil) estadoCivil.style.zIndex = '900';
            centralizarElementosPlayerIsaac();
            // Tocar a primeira música se nenhuma estiver carregada ou se o player estava fechado
            if (audioGlob && (!audioGlob.currentSrc || !musicaTocandoGlob)) {
                 selecionarMusicaIsaac(listaDeMusicasIsaac[0].id); // Carrega a primeira
                 // O play será tentado após o 'canplaythrough' em selecionarMusicaIsaac se o player estiver visível
            }
        } else {
            player.style.display = 'none';
            if (estadoCivil) estadoCivil.style.zIndex = '1000';
            // Não pausar aqui, pois fecharPlayer já faz isso e playPause também
        }
    } else {
        console.warn("Player Isaac: Elemento '.player-musica-isaac' não encontrado para toggle.");
    }
}

function fecharPlayer() { // Nome restaurado
    const player = playerMusicaIsaacGlob;
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    if (player) player.style.display = 'none';
    if (estadoCivil) estadoCivil.style.zIndex = '1000';

    if (audioGlob) {
        audioGlob.pause();
        musicaTocandoGlob = false;
        atualizarBotaoPlayIsaac();
    }
}

function centralizarElementosPlayerIsaac() {
    const player = playerMusicaIsaacGlob;
    const capaMusica = player ? player.querySelector('.capa-musica-isaac') : null;
    if (capaMusica && player) {
        // CSS é melhor para isso, mas mantendo a lógica JS por enquanto
        capaMusica.style.margin = 'auto';
        player.style.display = 'flex';
        player.style.flexDirection = 'column';
        player.style.alignItems = 'center';
        player.style.justifyContent = 'space-between';
    }
}

function selecionarMusicaIsaac(id) {
    const musicaSelecionada = listaDeMusicasIsaac.find((musica) => musica.id === id);
    if (!audioGlob || !audioSourceGlob || !playerMusicaIsaacGlob) {
        console.warn("Player Isaac: Elementos de áudio/player não inicializados.");
        return;
    }
    if (musicaSelecionada) {
        const nomeEl = playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');
        const autorEl = playerMusicaIsaacGlob.querySelector('.autor-musica-isaac');
        const capaImgEl = playerMusicaIsaacGlob.querySelector('.capa-musica-isaac img');

        if (nomeEl) nomeEl.textContent = musicaSelecionada.nome;
        if (autorEl) autorEl.textContent = musicaSelecionada.autor;
        if (capaImgEl) {
            capaImgEl.src = musicaSelecionada.capa; // Este caminho DEVE ser relativo ao seu projeto
            capaImgEl.onerror = () => console.error(`Player Isaac: Erro ao carregar capa: ${musicaSelecionada.capa}. Verifique o caminho.`);
        }
        
        playerMusicaIsaacGlob.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;
        // Adicionar onerror para a imagem de background seria mais complexo, melhor garantir o caminho.
        
        audioSourceGlob.src = musicaSelecionada.link;
        audioGlob.load();
        audioGlob.oncanplaythrough = () => {
            if (playerMusicaIsaacGlob.style.display === 'flex' && musicaTocandoGlob) { // Só toca se o player estiver visível E o estado for 'tocando'
                 audioGlob.play().catch(error => console.warn("Player Isaac: Reprodução automática bloqueada (oncanplaythrough).", error));
            }
        };
        atualizarFavoritoVisualIsaac(id);
        atualizarBotaoPlayIsaac(); // Atualiza o botão caso a música tenha mudado
    }
}

function toggleLista() { // Nome restaurado
    const lista = document.getElementById('listaMusicas'); // Este ID é do seu HTML
    if (lista) {
        lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
    }
}

function atualizarFavoritoVisualIsaac(id) {
    const botaoFavoritar = playerMusicaIsaacGlob ? playerMusicaIsaacGlob.querySelector('.botao-favoritar-isaac') : null;
    if (botaoFavoritar) {
        if (musicasFavoritadasIsaac[id]) {
            botaoFavoritar.classList.add('favoritado');
            botaoFavoritar.textContent = '💖';
        } else {
            botaoFavoritar.classList.remove('favoritado');
            botaoFavoritar.textContent = '🤍';
        }
    }
}

function favoritarMusica() { // Nome restaurado
    if (!playerMusicaIsaacGlob) return;
    const nomeMusicaAtualEl = playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');
    if (nomeMusicaAtualEl && nomeMusicaAtualEl.textContent) {
        const musicaAtual = listaDeMusicasIsaac.find((musica) => musica.nome === nomeMusicaAtualEl.textContent);
        if (musicaAtual) {
            musicasFavoritadasIsaac[musicaAtual.id] = !musicasFavoritadasIsaac[musicaAtual.id];
            if (!musicasFavoritadasIsaac[musicaAtual.id]) delete musicasFavoritadasIsaac[musicaAtual.id];
            atualizarFavoritoVisualIsaac(musicaAtual.id);
            localStorage.setItem(storageKeyIsaac, JSON.stringify(musicasFavoritadasIsaac));
        }
    }
}

function retroceder10s() { // Nome restaurado
    if (audioGlob && !isNaN(audioGlob.duration)) {
        audioGlob.currentTime = Math.max(0, audioGlob.currentTime - 10);
    }
}

function avancar10s() { // Nome restaurado
    if (audioGlob && !isNaN(audioGlob.duration)) {
        audioGlob.currentTime = Math.min(audioGlob.duration, audioGlob.currentTime + 10);
    }
}

function playPause() { // Nome restaurado
    if (!audioGlob) {
        console.warn("Player Isaac: Elemento de áudio não encontrado para play/pause.");
        return;
    }
    // Se não há música carregada, carrega e tenta tocar a primeira
    if (!audioGlob.currentSrc && listaDeMusicasIsaac.length > 0) {
        musicaTocandoGlob = true; // Define intenção de tocar
        selecionarMusicaIsaac(listaDeMusicasIsaac[0].id);
        // selecionarMusicaIsaac tem oncanplaythrough que tentará tocar se musicaTocandoGlob for true
        return;
    }

    if (musicaTocandoGlob) {
        audioGlob.pause();
    } else {
        audioGlob.play().catch(error => {
            console.warn("Player Isaac: Reprodução bloqueada pelo navegador.", error);
            musicaTocandoGlob = false; // Falhou em tocar, então não está tocando
            atualizarBotaoPlayIsaac();
        });
    }
    // O estado de musicaTocandoGlob será atualizado pelos eventos 'play' e 'pause' do audioGlob
    // Mas podemos setar a intenção aqui e o evento confirma
    if(!audioGlob.paused && !musicaTocandoGlob) { // Se o play foi chamado e teve sucesso (não pausado)
        musicaTocandoGlob = true;
    } else if (audioGlob.paused && musicaTocandoGlob) { // Se o pause foi chamado e teve sucesso
        musicaTocandoGlob = false;
    }
    atualizarBotaoPlayIsaac();
}

function atualizarBotaoPlayIsaac() {
    const botaoPlay = playerMusicaIsaacGlob ? playerMusicaIsaacGlob.querySelector('.controles-isaac .botao-controle-isaac:nth-child(2)') : null;
    if (botaoPlay) {
        botaoPlay.textContent = musicaTocandoGlob ? 'II' : '►';
    }
}

function formatarTempo(segundos) {
    if (isNaN(segundos) || !isFinite(segundos) || segundos < 0) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = Math.floor(segundos % 60);
    return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
}

function atualizarListaMusicasIsaac() {
    const listaContainer = document.getElementById('listaMusicas');
    if (listaContainer) {
        listaContainer.innerHTML = '';
        listaDeMusicasIsaac.forEach((musica) => {
            const item = document.createElement('p');
            item.textContent = musica.nome;
            item.addEventListener('click', () => {
                musicaTocandoGlob = true; // Intenção de tocar
                selecionarMusicaIsaac(musica.id);
                // o oncanplaythrough em selecionarMusicaIsaac tentará tocar
            });
            listaContainer.appendChild(item);
        });
    }
}

// --- TÍTULOS (CARROSSEL) ---
function abrirJanelaTitulo(id) {
    // Pausar carrossel já é feito no DOMContentLoaded ao adicionar o listener
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.style.display = 'block';
}

function fecharJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) {
        janela.style.display = 'none';
        // Reiniciar carrossel já é feito no DOMContentLoaded ao adicionar o listener
        const carrosselContainerTitulosEl = document.querySelector('.carrossel-titulos');
        if (carrosselContainerTitulosEl && carrosselIntervalGlob === undefined) { // Só reinicia se não estiver rodando
            // A lógica de iniciar/pausar carrossel está no DOMContentLoaded
        }
    }
}

function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.classList.toggle('janela-expandida');
}

// --- ATRIBUTOS ---
function toggleCheckbox(element) { // Nome restaurado
    element.classList.toggle("checked");
}

// --- SELOS ---
const selosChavesData = [ /* Seus dados de chaves aqui, COM CAMINHOS RELATIVOS PARA IMAGENS */
    { id: 0, nome: "Key of Souls", descricao: "...", item: "assets/Recursos/Key of Souls.png", efeito: "...", icone: "https://imgur.com/zHQo8sh.png", detalhes: "..."},
    { id: 5, nome: "Key of Pendragon", descricao: "...", item: "assets/Recursos/Key of Pendragon.png", efeito: "...", icone: "assets/Recursos/Key of Pendragon.png", detalhes: "..."},
    { id: 7, nome: "Key of Isaac's Heart", descricao: "...", item: "assets/Recursos/Key of Isaac's Heart.png", efeito: "...", icone: "assets/Recursos/Key of Isaac's Heart.png", detalhes: "..."},
    // ... (restante dos dados das chaves)
];
const selosEstadosIniciais = { circulo1: true, circulo2: false, circulo3: true, circulo4: false, circulo5: true, circulo6: false, circulo7: true, circulo8: false };

function navegar(direcao) { // Nome restaurado
    chaveAtualSelos = (chaveAtualSelos + direcao + selosChavesData.length) % selosChavesData.length;
    const chave = selosChavesData[chaveAtualSelos];
    if (!chave) return;

    const tituloItemEl = document.getElementById("titulo-item");
    const descDetalhadaEl = document.querySelector("#retangulo-item .descricao-detalhada");
    const itemImagemEl = document.querySelector("#retangulo-item .item-imagem img"); // Mais específico
    const tituloEfeitoEl = document.querySelector("#retangulo-efeitos .titulo-efeito");
    const iconeEfeitoEl = document.querySelector("#retangulo-efeitos img"); // Imagem dentro de #retangulo-efeitos
    const detalhesEfeitoEl = document.querySelector("#retangulo-efeitos .detalhes-detalhados");

    if (tituloItemEl) tituloItemEl.textContent = chave.nome;
    if (descDetalhadaEl) descDetalhadaEl.textContent = chave.descricao;
    if (itemImagemEl) {
        itemImagemEl.src = chave.item; // CAMINHO DEVE SER RELATIVO
        itemImagemEl.onerror = () => console.error(`Selos: Erro ao carregar item: ${chave.item}`);
    }
    if (tituloEfeitoEl) tituloEfeitoEl.textContent = chave.efeito;
    if (iconeEfeitoEl) {
        iconeEfeitoEl.src = chave.icone; // CAMINHO DEVE SER RELATIVO se for local
        iconeEfeitoEl.onerror = () => console.error(`Selos: Erro ao carregar ícone: ${chave.icone}`);
    }
    if (detalhesEfeitoEl) detalhesEfeitoEl.textContent = chave.detalhes;
    
    atualizarDestaqueCirculoSelos(chaveAtualSelos); // ID é o índice do array (0-7)
}

function atualizarDestaqueCirculoSelos(indiceAtivo) {
    document.querySelectorAll(".circulo-pequeno").forEach((circulo, index) => {
        // O onclick de navegar passa o índice diretamente (0 para o primeiro, 1 para o segundo, etc)
        // mas a função navegar internamente usa chaveAtualSelos que é o índice
        if (index === indiceAtivo) { // Compara o índice do loop com o índice ativo
            circulo.style.boxShadow = "0 0 10px 3px #FFD700";
        } else {
            circulo.style.boxShadow = "none";
        }
    });
}

// onclick="navegar(0)" no HTML para o primeiro círculo, navegar(1) para o segundo, etc.
// A função `toggleCirculoX` é chamada separadamente no onclick, o que é um pouco redundante.
// O ideal seria que `navegar(indice)` também chamasse `toggleCirculoX` ou que `toggleCirculoX` chamasse `navegar(indice)`.
// Por enquanto, mantendo as duas chamadas no HTML como você tem.

function toggleCirculo1() { document.getElementById('circulo1')?.classList.toggle('ativo'); }
function toggleCirculo2() { document.getElementById('circulo2')?.classList.toggle('ativo'); }
function toggleCirculo3() { document.getElementById('circulo3')?.classList.toggle('ativo'); }
function toggleCirculo4() { document.getElementById('circulo4')?.classList.toggle('ativo'); }
function toggleCirculo5() { document.getElementById('circulo5')?.classList.toggle('ativo'); }
function toggleCirculo6() { document.getElementById('circulo6')?.classList.toggle('ativo'); }
function toggleCirculo7() { document.getElementById('circulo7')?.classList.toggle('ativo'); }
function toggleCirculo8() { document.getElementById('circulo8')?.classList.toggle('ativo'); }

function ativarChave() {
    // Esta função é chamada por onclick="ativarChave()"
    // Você precisa implementar a lógica do que acontece quando uma chave é "ativada"
    console.log("Função ativarChave() chamada. Implemente a lógica.");
    const chaveSelecionada = selosChavesData[chaveAtualSelos];
    if (chaveSelecionada) {
        alert(`Ativando chave: ${chaveSelecionada.nome}`);
        // Adicione sua lógica aqui
    }
}

// --- BENÇÃOS E MALDIÇÕES ---
function moverCarrossel(direcao) { // Nome restaurado
    const carrossel = document.querySelector('.carrossel-diamantes');
    if (!carrossel) return;
    const itens = carrossel.querySelectorAll('.diamante-item');
    if (itens.length === 0) return;

    itens.forEach(item => item.classList.remove('ativo'));
    posicaoCarrosselBencaos = (posicaoCarrosselBencaos + direcao + itens.length) % itens.length;
    
    if (itens[posicaoCarrosselBencaos]) {
        itens[posicaoCarrosselBencaos].classList.add('ativo');
        const tamanhoItem = itens[posicaoCarrosselBencaos].offsetWidth + 10;
        const scrollTarget = (posicaoCarrosselBencaos * tamanhoItem) - (carrossel.offsetWidth / 2) + (tamanhoItem / 2);
        carrossel.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
}

function abrirJanela(idJanela) { // Nome restaurado e genérico
    const janela = document.getElementById(idJanela);
    if (janela) janela.style.display = 'block';
}

function fecharJanela(idJanela) { // Nome restaurado e genérico
    const janela = document.getElementById(idJanela);
    if (janela) janela.style.display = 'none';
}

function expandirJanela(idJanela) { // Nome consistente
    const janela = document.getElementById(idJanela);
    if (janela) janela.classList.toggle('janela-expandida');
}

// --- FILHOS (JANELAS FLUTUANTES) ---
// abrirJanela, fecharJanela, expandirJanela já são globais e podem ser usadas
// Se precisar de lógica específica para filhos, crie novas funções como abrirJanelaFilho etc.

// --- FUNÇÃO UTILITÁRIA PARA ARRASTAR JANELAS ---
function addDragEventsToWindow(janela) {
    let isDragging = false, dragStartX, dragStartY, initialLeft, initialTop;
    const dragHandle = janela.querySelector('.janela-cabecalho-arrastavel') || janela.querySelector('.janela-botoes') || janela;

    dragHandle.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, a, .no-drag')) return;
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialLeft = janela.offsetLeft;
        initialTop = janela.offsetTop;
        janela.style.cursor = 'grabbing';
        // Traz a janela para frente (opcional, pode causar problemas com z-index de outros elementos)
        // document.querySelectorAll('.janela-arrastavel').forEach(j => j.style.zIndex = parseInt(window.getComputedStyle(j).zIndex) -1 || 1000);
        // janela.style.zIndex = (parseInt(window.getComputedStyle(janela).zIndex) || 1000) + 10;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            janela.style.left = `${initialLeft + deltaX}px`;
            janela.style.top = `${initialTop + deltaY}px`;
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            janela.style.cursor = 'move';
        }
    });
    dragHandle.style.cursor = 'move';
    janela.classList.add('janela-arrastavel'); // Para referência, se necessário
}


// =========================================================================
// CÓDIGO QUE RODA APÓS O DOM ESTAR COMPLETAMENTE CARREGADO
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- INICIALIZAÇÃO PLAYER DE MÚSICA ISAAC ---
    playerMusicaIsaacGlob = document.querySelector('.player-musica-isaac'); // Seu HTML tem esse ID/classe
    if (playerMusicaIsaacGlob) {
        audioGlob = playerMusicaIsaacGlob.querySelector('#audio-player'); // Busca dentro do player
        if (audioGlob) {
            audioSourceGlob = audioGlob.querySelector('source');
        }
        progressBarGlob = playerMusicaIsaacGlob.querySelector('#progress-bar');
        tempoAtualGlob = playerMusicaIsaacGlob.querySelector('#tempo-atual');
        tempoTotalGlob = playerMusicaIsaacGlob.querySelector('#tempo-total');
    } else {
        console.warn("Container do Player de Música Isaac ('.player-musica-isaac') não encontrado no DOM inicial.");
    }


    // Listeners para o player Isaac
    if (progressBarGlob && audioGlob) {
        progressBarGlob.addEventListener('input', () => {
            if (audioGlob && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration)) {
                audioGlob.currentTime = (progressBarGlob.value / 100) * audioGlob.duration;
            }
        });
    }
    if (audioGlob) {
        audioGlob.addEventListener('timeupdate', () => {
            if (tempoAtualGlob && !isNaN(audioGlob.currentTime)) tempoAtualGlob.textContent = formatarTempo(audioGlob.currentTime);
            if (progressBarGlob && audioGlob.duration && !isNaN(audioGlob.duration)) progressBarGlob.value = (audioGlob.currentTime / audioGlob.duration) * 100;
        });
        audioGlob.addEventListener('loadedmetadata', () => {
            if (tempoTotalGlob && !isNaN(audioGlob.duration)) tempoTotalGlob.textContent = formatarTempo(audioGlob.duration);
        });
        audioGlob.addEventListener('ended', () => { musicaTocandoGlob = false; atualizarBotaoPlayIsaac(); });
        audioGlob.addEventListener('play', () => { musicaTocandoGlob = true; atualizarBotaoPlayIsaac(); });
        audioGlob.addEventListener('pause', () => { musicaTocandoGlob = false; atualizarBotaoPlayIsaac(); });
    }

    if (document.getElementById('listaMusicas')) {
        atualizarListaMusicasIsaac();
        document.getElementById('listaMusicas').style.display = 'none';
        if (playerMusicaIsaacGlob) atualizarBotaoPlayIsaac();
    }


    // --- FAMA/MORAL E AUTOESTIMA ---
    function atualizarBarraStatus(idBarra, idTexto, porcentagem, idStatus = null) {
        const barra = document.getElementById(idBarra);
        const texto = document.getElementById(idTexto);
        if (!barra || !texto) { /* console.warn(`Barra/Texto não encontrado para ${idBarra}`); */ return; }
        barra.style.width = `${porcentagem}%`; texto.textContent = `${porcentagem}%`;
        let cor; if (porcentagem <= 20) cor = 'darkred'; else if (porcentagem <= 40) cor = '#FF9100';
        else if (porcentagem <= 60) cor = '#00D19A'; else if (porcentagem <= 80) cor = '#D622EF'; else cor = '#6222EF';
        barra.style.backgroundColor = cor;
        if (idStatus) {
            const statusEl = document.getElementById(idStatus);
            if (statusEl) {
                let textoStatus; if (porcentagem <= 20) textoStatus = 'Infame - Condenado - Vilão - Corrupto';
                else if (porcentagem <= 40) textoStatus = 'Desprezado - Mal-Visto - Suspeito - Anti-Herói';
                else if (porcentagem <= 60) textoStatus = 'Ambíguo - Neutro - Indiferente - Equilibrado';
                else if (porcentagem <= 80) textoStatus = 'Respeitado - Admirado - Herói - Protetor'; else textoStatus = 'Renomado - Lendário - Venerado - Salvador';
                statusEl.textContent = textoStatus;
            }
        }
    }
    atualizarBarraStatus('barra-autoestima', 'texto-autoestima', 98);
    atualizarBarraStatus('barra-fama', 'texto-fama', 97, 'status-fama');

    // --- CARROSSEL DE TÍTULOS ---
    const carrosselTitulosEl = document.querySelector('.carrossel-titulos .carrossel-imagens');
    const carrosselContainerTitulosEl = document.querySelector('.carrossel-titulos');
    let carrosselTitulosInterval; // Declarado aqui para escopo local
    function iniciarCarrosselTitulos() {
        if (!carrosselTitulosEl) return; clearInterval(carrosselTitulosInterval);
        carrosselTitulosInterval = setInterval(() => {
            carrosselTitulosEl.scrollLeft += 1;
            if (carrosselTitulosEl.scrollLeft >= carrosselTitulosEl.scrollWidth - carrosselTitulosEl.offsetWidth -1) carrosselTitulosEl.scrollLeft = 0;
        }, 30);
    }
    function pausarCarrosselTitulos() { clearInterval(carrosselTitulosInterval); }

    if (carrosselTitulosEl && carrosselContainerTitulosEl) {
        iniciarCarrosselTitulos();
        carrosselContainerTitulosEl.addEventListener('mouseover', pausarCarrosselTitulos);
        carrosselContainerTitulosEl.addEventListener('mouseout', iniciarCarrosselTitulos);
        // Os .titulo-item já têm onclick="abrirJanelaTitulo(id)" no HTML
    }
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow);

    // --- ATRIBUTOS ---
    const atributosData = { /* ...seus dados de atributos... */
        hp: { total: 4910210, porcentagem: 100 }, mp: { total: 823691, porcentagem: 100 },
        agi: { total: 637369, porcentagem: 100 }, def: { total: 1476557, porcentagem: 100 },
        res: { total: 1331048, porcentagem: 100 }, spd: { total: 1020989, porcentagem: 100 },
        int: { total: 431815, porcentagem: 100 }, atk: { total: 2075839, porcentagem: 100 },
        smp: { total: 291363290, porcentagem: 99.17 }, unknown: { total: 100, porcentagem: 50 }
    };
    function atualizarAtributoAtual(atributo, total, porcentagem) {
        const textoEl = document.getElementById(`texto-${atributo}`);
        const barraEl = document.getElementById(`barra-${atributo}`);
        if (textoEl && barraEl) {
            const valorAtual = Math.floor((porcentagem / 100) * total);
            textoEl.innerText = `${valorAtual} / ${total}`;
            barraEl.style.width = `${porcentagem}%`;
        }
    }
    for (let atributo in atributosData) {
        atualizarAtributoAtual(atributo, atributosData[atributo].total, atributosData[atributo].porcentagem);
    }
    // onclick="toggleCheckbox(this)" já está no HTML e chama a função global.

    // --- SELOS ---
    for (const [id, ativo] of Object.entries(selosEstadosIniciais)) {
        const circulo = document.getElementById(id);
        if (circulo) { if (ativo) circulo.classList.add('ativo'); else circulo.classList.remove('ativo'); }
    }
    document.querySelectorAll("#retangulo-item .titulo-item, #retangulo-efeitos .titulo-efeito, #retangulo-item .descricao-detalhada, #retangulo-efeitos .detalhes-detalhados")
        .forEach(el => { if(el) el.contentEditable = "false"; });

    if (document.getElementById("titulo-item")) { // Se o container dos selos existe
         navegar(0); // Chama a função global `navegar` para inicializar com a primeira chave
    }
    // Os onclick="navegar(indice)" e onclick="toggleCirculoX()" já estão no HTML.

    // --- BENÇÃOS E MALDIÇÕES ---
    const diamantesCarrossel = document.querySelectorAll('.carrossel-diamantes .diamante-item');
    if (diamantesCarrossel.length > 0) {
        posicaoCarrosselBencaos = Math.floor(diamantesCarrossel.length / 2); // Define o item do meio como inicial
        if (diamantesCarrossel[posicaoCarrosselBencaos]) {
             diamantesCarrossel[posicaoCarrosselBencaos].classList.add('ativo');
        }
        moverCarrossel(0); // Ajusta o scroll para o item inicial
    }
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);
    // onclick="moverCarrossel(direcao)" e onclick="abrirJanela('id')" já estão no HTML.


    // --- BARRA EA ---
    function atualizarEA(porcentagem) {
        const barraEA = document.getElementById('preenchimento-ea');
        const textoEA = document.getElementById('texto-ea');
        if (barraEA && textoEA) {
            porcentagem = Math.max(0, Math.min(100, porcentagem));
            barraEA.style.width = `${porcentagem}%`;
            textoEA.textContent = `EA: ${porcentagem}%`;
        }
    }
    atualizarEA(86);

    // --- NECESSIDADES BÁSICAS E TEMPORÁRIAS ---
    // Funções de atualização de status (colocadas aqui para escopo, poderiam ser globais também)
    function atualizarStatusBasicas(grupoId, porcentagem) { /* ... (código da função como antes) ... */
        const fillBar = document.getElementById(`barra-progresso-${grupoId}`); const progressText = document.getElementById(`progresso-texto-${grupoId}`); const statusIndicator = document.getElementById(`estado-${grupoId}`);
        if (fillBar && progressText && statusIndicator) {
            fillBar.style.width = `${porcentagem}%`; progressText.textContent = `${porcentagem}%`; let color = '', status = '';
            if (porcentagem <= 0) { color = '#00B59B'; status = 'Nulo'; } else if (porcentagem <= 5) { color = 'darkred'; status = 'Crítico'; }
            else if (porcentagem <= 30) { color = 'red'; status = 'Baixo'; } else if (porcentagem <= 60) { color = '#FFAA00'; status = 'Moderado'; }
            else if (porcentagem <= 95) { color = 'green'; status = 'Bom'; } else if (porcentagem <= 100) { color = '#00B59B'; status = 'Excelente'; }
            else { color = '#6222EF'; status = 'Insano'; }
            fillBar.style.backgroundColor = color; statusIndicator.textContent = status;
        }
    }
    function atualizarStatusTemporarias(grupoId, porcentagem) { /* ... (código da função como antes) ... */
        const fillBar = document.getElementById(`barra-progresso-${grupoId}`); const progressText = document.getElementById(`progresso-texto-${grupoId}`); const statusIndicator = document.getElementById(`estado-${grupoId}`);
        if (fillBar && progressText && statusIndicator) {
            fillBar.style.width = `${porcentagem}%`; progressText.textContent = `${porcentagem}%`; let color = '', status = '';
            if (porcentagem <= 0) { color = '#00B59B'; status = 'Nulo'; } else if (porcentagem <= 5) { color = '#00B59B'; status = 'Muito Baixo'; }
            else if (porcentagem <= 30) { color = 'green'; status = 'Baixo'; } else if (porcentagem <= 60) { color = '#FFAA00'; status = 'Moderado'; }
            else if (porcentagem <= 95) { color = 'red'; status = 'Alto'; } else { color = 'darkred'; status = 'Crítico'; }
            fillBar.style.backgroundColor = color; statusIndicator.textContent = status;
        }
    }
    // Chamadas de atualização
    atualizarStatusBasicas('grupo-higiene', 97); atualizarStatusBasicas('grupo-banheiro', 100); atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 100); atualizarStatusBasicas('grupo-sede', 100); atualizarStatusBasicas('grupo-diversao', 101);
    atualizarStatusBasicas('grupo-social', 78); atualizarStatusBasicas('grupo-foco', 64); atualizarStatusBasicas('grupo-felicidade', 101);
    atualizarStatusBasicas('grupo-tesao', 101);
    // ID "grupo-desgaste" nas necessidades básicas não foi chamado no seu original, mas o HTML existe. Adicionando:
    atualizarStatusBasicas('grupo-desgaste', 0); // Ou o valor que desejar

    atualizarStatusTemporarias('grupo-enjoo', 0); atualizarStatusTemporarias('grupo-fadiga', 0); atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0); atualizarStatusTemporarias('grupo-medo', 0);
    // ID "grupo-tedio" e "grupo-raiva" estavam faltando nas chamadas, o HTML existe.
    atualizarStatusTemporarias('grupo-tedio', 0);
    atualizarStatusTemporarias('grupo-raiva', 0);
    // ID "grupo-desgaste" em temporárias não existe no HTML fornecido, apenas em básicas.

    // --- AETHER ---
    function atualizarAether(porcentagem) {
        const preenchimentoAether = document.getElementById("preenchimentoAether");
        const textoAether = document.getElementById("textoAether");
        if (preenchimentoAether && textoAether) {
            porcentagem = Math.max(0, Math.min(102, porcentagem));
            preenchimentoAether.style.width = `${(porcentagem / 102) * 100}%`;
            textoAether.textContent = `Aether: ${porcentagem}%`;
        }
    }
    atualizarAether(101);

    // Adicionar funcionalidade de arrastar às janelas de filhos
    document.querySelectorAll('.janela-filhos').forEach(addDragEventsToWindow); // Seu HTML usa '.janela-filhos'
    // Para a janela de estado civil:
    const janelaEstadoCivilEl = document.getElementById('janelaEstadoCivil');
    if (janelaEstadoCivilEl) addDragEventsToWindow(janelaEstadoCivilEl);


    // =========================================================================
    // CARREGAMENTO DAS SEÇÕES DINÂMICAS (HTML EXTERNO)
    // =========================================================================
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
        const playerMusicaBuffy = document.querySelector("#secao-aura #janelaMusica iframe"); // Mais específico
        if (playerMusicaBuffy) {
            playerMusicaBuffy.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
        } else {
            console.warn("Buffy Música: #janelaMusica iframe não encontrado APÓS carregar secao-aura.");
        }
        // Se o botão que chama toggleJanelaMusica() está DENTRO de secao-aura, adicione o listener aqui.
        // Senão, a função global já deve funcionar.
    });

    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");

    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html", function () {
        console.log("Seção Cabeçalho carregada!");
    });

    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
        console.log("Seção Barra de Experiência carregada!");
        setTimeout(() => {
            var progressBar = document.getElementById('expBar'); // Assume que #expBar está em 4-Barra-Dinheiro.html
            if (progressBar) {
                var percentage = 75;
                progressBar.style.width = percentage + '%';
                const containerDaBarra = progressBar.closest('.barra-exp-container'); // Verifique se esta classe existe em 4-Barra-Dinheiro.html
                if (containerDaBarra) {
                    const textSpan = containerDaBarra.querySelector('.barra-texto');
                    if (textSpan) {
                        textSpan.textContent = '1590 - ' + percentage + '%';
                    } else { console.warn("Barra Dinheiro: '.barra-texto' não encontrado no container de 'expBar'."); }
                } else { console.warn("Barra Dinheiro: Container de 'expBar' não encontrado."); }
            } else { console.warn("Barra Dinheiro: 'expBar' não encontrado após carregar seção."); }
        }, 500);
    });

    loadSection("secao-classes", "Seções/5-Classes.html", function () {
        console.log("Seção Classes carregada!");
        // Seu HTML em index.html NÃO TEM um botão para mostrarTexto() na seção de classes.
        // Se o botão está dentro de 5-Classes.html, e ele tem onclick="mostrarTexto()",
        // a função global mostrarTexto() deve funcionar.
        // No seu index, o botão com onclick="mostrarTexto()" parece estar faltando ou
        // a função mostrarTexto() original era para outra coisa.
        // A função global `mostrarTexto` agora procura por `#secao-classes .expandido`.
    });

    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function () {
        console.log("Seção Modo Empusa carregada!");
        // Funções locais para esta seção (para evitar conflitos e garantir que rodem com elementos carregados)
        function atualizarBarraModoEmpusaLocal(idBarra, idTexto, porcentagem) {
            var progressBar = document.querySelector(`#secao-modoempusa #${idBarra}`);
            var textSpan = document.querySelector(`#secao-modoempusa #${idTexto}`);
            if (progressBar && textSpan) { progressBar.style.width = porcentagem + '%'; textSpan.textContent = porcentagem + '%'; }
        }
        function atualizarFomeModoEmpusaLocal() {
            const sangueEl = document.querySelector("#secao-modoempusa #sangue-texto");
            const vitalidadeEl = document.querySelector("#secao-modoempusa #vitalidade-texto");
            if (sangueEl && vitalidadeEl) {
                var sangue = parseInt(sangueEl.textContent) || 0; var vitalidade = parseInt(vitalidadeEl.textContent) || 0;
                var fomeTotal = Math.min(sangue + vitalidade, 100);
                atualizarBarraModoEmpusaLocal("fomeBar", "fome-texto", fomeTotal);
            }
        }
        function toggleMenuModoEmpusaLocal(seta) {
            var menu = seta.parentElement.nextElementSibling;
            if (menu && menu.classList.contains('empusa-menu')) {
                document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(m => { if (m !== menu) m.style.display = 'none'; });
                menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
            }
        }
        function atualizarDorModoEmpusaLocal(nivelDor) {
            nivelDor = Math.max(0, Math.min(nivelDor, 6));
            for (let i = 1; i <= 6; i++) {
                let coracao = document.querySelector(`#secao-modoempusa #coracao-${i}`);
                if (coracao) coracao.textContent = (i <= nivelDor) ? "💜" : "🤍";
            }
        }
        function atualizarSatisfacaoModoEmpusaLocal(idContainer, idPrefixo, nivelSatisfacao) {
            nivelSatisfacao = Math.max(1, Math.min(nivelSatisfacao, 6));
            let container = document.querySelector(`#secao-modoempusa #${idContainer}`);
            if (!container) return;
            container.querySelectorAll('.emoji-satisfacao').forEach(emoji => emoji.classList.remove('emoji-selecionado'));
            let emojiSelecionado = document.querySelector(`#secao-modoempusa #${idPrefixo}-${nivelSatisfacao}`);
            if (emojiSelecionado) emojiSelecionado.classList.add('emoji-selecionado');
        }

        setTimeout(() => {
            atualizarBarraModoEmpusaLocal("prazerBar", "prazer-texto", 99);
            atualizarBarraModoEmpusaLocal("amorBar", "amor-texto", 100);
            atualizarBarraModoEmpusaLocal("sangueBar", "sangue-texto", 47);
            atualizarBarraModoEmpusaLocal("vitalidadeBar", "vitalidade-texto", 100);
            atualizarFomeModoEmpusaLocal();
            atualizarDorModoEmpusaLocal(1);
            atualizarSatisfacaoModoEmpusaLocal("satisfacao-container", "satisfacao", 5);

            document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(seta => {
                seta.addEventListener('click', function () { toggleMenuModoEmpusaLocal(this); });
            });
        }, 500);
    });

    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function () {
        console.log("Seção Modo Empusa - Alvo carregada!");
        // Funções locais para esta seção
        function atualizarBarraModoEmpusaAlvoLocal(idBarra, idTexto, porcentagem) {
             var progressBar = document.querySelector(`#secao-modoempusa-alvo #${idBarra}`);
             var textSpan = document.querySelector(`#secao-modoempusa-alvo #${idTexto}`);
             if (progressBar && textSpan) { progressBar.style.width = porcentagem + '%'; textSpan.textContent = porcentagem + '%'; }
        }
        function atualizarDorModoEmpusaAlvoLocal(nivelDor) {
            nivelDor = Math.max(0, Math.min(nivelDor, 6));
            for (let i = 1; i <= 6; i++) {
                let coracao = document.querySelector(`#secao-modoempusa-alvo #coracao-alvo-${i}`);
                if (coracao) coracao.textContent = i <= nivelDor ? "💜" : "🤍";
            }
        }
         function atualizarSatisfacaoModoEmpusaAlvoLocal(idContainer, idPrefixo, nivelSatisfacao) { // Copiado de Buffy, ajustando seletores
            nivelSatisfacao = Math.max(1, Math.min(nivelSatisfacao, 6));
            let container = document.querySelector(`#secao-modoempusa-alvo #${idContainer}`); // Seletor para Alvo
            if (!container) return;
            container.querySelectorAll('.emoji-satisfacao').forEach(emoji => emoji.classList.remove('emoji-selecionado'));
            let emojiSelecionado = document.querySelector(`#secao-modoempusa-alvo #${idPrefixo}-${nivelSatisfacao}`); // Seletor para Alvo
            if (emojiSelecionado) emojiSelecionado.classList.add('emoji-selecionado');
        }
        function atualizarDominanciaModoEmpusaAlvoLocal(porcentagem) {
            porcentagem = Math.max(0, Math.min(porcentagem, 100));
            let preenchimento = document.querySelector("#secao-modoempusa-alvo #dominanciaBar");
            let emoji = document.querySelector("#secao-modoempusa-alvo #dominancia-emoji");
            if (preenchimento && emoji) {
                preenchimento.style.background = `linear-gradient(to right, #ff12a9 0%, #ff12a9 ${Math.max(0, porcentagem - 5)}%, #a020f0 ${porcentagem}%, #1e90ff ${Math.min(100, porcentagem + 5)}%, #1e90ff 100%)`;
                emoji.style.left = `calc(${porcentagem}% - 15px)`;
            }
        }
        setTimeout(() => {
            atualizarBarraModoEmpusaAlvoLocal("prazerBarAlvo", "prazer-texto-alvo", 98);
            atualizarBarraModoEmpusaAlvoLocal("amorBarAlvo", "amor-texto-alvo", 100);
            atualizarBarraModoEmpusaAlvoLocal("volumeBarAlvo", "volume-texto-alvo", 5);
            atualizarBarraModoEmpusaAlvoLocal("vitalidadeBarAlvo", "vitalide-texto-alvo", 21);
            atualizarDorModoEmpusaAlvoLocal(3);
            atualizarSatisfacaoModoEmpusaAlvoLocal("satisfacao-container-alvo", "satisfacao-alvo", 5);
            atualizarDominanciaModoEmpusaAlvoLocal(73);
        }, 500);
    });

    console.log("Script.js: DOMContentLoaded concluído. Seções dinâmicas carregando...");
}); // FIM DO DOMContentLoaded

// Verificação final
console.log("Script.js carregado e inicializado (vFinal com base no HTML). Verifique os `onclick` e caminhos de imagem.");
