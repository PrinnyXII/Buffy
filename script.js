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

// Definir a porcentagem inicial 
document.addEventListener('DOMContentLoaded', () => {
    atualizarEA(86);
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
    } else if (porcentagem <= 100) {
        color = '#00B59B';
        status = 'Excelente';
    } else {
        color = '#6222EF';
        status = 'Insano';
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
loadSection("secao-modoempusa", "Seções/6-Modo-Empusa.html");
loadSection("secao-modoempusa-alvo", "Seções/7-Modo-Empusa-Alvo.html");

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
