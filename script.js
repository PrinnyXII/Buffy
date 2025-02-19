
    // Buffy Música - Função para abrir e fechar a janela de música
    function toggleJanelaMusica() {
        const janela = document.getElementById('janelaMusica');

        if (janela.style.display === 'none' || janela.style.display === '') {
            janela.style.display = 'block'; // Abre a janela
        } else {
            janela.style.display = 'none'; // Fecha a janela
        }
    }

    // Carregar a seção da música e configurar o player
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
        const playerMusica = document.querySelector("#janelaMusica iframe");
        if (playerMusica) {
            playerMusica.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
        } else {
            console.error("O elemento #janelaMusica iframe não foi encontrado.");
        }
    });

    // Barra de Experiência
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
        console.log("Seção Barra de Experiência carregada!");
    
        function updateExpBar(percentage) {
            var progressBar = document.getElementById('expBar');
            if (progressBar) {
                progressBar.style.width = percentage + '%';
    
                // Atualizar o texto da barra
                var textSpan = document.querySelector('.barra-texto');
                if (textSpan) {
                    textSpan.textContent = '1303 - ' + percentage + '%';
                }
            } else {
                console.error("Elemento 'expBar' não encontrado.");
            }
        }
    
        // Atualiza a barra de experiência
        updateExpBar(73);
    });

    // Classes - Texto retraído
    loadSection("secao-classes", "Seções/5-Classes.html", function () {
        console.log("Seção Classes carregada!");
    });
    
    function mostrarTexto() {
        const expandido = document.querySelector('.expandido');
        if (expandido) {
            expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
        } else {
            console.error("Elemento '.expandido' não encontrado!");
        }
    }

    // Caracteristicas
    function toggleProfissao() {
        const detalhes = document.getElementById('detalhesProfissao');
        if (detalhes.style.display === 'none' || detalhes.style.display === '') {
            detalhes.style.display = 'block';
        } else {
            detalhes.style.display = 'none';
        }
    }
    
    // Estado Civil
    function abrirJanelaEstadoCivil() {
        const janela = document.getElementById("janelaEstadoCivil");
        const textoCasada = document.querySelector(".texto-clicavel-isaac");
        const rect = textoCasada.getBoundingClientRect();
        const offsetX = window.pageXOffset || document.documentElement.scrollLeft;
        const offsetY = window.pageYOffset || document.documentElement.scrollTop;
    
        // Define a posição da janela flutuante
        janela.style.left = `${rect.right + offsetX + 10}px`; // Ajuste para evitar sobreposição
        janela.style.top = `${rect.top + offsetY}px`;
        janela.style.display = "block"; // Torna a janela visível
    }
    
    function fecharJanelaEstadoCivil() {
        const janela = document.getElementById("janelaEstadoCivil");
        janela.style.display = "none"; // Oculta a janela
    }
    
    // Player de Música Isaac
    function togglePlayerMusicaIsaac() {
        const player = document.getElementById('playerMusicaIsaac');
        const estadoCivil = document.getElementById('janelaEstadoCivil');
    
        if (player.style.display === 'none' || player.style.display === '') {
            player.style.display = 'flex';
            estadoCivil.style.zIndex = '900';
            centralizarElementosPlayer();
            selecionarMusica(1); // Carregar a música 1 por padrão ao abrir
        } else {
            player.style.display = 'none';
            estadoCivil.style.zIndex = '1000';
        }
    }
    
    function fecharPlayer() {
        const player = document.getElementById('playerMusicaIsaac');
        const estadoCivil = document.getElementById('janelaEstadoCivil');
    
        player.style.display = 'none';
        estadoCivil.style.zIndex = '1000';
        audio.pause();
        musicaTocando = false;
        atualizarBotaoPlay();
    }
    
    function centralizarElementosPlayer() {
        const capaMusica = document.querySelector('.capa-musica-isaac');
        const player = document.querySelector('.player-musica-isaac');
    
        capaMusica.style.margin = 'auto';
        player.style.display = 'flex';
        player.style.flexDirection = 'column';
        player.style.alignItems = 'center';
        player.style.justifyContent = 'space-between';
    }
    
    // Lista de músicas com informações
    const listaDeMusicas = [
        {
            id: 1,
            nome: "Crying Alone / Nowhere",
            autor: "Kurae Radiânthia Pendragon Isaac",
            capa: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true",
            background: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true",
            link: "https://github.com/PrinnyXII/st/blob/main/rep/Isaac/CryingAlone-Nowhere.mp3",
        }
    ];
    
    // Controle do Player de Música
    const playerMusica = document.querySelector('.player-musica-isaac');
    const audio = document.querySelector('audio');
    const progressBar = document.getElementById('progress-bar');
    const tempoAtual = document.getElementById('tempo-atual');
    const tempoTotal = document.getElementById('tempo-total');
    let musicaTocando = false;
    
    // Áudio clique
    document.body.addEventListener('click', () => {
        if (!musicaTocando) {
            audio.play().catch(error => console.warn("Reprodução bloqueada pelo navegador."));
        }
    }, { once: true }); // Apenas uma vez
    
    // Selecionar música da lista
    function selecionarMusica(id) {
        const musicaSelecionada = listaDeMusicas.find((musica) => musica.id === id);
    
        if (musicaSelecionada) {
            document.querySelector('.nome-musica-isaac').textContent = musicaSelecionada.nome;
            document.querySelector('.autor-musica-isaac').textContent = musicaSelecionada.autor;
            document.querySelector('.capa-musica-isaac img').src = musicaSelecionada.capa;
            document.querySelector('.player-musica-isaac').style.backgroundImage = 
                `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;
            document.querySelector('#audio-player source').src = musicaSelecionada.link;
    
            audio.load();
            musicaTocando = true;
            atualizarBotaoPlay();
            atualizarFavoritoVisual(id);
        }
    }

    // Adicionar eventos à lista de músicas
    document.querySelectorAll('.lista-musicas-isaac p').forEach((item, index) => {
        item.addEventListener('click', () => selecionarMusica(index + 1));
    });
    
    // Função para abrir/fechar a lista de músicas
    function toggleLista() {
        const lista = document.getElementById('listaMusicas');
        lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
    }
    
    // Função para retroceder 10 segundos
    function retroceder10s() {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
    
    // Função para avançar 10 segundos
    function avancar10s() {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }

    // Função para play/pause
    function playPause() {
        if (musicaTocando) {
            audio.pause();
            musicaTocando = false;
        } else {
            audio.play().catch(error => console.warn("Reprodução bloqueada pelo navegador."));
            musicaTocando = true;
        }
        atualizarBotaoPlay();
    }
    
    function atualizarBotaoPlay() {
        const botaoPlay = document.querySelector('.botao-controle-isaac:nth-child(2)');
        botaoPlay.textContent = musicaTocando ? 'II' : '►';
    }

    // Favoritar e salvar estado
    const storageKey = 'musicasFavoritadas';
    let musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    function atualizarFavoritoVisual(id) {
        const botaoFavoritar = document.querySelector('.botao-favoritar-isaac');
        if (musicasFavoritadas[id]) {
            botaoFavoritar.classList.add('favoritado');
            botaoFavoritar.textContent = '💖';
        } else {
            botaoFavoritar.classList.remove('favoritado');
            botaoFavoritar.textContent = '🤍';
        }
    }
    
    function favoritarMusica() {
        const musicaAtual = listaDeMusicas.find((musica) => musica.nome === document.querySelector('.nome-musica-isaac').textContent);
        musicasFavoritadas[musicaAtual.id] = !musicasFavoritadas[musicaAtual.id];
        atualizarFavoritoVisual(musicaAtual.id);
        localStorage.setItem(storageKey, JSON.stringify(musicasFavoritadas));
    }

    // Atualiza o progresso e tempo da música
    audio.addEventListener('timeupdate', () => {
        const tempo = formatarTempo(audio.currentTime);
        tempoAtual.textContent = tempo;
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    });
    
    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
    
    // Tempo
    progressBar.addEventListener('input', () => {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) { 
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        } else {
            console.warn("A duração do áudio ainda não está carregada.");
        }
    });

    function formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const restoSegundos = Math.floor(segundos % 60);
        return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
    }
    audio.addEventListener('loadedmetadata', () => {
        tempoTotal.textContent = formatarTempo(audio.duration);
    });
    
    // Atualizar nomes na lista de músicas
    function atualizarListaMusicas() {
        const listaContainer = document.getElementById('listaMusicas');
        listaContainer.innerHTML = ''; // Limpa a lista antes de recriá-la
    
        listaDeMusicas.forEach((musica) => {
            const item = document.createElement('p');
            item.textContent = musica.nome;
            item.addEventListener('click', () => selecionarMusica(musica.id));
            listaContainer.appendChild(item);
        });
    }
    
    // Carregar a primeira música após a página estar pronta
    document.addEventListener('DOMContentLoaded', () => {
        atualizarListaMusicas();
        selecionarMusica(1); // Começa com a primeira música
        document.getElementById('listaMusicas').style.display = 'none';
        atualizarBotaoPlay();
    });
        
    // Fama/Moral - Barra de Progresso e Estado
    function atualizarBarra(idBarra, idTexto, porcentagem, idStatus = null) {
        const barra = document.getElementById(idBarra);
        const texto = document.getElementById(idTexto);
        
        // Atualiza a largura da barra e o texto central com a porcentagem
        barra.style.width = `${porcentagem}%`;
        texto.textContent = `${porcentagem}%`;

        // Define cor baseada na porcentagem
        let cor;
        if (porcentagem <= 20) {
            cor = 'darkred';
        } else if (porcentagem <= 40) {
            cor = '#FF9100';
        } else if (porcentagem <= 60) {
            cor = '#00D19A';
        } else if (porcentagem <= 80) {
            cor = '#D622EF';
        } else {
            cor = '#6222EF';
        }
        barra.style.backgroundColor = cor;

        // Atualiza o status apenas se o ID de status for fornecido
        if (idStatus) {
            const status = document.getElementById(idStatus);
            let textoStatus;

            if (porcentagem <= 20) {
                textoStatus = 'Infame - Condenado - Vilão - Corrupto';
            } else if (porcentagem <= 40) {
                textoStatus = 'Desprezado - Mal-Visto - Suspeito - Anti-Herói';
            } else if (porcentagem <= 60) {
                textoStatus = 'Ambíguo - Neutro - Indiferente - Equilibrado';
            } else if (porcentagem <= 80) {
                textoStatus = 'Respeitado - Admirado - Herói - Protetor';
            } else {
                textoStatus = 'Renomado - Lendário - Venerado - Salvador';
            }

            status.textContent = textoStatus;
        }
    }

    // Autoestima - Atualiza apenas a cor e porcentagem
    atualizarBarra('barra-autoestima', 'texto-autoestima', 99);

    // Fama / Moral - Atualiza cor, porcentagem e status
    atualizarBarra('barra-fama', 'texto-fama', 94, 'status-fama');
    
    // Títulos - Carrossel Automático
    let carrosselInterval;
    const carrossel = document.querySelector('.carrossel-imagens');
    const carrosselContainer = document.querySelector('.carrossel-titulos');
    
    // Inicia o carrossel com movimento automático
    function iniciarCarrossel() {
        carrosselInterval = setInterval(() => {
            // Move o carrossel suavemente
            carrossel.scrollLeft += 1;
            if (carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.offsetWidth) {
                carrossel.scrollLeft = 0; // Reinicia quando atingir o final
            }
        }, 30); // Velocidade ajustável
    }
    
    // Pausa o movimento do carrossel
    function pausarCarrossel() {
        clearInterval(carrosselInterval);
    }
    
    // Eventos para pausa e retomada do movimento
    carrosselContainer.addEventListener('mouseover', pausarCarrossel);
    carrosselContainer.addEventListener('mouseout', iniciarCarrossel);
    
    // Gerenciar cliques nas bolinhas do carrossel
    document.querySelectorAll('.titulo-item').forEach((item) => {
        item.addEventListener('click', (e) => {
            pausarCarrossel(); // Pausa o carrossel ao clicar
            const id = e.currentTarget.getAttribute('onclick').match(/\d+/)[0];
            abrirJanelaTitulo(id); // Abre a janela flutuante associada
        });
    });
    
    // Função para abrir a janela flutuante
    function abrirJanelaTitulo(id) {
        const janela = document.getElementById(`janelaTitulo${id}`);
        if (janela) {
            janela.style.display = 'block';
        }
    }
    
    // Função para fechar a janela flutuante
    function fecharJanelaTitulo(id) {
        const janela = document.getElementById(`janelaTitulo${id}`);
        if (janela) {
            janela.style.display = 'none';
            iniciarCarrossel(); // Reinicia o carrossel ao fechar a janela
        }
    }
    
    // Expande ou minimiza a janela flutuante
    function expandirJanelaTitulo(id) {
        const janela = document.getElementById(`janelaTitulo${id}`);
        janela.classList.toggle('janela-expandida');
    }
    
    // Movimentação manual das janelas flutuantes
    document.querySelectorAll('.janela-titulos').forEach((janela) => {
        let isDragging = false, startX, startY;
    
        janela.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - janela.offsetLeft;
            startY = e.clientY - janela.offsetTop;
            janela.style.cursor = 'grabbing';
        });
    
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                janela.style.left = `${e.clientX - startX}px`;
                janela.style.top = `${e.clientY - startY}px`;
            }
        });
    
        document.addEventListener('mouseup', () => {
            isDragging = false;
            janela.style.cursor = 'move';
        });
    });
    
    // Inicia o carrossel automaticamente ao carregar a página
    document.addEventListener('DOMContentLoaded', iniciarCarrossel);
    
     // Atributos - Função para atualizar a barra de atributo com valor e total
    function toggleCheckbox(element) {
        element.classList.toggle("checked");
    }

    function atualizarAtributoAtual(atributo, total, porcentagem) {
        const valorAtual = Math.floor((porcentagem / 100) * total);
        document.getElementById(`texto-${atributo}`).innerText = `${valorAtual} / ${total}`;
        document.getElementById(`barra-${atributo}`).style.width = `${porcentagem}%`;
    }

    // Atributos - Definindo valores e porcentagens iniciais para cada atributo
    const atributos = {
        hp: { total: 4024763, porcentagem: 100 },
        mp: { total: 675157, porcentagem: 100 },
        agi: { total: 522434, porcentagem: 100 },
        def: { total: 1210293, porcentagem: 100 },
        res: { total: 303776, porcentagem: 100 },
        spd: { total: 836877, porcentagem: 100 },
        int: { total: 353947, porcentagem: 100 },
        atk: { total: 1701508, porcentagem: 100 },
        smp: { total: 9314172, porcentagem: 73.72381 },
        unknown: { total: 100, porcentagem: 47.19 }
    };

    // Atributos - Atualizando os valores e porcentagens das barras
    for (let atributo in atributos) {
        const { total, porcentagem } = atributos[atributo];
        atualizarAtributoAtual(atributo, total, porcentagem);
    }
    
    // Selos - Define o estado inicial
    let chaveAtual = 0;
    
    // Selos - Dados das chaves
    const chaves = [
        { id: 0,
         nome: "Key of Souls",
         descricao: "Nenhuma informação sobre a chave Key of Souls está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true",
         efeito: "À descobrir 01.",
         icone: "https://imgur.com/zHQo8sh.png",
         detalhes: "Esta chave é um teste da alinezinha1"},
        
        { id: 1,
         nome: "Key of Dreams",
         descricao: "Nenhuma informação sobre a chave Key of Dreams está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true",
         efeito: "À descobrir 02.",
         icone: "https://imgur.com/lKXdgwT.png",
         detalhes: "Esta chave é um teste da alinezinha2"},
        
        { id: 2,
         nome: "Key of Infinite Moon Mansion",
         descricao: "Nenhuma informação sobre a chave Key of Infinite Moon Mansion está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true",
         efeito: "À descobrir 03.",
         icone: "https://imgur.com/Hf705GX.png",
         detalhes: "Esta chave é um teste da alinezinha3"},
        
        { id: 3,
         nome: "Key of Desires",
         descricao: "Nenhuma informação sobre a chave Key of Desires está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true",
         efeito: "À descobrir 04.",
         icone: "https://imgur.com/L2bLSl2.png",
         detalhes: "Esta chave é um teste da alinezinha4"},
        
        { id: 4,
         nome: "Key of Soul World",
         descricao: "Nenhuma informação sobre a chave Key of Soul World está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true",
         efeito: "À descobrir 05.",
         icone: "https://imgur.com/X1zPnlJ.png",
         detalhes: "Esta chave é um teste da alinezinha5"},
        
        { id: 5,
         nome: "Key of Pendragon",
         descricao: "Nenhuma informação sobre a chave Key of Pendragon está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true",
         efeito: "À descobrir 06.",
         icone: "assets/Recursos/Key of Pendragon.png",
         detalhes: "Esta chave é um teste da alinezinha6"},
        
        { id: 6,
         nome: "Key Pinnacle of Flames",
         descricao: "Nenhuma informação sobre a chave Key Pinnacle of Flames está disponível.",
         item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20Pinnacle%20of%20Flames.png?raw=true",
         efeito: "À descobrir 07.",
         icone: "https://imgur.com/46Dh8W2.png",
         detalhes: "Esta chave é um teste da alinezinha7"},
        
        { id: 7,
         nome: "Key of Isaac's Heart",
         descricao: "Nenhuma informação sobre a chave Key of Isaac's Heart está disponível.",
         item: "assets/Recursos/Key of Isaac's Heart.png",
         efeito: "À descobrir 08.",
         icone: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true",
         detalhes: "Esta chave é um teste da alinezinha8"},
    ];
    
    // Selos - Atualiza os detalhes do retângulo com base na chave selecionada
    function navegar(direcao) {
        chaveAtual = (chaveAtual + direcao + chaves.length) % chaves.length;
        const chave = chaves[chaveAtual];
    
        // Atualiza Retângulo Item
        document.getElementById("titulo-item").textContent = chave.nome;
        document.querySelector("#retangulo-item .descricao-detalhada").textContent = chave.descricao;

        // Atualiza a imagem no Item-Imagem
        document.querySelector(".item-imagem img").src = chave.item;
        
        // Atualiza Retângulo Efeitos
        document.querySelector("#retangulo-efeitos .titulo-efeito").textContent = chave.efeito;
        document.querySelector("#retangulo-efeitos img").src = chave.icone;
        document.querySelector("#retangulo-efeitos .detalhes-detalhados").textContent = chave.detalhes;
        
        // Atualiza Destaque dos Círculos
        atualizarDestaqueCirculo(chaveAtual + 1);
    }
    
    // Selos - Atualiza o destaque dourado nos círculos pequenos
    function atualizarDestaqueCirculo(id) {
        document.querySelectorAll(".circulo-pequeno").forEach((circulo, index) => {
            if (index + 1 === id) {
                circulo.style.boxShadow = "0 0 10px 3px #FFD700"; // Adiciona o destaque
            } else {
                circulo.style.boxShadow = "none"; // Remove o destaque
            }
        });
    }
    
    // Selos - Previne caixas de texto editáveis e comportamento indesejado
    document.querySelectorAll(".titulo-item, .titulo-efeito, .descricao-detalhada").forEach(elemento => {
        elemento.contentEditable = "false"; // Impede edição
    });

  // Selos - Define o estado inicial dos círculos (ativo ou inativo)
    const estadosIniciais = {
        circulo1: true,  // Ativo
        circulo2: false, // Inativo
        circulo3: true,  // Ativo
        circulo4: false, // Inativo
        circulo5: true,  // Ativo
        circulo6: false, // Inativo
        circulo7: true,  // Ativo
        circulo8: false  // Inativo
    };
    
    // Selos - Aplica os estados iniciais ao carregar a página
    document.addEventListener("DOMContentLoaded", function () {
        for (const [id, ativo] of Object.entries(estadosIniciais)) {
            const circulo = document.getElementById(id);
            if (ativo) {
                circulo.classList.add('ativo');
            } else {
                circulo.classList.remove('ativo');
            }
        }
    });
    
    // Selos - Funções para alternar o estado de cada círculo
    function toggleCirculo1() {
        toggleEstado('circulo1');
    }
    
    function toggleCirculo2() {
        toggleEstado('circulo2');
    }
    
    function toggleCirculo3() {
        toggleEstado('circulo3');
    }
    
    function toggleCirculo4() {
        toggleEstado('circulo4');
    }
    
    function toggleCirculo5() {
        toggleEstado('circulo5');
    }
    
    function toggleCirculo6() {
        toggleEstado('circulo6');
    }
    
    function toggleCirculo7() {
        toggleEstado('circulo7');
    }
    
    function toggleCirculo8() {
        toggleEstado('circulo8');
    }
    
    // Selos - Função genérica para alternar estado
    function toggleEstado(id) {
        const circulo = document.getElementById(id);
        circulo.classList.toggle('ativo');
    }
    
    // Bençãos e Maldições - Controla a posição do carrossel
    let posicaoCarrossel = 0;

    function moverCarrossel(direcao) {
        const carrossel = document.querySelector('.carrossel-diamantes');
        const itens = carrossel.querySelectorAll('.diamante-item');
    
        // Remove a classe 'ativo' de todos os itens
        itens.forEach(item => item.classList.remove('ativo'));
    
        // Atualiza a posição
        posicaoCarrossel = (posicaoCarrossel + direcao + itens.length) % itens.length;
    
        // Adiciona a classe 'ativo' ao novo item central
        itens[posicaoCarrossel].classList.add('ativo');
    
        // Faz o scroll horizontal para manter o item central visível
        const tamanhoItem = itens[posicaoCarrossel].offsetWidth + 10; // Inclui o gap
        carrossel.scrollLeft = posicaoCarrossel * tamanhoItem - (carrossel.clientWidth - tamanhoItem) / 2;
    }

    // Bençãos e Maldições - Diamante do Meio
    document.addEventListener("DOMContentLoaded", () => {
        const diamantes = document.querySelectorAll('.diamante-item');
        const meio = Math.floor(diamantes.length / 2);
        diamantes[meio].classList.add('ativo');
    });

    
    // Bençãos e Maldições - Abrir Janela Flutuante
    function abrirJanela(idJanela) {
        console.log(`Janela ${idJanela} aberta`); // Para teste
        const janela = document.getElementById(idJanela);
        janela.style.display = 'block';
    }

    // Bençãos e Maldições - Fechar Janela Flutuante
    function fecharJanela(idJanela) {
        const janela = document.getElementById(idJanela);
        janela.style.display = 'none';
    }

    // Bençãos e Maldições - Expandir ou Reduzir Janela
    function expandirJanela(idJanela) {
        const janela = document.getElementById(idJanela);
        janela.classList.toggle('janela-expandida');
    }

    // Bençãos e Maldições - Tornar a Janela Arrastável
    document.querySelectorAll('.janela-bencao').forEach((janela) => {
        let isDragging = false, startX, startY;

        janela.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - janela.offsetLeft;
            startY = e.clientY - janela.offsetTop;
            janela.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                janela.style.left = `${e.clientX - startX}px`;
                janela.style.top = `${e.clientY - startY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            janela.style.cursor = 'move';
        });
    });

    // Barra EA
    function atualizarEA(porcentagem) {
        const barraEA = document.getElementById('preenchimento-ea');
        const textoEA = document.getElementById('texto-ea');
    
        // Garante que a porcentagem fique entre 0% e 100%
        porcentagem = Math.max(0, Math.min(100, porcentagem));
    
        // Atualiza a largura da barra
        barraEA.style.width = `${porcentagem}%`;
    
        // Atualiza o texto dentro da barra
        textoEA.textContent = `EA: ${porcentagem}%`;
    }
    
    // Exemplo: Definir a porcentagem inicial 
    document.addEventListener('DOMContentLoaded', () => {
        atualizarEA(53);
    });


    // Função para abrir a janela flutuante
    function abrirJanelaFilho(id) {
        const janela = document.getElementById(`janelaFilho${id}`);
        if (janela) {
            janela.style.display = 'block';
        }
    }
    
    // Função para fechar a janela flutuante
    function fecharJanelaFilho(id) {
        const janela = document.getElementById(`janelaFilho${id}`);
        if (janela) {
            janela.style.display = 'none';
        }
    }
    
    // Expande ou minimiza a janela flutuante
    function expandirJanelaFilho(id) {
        const janela = document.getElementById(`janelaFilho${id}`);
        janela.classList.toggle('janela-expandida');
    }
    
    // Necessidades Básicas - Barra de Progresso e Estado
    function atualizarStatusBasicas(grupoId, porcentagem) {
        const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
        const progressText = document.getElementById(`progresso-texto-${grupoId}`);
        const statusIndicator = document.getElementById(`estado-${grupoId}`);

        fillBar.style.width = `${porcentagem}%`;
        progressText.textContent = `${porcentagem}%`;

        let color = '';
        let status = '';

        if (porcentagem <= 0) {
            color = '#00B59B';
            status = 'Nulo';
        } else if (porcentagem <= 5) {
            color = 'darkred';
            status = 'Crítico';
        } else if (porcentagem <= 30) {
            color = 'red';
            status = 'Baixo';
        } else if (porcentagem <= 60) {
            color = '#FFAA00';
            status = 'Moderado';
        } else if (porcentagem <= 95) {
            color = 'green';
            status = 'Bom';
        } else {
            color = '#00B59B';
            status = 'Excelente';
        }

        fillBar.style.backgroundColor = color;
        statusIndicator.textContent = status;
    }

    // Necessidades Temporárias - Barra de Progresso e Estado
    function atualizarStatusTemporarias(grupoId, porcentagem) {
        const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
        const progressText = document.getElementById(`progresso-texto-${grupoId}`);
        const statusIndicator = document.getElementById(`estado-${grupoId}`);

        fillBar.style.width = `${porcentagem}%`;
        progressText.textContent = `${porcentagem}%`;

        let color = '';
        let status = '';

        if (porcentagem <= 0) {
            color = '#00B59B';
            status = 'Nulo';
        } else if (porcentagem <= 5) {
            color = '#00B59B';
            status = 'Muito Baixo';
        } else if (porcentagem <= 30) {
            color = 'green';
            status = 'Baixo';
        } else if (porcentagem <= 60) {
            color = '#FFAA00';
            status = 'Moderado';
        } else if (porcentagem <= 95) {
            color = 'red';
            status = 'Alto';
        } else {
            color = 'darkred';
            status = 'Crítico';
        }

        fillBar.style.backgroundColor = color;
        statusIndicator.textContent = status;
    }

    // Exemplo de uso para Necessidades Básicas
    atualizarStatusBasicas('grupo-higiene', 100);
    atualizarStatusBasicas('grupo-banheiro', 100);
    atualizarStatusBasicas('grupo-sono', 100);
    atualizarStatusBasicas('grupo-fome', 99);
    atualizarStatusBasicas('grupo-sede', 99);
    atualizarStatusBasicas('grupo-diversao', 99);
    atualizarStatusBasicas('grupo-social', 99);
    atualizarStatusBasicas('grupo-foco', 99);
    atualizarStatusBasicas('grupo-felicidade', 99);
    atualizarStatusBasicas('grupo-tesao', 99);

    // Exemplo de uso para Necessidades Temporárias
    atualizarStatusTemporarias('grupo-enjoo', 0);
    atualizarStatusTemporarias('grupo-fadiga', 0);
    atualizarStatusTemporarias('grupo-estresse', 0);
    atualizarStatusTemporarias('grupo-ansiedade', 0);
    atualizarStatusTemporarias('grupo-medo', 0);
    atualizarStatusTemporarias('grupo-tedio', 0);
    atualizarStatusTemporarias('grupo-raiva', 0);
    atualizarStatusTemporarias('grupo-desgaste', 0);

    // Define a porcentagem inicial do Aether
    let porcentagemAether = 101; 
    
    // Atualiza a barra de preenchimento e o texto da porcentagem
    function atualizarAether(porcentagem) {
        if (porcentagem > 102) porcentagem = 102;
        if (porcentagem < 0) porcentagem = 0;
    
        document.getElementById("preenchimentoAether").style.width = `${(porcentagem / 102) * 100}%`;
        document.getElementById("textoAether").textContent = `Aether: ${porcentagem}%`;
    }
    
    // Chamada inicial para atualizar a barra ao carregar a página
    atualizarAether(porcentagemAether);

    // Seções Individuais
    function loadSection(id, file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
            })
            .catch(error => console.error(`Erro ao carregar ${file}:`, error));
    }
    
    // Carregar todas as seções
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html");
    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html");
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html");
    loadSection("secao-classes", "Seções/5-Classes.html");

    // 
    function loadSection(id, url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
                if (callback) callback(); // Executa o código após o carregamento
            })
            .catch(error => console.error('Erro ao carregar a seção:', error));
    }

