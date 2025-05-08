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
// VARIÁVEIS GLOBAIS (DECLARADAS AQUI, INICIALIZADAS NO DOMCONTENTLOADED OU QUANDO NECESSÁRIO)
// =========================================================================
let playerMusicaIsaacGlob, audioGlob, audioSourceGlob, progressBarGlob, tempoAtualGlob, tempoTotalGlob;
let musicaTocandoGlob = false;
let carrosselIntervalGlob;
let chaveAtualSelos = 0; // Movido para global para ser acessado por navegarSelos
let posicaoCarrosselBencaos = 0; // Movido para global

// =========================================================================
// DEFINIÇÕES DE FUNÇÕES GLOBAIS (para onclick no HTML)
// Muitas dessas funções precisam acessar elementos que podem ou não estar
// carregados ainda. Elas devem ser robustas ou os event listeners
// devem ser adicionados dinamicamente após o carregamento do conteúdo.
// =========================================================================

// --- BUFFY MÚSICA (SECAO-AURA) ---
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    if (janela) {
        janela.style.display = (janela.style.display === 'none' || janela.style.display === '') ? 'block' : 'none';
    }
}

// --- CLASSES ---
// Renomeado de volta para `mostrarTexto` se o HTML usa `onclick="mostrarTexto()"`
function mostrarTexto() {
    // Assumindo que o elemento .expandido está dentro de #secao-classes
    // Se esta seção é carregada dinamicamente, este listener deve ser adicionado no callback de loadSection
    const expandido = document.querySelector('#secao-classes .expandido');
    if (expandido) {
        expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
    } else {
        console.warn("Classes: Elemento '.expandido' dentro de #secao-classes não encontrado!");
    }
}

// --- CARACTERÍSTICAS (PROFISSÃO, ESTADO CIVIL) ---
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if (detalhes) {
        detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none';
    }
}

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

function fecharJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    if (janela) janela.style.display = "none";
}

// --- PLAYER DE MÚSICA ISAAC ---
// !! IMPORTANTE !! Mova as imagens para seu projeto e use caminhos relativos!
const listaDeMusicasIsaac = [
    { id: 1, nome: "Crying Alone / Nowhere", autor: "Kurae Radiânthia Pendragon Isaac",
      capa: "assets/Imagens Isaac/sac2.jpg", // Exemplo de caminho relativo
      background: "assets/Imagens Isaac/sac1.jpg", // Exemplo de caminho relativo
      link: "assets/CryingAlone-Nowhere.mp3" }
];
const storageKeyIsaac = 'musicasFavoritadasIsaac';
let musicasFavoritadasIsaac = JSON.parse(localStorage.getItem(storageKeyIsaac)) || {};

function togglePlayerMusicaIsaac() {
    // Certifique-se que playerMusicaIsaacGlob foi inicializado no DOMContentLoaded
    if (!playerMusicaIsaacGlob) playerMusicaIsaacGlob = document.querySelector('.player-musica-isaac');
    const player = playerMusicaIsaacGlob;
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    if (player) {
        if (player.style.display === 'none' || player.style.display === '') {
            player.style.display = 'flex';
            if (estadoCivil) estadoCivil.style.zIndex = '900';
            centralizarElementosPlayerIsaac();
            if (!musicaTocandoGlob) { // Só seleciona e toca se não estiver tocando
                 selecionarMusicaIsaac(listaDeMusicasIsaac[0].id); // Toca a primeira por padrão ou a última
            }
        } else {
            player.style.display = 'none';
            if (estadoCivil) estadoCivil.style.zIndex = '1000';
            if (audioGlob && musicaTocandoGlob) audioGlob.pause(); // Pausa só se estiver tocando
            // Não muda musicaTocandoGlob aqui, playPauseIsaac faz isso
        }
    } else {
        console.warn("Player Isaac: Elemento '.player-musica-isaac' não encontrado para toggle.");
    }
}

// Renomeado de volta para `fecharPlayer` se o HTML usa `onclick="fecharPlayer()"`
function fecharPlayer() {
    if (!playerMusicaIsaacGlob) playerMusicaIsaacGlob = document.querySelector('.player-musica-isaac');
    const player = playerMusicaIsaacGlob;
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    if (player) player.style.display = 'none';
    if (estadoCivil) estadoCivil.style.zIndex = '1000';

    if (audioGlob) {
        audioGlob.pause();
        musicaTocandoGlob = false; // Garante que está como pausado
        atualizarBotaoPlayIsaac();
    }
}

