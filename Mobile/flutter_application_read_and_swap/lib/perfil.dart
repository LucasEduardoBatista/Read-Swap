import 'package:flutter/material.dart';

import 'package:flutter_application_read_and_swap/biblioteca.dart';
import 'package:flutter_application_read_and_swap/dados.dart';
import 'package:flutter_application_read_and_swap/editarperfil.dart';
import 'package:flutter_application_read_and_swap/login.dart';
import 'package:flutter_application_read_and_swap/api.dart';

import 'image_data.dart';
import 'app_navbar.dart';

class Perfil extends StatefulWidget {
  const Perfil({super.key});

  @override
  State<Perfil> createState() => _PerfilState();
}

class _PerfilState extends State<Perfil> {
  Usuario? usuario = DadosApp.usuarioLogado;

  final Color rosa = const Color(0xFFFF6B6B);
  final Color fundo = const Color(0xFFFFE8D4);
  final Color marrom = const Color(0xFF8A7362);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      // ==========================================================
      // APP BAR
      // ==========================================================

      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,

        title: Row(
          children: [
            Image.asset(
              "images/Read&SwapLOGOfundo.png",
              width: 40,
            ),

            const SizedBox(width: 6),

            const Text(
              "Read&Swap",
              style: TextStyle(
                fontSize: 34,
                color: Color(0xFFFF6B6B),
                fontWeight: FontWeight.bold,
                fontFamily: "Estonia",
              ),
            ),
          ],
        ),

