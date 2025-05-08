// =========================================================================
// SEU SCRIPT ORIGINAL COM OS LINKS DO GITHUB ATUALIZADOS PARA O REPOSITÓRIO 'Buffy'
// ATENÇÃO: ISTO NÃO É A SOLUÇÃO RECOMENDADA PARA PRODUÇÃO! USE CAMINHOS RELATIVOS!
// =========================================================================

// Buffy Música - Função para abrir e fechar a janela de música
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    if (janela) { // Adicionada verificação de null
        if (janela.style.display === 'none' || janela.style.display === '') {
            janela.style.display = 'block'; // Abre a janela
        } else {
            janela.style.display = 'none'; // Fecha a janela
        }
    }
}

// Carregar a seção da música e configurar o player
// ** Atenção: loadSection está definida duas vezes no final do seu script original. Usando a segunda definição que aceita callback. **
// A definição correta será movida para o topo para clareza.

// Função loadSection (Definição única movida para o topo)
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
                if (callback) {
                    try { callback(); } catch (e) { console.error(`Erro no callback de loadSection para ${id} (${url}):`, e); }
                }
            } else { console.error(`Elemento com ID '${id}' não encontrado para carregar ${url}.`); }
        })
        .catch(error => console.error(`Erro geral ao carregar a seção ${url} em #${id}:`, error));
}


loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
    const playerMusica = document.querySelector("#janelaMusica iframe"); // Assumindo que o iframe está em 1-Aura-Buffy.html
    if (playerMusica) {
        playerMusica.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
    } else {
        // console.warn("O elemento #janelaMusica iframe não foi encontrado após carregar secao-aura.");
    }
});

// Barra de Experiência
loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
    // console.log("Seção Barra de Experiência carregada!");
    setTimeout(() => {
        var progressBar = document.querySelector('#secao-bahdinheiro #expBar'); // Busca dentro da seção
        if (progressBar) {
            var percentage = 75;
            progressBar.style.width = percentage + '%';
            const containerDaBarra = progressBar.closest('.barra-exp-container');
            if (containerDaBarra) {
                var textSpan = containerDaBarra.querySelector('.barra-texto');
                if (textSpan) { textSpan.textContent = '1590 - ' + percentage + '%'; }
            }
        } else {
            // console.warn("Elemento '#expBar' não encontrado em secao-bahdinheiro.");
        }
    }, 500);
});

// Cabeçalho - Seção 03
loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html", function () {
    // console.log("Seção Cabeçalho carregada!");
});

// Classes - Texto retraído
loadSection("secao-classes", "Seções/5-Classes.html", function () {
    // console.log("Seção Classes carregada!");
    // A função mostrarTexto será chamada pelo onclick no HTML carregado aqui
});

function mostrarTexto() {
    const secaoClasses = document.getElementById('secao-classes');
    if (secaoClasses) {
        const expandido = secaoClasses.querySelector('.expandido');
        if (expandido) {
            expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
        } else {
           // console.warn("Elemento '.expandido' não encontrado dentro de #secao-classes.");
        }
    }
}

// Modo Empusa - Seção 06
loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function () {
    // console.log("Seção Modo Empusa carregada!");

    // Funções locais para garantir escopo e acesso aos elementos carregados
    function atualizarBarraLocal(idBarra, idTexto, porcentagem) {
        var progressBar = document.querySelector(`#secao-modoempusa #${idBarra}`);
        var textSpan = document.querySelector(`#secao-modoempusa #${idTexto}`);
        if (progressBar && textSpan) { progressBar.style.width = porcentagem + '%'; textSpan.textContent = porcentagem + '%'; }
    }
    function atualizarFomeLocal() {
        const sangueEl = document.querySelector("#secao-modoempusa #sangue-texto"); const vitalidadeEl = document.querySelector("#secao-modoempusa #vitalidade-texto");
        if (sangueEl && vitalidadeEl) {
            var sangue = parseInt(sangueEl.textContent) || 0; var vitalidade = parseInt(vitalidadeEl.textContent) || 0;
            var fomeTotal = Math.min(sangue + vitalidade, 100);
            atualizarBarraLocal("fomeBar", "fome-texto", fomeTotal);
        }
    }
    function toggleMenuLocal(seta) {
        var menu = seta.parentElement.nextElementSibling;
        if (menu && menu.classList.contains('empusa-menu')) {
            document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(m => { if (m !== menu) m.style.display = 'none'; });
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        }
    }
    function atualizarDorLocal(nivelDor) {
        nivelDor = Math.max(0, Math.min(nivelDor, 6));
        for (let i = 1; i <= 6; i++) {
            let coracao = document.querySelector(`#secao-modoempusa #coracao-${i}`);
            if (coracao) coracao.textContent = (i <= nivelDor) ? "💜" : "🤍";
        }
    }
     function atualizarSatisfacaoLocal(idContainer, idPrefixo, nivelSatisfacao) {
        nivelSatisfacao = Math.max(1, Math.min(nivelSatisfacao, 6));
        let container = document.querySelector(`#secao-modoempusa #${idContainer}`); if (!container) return;
        container.querySelectorAll('.emoji-satisfacao').forEach(emoji => emoji.classList.remove('emoji-selecionado'));
        let emojiSelecionado = document.querySelector(`#secao-modoempusa #${idPrefixo}-${nivelSatisfacao}`);
        if (emojiSelecionado) emojiSelecionado.classList.add('emoji-selecionado');
    }

    setTimeout(() => {
        atualizarBarraLocal("prazerBar", "prazer-texto", 99);
        atualizarBarraLocal("amorBar", "amor-texto", 100);
        atualizarBarraLocal("sangueBar", "sangue-texto", 47);
        atualizarBarraLocal("vitalidadeBar", "vitalidade-texto", 100);
        atualizarFomeLocal();
        atualizarDorLocal(1);
        atualizarSatisfacaoLocal("satisfacao-container", "satisfacao", 5);
        document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(seta => {
            seta.addEventListener('click', function () { toggleMenuLocal(this); });
        });
    }, 500);
});

