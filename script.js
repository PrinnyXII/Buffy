    // Buffy Música - Função para abrir e fechar a janela de música
    function toggleJanelaMusica() {
        const janela = document.getElementById('janelaMusica');
        // Adicionando verificação simples para evitar erro se 'janela' for null
        if (janela) {
            if (janela.style.display === 'none' || janela.style.display === '') {
                janela.style.display = 'block'; // Abre a janela
            } else {
                janela.style.display = 'none'; // Fecha a janela
            }
        } else {
             console.error("Elemento #janelaMusica não encontrado para toggle.");
        }
    }

   

    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
        // Procura o iframe DENTRO da seção carregada
        const playerMusica = document.querySelector("#secao-aura #janelaMusica iframe");
        if (playerMusica) {
            playerMusica.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
        } else {
            // console.warn("O elemento #janelaMusica iframe não foi encontrado dentro de #secao-aura.");
        }
    });

    // Barra de Experiência
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
        // console.log("Seção Barra de Experiência carregada!");
        setTimeout(() => {
            // Procura a barra DENTRO da seção carregada
            var progressBar = document.querySelector('#secao-bahdinheiro #expBar');
            if (progressBar) {
                var percentage = 75; // Atualiza bara EXP
                progressBar.style.width = percentage + '%';

                // Procura o texto relativo à barra encontrada
                var containerDaBarra = progressBar.closest('.barra-exp-container'); // Tenta encontrar o container
                var textSpan = containerDaBarra ? containerDaBarra.querySelector('.barra-texto') : null; // Procura dentro do container
                if (textSpan) {
                    textSpan.textContent = '1590 - ' + percentage + '%';
                } else {
                    // console.warn("Elemento '.barra-texto' não encontrado relativo a #expBar em #secao-bahdinheiro.");
                }
            } else {
                // console.error("Elemento '#expBar' não encontrado dentro de #secao-bahdinheiro.");
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
        // A função mostrarTexto será chamada pelo onclick no HTML carregado
    });

    function mostrarTexto() {
        // Tenta encontrar o elemento .expandido DEPOIS que a seção foi carregada
        const secaoClasses = document.getElementById('secao-classes');
        const expandido = secaoClasses ? secaoClasses.querySelector('.expandido') : null;
        if (expandido) {
            expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
        } else {
           // console.error("Elemento '.expandido' não encontrado (talvez a seção não carregou ou não contém o elemento).");
        }
    }

    // Modo Empusa - Seção 06
    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function () {
       // console.log("Seção Modo Empusa carregada!");
       setTimeout(() => {
            // Funções definidas localmente no callback para garantir acesso aos elementos da seção
            function atualizarBarraLocal(idB, idT, p) {var pb=document.querySelector(`#secao-modoempusa #${idB}`);var ts=document.querySelector(`#secao-modoempusa #${idT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}
            function atualizarFomeLocal() {const s=document.querySelector("#secao-modoempusa #sangue-texto");const v=document.querySelector("#secao-modoempusa #vitalidade-texto");if(s&&v){var sg=parseInt(s.textContent)||0;var vt=parseInt(v.textContent)||0;var ft=Math.min(sg+vt,100);atualizarBarraLocal("fomeBar","fome-texto",ft);}}
            function toggleMenuLocal(st){var m=st.parentElement.nextElementSibling;if(m&&m.classList.contains('empusa-menu')){document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(i=>{if(i!==m)i.style.display='none';});m.style.display=(m.style.display==='block')?'none':'block';}}
            function atualizarDorLocal(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa #coracao-${i}`);if(c)c.textContent=(i<=nD)?"💜":"🤍";}}
            function atualizarSatisfacaoLocal(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}

            // Atualiza as barras individuais
            atualizarBarraLocal("prazerBar", "prazer-texto", 99);
            atualizarBarraLocal("amorBar", "amor-texto", 100);
            atualizarBarraLocal("sangueBar", "sangue-texto", 47);
            atualizarBarraLocal("vitalidadeBar", "vitalidade-texto", 100);
            atualizarFomeLocal();
            atualizarDorLocal(1);
            atualizarSatisfacaoLocal("satisfacao-container", "satisfacao", 5);

            // Adiciona o evento de clique para todas as setas do menu DENTRO da seção
            document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(seta => {
                seta.addEventListener('click', function () { toggleMenuLocal(this); });
            });

       }, 500);
    });

    // Modo Empusa Alvo - Seção 07
    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function () {
       // console.log("Seção Modo Empusa - Alvo carregada!");
       setTimeout(() => {
            // Funções locais
            function aBAL(iB,iT,p){var pb=document.querySelector(`#secao-modoempusa-alvo #${iB}`);var ts=document.querySelector(`#secao-modoempusa-alvo #${iT}`);if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';}}
            function aDAL(nD){nD=Math.max(0,Math.min(nD,6));for(let i=1;i<=6;i++){let c=document.querySelector(`#secao-modoempusa-alvo #coracao-alvo-${i}`);if(c)c.textContent=i<=nD?"💜":"🤍";}}
            function aSAL(iC,iP,nS){nS=Math.max(1,Math.min(nS,6));let cont=document.querySelector(`#secao-modoempusa-alvo #${iC}`);if(!cont)return;cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado'));let emS=document.querySelector(`#secao-modoempusa-alvo #${iP}-${nS}`);if(emS)emS.classList.add('emoji-selecionado');}
            function aDoL(p){p=Math.max(0,Math.min(p,100));let pre=document.querySelector("#secao-modoempusa-alvo #dominanciaBar");let emo=document.querySelector("#secao-modoempusa-alvo #dominancia-emoji");if(pre&&emo){pre.style.background=`linear-gradient(to right,#ff12a9 0%,#ff12a9 ${Math.max(0,p-5)}%,#a020f0 ${p}%,#1e90ff ${Math.min(100,p+5)}%,#1e90ff 100%)`;emo.style.left=`calc(${p}% - 15px)`;}}

            aBAL("prazerBarAlvo","prazer-texto-alvo",98);aBAL("amorBarAlvo","amor-texto-alvo",100);aBAL("volumeBarAlvo","volume-texto-alvo",5);aBAL("vitalidadeBarAlvo","vitalide-texto-alvo",21);
            aDAL(3);aSAL("satisfacao-container-alvo","satisfacao-alvo",5);aDoL(73);
       }, 500);
    });

    // Caracteristicas
    function toggleProfissao() {
        const detalhes = document.getElementById('detalhesProfissao');
        if(detalhes) { // Verificação adicionada
            if (detalhes.style.display === 'none' || detalhes.style.display === '') {
                detalhes.style.display = 'block';
            } else {
                detalhes.style.display = 'none';
            }
        }
    }

    // Estado Civil
    function abrirJanelaEstadoCivil() {
        const janela = document.getElementById("janelaEstadoCivil");
        const textoCasada = document.querySelector(".texto-clicavel-isaac");
        if (janela && textoCasada) { // Verificação adicionada
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
        if(janela) janela.style.display = "none"; // Verificação adicionada
    }

    // Player de Música Isaac
    function togglePlayerMusicaIsaac() {
        const player = document.getElementById('playerMusicaIsaac');
        const estadoCivil = document.getElementById('janelaEstadoCivil');
        if(player && estadoCivil) { // Verificação adicionada
            if (player.style.display === 'none' || player.style.display === '') {
                player.style.display = 'flex';
                estadoCivil.style.zIndex = '900';
                centralizarElementosPlayer();
                if (audio && !audio.currentSrc) { // Só seleciona se não houver música carregada
                   selecionarMusica(1);
                } else if (audio && audio.paused) {
                    playPause(); // Tenta retomar se estava pausado
                }
            } else {
                player.style.display = 'none';
                estadoCivil.style.zIndex = '1000';
                // O pause é gerenciado pelo fecharPlayer ou playPause
            }
        }
    }

    function fecharPlayer() {
        const player = document.getElementById('playerMusicaIsaac');
        const estadoCivil = document.getElementById('janelaEstadoCivil');
        if(player) player.style.display = 'none'; // Verificação adicionada
        if(estadoCivil) estadoCivil.style.zIndex = '1000'; // Verificação adicionada
        if (audio) { // Verificação adicionada
            audio.pause();
            musicaTocando = false;
            atualizarBotaoPlay();
        }
    }

    function centralizarElementosPlayer() {
        const capaMusica = document.querySelector('.capa-musica-isaac');
        const player = document.querySelector('.player-musica-isaac');
        if(capaMusica && player) { // Verificação adicionada
            capaMusica.style.margin = 'auto';
            player.style.display = 'flex';
            player.style.flexDirection = 'column';
            player.style.alignItems = 'center';
            player.style.justifyContent = 'space-between';
        }
    }

    // Lista de músicas com informações
    // !!! CAMINHOS DE IMAGENS NÃO SÃO DO REPO 'st', MANTIDOS COMO ORIGINAIS !!!
    const listaDeMusicas = [
        {
            id: 1,
            nome: "Crying Alone / Nowhere",
            autor: "Kurae Radiânthia Pendragon Isaac",
            capa: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true", // Mantido
            background: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true", // Mantido
            link: "assets/CryingAlone-Nowhere.mp3", // Confirmar localização
        }
    ];

    // Capturar elementos corretamente (AGORA DENTRO DO DOMCONTENTLOADED)
    let playerMusica, audio, audioSource, progressBar, tempoAtual, tempoTotal; // Declarados aqui
    let musicaTocando = false; // Mantido global

    // Botões sempre carregados (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Lista de Músicas
    function selecionarMusica(id) {
        const musicaSelecionada = listaDeMusicas.find((musica) => musica.id === id);
        // Garante que os elementos de áudio e player existam
        if (!audio || !audioSource || !playerMusica) {
            console.error("Elementos do player não inicializados para selecionarMusica.");
            return;
        }

        if (musicaSelecionada) {
            const nomeEl = playerMusica.querySelector('.nome-musica-isaac');
            const autorEl = playerMusica.querySelector('.autor-musica-isaac');
            const capaImgEl = playerMusica.querySelector('.capa-musica-isaac img');
            const playerBgEl = playerMusica; // O próprio player para o background

            if(nomeEl) nomeEl.textContent = musicaSelecionada.nome;
            if(autorEl) autorEl.textContent = musicaSelecionada.autor;
            if(capaImgEl) {
                capaImgEl.src = musicaSelecionada.capa;
                capaImgEl.onerror = () => console.error(`Erro ao carregar capa: ${musicaSelecionada.capa}`);
            }
            if(playerBgEl) playerBgEl.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)), url('${musicaSelecionada.background}')`;

            audioSource.src = musicaSelecionada.link;
            audio.load(); // Recarregar o áudio após mudar o `src`

            // REMOVIDO O PLAY AUTOMÁTICO DAQUI E DO ONCANPLAYTHROUGH
            // O play será iniciado pelo playPause ou togglePlayer
            // musicaTocando = false; // Resetar estado ao selecionar? Talvez não seja o ideal.
            // atualizarBotaoPlay(); // Atualiza estado visual
            atualizarFavoritoVisual(id);
        }
    }

    // Abrir/fechar a lista de músicas
    function toggleLista() {
        const lista = document.getElementById('listaMusicas');
        if(lista) lista.style.display = (lista.style.display === 'block') ? 'none' : 'block'; // Verificação adicionada
    }

    // Favoritar Músicas
    const storageKey = 'musicasFavoritadas';
    let musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};

    function atualizarFavoritoVisual(id) {
        // Garante que o botão exista antes de tentar acessá-lo
        const botaoFavoritar = document.querySelector(".botao-favoritar-isaac");
        if (botaoFavoritar) {
            if (musicasFavoritadas[id]) {
                botaoFavoritar.classList.add('favoritado');
                botaoFavoritar.textContent = '💖';
            } else {
                botaoFavoritar.classList.remove('favoritado');
                botaoFavoritar.textContent = '🤍';
            }
        }
    }

    function favoritarMusica() {
        const nomeMusicaEl = document.querySelector('.nome-musica-isaac'); // Garante que o elemento exista
        if (nomeMusicaEl) {
            const musicaAtual = listaDeMusicas.find((musica) =>
                musica.nome === nomeMusicaEl.textContent
            );
            if (musicaAtual) {
                musicasFavoritadas[musicaAtual.id] = !musicasFavoritadas[musicaAtual.id];
                if (!musicasFavoritadas[musicaAtual.id]) delete musicasFavoritadas[musicaAtual.id];
                atualizarFavoritoVisual(musicaAtual.id);
                localStorage.setItem(storageKey, JSON.stringify(musicasFavoritadas));
            }
        }
    }

    // Botões do Player
    function retroceder10s() {
        if (audio && !isNaN(audio.duration) && isFinite(audio.duration)) { // Verificação adicionada
            audio.currentTime = Math.max(0, audio.currentTime - 10);
        }
    }

    function avancar10s() {
        if (audio && !isNaN(audio.duration) && isFinite(audio.duration)) { // Verificação adicionada
            audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        }
    }

    function playPause() {
        if (!audio) return; // Sai se o áudio não foi inicializado

        // Se não tem música carregada, carrega a primeira e tenta tocar
        if (!audio.currentSrc && listaDeMusicas.length > 0) {
            selecionarMusica(listaDeMusicas[0].id);
             // Pequeno delay para dar tempo de carregar minimamente antes de tentar o play
             setTimeout(() => {
                 if(audio) audio.play().catch(error => console.warn("Reprodução inicial bloqueada.", error));
             }, 100); // 100ms pode ser ajustado
            return;
        }

        // Se já tem música carregada
        if (musicaTocando) {
            audio.pause();
            // O evento 'pause' atualizará musicaTocando e o botão
        } else {
            audio.play().catch(error => console.warn("Reprodução bloqueada pelo navegador.", error));
            // O evento 'play' atualizará musicaTocando e o botão
        }
    }

    function atualizarBotaoPlay() {
        const botaoPlay = document.querySelector('.botao-controle-isaac:nth-child(2)');
        if(botaoPlay) botaoPlay.textContent = musicaTocando ? 'II' : '►'; // Verificação adicionada
    }

     // Listeners para barra e tempo (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Formatar tempo
    function formatarTempo(segundos) {
        if (isNaN(segundos) || !isFinite(segundos) || segundos < 0) return "0:00"; // Validação adicionada
        const minutos = Math.floor(segundos / 60);
        const restoSegundos = Math.floor(segundos % 60);
        return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
    }

    // Atualizar a lista de músicas
    function atualizarListaMusicas() {
        const listaContainer = document.getElementById('listaMusicas');
        if(listaContainer) { // Verificação adicionada
            listaContainer.innerHTML = '';
            listaDeMusicas.forEach((musica) => {
                const item = document.createElement('p');
                item.textContent = musica.nome;
                item.addEventListener('click', () => {
                     selecionarMusica(musica.id);
                     if(audio) audio.play().catch(e => console.warn("Play da lista bloqueado.", e)); // Tenta tocar ao selecionar
                });
                listaContainer.appendChild(item);
            });
        }
    }

    // Carregar primeira música ao iniciar (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Fama/Moral - Barra de Progresso e Estado
    function atualizarBarra(idBarra, idTexto, porcentagem, idStatus = null) {
        const barra = document.getElementById(idBarra);
        const texto = document.getElementById(idTexto);
        if (barra && texto) { // Verificação adicionada
            barra.style.width = `${porcentagem}%`;
            texto.textContent = `${porcentagem}%`;
            let cor;
            if (porcentagem <= 20) cor = 'darkred'; else if (porcentagem <= 40) cor = '#FF9100';
            else if (porcentagem <= 60) cor = '#00D19A'; else if (porcentagem <= 80) cor = '#D622EF'; else cor = '#6222EF';
            barra.style.backgroundColor = cor;
            if (idStatus) {
                const statusEl = document.getElementById(idStatus); // Renomeado para evitar conflito
                if (statusEl) { // Verificação adicionada
                    let textoStatus;
                    if (porcentagem <= 20) textoStatus = 'Infame..'; else if (porcentagem <= 40) textoStatus = 'Desprezado..';
                    else if (porcentagem <= 60) textoStatus = 'Ambíguo..'; else if (porcentagem <= 80) textoStatus = 'Respeitado..'; else textoStatus = 'Renomado..';
                    statusEl.textContent = textoStatus;
                }
            }
        }
    }

    // Autoestima e Fama/Moral (Chamadas movidas para DOMContentLoaded)

    // Títulos - Carrossel Automático
    let carrosselInterval; // Mantido global
    let pausarCarrosselFunc, iniciarCarrosselFunc; // Para acesso global

    function iniciarCarrossel() {
        const carrossel = document.querySelector('.carrossel-imagens'); // Seleciona dentro da função
        if (!carrossel) return;
        clearInterval(carrosselInterval); // Limpa anterior
        carrosselInterval = setInterval(() => {
            if (!carrossel) { clearInterval(carrosselInterval); return; } // Checa de novo
            carrossel.scrollLeft += 1;
            if (carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.offsetWidth) {
                carrossel.scrollLeft = 0;
            }
        }, 30);
    }

    function pausarCarrossel() { clearInterval(carrosselInterval); }

    // Eventos e Gerenciamento de cliques (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    function abrirJanelaTitulo(id) {
        if (typeof pausarCarrossel === 'function') pausarCarrossel(); // Chama a global
        const janela = document.getElementById(`janelaTitulo${id}`);
        if (janela) janela.style.display = 'block';
    }

    function fecharJanelaTitulo(id) {
        const janela = document.getElementById(`janelaTitulo${id}`);
        if (janela) {
            janela.style.display = 'none';
            if (typeof iniciarCarrossel === 'function') iniciarCarrossel(); // Chama a global
        }
    }

    function expandirJanelaTitulo(id) {
        const janela = document.getElementById(`janelaTitulo${id}`);
        if(janela) janela.classList.toggle('janela-expandida'); // Verificação adicionada
    }

    // Movimentação manual das janelas (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Inicia o carrossel (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Atributos
    function toggleCheckbox(element) { element.classList.toggle("checked"); }

    function atualizarAtributoAtual(atributo, total, porcentagem) {
        const valorAtual = Math.floor((porcentagem / 100) * total);
        const textoEl = document.getElementById(`texto-${atributo}`); // Renomeado
        const barraEl = document.getElementById(`barra-${atributo}`); // Renomeado
        if(textoEl) textoEl.innerText = `${valorAtual} / ${total}`; // Verificação adicionada
        if(barraEl) barraEl.style.width = `${porcentagem}%`; // Verificação adicionada
    }
    const atributos = { /* ... dados ... */ hp:{total:4910210,porcentagem:100},mp:{total:823691,porcentagem:100},agi:{total:637369,porcentagem:100},def:{total:1476557,porcentagem:100},res:{total:1331048,porcentagem:100},spd:{total:1020989,porcentagem:100},int:{total:431815,porcentagem:100},atk:{total:2075839,porcentagem:100},smp:{total:291363290,porcentagem:99.17},unknown:{total:100,porcentagem:50} };
    // Atualização dos atributos (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Selos
    let chaveAtual = 0; // Mantido global
    // !!! CAMINHOS DE IMAGENS NÃO SÃO DO REPO 'st', MANTIDOS COMO ORIGINAIS !!!
    const chaves = [ /* ... dados como no original ... */
        { id: 0, nome: "Key of Souls", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true", efeito: "...", icone: "https://imgur.com/zHQo8sh.png", detalhes: "..."},
        { id: 1, nome: "Key of Dreams", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true", efeito: "...", icone: "https://imgur.com/lKXdgwT.png", detalhes: "..."},
        { id: 2, nome: "Key of IMM", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true", efeito: "...", icone: "https://imgur.com/Hf705GX.png", detalhes: "..."},
        { id: 3, nome: "Key of Desires", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true", efeito: "...", icone: "https://imgur.com/L2bLSl2.png", detalhes: "..."},
        { id: 4, nome: "Key of Soul World", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true", efeito: "...", icone: "https://imgur.com/X1zPnlJ.png", detalhes: "..."},
        { id: 5, nome: "Key of Pendragon", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true", efeito: "...", icone: "assets/Recursos/Key of Pendragon.png", detalhes: "..."},
        { id: 6, nome: "Key PoF", descricao: "...", item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20Pinnacle%20of%20Flames.png?raw=true", efeito: "...", icone: "https://imgur.com/46Dh8W2.png", detalhes: "..."},
        { id: 7, nome: "Key Isaac H", descricao: "...", item: "assets/Recursos/Key of Isaac's Heart.png", efeito: "...", icone: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true", detalhes: "..."},
    ];

    function navegar(direcao) {
        if (typeof direcao !== 'number') return; // Navegação pelos botões < > ou pelos círculos
        // Se for índice vindo dos círculos: onclick="navegar(0)" etc.
        if (direcao >= 0 && direcao < chaves.length) {
             chaveAtual = direcao;
        } else { // Senão, é direção (+1 ou -1) vinda dos botões
            chaveAtual = (chaveAtual + direcao + chaves.length) % chaves.length;
        }
        const chave = chaves[chaveAtual];
        if(!chave) return;

        const titItem=document.getElementById("titulo-item");const descDet=document.querySelector("#retangulo-item .descricao-detalhada");const itemImg=document.querySelector("#retangulo-item .item-imagem img");const titEft=document.querySelector("#retangulo-efeitos .titulo-efeito");const iconeEft=document.querySelector("#retangulo-efeitos img");const detEft=document.querySelector("#retangulo-efeitos .detalhes-detalhados");
        if(titItem) titItem.textContent=chave.nome;if(descDet) descDet.textContent=chave.descricao;if(itemImg){itemImg.src=chave.item;itemImg.onerror=()=>{itemImg.src='assets/Recursos/default_key.png';}} if(titEft) titEft.textContent=chave.efeito;if(iconeEft){iconeEft.src=chave.icone;iconeEft.onerror=()=>{iconeEft.src='assets/Recursos/default_icon.png';}} if(detEft) detEft.textContent=chave.detalhes;
        atualizarDestaqueCirculo(chaveAtual + 1); // Atualiza destaque baseado no índice+1
    }

    function atualizarDestaqueCirculo(id) { document.querySelectorAll(".circulo-pequeno").forEach((c,i)=>{c.style.boxShadow=(i+1===id)?"0 0 10px 3px #FFD700":"none";});}
    // Prevenção de edição (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    const estadosIniciais = { /* ... dados ... */ circulo1:true,circulo2:false,circulo3:true,circulo4:false,circulo5:true,circulo6:false,circulo7:true,circulo8:false };
    // Aplicação dos estados iniciais (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    function toggleCirculo1(){toggleEstado('circulo1');} function toggleCirculo2(){toggleEstado('circulo2');} function toggleCirculo3(){toggleEstado('circulo3');} function toggleCirculo4(){toggleEstado('circulo4');} function toggleCirculo5(){toggleEstado('circulo5');} function toggleCirculo6(){toggleEstado('circulo6');} function toggleCirculo7(){toggleEstado('circulo7');} function toggleCirculo8(){toggleEstado('circulo8');}
    function toggleEstado(id){const c=document.getElementById(id);if(c)c.classList.toggle('ativo');}

    // Bençãos e Maldições
    let posicaoCarrossel = 0; // Mantido global
    function moverCarrossel(d){const c=document.querySelector('.carrossel-diamantes');if(!c)return;const i=c.querySelectorAll('.diamante-item');if(i.length===0)return;i.forEach(item=>item.classList.remove('ativo'));posicaoCarrossel=(posicaoCarrossel+d+i.length)%i.length;if(i[posicaoCarrossel]){i[posicaoCarrossel].classList.add('ativo');const t=i[posicaoCarrossel].offsetWidth+10;const sT=(posicaoCarrossel*t)-(c.offsetWidth/2)+(t/2);c.scrollTo({left:sT,behavior:'smooth'});}}
    // Inicialização do diamante do meio (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    function abrirJanela(id){const j=document.getElementById(id);if(j)j.style.display='block';}
    function fecharJanela(id){const j=document.getElementById(id);if(j)j.style.display='none';}
    function expandirJanela(id){const j=document.getElementById(id);if(j)j.classList.toggle('janela-expandida');}
    // Tornar janela arrastável (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Barra EA
    function atualizarEA(p){const b=document.getElementById('preenchimento-ea');const t=document.getElementById('texto-ea');if(b&&t){p=Math.max(0,Math.min(100,p));b.style.width=`${p}%`;t.textContent=`EA: ${p}%`;}}
    // Definição porcentagem inicial (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Funções Janela Filho
    function abrirJanelaFilho(id){abrirJanela(`janelaFilho${id}`);} // Usa a genérica
    function fecharJanelaFilho(id){fecharJanela(`janelaFilho${id}`);} // Usa a genérica
    function expandirJanelaFilho(id){expandirJanela(`janelaFilho${id}`);} // Usa a genérica

    // Necessidades Básicas e Temporárias
    function atualizarStatusBasicas(gId,p){/*...*/const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='darkred';st='Crítico';}else if(p<=30){c='red';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='green';st='Bom';}else if(p<=100){c='#00B59B';st='Excelente';}else{c='#6222EF';st='Insano';}f.style.backgroundColor=c;s.textContent=st;}}
    function atualizarStatusTemporarias(gId,p){/*...*/const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='#00B59B';st='Muito Baixo';}else if(p<=30){c='green';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='red';st='Alto';}else{c='darkred';st='Crítico';}f.style.backgroundColor=c;s.textContent=st;}}
    // Chamadas de atualização (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Aether
    let porcentagemAether = 101; // Mantido global
    function atualizarAether(p){if(p>102)p=102;if(p<0)p=0;const pa=document.getElementById("preenchimentoAether");const ta=document.getElementById("textoAether");if(pa)pa.style.width=`${(p/102)*100}%`;if(ta)ta.textContent=`Aether: ${p}%`;}
    // Chamada inicial (MOVIDO PARA DENTRO DO DOMCONTENTLOADED)

    // Definições DUPLICADAS de loadSection no final do seu script original são problemáticas e foram ignoradas.

// =========================================================================
// CÓDIGO EXECUTADO QUANDO O DOM ESTÁ PRONTO (DOMContentLoaded)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- Inicializa Player Isaac ---
    playerMusica = document.querySelector('.player-musica-isaac'); // Atribui à variável global
    if (playerMusica) {
        audio = playerMusica.querySelector('#audio-player');       // Atribui à variável global
        if (audio) { audioSource = audio.querySelector('source'); } // Atribui à variável global
        progressBar = playerMusica.querySelector('#progress-bar'); // Atribui à variável global
        tempoAtual = playerMusica.querySelector('#tempo-atual');   // Atribui à variável global
        tempoTotal = playerMusica.querySelector('#tempo-total');   // Atribui à variável global

        // Adiciona listeners internos do player
        if (progressBar && audio) { progressBar.addEventListener('input',()=>{if(audio&&!isNaN(audio.duration)&&isFinite(audio.duration)&&audio.duration>0){audio.currentTime=(progressBar.value/100)*audio.duration;}}); }
        if (audio) {
            audio.addEventListener('timeupdate',()=>{if(tempoAtual&&!isNaN(audio.currentTime))tempoAtual.textContent=formatarTempo(audio.currentTime);if(progressBar&&audio.duration&&!isNaN(audio.duration)&&audio.duration>0)progressBar.value=(audio.currentTime/audio.duration)*100;});
            audio.addEventListener('loadedmetadata',()=>{if(tempoTotal&&!isNaN(audio.duration)&&audio.duration>0)tempoTotal.textContent=formatarTempo(audio.duration);else if(tempoTotal)tempoTotal.textContent="0:00";});
            audio.addEventListener('ended',()=>{musicaTocando=false;atualizarBotaoPlay();});
            audio.addEventListener('play',()=>{musicaTocando=true;atualizarBotaoPlay();});
            audio.addEventListener('pause',()=>{musicaTocando=false;atualizarBotaoPlay();});
        }

        // Listener dos botões que NÃO usam onclick (se houver) - Adicionado do seu original
        const favButton = playerMusica.querySelector(".botao-favoritar-isaac"); // Busca dentro do player
        const listButton = playerMusica.querySelector(".botao-lista-musicas"); // Busca dentro do player
        if (favButton) favButton.addEventListener("click", favoritarMusica);
        if (listButton) listButton.addEventListener("click", toggleLista);

        // Inicializa Lista de Músicas
        if (document.getElementById('listaMusicas')) {
            atualizarListaMusicas();
            // Não selecionar música aqui, pois togglePlayer ou playPause farão isso.
            document.getElementById('listaMusicas').style.display = 'none';
            atualizarBotaoPlay();
        }
    } // Fim if(playerMusica)

    // --- Atualiza Barras Status ---
    atualizarBarra('barra-autoestima', 'texto-autoestima', 98);
    atualizarBarra('barra-fama', 'texto-fama', 97, 'status-fama');

    // --- Configura Carrossel Títulos ---
    const carrosselEl = document.querySelector('.carrossel-imagens'); // Usando nome original da variável
    const carrosselContainerEl = document.querySelector('.carrossel-titulos'); // Usando nome original
    if(carrosselEl && carrosselContainerEl){
        iniciarCarrossel(); // Inicia
        carrosselContainerEl.addEventListener('mouseover', pausarCarrossel);
        carrosselContainerEl.addEventListener('mouseout', iniciarCarrossel);
        // Listener de clique para abrir janela (removido daqui, pois está no onclick do HTML)
        // document.querySelectorAll('.titulo-item').forEach((item) => { /* ... listener removido ... */ });
    }
    document.querySelectorAll('.janela-titulos').forEach(addDragEventsToWindow); // Tornar janelas arrastáveis

    // --- Atualiza Atributos ---
    for (let atributoKey in atributos) { // Usando nome original
        if (Object.hasOwnProperty.call(atributos, atributoKey)) {
            atualizarAtributoAtual(atributoKey, atributos[atributoKey].total, atributos[atributoKey].porcentagem);
        }
    }

    // --- Inicializa Selos ---
    for (const [id, ativo] of Object.entries(estadosIniciais)) { // Usando nome original
        const circulo = document.getElementById(id);
        if (circulo) { if (ativo) circulo.classList.add('ativo'); else circulo.classList.remove('ativo'); }
    }
    document.querySelectorAll(".titulo-item, .titulo-efeito, .descricao-detalhada, .detalhes-detalhados").forEach(elemento => { // Seletores originais
         if(elemento) elemento.contentEditable = "false";
    });
    if (document.getElementById("titulo-item")) { navegar(0); } // Inicializa com a primeira chave

    // --- Inicializa Carrossel Bênçãos ---
    const diamantes = document.querySelectorAll('.diamante-item');
    if (diamantes.length > 0) {
        posicaoCarrossel = Math.floor(diamantes.length / 2); // Nome original
        if(diamantes[posicaoCarrossel]) diamantes[posicaoCarrossel].classList.add('ativo');
        moverCarrossel(0); // Inicializa scroll
    }
    document.querySelectorAll('.janela-bencao').forEach(addDragEventsToWindow);

    // --- Atualiza Barra EA ---
    atualizarEA(86);

    // --- Atualiza Necessidades ---
    atualizarStatusBasicas('grupo-higiene', 97); atualizarStatusBasicas('grupo-banheiro', 100); atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 100); atualizarStatusBasicas('grupo-sede', 100); atualizarStatusBasicas('grupo-diversao', 101);
    atualizarStatusBasicas('grupo-social', 78); atualizarStatusBasicas('grupo-foco', 64);
    atualizarStatusBasicas('grupo-felicidade', 101); atualizarStatusBasicas('grupo-tesao', 101);
    atualizarStatusBasicas('grupo-desgaste', 0);
    atualizarStatusTemporarias('grupo-enjoo', 0); atualizarStatusTemporarias('grupo-fadiga', 0); atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0); atualizarStatusTemporarias('grupo-medo', 0);
    atualizarStatusTemporarias('grupo-tedio', 0); atualizarStatusTemporarias('grupo-raiva', 0);

    // --- Atualiza Aether ---
    atualizarAether(porcentagemAether);

    // --- Adiciona Drag às Janelas Restantes ---
    document.querySelectorAll('.janela-filhos, #janelaEstadoCivil').forEach(addDragEventsToWindow);

    // --- Carrega as seções dinâmicas ---
    // (O código de loadSection já está no topo, as chamadas estão abaixo)
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function(){const p=document.querySelector("#secao-aura #janelaMusica iframe");if(p)p.src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";});
    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html");
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function(){setTimeout(()=>{var p=document.querySelector('#secao-bahdinheiro #expBar');if(p){var pct=75;p.style.width=pct+'%';const c=p.closest('.barra-exp-container');if(c){const t=c.querySelector('.barra-texto');if(t)t.textContent='1590 - '+pct+'%';}}},500);});
    loadSection("secao-classes", "Seções/5-Classes.html");
    // Callbacks para Modo Empusa e Alvo com funções locais e dados originais
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

console.log("Script.js totalmente carregado (Baseado no original, estrutura corrigida, caminhos relativos aplicados onde necessário).");
