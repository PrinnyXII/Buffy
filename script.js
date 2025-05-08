// =========================================================================
// FUNÇÃO UNIVERSAL PARA CARREGAR SEÇÕES (MOVIDA PARA O TOPO E ÚNICA)
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
                        callback(); // Executa o código após o carregamento
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
// VARIÁVEIS GLOBAIS (DECLARADAS AQUI, INICIALIZADAS NO DOMCONTENTLOADED)
// =========================================================================
let playerMusicaIsaacGlob, audioGlob, audioSourceGlob, progressBarGlob, tempoAtualGlob, tempoTotalGlob;
let musicaTocandoGlob = false;
let carrosselIntervalGlob; // Para o carrossel de títulos

// =========================================================================
// CÓDIGO QUE RODA APÓS O DOM ESTAR COMPLETAMENTE CARREGADO
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- INICIALIZAÇÃO PLAYER DE MÚSICA ISAAC ---
    playerMusicaIsaacGlob = document.querySelector('.player-musica-isaac');
    audioGlob = document.querySelector('#audio-player');
    audioSourceGlob = document.querySelector('#audio-player source');
    progressBarGlob = document.getElementById('progress-bar');
    tempoAtualGlob = document.getElementById('tempo-atual');
    tempoTotalGlob = document.getElementById('tempo-total');

    const btnFavoritarIsaac = document.querySelector(".botao-favoritar-isaac");
    if (btnFavoritarIsaac) {
        btnFavoritarIsaac.addEventListener("click", favoritarMusicaIsaac);
    } else {
        console.warn("Botão '.botao-favoritar-isaac' não encontrado.");
    }

    const btnListaMusicasIsaac = document.querySelector(".botao-lista-musicas");
    if (btnListaMusicasIsaac) {
        btnListaMusicasIsaac.addEventListener("click", toggleListaMusicasIsaac);
    } else {
        console.warn("Botão '.botao-lista-musicas' não encontrado.");
    }

    if (progressBarGlob && audioGlob) {
        progressBarGlob.addEventListener('input', () => {
            if (audioGlob && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration)) {
                audioGlob.currentTime = (progressBarGlob.value / 100) * audioGlob.duration;
            } else {
                console.warn("Player Isaac: Duração do áudio não disponível para input na barra.");
            }
        });
    } else {
        if (!progressBarGlob) console.warn("Player Isaac: Elemento 'progress-bar' não encontrado.");
        if (!audioGlob) console.warn("Player Isaac: Elemento '#audio-player' não encontrado.");
    }

    if (audioGlob) {
        audioGlob.addEventListener('timeupdate', () => {
            if (tempoAtualGlob && !isNaN(audioGlob.currentTime) && isFinite(audioGlob.currentTime)) {
                tempoAtualGlob.textContent = formatarTempo(audioGlob.currentTime);
            }
            if (progressBarGlob && audioGlob.duration && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration)) { // Adicionado audioGlob.duration aqui
                progressBarGlob.value = (audioGlob.currentTime / audioGlob.duration) * 100;
            }
        });

        audioGlob.addEventListener('loadedmetadata', () => {
            if (tempoTotalGlob && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration)) {
                tempoTotalGlob.textContent = formatarTempo(audioGlob.duration);
            }
        });
    }

    // Carregar lista e primeira música do Player Isaac
    if (document.getElementById('listaMusicas')) { // Verifica se o container da lista existe
        atualizarListaMusicasIsaac();
        selecionarMusicaIsaac(1); // Carregar a primeira música
        document.getElementById('listaMusicas').style.display = 'none';
        atualizarBotaoPlayIsaac();
    } else {
        console.warn("Player Isaac: Container 'listaMusicas' não encontrado para inicialização.");
    }

    // --- FAMA/MORAL E AUTOESTIMA ---
    atualizarBarraStatus('barra-autoestima', 'texto-autoestima', 98); // Atualiza apenas a cor e porcentagem
    atualizarBarraStatus('barra-fama', 'texto-fama', 97, 'status-fama'); // Atualiza cor, porcentagem e status

    // --- CARROSSEL DE TÍTULOS ---
    const carrosselTitulosEl = document.querySelector('.carrossel-imagens');
    const carrosselContainerTitulosEl = document.querySelector('.carrossel-titulos');

    if (carrosselTitulosEl && carrosselContainerTitulosEl) {
        iniciarCarrosselTitulos(); // Inicia o carrossel automaticamente
        carrosselContainerTitulosEl.addEventListener('mouseover', pausarCarrosselTitulos);
        carrosselContainerTitulosEl.addEventListener('mouseout', iniciarCarrosselTitulos);

        document.querySelectorAll('.titulo-item').forEach((item) => {
            item.addEventListener('click', (e) => {
                pausarCarrosselTitulos();
                const idAttr = e.currentTarget.getAttribute('onclick');
                if (idAttr) {
                    const idMatch = idAttr.match(/\d+/);
                    if (idMatch && idMatch[0]) {
                        abrirJanelaTitulo(idMatch[0]);
                    }
                }
            });
        });
    } else {
        console.warn("Carrossel de Títulos: Elementos não encontrados para inicialização.");
    }
    
    // Movimentação manual das janelas flutuantes de Títulos
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow);

    // --- ATRIBUTOS ---
    // Atualizando os valores e porcentagens das barras de atributos
    for (let atributo in atributosData) {
        const { total, porcentagem } = atributosData[atributo];
        atualizarAtributoAtual(atributo, total, porcentagem);
    }

    // --- SELOS ---
    // Aplica os estados iniciais (ativo/inativo) aos círculos dos selos
    for (const [id, ativo] of Object.entries(selosEstadosIniciais)) {
        const circulo = document.getElementById(id);
        if (circulo) {
            if (ativo) {
                circulo.classList.add('ativo');
            } else {
                circulo.classList.remove('ativo');
            }
        }
    }
    // Previne caixas de texto editáveis nos selos
    document.querySelectorAll("#retangulo-item .titulo-item, #retangulo-efeitos .titulo-efeito, #retangulo-item .descricao-detalhada").forEach(elemento => {
        elemento.contentEditable = "false";
    });
    if (document.getElementById("titulo-item")) { // Verifica se o container dos selos existe
         navegarSelos(0); // Inicializa com a primeira chave (ou a última se for -1)
    }


    // --- BENÇÃOS E MALDIÇÕES ---
    const diamantesCarrossel = document.querySelectorAll('.diamante-item');
    if (diamantesCarrossel.length > 0) {
        const meio = Math.floor(diamantesCarrossel.length / 2);
        diamantesCarrossel[meio].classList.add('ativo');
        // Mover para o item ativo inicial
        moverCarrosselBencaos(0); // Garante que a posição inicial seja aplicada ao scroll
    }
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);


    // --- BARRA EA ---
    atualizarEA(86);

    // --- NECESSIDADES BÁSICAS E TEMPORÁRIAS ---
    atualizarStatusBasicas('grupo-higiene', 97);
    atualizarStatusBasicas('grupo-banheiro', 100);
    atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 100);
    atualizarStatusBasicas('grupo-sede', 100);
    atualizarStatusBasicas('grupo-diversao', 101);
    atualizarStatusBasicas('grupo-social', 78);
    atualizarStatusBasicas('grupo-foco', 64);
    atualizarStatusBasicas('grupo-felicidade', 101);
    atualizarStatusBasicas('grupo-tesao', 101);

    atualizarStatusTemporarias('grupo-enjoo', 0);
    atualizarStatusTemporarias('grupo-fadiga', 0);
    atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0);
    atualizarStatusTemporarias('grupo-medo', 0);
    atualizarStatusTemporarias('grupo-tedio', 0);
    atualizarStatusTemporarias('grupo-raiva', 0);
    atualizarStatusTemporarias('grupo-desgaste', 0);
    
    // --- AETHER ---
    atualizarAether(101);

    // =========================================================================
    // CARREGAMENTO DAS SEÇÕES DINÂMICAS (HTML EXTERNO)
    // =========================================================================
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
        const playerMusicaBuffy = document.querySelector("#janelaMusica iframe");
        if (playerMusicaBuffy) {
            // Cole o link correto do SoundCloud aqui novamente, se necessário
            playerMusicaBuffy.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
        } else {
            console.warn("Buffy Música: O elemento #janelaMusica iframe não foi encontrado após carregar secao-aura.");
        }
    });

    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html"); // Sem callback específico listado

    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html", function () {
        console.log("Seção Cabeçalho carregada!");
    });

    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
        console.log("Seção Barra de Experiência carregada!");
        setTimeout(() => {
            var progressBar = document.getElementById('expBar');
            if (progressBar) {
                var percentage = 75; // Atualiza bara EXP
                progressBar.style.width = percentage + '%';
                var textSpan = progressBar.closest('.barra-exp-container').querySelector('.barra-texto'); // Melhor seletor
                if (textSpan) {
                    textSpan.textContent = '1590 - ' + percentage + '%';
                }
            } else {
                console.warn("Barra Dinheiro: Elemento 'expBar' não encontrado.");
            }
        }, 500);
    });

    loadSection("secao-classes", "Seções/5-Classes.html", function () {
        console.log("Seção Classes carregada!");
        // Se houver addEventListeners para '.expandido' ou botões relacionados, eles devem ser adicionados aqui.
    });

    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function () {
        console.log("Seção Modo Empusa carregada!");
        setTimeout(() => {
            atualizarBarraModoEmpusa("prazerBar", "prazer-texto", 99);
            atualizarBarraModoEmpusa("amorBar", "amor-texto", 100);
            atualizarBarraModoEmpusa("sangueBar", "sangue-texto", 47);
            atualizarBarraModoEmpusa("vitalidadeBar", "vitalidade-texto", 100);
            atualizarFomeModoEmpusa();
            atualizarDorModoEmpusa(1);
            atualizarSatisfacaoModoEmpusa("satisfacao-container", "satisfacao", 5);

            document.querySelectorAll('.empusa-seta').forEach(seta => {
                seta.addEventListener('click', function () {
                    toggleMenuModoEmpusa(this);
                });
            });
        }, 500);
    });

    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function () {
        console.log("Seção Modo Empusa - Alvo carregada!");
        setTimeout(() => {
            atualizarBarraModoEmpusaAlvo("prazerBarAlvo", "prazer-texto-alvo", 98);
            atualizarBarraModoEmpusaAlvo("amorBarAlvo", "amor-texto-alvo", 100);
            atualizarBarraModoEmpusaAlvo("volumeBarAlvo", "volume-texto-alvo", 5);
            atualizarBarraModoEmpusaAlvo("vitalidadeBarAlvo", "vitalide-texto-alvo", 21); // Corrigido: vitalide -> vitalidade
            atualizarDorModoEmpusaAlvo(3);
            atualizarSatisfacaoModoEmpusa("satisfacao-container-alvo", "satisfacao-alvo", 5); // Reutilizando função, ok se IDs forem únicos
            atualizarDominanciaModoEmpusaAlvo(73);
        }, 500);
    });

}); // FIM DO DOMContentLoaded