// Modo Empusa Alvo - Seção 07
loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function () {
    // console.log("Seção Modo Empusa - Alvo carregada!");

    // Funções locais
    function atualizarBarraAlvoLocal(idBarra, idTexto, porcentagem) {
        var progressBar = document.querySelector(`#secao-modoempusa-alvo #${idBarra}`); var textSpan = document.querySelector(`#secao-modoempusa-alvo #${idTexto}`);
        if (progressBar && textSpan) { progressBar.style.width = porcentagem + '%'; textSpan.textContent = porcentagem + '%'; }
    }
    function atualizarDorAlvoLocal(nivelDor) {
        nivelDor = Math.max(0, Math.min(nivelDor, 6));
        for (let i = 1; i <= 6; i++) {
            let coracao = document.querySelector(`#secao-modoempusa-alvo #coracao-alvo-${i}`);
            if (coracao) coracao.textContent = i <= nivelDor ? "💜" : "🤍";
        }
    }
    function atualizarSatisfacaoAlvoLocal(idContainer, idPrefixo, nivelSatisfacao) {
        nivelSatisfacao = Math.max(1, Math.min(nivelSatisfacao, 6));
        let container = document.querySelector(`#secao-modoempusa-alvo #${idContainer}`); if (!container) return;
        container.querySelectorAll('.emoji-satisfacao').forEach(emoji => emoji.classList.remove('emoji-selecionado'));
        let emojiSelecionado = document.querySelector(`#secao-modoempusa-alvo #${idPrefixo}-${nivelSatisfacao}`);
        if (emojiSelecionado) emojiSelecionado.classList.add('emoji-selecionado');
    }
    function atualizarDominanciaLocal(porcentagem) {
        porcentagem = Math.max(0, Math.min(porcentagem, 100));
        let preenchimento = document.querySelector("#secao-modoempusa-alvo #dominanciaBar");
        let emoji = document.querySelector("#secao-modoempusa-alvo #dominancia-emoji");
        if (preenchimento && emoji) {
            preenchimento.style.background = `linear-gradient(to right, #ff12a9 0%, #ff12a9 ${Math.max(0, porcentagem - 5)}%, #a020f0 ${porcentagem}%, #1e90ff ${Math.min(100, porcentagem + 5)}%, #1e90ff 100%)`;
            emoji.style.left = `calc(${porcentagem}% - 15px)`;
        }
    }

    setTimeout(() => {
        atualizarBarraAlvoLocal("prazerBarAlvo", "prazer-texto-alvo", 98);
        atualizarBarraAlvoLocal("amorBarAlvo", "amor-texto-alvo", 100);
        atualizarBarraAlvoLocal("volumeBarAlvo", "volume-texto-alvo", 5);
        atualizarBarraAlvoLocal("vitalidadeBarAlvo", "vitalide-texto-alvo", 21); // Manteve ID original
        atualizarDorAlvoLocal(3);
        atualizarSatisfacaoAlvoLocal("satisfacao-container-alvo", "satisfacao-alvo", 5);
        atualizarDominanciaLocal(73);
    }, 500);
});

// Caracteristicas (No index.html)
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if (detalhes) { detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none'; }
}

// Estado Civil (No index.html)
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

