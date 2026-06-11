import 'package:flutter/material.dart';
import 'dados.dart';
import 'matches.dart';
import 'perfil.dart';

class Mainpage extends StatefulWidget {
  const Mainpage({super.key});

  @override
  State<Mainpage> createState() => _MainpageState();
}

class _MainpageState extends State<Mainpage> {
  @override
  Widget build(BuildContext context) {
    bool localizacaoAtiva =
        DadosApp.usuarioLogado?.localizacao ?? false;

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 232, 212),

      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        shadowColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,

        title: Row(
          children: [

            Image.asset(
              "images/Read&SwapLOGOfundo.png",
              width: 40,
              height: 40,
              fit: BoxFit.cover,
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

      body: localizacaoAtiva

          ? SingleChildScrollView(
              child: Column(
                children: [

                  const SizedBox(height: 10),

                  const Text(
                    "Swaps",
                    style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.bold,
                      fontFamily: "Zalando",
                    ),
                  ),

                  const SizedBox(height: 10),

                  Container(
                    width: 320,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: Column(
                      children: [

                        Container(
                          height: 350,
                          width: double.infinity,
                          decoration: const BoxDecoration(
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(25),
                            ),
                            image: DecorationImage(
                              image: AssetImage(
                                "assets/images/RainhaVermelha.jpg",
                              ),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),

                        Padding(
                          padding: const EdgeInsets.all(15),
                          child: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [

                              const Text(
                                "A Rainha Vermelha",
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 5),

                              const Text(
                                "Victoria Aveyard",
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 16,
                                ),
                              ),

                              const SizedBox(height: 15),

                              const Text(
                                "▼ Ver detalhes",
                                style: TextStyle(fontSize: 16),
                              ),

                              const SizedBox(height: 15),

                              Row(
                                children: [

                                  Container(
                                    padding:
                                        const EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: Colors.grey,
                                      ),
                                      borderRadius:
                                          BorderRadius.circular(10),
                                    ),
                                    child:
                                        const Text("Fantasia"),
                                  ),

                                  const SizedBox(width: 8),

                                  Container(
                                    padding:
                                        const EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: Colors.grey,
                                      ),
                                      borderRadius:
                                          BorderRadius.circular(10),
                                    ),
                                    child:
                                        const Text("Romance"),
                                  ),

                                  const SizedBox(width: 8),

                                  Container(
                                    padding:
                                        const EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: Colors.grey,
                                      ),
                                      borderRadius:
                                          BorderRadius.circular(10),
                                    ),
                                    child:
                                        const Text("Aventura"),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 5),

                              const Row(
                                children: [
                                  Icon(
                                    Icons.location_on,
                                    size: 18,
                                  ),
                                  Text(
                                    "2 Km de você",
                                    style:
                                        TextStyle(fontSize: 15),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 15),

                  Row(
                    mainAxisAlignment:
                        MainAxisAlignment.center,
                    children: [

                      Container(
                        width: 75,
                        height: 75,
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.close,
                          size: 40,
                        ),
                      ),

                      const SizedBox(width: 45),

                      Container(
                        width: 75,
                        height: 75,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFF6B6B),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.favorite,
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  const Row(
                    mainAxisAlignment:
                        MainAxisAlignment.center,
                    children: [
                      Icon(Icons.location_on, size: 18),
                      Text(
                        " Mostrando livros perto de você",
                        style: TextStyle(fontSize: 15),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            )

          : Center(
              child: Padding(
                padding: const EdgeInsets.all(25),
                child: Column(
                  mainAxisAlignment:
                      MainAxisAlignment.center,
                  children: [

                    const Icon(
                      Icons.location_off,
                      size: 100,
                      color: Color(0xFFFF6B6B),
                    ),

                    const SizedBox(height: 20),

                    const Text(
                      "Ative sua localização",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 10),

                    const Text(
                      "Para visualizar livros próximos e realizar trocas.",
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 30),

                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            const Color(0xFFFF6B6B),
                      ),
                      onPressed: () {

                        setState(() {
                          DadosApp.usuarioLogado!
                              .localizacao = true;
                        });

                      },
                      child: const Text(
                        "Ativar localização",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
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

            const Column(
              mainAxisAlignment:
                  MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.book,
                  color: Color(0xFFFF6B6B),
                ),
                Text(
                  "Swaps",
                  style: TextStyle(
                    color: Color(0xFFFF6B6B),
                  ),
                ),
              ],
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

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const Perfil(),
                  ),
                );
              },
              child: const Column(
                mainAxisAlignment:
                    MainAxisAlignment.center,
                children: [
                  Icon(Icons.person_outline),
                  Text("Perfil"),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}