        // ========================================================
        // MENU SANDUÍCHE
        // ========================================================

        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),

            child: IconButton(
              icon: const Icon(
                Icons.menu_rounded,
                size: 30,
                color: Color(0xFF5D5149),
              ),

              onPressed: () {
                _abrirMenu(context);
              },
            ),
          ),
        ],
      ),

      // ==========================================================
      // BODY
      // ==========================================================

      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),

        child: Padding(
          padding: const EdgeInsets.fromLTRB(
            18,
            5,
            18,
            25,
          ),

          child: Container(
            padding: const EdgeInsets.fromLTRB(
              20,
              25,
              20,
              25,
            ),

            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),

              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.07),
                  blurRadius: 18,
                  offset: const Offset(0, 6),
                ),
              ],
            ),

            child: Column(
              children: [

                // ==================================================
                // TÍTULO
                // ==================================================

                const Text(
                  "Meu Perfil",

                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF403833),
                  ),
                ),

                const SizedBox(height: 22),

                // ==================================================
                // FOTO DE PERFIL
                // ==================================================

                Container(
                  padding: const EdgeInsets.all(4),

                  decoration: BoxDecoration(
                    shape: BoxShape.circle,

                    border: Border.all(
                      color: Color(0xFFFF6B6B),
                      width: 3,
                    ),
                  ),

                  child: CircleAvatar(
                    radius: 68,

                    backgroundImage: imageProviderFromData(usuario?.fotoPerfil) ??
                        const AssetImage("assets/images/pfp.jfif"),
                  ),
                ),

                const SizedBox(height: 15),

                // ==================================================
                // NOME + LÁPIS
                // ==================================================

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,

                  children: [
                    Flexible(
                      child: Text(
                        usuario?.nome ?? "Usuário",

                        textAlign: TextAlign.center,

                        overflow: TextOverflow.ellipsis,

                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF403833),
                        ),
                      ),
                    ),

                    const SizedBox(width: 7),

                    Material(
                      color: const Color(0xFFFFE5E5),
                      shape: const CircleBorder(),

                      child: InkWell(
                        customBorder: const CircleBorder(),

                        onTap: () async {
                          await Navigator.push(
                            context,

                            MaterialPageRoute(
                              builder: (_) => Editarperfil(),
                            ),
                          );

                          setState(() {
                            usuario = DadosApp.usuarioLogado;
                          });
                        },

                        child: const Padding(
                          padding: EdgeInsets.all(8),

                          child: Icon(
                            Icons.edit_rounded,
                            size: 18,
                            color: Color(0xFFFF6B6B),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                // ==================================================
                // LOCALIZAÇÃO
                // ==================================================

                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),

                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF5EC),
                    borderRadius: BorderRadius.circular(20),
                  ),

                  child: Row(
                    mainAxisSize: MainAxisSize.min,

                    children: [
                      Icon(
                        Icons.location_on_rounded,
                        size: 19,
                        color: marrom,
                      ),

                      const SizedBox(width: 5),

                      Text(
                        usuario?.localizacao == true
                            ? "Localização ativada"
                            : "Localização desativada",

                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: marrom,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // ==================================================
                // ESTATÍSTICAS
                // ==================================================

                Row(
                  children: [
                    Expanded(
                      child: _estatistica(
                        icone: Icons.menu_book_rounded,
                        valor: DadosApp.livros.length.toString(),
                        texto: "Livros",
                        cor: rosa,
                      ),
                    ),

                    Container(
                      height: 65,
                      width: 1,
                      color: Colors.grey.shade200,
                    ),

                    Expanded(
                      child: _estatistica(
                        icone: Icons.swap_horiz_rounded,
                        valor: "0",
                        texto: "Trocas",
                        cor: const Color(0xFF5C8DDE),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 28),

                // ==================================================
                // GÊNEROS FAVORITOS
                // ==================================================

                const Text(
                  "Gêneros favoritos",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFF6B6B),
                  ),
                ),

                const SizedBox(height: 12),

                (usuario?.generosFavoritos == null ||
                        usuario!.generosFavoritos.isEmpty)
                    ? Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 18,
                          vertical: 16,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF5EC),
                          borderRadius: BorderRadius.circular(15),
                          border: Border.all(
                            color: const Color(0xFFFFD5C2),
                          ),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.auto_stories_rounded,
                              color: Color(0xFFFF6B6B),
                              size: 30,
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              "Nenhum gênero selecionado",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF403833),
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              "Selecione seus gêneros favoritos para encontrar livros que combinam com você.",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF7A6E66),
                              ),
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => Editarperfil(),
                                  ),
                                );

                                setState(() {
                                  usuario = DadosApp.usuarioLogado;
                                });
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: rosa,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 18,
                                  vertical: 10,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text(
                                "Selecionar gêneros",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                    : Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 8,
                        runSpacing: 8,
                        children: (usuario?.generosFavoritos ?? [])
                            .map(
                              (genero) => chip(genero),
                            )
                            .toList(),
                      ),

                const SizedBox(height: 28),

                // ==================================================
                // BIBLIOTECA
                // ==================================================

                SizedBox(
                  width: double.infinity,
                  height: 50,

                  child: ElevatedButton.icon(
                    icon: const Icon(
                      Icons.bookmark_rounded,
                    ),

                    label: const Text(
                      "Ver minha biblioteca",

                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    style: ElevatedButton.styleFrom(
                      backgroundColor: rosa,
                      foregroundColor: Colors.white,
                      elevation: 0,

                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),

                    onPressed: () {
                      Navigator.push(
                        context,

                        MaterialPageRoute(
                          builder: (_) => Biblioteca(),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),

      // ==========================================================
      // BOTTOM NAVIGATION
      // ==========================================================

      bottomNavigationBar: const AppNavbar(selectedIndex: 2),
    );
  }

  // ==========================================================
  // ESTATÍSTICA
  // ==========================================================

  Widget _estatistica({
    required IconData icone,
    required String valor,
    required String texto,
    required Color cor,
  }) {
    return Column(
      children: [
        Icon(
          icone,
          color: cor,
          size: 32,
        ),

        const SizedBox(height: 5),

        Text(
          valor,

          style: const TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),

        Text(
          texto,

          style: const TextStyle(
            fontWeight: FontWeight.w600,
            color: Color(0xFF6E625B),
          ),
        ),
      ],
    );
  }

  // ==========================================================
  // CHIP DE GÊNERO
  // ==========================================================

  Widget chip(String texto) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 13,
        vertical: 8,
      ),

      decoration: BoxDecoration(
        color: const Color(0xFFFFF1E8),

        borderRadius: BorderRadius.circular(20),

        border: Border.all(
          color: const Color(0xFFFFD5C2),
        ),
      ),

      child: Text(
        texto,

        style: const TextStyle(
          fontWeight: FontWeight.w600,
          color: Color(0xFF6E625B),
        ),
      ),
    );
  }

  // ==========================================================
  // MENU DE CONFIGURAÇÕES
  // ==========================================================

  void _abrirMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,

      builder: (context) {
        return Container(
          padding: const EdgeInsets.fromLTRB(
            20,
            12,
            20,
            25,
          ),

          decoration: const BoxDecoration(
            color: Colors.white,

            borderRadius: BorderRadius.vertical(
              top: Radius.circular(28),
            ),
          ),

          child: Material(
            color: Colors.transparent,
            child: Column(
              mainAxisSize: MainAxisSize.min,

            children: [

              // ==================================================
              // BARRINHA
              // ==================================================

              Container(
                width: 45,
                height: 5,

                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              const SizedBox(height: 20),

              // ==================================================
              // TÍTULO
              // ==================================================

              const Align(
                alignment: Alignment.centerLeft,

                child: Text(
                  "Configurações",

                  style: TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF403833),
                  ),
                ),
              ),

              const SizedBox(height: 15),
              
              // ==================================================
              // READ&SWAP PREMIUM
              // ==================================================

              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF5F5),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: const Color(0xFFFF6B6B).withOpacity(0.35),
                    width: 1.3,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFF6B6B).withOpacity(0.10),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),

                child: Material(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(18),
                  child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),

                  leading: CircleAvatar(
                    backgroundColor: const Color(0xFFFFE5E5),
                    child: Icon(
                      Icons.workspace_premium_rounded,
                      color: rosa,
                    ),
                  ),

                  title: Row(
                    children: [
                      const Flexible(
                        child: Text(
                          "Read&Swap",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF403833),
                          ),
                        ),
                      ),

                      const SizedBox(width: 7),

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFF6B6B),
                          borderRadius: BorderRadius.circular(7),
                        ),
                        child: const Text(
                          "PREMIUM",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  subtitle: const Padding(
                    padding: EdgeInsets.only(top: 3),
                    child: Text(
                      "Veja os planos e recursos exclusivos",
                      style: TextStyle(
                        color: Color(0xFF7A6E66),
                        fontSize: 12,
                      ),
                    ),
                  ),

                  trailing: const Icon(
                    Icons.chevron_right_rounded,
                    color: Color(0xFFFF6B6B),
                  ),

                  onTap: () {
                    Navigator.pop(context);

                    Future.delayed(
                      const Duration(milliseconds: 150),
                      () {
                        if (mounted) {
                          _abrirLojaPremium(context);
                        }
                      },
                    );
                  },
                  ),
                ),
              ),

              const Divider(),

              // ==================================================
              // EDITAR PERFIL
              // ==================================================

              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFFFFE5E5),

                  child: Icon(
                    Icons.edit_rounded,
                    color: Color(0xFFFF6B6B),
                  ),
                ),

                title: const Text(
                  "Editar perfil",

                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),

                subtitle: const Text(
                  "Alterar seus dados pessoais",
                ),

                trailing: const Icon(
                  Icons.chevron_right_rounded,
                ),

                onTap: () async {
                  Navigator.pop(context);

                  await Navigator.push(
                    context,

                    MaterialPageRoute(
                      builder: (_) => Editarperfil(),
                    ),
                  );

                  setState(() {
                    usuario = DadosApp.usuarioLogado;
                  });
                },
              ),

              const Divider(),

              // ==================================================
              // BIBLIOTECA
              // ==================================================

              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFFFFF1E8),

                  child: Icon(
                    Icons.bookmark_rounded,
                    color: Color(0xFFFF6B6B),
                  ),
                ),

                title: const Text(
                  "Minha biblioteca",

                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),

                subtitle: const Text(
                  "Veja seus livros cadastrados",
                ),

                trailing: const Icon(
                  Icons.chevron_right_rounded,
                ),

                onTap: () async {
                  Navigator.pop(context);

                  Navigator.push(
                    context,

                    MaterialPageRoute(
                      builder: (_) => Biblioteca(),
                    ),
                  );
                },
              ),

              const Divider(),

              // ==================================================
              // SAIR DA CONTA
              // ==================================================

              ListTile(
                leading: CircleAvatar(
                  backgroundColor: const Color(0xFFFFEEEE),

                  child: Icon(
                    Icons.logout_rounded,
                    color: Colors.red.shade400,
                  ),
                ),

                title: Text(
                  "Sair da conta",

                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.red.shade400,
                  ),
                ),

                onTap: () async {
                  final confirmar = await showDialog<bool>(
                    context: context,
                    builder: (dialogContext) => AlertDialog(
                      title: const Text('Sair da conta?'),
                      content: const Text(
                        'Você precisará entrar novamente para acessar seus livros e conversas.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(dialogContext, false),
                          child: const Text('Cancelar'),
                        ),
                        FilledButton.icon(
                          style: FilledButton.styleFrom(
                            backgroundColor: Colors.red.shade400,
                            foregroundColor: Colors.white,
                          ),
                          onPressed: () => Navigator.pop(dialogContext, true),
                          icon: const Icon(Icons.logout_rounded),
                          label: const Text('Sair'),
                        ),
                      ],
                    ),
                  );

                  if (confirmar != true || !mounted) return;

                  // Fecha o menu inferior antes de encerrar a sessão.
                  Navigator.pop(context);

                  await Api.logout();

                  if (!mounted) return;

                  Navigator.of(this.context).pushAndRemoveUntil(

                    MaterialPageRoute(
                      builder: (_) => Login(),
                    ),

                    (route) => false,
                  );
                },
              ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ==========================================================
  // LOJA PREMIUM
  // ==========================================================

  void _abrirLojaPremium(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,

      builder: (context) {
        return Container(
          padding: const EdgeInsets.fromLTRB(
            20,
            12,
            20,
            30,
          ),

          decoration: const BoxDecoration(
            color: Color(0xFF171414),

            borderRadius: BorderRadius.vertical(
              top: Radius.circular(30),
            ),
          ),

          child: Column(
            mainAxisSize: MainAxisSize.min,

            children: [

              // ==================================================
              // BARRINHA
              // ==================================================

              Container(
                width: 45,
                height: 5,

                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              const SizedBox(height: 22),

              // ==================================================
              // ÍCONE PREMIUM
              // ==================================================

              const Icon(
                Icons.workspace_premium_rounded,
                color: Color(0xFFFF6B6B),
                size: 48,
              ),

              const SizedBox(height: 8),

              // ==================================================
              // TÍTULO
              // ==================================================

              const Text(
                "Read&Swap Premium",

                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              const Text(
                "Desbloqueie recursos exclusivos",

                textAlign: TextAlign.center,

                style: TextStyle(
                  color: Colors.white60,
                  fontSize: 14,
                ),
              ),

              const SizedBox(height: 25),

              // ==================================================
              // PLANO MENSAL
              // ==================================================

              _planoPremium(
                context,

                titulo: "Premium Mensal",
                preco: "R\$ 14,90",
                descricao: "por mês",
                destaque: false,
              ),

              const SizedBox(height: 12),

              // ==================================================
              // PLANO ANUAL
              // ==================================================

              _planoPremium(
                context,

                titulo: "Premium Anual",
                preco: "R\$ 149,90",
                descricao: "por ano • melhor valor",
                destaque: true,
              ),

              const SizedBox(height: 18),

              // ==================================================
              // BENEFÍCIOS
              // ==================================================

              const Text(
                "• Livre de anúncios\n"
                "• Curtidas ilimitadas\n"
                "• Postagem de livros ilimitadas\n"
                "• Prioridade de visibilidade",

                textAlign: TextAlign.center,

                style: TextStyle(
                  color: Colors.white54,
                  height: 1.6,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ==========================================================
  // CARD DE PLANO PREMIUM
  // ==========================================================

  Widget _planoPremium(
    BuildContext context, {
    required String titulo,
    required String preco,
    required String descricao,
    required bool destaque,
  }) {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: destaque
            ? const Color(0xFFFF6B6B).withOpacity(0.15)
            : const Color(0xFF242020),

        borderRadius: BorderRadius.circular(18),

        border: Border.all(
          color: destaque
              ? const Color(0xFFFF6B6B)
              : Colors.white10,

          width: destaque ? 1.5 : 1,
        ),
      ),

      child: Row(
        children: [

          // ====================================================
          // NOME DO PLANO
          // ====================================================

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [

                Row(
                  children: [

                    Flexible(
                      child: Text(
                        titulo,

                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                    if (destaque) ...[
                      const SizedBox(width: 8),

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 3,
                        ),

                        decoration: BoxDecoration(
                          color: const Color(0xFFFF6B6B),

                          borderRadius:
                              BorderRadius.circular(8),
                        ),

                        child: const Text(
                          "POPULAR",

                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),

                const SizedBox(height: 5),

                Text(
                  descricao,

                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 10),

          // ====================================================
          // PREÇO + BOTÃO
          // ====================================================

          Column(
            crossAxisAlignment: CrossAxisAlignment.end,

            children: [

              Text(
                preco,

                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              ElevatedButton(
                onPressed: () {
                  // =================================================
                  // FUTURO SISTEMA DE PAGAMENTO
                  // =================================================
                },

                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color(0xFFFF6B6B),

                  foregroundColor: Colors.white,

                  elevation: 0,

                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),

                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),

                child: const Text(
                  "Comprar",

                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