// Player de Música Isaac (No index.html)
let playerMusicaIsaacGlob, audioGlob, audioSourceGlob, progressBarGlob, tempoAtualGlob, tempoTotalGlob;
let musicaTocandoGlob = false; // Renomeado para clareza

const listaDeMusicasIsaac = [ // Renomeado para clareza
    {
        id: 1,
        nome: "Crying Alone / Nowhere",
        autor: "Kurae Radiânthia Pendragon Isaac",
        // !!! SUBSTITUINDO APENAS O REPOSITÓRIO NO LINK - ISTO NÃO É O IDEAL !!!
        capa: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true", // <-- MUDOU PARA Buffy
        background: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true", // <-- MUDOU PARA Buffy
        link: "assets/CryingAlone-Nowhere.mp3", // Este já era relativo, MANTENHA NO SEU PROJETO
    }
];
const storageKeyIsaac = 'musicasFavoritadasIsaac'; // Renomeado
let musicasFavoritadasIsaac = JSON.parse(localStorage.getItem(storageKeyIsaac)) || {}; // Renomeado

function togglePlayerMusicaIsaac() {
    const player = playerMusicaIsaacGlob; // Usar a variável global inicializada no DOMContentLoaded
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if (!player) return; // Sai se o player não foi encontrado

    if (player.style.display === 'none' || player.style.display === '') {
        player.style.display = 'flex';
        if (estadoCivil) estadoCivil.style.zIndex = '900';
        centralizarElementosPlayerIsaac(); // Renomeado
        if (audioGlob && !audioGlob.currentSrc && listaDeMusicasIsaac.length > 0) {
            selecionarMusicaIsaac(listaDeMusicasIsaac[0].id); // Renomeado
        } else if (audioGlob && audioGlob.paused) {
             playPause(); // Tenta tocar se estava pausado
        }
    } else {
        player.style.display = 'none';
        if (estadoCivil) estadoCivil.style.zIndex = '1000';
        // Pausar é gerenciado pelo fecharPlayer ou playPause
    }
}

function fecharPlayer() { // Nome original
    const player = playerMusicaIsaacGlob;
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if (player) player.style.display = 'none';
    if (estadoCivil) estadoCivil.style.zIndex = '1000';
    if (audioGlob) audioGlob.pause(); // Evento 'pause' atualiza o estado
}

function centralizarElementosPlayerIsaac() { // Renomeado
    const player = playerMusicaIsaacGlob;
    const capaMusica = player ? player.querySelector('.capa-musica-isaac') : null;
    if (capaMusica && player) {
        capaMusica.style.margin = 'auto';
        player.style.display = 'flex'; player.style.flexDirection = 'column';
        player.style.alignItems = 'center'; player.style.justifyContent = 'space-between';
    }
}

function selecionarMusicaIsaac(id) { // Renomeado
    const musicaSelecionada = listaDeMusicasIsaac.find((musica) => musica.id === id);
    if (!audioGlob || !audioSourceGlob || !playerMusicaIsaacGlob) return;
    if (musicaSelecionada) {
        const nomeEl = playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');
        const autorEl = playerMusicaIsaacGlob.querySelector('.autor-musica-isaac');
        const capaImgEl = playerMusicaIsaacGlob.querySelector('.capa-musica-isaac img');
        if (nomeEl) nomeEl.textContent = musicaSelecionada.nome;
        if (autorEl) autorEl.textContent = musicaSelecionada.autor;
        if (capaImgEl) {
            capaImgEl.src = musicaSelecionada.capa; // Usa o link do GitHub atualizado
            capaImgEl.onerror = () => { capaImgEl.src='assets/Imagens Isaac/default_capa.png'; console.error(`Erro capa: ${musicaSelecionada.capa}`);}
        }
        playerMusicaIsaacGlob.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${musicaSelecionada.background}')`; // Usa link GitHub atualizado
        audioSourceGlob.src = musicaSelecionada.link;
        audioGlob.load();
        atualizarFavoritoVisualIsaac(id); // Renomeado
        // Não dar play aqui, deixar o playPause gerenciar
    }
}

function toggleLista() { // Nome original
    const lista = document.getElementById('listaMusicas');
    if (lista) lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
}

function atualizarFavoritoVisualIsaac(id) { // Renomeado
    const botaoFavoritar = playerMusicaIsaacGlob ? playerMusicaIsaacGlob.querySelector('.botao-favoritar-isaac') : null;
    if (botaoFavoritar) {
        if (musicasFavoritadasIsaac[id]) { botaoFavoritar.classList.add('favoritado'); botaoFavoritar.textContent = '💖'; }
        else { botaoFavoritar.classList.remove('favoritado'); botaoFavoritar.textContent = '🤍'; }
    }
}

