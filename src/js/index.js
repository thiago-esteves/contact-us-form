
const $stepText = $('#step-text');
const $stepDescription = $('#step-description');
const $stepOne = $('.step.one');
const $stepTwo = $('.step.two');
const $stepThree = $('.step.three');
const $title = $(' #title');

const $containerBtnFormOne = $('#containerBtnFormOne');
const $BtnFormOne = $('#btnFormOne');
const $containerBtnFormTwo = $('#containerBtnFormTwo');
const $BtnFormTwo = $('#btnFormTwo');
const $containerBtnFormThree = $('#containerBtnFormThree');
const $BtnFormThree = $('#btnFormThree');
const $inputNome = $('#nome');
const $inputSobrenome = $('#sobrenome');
const $inputDataNascimento = $('#dataNascimento');
const $inputEmail = $('#email');
const $inputMinibio = $('#minibio');
const $inputEndereco = $('#endereco');
const $inputComplemento = $('#complemento');
const $inputCidade = $('#cidade');
const $inputCep = $('#cep');
const $inputHabilidades = $('#habilidades');
const $inputPontosForte = $('#pontosForte');

let nomeValido = false;
let sobrenomeValido = false;
let dataNascimentoValido = false;
let emailValido = false;
let enderecoValido = false;
let cidadeValido = false;
let cepValido = false;
let habilidadesValido = false;
let pontosForteValido = false;

const minLengthText = 2;
const minLengthTextArea = 10;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const cepRegex = /^([\d]{2})([\d]{3})([\d]{3})|^[\d]{2}.[\d]{3}-[\d]{3}/


function validarInput(element, minLength, maxLength, regex) {
    const closest = $(element).closest('.input-data');
    if (!element.value
        || (minLength && element.value.trim().length < minLength)
        || (maxLength && element.value.trim().length > maxLength)
        || (regex && !element.value.toLowerCase().match(regex))
    ) {
        closest.addClass('error');
        return false;
    }
    closest.removeClass('error');
    return true;

}
function validaFormularioUm() {
    if (nomeValido && sobrenomeValido && emailValido && dataNascimentoValido) {
        $containerBtnFormOne.removeClass('disabled');
        $BtnFormOne.removeClass('disabled');
        $BtnFormOne.off('click').on('click', iniciarFormulario2);

    } else {
        $containerBtnFormOne.addClass('disabled');
        $BtnFormOne.addClass('disabled');
        $BtnFormOne.off('click');


    }
}
function iniciarFormulario2() {
    $stepText.text('Passo 2 de 3 - Dados de correspondência ');
    $stepDescription.text('Precisamos desses dados para que possamos entrar em contato se necessário ');
    $stepOne.hide();
    $stepTwo.show();
}

$inputEndereco.keyup(function () {
    enderecoValido = validarInput(this, minLengthTextArea);
    validarFormularioDois();
});
$inputCidade.keyup(function () {
    cidadeValido = validarInput(this, minLengthText);
    validarFormularioDois();
});

$inputCep.keyup(function () {
    this.value = this.value.replace(/\D/g, '');
    cepValido = validarInput(this, null, null, cepRegex);
    if (cepValido) {
        this.value = this.value.replace(cepRegex, "$1.$2-$3");
    }

    validarFormularioDois();

});

