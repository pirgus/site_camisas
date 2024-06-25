
// Objeto para pegar os preços e as fotos das camisetas

let camisetas = {
    'branca': {
        
        'gola_v': {
            'sem_estampa': {
                'preco_unit': 5.12,
                'foto': 'v-white.jpg' 
            },
            'com_estampa': {
                'preco_unit': 8.95,
                'foto': 'v-white-personalized.jpg' 
            }
        },
        
        'gola_normal': {
            'sem_estampa': {
                'preco_unit': 4.99,
                'foto': 'normal-white.jpg' 
            },
            'com_estampa': {
                'preco_unit': 8.77,
                'foto': 'normal-white-personalized.jpg' 
            }
        }
    },
    
    'colorida': {
        'gola_v': {
            'sem_estampa': {
                'preco_unit': 6.04,
                'foto': 'v-color.jpg' 
            },
            'com_estampa': {
                'preco_unit': 9.47,
                'foto': 'v-color-personalized.png' 
            }
        },
        
        'gola_normal': {
            'sem_estampa': {
                'preco_unit': 5.35,
                'foto': 'normal-color.jpg' 
            },
            'com_estampa': {
                'preco_unit': 9.28,
                'foto': 'normal-color-personalized.jpg' 
            }
        }
    }
}


// parâmetros da pesquisa

let parametros_pesquisa = {
    "quantidade": 10,
    "cor": "colorida",
    "gola": "gola_v",
    "qualidade": "q150",
    "estampa": "com_estampa",
    "embalagem": "bulk"
}


// Regras adicionais para o orçamento:

// 1. Verificar se há em localStorage os parâmetros do último orçamento e se houver, carregar a página com eles.

// 2. A camisa de qualidade alta (190g/m2) deve acrescer o preço unitário em 12%.

// 3. A embalagem unitária tem um custo de 0.15 por unidade

// 4. Após cálculo do preço, há que se aplicar um desconto por quantidade, sendo: 
    // faixa 1: acima de 1.000 - Desconto de 15%
    // faixa 2: acima de 500 - Desconto de 10%
    // faixa 3: acima de 100 - Desconto de 5%



// Resolução do desafio:

$(function(){
    let j_quantidade = $('#quantidade');
    let j_estampa = $('#estampa');
    let j_embalagem = $('#embalagem');
    let cores = $('#cor div');
    let golas = $('#gola div');
    let qualidades = $('#qualidade div');


    if(localStorage.getItem('quantidade') !== null){ // se ja houver um orçamento no localStorage, atualiza
        updateOrcamento(j_quantidade, cores, golas, qualidades, j_estampa, j_embalagem);
        updateParams();
    }

    setPageValues(j_quantidade, j_estampa, j_embalagem);

    // update qtd
    j_quantidade.change(function () {
        parametros_pesquisa.quantidade = $(this).val();
        writeLocalStorage();

        $('#result_quantidade').html($(this).val());
        $('#valor-total').html(calcTotalValue().toFixed(2));
    });


    // update cores
    $.each(cores, function(index, value){
        $(this).click(function () {
            $.each(cores, function(index, value){
                $(value).removeClass('selected');
            });
            $(this).addClass('selected');
            // console.log($(this).attr('id'));
            parametros_pesquisa.cor = $(this).attr('id')
            writeLocalStorage();

            $('#result_cor').html($(this).html());
            $('#valor-total').html(calcTotalValue().toFixed(2));

            let cor = parametros_pesquisa.cor;
            let gola = parametros_pesquisa.gola;
            let estampa = parametros_pesquisa.estampa;
            $('#foto-produto').attr('src', 'img/' + camisetas[cor][gola][estampa].foto);
        });
    });


    // update gola
    $.each(golas, function(index, value){
        $(this).click(function () {
            $.each(golas, function(index, value){
                $(value).removeClass('selected');
            });
            $(this).addClass('selected');
            // console.log($(this).attr('id'));
            parametros_pesquisa.gola = $(this).attr('id')
            writeLocalStorage();

            $('#result_gola').html($(this).html());
            $('#valor-total').html(calcTotalValue().toFixed(2));
            let cor = parametros_pesquisa.cor;
            let gola = parametros_pesquisa.gola;
            let estampa = parametros_pesquisa.estampa;
            $('#foto-produto').attr('src', 'img/' + camisetas[cor][gola][estampa].foto);
        });
    });

    // update qualidade
    $.each(qualidades, function(index, value){
        $(this).click(function () {
            $.each(qualidades, function(index, value){
                $(value).removeClass('selected');
            });
            $(this).addClass('selected');
            // console.log($(this).attr('id'));
            parametros_pesquisa.qualidade = $(this).attr('id')
            writeLocalStorage();

            $('#result_qualidade').html($(this).html());
            $('#valor-total').html(calcTotalValue().toFixed(2));
        });
    });

    // update estampa
    j_estampa.change(function () {
        let estampa_selecionada = $(this).find(':selected').text();
        // console.log(estampa_selecionada);
        // console.log($(this).val());
        parametros_pesquisa.estampa = $(this).val();
        writeLocalStorage();

        $('#result_estampa').html(estampa_selecionada);
        $('#valor-total').html(calcTotalValue().toFixed(2));
        let cor = parametros_pesquisa.cor;
        let gola = parametros_pesquisa.gola;
        let estampa = parametros_pesquisa.estampa;
        $('#foto-produto').attr('src', 'img/' + camisetas[cor][gola][estampa].foto);
    })

    j_embalagem.change(function () {
        let embalagem_selecionada = $(this).find(':selected').text();
        parametros_pesquisa.embalagem = $(this).val();
        writeLocalStorage();

        $('#result_embalagem').html(embalagem_selecionada);
        $('#valor-total').html(calcTotalValue().toFixed(2));
    })

    calcTotalValue();
    // Se quiser uma sugestão dos passos a seguir para a resolução, veja mais abaixo.


    function setPageValues(j_quantidade, j_estampa, j_embalagem){
        let cor_selecionada = $('#cor').find('.selected').html();
        let gola_selecionada = $('#gola').find('.selected').html();
        let qualidade_selecionada = $('#qualidade').find('.selected').html();
        let estampa_selecionada = j_estampa.find(':selected').html();
        let embalagem_selecionada = j_embalagem.find(':selected').html();
        let cor = parametros_pesquisa.cor;
        let gola = parametros_pesquisa.gola;
        let estampa = parametros_pesquisa.estampa;


        $('#result_quantidade').html(j_quantidade.val());
        $('#result_cor').html(cor_selecionada);
        $('#result_gola').html(gola_selecionada);
        $('#result_qualidade').html(qualidade_selecionada);
        $('#result_estampa').html(estampa_selecionada);
        $('#result_embalagem').html(embalagem_selecionada);
        $('#valor-total').html(calcTotalValue().toFixed(2));
        $('#foto-produto').attr('src', 'img/' + camisetas[cor][gola][estampa].foto);
    }

    function updateParams(){
        parametros_pesquisa.quantidade = localStorage.getItem('quantidade');
        parametros_pesquisa.cor = localStorage.getItem('cor');
        parametros_pesquisa.gola = localStorage.getItem('gola');
        parametros_pesquisa.qualidade = localStorage.getItem('qualidade');
        parametros_pesquisa.estampa = localStorage.getItem('estampa');
        parametros_pesquisa.embalagem = localStorage.getItem('embalagem');
    }

    function calcTotalValue(){
        $('.refresh-loader').show();
        setTimeout(function () {
            $('.refresh-loader').hide();
        }, 500);


        // console.log(parametros_pesquisa.quantidade);
        console.log(parametros_pesquisa.cor);

        let quantidade = parametros_pesquisa.quantidade;
        let cor = parametros_pesquisa.cor;
        let gola = parametros_pesquisa.gola;
        let qualidade = parametros_pesquisa.qualidade;
        let estampa = parametros_pesquisa.estampa;
        let embalagem = parametros_pesquisa.embalagem;

        let preco_unitario = camisetas[cor][gola][estampa]['preco_unit'];
        console.log(preco_unitario);

        let valor_embalagem = 0;
        if(qualidade === 'q190'){
            preco_unitario *= 1.12;
        }
        if(embalagem === 'unitaria'){
            valor_embalagem = 0.15 * quantidade
        }

        let totalValue = (quantidade * preco_unitario) + valor_embalagem;
        console.log(totalValue);

        // condicoes de desconto
        if(100 < quantidade  && quantidade <= 500){
            totalValue -= totalValue * 0.05;
        }
        else if(500 < quantidade && quantidade <= 1000){
            totalValue -= totalValue * 0.1;
        }
        else if(quantidade > 1000){
            totalValue -= totalValue * 0.15;
        }

        return totalValue;
    }


    function writeLocalStorage(){
        localStorage.setItem('quantidade', parametros_pesquisa.quantidade);
        localStorage.setItem('cor', parametros_pesquisa.cor);
        localStorage.setItem('gola', parametros_pesquisa.gola);
        localStorage.setItem('qualidade', parametros_pesquisa.qualidade);
        localStorage.setItem('estampa', parametros_pesquisa.estampa);
        localStorage.setItem('embalagem', parametros_pesquisa.embalagem);
    }
    function updateOrcamento(quantidade, cores, golas, qualidades, estampa, embalagem){

        // settando valor determinado pelo localStorage
        quantidade.attr('value', localStorage.getItem('quantidade'));

        // setando a cor que estiver escolhida
        $.each(cores, function(index, value){
            $(value).removeClass('selected');
        });
        $('#'+localStorage.getItem('cor')).addClass('selected');

        // settando gola
        $.each(golas, function(index, value){
            $(value).removeClass('selected');
        })
        $('#'+localStorage.getItem('gola')).addClass('selected');


        // settando qualidade
        $.each(qualidades, function(index, value){
            $(value).removeClass('selected');
        })
        $('#'+localStorage.getItem('qualidade')).addClass('selected');


        // set da estampa e embalagem em campos de select dropdown
        estampa.val(localStorage.getItem('estampa'));

        embalagem.val(localStorage.getItem('embalagem'));
    }
});