function favoritarMusica() { // Nome original
    if (!playerMusicaIsaacGlob) return;
    const nomeMusicaAtualEl = playerMusicaIsaacGlob.querySelector('.nome-musica-isaac');
    if (nomeMusicaAtualEl && nomeMusicaAtualEl.textContent) {
        const musicaAtual = listaDeMusicasIsaac.find((musica) => musica.nome === nomeMusicaAtualEl.textContent);
        if (musicaAtual) {
            musicasFavoritadasIsaac[musicaAtual.id] = !musicasFavoritadasIsaac[musicaAtual.id];
            if (!musicasFavoritadasIsaac[musicaAtual.id]) delete musicasFavoritadasIsaac[musicaAtual.id];
            atualizarFavoritoVisualIsaac(musicaAtual.id); // Renomeado
            localStorage.setItem(storageKeyIsaac, JSON.stringify(musicasFavoritadasIsaac));
        }
    }
}

function retroceder10s() { // Nome original
    if (audioGlob && !isNaN(audioGlob.duration)) { audioGlob.currentTime = Math.max(0, audioGlob.currentTime - 10); }
}

function avancar10s() { // Nome original
    if (audioGlob && !isNaN(audioGlob.duration)) { audioGlob.currentTime = Math.min(audioGlob.duration, audioGlob.currentTime + 10); }
}

function playPause() { // Nome original
    if (!audioGlob) return;
    if (!audioGlob.currentSrc && listaDeMusicasIsaac.length > 0) {
        selecionarMusicaIsaac(listaDeMusicasIsaac[0].id); // Renomeado
        // Tenta dar play após selecionar
         audioGlob.play().catch(e => console.warn("Play inicial bloqueado.", e));
         // O estado musicaTocandoGlob será atualizado pelo evento 'play'
         return;
    }
    if (musicaTocandoGlob) { // Usa a variável global correta
        audioGlob.pause();
    } else {
        audioGlob.play().catch(e => console.warn("Play bloqueado.", e));
    }
    // Deixar os eventos 'play' e 'pause' atualizarem musicaTocandoGlob e o botão
}

function atualizarBotaoPlayIsaac() { // Renomeado para clareza interna
    const botaoPlay = playerMusicaIsaacGlob ? playerMusicaIsaacGlob.querySelector('.botao-controle-isaac:nth-child(2)') : null;
    if (botaoPlay) { botaoPlay.textContent = musicaTocandoGlob ? 'II' : '►'; }
}

function formatarTempo(segundos) {
    if (isNaN(segundos) || !isFinite(segundos) || segundos < 0) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = Math.floor(segundos % 60);
    return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
}

function atualizarListaMusicasIsaac() { // Renomeado
    const listaContainer = document.getElementById('listaMusicas');
    if (listaContainer) {
        listaContainer.innerHTML = '';
        listaDeMusicasIsaac.forEach((musica) => {
            const item = document.createElement('p');
            item.textContent = musica.nome;
            item.addEventListener('click', () => {
                selecionarMusicaIsaac(musica.id); // Renomeado
                audioGlob.play().catch(e => console.warn("Play da lista bloqueado", e));
            });
            listaContainer.appendChild(item);
        });
    }
}

// Fama/Moral - Barra de Progresso e Estado (No index.html)
function atualizarBarraStatusGeral(idBarra, idTexto, porcentagem, idStatus = null) { // Renomeada para evitar conflito com a local de Modo Empusa
    const barra = document.getElementById(idBarra); const texto = document.getElementById(idTexto);
    if (!barra || !texto) return;
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

// Títulos - Carrossel Automático (No index.html)
let carrosselTitulosInterval; // Renomeado
let pausarCarrosselTitulosFunc, iniciarCarrosselTitulosFunc;

function abrirJanelaTitulo(id) {
    if (typeof pausarCarrosselTitulosFunc === 'function') pausarCarrosselTitulosFunc();
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.style.display = 'block';
}
function fecharJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) {
        janela.style.display = 'none';
        if (typeof iniciarCarrosselTitulosFunc === 'function') iniciarCarrosselTitulosFunc();
    }
}
function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
    if (janela) janela.classList.toggle('janela-expandida');
}

// Movimentação manual das janelas de Títulos (no index.html)
function addDragEventsToWindow(janela) { /* ...código da função addDragEventsToWindow... */
    let isDragging = false, dragStartX, dragStartY, initialLeft, initialTop;
    const dragHandle = janela.querySelector('.janela-cabecalho-arrastavel') || janela.querySelector('.janela-botoes') || janela;
    if (!dragHandle) return;
    dragHandle.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, a, .no-drag')) return;
        isDragging = true; dragStartX = e.clientX; dragStartY = e.clientY;
        initialLeft = janela.offsetLeft; initialTop = janela.offsetTop;
        janela.style.cursor = 'grabbing'; janela.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const deltaX = e.clientX - dragStartX; const deltaY = e.clientY - dragStartY;
            janela.style.left = `${initialLeft + deltaX}px`; janela.style.top = `${initialTop + deltaY}px`;
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false; janela.style.cursor = 'move'; janela.style.userSelect = '';
        }
    });
    dragHandle.style.cursor = 'move'; janela.classList.add('janela-arrastavel');
}

