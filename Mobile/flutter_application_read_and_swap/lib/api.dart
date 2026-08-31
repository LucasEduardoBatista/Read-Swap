import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dados.dart';

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override String toString() => message;
}

class Api {
  static const String baseUrl = String.fromEnvironment(
    'READSWAP_API_URL',
    defaultValue: 'http://localhost:8080',
  );
  static final http.Client _client = http.Client();
  static String? _token;

  static Map<String, String> get _headers => {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    if (_token case final token?) 'Authorization': 'Bearer $token',
  };

  static dynamic _decode(http.Response response) {
    dynamic data;
    if (response.bodyBytes.isNotEmpty) {
      try { data = jsonDecode(utf8.decode(response.bodyBytes)); } catch (_) {}
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(data is Map ? (data['erro']?.toString() ?? 'Erro ${response.statusCode}') : 'Erro ${response.statusCode}');
    }
    return data;
  }

  static Future<http.Response> _request(String method, String path, [Map<String, dynamic>? data]) {
    final uri = Uri.parse('$baseUrl$path');
    final body = data == null ? null : jsonEncode(data);
    return switch (method) {
      'GET' => _client.get(uri, headers: _headers),
      'POST' => _client.post(uri, headers: _headers, body: body),
      'PUT' => _client.put(uri, headers: _headers, body: body),
      'DELETE' => _client.delete(uri, headers: _headers),
      _ => throw ArgumentError('Método HTTP inválido'),
    };
  }

  static Usuario _usuario(Map<String, dynamic> d) => Usuario(
    id: d['id'] as int?, nome: d['nome'] ?? '', email: d['email'] ?? '', senha: '',
    localizacao: (d['cidade'] ?? '').toString().isNotEmpty, cidade: d['cidade'] ?? '',
    fotoPerfil: d['foto'], generosFavoritos: List<String>.from(d['generos'] ?? const []),
  );

  static Future<Usuario> login(String email, String senha) async {
    final response = await _request('POST', '/auth/login', {'email': email.trim(), 'senha': senha});
    final data = Map<String, dynamic>.from(_decode(response));
    _token = data['token'] as String;
    return DadosApp.usuarioLogado = _usuario(Map<String, dynamic>.from(data['usuario']));
  }

  static Future<Usuario> cadastrar(String nome, String email, String senha) async {
    final response = await _request('POST', '/auth/register', {'nome': nome.trim(), 'email': email.trim(), 'senha': senha});
    final data = Map<String, dynamic>.from(_decode(response));
    _token = data['token'] as String;
    return DadosApp.usuarioLogado = _usuario(Map<String, dynamic>.from(data['usuario']));
  }

  static Future<Usuario> carregarPerfil() async {
    final response = await _request('GET', '/me');
    return DadosApp.usuarioLogado = _usuario(Map<String, dynamic>.from(_decode(response)));
  }

  static Future<Usuario> atualizarPerfil(String nome, String cidade, List<String> generos, {String? foto}) async {
    final response = await _request('PUT', '/me', {
      'nome': nome, 'cidade': cidade, 'generos': generos,
      if (foto != null) 'foto': foto,
    });
    return DadosApp.usuarioLogado = _usuario(Map<String, dynamic>.from(_decode(response)));
  }

  static Future<List<Livro>> listarLivros() async {
    final response = await _request('GET', '/books');
    final data = _decode(response) as List;
    return DadosApp.livros = data.map((e) => Livro(
      id: e['id'] as int?, nome: e['nome'] ?? '', autor: e['autor'] ?? '', editora: e['editora'] ?? '',
      ano: '${e['ano'] ?? ''}', conservacao: e['estado'] ?? '', observacoes: e['observacoes'] ?? '',
      genero: e['genero'] ?? '', foto: e['foto'], trocado: e['trocado'] == true,
    )).toList();
  }

  static Map<String, dynamic> _livroData(Livro livro) => {
    'nome': livro.nome, 'autor': livro.autor, 'editora': livro.editora,
    'ano': livro.ano, 'estado': livro.conservacao,
    'observacoes': livro.observacoes, 'genero': livro.genero,
    if (livro.foto != null) 'foto': livro.foto,
  };

  static Future<void> salvarLivro(Livro livro) async {
    final method = livro.id == null ? 'POST' : 'PUT';
    final path = livro.id == null ? '/books' : '/books/${livro.id}';
    final data = Map<String, dynamic>.from(_decode(await _request(method, path, _livroData(livro))));
    livro.id = data['id'] as int?;
    await listarLivros();
  }

  static Future<void> excluirLivro(int id) async {
    _decode(await _request('DELETE', '/books/$id'));
    await listarLivros();
  }

  static Future<List<Map<String, dynamic>>> listarSwaps() async =>
      List<Map<String, dynamic>>.from(_decode(await _request('GET', '/swaps')) as List);

  static Future<Map<String, dynamic>> avaliar(int livroId, bool gostou) async =>
      Map<String, dynamic>.from(_decode(await _request('POST', '/swaps', {'livro_id': livroId, 'gostou': gostou})));

  static Future<List<Map<String, dynamic>>> contatos() async =>
      List<Map<String, dynamic>>.from(_decode(await _request('GET', '/matches')) as List);

  static Future<List<Map<String, dynamic>>> mensagens(int contatoId) async =>
      List<Map<String, dynamic>>.from(
        _decode(await _request('GET', '/conversations/$contatoId')) as List,
      );

  static Future<Map<String, dynamic>> enviarMensagem(int contatoId, String texto) async =>
      Map<String, dynamic>.from(
        _decode(await _request('POST', '/conversations/$contatoId', {'texto': texto.trim()})),
      );

  static Future<void> logout() async {
    if (_token != null) { try { _decode(await _request('POST', '/auth/logout')); } catch (_) {} }
    _token = null; DadosApp.usuarioLogado = null; DadosApp.livros = [];
  }
}
