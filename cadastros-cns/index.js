var firebaseConfig = {
    apiKey: "AIzaSyBO8gw7FJii-rUZkaaoA8dW5rrP7Wckh4c",
    authDomain: "mirelle-natura.firebaseapp.com",
    databaseURL: "https://mirelle-natura.firebaseio.com",
    projectId: "mirelle-natura",
    storageBucket: "mirelle-natura.appspot.com",
    messagingSenderId: "982547435243",
    appId: "1:982547435243:web:eb943e76ed9116456038ae"
};




firebase.initializeApp(firebaseConfig);

$(function(){ 

	$("#filtro").keyup(function(){
	  var texto = $(this).val();
	  $(".resultado").each(function(){
        var resultado = $(this).text().toUpperCase().indexOf(texto.toUpperCase());
		if(resultado < 0) {
		  $(this).fadeOut();
		}else {
		  $(this).fadeIn();
		}
	  }); 
  
	});
  
  });

function mascaras(){
	$('#dataCadastroDigital').mask('00/00/0000');
	$('#telefone').mask('(00) 0000-00009');
	$('#telefone').blur(function(event) {
	if($(this).val().length == 15){
		$('#telefone').mask('(00) 00000-0009');
	} else {
		$('#telefone').mask('(00) 0000-00009');
	}
	});
}
mascaras();
let idConsultor = false;

document.getElementById('form').addEventListener('submit', (e)=>{
	let nome = document.getElementById('nome').value;
	let codigo = document.getElementById('codigo').value;
	let senha = document.getElementById('senha').value;
	let email = document.getElementById('email').value;
	let senhaEmail = document.getElementById('senhaEmail').value;
	let dataCadastroDigital = document.getElementById('dataCadastroDigital').value;
	let senhaContaNatura = document.getElementById('senhaContaNatura').value;
	let telefone = document.getElementById('telefone').value;
	let whatsapp = document.getElementById('whatsapp').checked;
	let nivel = document.getElementById('nivel').value;
	let observacoes = document.getElementById('observacoes').value;

	e.preventDefault();
	criarConsultor(nome, codigo, senha, email, senhaEmail, dataCadastroDigital, senhaContaNatura, telefone, whatsapp, nivel, observacoes);
	form.reset();
});

function criarConsultor(nome, codigo, senha, email, senhaEmail, dataCadastroDigital, senhaContaNatura, telefone, whatsapp, nivel, observacoes){
	let nomeNovo = nome.toUpperCase();
	const consultorData = {
		id: '',
		nome: nomeNovo,
		codigo,
		senha,
		email,
		senhaEmail,
		dataCadastroDigital,
		senhaContaNatura,
		telefone,
		whatsapp,
		nivel,
		observacoes
	}
	if(!idConsultor){
		idConsultor = firebase.database().ref().child('consultores').push().key
	}
	consultorData.id = idConsultor;
	let updates = {};
	updates['/consultores/' + idConsultor] = consultorData;
	
	let consultorRef = firebase.database().ref();
	consultorRef.update(updates)
	.then(()=>{
		return {success: true, message: 'Criado'}
	})
	.catch((error)=>{
		return {success: false, message: `Erro: ${error.message}`}
	})
	idConsultor = false;
	carregarConsultores()
}

function carregarConsultores() {
	document.getElementById("contentQuery").innerHTML = '';
	var consultor = firebase.database().ref("consultores/").orderByChild("nome");
	consultor.on("child_added", function(data){
		var Resultado = data.val();
		let wpp = '';
		if(Resultado.whatsapp){
			wpp = '<i class="fab fa-whatsapp"></i>';
		}
		document.getElementById("contentQuery").innerHTML += `
			<div class="row resultado">
				<div class="col-12">
					<div class="card mb-3">
						<div class="card-body">
							<h5 class="card-title">${Resultado.nome}<span class="text-muted"> - ${Resultado.nivel}</span></h5>
							<p class="card-text"><i class="fas fa-user"></i> <b>Código do Consultor:</b> ${Resultado.codigo}</p> 
							<p class="card-text"><i class="fas fa-lock"></i> <b>Senha do Consultor:</b> ${Resultado.senha}</p>
							<p class="card-text"><i class="fas fa-phone"></i> <b>Telefone:</b> ${Resultado.telefone} ${wpp}</p>
							<p class="card-text"><i class="fas fa-envelope"></i> <b>E-mail:</b> ${Resultado.email} <span class="text-muted">|</span> <i class="fas fa-lock"></i> ${Resultado.senhaEmail}</p>
							<p class="card-text"><i class="fas fa-calendar-day"></i> <b>Data Cadastro Digital:</b> ${Resultado.dataCadastroDigital} </p>
							<p class="card-text"><i class="fas fa-lock"></i> <b>Senha Conta Natura:</b> ${Resultado.senhaContaNatura}</p>
							<p class="card-text"><i class="fas fa-comment-dots"></i> <b>Observação:</b> ${Resultado.observacoes}</p>
						</div>
						<div class="card-footer">
							<button class="btn btn-warning" style="color: #FFF" onClick="atualizar('${Resultado.id}', '${Resultado.nome}', '${Resultado.codigo}', '${Resultado.senha}', '${Resultado.email}', '${Resultado.senhaEmail}', '${Resultado.dataCadastroDigital}', '${Resultado.senhaContaNatura}', '${Resultado.telefone}', ${Resultado.whatsapp}, '${Resultado.nivel}', '${Resultado.observacoes}')">Editar</button>
							<button class="btn btn-danger" id="excluirConsultor" onClick="deletarConsultor('${Resultado.id}', '${Resultado.nome}')">Excluir</button>
						</div>
					</div>
				</div>
			</div>
		`
	});
}