// Atributos (No index.html)
function toggleCheckbox(element) { // Nome original
    element.classList.toggle("checked");
}
function atualizarAtributoAtual(atributo, total, porcentagem) {
    const valorAtual = Math.floor((porcentagem / 100) * total);
    const textoEl = document.getElementById(`texto-${atributo}`);
    const barraEl = document.getElementById(`barra-${atributo}`);
    if(textoEl) textoEl.innerText = `${valorAtual} / ${total}`;
    if(barraEl) barraEl.style.width = `${porcentagem}%`;
}
const atributosData = { // Renomeado
    hp: { total: 4910210, porcentagem: 100 }, mp: { total: 823691, porcentagem: 100 },
    agi: { total: 637369, porcentagem: 100 }, def: { total: 1476557, porcentagem: 100 },
    res: { total: 1331048, porcentagem: 100 }, spd: { total: 1020989, porcentagem: 100 },
    int: { total: 431815, porcentagem: 100 }, atk: { total: 2075839, porcentagem: 100 },
    smp: { total: 291363290, porcentagem: 99.17 }, unknown: { total: 100, porcentagem: 50 }
};

// Selos (No index.html)
let chaveAtualSelos = 0; // Renomeado
const selosChavesData = [ // Renomeado e com links ATUALIZADOS (AINDA PRECISA VERIFICAR!)
    { id: 0, nome: "Key of Souls", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true", // <-- MUDOU
      efeito: "...", icone: "https://imgur.com/zHQo8sh.png", detalhes: "..."},
    { id: 1, nome: "Key of Dreams", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true", // <-- MUDOU
      efeito: "...", icone: "https://imgur.com/lKXdgwT.png", detalhes: "..."},
    { id: 2, nome: "Key of Infinite Moon Mansion", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true", // <-- MUDOU
      efeito: "...", icone: "https://imgur.com/Hf705GX.png", detalhes: "..."},
    { id: 3, nome: "Key of Desires", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true", // <-- MUDOU
      efeito: "...", icone: "https://imgur.com/L2bLSl2.png", detalhes: "..."},
    { id: 4, nome: "Key of Soul World", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true", // <-- MUDOU
      efeito: "...", icone: "https://imgur.com/X1zPnlJ.png", detalhes: "..."},
    { id: 5, nome: "Key of Pendragon", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true", // <-- MUDOU (era relativo antes?)
      efeito: "...", icone: "assets/Recursos/Key of Pendragon.png", // Manteve relativo
      detalhes: "..."},
    { id: 6, nome: "Key Pinnacle of Flames", descricao: "...",
      item: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20Pinnacle%20of%20Flames.png?raw=true", // <-- MUDOU
      efeito: "...", icone: "https://imgur.com/46Dh8W2.png", detalhes: "..."},
    { id: 7, nome: "Key of Isaac's Heart", descricao: "...",
      item: "assets/Recursos/Key of Isaac's Heart.png", // Manteve relativo
      efeito: "...", icone: "https://github.com/PrinnyXII/Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true", // <-- MUDOU (era icone relativo antes?)
      detalhes: "..."},
];
const selosEstadosIniciais = { circulo1: true, circulo2: false, circulo3: true, circulo4: false, circulo5: true, circulo6: false, circulo7: true, circulo8: false };

