import 'package:flutter/material.dart';
import 'mainpage.dart';
import 'perfil.dart';

class Matches extends StatefulWidget {
  const Matches({super.key});

  @override
  State<Matches> createState() => _MatchesState();
}

class _MatchesState extends State<Matches> {

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

            SizedBox(height: 20),

            Text(
              "Seus Matches",
              style: TextStyle(
                fontSize: 35,
                fontWeight: FontWeight.bold,
                fontFamily: "Zalando",
              ),
            ),

            SizedBox(height: 20),

            // MATCH 1
            Container(
              margin: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [

                  Container(
                    width: 65,
                    height: 95,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      image: DecorationImage(
                        image: AssetImage(
                          "assets/images/RevoluçãoDosBichos.jpg",
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),

                  SizedBox(width: 15),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      Text(
                        "A Revolução dos Bichos",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 17,
                        ),
                      ),

                      SizedBox(height: 5),

                      Text(
                        "José A. • 5.1 km",
                        style: TextStyle(fontSize: 15),
                      ),

                      SizedBox(height: 5),

                      Text(
                        "Achei seu livro interessante...",
                        style: TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // MATCH 2
            Container(
              margin: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [

                  Container(
                    width: 65,
                    height: 95,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      image: DecorationImage(
                        image: AssetImage(
                          "assets/images/PercyJackson.jpg",
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),

                  SizedBox(width: 15),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      Text(
                        "Percy Jackson",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 17,
                        ),
                      ),

                      SizedBox(height: 5),

                      Text(
                        "Diogo P. • 3.4 km",
                        style: TextStyle(fontSize: 15),
                      ),

                      SizedBox(height: 5),

                      Text(
                        "Vou estar disponível...",
                        style: TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // MATCH 3
            Container(
              margin: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [

                  Container(
                    width: 65,
                    height: 95,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      image: DecorationImage(
                        image: AssetImage(
                          "assets/images/DiarioDeUmZumbi.jpg",
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),

                  SizedBox(width: 15),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      Text(
                        "Diário de um Zumbi",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 17,
                        ),
                      ),

                      SizedBox(height: 5),

                      Text(
                        "Carlos B. • 1.7 km",
                        style: TextStyle(fontSize: 15),
                      ),

                      SizedBox(height: 5),

                      Text(
                        "Seu livro parece...",
                        style: TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
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

            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.chat_bubble,
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