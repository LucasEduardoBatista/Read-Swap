import 'package:flutter/material.dart';
import 'package:flutter_application_read_and_swap/biblioteca.dart';
import 'package:flutter_application_read_and_swap/dados.dart';
import 'package:flutter_application_read_and_swap/login.dart';
import 'mainpage.dart';
import 'matches.dart';

class Perfil extends StatefulWidget {
  const Perfil({super.key});

  @override
  State<Perfil> createState() => _PerfilState();
}

class _PerfilState extends State<Perfil> {
  Usuario? usuario = DadosApp.usuarioLogado;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 232, 212),

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
            const SizedBox(width: 5),
            const Text(
              "Read&Swap",
              style: TextStyle(
                fontSize: 40,
                color: Color(0xFFFF6B6B),
                fontWeight: FontWeight.bold,
                fontFamily: "Estonia",
              ),
            ),
          ],
        ),
      ),

      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(25),
            ),
            child: Column(
              children: [

                const Text(
                  "Meu Perfil",
                  style: TextStyle(
                    fontSize: 35,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 20),

                const CircleAvatar(
                  radius: 70,
                  backgroundImage: AssetImage(
                    "assets/images/pfp.jfif",
                  ),
                ),

                const SizedBox(height: 15),

                Text(
                  usuario?.nome ?? "Usuário",
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 25),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [

                    const Icon(
                      Icons.location_on,
                      color: Colors.red,
                    ),

                    const SizedBox(width: 5),

                    Text(
                      usuario!.localizacao
                          ? "Localização ativada"
                          : "Localização desativada",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: usuario!.localizacao
                            ? Colors.green
                            : Colors.red,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                const SizedBox(height: 25),

                Row(
                  mainAxisAlignment:
                      MainAxisAlignment.spaceEvenly,
                  children: [

                    Column(
                      children: [
                        const Icon(
                          Icons.book,
                          color: Colors.red,
                          size: 35,
                        ),

                        Text(
                          DadosApp.livros.length
                              .toString(),
                          style: const TextStyle(
                            fontSize: 18,
                          ),
                        ),

                        const Text(
                          "Livros",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),

                    const Column(
                      children: [
                        Icon(
                          Icons.swap_horiz,
                          color: Colors.blue,
                          size: 35,
                        ),
                        Text(
                          "0",
                          style: TextStyle(
                            fontSize: 18,
                          ),
                        ),
                        Text(
                          "Trocas",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 25),

                const Text(
                  "Gêneros favoritos",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFF6B6B),
                  ),
                ),

                const SizedBox(height: 10),

                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    chip("Fantasia"),
                    chip("Romance"),
                    chip("Aventura"),
                    chip("Drama"),
                    chip("Terror"),
                  ],
                ),

                const SizedBox(height: 20),

                Padding(
                        padding:
                            const EdgeInsets.all(
                          5,
                        ),

                        child: SizedBox(
                          height: 45,
                          width: double.infinity,

                          child:
                          ElevatedButton.icon(

                            icon: const Icon(
                              Icons.bookmark,
                            ),

                            label: const Text(
                              "Ver Biblioteca",
                                    style: TextStyle(
                                      fontSize: 16),
                            ),

                            style:
                                ElevatedButton.styleFrom(
                              backgroundColor:
                                  const Color(
                                0xFFFF6B6B,
                              ),
                              foregroundColor:
                                  Colors.white,
                            ),
                            onPressed: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const Biblioteca(),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
            

                const SizedBox(height: 20),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.logout),
                    label: const Text("Sair da conta"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {

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
                ),
              ],
            ),
          ),
        ),
      ),

      bottomNavigationBar: Container(
        height: 90,
        color: Colors.white,
        child: Row(
          mainAxisAlignment:
              MainAxisAlignment.spaceEvenly,
          children: [

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const Mainpage(),
                  ),
                );
              },
              child: const Column(
                mainAxisAlignment:
                    MainAxisAlignment.center,
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
                    builder: (_) => const Matches(),
                  ),
                );
              },
              child: const Column(
                mainAxisAlignment:
                    MainAxisAlignment.center,
                children: [
                  Icon(Icons.chat_bubble_outline),
                  Text("Matches"),
                ],
              ),
            ),

            const Column(
              mainAxisAlignment:
                  MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.person,
                  color: Color(0xFFFF6B6B),
                ),
                Text(
                  "Perfil",
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

  Widget chip(String texto) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 10,
        vertical: 6,
      ),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        texto,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}