function deletarConsultor(id, nome){
	$('#modalExcluir').modal('show');
	$('#modalNomeConsultor').text('"' + nome + '"');
	$('#btnExcluir').attr('onClick', "apagarConsultor('" + id + "')")
}
function apagarConsultor(id){
	let consultor = firebase.database().ref("consultores/"+id);
	consultor.remove();
	$('#modalExcluir').modal('hide');
	carregarConsultores();
}

function atualizar(id, nome, codigo, senha, email, senhaEmail, dataCadastroDigital, senhaContaNatura, telefone, whatsapp, nivel, observacoes) {
	$("html, body").animate({ scrollTop: 0 }, "slow");
	document.getElementById("contentForm").innerHTML = `
		<form class="mb-3" id="form2">
		<div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="nome">Nome Completo</label>
                        <input type="text" name="nome" id="nome" class="form-control" placeholder="Digite o nome..." required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="codigo">Código Consultor</label>
                        <input type="text" name="codigo" id="codigo" class="form-control"
                            placeholder="Digite o código..." required>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="senha">Senha</label>
                        <input type="text" name="senha" id="senha" class="form-control" placeholder="Digite a senha...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input type="text" name="email" id="email" class="form-control"
                            placeholder="Digite o e-mail...">
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="senhaEmail">Senha do E-mail</label>
                        <input type="text" name="senhaEmail" id="senhaEmail" class="form-control" placeholder="Digite a senha do e-mail...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="dataCadastroDigital">Data Cadastro Digital</label>
                        <input type="text" name="dataCadastroDigital" id="dataCadastroDigital" class="form-control"
                            placeholder="Digite a data...">
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="senhaContaNatura">Senha da conta Natura</label>
                        <input type="text" name="senhaContaNatura" id="senhaContaNatura" class="form-control" placeholder="Digite a senha da conta Natura...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <label for="telefone">Telefone</label>
                        <input type="text" name="telefone" id="telefone" class="form-control"
                            placeholder="Digite o telefone...">
                    </div>
                </div>

                <div class="col-sm-12 col-md-2 d-flex align-items-end">
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="whatsapp">
                        <label class="form-check-label" for="whatsapp">Whatsapp</label>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="nivel">Nível</label>
                        <select class="form-control" id="nivel">
                            <option>Selecione...</option>
                            <option value="Semente">Semente</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Prata">Prata</option>
                            <option value="Ouro">Ouro</option>
                            <option value="Diamante">Diamante</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="observacoes">Observações</label>
                        <textarea name="observacoes" id="observacoes" cols="30" rows="10" class="form-control" placeholder="Digite sua observação..."></textarea>
                    </div>
                </div>
            </div>
				<button class="btn btn-secondary" id="btnCancelar" onClick="resetFormulario()">Cancelar</button>
				<button type="submit" class="btn btn-success" id="btnSalvar" onclick="salvarConsultor()">Salvar</button>
			</form>
		`;
		mascaras();
		document.getElementById("form2").addEventListener("submit", (e)=>{
			e.preventDefault();
			
		});
		document.getElementById("nome").value = nome;
		document.getElementById("codigo").value = codigo;
		document.getElementById("senha").value = senha;
		document.getElementById("email").value = email;
		document.getElementById("senhaEmail").value = senhaEmail;
		document.getElementById("dataCadastroDigital").value = dataCadastroDigital;
		document.getElementById("senhaContaNatura").value = senhaContaNatura;
		document.getElementById("telefone").value = telefone;
		document.getElementById("codigo").value = codigo;
		document.getElementById("whatsapp").checked = whatsapp;
		document.getElementById("nivel").value = nivel;
		document.getElementById("observacoes").value = observacoes;
		idConsultor = id;
}