function navegar(direcaoOuIndice) { // Nome original
    if (typeof direcaoOuIndice === 'number' && direcaoOuIndice >= 0 && direcaoOuIndice < selosChavesData.length) { chaveAtualSelos = direcaoOuIndice; }
    else if (typeof direcaoOuIndice === 'number') { chaveAtualSelos = (chaveAtualSelos + direcaoOuIndice + selosChavesData.length) % selosChavesData.length; }
    else { return; }
    const chave = selosChavesData[chaveAtualSelos]; if (!chave) return;
    const titItem = document.getElementById("titulo-item"); const descDet = document.querySelector("#retangulo-item .descricao-detalhada");
    const itemImg = document.querySelector("#retangulo-item .item-imagem img"); const titEft = document.querySelector("#retangulo-efeitos .titulo-efeito");
    const iconeEft = document.querySelector("#retangulo-efeitos img"); const detEft = document.querySelector("#retangulo-efeitos .detalhes-detalhados");
    if(titItem) titItem.textContent = chave.nome; if(descDet) descDet.textContent = chave.descricao;
    if(itemImg) { itemImg.src = chave.item; itemImg.onerror=()=>{itemImg.src='assets/Recursos/default_key.png'; console.error(`Erro item selo: ${chave.item}`);} }
    if(titEft) titEft.textContent = chave.efeito;
    if(iconeEft) { iconeEft.src = chave.icone; iconeEft.onerror=()=>{iconeEft.src='assets/Recursos/default_icon.png'; console.error(`Erro icone selo: ${chave.icone}`);} }
    if(detEft) detEft.textContent = chave.detalhes;
    atualizarDestaqueCirculoSelos(chaveAtualSelos);
}
function atualizarDestaqueCirculoSelos(indiceAtivo) {
    document.querySelectorAll(".circulo-pequeno").forEach((c, i) => { c.style.boxShadow = (i === indiceAtivo) ? "0 0 10px 3px #FFD700" : "none"; });
}
function toggleCirculo1(){const c=document.getElementById('circulo1');if(c)c.classList.toggle('ativo');} function toggleCirculo2(){const c=document.getElementById('circulo2');if(c)c.classList.toggle('ativo');}
function toggleCirculo3(){const c=document.getElementById('circulo3');if(c)c.classList.toggle('ativo');} function toggleCirculo4(){const c=document.getElementById('circulo4');if(c)c.classList.toggle('ativo');}
function toggleCirculo5(){const c=document.getElementById('circulo5');if(c)c.classList.toggle('ativo');} function toggleCirculo6(){const c=document.getElementById('circulo6');if(c)c.classList.toggle('ativo');}
function toggleCirculo7(){const c=document.getElementById('circulo7');if(c)c.classList.toggle('ativo');} function toggleCirculo8(){const c=document.getElementById('circulo8');if(c)c.classList.toggle('ativo');}
function ativarChave() { // Placeholder - Implementar lógica
    const chave = selosChavesData[chaveAtualSelos]; if(chave) alert(`Ativando: ${chave.nome}`);
}

// Bençãos e Maldições (No index.html)
let posicaoCarrosselBencaos = 0; // Renomeado
function moverCarrossel(direcao) { // Nome original
    const car = document.querySelector('.carrossel-diamantes'); if (!car) return;
    const its = car.querySelectorAll('.diamante-item'); if (its.length === 0) return;
    its.forEach(i => i.classList.remove('ativo'));
    posicaoCarrosselBencaos = (posicaoCarrosselBencaos + direcao + its.length) % its.length;
    if (its[posicaoCarrosselBencaos]) {
        its[posicaoCarrosselBencaos].classList.add('ativo');
        const tItem = its[posicaoCarrosselBencaos].offsetWidth + 10;
        const scrollT = (posicaoCarrosselBencaos * tItem) - (car.offsetWidth / 2) + (tItem / 2);
        car.scrollTo({ left: scrollT, behavior: 'smooth' });
    }
}
function abrirJanela(idJanela) { // Nome original
    const j = document.getElementById(idJanela); if (j) j.style.display = 'block';
}
function fecharJanela(idJanela) { // Nome original
    const j = document.getElementById(idJanela); if (j) j.style.display = 'none';
}
function expandirJanela(idJanela) { // Nome original
    const j = document.getElementById(idJanela); if (j) j.classList.toggle('janela-expandida');
}

// Barra EA (No index.html)
function atualizarEA(porcentagem) {
    const b = document.getElementById('preenchimento-ea'); const t = document.getElementById('texto-ea');
    if (b && t) {
        porcentagem = Math.max(0, Math.min(100, porcentagem));
        b.style.width = `${porcentagem}%`; t.textContent = `EA: ${porcentagem}%`;
    }
}

// Filhos (No index.html) - Funções abrir/fechar/expandir são genéricas
// Se precisar de nomes específicos, use:
// function abrirJanelaFilho(id) { abrirJanela(`janelaFilho${id}`); }
// function fecharJanelaFilho(id) { fecharJanela(`janelaFilho${id}`); }
// function expandirJanelaFilho(id) { expandirJanela(`janelaFilho${id}`); }

