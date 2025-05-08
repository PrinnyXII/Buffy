    // Buffy Música - Função para abrir e fechar a janela de música
    function toggleJanelaMusica() {
        const janela = document.getElementById('janelaMusica');
        // Adicionada verificação simples
        if (janela) {
            if (janela.style.display === 'none' || janela.style.display === '') {
                janela.style.display = 'block'; // Abre a janela
            } else {
                janela.style.display = 'none'; // Fecha a janela
            }
        }
    }

    // Carregar a seção da música e configurar o player
    // !! USA A DEFINIÇÃO DE loadSection QUE APARECE POR ÚLTIMO NO SCRIPT !!
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function () {
        const playerMusica = document.querySelector("#janelaMusica iframe");
        if (playerMusica) {
            playerMusica.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH"; // Link externo mantido
        } else {
           // console.error("O elemento #janelaMusica iframe não foi encontrado."); // Comentado como original
        }
    });

    // Barra de Experiência
    // !! USA A DEFINIÇÃO DE loadSection QUE APARECE POR ÚLTIMO NO SCRIPT !!
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html", function () {
        // console.log("Seção Barra de Experiência carregada!"); // Comentado como original
        setTimeout(() => {
            var progressBar = document.getElementById('expBar');
            if (progressBar) {
                var percentage = 75; // Atualiza bara EXP
                progressBar.style.width = percentage + '%';

                // Atualizar o texto da barra
                var textSpan = document.querySelector('.barra-texto'); // Seletor global original
                if (textSpan) {
                    textSpan.textContent = '1590 - ' + percentage + '%';
                }
            } else {
               // console.error("Elemento 'expBar' não encontrado."); // Comentado como original
            }
        }, 500);
    });

    // Cabeçalho - Seção 03
    // !! USA A DEFINIÇÃO DE loadSection QUE APARECE POR ÚLTIMO NO SCRIPT !!
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html", function () {
       // console.log("Seção Cabeçalho carregada!"); // Comentado como original
    });

    // Classes - Texto retraído
    // !! USA A DEFINIÇÃO DE loadSection QUE APARECE POR ÚLTIMO NO SCRIPT !!
    loadSection("secao-classes", "Seções/5-Classes.html", function () {
       // console.log("Seção Classes carregada!"); // Comentado como original
    });

    function mostrarTexto() {
        const expandido = document.querySelector('.expandido'); // Seletor global original
        if (expandido) {
            expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
        } else {
            console.error("Elemento '.expandido' não encontrado!"); // Erro original mantido
        }
    }

    // Modo Empusa - Seção 06
    // !! USA A DEFINIÇÃO DE loadSection QUE APARECE POR ÚLTIMO NO SCRIPT !!
    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html", function () {
       // console.log("Seção Modo Empusa carregada!"); // Comentado como original
       setTimeout(() => {
            // Funções definidas localmente no callback (como no original)
            function atualizarBarra(idBarra, idTexto, porcentagem) {
                var progressBar = document.getElementById(idBarra); // Busca global (como no original)
                var textSpan = document.getElementById(idTexto);   // Busca global (como no original)
                if (progressBar && textSpan) { progressBar.style.width = porcentagem + '%'; textSpan.textContent = porcentagem + '%'; }
                // else { console.error(`Elemento '${idBarra}' ou '${idTexto}' não encontrado.`); } // Comentado como no original
            }
            function atualizarFome() {
                const s = document.getElementById("sangue-texto"); const v = document.getElementById("vitalidade-texto"); // Buscas globais
                if (s && v) { var sg=parseInt(s.textContent)||0; var vt=parseInt(v.textContent)||0; var ft=Math.min(sg+vt,100); atualizarBarra("fomeBar","fome-texto",ft); }
            }
            function toggleMenu(seta) {
                var menu = seta.parentElement.nextElementSibling;
                if (menu && menu.classList.contains('empusa-menu')) { // Verificação adicionada
                    document.querySelectorAll('#secao-modoempusa .empusa-menu').forEach(m => { if (m !== menu) m.style.display = 'none'; }); // Seletor mais específico
                    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
                }
            }
             function atualizarDor(nivelDor) {
                nivelDor = Math.max(0, Math.min(nivelDor, 6));
                for (let i = 1; i <= 6; i++) {
                    let coracao = document.getElementById(`coracao-${i}`); // Busca global
                    if(coracao) coracao.textContent = (i <= nivelDor) ? "💜" : "🤍"; // Verificação adicionada
                }
            }
            function atualizarSatisfacao(idContainer, idPrefixo, nivelSatisfacao) {
                nivelSatisfacao = Math.max(1, Math.min(nivelSatisfacao, 6));
                let container = document.getElementById(idContainer); // Busca global
                if (!container) return;
                container.querySelectorAll('.emoji-satisfacao').forEach(emoji => emoji.classList.remove('emoji-selecionado'));
                let emojiSelecionado = document.getElementById(`${idPrefixo}-${nivelSatisfacao}`); // Busca global
                if (emojiSelecionado) emojiSelecionado.classList.add('emoji-selecionado');
            }

            atualizarBarra("prazerBar", "prazer-texto", 99); atualizarBarra("amorBar", "amor-texto", 100);
            atualizarBarra("sangueBar", "sangue-texto", 47); atualizarBarra("vitalidadeBar", "vitalidade-texto", 100);
            atualizarFome(); atualizarDor(1); atualizarSatisfacao("satisfacao-container", "satisfacao", 5);

            // Adiciona o evento de clique DENTRO do callback
            document.querySelectorAll('#secao-modoempusa .empusa-seta').forEach(seta => { // Seletor mais específico
                seta.addEventListener('click', function () { toggleMenu(this); }); // Chama a função local
            });
       }, 500);
    });

    // Modo Empusa Alvo - Seção 07
    // !! USA A DEFINIÇÃO DE loadSection QUE APARECE POR ÚLTIMO NO SCRIPT !!
    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html", function () {
       // console.log("Seção Modo Empusa - Alvo carregada!"); // Comentado como original
       setTimeout(() => {
            // Funções locais (como no original)
            function atualizarBarraAlvo(idB, idT, p) { var pb=document.getElementById(idB); var ts=document.getElementById(idT); if(pb&&ts){pb.style.width=p+'%';ts.textContent=p+'%';} }
            function atualizarDorAlvo(nD) { for(let i=1;i<=6;i++){let c=document.getElementById(`coracao-alvo-${i}`);if(c)c.textContent=i<=nD?"💜":"🤍";} }
            function atualizarSatisfacaoAlvo(idC, idP, nS) { nS=Math.max(1,Math.min(nS,6)); let cont=document.getElementById(idC); if(!cont)return; cont.querySelectorAll('.emoji-satisfacao').forEach(e=>e.classList.remove('emoji-selecionado')); let emS=document.getElementById(`${idP}-${nS}`); if(emS)emS.classList.add('emoji-selecionado'); }
            function atualizarDominancia(p) { p=Math.max(0,Math.min(p,100)); let pre=document.getElementById("dominanciaBar"); let emo=document.getElementById("dominancia-emoji"); if(pre&&emo){pre.style.background=`linear-gradient(to right,#ff12a9 0%,#ff12a9 ${Math.max(0,p-5)}%,#a020f0 ${p}%,#1e90ff ${Math.min(100,p+5)}%,#1e90ff 100%)`; emo.style.left=`calc(${p}% - 15px)`;} }

            atualizarBarraAlvo("prazerBarAlvo","prazer-texto-alvo",98); atualizarBarraAlvo("amorBarAlvo","amor-texto-alvo",100);
            atualizarBarraAlvo("volumeBarAlvo","volume-texto-alvo",5); atualizarBarraAlvo("vitalidadeBarAlvo","vitalide-texto-alvo",21);
            atualizarDorAlvo(3); atualizarSatisfacaoAlvo("satisfacao-container-alvo","satisfacao-alvo",5);
            atualizarDominancia(73);
       }, 500);
    });

    // Caracteristicas
    function toggleProfissao() {const d=document.getElementById('detalhesProfissao');if(d)d.style.display=(d.style.display==='none'||d.style.display==='')?'block':'none';}
    // Estado Civil
    function abrirJanelaEstadoCivil() {const j=document.getElementById("janelaEstadoCivil");const t=document.querySelector(".texto-clicavel-isaac");if(j&&t){const r=t.getBoundingClientRect();const oX=window.pageXOffset||document.documentElement.scrollLeft;const oY=window.pageYOffset||document.documentElement.scrollTop;j.style.left=`${r.right+oX+10}px`;j.style.top=`${r.top+oY}px`;j.style.display="block";}}
    function fecharJanelaEstadoCivil() {const j=document.getElementById("janelaEstadoCivil");if(j)j.style.display="none";}
    // Player de Música Isaac
    function togglePlayerMusicaIsaac() {const p=document.getElementById('playerMusicaIsaac');const eC=document.getElementById('janelaEstadoCivil');if(p&&eC){if(p.style.display==='none'||p.style.display===''){p.style.display='flex';eC.style.zIndex='900';centralizarElementosPlayer();if(audio&&!audio.currentSrc){selecionarMusica(1);}else if(audio&&audio.paused){playPause();}}else{p.style.display='none';eC.style.zIndex='1000';}}}
    function fecharPlayer() {const p=document.getElementById('playerMusicaIsaac');const eC=document.getElementById('janelaEstadoCivil');if(p)p.style.display='none';if(eC)eC.style.zIndex='1000';if(audio){audio.pause();/*musicaTocando=false;atualizarBotaoPlay();*/}}
    function centralizarElementosPlayer() {const c=document.querySelector('.capa-musica-isaac');const p=document.querySelector('.player-musica-isaac');if(c&&p){c.style.margin='auto';p.style.display='flex';p.style.flexDirection='column';p.style.alignItems='center';p.style.justifyContent='space-between';}}
    // Lista de músicas com informações (Links Cueinhah e assets/ mantidos)
    const listaDeMusicas = [{id:1,nome:"Crying Alone / Nowhere",autor:"Kurae R. P. Isaac",capa:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true",background:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true",link:"assets/CryingAlone-Nowhere.mp3"}];
    // Capturar elementos corretamente (Mantido global como no original - PODE CAUSAR ERRO SE SCRIPT CARREGAR ANTES DO HTML)
    const playerMusica = document.querySelector('.player-musica-isaac');
    const audio = document.querySelector('#audio-player');
    const audioSource = document.querySelector('#audio-player source');
    const progressBar = document.getElementById('progress-bar');
    const tempoAtual = document.getElementById('tempo-atual');
    const tempoTotal = document.getElementById('tempo-total');
    let musicaTocando = false; // Mantido global
    // Botões sempre carregados (Mantido como no original)
    document.addEventListener("DOMContentLoaded",function(){const favBtn=document.querySelector(".botao-favoritar-isaac");const listBtn=document.querySelector(".botao-lista-musicas");if(favBtn)favBtn.addEventListener("click",favoritarMusica);if(listBtn)listBtn.addEventListener("click",toggleLista);});
    // Lista de Músicas
    function selecionarMusica(id){const m=listaDeMusicas.find(i=>i.id===id);if(m&&audio&&audioSource&&playerMusica){const nE=playerMusica.querySelector('.nome-musica-isaac');const aE=playerMusica.querySelector('.autor-musica-isaac');const cE=playerMusica.querySelector('.capa-musica-isaac img');const pB=playerMusica;if(nE)nE.textContent=m.nome;if(aE)aE.textContent=m.autor;if(cE){cE.src=m.capa;cE.onerror=()=>{cE.src='assets/Imagens Isaac/default_capa.png';}}if(pB)pB.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)), url('${m.background}')`;audioSource.src=m.link;audio.load();/*Removido oncanplaythrough do original*/atualizarFavoritoVisual(id);/*atualizarBotaoPlay();*/}}
    function toggleLista(){const l=document.getElementById('listaMusicas');if(l)l.style.display=(l.style.display==='block')?'none':'block';}
    // Favoritar Músicas
    const storageKey='musicasFavoritadas';let musicasFavoritadas=JSON.parse(localStorage.getItem(storageKey))||{};
    function atualizarFavoritoVisual(id){const b=document.querySelector('.botao-favoritar-isaac');if(b){if(musicasFavoritadas[id]){b.classList.add('favoritado');b.textContent='💖';}else{b.classList.remove('favoritado');b.textContent='🤍';}}}
    function favoritarMusica(){const nE=document.querySelector('.nome-musica-isaac');if(nE){const m=listaDeMusicas.find(i=>i.nome===nE.textContent);if(m){musicasFavoritadas[m.id]=!musicasFavoritadas[m.id];if(!musicasFavoritadas[m.id])delete musicasFavoritadas[m.id];atualizarFavoritoVisual(m.id);localStorage.setItem(storageKey,JSON.stringify(musicasFavoritadas));}}}
    // Botões do Player
    function retroceder10s(){if(audio&&!isNaN(audio.duration)){audio.currentTime=Math.max(0,audio.currentTime-10);}}
    function avancar10s(){if(audio&&!isNaN(audio.duration)){audio.currentTime=Math.min(audio.duration,audio.currentTime+10);}}
    function playPause(){if(!audio)return;if(musicaTocando){audio.pause();musicaTocando=false;}else{/*Verifica se audio existe antes de play*/ if(audio) audio.play().catch(e=>console.warn("Reprodução bloqueada.",e));musicaTocando=true;}atualizarBotaoPlay();}
    function atualizarBotaoPlay(){const b=document.querySelector('.botao-controle-isaac:nth-child(2)');if(b)b.textContent=musicaTocando?'II':'►';}
    // Listeners da barra e tempo (Mantido global como no original - PODE CAUSAR ERRO)
    if(progressBar) progressBar.addEventListener('input',()=>{if(audio&&!isNaN(audio.duration)&&isFinite(audio.duration)){audio.currentTime=(progressBar.value/100)*audio.duration;}else{console.warn("Duração indisponível.");}});
    if(audio) audio.addEventListener('timeupdate',()=>{if(audio&&!isNaN(audio.currentTime)&&isFinite(audio.currentTime)){if(tempoAtual)tempoAtual.textContent=formatarTempo(audio.currentTime);if(progressBar&&audio.duration)progressBar.value=(audio.currentTime/audio.duration)*100;}});
    if(audio) audio.addEventListener('loadedmetadata',()=>{if(audio&&!isNaN(audio.duration)&&isFinite(audio.duration)){if(tempoTotal)tempoTotal.textContent=formatarTempo(audio.duration);}});
    // Formatar tempo
    function formatarTempo(s){if(isNaN(s)||!isFinite(s)||s<0)return"0:00";const m=Math.floor(s/60);const rS=Math.floor(s%60);return`${m}:${rS<10?'0':''}${rS}`;}
    // Atualizar lista de músicas
    function atualizarListaMusicas(){const lC=document.getElementById('listaMusicas');if(lC){lC.innerHTML='';listaDeMusicas.forEach((m)=>{const i=document.createElement('p');i.textContent=m.nome;i.addEventListener('click',()=>{selecionarMusica(m.id);});lC.appendChild(i);});}}
    // Carregar primeira música ao iniciar (Mantido como no original)
    document.addEventListener('DOMContentLoaded',()=>{if(typeof atualizarListaMusicas==='function')atualizarListaMusicas();if(typeof selecionarMusica==='function')selecionarMusica(1);const l=document.getElementById('listaMusicas');if(l)l.style.display='none';if(typeof atualizarBotaoPlay==='function')atualizarBotaoPlay();});

    // Fama/Moral - Barra de Progresso e Estado
    function atualizarBarra(idB,idT,p,idS=null){const b=document.getElementById(idB);const t=document.getElementById(idT);if(b&&t){b.style.width=`${p}%`;t.textContent=`${p}%`;let c;if(p<=20)c='darkred';else if(p<=40)c='#FF9100';else if(p<=60)c='#00D19A';else if(p<=80)c='#D622EF';else c='#6222EF';b.style.backgroundColor=c;if(idS){const sE=document.getElementById(idS);if(sE){let tS;if(p<=20)tS='Infame..';else if(p<=40)tS='Desprezado..';else if(p<=60)tS='Ambíguo..';else if(p<=80)tS='Respeitado..';else tS='Renomado..';sE.textContent=tS;}}}}
    // Chamadas de atualização (Mantido global como no original)
    atualizarBarra('barra-autoestima','texto-autoestima',98);
    atualizarBarra('barra-fama','texto-fama',97,'status-fama');

    // Títulos - Carrossel Automático
    let carrosselInterval; const carrossel=document.querySelector('.carrossel-imagens'); const carrosselContainer=document.querySelector('.carrossel-titulos');
    function iniciarCarrossel(){if(!carrossel)return;clearInterval(carrosselInterval);carrosselInterval=setInterval(()=>{if(!carrossel){clearInterval(carrosselInterval);return;}carrossel.scrollLeft+=1;if(carrossel.scrollLeft>=carrossel.scrollWidth-carrossel.offsetWidth){carrossel.scrollLeft=0;}},30);}
    function pausarCarrossel(){clearInterval(carrosselInterval);}
    // Listeners e gerenciamento de cliques (Mantido como no original)
    if(carrosselContainer) carrosselContainer.addEventListener('mouseover',pausarCarrossel);
    if(carrosselContainer) carrosselContainer.addEventListener('mouseout',iniciarCarrossel);
    document.querySelectorAll('.titulo-item').forEach((item)=>{item.addEventListener('click',(e)=>{pausarCarrossel();const id=e.currentTarget.getAttribute('onclick').match(/\d+/)[0];abrirJanelaTitulo(id);});});
    function abrirJanelaTitulo(id){const j=document.getElementById(`janelaTitulo${id}`);if(j)j.style.display='block';}
    function fecharJanelaTitulo(id){const j=document.getElementById(`janelaTitulo${id}`);if(j)j.style.display='none';iniciarCarrossel();}
    function expandirJanelaTitulo(id){const j=document.getElementById(`janelaTitulo${id}`);if(j)j.classList.toggle('janela-expandida');}
    // Movimentação manual (Mantido como no original)
    document.querySelectorAll('.janela-titulos').forEach((j)=>{let iD=false,sX,sY;j.addEventListener('mousedown',(e)=>{iD=true;sX=e.clientX-j.offsetLeft;sY=e.clientY-j.offsetTop;j.style.cursor='grabbing';});document.addEventListener('mousemove',(e)=>{if(iD){j.style.left=`${e.clientX-sX}px`;j.style.top=`${e.clientY-sY}px`;}});document.addEventListener('mouseup',()=>{iD=false;j.style.cursor='move';});});
    // Inicia carrossel (Mantido como no original)
    document.addEventListener('DOMContentLoaded',iniciarCarrossel);

    // Atributos
    function toggleCheckbox(e){e.classList.toggle("checked");}
    function atualizarAtributoAtual(a,t,p){const vA=Math.floor((p/100)*t);const tE=document.getElementById(`texto-${a}`);const bE=document.getElementById(`barra-${a}`);if(tE)tE.innerText=`${vA} / ${t}`;if(bE)bE.style.width=`${p}%`;}
    const atributos={hp:{total:4910210,porcentagem:100},mp:{total:823691,porcentagem:100},agi:{total:637369,porcentagem:100},def:{total:1476557,porcentagem:100},res:{total:1331048,porcentagem:100},spd:{total:1020989,porcentagem:100},int:{total:431815,porcentagem:100},atk:{total:2075839,porcentagem:100},smp:{total:291363290,porcentagem:99.17},unknown:{total:100,porcentagem:50}};
    // Atualização (Mantido global como no original)
    for(let a in atributos){if(Object.hasOwnProperty.call(atributos,a)){const{total,porcentagem}=atributos[a];atualizarAtributoAtual(a,total,porcentagem);}}

    // Selos
    let chaveAtual=0;
    // Dados das chaves (Links Cueinhah, Imgur e assets/ mantidos)
    const chaves=[{id:0,nome:"Key of Souls",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true",efeito:"...",icone:"https://imgur.com/zHQo8sh.png",detalhes:"..."},{id:1,nome:"Key of Dreams",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true",efeito:"...",icone:"https://imgur.com/lKXdgwT.png",detalhes:"..."},{id:2,nome:"Key of IMM",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true",efeito:"...",icone:"https://imgur.com/Hf705GX.png",detalhes:"..."},{id:3,nome:"Key of Desires",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true",efeito:"...",icone:"https://imgur.com/L2bLSl2.png",detalhes:"..."},{id:4,nome:"Key of Soul World",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true",efeito:"...",icone:"https://imgur.com/X1zPnlJ.png",detalhes:"..."},{id:5,nome:"Key of Pendragon",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true",efeito:"...",icone:"assets/Recursos/Key of Pendragon.png",detalhes:"..."},{id:6,nome:"Key PoF",descricao:"...",item:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20Pinnacle%20of%20Flames.png?raw=true",efeito:"...",icone:"https://imgur.com/46Dh8W2.png",detalhes:"..."},{id:7,nome:"Key Isaac H",descricao:"...",item:"assets/Recursos/Key of Isaac's Heart.png",efeito:"...",icone:"https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true",detalhes:"..."}];
    function navegar(dOI){if(typeof dOI==='number'&&dOI>=0&&dOI<chaves.length){chaveAtual=dOI;}else if(typeof dOI==='number'){chaveAtual=(chaveAtual+dOI+chaves.length)%chaves.length;}else{return;}const c=chaves[chaveAtual];if(!c)return;const tI=document.getElementById("titulo-item");const dD=document.querySelector("#retangulo-item .descricao-detalhada");const iI=document.querySelector(".item-imagem img");const tE=document.querySelector("#retangulo-efeitos .titulo-efeito");const iE=document.querySelector("#retangulo-efeitos img");const dE=document.querySelector("#retangulo-efeitos .detalhes-detalhados");if(tI)tI.textContent=c.nome;if(dD)dD.textContent=c.descricao;if(iI){iI.src=c.item;iI.onerror=()=>{iI.src='assets/Recursos/default_key.png';}}if(tE)tE.textContent=c.efeito;if(iE){iE.src=c.icone;iE.onerror=()=>{iE.src='assets/Recursos/default_icon.png';}}if(dE)dE.textContent=c.detalhes;atualizarDestaqueCirculo(chaveAtual+1);}
    function atualizarDestaqueCirculo(id){document.querySelectorAll(".circulo-pequeno").forEach((c,i)=>{c.style.boxShadow=(i+1===id)?"0 0 10px 3px #FFD700":"none";});}
    // Prevenção de edição (Mantido global como no original)
    document.querySelectorAll(".titulo-item, .titulo-efeito, .descricao-detalhada, .detalhes-detalhados").forEach(e=>{if(e)e.contentEditable="false";}); // Adicionado .detalhes-detalhados
    // Estado inicial dos círculos (Mantido como no original)
    const estadosIniciais={circulo1:true,circulo2:false,circulo3:true,circulo4:false,circulo5:true,circulo6:false,circulo7:true,circulo8:false};
    document.addEventListener("DOMContentLoaded",function(){for(const[id,at]of Object.entries(estadosIniciais)){const c=document.getElementById(id);if(c){if(at)c.classList.add('ativo');else c.classList.remove('ativo');}}});
    // Funções toggle (Mantido como no original)
    function toggleCirculo1(){toggleEstado('circulo1');} function toggleCirculo2(){toggleEstado('circulo2');} function toggleCirculo3(){toggleEstado('circulo3');} function toggleCirculo4(){toggleEstado('circulo4');} function toggleCirculo5(){toggleEstado('circulo5');} function toggleCirculo6(){toggleEstado('circulo6');} function toggleCirculo7(){toggleEstado('circulo7');} function toggleCirculo8(){toggleEstado('circulo8');}
    function toggleEstado(id){const c=document.getElementById(id);if(c)c.classList.toggle('ativo');}

    // Bençãos e Maldições
    let posicaoCarrossel=0; // Mantido global
    function moverCarrossel(d){const c=document.querySelector('.carrossel-diamantes');if(!c)return;const i=c.querySelectorAll('.diamante-item');if(i.length===0)return;i.forEach(item=>item.classList.remove('ativo'));posicaoCarrossel=(posicaoCarrossel+d+i.length)%i.length;if(i[posicaoCarrossel]){i[posicaoCarrossel].classList.add('ativo');const t=i[posicaoCarrossel].offsetWidth+10;const sT=(posicaoCarrossel*t)-(c.offsetWidth/2)+(t/2);c.scrollTo({left:sT,behavior:'smooth'});}}
    // Diamante do meio (Mantido como no original)
    document.addEventListener("DOMContentLoaded",()=>{const d=document.querySelectorAll('.diamante-item');if(d.length>0){const m=Math.floor(d.length/2);if(d[m])d[m].classList.add('ativo');}});
    // Abrir/Fechar/Expandir/Arrastar Janela (Mantido como no original)
    function abrirJanela(id){const j=document.getElementById(id);if(j)j.style.display='block';}
    function fecharJanela(id){const j=document.getElementById(id);if(j)j.style.display='none';}
    function expandirJanela(id){const j=document.getElementById(id);if(j)j.classList.toggle('janela-expandida');}
    document.querySelectorAll('.janela-bencao').forEach((j)=>{let iD=false,sX,sY;j.addEventListener('mousedown',(e)=>{iD=true;sX=e.clientX-j.offsetLeft;sY=e.clientY-j.offsetTop;j.style.cursor='grabbing';});document.addEventListener('mousemove',(e)=>{if(iD){j.style.left=`${e.clientX-sX}px`;j.style.top=`${e.clientY-sY}px`;}});document.addEventListener('mouseup',()=>{iD=false;j.style.cursor='move';});});

    // Barra EA
    function atualizarEA(p){const b=document.getElementById('preenchimento-ea');const t=document.getElementById('texto-ea');if(b&&t){p=Math.max(0,Math.min(100,p));b.style.width=`${p}%`;t.textContent=`EA: ${p}%`;}}
    // Porcentagem inicial (Mantido como no original)
    document.addEventListener('DOMContentLoaded',()=>{atualizarEA(86);});

    // Funções Janela Filho
    function abrirJanelaFilho(id){abrirJanela(`janelaFilho${id}`);}
    function fecharJanelaFilho(id){fecharJanela(`janelaFilho${id}`);}
    function expandirJanelaFilho(id){expandirJanela(`janelaFilho${id}`);}

    // Necessidades Básicas e Temporárias
    function atualizarStatusBasicas(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='darkred';st='Crítico';}else if(p<=30){c='red';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='green';st='Bom';}else if(p<=100){c='#00B59B';st='Excelente';}else{c='#6222EF';st='Insano';}f.style.backgroundColor=c;s.textContent=st;}}
    function atualizarStatusTemporarias(gId,p){const f=document.getElementById(`barra-progresso-${gId}`);const t=document.getElementById(`progresso-texto-${gId}`);const s=document.getElementById(`estado-${gId}`);if(f&&t&&s){f.style.width=`${p}%`;t.textContent=`${p}%`;let c='',st='';if(p<=0){c='#00B59B';st='Nulo';}else if(p<=5){c='#00B59B';st='Muito Baixo';}else if(p<=30){c='green';st='Baixo';}else if(p<=60){c='#FFAA00';st='Moderado';}else if(p<=95){c='red';st='Alto';}else{c='darkred';st='Crítico';}f.style.backgroundColor=c;s.textContent=st;}}
    // Chamadas de atualização (Mantido global como no original)
    atualizarStatusBasicas('grupo-higiene',97);atualizarStatusBasicas('grupo-banheiro',100);atualizarStatusBasicas('grupo-sono',100);atualizarStatusBasicas('grupo-fome',100);atualizarStatusBasicas('grupo-sede',100);atualizarStatusBasicas('grupo-diversao',101);atualizarStatusBasicas('grupo-social',78);atualizarStatusBasicas('grupo-foco',64);atualizarStatusBasicas('grupo-felicidade',101);atualizarStatusBasicas('grupo-tesao',101);
    atualizarStatusTemporarias('grupo-enjoo',0);atualizarStatusTemporarias('grupo-fadiga',0);atualizarStatusTemporarias('grupo-estresse',0);atualizarStatusTemporarias('grupo-ansiedade',0);atualizarStatusTemporarias('grupo-medo',0);atualizarStatusTemporarias('grupo-tedio',0);atualizarStatusTemporarias('grupo-raiva',0);atualizarStatusTemporarias('grupo-desgaste',0);

    // Aether
    let porcentagemAether = 101; // Mantido global
    function atualizarAether(p){if(p>102)p=102;if(p<0)p=0;const pa=document.getElementById("preenchimentoAether");const ta=document.getElementById("textoAether");if(pa)pa.style.width=`${(p/102)*100}%`;if(ta)ta.textContent=`Aether: ${p}%`;}
    // Chamada inicial (Mantido global como no original)
    atualizarAether(porcentagemAether);

    // Definição DUPLICADA de loadSection foi REMOVIDA daqui
    // Definição DUPLICADA de loadSection com callback foi REMOVIDA daqui e movida para o topo

    // Carregar todas as seções (Mantido global como no original)
    // !! USA A DEFINIÇÃO DE loadSection QUE ESTÁ NO TOPO !!
    loadSection("secao-aura", "Seções/1-Aura-Buffy.html"); // Callback será ignorado pela primeira definição, se ela existisse
    loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
    loadSection("secao-cabecalho", "Seções/3-Cabeçalho.html");
    loadSection("secao-bahdinheiro", "Seções/4-Barra-Dinheiro.html");
    loadSection("secao-classes", "Seções/5-Classes.html");
    loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html");
    loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html");


console.log("Script.js original (com correções mínimas) carregado.");
