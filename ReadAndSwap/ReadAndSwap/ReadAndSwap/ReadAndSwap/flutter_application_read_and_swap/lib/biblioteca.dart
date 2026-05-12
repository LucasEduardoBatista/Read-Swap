import 'package:flutter/material.dart';
import 'package:flutter_application_read_and_swap/cadastrolivro.dart';
import 'package:flutter_application_read_and_swap/perfil.dart';

class Biblioteca extends StatefulWidget {
  const Biblioteca({super.key});

  @override
  State<Biblioteca> createState() => _BibliotecaState();
}

class _BibliotecaState extends State<Biblioteca> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 255, 232, 212),

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

            SizedBox(width: 5),

            Text(
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
            child: Column(
            children: [

            SizedBox(height: 10),

            // VOLTAR
            Container(
              padding: EdgeInsets.all(10),
              color: Colors.white,
              child: Align(
                alignment: Alignment.centerLeft,
                child: GestureDetector(
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (_) => Perfil(),
                      ),
                    );
                  },
                  child: Text(
                    "← Voltar",
                    style: TextStyle(
                      fontSize: 25,
                      color: Color(0xFFFF6B6B),
                      fontFamily: "Zalando",
                    ),
                  ),
                ),
              ),
            ),

            SizedBox(height: 20),

            // TÍTULO
            Text(
              "Meus Livros",
              style: TextStyle(
                fontSize: 35,
                fontWeight: FontWeight.bold,
                fontFamily: "Zalando",
              ),
            ),

            SizedBox(height: 10),

            // LIVROS
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [

                // LIVRO 1
                Container(
                  width: 180,
                  margin: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    children: [

                      // IMAGEM
                      Container(
                        height: 220,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.vertical(
                            top: Radius.circular(15),
                          ),
                          image: DecorationImage(
                            image: AssetImage("images/MangaBocchi.jpg"),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),

                      SizedBox(height: 10),

                      // TÍTULO
                      Text(
                        "Bocchi the Rock Vol. 1",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),

                      SizedBox(height: 5),

                      // AUTOR
                      Text(
                        "Aki Hamaji",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),

                      SizedBox(height: 10),

                      // BOTÕES
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [

                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Color(0xFFFF6B6B),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              "Editar",
                              style: TextStyle(color: Colors.white),
                            ),
                          ),

                          SizedBox(width: 10),

                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text("Remover"),
                          ),
                        ],
                      ),

                      SizedBox(height: 10),
                    ],
                  ),
                ),

                // LIVRO 2
                Container(
                  width: 180,
                  margin: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    children: [

                      // IMAGEM
                      Container(
                        height: 220,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.vertical(
                            top: Radius.circular(15),
                          ),
                          image: DecorationImage(
                            image: AssetImage("images/BoaNoitePUNPUN.png"),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),

                      SizedBox(height: 10),

                      // TÍTULO
                      Text(
                        "Boa Noite, Punpun",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),

                      SizedBox(height: 5),

                      // AUTOR
                      Text(
                        "Inio Asano",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),

                      SizedBox(height: 10),

                      // BOTÕES
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [

                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Color(0xFFFF6B6B),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              "Editar",
                              style: TextStyle(color: Colors.white),
                            ),
                          ),

                          SizedBox(width: 10),

                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text("Remover"),
                          ),
                        ],
                      ),

                      SizedBox(height: 10),
                    ],
                  ),
                ),
              ],
            ),

            SizedBox(height: 20),
          ],
        ),
      ),

      // BOTÃO ADICIONAR
      bottomNavigationBar: Container(
        height: 90,
        padding: EdgeInsets.all(15),
        child: SizedBox(
          width: double.infinity,
          height: 55,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFFFF6B6B),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => Cadastrolivro(),
                ),
              );
            },
            child: Text(
              "Adicionar Livro →",
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
              ),
            ),
          ),
        ),
      ),
    );
  }
}