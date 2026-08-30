import 'package:flutter/material.dart';
import 'package:flutter_application_read_and_swap/perfil.dart';
import 'dados.dart';

class Editarperfil extends StatefulWidget {
  const Editarperfil({super.key});

  @override
  State<Editarperfil> createState() => _EditarperfilState();
}

class _EditarperfilState extends State<Editarperfil> {
  final Color rosa = const Color(0xFFFF6B6B);
  final Color fundo = const Color(0xFFFFE8D4);
  final Color marrom = const Color(0xFF8A7362);

  late TextEditingController nomeController;

  String? fotoPerfil;

  List<String> generosSelecionados = [];

  final List<String> generosDisponiveis = [
    "Fantasia",
    "Aventura",
    "Romance",
    "Jovem Adulto",
    "Ficção Científica",
    "Terror",
    "Suspense",
    "Literatura Clássica",
    "Mistério",
  ];

  @override
  void initState() {
    super.initState();

    final usuario = DadosApp.usuarioLogado;

    nomeController = TextEditingController(
      text: usuario?.nome ?? "",
    );

    fotoPerfil = usuario?.fotoPerfil;

    generosSelecionados = List<String>.from(
      usuario?.generosFavoritos ?? [],
    );

    // Garante que nunca tenha mais de 5 gêneros
    if (generosSelecionados.length > 5) {
      generosSelecionados =
          generosSelecionados.sublist(0, 5);
    }
  }

  @override
  void dispose() {
    nomeController.dispose();
    super.dispose();
  }

  // ==========================================================
  // SALVAR PERFIL
  // ==========================================================

  void salvarPerfil() {
    final nome = nomeController.text.trim();

    if (nome.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Digite um nome antes de salvar."),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    final usuario = DadosApp.usuarioLogado;

    if (usuario != null) {
      usuario.nome = nome;
      usuario.fotoPerfil = fotoPerfil;

      usuario.generosFavoritos =
          List<String>.from(generosSelecionados);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Perfil atualizado com sucesso!"),
        duration: Duration(seconds: 2),
      ),
    );

    Navigator.pop(context);
  }

  // ==========================================================
  // CAMPO NOME
  // ==========================================================

