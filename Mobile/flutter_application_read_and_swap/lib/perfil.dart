import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_application_read_and_swap/biblioteca.dart';
import 'package:flutter_application_read_and_swap/dados.dart';
import 'package:flutter_application_read_and_swap/editarperfil.dart';
import 'package:flutter_application_read_and_swap/login.dart';
import 'mainpage.dart';
import 'matches.dart';

class Perfil extends StatefulWidget {
  Perfil({super.key});

  @override
  State<Perfil> createState() => _PerfilState();
}

class _PerfilState extends State<Perfil> {
  Usuario? usuario = DadosApp.usuarioLogado;
  final Color rosa = Color(0xFFFF6B6B);
  final Color fundo = Color(0xFFFFE8D4);
  final Color marrom = Color(0xFF8A7362);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      // =========================
      // APP BAR
      // =========================
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
            SizedBox(width: 6),
            Text(
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

        // MENU SANDUÍCHE
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 12),
            child: IconButton(
              icon: Icon(
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

      // =========================
      // BODY
      // =========================
      body: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: Padding(
          padding: EdgeInsets.fromLTRB(18, 5, 18, 25),
          child: Container(
            padding: EdgeInsets.fromLTRB(20, 25, 20, 25),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.07),
                  blurRadius: 18,
                  offset: Offset(0, 6),
                ),
              ],
            ),
            child: Column(
              children: [
                // =========================
                // TÍTULO
                // =========================
                Text(
                  "Meu Perfil",
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF403833),
                  ),
                ),
                SizedBox(height: 22),

                // =========================
                // FOTO
                // =========================
                Container(
                  padding: EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Color(0xFFFF6B6B),
                      width: 3,
                    ),
                  ),
                  child: CircleAvatar(
                    radius: 68,
                    backgroundImage: usuario?.fotoPerfil != null &&
                            usuario!.fotoPerfil!.isNotEmpty
                        ? FileImage(File(usuario!.fotoPerfil!))
                        : const AssetImage(
                            "assets/images/pfp.jfif",
                          ),
                  ),
                ),
                SizedBox(height: 15),

                // =========================
                // NOME + EDIÇÃO
                // =========================
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Flexible(
                      child: Text(
                        usuario?.nome ?? "Usuário",
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF403833),
                        ),
                      ),
                    ),
                    SizedBox(width: 7),
                    Material(
                      color: Color(0xFFFFE5E5),
                      shape: CircleBorder(),
                      child: InkWell(
                        customBorder: CircleBorder(),
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
                        child: Padding(
                          padding: EdgeInsets.all(8),
                          child: Icon(
                            Icons.edit_rounded,
                            size: 18,
                            color: rosa,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),

                // =========================
                // LOCALIZAÇÃO
                // =========================
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Color(0xFFFFF5EC),
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
                      SizedBox(width: 5),
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
                SizedBox(height: 28),

                // =========================
                // ESTATÍSTICAS
                // =========================
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
                        cor: Color(0xFF5C8DDE),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 28),

                // =========================
                // GÊNEROS
                // =========================
                Align(
                  alignment: Alignment.center,
                  child: Text(
                    "Gêneros favoritos",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: rosa,
                    ),
                  ),
                ),
                SizedBox(height: 12),
                Wrap(
                alignment: WrapAlignment.center,
                spacing: 8,
                runSpacing: 8,
                children: (usuario?.generosFavoritos ?? [])
                    .map((genero) => chip(genero))
                    .toList(),
              ),
                SizedBox(height: 28),

                // =========================
                // BIBLIOTECA
                // =========================
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    icon: Icon(
                      Icons.bookmark_rounded,
                    ),
                    label: Text(
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

      // =========================
      // BOTTOM NAVIGATION
      // =========================
      bottomNavigationBar: Container(
        height: 90,
        color: Colors.white,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => Mainpage(),
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.book),
                  Text("Swaps"),
                ],
              ),
            ),

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => Matches(),
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.chat_bubble_outline),
                  Text("Perfil"),
                ],
              ),
            ),

            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.person,
                  color: Color(0xFFFF6B6B),
                ),
                Text(
                  "Matches",
                  style: TextStyle(
                    color: Color(0xFFFF6B6B),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
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
        SizedBox(height: 5),
        Text(
          valor,
          style: TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          texto,
          style: TextStyle(
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
      padding: EdgeInsets.symmetric(
        horizontal: 13,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: Color(0xFFFFF1E8),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFFFD5C2),
        ),
      ),
      child: Text(
        texto,
        style: TextStyle(
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
      builder: (context) {
        return Container(
          padding: EdgeInsets.fromLTRB(
            20,
            12,
            20,
            25,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(28),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // BARRINHA
              Container(
                width: 45,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              SizedBox(height: 20),
              Align(
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
              SizedBox(height: 15),

              // EDITAR PERFIL
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Color(0xFFFFE5E5),
                  child: Icon(
                    Icons.edit_rounded,
                    color: rosa,
                  ),
                ),
                title: Text(
                  "Editar perfil",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                subtitle: Text(
                  "Alterar seus dados pessoais",
                ),
                trailing: Icon(
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
              Divider(),

              // BIBLIOTECA
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Color(0xFFFFF1E8),
                  child: Icon(
                    Icons.bookmark_rounded,
                    color: rosa,
                  ),
                ),
                title: Text(
                  "Minha biblioteca",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                subtitle: Text(
                  "Veja seus livros cadastrados",
                ),
                trailing: Icon(
                  Icons.chevron_right_rounded,
                ),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => Biblioteca(),
                    ),
                  );
                },
              ),
              Divider(),

              // SAIR
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Color(0xFFFFEEEE),
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
                onTap: () {
                  Navigator.pop(context);
                  DadosApp.usuarioLogado = null;
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                      builder: (_) => Login(),
                    ),
                    (route) => false,
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
