import 'dart:convert';
import 'package:flutter/material.dart';
import 'api.dart';
import 'app_navbar.dart';

class Mainpage extends StatefulWidget {
  const Mainpage({super.key});
  @override State<Mainpage> createState() => _MainpageState();
}

class _MainpageState extends State<Mainpage> {
  List<Map<String, dynamic>> livros = [];
  bool carregando = true;
  String? erro;

  @override void initState() { super.initState(); carregar(); }
  Future<void> carregar() async {
    try { livros = await Api.listarSwaps(); erro = null; } catch (e) { erro = e.toString(); }
    if (mounted) setState(() => carregando = false);
  }
  ImageProvider? imagem(String? v) => v != null && v.startsWith('data:')
      ? MemoryImage(base64Decode(v.substring(v.indexOf(',') + 1))) : null;
  Future<void> avaliar(bool gostou) async {
    if (livros.isEmpty) return;
    try {
      final r = await Api.avaliar(livros.first['id'] as int, gostou);
      if (!mounted) return;
      setState(() => livros.removeAt(0));
      if (r['match'] == true) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Deu match!')));
    } catch (e) { if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString()))); }
  }

  @override Widget build(BuildContext context) {
    final l = livros.isEmpty ? null : livros.first;
    final capa = imagem(l?['img']);
    Widget body;
    if (carregando) {
      body = const Center(child: CircularProgressIndicator());
    } else if (erro != null) {
      body = Center(child: Text(erro!));
    } else if (l == null) {
      body = const Center(child: Text('Não há mais livros disponíveis.'));
    } else {
      body = Padding(padding: const EdgeInsets.all(20), child: Column(children: [
        Expanded(child: Card(clipBehavior: Clip.antiAlias, child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Expanded(child: capa != null ? Image(image: capa, fit: BoxFit.cover) : const Icon(Icons.menu_book, size: 100)),
          Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(l['titulo'] ?? '', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text(l['autor'] ?? ''), Text('${l['dono'] ?? ''} • ${l['cidade'] ?? ''}'),
            Text((l['generos'] as List? ?? []).join(', ')),
          ])),
        ]))),
        Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
          FloatingActionButton(heroTag: 'n', onPressed: () => avaliar(false), child: const Icon(Icons.close)),
          FloatingActionButton(heroTag: 's', backgroundColor: const Color(0xFFFF6B6B), onPressed: () => avaliar(true), child: const Icon(Icons.favorite, color: Colors.white)),
        ]), const SizedBox(height: 15),
      ]));
    }
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 232, 212),
      appBar: AppBar(title: const Text('Read&Swap'), backgroundColor: Colors.transparent),
      body: body,
      bottomNavigationBar: const AppNavbar(selectedIndex: 0),
    );
  }
}