// =========================================================================
// DEFINIÇÕES DE FUNÇÕES (ORGANIZADAS POR SEÇÃO OU FUNCIONALIDADE)
// =========================================================================

// --- BUFFY MÚSICA (SECAO-AURA) ---
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    if (janela) {
        janela.style.display = (janela.style.display === 'none' || janela.style.display === '') ? 'block' : 'none';
    }
}

// --- CLASSES ---
function mostrarTextoClasse() { // Renomeado para evitar conflito se houver outra 'mostrarTexto'
    const expandido = document.querySelector('#secao-classes .expandido'); // Mais específico
    if (expandido) {
        expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
    } else {
        console.warn("Classes: Elemento '.expandido' não encontrado!");
    }
}

// --- MODO EMPUSA (BUFFY) ---
function atualizarBarraModoEmpusa(idBarra, idTexto, porcentagem) {
    var progressBar = document.getElementById(idBarra);
    var textSpan = document.getElementById(idTexto);
    if (progressBar && textSpan) {
        progressBar.style.width = porcentagem + '%';
        textSpan.textContent = porcentagem + '%';
    } else {
        console.warn(`Modo Empusa: Elemento '${idBarra}' ou '${idTexto}' não encontrado.`);
    }
}

function atualizarFomeModoEmpusa() {
    const sangueEl = document.getElementById("sangue-texto");
    const vitalidadeEl = document.getElementById("vitalidade-texto");
    if (sangueEl && vitalidadeEl) {
        var sangue = parseInt(sangueEl.textContent) || 0;
        var vitalidade = parseInt(vitalidadeEl.textContent) || 0;
        var fomeTotal = Math.min(sangue + vitalidade, 100);
        atualizarBarraModoEmpusa("fomeBar", "fome-texto", fomeTotal);
    }
}