// Necessidades Básicas e Temporárias (No index.html)
function atualizarStatusBasicas(gId, perc) {
    const fb = document.getElementById(`barra-progresso-${gId}`); const pt = document.getElementById(`progresso-texto-${gId}`); const si = document.getElementById(`estado-${gId}`);
    if (fb && pt && si) {
        fb.style.width = `${perc}%`; pt.textContent = `${perc}%`; let clr = '', sts = '';
        if (perc <= 0) { clr = '#00B59B'; sts = 'Nulo'; } else if (perc <= 5) { clr = 'darkred'; sts = 'Crítico'; }
        else if (perc <= 30) { clr = 'red'; sts = 'Baixo'; } else if (perc <= 60) { clr = '#FFAA00'; sts = 'Moderado'; }
        else if (perc <= 95) { clr = 'green'; sts = 'Bom'; } else if (perc <= 100) { clr = '#00B59B'; sts = 'Excelente'; }
        else { clr = '#6222EF'; sts = 'Insano'; }
        fb.style.backgroundColor = clr; si.textContent = sts;
    }
}
function atualizarStatusTemporarias(gId, perc) {
    const fb = document.getElementById(`barra-progresso-${gId}`); const pt = document.getElementById(`progresso-texto-${gId}`); const si = document.getElementById(`estado-${gId}`);
    if (fb && pt && si) {
        fb.style.width = `${perc}%`; pt.textContent = `${perc}%`; let clr = '', sts = '';
        if (perc <= 0) { clr = '#00B59B'; sts = 'Nulo'; } else if (perc <= 5) { clr = '#00B59B'; sts = 'Muito Baixo'; }
        else if (perc <= 30) { clr = 'green'; sts = 'Baixo'; } else if (perc <= 60) { clr = '#FFAA00'; sts = 'Moderado'; }
        else if (perc <= 95) { clr = 'red'; sts = 'Alto'; } else { clr = 'darkred'; sts = 'Crítico'; }
        fb.style.backgroundColor = clr; si.textContent = sts;
    }
}

// Aether (No index.html)
let porcentagemAether = 101;
function atualizarAether(perc) {
    if (perc > 102) perc = 102; if (perc < 0) perc = 0;
    const pa = document.getElementById("preenchimentoAether"); const ta = document.getElementById("textoAether");
    if(pa) pa.style.width = `${(perc / 102) * 100}%`;
    if(ta) ta.textContent = `Aether: ${perc}%`;
}