function centralizarElementosPlayerIsaac() {
    if (!playerMusicaIsaacGlob) playerMusicaIsaacGlob = document.querySelector('.player-musica-isaac');
    const capaMusica = playerMusicaIsaacGlob ? playerMusicaIsaacGlob.querySelector('.capa-musica-isaac') : null;
    const player = playerMusicaIsaacGlob;
    if (capaMusica && player) {
        capaMusica.style.margin = 'auto';
        player.style.display = 'flex';
        player.style.flexDirection = 'column';
        player.style.alignItems = 'center';
        player.style.justifyContent = 'space-between';
    }
}

function selecionarMusicaIsaac(id) {
    const musicaSelecionada = listaDeMusicasIsaac.find((musica) => musica.id === id);
    if (!audioGlob || !audioSourceGlob) {
        console.warn("Player Isaac: Elementos de áudio não inicializados para selecionar música.");
        return;
    }
    if (musicaSelecionada && playerMusicaIsaacGlob) {
        const nomeEl = playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');
        const autorEl = playerMusicaIsaacGlob.querySelector('.autor-musica-isaac');
        const capaImgEl = playerMusicaIsaacGlob.querySelector('.capa-musica-isaac img');

        if (nomeEl) nomeEl.textContent = musicaSelecionada.nome;
        if (autorEl) autorEl.textContent = musicaSelecionada.autor;
        if (capaImgEl) {
            capaImgEl.src = musicaSelecionada.capa;
            capaImgEl.onerror = () => console.error(`Player Isaac: Erro ao carregar imagem da capa: ${musicaSelecionada.capa}`);
        }
        
        playerMusicaIsaacGlob.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;
        
        audioSourceGlob.src = musicaSelecionada.link;
        audioGlob.load(); // Important
        // O play será acionado por playPauseIsaac ou no togglePlayerMusicaIsaac
        // Não tocar automaticamente aqui para evitar problemas com autoplay
        atualizarFavoritoVisualIsaac(id);
        // Não setar musicaTocandoGlob = true aqui, o playPauseIsaac controla
    }
}

function toggleListaMusicasIsaac() {
    const lista = document.getElementById('listaMusicas');
    if (lista) {
        lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
    }
}

function atualizarFavoritoVisualIsaac(id) {
    // Certifique-se que o player está no DOM
    const botaoFavoritar = document.querySelector('.player-musica-isaac .botao-favoritar-isaac');
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

function favoritarMusicaIsaac() {
    const nomeMusicaAtualEl = document.querySelector('.player-musica-isaac .nome-musica-isaac');
    if (nomeMusicaAtualEl) {
        const musicaAtual = listaDeMusicasIsaac.find((musica) => musica.nome === nomeMusicaAtualEl.textContent);
        if (musicaAtual) {
            musicasFavoritadasIsaac[musicaAtual.id] = !musicasFavoritadasIsaac[musicaAtual.id];
            if (!musicasFavoritadasIsaac[musicaAtual.id]) delete musicasFavoritadasIsaac[musicaAtual.id];
            atualizarFavoritoVisualIsaac(musicaAtual.id);
            localStorage.setItem(storageKeyIsaac, JSON.stringify(musicasFavoritadasIsaac));
        }
    }
}

function retroceder10sIsaac() {
    if (audioGlob && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration)) {
        audioGlob.currentTime = Math.max(0, audioGlob.currentTime - 10);
    }
}

function avancar10sIsaac() {
    if (audioGlob && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration)) {
        audioGlob.currentTime = Math.min(audioGlob.duration, audioGlob.currentTime + 10);
    }
}

// Renomeado de volta para `playPause` se o HTML usa `onclick="playPause()"`
function playPause() {
    if (!audioGlob) {
        console.warn("Player Isaac: Elemento de áudio não encontrado para play/pause.");
        return;
    }
    if (musicaTocandoGlob) {
        audioGlob.pause();
    } else {
        // Se o src não estiver definido ou for inválido, o play falhará.
        // É importante que selecionarMusicaIsaac tenha sido chamado antes.
        if (!audioGlob.currentSrc && listaDeMusicasIsaac.length > 0) {
            // Se não tem música carregada, carrega a primeira
             selecionarMusicaIsaac(listaDeMusicasIsaac[0].id);
             // O selecionarMusicaIsaac pode tentar tocar, então aguardar o oncanplaythrough
             // Este play aqui pode ser redundante ou causar erro se o oncanplaythrough já tiver tocado
             audioGlob.oncanplaythrough = () => { // Reatribui para o caso de ter sido perdido
                audioGlob.play().catch(error => console.warn("Player Isaac: Reprodução bloqueada ao tentar tocar após selecionar.", error));
                musicaTocandoGlob = true;
                atualizarBotaoPlayIsaac();
             }
             return; // Sai para esperar o oncanplaythrough
        }
        audioGlob.play().catch(error => console.warn("Player Isaac: Reprodução bloqueada pelo navegador.", error));
    }
    musicaTocandoGlob = !musicaTocandoGlob; // Inverte o estado APÓS a tentativa de play/pause
    atualizarBotaoPlayIsaac();
}