$inputComplemento.keyup(function () {
    validarFormularioDois();

});
function validarFormularioDois() {
    if (enderecoValido && cidadeValido && cepValido) {
        $containerBtnFormTwo.removeClass('disabled')
        $BtnFormTwo.removeClass('disabled')
        $BtnFormTwo.off('click').on('click', inicarFormulario3)
    } else {

        $containerBtnFormTwo.addClass('disabled')
        $BtnFormTwo.addClass('disabled')
        $BtnFormTwo.off('click');
    }
}
function inicarFormulario3() {
    $stepText.text('Passo 3 de 3 - Fale sobre voce ');
    $stepDescription.text('Para que pssamos filtrar melhor voce no processo , conte-nos um pouco mais sobre suas habilidades e pontos positivos. ')
    $stepTwo.hide();
    $stepThree.show();

    $inputHabilidades.keyup(function () {
        habilidadesValido = validarInput(this, minLengthTextArea);
        validarFormularioTres();
    });

    $inputPontosForte.keyup(function () {
        pontosForteValido = validarInput(this, minLengthTextArea);
        validarFormularioTres();
    });
    async function salvarNoTrello(){
        try {
            const nome = $inputNome.val();
            const sobrenome = $inputSobrenome.val();
            const email = $inputEmail.val();
            const dataNascimento = $inputDataNascimento.val();
            const minibio = $inputMinibio.val();
            const endereco = $inputEndereco.val();
            const complemento = $inputComplemento.val();
            const cidade = $inputCidade.val();
            const cep = $inputCep.val();
            const habilidades = $inputHabilidades.val();
            const pontosForte = $inputPontosForte.val();

            if (!nome || !sobrenome || !email || !dataNascimento
                || !endereco || !cidade || !cep || !habilidades
                || !pontosForte) {

                return alert('Favor preencher todos os dados obrigatórios para seguirmos!')

            }

            const body = {
                name: "Candidato - " + nome + " "  + sobrenome,
                desc: ` 
                         seguem dados do canditado(a):

                         ---------- Dados pessoais------------
                         Nome : ${nome}
                         sobrenome: ${sobrenome}
                         Email: ${email}
                         Data de nascimento : ${dataNascimento}
                         Minibio: ${minibio}

                         ---------- Dados de Endereço------------
                         Endereço : ${endereco}
                         Complemento: ${complemento}
                         Cidade: ${cidade}
                         Cep : ${cep}
                         
                         ---------- Dados do Candidato(a)------------
                         Habilidades : ${habilidades}
                         Pontos Forte: ${pontosForte}
                        `
            }
    

            await fetch(' https://api.trello.com/1/cards?idList=6528388c0552e308ef1f0db1&key=e7dbf20bb20e2f049dcb77d31d02a3ad&token=ATTA0cf9fab1053f6f64c1ee1714f2c5dec397abc0910bce453cbea41aee0af77b28B015CA67 ', {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },

                body: JSON.stringify(body)
            });
            return finalizarFormulario();
        } catch(e){

            console.log('Ocorreu erro ao salvar no Trello:', e);
        }
    }

function validarFormularioTres() {
    if (habilidadesValido && pontosForteValido) {
        $containerBtnFormThree.removeClass('disabled');
        $BtnFormThree.removeClass('disabled');
        $BtnFormThree.off('click').on('click',salvarNoTrello);

    } else {
        $containerBtnFormThree.addClass('disabled');
        $BtnFormThree.addClass('disabled');
        $BtnFormThree.off('click');


    }
}
    function finalizarFormulario() {
        $stepThree.hide();
        $stepDescription.hide();
        $title.text('Inscrição realizada com sucessso!')
        $stepText.text('Agradecemos sua inscrição, estraremos em contato assim que possível, nosso prazo de análise é de cinco dias úteis.')

    }
}

function init() {
    $stepText.text('Passo 1 de 3 - Dados Pessoais');
    $stepDescription.text('Descreva seus dados para que passamos te conhecer melhor.');
    $stepTwo.hide();
    $stepThree.hide();

    $inputNome.keyup(function () {
        nomeValido = validarInput(this, minLengthText);
        validaFormularioUm();
    });

    $inputSobrenome.keyup(function () {
        sobrenomeValido = validarInput(this, minLengthText);
        validaFormularioUm();

    });
    $inputDataNascimento.keyup(function () {
        dataNascimentoValido = validarInput(this, minLengthText);
        validaFormularioUm();
    });
    $inputEmail.keyup(function () {
        emailValido = validarInput(this, null, null, emailRegex);
        validaFormularioUm();
    });

    $inputDataNascimento.change(function () {
        dataNascimentoValido = validarInput(this, minLengthText);
        validaFormularioUm();
    });
    $inputMinibio.keyup(function () {
        validaFormularioUm();
    });

    $inputDataNascimento.on('focus', function () {
        this.type = 'date';

    });
    $inputDataNascimento.on('blur', function () {
        if (!this.value) {
            this.type = 'text';
        }

    });

}
init();