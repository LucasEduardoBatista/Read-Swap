class Usuario {
  String nome;
  String email;
  String senha;
  bool localizacao;

  Usuario({
    required this.nome,
    required this.email,
    required this.senha,
    required this.localizacao,
  });
}

class Livro {
  String nome;
  String autor;
  String editora;
  String ano;
  String conservacao;
  String observacoes;
  String genero;

  Livro({
    required this.nome,
    required this.autor,
    required this.editora,
    required this.ano,
    required this.conservacao,
    required this.observacoes,
    required this.genero,
  });
}

class DadosApp {
  static List<Usuario> usuarios = [];

  static Usuario? usuarioLogado;

  static List<Livro> livros = [];
}