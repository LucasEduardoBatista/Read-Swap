import 'package:flutter/material.dart';
import 'cadastro.dart';
import 'mainpage.dart';
import 'dados.dart';

class Login extends StatefulWidget {
  Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {

  TextEditingController emailController = TextEditingController();
  TextEditingController senhaController = TextEditingController();

  bool mostrarSenha = false;
  bool localizacao = false;

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
                  "Bem-vindo de volta!",
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
                          "Entrar",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
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
                            hintText: "Digite sua senha",
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

                        SizedBox(height: 15),

                        CheckboxListTile(
                          value: localizacao,
                          activeColor: Color(0xFFFF6B6B),
                          title: Text("Ativar localização"),
                          controlAffinity:
                              ListTileControlAffinity.leading,
                          onChanged: (value) {
                            setState(() {
                              localizacao = value!;
                            });
                          },
                        ),

                        SizedBox(height: 20),

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
                              if (emailController.text.isEmpty ||
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

                              if (!emailController.text.contains("@")) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("O e-mail deve conter @"),
                                  ),
                                );
                                return;
                              }

                              if (senhaController.text.length < 8) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      "A senha deve ter no mínimo 8 caracteres",
                                    ),
                                  ),
                                );
                                return;
                              }

                              Usuario? usuarioEncontrado;

                              for (var usuario in DadosApp.usuarios) {

                                if (usuario.email == emailController.text &&
                                    usuario.senha == senhaController.text) {

                                  usuarioEncontrado = usuario;
                                  break;
                                }
                              }

                              if (usuarioEncontrado == null) {

                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      "Email ou senha incorretos",
                                    ),
                                  ),
                                );

                                return;
                              }

                              usuarioEncontrado.localizacao = localizacao;

                              DadosApp.usuarioLogado = usuarioEncontrado;

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => Mainpage(),
                                ),
                              );
                            },
                            child: Text(
                              "Entrar →",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
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
                                  builder: (_) => Cadastro(),
                                ),
                              );
                            },
                            child: Text(
                              "Não tem conta? Cadastre-se",
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