  Widget campoNome() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Nome",
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.bold,
            color: Color(0xFF403833),
          ),
        ),

        const SizedBox(height: 8),

        TextField(
          controller: nomeController,
          maxLength: 30,
          decoration: InputDecoration(
            hintText: "Digite seu nome",
            counterText: "",
            filled: true,
            fillColor: const Color(0xFFFFF5EC),

            prefixIcon: Icon(
              Icons.person_outline_rounded,
              color: rosa,
            ),

            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide.none,
            ),

            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(
                color: rosa,
                width: 1.5,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ==========================================================
  // FOTO
  // ==========================================================

  Widget foto() {
    return Column(
      children: [
        GestureDetector(
          // Foto desativada temporariamente
          onTap: () {},

          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.bottomRight,
            children: [
              Container(
                padding: const EdgeInsets.all(4),

                decoration: BoxDecoration(
                  shape: BoxShape.circle,

                  border: Border.all(
                    color: rosa,
                    width: 3,
                  ),

                  boxShadow: [
                    BoxShadow(
                      color:
                          Colors.black.withOpacity(0.10),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),

                child: const CircleAvatar(
                  radius: 65,
                  backgroundColor: Color(0xFFFFF5EC),

                  backgroundImage: AssetImage(
                    "assets/images/pfp.jfif",
                  ),
                ),
              ),

              // BOTÃO DA CÂMERA
              Container(
                width: 46,
                height: 46,

                decoration: BoxDecoration(
                  color: rosa,
                  shape: BoxShape.circle,

                  border: Border.all(
                    color: Colors.white,
                    width: 3,
                  ),

                  boxShadow: [
                    BoxShadow(
                      color:
                          Colors.black.withOpacity(0.15),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),

                child: const Icon(
                  Icons.camera_alt_rounded,
                  color: Colors.white,
                  size: 21,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        Text(
          "Alteração de foto desativada",
          style: TextStyle(
            color: marrom,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  // ==========================================================
  // CHIP DE GÊNERO
  // ==========================================================

  Widget generoChip(String genero) {
    final bool selecionado =
        generosSelecionados.contains(genero);

    return GestureDetector(
      onTap: () {
        setState(() {
          if (selecionado) {
            generosSelecionados.remove(genero);
            return;
          }

          if (generosSelecionados.length >= 5) {
            ScaffoldMessenger.of(context)
                .hideCurrentSnackBar();

            ScaffoldMessenger.of(context)
                .showSnackBar(
              const SnackBar(
                content: Text(
                  "Você pode escolher no máximo 5 gêneros.",
                ),
                duration: Duration(seconds: 2),
              ),
            );

            return;
          }

          generosSelecionados.add(genero);
        });
      },

      child: AnimatedContainer(
        duration:
            const Duration(milliseconds: 150),

        padding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 10,
        ),

        decoration: BoxDecoration(
          color: selecionado
              ? rosa
              : const Color(0xFFFFF1E8),

          borderRadius:
              BorderRadius.circular(20),

          border: Border.all(
            color: selecionado
                ? rosa
                : const Color(0xFFFFD5C2),
          ),
        ),

        child: Row(
          mainAxisSize: MainAxisSize.min,

          children: [
            if (selecionado)
              const Padding(
                padding:
                    EdgeInsets.only(right: 5),

                child: Icon(
                  Icons.check_rounded,
                  size: 17,
                  color: Colors.white,
                ),
              ),

            Text(
              genero,

              style: TextStyle(
                fontWeight:
                    FontWeight.w600,

                color: selecionado
                    ? Colors.white
                    : const Color(0xFF6E625B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================================
  // BOTÃO VOLTAR
  // ==========================================================

  Widget botaoVoltar() {
    return Container(
      margin: const EdgeInsets.only(
        left: 8,
        top: 5,
        bottom: 5,
      ),

      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,

        boxShadow: [
          BoxShadow(
            color:
                Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),

      child: IconButton(
        onPressed: () {
          Navigator.pop(context);
        },

        icon: const Icon(
          Icons.arrow_back_rounded,
          color: Color(0xFF403833),
        ),

        tooltip: "Voltar",
      ),
    );
  }

  // ==========================================================
  // BUILD
  // ==========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor:
            Colors.transparent,
        elevation: 0,

        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Color(0xFFFF6B6B),
          ),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) =>
                    Perfil(),
              ),
            );
          },
        ),

        title: const Text(
          "Editar perfil",

          style: TextStyle(
            color: Color(0xFF403833),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SingleChildScrollView(
        physics:
            const BouncingScrollPhysics(),

        padding:
            const EdgeInsets.fromLTRB(
          20,
          10,
          20,
          30,
        ),

        child: Container(
          padding: const EdgeInsets.all(22),

          decoration: BoxDecoration(
            color: Colors.white,

            borderRadius:
                BorderRadius.circular(28),

            boxShadow: [
              BoxShadow(
                color:
                    Colors.black.withOpacity(0.07),
                blurRadius: 18,
                offset: const Offset(0, 6),
              ),
            ],
          ),

          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,

            children: [
              // FOTO
              Center(
                child: foto(),
              ),

              const SizedBox(height: 30),

              // NOME
              campoNome(),

              const SizedBox(height: 28),

              // GÊNEROS
              Row(
                children: [
                  const Text(
                    "Gêneros favoritos",

                    style: TextStyle(
                      fontSize: 18,
                      fontWeight:
                          FontWeight.bold,
                      color: Color(0xFF403833),
                    ),
                  ),

                  const Spacer(),

                  Text(
                    "${generosSelecionados.length}/5",

                    style: TextStyle(
                      color: rosa,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 6),

              Text(
                "Escolha até 5 gêneros que você mais gosta.",

                style: TextStyle(
                  color: marrom,
                ),
              ),

              const SizedBox(height: 15),

              Wrap(
                spacing: 8,
                runSpacing: 8,

                children:
                    generosDisponiveis
                        .map(
                          (genero) =>
                              generoChip(genero),
                        )
                        .toList(),
              ),

              const SizedBox(height: 30),

              // BOTÃO SALVAR
              SizedBox(
                width: double.infinity,
                height: 52,

                child: ElevatedButton(
                  onPressed: salvarPerfil,

                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor: rosa,
                    foregroundColor:
                        Colors.white,
                    elevation: 0,

                    shape:
                        RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(15),
                    ),
                  ),

                  child: const Text(
                    "Salvar alterações",

                    style: TextStyle(
                      fontSize: 16,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}