function toggleMenuModoEmpusa(seta) {
    var menu = seta.parentElement.nextElementSibling;
    if (menu && menu.classList.contains('empusa-menu')) {
        document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(m => { // Mais específico
            if (m !== menu) {
                m.style.display = 'none';
            }
        });
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
}

function atualizarDorModoEmpusa(nivelDor) {
    nivelDor = Math.max(0, Math.min(nivelDor, 6));
    for (let i = 1; i <= 6; i++) {
        let coracao = document.getElementById(`coracao-${i}`);
        if (coracao) {
            coracao.textContent = (i <= nivelDor) ? "💜" : "🤍";
        }
    }
}

function atualizarSatisfacaoModoEmpusa(idContainer, idPrefixo, nivelSatisfacao) {
    nivelSatisfacao = Math.max(1, Math.min(nivelSatisfacao, 6));
    let container = document.getElementById(idContainer);
    if (!container) {
        console.warn(`Modo Empusa Satisfação: Container '${idContainer}' não encontrado.`);
        return;
    }
    container.querySelectorAll('.emoji-satisfacao').forEach(emoji => {
        emoji.classList.remove('emoji-selecionado');
    });
    let emojiSelecionado = document.getElementById(`${idPrefixo}-${nivelSatisfacao}`);
    if (emojiSelecionado) {
        emojiSelecionado.classList.add('emoji-selecionado');
    }
}

// --- MODO EMPUSA (ALVO) ---
function atualizarBarraModoEmpusaAlvo(idBarra, idTexto, porcentagem) {
    var progressBar = document.getElementById(idBarra);
    var textSpan = document.getElementById(idTexto);
    if (progressBar && textSpan) {
        progressBar.style.width = porcentagem + '%';
        textSpan.textContent = porcentagem + '%';
    } else {
         console.warn(`Modo Empusa Alvo: Elemento '${idBarra}' ou '${idTexto}' não encontrado.`);
    }
}

function atualizarDorModoEmpusaAlvo(nivelDor) {
    nivelDor = Math.max(0, Math.min(nivelDor, 6));
    for (let i = 1; i <= 6; i++) {
        let coracao = document.getElementById(`coracao-alvo-${i}`);
        if (coracao) {
            coracao.textContent = i <= nivelDor ? "💜" : "🤍";
        }
    }
}

function atualizarDominanciaModoEmpusaAlvo(porcentagem) {
    porcentagem = Math.max(0, Math.min(porcentagem, 100));
    let preenchimento = document.getElementById("dominanciaBar");
    let emoji = document.getElementById("dominancia-emoji");
    if (preenchimento && emoji) {
        preenchimento.style.background = `linear-gradient(to right, #ff12a9 0%, #ff12a9 ${Math.max(0, porcentagem - 5)}%, #a020f0 ${porcentagem}%, #1e90ff ${Math.min(100, porcentagem + 5)}%, #1e90ff 100%)`;
        emoji.style.left = `calc(${porcentagem}% - 15px)`; // Ajuste de 15px pode precisar ser dinâmico com base no tamanho do emoji
    }
}
// A função atualizarSatisfacaoModoEmpusa pode ser reutilizada para o Alvo se os IDs forem distintos.

// --- CARACTERÍSTICAS (PROFISSÃO, ESTADO CIVIL) ---
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if (detalhes) {
        detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none';
    }
}

function abrirJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    const textoCasada = document.querySelector(".texto-clicavel-isaac"); // Verifique se este seletor é único e correto
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
    if (janela) janela.style.display = "none";
}

// --- PLAYER DE MÚSICA ISAAC ---
const listaDeMusicasIsaac = [
    { id: 1, nome: "Crying Alone / Nowhere", autor: "Kurae Radiânthia Pendragon Isaac", capa: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true", background: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true", link: "assets/CryingAlone-Nowhere.mp3" }
];
const storageKeyIsaac = 'musicasFavoritadasIsaac';
let musicasFavoritadasIsaac = JSON.parse(localStorage.getItem(storageKeyIsaac)) || {};

function togglePlayerMusicaIsaac() {
    const player = playerMusicaIsaacGlob; // Usa a variável global
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if (player) {
        if (player.style.display === 'none' || player.style.display === '') {
            player.style.display = 'flex';
            if (estadoCivil) estadoCivil.style.zIndex = '900';
            centralizarElementosPlayerIsaac();
            selecionarMusicaIsaac(1); // Ou a última tocada, se você guardar essa info
        } else {
            player.style.display = 'none';
            if (estadoCivil) estadoCivil.style.zIndex = '1000';
            if (audioGlob) audioGlob.pause();
            musicaTocandoGlob = false;
            atualizarBotaoPlayIsaac();
        }
    }
}