function atualizarBotaoPlayIsaac() {
    const botaoPlay = document.querySelector('.player-musica-isaac .botao-controle-isaac:nth-child(2)');
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
                selecionarMusicaIsaac(musica.id);
                if(audioGlob && !musicaTocandoGlob) { // Se não estiver tocando, tenta tocar a nova música
                    playPause(); // Chama playPause para tentar iniciar a música
                } else if (audioGlob && musicaTocandoGlob) { // Se já estiver tocando, força o play da nova
                    audioGlob.play().catch(e => console.warn("Erro ao tocar música selecionada da lista:", e));
                }
            });
            listaContainer.appendChild(item);
        });
    }
}

// --- TÍTULOS (CARROSSEL) ---
function abrirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.style.display = 'block';
}

function fecharJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) {
        janela.style.display = 'none';
        // A função iniciarCarrosselTitulos será chamada pelo mouseout do container se o carrossel ainda existir
    }
}

function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.classList.toggle('janela-expandida');
}

// --- ATRIBUTOS ---
function toggleCheckboxAtributo(element) {
    element.classList.toggle("checked");
}

// --- SELOS ---
const selosChavesData = [ /* Seus dados de chaves aqui, igual ao anterior */
    { id: 0, nome: "Key of Souls", descricao: "Nenhuma informação sobre a chave Key of Souls está disponível.", item: "assets/Recursos/Key of Souls.png", efeito: "À descobrir 01.", icone: "https://imgur.com/zHQo8sh.png", detalhes: "Esta chave é um teste da alinezinha1"},
    { id: 1, nome: "Key of Dreams", descricao: "Nenhuma informação sobre a chave Key of Dreams está disponível.", item: "assets/Recursos/Key of Dreams.png", efeito: "À descobrir 02.", icone: "https://imgur.com/lKXdgwT.png", detalhes: "Esta chave é um teste da alinezinha2"},
    { id: 2, nome: "Key of Infinite Moon Mansion", descricao: "Nenhuma informação sobre a chave Key of Infinite Moon Mansion está disponível.", item: "assets/Recursos/Key of Infinite Moon Mansion.png", efeito: "À descobrir 03.", icone: "https://imgur.com/Hf705GX.png", detalhes: "Esta chave é um teste da alinezinha3"},
    { id: 3, nome: "Key of Desires", descricao: "Nenhuma informação sobre a chave Key of Desires está disponível.", item: "assets/Recursos/Key of Desires.png", efeito: "À descobrir 04.", icone: "https://imgur.com/L2bLSl2.png", detalhes: "Esta chave é um teste da alinezinha4"},
    { id: 4, nome: "Key of Soul World", descricao: "Nenhuma informação sobre a chave Key of Soul World está disponível.", item: "assets/Recursos/Key of Soul World.png", efeito: "À descobrir 05.", icone: "https://imgur.com/X1zPnlJ.png", detalhes: "Esta chave é um teste da alinezinha5"},
    { id: 5, nome: "Key of Pendragon", descricao: "Nenhuma informação sobre a chave Key of Pendragon está disponível.", item: "assets/Recursos/Key of Pendragon.png", efeito: "À descobrir 06.", icone: "assets/Recursos/Key of Pendragon.png", detalhes: "Esta chave é um teste da alinezinha6"},
    { id: 6, nome: "Key Pinnacle of Flames", descricao: "Nenhuma informação sobre a chave Key Pinnacle of Flames está disponível.", item: "assets/Recursos/Key Pinnacle of Flames.png", efeito: "À descobrir 07.", icone: "https://imgur.com/46Dh8W2.png", detalhes: "Esta chave é um teste da alinezinha7"},
    { id: 7, nome: "Key of Isaac's Heart", descricao: "Nenhuma informação sobre a chave Key of Isaac's Heart está disponível.", item: "assets/Recursos/Key of Isaac's Heart.png", efeito: "À descobrir 08.", icone: "assets/Recursos/Key of Isaac's Heart.png", detalhes: "Esta chave é um teste da alinezinha8"},
];
const selosEstadosIniciais = { circulo1: true, circulo2: false, circulo3: true, circulo4: false, circulo5: true, circulo6: false, circulo7: true, circulo8: false };

