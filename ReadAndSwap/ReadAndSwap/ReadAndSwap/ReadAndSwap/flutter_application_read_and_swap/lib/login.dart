import 'package:flutter/material.dart';
import 'cadastro.dart';
import 'mainpage.dart';

class Login extends StatefulWidget {
  Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {

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

                // LOGO
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

                // LOGIN
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
                            hintText: "Digite sua senha",
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

                        // CADASTRO
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