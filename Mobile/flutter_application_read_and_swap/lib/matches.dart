import 'package:flutter/material.dart';

import 'api.dart';
import 'app_navbar.dart';
import 'conversa.dart';
import 'image_data.dart';

class Matches extends StatefulWidget {
  const Matches({super.key});
  @override
  State<Matches> createState() => _MatchesState();
}

class _MatchesState extends State<Matches> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _recarregar();
  }

  void _recarregar() => _future = Api.contatos();

  Future<void> _atualizar() async {
    setState(_recarregar);
    await _future;
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFFFE8D4),
    appBar: AppBar(
      backgroundColor: Colors.transparent,
      automaticallyImplyLeading: false,
      title: const Text('Conversas', style: TextStyle(color: Color(0xFF403833), fontWeight: FontWeight.bold)),
    ),
    body: FutureBuilder<List<Map<String, dynamic>>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) return const Center(child: CircularProgressIndicator());
        if (snapshot.hasError) {
          return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.cloud_off_rounded, size: 48, color: Colors.grey),
            const SizedBox(height: 12),
            Text(snapshot.error.toString(), textAlign: TextAlign.center),
            const SizedBox(height: 10),
            FilledButton(onPressed: () => setState(_recarregar), child: const Text('Tentar novamente')),
          ]));
        }
        final contatos = snapshot.data ?? [];
        if (contatos.isEmpty) {
          return const Center(child: Padding(
            padding: EdgeInsets.all(32),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.favorite_border_rounded, size: 64, color: Color(0xFFFF6B6B)),
              SizedBox(height: 16),
              Text('Você ainda não possui matches.', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 6),
              Text('Quando duas pessoas curtirem seus livros, a conversa aparecerá aqui.', textAlign: TextAlign.center),
            ]),
          ));
        }
        return RefreshIndicator(
          onRefresh: _atualizar,
          child: ListView.separated(
            padding: const EdgeInsets.fromLTRB(14, 8, 14, 24),
            itemCount: contatos.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (_, index) => _contato(contatos[index]),
          ),
        );
      },
    ),
    bottomNavigationBar: const AppNavbar(selectedIndex: 1),
  );

  Widget _contato(Map<String, dynamic> contato) {
    final contatoId = contato['id'] is int
        ? contato['id'] as int
        : int.tryParse('${contato['id']}');
    final foto = imageProviderFromData(contato['foto'] as String?);
    final ultima = (contato['ultimaMensagem'] ?? '').toString();
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        leading: CircleAvatar(
          radius: 28,
          backgroundColor: const Color(0xFFFFE5E5),
          backgroundImage: foto,
          child: foto == null ? const Icon(Icons.person_rounded, color: Color(0xFFFF6B6B)) : null,
        ),
        title: Text((contato['nome'] ?? '').toString(), style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF403833))),
        subtitle: Text(ultima.isEmpty ? 'Novo match — diga oi!' : ultima, maxLines: 1, overflow: TextOverflow.ellipsis),
        trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFFFF6B6B)),
        onTap: contatoId == null ? null : () async {
          await Navigator.push(context, MaterialPageRoute(builder: (_) => Conversa(
            contatoId: contatoId,
            nome: (contato['nome'] ?? '').toString(),
            foto: contato['foto'] as String?,
          )));
          if (mounted) setState(_recarregar);
        },
      ),
    );
  }
}
