class Usuario {
  int? id;
  String nome;
  String email;
  String senha;
  bool localizacao;

  String? fotoPerfil;
  String cidade;
  List<String> generosFavoritos;

  Usuario({
    this.id,
    required this.nome,
    required this.email,
    required this.senha,
    required this.localizacao,
    this.fotoPerfil,
    this.cidade = '',
    this.generosFavoritos = const [],
  });
}

class Livro {
  int? id;
  String nome;
  String autor;
  String editora;
  String ano;
  String conservacao;
  String observacoes;
  String genero;
  String? foto;
  bool trocado;

  Livro({
    this.id,
    required this.nome,
    required this.autor,
    required this.editora,
    required this.ano,
    required this.conservacao,
    required this.observacoes,
    required this.genero,
    this.foto,
    this.trocado = false,
  });
}

class DadosApp {
  static List<Usuario> usuarios = [];

  static Usuario? usuarioLogado;

  static List<Livro> livros = [];
}