// Renomeado de volta para `navegar` se o HTML usa `onclick="navegar()"`
function navegar(direcao) {
    chaveAtualSelos = (chaveAtualSelos + direcao + selosChavesData.length) % selosChavesData.length;
    const chave = selosChavesData[chaveAtualSelos];
    if (!chave) return;

    const tituloItemEl = document.getElementById("titulo-item");
    const descDetalhadaEl = document.querySelector("#retangulo-item .descricao-detalhada");
    const itemImagemEl = document.querySelector(".item-imagem img");
    const tituloEfeitoEl = document.querySelector("#retangulo-efeitos .titulo-efeito");
    const iconeEfeitoEl = document.querySelector("#retangulo-efeitos img");
    const detalhesEfeitoEl = document.querySelector("#retangulo-efeitos .detalhes-detalhados");

    if (tituloItemEl) tituloItemEl.textContent = chave.nome;
    if (descDetalhadaEl) descDetalhadaEl.textContent = chave.descricao;
    if (itemImagemEl) {
        itemImagemEl.src = chave.item;
        itemImagemEl.onerror = () => console.error(`Selos: Erro ao carregar imagem do item: ${chave.item}`);
    }
    if (tituloEfeitoEl) tituloEfeitoEl.textContent = chave.efeito;
    if (iconeEfeitoEl) {
        iconeEfeitoEl.src = chave.icone;
        iconeEfeitoEl.onerror = () => console.error(`Selos: Erro ao carregar imagem do ícone: ${chave.icone}`);
    }
    if (detalhesEfeitoEl) detalhesEfeitoEl.textContent = chave.detalhes;
    
    atualizarDestaqueCirculoSelos(chaveAtualSelos + 1);
}

function atualizarDestaqueCirculoSelos(id) {
    document.querySelectorAll(".circulo-pequeno").forEach((circulo, index) => {
        circulo.style.boxShadow = (index + 1 === id) ? "0 0 10px 3px #FFD700" : "none";
    });
}
function toggleCirculo1() { document.getElementById('circulo1')?.classList.toggle('ativo'); }
// ... ( toggleCirculo2 a toggleCirculo8 da mesma forma)
function toggleCirculo2() { document.getElementById('circulo2')?.classList.toggle('ativo'); }
function toggleCirculo3() { document.getElementById('circulo3')?.classList.toggle('ativo'); }
function toggleCirculo4() { document.getElementById('circulo4')?.classList.toggle('ativo'); }
function toggleCirculo5() { document.getElementById('circulo5')?.classList.toggle('ativo'); }
function toggleCirculo6() { document.getElementById('circulo6')?.classList.toggle('ativo'); }
function toggleCirculo7() { document.getElementById('circulo7')?.classList.toggle('ativo'); }
function toggleCirculo8() { document.getElementById('circulo8')?.classList.toggle('ativo'); }


