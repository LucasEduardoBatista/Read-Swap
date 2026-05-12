import 'package:flutter/material.dart';
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

            Text(
              "Swaps",
              style: TextStyle(
                fontSize: 35,
                fontWeight: FontWeight.bold,
                fontFamily: "Zalando",
              ),
            ),

            SizedBox(height: 10),

            // CARD LIVRO
            Container(
              width: 320,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
              ),
              child: Column(
                children: [

                  // IMAGEM
                  Container(
                    height: 350,
                    width: double.infinity,
                    decoration: BoxDecoration(
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
                    padding: EdgeInsets.all(15),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [

                        Text(
                          "A Rainha Vermelha",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        SizedBox(height: 5),

                        Text(
                          "Victoria Aveyard",
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 16,
                          ),
                        ),

                        SizedBox(height: 15),

                        Text(
                          "▼ Ver detalhes",
                          style: TextStyle(fontSize: 16),
                        ),

                        SizedBox(height: 15),

                        // TAGS
                        Row(
                          children: [

                            Container(
                              padding: EdgeInsets.all(7),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text("Fantasia"),
                            ),

                            SizedBox(width: 8),

                            Container(
                              padding: EdgeInsets.all(7),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text("Romance"),
                            ),

                            SizedBox(width: 8),

                            Container(
                              padding: EdgeInsets.all(7),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text("Aventura"),
                            ),
                          ],
                        ),

                        SizedBox(height: 5),

                        Row(
                          children: [
                            Icon(Icons.location_on, size: 18),
                            Text(
                              "2 Km de você",
                              style: TextStyle(fontSize: 15),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 15),

            // BOTÕES
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [

                Container(
                  width: 75,
                  height: 75,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.close,
                    size: 40,
                  ),
                ),

                SizedBox(width: 45),

                Container(
                  width: 75,
                  height: 75,
                  decoration: BoxDecoration(
                    color: Color(0xFFFF6B6B),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.favorite,
                    size: 40,
                    color: Colors.white,
                  ),
                ),
              ],
            ),

            SizedBox(height: 20),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.location_on, size: 18),
                Text(
                  " Mostrando livros perto de você",
                  style: TextStyle(fontSize: 15),
                ),
              ],
            ),

            SizedBox(height: 20),
          ],
        ),
      ),

      // BOTTOM BAR
      bottomNavigationBar: Container(
        height: 90,
        color: Colors.white,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [

            Column(
              mainAxisAlignment: MainAxisAlignment.center,
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
                    builder: (_) => Matches(),
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
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
                    builder: (_) => Perfil(),
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
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