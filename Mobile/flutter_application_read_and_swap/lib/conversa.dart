import 'dart:async';

import 'package:flutter/material.dart';

import 'api.dart';
import 'app_navbar.dart';
import 'dados.dart';
import 'image_data.dart';

class Conversa extends StatefulWidget {
  final int contatoId;
  final String nome;
  final String? foto;

  const Conversa({
    super.key,
    required this.contatoId,
    required this.nome,
    this.foto,
  });

  @override
  State<Conversa> createState() => _ConversaState();
}

class _ConversaState extends State<Conversa> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  List<Map<String, dynamic>> _mensagens = [];
  bool _carregando = true;
  bool _enviando = false;
  String? _erro;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _carregar();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _carregar(silencioso: true));
  }

  Future<void> _carregar({bool silencioso = false}) async {
    try {
      final mensagens = await Api.mensagens(widget.contatoId);
      if (!mounted) return;
      final mudou = mensagens.length != _mensagens.length;
      setState(() {
        _mensagens = mensagens;
        _carregando = false;
        _erro = null;
      });
      if (mudou) _irParaFim();
    } catch (erro) {
      if (!mounted || silencioso) return;
      setState(() {
        _erro = erro.toString();
        _carregando = false;
      });
    }
  }

  Future<void> _enviar() async {
    final texto = _controller.text.trim();
    if (texto.isEmpty || _enviando) return;
    setState(() => _enviando = true);
    try {
      final mensagem = await Api.enviarMensagem(widget.contatoId, texto);
      if (!mounted) return;
      _controller.clear();
      setState(() {
        _mensagens.add(mensagem);
        _enviando = false;
      });
      _irParaFim();
    } catch (erro) {
      if (!mounted) return;
      setState(() => _enviando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Não foi possível enviar: $erro')),
      );
    }
  }

  void _irParaFim() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final foto = imageProviderFromData(widget.foto);
    return Scaffold(
      backgroundColor: const Color(0xFFFFE8D4),
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF403833),
        titleSpacing: 0,
        title: Row(children: [
          CircleAvatar(
            backgroundColor: const Color(0xFFFFE5E5),
            backgroundImage: foto,
            child: foto == null ? const Icon(Icons.person_rounded) : null,
          ),
          const SizedBox(width: 10),
          Expanded(child: Text(widget.nome, overflow: TextOverflow.ellipsis)),
        ]),
      ),
      body: Column(children: [
        Expanded(child: _conteudo()),
        SafeArea(
          top: false,
          child: Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
            child: Row(children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  minLines: 1,
                  maxLines: 5,
                  textCapitalization: TextCapitalization.sentences,
                  onSubmitted: (_) => _enviar(),
                  decoration: InputDecoration(
                    hintText: 'Digite uma mensagem…',
                    filled: true,
                    fillColor: const Color(0xFFFFF5EC),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filled(
                onPressed: _enviando ? null : _enviar,
                style: IconButton.styleFrom(backgroundColor: const Color(0xFFFF6B6B)),
                icon: _enviando
                    ? const SizedBox.square(
                        dimension: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.send_rounded, color: Colors.white),
              ),
            ]),
          ),
        ),
      ]),
      bottomNavigationBar: const AppNavbar(selectedIndex: 1),
    );
  }

  Widget _conteudo() {
    if (_carregando) return const Center(child: CircularProgressIndicator());
    if (_erro != null) {
      return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        Text(_erro!, textAlign: TextAlign.center),
        const SizedBox(height: 8),
        OutlinedButton(onPressed: _carregar, child: const Text('Tentar novamente')),
      ]));
    }
    if (_mensagens.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Text('Comece a conversa sobre os livros que deram match.', textAlign: TextAlign.center),
        ),
      );
    }
    final meuId = DadosApp.usuarioLogado?.id;
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(14),
      itemCount: _mensagens.length,
      itemBuilder: (_, index) {
        final mensagem = _mensagens[index];
        final remetente = mensagem['remetente'] ?? mensagem['idRemetente'];
        final minha = remetente == meuId || '$remetente' == '$meuId';
        return Align(
          alignment: minha ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 330),
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 7),
            decoration: BoxDecoration(
              color: minha ? const Color(0xFFFF6B6B) : Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(18),
                topRight: const Radius.circular(18),
                bottomLeft: Radius.circular(minha ? 18 : 4),
                bottomRight: Radius.circular(minha ? 4 : 18),
              ),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(
                (mensagem['texto'] ?? '').toString(),
                style: TextStyle(color: minha ? Colors.white : const Color(0xFF403833), fontSize: 16),
              ),
              const SizedBox(height: 3),
              Text(
                _hora((mensagem['data'] ?? '').toString()),
                style: TextStyle(fontSize: 10, color: minha ? Colors.white70 : Colors.black45),
              ),
            ]),
          ),
        );
      },
    );
  }

  String _hora(String data) {
    final valor = DateTime.tryParse(data)?.toLocal();
    if (valor == null) return '';
    return '${valor.hour.toString().padLeft(2, '0')}:${valor.minute.toString().padLeft(2, '0')}';
  }
}