// --- BENÇÃOS E MALDIÇÕES ---
// Renomeado de volta para `moverCarrossel` se o HTML usa `onclick="moverCarrossel()"`
function moverCarrossel(direcao) {
    const carrossel = document.querySelector('.carrossel-diamantes');
    if (!carrossel) return;
    const itens = carrossel.querySelectorAll('.diamante-item');
    if (itens.length === 0) return;

    itens.forEach(item => item.classList.remove('ativo'));
    posicaoCarrosselBencaos = (posicaoCarrosselBencaos + direcao + itens.length) % itens.length;
    
    if (itens[posicaoCarrosselBencaos]) { // Verifica se o item existe
        itens[posicaoCarrosselBencaos].classList.add('ativo');
        const tamanhoItem = itens[posicaoCarrosselBencaos].offsetWidth + 10;
        const scrollTarget = (posicaoCarrosselBencaos * tamanhoItem) - (carrossel.offsetWidth / 2) + (tamanhoItem / 2);
        carrossel.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
}
// Renomeado de volta para `abrirJanela` e `fecharJanela` se o HTML usa esses nomes
function abrirJanela(idJanela) {
    const janela = document.getElementById(idJanela);
    if (janela) janela.style.display = 'block';
}
function fecharJanela(idJanela) {
    const janela = document.getElementById(idJanela);
    if (janela) janela.style.display = 'none';
}
function expandirJanela(idJanela) { // Este nome estava consistente
    const janela = document.getElementById(idJanela);
    if (janela) janela.classList.toggle('janela-expandida');
}

// --- FILHOS (JANELAS FLUTUANTES) ---
function abrirJanelaFilho(id) { const janela = document.getElementById(`janelaFilho${id}`); if (janela) janela.style.display = 'block'; }
function fecharJanelaFilho(id) { const janela = document.getElementById(`janelaFilho${id}`); if (janela) janela.style.display = 'none'; }
function expandirJanelaFilho(id) { const janela = document.getElementById(`janelaFilho${id}`); if (janela) janela.classList.toggle('janela-expandida'); }

// --- FUNÇÃO UTILITÁRIA PARA ARRASTAR JANELAS (igual à anterior) ---
function addDragEventsToWindow(janela) { /* ... código de addDragEventsToWindow ... */
    let isDragging = false, startX, startY, offsetX, offsetY;
    const dragHandle = janela.querySelector('.janela-cabecalho-arrastavel') || janela; 

    dragHandle.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, a, .no-drag')) return;
        isDragging = true;
        const rect = janela.getBoundingClientRect();
        startX = e.clientX - rect.left + janela.offsetLeft; // Ajuste para offsetLeft/Top
        startY = e.clientY - rect.top + janela.offsetTop;  // Ajuste para offsetLeft/Top
        janela.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            janela.style.left = `${e.clientX - startX + window.scrollX}px`; // Adicionado scrollX/Y
            janela.style.top = `${e.clientY - startY + window.scrollY}px`;
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            janela.style.cursor = 'move';
        }
    });
    dragHandle.style.cursor = 'move';
}


