import 'package:flutter/material.dart';
import 'login.dart';

class Cadastro extends StatefulWidget {
  Cadastro({super.key});

  @override
  State<Cadastro> createState() => _CadastroState();
}

class _CadastroState extends State<Cadastro> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 255, 232, 212),

      body: SingleChildScrollView(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minHeight: MediaQuery.of(context).size.height,
          ),
          child: IntrinsicHeight(
            child: Column(
              children: [

                SizedBox(height: 80),

                // LOGO TESTE
                Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    image: DecorationImage(
                      image: AssetImage("images/Read&SwapLOGOfundo.png"),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),

                SizedBox(height: 15),

                Text(
                  "Read&Swap",
                  style: TextStyle(
                    fontSize: 45,
                    color: Color(0xFFFF6B6B),
                    fontWeight: FontWeight.bold,
                    fontFamily: "Estonia",
                  ),
                ),

                SizedBox(height: 5),

                Text(
                  "Faça seu cadastro!",
                  style: TextStyle(fontSize: 16),
                ),

                SizedBox(height: 30),

                // CADASTRO
                Expanded(
                  child: Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(25),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(30),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [

                        Text(
                          "Cadastrar",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        SizedBox(height: 20),

                        // NOME
                        Text(
                          "Nome",
                          style: TextStyle(fontSize: 16),
                        ),

                        SizedBox(height: 5),

                        TextField(
                          decoration: InputDecoration(
                            hintText: "Digite seu nome completo",
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),

                        SizedBox(height: 20),

                        // EMAIL
                        Text(
                          "E-mail",
                          style: TextStyle(fontSize: 16),
                        ),

                        SizedBox(height: 5),

                        TextField(
                          decoration: InputDecoration(
                            hintText: "Digite seu e-mail",
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),

                        SizedBox(height: 20),

                        // SENHA
                        Text(
                          "Senha",
                          style: TextStyle(fontSize: 16),
                        ),

                        SizedBox(height: 5),

                        TextField(
                          obscureText: true,
                          decoration: InputDecoration(
                            hintText: "Digite uma senha",
                            suffixIcon: Icon(Icons.visibility_off),
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),

                        SizedBox(height: 30),

                        // BOTÃO
                        SizedBox(
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
                                  builder: (_) => Login(),
                                ),
                              );
                            },
                            child: Text(
                              "Cadastrar →",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                              ),
                            ),
                          ),
                        ),

                        SizedBox(height: 20),

                        // LOGIN
                        Center(
                          child: GestureDetector(
                            onTap: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => Login(),
                                ),
                              );
                            },
                            child: Text(
                              "Já tem conta? Faça login",
                              style: TextStyle(
                                color: Color(0xFFFF6B6B),
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                          ),
                        ),

                        SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}