function fecharPlayerIsaac() {
    const player = playerMusicaIsaacGlob;
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if (player) player.style.display = 'none';
    if (estadoCivil) estadoCivil.style.zIndex = '1000';
    if (audioGlob) audioGlob.pause();
    musicaTocandoGlob = false;
    atualizarBotaoPlayIsaac();
}

function centralizarElementosPlayerIsaac() {
    const capaMusica = document.querySelector('.player-musica-isaac .capa-musica-isaac'); // Seletor mais específico
    const player = playerMusicaIsaacGlob;
    if (capaMusica && player) {
        capaMusica.style.margin = 'auto'; // Isto pode ser melhor feito com CSS Flexbox/Grid no container
        player.style.display = 'flex';
        player.style.flexDirection = 'column';
        player.style.alignItems = 'center';
        player.style.justifyContent = 'space-between'; // Ou 'center' dependendo do layout desejado
    }
}

function selecionarMusicaIsaac(id) {
    const musicaSelecionada = listaDeMusicasIsaac.find((musica) => musica.id === id);
    if (musicaSelecionada && audioGlob && audioSourceGlob && playerMusicaIsaacGlob) {
        const nomeEl = playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');
        const autorEl = playerMusicaIsaacGlob.querySelector('.autor-musica-isaac');
        const capaImgEl = playerMusicaIsaacGlob.querySelector('.capa-musica-isaac img');

        if (nomeEl) nomeEl.textContent = musicaSelecionada.nome;
        if (autorEl) autorEl.textContent = musicaSelecionada.autor;
        if (capaImgEl) capaImgEl.src = musicaSelecionada.capa;
        
        playerMusicaIsaacGlob.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;
        
        audioSourceGlob.src = musicaSelecionada.link;
        audioGlob.load();
        audioGlob.oncanplaythrough = () => {
            if (playerMusicaIsaacGlob.style.display === 'flex') { // Só toca se o player estiver visível
                 audioGlob.play().catch(error => console.warn("Player Isaac: Reprodução bloqueada pelo navegador.", error));
                 musicaTocandoGlob = true;
                 atualizarBotaoPlayIsaac();
            }
        };
        atualizarFavoritoVisualIsaac(id);
    } else {
        if(!musicaSelecionada) console.warn(`Player Isaac: Música com ID ${id} não encontrada.`);
        // Outras checagens de null já foram feitas no DOMContentLoaded
    }
}

function toggleListaMusicasIsaac() {
    const lista = document.getElementById('listaMusicas');
    if (lista) {
        lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
    }
}

function atualizarFavoritoVisualIsaac(id) {
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

function playPauseIsaac() {
    if (!audioGlob) return;
    if (musicaTocandoGlob) {
        audioGlob.pause();
    } else {
        audioGlob.play().catch(error => console.warn("Player Isaac: Reprodução bloqueada pelo navegador.", error));
    }
    musicaTocandoGlob = !musicaTocandoGlob;
    atualizarBotaoPlayIsaac();
}

function atualizarBotaoPlayIsaac() {
    const botaoPlay = document.querySelector('.player-musica-isaac .botao-controle-isaac:nth-child(2)'); // Seletor mais específico
    if (botaoPlay) {
        botaoPlay.textContent = musicaTocandoGlob ? 'II' : '►';
    }
}

function formatarTempo(segundos) {
    if (isNaN(segundos) || !isFinite(segundos)) return "0:00";
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
            item.addEventListener('click', () => selecionarMusicaIsaac(musica.id));
            listaContainer.appendChild(item);
        });
    }
}

// --- FAMA/MORAL E AUTOESTIMA (GERAL) ---
function atualizarBarraStatus(idBarra, idTexto, porcentagem, idStatus = null) {
    const barra = document.getElementById(idBarra);
    const texto = document.getElementById(idTexto);
    
    if (barra && texto) {
        barra.style.width = `${porcentagem}%`;
        texto.textContent = `${porcentagem}%`;

        let cor;
        if (porcentagem <= 20) cor = 'darkred';
        else if (porcentagem <= 40) cor = '#FF9100';
        else if (porcentagem <= 60) cor = '#00D19A';
        else if (porcentagem <= 80) cor = '#D622EF';
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
    } else {
        console.warn(`Fama/Moral: Elemento '${idBarra}', '${idTexto}' ou '${idStatus}' não encontrado.`);
    }
}

// --- TÍTULOS (CARROSSEL) ---
const carrosselTitulosData = { // Adicione os dados dos títulos aqui se precisar deles em JS
    // Ex: 1: { nome: "Título 1", ... }
};

