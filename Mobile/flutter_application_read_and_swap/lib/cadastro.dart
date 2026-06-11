import 'package:flutter/material.dart';
import 'login.dart';
import 'dados.dart';

class Cadastro extends StatefulWidget {
  Cadastro({super.key});

  @override
  State<Cadastro> createState() => _CadastroState();
}

class _CadastroState extends State<Cadastro> {

  TextEditingController nomeController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController senhaController = TextEditingController();

  bool mostrarSenha = false;

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

                        Text("Nome"),

                        SizedBox(height: 5),

                        TextField(
                          controller: nomeController,
                          decoration: InputDecoration(
                            hintText: "Digite seu nome",
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),

                        SizedBox(height: 20),

                        Text("E-mail"),

                        SizedBox(height: 5),

                        TextField(
                          controller: emailController,
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

                        Text("Senha"),

                        SizedBox(height: 5),

                        TextField(
                          controller: senhaController,
                          obscureText: !mostrarSenha,
                          decoration: InputDecoration(
                            hintText: "Digite uma senha",
                            suffixIcon: IconButton(
                              icon: Icon(
                                mostrarSenha
                                    ? Icons.visibility
                                    : Icons.visibility_off,
                              ),
                              onPressed: () {
                                setState(() {
                                  mostrarSenha = !mostrarSenha;
                                });
                              },
                            ),
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),

                        SizedBox(height: 20),

                        SizedBox(
                          width: double.infinity,
                          height: 55,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFFF6B6B),
                            ),
                            onPressed: () {

                              if (nomeController.text.isEmpty ||
                                  emailController.text.isEmpty ||
                                  senhaController.text.isEmpty) {

                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      "Preencha todos os campos",
                                    ),
                                  ),
                                );

                                return;
                              }

                              DadosApp.usuarios.add(
                                Usuario(
                                  nome: nomeController.text,
                                  email: emailController.text,
                                  senha: senhaController.text,
                                  localizacao: false,
                                ),
                              );

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => Login(),
                                ),
                              );
                            },
                            child: Text(
                              "Cadastrar",
                              style: TextStyle(
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),

                        SizedBox(height: 20),

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
                              ),
                            ),
                          ),
                        ),
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