// =========================================================================
// CÓDIGO QUE RODA APÓS O DOM ESTAR COMPLETAMENTE CARREGADO (DOMContentLoaded)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // Inicializa variáveis globais para o player de música Isaac
    playerMusicaIsaacGlob = document.getElementById('playerMusicaIsaac');
    if (playerMusicaIsaacGlob) {
        audioGlob = playerMusicaIsaacGlob.querySelector('#audio-player');
        if (audioGlob) { audioSourceGlob = audioGlob.querySelector('source'); }
        progressBarGlob = playerMusicaIsaacGlob.querySelector('#progress-bar');
        tempoAtualGlob = playerMusicaIsaacGlob.querySelector('#tempo-atual');
        tempoTotalGlob = playerMusicaIsaacGlob.querySelector('#tempo-total');

        // Adiciona listeners de eventos internos do player
        if (progressBarGlob && audioGlob) {
            progressBarGlob.addEventListener('input', () => {
                if (audioGlob && !isNaN(audioGlob.duration) && isFinite(audioGlob.duration) && audioGlob.duration > 0) {
                    audioGlob.currentTime = (progressBarGlob.value / 100) * audioGlob.duration;
                }
            });
        }
        if (audioGlob) {
            audioGlob.addEventListener('timeupdate', () => {
                if (tempoAtualGlob && !isNaN(audioGlob.currentTime)) tempoAtualGlob.textContent = formatarTempo(audioGlob.currentTime);
                if (progressBarGlob && audioGlob.duration && !isNaN(audioGlob.duration) && audioGlob.duration > 0) progressBarGlob.value = (audioGlob.currentTime / audioGlob.duration) * 100;
            });
            audioGlob.addEventListener('loadedmetadata', () => {
                 if (tempoTotalGlob && !isNaN(audioGlob.duration) && audioGlob.duration > 0) tempoTotalGlob.textContent = formatarTempo(audioGlob.duration);
                 else if(tempoTotalGlob) tempoTotalGlob.textContent = "0:00";
            });
            audioGlob.addEventListener('ended', () => { musicaTocandoGlob = false; atualizarBotaoPlayIsaac(); });
            audioGlob.addEventListener('play', () => { musicaTocandoGlob = true; atualizarBotaoPlayIsaac(); });
            audioGlob.addEventListener('pause', () => { musicaTocandoGlob = false; atualizarBotaoPlayIsaac(); });
        }

        // Carrega a lista de músicas e atualiza o botão inicial
        if (document.getElementById('listaMusicas')) {
            atualizarListaMusicasIsaac(); // Renomeado
            document.getElementById('listaMusicas').style.display = 'none';
            atualizarBotaoPlayIsaac(); // Renomeado
        }
    } // Fim do if(playerMusicaIsaacGlob)


    // Chama as funções de atualização para elementos que estão no index.html
    atualizarBarraStatusGeral('barra-autoestima', 'texto-autoestima', 98); // Renomeada
    atualizarBarraStatusGeral('barra-fama', 'texto-fama', 97, 'status-fama'); // Renomeada

    // Configura o carrossel de títulos
    const carrosselTitulosEl = document.querySelector('.carrossel-titulos .carrossel-imagens');
    const carrosselContainerTitulosEl = document.querySelector('.carrossel-titulos');
    function iniciarCarrosselTitulosLocal() {
        if (!carrosselTitulosEl) return; clearInterval(carrosselTitulosInterval); // Usa a var global correta
        carrosselTitulosInterval = setInterval(() => { // Usa a var global correta
            if(!carrosselTitulosEl) { clearInterval(carrosselTitulosInterval); return; }
            carrosselTitulosEl.scrollLeft += 1;
            if (carrosselTitulosEl.scrollLeft >= carrosselTitulosEl.scrollWidth - carrosselTitulosEl.offsetWidth -1) carrosselTitulosEl.scrollLeft = 0;
        }, 30);
    }
    function pausarCarrosselTitulosLocal() { clearInterval(carrosselTitulosInterval); } // Usa a var global correta
    pausarCarrosselTitulosFunc = pausarCarrosselTitulosLocal;
    iniciarCarrosselTitulosFunc = iniciarCarrosselTitulosLocal;

    if (carrosselTitulosEl && carrosselContainerTitulosEl) {
        iniciarCarrosselTitulosLocal();
        carrosselContainerTitulosEl.addEventListener('mouseover', pausarCarrosselTitulosLocal);
        carrosselContainerTitulosEl.addEventListener('mouseout', iniciarCarrosselTitulosLocal);
    }
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow);

    // Atualiza atributos
    for (let atributo in atributosData) {
        atualizarAtributoAtual(atributo, atributosData[atributo].total, atributosData[atributo].porcentagem);
    }

    // Inicializa selos
    for (const [id, ativo] of Object.entries(selosEstadosIniciais)) {
        const circulo = document.getElementById(id);
        if (circulo) { if (ativo) circulo.classList.add('ativo'); else circulo.classList.remove('ativo'); }
    }
     document.querySelectorAll("#retangulo-item .titulo-item, #retangulo-efeitos .titulo-efeito, #retangulo-item .descricao-detalhada, #retangulo-efeitos .detalhes-detalhados")
        .forEach(el => { if(el) el.contentEditable = "false"; });
    if (document.getElementById("titulo-item")) { navegar(0); } // Chama navegar original

    // Inicializa carrossel de bênçãos
    const diamantesCarrossel = document.querySelectorAll('.carrossel-diamantes .diamante-item');
    if (diamantesCarrossel.length > 0) {
        posicaoCarrosselBencaos = Math.floor(diamantesCarrossel.length / 2);
        if (diamantesCarrossel[posicaoCarrosselBencaos]) { diamantesCarrossel[posicaoCarrosselBencaos].classList.add('ativo'); }
        moverCarrossel(0); // Chama moverCarrossel original
    }
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);

    // Atualiza barra EA
    atualizarEA(86);

    // Atualiza necessidades básicas
    atualizarStatusBasicas('grupo-higiene', 97); atualizarStatusBasicas('grupo-banheiro', 100); atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 100); atualizarStatusBasicas('grupo-sede', 100); atualizarStatusBasicas('grupo-diversao', 101);
    atualizarStatusBasicas('grupo-social', 78); atualizarStatusBasicas('grupo-foco', 64);
    atualizarStatusBasicas('grupo-felicidade', 101); atualizarStatusBasicas('grupo-tesao', 101);
    atualizarStatusBasicas('grupo-desgaste', 0);
    // Atualiza necessidades temporárias
    atualizarStatusTemporarias('grupo-enjoo', 0); atualizarStatusTemporarias('grupo-fadiga', 0); atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0); atualizarStatusTemporarias('grupo-medo', 0);
    atualizarStatusTemporarias('grupo-tedio', 0); atualizarStatusTemporarias('grupo-raiva', 0);
    // Nenhuma necessidade temporária de desgaste no HTML

    // Atualiza Aether
    atualizarAether(porcentagemAether); // Usa a variável global

    // Adiciona drag às janelas de filhos e estado civil
    document.querySelectorAll('.janela-filhos, #janelaEstadoCivil').forEach(addDragEventsToWindow);


    // Carrega as seções dinâmicas
    // (O código de loadSection já está no topo)

    console.log("Script.js: DOMContentLoaded concluído.");
}); // FIM DO DOMContentLoaded

console.log("Script.js totalmente carregado (vOriginal com links GitHub atualizados).");