function iniciarCarrosselTitulos() {
    const carrossel = document.querySelector('.carrossel-titulos .carrossel-imagens'); // Seletor mais específico
    if (!carrossel) return;
    clearInterval(carrosselIntervalGlob); // Limpa intervalo anterior se houver
    carrosselIntervalGlob = setInterval(() => {
        carrossel.scrollLeft += 1;
        if (carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.offsetWidth -1) { // -1 para evitar pequenos "saltos"
            carrossel.scrollLeft = 0;
        }
    }, 30);
}

function pausarCarrosselTitulos() {
    clearInterval(carrosselIntervalGlob);
}

function abrirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.style.display = 'block';
}

function fecharJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) {
        janela.style.display = 'none';
        iniciarCarrosselTitulos(); // Reinicia o carrossel
    }
}

function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.classList.toggle('janela-expandida');
}

// --- ATRIBUTOS ---
const atributosData = {
    hp: { total: 4910210, porcentagem: 100 }, mp: { total: 823691, porcentagem: 100 },
    agi: { total: 637369, porcentagem: 100 }, def: { total: 1476557, porcentagem: 100 },
    res: { total: 1331048, porcentagem: 100 }, spd: { total: 1020989, porcentagem: 100 },
    int: { total: 431815, porcentagem: 100 }, atk: { total: 2075839, porcentagem: 100 },
    smp: { total: 291363290, porcentagem: 99.17 }, unknown: { total: 100, porcentagem: 50 }
};

function toggleCheckboxAtributo(element) { // Renomeado para especificidade
    element.classList.toggle("checked");
}

function atualizarAtributoAtual(atributo, total, porcentagem) {
    const textoEl = document.getElementById(`texto-${atributo}`);
    const barraEl = document.getElementById(`barra-${atributo}`);
    if (textoEl && barraEl) {
        const valorAtual = Math.floor((porcentagem / 100) * total);
        textoEl.innerText = `${valorAtual} / ${total}`;
        barraEl.style.width = `${porcentagem}%`;
    }
}