function resetFormulario(){
	idConsultor = false;
	document.getElementById("contentForm").innerHTML = `
	<form class="mb-3" id="form">
	<div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="nome">Nome Completo</label>
                        <input type="text" name="nome" id="nome" class="form-control" placeholder="Digite o nome..." required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="codigo">Código Consultor</label>
                        <input type="text" name="codigo" id="codigo" class="form-control"
                            placeholder="Digite o código..." required>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="senha">Senha</label>
                        <input type="text" name="senha" id="senha" class="form-control" placeholder="Digite a senha...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input type="text" name="email" id="email" class="form-control"
                            placeholder="Digite o e-mail...">
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="senhaEmail">Senha do E-mail</label>
                        <input type="text" name="senhaEmail" id="senhaEmail" class="form-control" placeholder="Digite a senha do e-mail...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="dataCadastroDigital">Data Cadastro Digital</label>
                        <input type="text" name="dataCadastroDigital" id="dataCadastroDigital" class="form-control"
                            placeholder="Digite a data...">
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="senhaContaNatura">Senha da conta Natura</label>
                        <input type="text" name="senhaContaNatura" id="senhaContaNatura" class="form-control" placeholder="Digite a senha da conta Natura...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <label for="telefone">Telefone</label>
                        <input type="text" name="telefone" id="telefone" class="form-control"
                            placeholder="Digite o telefone...">
                    </div>
                </div>

                <div class="col-sm-12 col-md-2 d-flex align-items-end">
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="whatsapp">
                        <label class="form-check-label" for="whatsapp">Whatsapp</label>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="form-group">
                        <label for="nivel">Nível</label>
                        <select class="form-control" id="nivel">
                            <option>Selecione...</option>
                            <option value="Semente">Semente</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Prata">Prata</option>
                            <option value="Ouro">Ouro</option>
                            <option value="Diamante">Diamante</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="observacoes">Observações</label>
                        <textarea name="observacoes" id="observacoes" cols="30" rows="10" class="form-control" placeholder="Digite sua observação..."></textarea>
                    </div>
                </div>
            </div>
	<button type="submit" class="btn btn-primary">Cadastrar</button>
</form>
	`;
	mascaras();
	document.getElementById('form').addEventListener('submit', (e)=>{
		let nome = document.getElementById('nome').value;
		let codigo = document.getElementById('codigo').value;
		let senha = document.getElementById('senha').value;
		let email = document.getElementById('email').value;
		let senhaEmail = document.getElementById('senhaEmail').value;
		let dataCadastroDigital = document.getElementById('dataCadastroDigital').value;
		let senhaContaNatura = document.getElementById('senhaContaNatura').value;
		let telefone = document.getElementById('telefone').value;
		let whatsapp = document.getElementById('whatsapp').checked;
		let nivel = document.getElementById('nivel').value;
		let observacoes = document.getElementById('observacoes').value;

		e.preventDefault();
		criarConsultor(nome, codigo, senha, email, senhaEmail, dataCadastroDigital, senhaContaNatura, telefone, whatsapp, nivel, observacoes);
		form.reset();
	});
}



function salvarConsultor(){
	let nome = document.getElementById('nome').value;
	nome = nome.toUpperCase();
	let codigo = document.getElementById('codigo').value;
	let senha = document.getElementById('senha').value;
	let email = document.getElementById('email').value;
	let senhaEmail = document.getElementById('senhaEmail').value;
	let dataCadastroDigital = document.getElementById('dataCadastroDigital').value;
	let senhaContaNatura = document.getElementById('senhaContaNatura').value;
	let telefone = document.getElementById('telefone').value;
	let whatsapp = document.getElementById('whatsapp').checked;
	let nivel = document.getElementById('nivel').value;
	let observacoes = document.getElementById('observacoes').value;
	const consultorData = {
		id: idConsultor,
		nome,
		codigo,
		senha,
		email,
		senhaEmail,
		dataCadastroDigital,
		senhaContaNatura,
		telefone,
		whatsapp,
		nivel,
		observacoes
	}
	let db = firebase.database().ref("consultores/"+idConsultor);
	db.set(consultorData);
	carregarConsultores();
	resetFormulario();
}