// =========================================================================
// CÓDIGO QUE RODA APÓS O DOM ESTAR COMPLETAMENTE CARREGADO
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- INICIALIZAÇÃO PLAYER DE MÚSICA ISAAC ---
    playerMusicaIsaacGlob = document.querySelector('.player-musica-isaac');
    audioGlob = document.querySelector('#audio-player');
    audioSourceGlob = audioGlob ? audioGlob.querySelector('source') : null;
    progressBarGlob = document.getElementById('progress-bar');
    tempoAtualGlob = document.getElementById('tempo-atual');
    tempoTotalGlob = document.getElementById('tempo-total');

    // Adicionar listeners aos botões do player Isaac se eles existem no DOM principal
    const btnFavoritarIsaac = document.querySelector(".player-musica-isaac .botao-favoritar-isaac");
    if (btnFavoritarIsaac) {
        btnFavoritarIsaac.addEventListener("click", favoritarMusicaIsaac);
    } else {
        console.warn("Player Isaac: Botão '.botao-favoritar-isaac' não encontrado no DOMContentLoaded.");
    }

    const btnListaMusicasIsaac = document.querySelector(".player-musica-isaac .botao-lista-musicas");
    if (btnListaMusicasIsaac) {
        btnListaMusicasIsaac.addEventListener("click", toggleListaMusicasIsaac);
    } else {
        console.warn("Player Isaac: Botão '.botao-lista-musicas' não encontrado no DOMContentLoaded (ou precisa de seletor mais específico se dentro do player).");
    }

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
        audioGlob.addEventListener('ended', () => {
            musicaTocandoGlob = false;
            atualizarBotaoPlayIsaac();
            // Opcional: tocar a próxima música
        });
         audioGlob.addEventListener('play', () => { // Quando o áudio realmente começa a tocar
            musicaTocandoGlob = true;
            atualizarBotaoPlayIsaac();
        });
        audioGlob.addEventListener('pause', () => { // Quando o áudio é pausado
            musicaTocandoGlob = false;
            atualizarBotaoPlayIsaac();
        });
    }

    // Carregar lista e (mas não selecionar/tocar) músicas do Player Isaac
    // A seleção/play acontece com togglePlayerMusicaIsaac ou playPause
    if (document.getElementById('listaMusicas')) {
        atualizarListaMusicasIsaac();
        document.getElementById('listaMusicas').style.display = 'none';
        if (playerMusicaIsaacGlob) atualizarBotaoPlayIsaac(); // Atualiza o botão para o estado inicial
    }

    // --- FAMA/MORAL E AUTOESTIMA (Funções de atualização chamadas diretamente abaixo) ---
    function atualizarBarraStatus(idBarra, idTexto, porcentagem, idStatus = null) { /* ...código da função... */
        const barra = document.getElementById(idBarra);
        const texto = document.getElementById(idTexto);
        if (barra && texto) {
            barra.style.width = `${porcentagem}%`;
            texto.textContent = `${porcentagem}%`;
            let cor;
            if (porcentagem <= 20) cor = 'darkred'; else if (porcentagem <= 40) cor = '#FF9100';
            else if (porcentagem <= 60) cor = '#00D19A'; else if (porcentagem <= 80) cor = '#D622EF';
            else cor = '#6222EF';
            barra.style.backgroundColor = cor;
            if (idStatus) {
                const statusEl = document.getElementById(idStatus);
                if (statusEl) {
                    let textoStatus;
                    if (porcentagem <= 20) textoStatus = 'Infame - Condenado - Vilão - Corrupto';
                    else if (porcentagem <= 40) textoStatus = 'Desprezado - Mal-Visto - Suspeito - Anti-Herói';
                    else if (porcentagem <= 60) textoStatus = 'Ambíguo - Neutro - Indiferente - Equilibrado';
                    else if (porcentagem <= 80) textoStatus = 'Respeitado - Admirado - Herói - Protetor';
                    else textoStatus = 'Renomado - Lendário - Venerado - Salvador';
                    statusEl.textContent = textoStatus;
                }
            }
        }
    }
    atualizarBarraStatus('barra-autoestima', 'texto-autoestima', 98);
    atualizarBarraStatus('barra-fama', 'texto-fama', 97, 'status-fama');

    // --- CARROSSEL DE TÍTULOS ---
    const carrosselTitulosEl = document.querySelector('.carrossel-titulos .carrossel-imagens');
    const carrosselContainerTitulosEl = document.querySelector('.carrossel-titulos');
    function iniciarCarrosselTitulos() { /* ...código da função... */
        if (!carrosselTitulosEl) return; clearInterval(carrosselIntervalGlob);
        carrosselIntervalGlob = setInterval(() => {
            carrosselTitulosEl.scrollLeft += 1;
            if (carrosselTitulosEl.scrollLeft >= carrosselTitulosEl.scrollWidth - carrosselTitulosEl.offsetWidth -1) carrosselTitulosEl.scrollLeft = 0;
        }, 30);
    }
    function pausarCarrosselTitulos() { clearInterval(carrosselIntervalGlob); }

    if (carrosselTitulosEl && carrosselContainerTitulosEl) {
        iniciarCarrosselTitulos();
        carrosselContainerTitulosEl.addEventListener('mouseover', pausarCarrosselTitulos);
        carrosselContainerTitulosEl.addEventListener('mouseout', iniciarCarrosselTitulos);
        // Listeners para .titulo-item são adicionados via onclick no HTML, chamando abrirJanelaTitulo(id)
    }
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow);


    // --- ATRIBUTOS ---
    const atributosData = { /* ...seus dados... */
        hp: { total: 4910210, porcentagem: 100 }, mp: { total: 823691, porcentagem: 100 },
        agi: { total: 637369, porcentagem: 100 }, def: { total: 1476557, porcentagem: 100 },
        res: { total: 1331048, porcentagem: 100 }, spd: { total: 1020989, porcentagem: 100 },
        int: { total: 431815, porcentagem: 100 }, atk: { total: 2075839, porcentagem: 100 },
        smp: { total: 291363290, porcentagem: 99.17 }, unknown: { total: 100, porcentagem: 50 }
    };
    function atualizarAtributoAtual(atributo, total, porcentagem) { /* ...código da função... */
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

    // --- SELOS ---
    for (const [id, ativo] of Object.entries(selosEstadosIniciais)) {
        const circulo = document.getElementById(id);
        if (circulo) { if (ativo) circulo.classList.add('ativo'); else circulo.classList.remove('ativo'); }
    }
    document.querySelectorAll("#retangulo-item .titulo-item, #retangulo-efeitos .titulo-efeito, #retangulo-item .descricao-detalhada")
        .forEach(el => el.contentEditable = "false");
    if (document.getElementById("titulo-item")) { // Verifica se o container dos selos existe
         navegar(0); // Chama a função global `navegar`
    }

    // --- BENÇÃOS E MALDIÇÕES ---
    const diamantesCarrossel = document.querySelectorAll('.diamante-item');
    if (diamantesCarrossel.length > 0) {
        const meio = Math.floor(diamantesCarrossel.length / 2);
        if (diamantesCarrossel[meio]) diamantesCarrossel[meio].classList.add('ativo');
        moverCarrossel(0); // Chama a função global `moverCarrossel`
    }
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);

    // --- BARRA EA ---
    function atualizarEA(porcentagem) { /* ...código da função... */
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
    function atualizarStatusBasicas(grupoId, porcentagem) { /* ...código da função... */
        const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
        const progressText = document.getElementById(`progresso-texto-${grupoId}`);
        const statusIndicator = document.getElementById(`estado-${grupoId}`);
        if (fillBar && progressText && statusIndicator) {
            fillBar.style.width = `${porcentagem}%`; progressText.textContent = `${porcentagem}%`;
            let color = '', status = '';
            if (porcentagem <= 0) { color = '#00B59B'; status = 'Nulo'; }
            else if (porcentagem <= 5) { color = 'darkred'; status = 'Crítico'; } else if (porcentagem <= 30) { color = 'red'; status = 'Baixo'; }
            else if (porcentagem <= 60) { color = '#FFAA00'; status = 'Moderado'; } else if (porcentagem <= 95) { color = 'green'; status = 'Bom'; }
            else if (porcentagem <= 100) { color = '#00B59B'; status = 'Excelente'; } else { color = '#6222EF'; status = 'Insano'; }
            fillBar.style.backgroundColor = color; statusIndicator.textContent = status;
        }
    }
    function atualizarStatusTemporarias(grupoId, porcentagem) { /* ...código da função... */
        const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
        const progressText = document.getElementById(`progresso-texto-${grupoId}`);
        const statusIndicator = document.getElementById(`estado-${grupoId}`);
        if (fillBar && progressText && statusIndicator) {
            fillBar.style.width = `${porcentagem}%`; progressText.textContent = `${porcentagem}%`;
            let color = '', status = '';
            if (porcentagem <= 0) { color = '#00B59B'; status = 'Nulo'; }
            else if (porcentagem <= 5) { color = '#00B59B'; status = 'Muito Baixo'; } else if (porcentagem <= 30) { color = 'green'; status = 'Baixo'; }
            else if (porcentagem <= 60) { color = '#FFAA00'; status = 'Moderado'; } else if (porcentagem <= 95) { color = 'red'; status = 'Alto'; }
            else { color = 'darkred'; status = 'Crítico'; }
            fillBar.style.backgroundColor = color; statusIndicator.textContent = status;
        }
    }
    // Chamadas de atualização... (iguais)
    atualizarStatusBasicas('grupo-higiene', 97); /* ... etc ... */
    atualizarStatusBasicas('grupo-banheiro', 100); atualizarStatusBasicas('grupo-sono', 100); atualizarStatusBasicas('grupo-fome', 100);
    atualizarStatusBasicas('grupo-sede', 100); atualizarStatusBasicas('grupo-diversao', 101); atualizarStatusBasicas('grupo-social', 78);
    atualizarStatusBasicas('grupo-foco', 64); atualizarStatusBasicas('grupo-felicidade', 101); atualizarStatusBasicas('grupo-tesao', 101);
    atualizarStatusTemporarias('grupo-enjoo', 0); /* ... etc ... */
    atualizarStatusTemporarias('grupo-fadiga', 0); atualizarStatusTemporarias('grupo-estresse', 0); atualizarStatusTemporarias('grupo-ansiedade', 0);
    atualizarStatusTemporarias('grupo-medo', 0); atualizarStatusTemporarias('grupo-tedio', 0); atualizarStatusTemporarias('grupo-raiva', 0);
    atualizarStatusTemporarias('grupo-desgaste', 0);
    
    // --- AETHER ---
    function atualizarAether(porcentagem) { /* ...código da função... */
        const preenchimentoAether = document.getElementById("preenchimentoAether");
        const textoAether = document.getElementById("textoAether");
        if (preenchimentoAether && textoAether) {
            porcentagem = Math.max(0, Math.min(102, porcentagem));
            preenchimentoAether.style.width = `${(porcentagem / 102) * 100}%`;
            textoAether.textContent = `Aether: ${porcentagem}%`;
        }
    }
    atualizarAether(101);

    document.querySelectorAll('.janela-filho').forEach(addDragEventsToWindow);


    // =========================================================================
    // CARREGAMENTO DAS SEÇÕES DINÂMICAS (HTML EXTERNO)
    // =========================================================================
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
        const playerMusicaBuffy = document.querySelector("#janelaMusica iframe");
        if (playerMusicaBuffy) {
            playerMusicaBuffy.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
        } else {
            console.warn("Buffy Música: #janelaMusica iframe não encontrado APÓS carregar secao-aura.");
        }
    });

    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");

    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html", function () {
        console.log("Seção Cabeçalho carregada!");
    });

    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
        console.log("Seção Barra de Experiência carregada!");
        // O erro era aqui: progressBar.closest(...).querySelector(...)
        // Vamos garantir que progressBar exista e o seletor seja direto.
        setTimeout(() => {
            var progressBar = document.getElementById('expBar');
            if (progressBar) {
                var percentage = 75;
                progressBar.style.width = percentage + '%';
                // Assumindo que .barra-texto é um irmão ou filho direto do container da barra
                // Se .barra-texto está DENTRO de #expBar, então progressBar.querySelector('.barra-texto')
                // Se é um irmão, precisa de um seletor a partir de um pai comum.
                // Se o HTML for <div class="container"><div id="expBar"></div><span class="barra-texto"></span></div>
                // Então:
                const containerDaBarra = progressBar.closest('.barra-exp-container'); // Ou qualquer que seja o container
                if (containerDaBarra) {
                    const textSpan = containerDaBarra.querySelector('.barra-texto');
                    if (textSpan) {
                        textSpan.textContent = '1590 - ' + percentage + '%';
                    } else {
                        console.warn("Barra Dinheiro: '.barra-texto' não encontrado dentro do container de 'expBar'.");
                    }
                } else {
                     console.warn("Barra Dinheiro: Container de 'expBar' não encontrado.");
                }
            } else {
                console.warn("Barra Dinheiro: Elemento 'expBar' não encontrado após carregar seção.");
            }
        }, 500);
    });

    loadSection("secao-classes", "Seções/5-Classes.html", function () {
        console.log("Seção Classes carregada!");
        // Se o botão que chama `mostrarTexto()` está DENTRO desta seção,
        // o listener deveria ser adicionado aqui, ex:
        // const botaoMostrarTexto = document.querySelector('#secao-classes .botao-que-mostra-texto');
        // if (botaoMostrarTexto) botaoMostrarTexto.addEventListener('click', mostrarTexto);
        // Se o onclick no HTML já está funcionando com a função global `mostrarTexto`, ok.
    });

    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function () {
        console.log("Seção Modo Empusa carregada!");
        // Funções de atualização do Modo Empusa (definidas globalmente ou dentro deste callback)
        function atualizarBarraModoEmpusa(idBarra, idTexto, porcentagem) { /* ... */ }
        function atualizarFomeModoEmpusa() { /* ... */ }
        function toggleMenuModoEmpusa(seta) { /* ... */ }
        function atualizarDorModoEmpusa(nivelDor) { /* ... */ }
        function atualizarSatisfacaoModoEmpusa(idContainer, idPrefixo, nivelSatisfacao) { /* ... */ }
        // Copie as definições das funções do Modo Empusa para cá se elas usam elementos SÓ desta seção

        setTimeout(() => {
            // Chamadas de atualização... (ex: atualizarBarraModoEmpusa(...))
            // Adicionar listener para .empusa-seta
            document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(seta => { // Seletor específico
                seta.addEventListener('click', function () {
                    // Precisa da definição de toggleMenuModoEmpusa acessível aqui
                    var menu = this.parentElement.nextElementSibling;
                    if (menu && menu.classList.contains('empusa-menu')) {
                        document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(m => {
                            if (m !== menu) m.style.display = 'none';
                        });
                        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
                    }
                });
            });
        }, 500);
    });

    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function () {
        console.log("Seção Modo Empusa - Alvo carregada!");
        // Funções de atualização do Modo Empusa Alvo (definidas globalmente ou dentro deste callback)
        function atualizarBarraModoEmpusaAlvo(idBarra, idTexto, porcentagem) { /* ... */ }
        function atualizarDorModoEmpusaAlvo(nivelDor) { /* ... */ }
        function atualizarDominanciaModoEmpusaAlvo(porcentagem) { /* ... */ }
        // Copie as definições das funções do Modo Empusa Alvo para cá

        setTimeout(() => {
            // Chamadas de atualização...
        }, 500);
    });

}); // FIM DO DOMContentLoaded

console.log("Script.js carregado e inicializado (com mais correções).");