// --- SELOS ---
let chaveAtualSelos = 0;
const selosChavesData = [
    { id: 0, nome: "Key of Souls", descricao: "Nenhuma informação sobre a chave Key of Souls está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true", efeito: "À descobrir 01.", icone: "https://imgur.com/zHQo8sh.png", detalhes: "Esta chave é um teste da alinezinha1"},
    { id: 1, nome: "Key of Dreams", descricao: "Nenhuma informação sobre a chave Key of Dreams está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true", efeito: "À descobrir 02.", icone: "https://imgur.com/lKXdgwT.png", detalhes: "Esta chave é um teste da alinezinha2"},
    { id: 2, nome: "Key of Infinite Moon Mansion", descricao: "Nenhuma informação sobre a chave Key of Infinite Moon Mansion está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true", efeito: "À descobrir 03.", icone: "https://imgur.com/Hf705GX.png", detalhes: "Esta chave é um teste da alinezinha3"},
    { id: 3, nome: "Key of Desires", descricao: "Nenhuma informação sobre a chave Key of Desires está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true", efeito: "À descobrir 04.", icone: "https://imgur.com/L2bLSl2.png", detalhes: "Esta chave é um teste da alinezinha4"},
    { id: 4, nome: "Key of Soul World", descricao: "Nenhuma informação sobre a chave Key of Soul World está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true", efeito: "À descobrir 05.", icone: "https://imgur.com/X1zPnlJ.png", detalhes: "Esta chave é um teste da alinezinha5"},
    { id: 5, nome: "Key of Pendragon", descricao: "Nenhuma informação sobre a chave Key of Pendragon está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true", efeito: "À descobrir 06.", icone: "assets/Recursos/Key of Pendragon.png", detalhes: "Esta chave é um teste da alinezinha6"}, // Caminho local, verificar se está no deploy
    { id: 6, nome: "Key Pinnacle of Flames", descricao: "Nenhuma informação sobre a chave Key Pinnacle of Flames está disponível.", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20Pinnacle%20of%20Flames.png?raw=true", efeito: "À descobrir 07.", icone: "https://imgur.com/46Dh8W2.png", detalhes: "Esta chave é um teste da alinezinha7"},
    { id: 7, nome: "Key of Isaac's Heart", descricao: "Nenhuma informação sobre a chave Key of Isaac's Heart está disponível.", item: "assets/Recursos/Key of Isaac's Heart.png", efeito: "À descobrir 08.", icone: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true", detalhes: "Esta chave é um teste da alinezinha8"},// Caminho local, verificar
];
const selosEstadosIniciais = {
    circulo1: true, circulo2: false, circulo3: true, circulo4: false,
    circulo5: true, circulo6: false, circulo7: true, circulo8: false
};

function navegarSelos(direcao) {
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
    if (itemImagemEl) itemImagemEl.src = chave.item; // VERIFICAR CAMINHOS DE IMAGEM
    if (tituloEfeitoEl) tituloEfeitoEl.textContent = chave.efeito;
    if (iconeEfeitoEl) iconeEfeitoEl.src = chave.icone; // VERIFICAR CAMINHOS DE IMAGEM
    if (detalhesEfeitoEl) detalhesEfeitoEl.textContent = chave.detalhes;
    
    atualizarDestaqueCirculoSelos(chaveAtualSelos + 1);
}

function atualizarDestaqueCirculoSelos(id) {
    document.querySelectorAll(".circulo-pequeno").forEach((circulo, index) => {
        circulo.style.boxShadow = (index + 1 === id) ? "0 0 10px 3px #FFD700" : "none";
    });
}

function toggleEstadoCirculoSelo(id) { // Renomeado
    const circulo = document.getElementById(id);
    if (circulo) circulo.classList.toggle('ativo');
}
// Funções específicas para cada círculo (toggleCirculo1, toggleCirculo2, etc.) chamariam toggleEstadoCirculoSelo('circuloX')
function toggleCirculo1() { toggleEstadoCirculoSelo('circulo1'); }
function toggleCirculo2() { toggleEstadoCirculoSelo('circulo2'); }
function toggleCirculo3() { toggleEstadoCirculoSelo('circulo3'); }
function toggleCirculo4() { toggleEstadoCirculoSelo('circulo4'); }
function toggleCirculo5() { toggleEstadoCirculoSelo('circulo5'); }
function toggleCirculo6() { toggleEstadoCirculoSelo('circulo6'); }
function toggleCirculo7() { toggleEstadoCirculoSelo('circulo7'); }
function toggleCirculo8() { toggleEstadoCirculoSelo('circulo8'); }


// --- BENÇÃOS E MALDIÇÕES ---
let posicaoCarrosselBencaos = 0;

function moverCarrosselBencaos(direcao) {
    const carrossel = document.querySelector('.carrossel-diamantes');
    if (!carrossel) return;
    const itens = carrossel.querySelectorAll('.diamante-item');
    if (itens.length === 0) return;

    itens.forEach(item => item.classList.remove('ativo'));
    posicaoCarrosselBencaos = (posicaoCarrosselBencaos + direcao + itens.length) % itens.length;
    itens[posicaoCarrosselBencaos].classList.add('ativo');

    const tamanhoItem = itens[posicaoCarrosselBencaos].offsetWidth + 10; // 10 para o gap
    // Centralizar o item ativo
    const scrollTarget = (posicaoCarrosselBencaos * tamanhoItem) - (carrossel.offsetWidth / 2) + (tamanhoItem / 2);
    carrossel.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
    });
}

function abrirJanelaBencao(idJanela) { // Renomeado
    console.log(`Janela ${idJanela} aberta`);
    const janela = document.getElementById(idJanela);
    if (janela) janela.style.display = 'block';
}

function fecharJanelaBencao(idJanela) { // Renomeado
    const janela = document.getElementById(idJanela);
    if (janela) janela.style.display = 'none';
}

function expandirJanelaBencao(idJanela) { // Renomeado
    const janela = document.getElementById(idJanela);
    if (janela) janela.classList.toggle('janela-expandida');
}

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

// --- FILHOS (JANELAS FLUTUANTES) ---
function abrirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`);
    if (janela) janela.style.display = 'block';
}

function fecharJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`);
    if (janela) janela.style.display = 'none';
}

function expandirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`);
    if (janela) janela.classList.toggle('janela-expandida');
}

// --- NECESSIDADES BÁSICAS ---
function atualizarStatusBasicas(grupoId, porcentagem) {
    const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
    const progressText = document.getElementById(`progresso-texto-${grupoId}`);
    const statusIndicator = document.getElementById(`estado-${grupoId}`);

    if (fillBar && progressText && statusIndicator) {
        fillBar.style.width = `${porcentagem}%`;
        progressText.textContent = `${porcentagem}%`;

        let color = '', status = '';
        if (porcentagem <= 0) { color = '#00B59B'; status = 'Nulo'; }
        else if (porcentagem <= 5) { color = 'darkred'; status = 'Crítico'; }
        else if (porcentagem <= 30) { color = 'red'; status = 'Baixo'; }
        else if (porcentagem <= 60) { color = '#FFAA00'; status = 'Moderado'; }
        else if (porcentagem <= 95) { color = 'green'; status = 'Bom'; }
        else if (porcentagem <= 100) { color = '#00B59B'; status = 'Excelente'; }
        else { color = '#6222EF'; status = 'Insano'; }

        fillBar.style.backgroundColor = color;
        statusIndicator.textContent = status;
    }
}

// --- NECESSIDADES TEMPORÁRIAS ---
function atualizarStatusTemporarias(grupoId, porcentagem) {
    const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
    const progressText = document.getElementById(`progresso-texto-${grupoId}`);
    const statusIndicator = document.getElementById(`estado-${grupoId}`);

    if (fillBar && progressText && statusIndicator) {
        fillBar.style.width = `${porcentagem}%`;
        progressText.textContent = `${porcentagem}%`;

        let color = '', status = '';
        if (porcentagem <= 0) { color = '#00B59B'; status = 'Nulo'; }
        else if (porcentagem <= 5) { color = '#00B59B'; status = 'Muito Baixo'; } // Era darkred, mas no seu código estava #00B59B
        else if (porcentagem <= 30) { color = 'green'; status = 'Baixo'; }
        else if (porcentagem <= 60) { color = '#FFAA00'; status = 'Moderado'; }
        else if (porcentagem <= 95) { color = 'red'; status = 'Alto'; }
        else { color = 'darkred'; status = 'Crítico'; }

        fillBar.style.backgroundColor = color;
        statusIndicator.textContent = status;
    }
}

// --- AETHER ---
function atualizarAether(porcentagem) {
    const preenchimentoAether = document.getElementById("preenchimentoAether");
    const textoAether = document.getElementById("textoAether");
    if (preenchimentoAether && textoAether) {
        porcentagem = Math.max(0, Math.min(102, porcentagem)); // Limite superior 102
        preenchimentoAether.style.width = `${(porcentagem / 102) * 100}%`;
        textoAether.textContent = `Aether: ${porcentagem}%`;
    }
}

// --- FUNÇÃO UTILITÁRIA PARA ARRASTAR JANELAS ---
function addDragEventsToWindow(janela) {
    let isDragging = false, startX, startY, offsetX, offsetY;

    // Tenta encontrar um cabeçalho para arrastar, ou usa a janela inteira
    const dragHandle = janela.querySelector('.janela-cabecalho-arrastavel') || janela; // Adicione a classe 'janela-cabecalho-arrastavel' aos cabeçalhos

    dragHandle.addEventListener('mousedown', (e) => {
        // Prevenir arrastar se o clique foi em um botão ou input dentro do cabeçalho
        if (e.target.closest('button, input, a, .no-drag')) return;

        isDragging = true;
        // Posição inicial do mouse em relação à viewport
        startX = e.clientX;
        startY = e.clientY;
        // Posição atual da janela (offsetLeft/Top pode ser relativo ao pai posicionado)
        // getBoundingClientRect().left/top é sempre relativo à viewport
        const rect = janela.getBoundingClientRect();
        offsetX = rect.left;
        offsetY = rect.top;
        
        janela.style.cursor = 'grabbing';
        // Para janelas filhas, pode ser útil trazer para frente
        // document.querySelectorAll('.janela-arrastavel-comum').forEach(j => j.style.zIndex = '990'); // Classe para todas as janelas arrastáveis
        // janela.style.zIndex = '999';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Nova posição do mouse
            const currentX = e.clientX;
            const currentY = e.clientY;
            // Diferença do movimento do mouse
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            // Nova posição da janela
            janela.style.left = `${offsetX + deltaX}px`;
            janela.style.top = `${offsetY + deltaY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            janela.style.cursor = 'move'; // Ou 'grab' se preferir
        }
    });
    // Inicializa o cursor
    dragHandle.style.cursor = 'move'; // Ou 'grab'
}

// Aplicar a todas as janelas de filhos, se existirem
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.janela-filho').forEach(addDragEventsToWindow);
    // Se as janelas de benção não estão dentro do DOMContentLoaded para os listeners:
    // document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow); 
    // As janelas de título já tem seu próprio sistema de drag
});


console.log("Script.js carregado e inicializado (com correções).");
