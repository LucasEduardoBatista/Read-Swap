import 'package:flutter/material.dart';

import 'mainpage.dart';
import 'matches.dart';
import 'perfil.dart';

class AppNavbar extends StatelessWidget {
  final int selectedIndex;

  const AppNavbar({super.key, required this.selectedIndex});

  void _navigate(BuildContext context, int index) {
    if (index == selectedIndex) return;
    final Widget page = switch (index) {
      0 => const Mainpage(),
      1 => const Matches(),
      _ => const Perfil(),
    };
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => page),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      height: 72,
      backgroundColor: Colors.white,
      indicatorColor: const Color(0xFFFFD8D0),
      selectedIndex: selectedIndex,
      onDestinationSelected: (index) => _navigate(context, index),
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.swap_horiz_rounded),
          selectedIcon: Icon(Icons.swap_horiz_rounded, color: Color(0xFFFF6B6B)),
          label: 'Swaps',
        ),
        NavigationDestination(
          icon: Icon(Icons.chat_bubble_outline_rounded),
          selectedIcon: Icon(Icons.chat_bubble_rounded, color: Color(0xFFFF6B6B)),
          label: 'Conversas',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline_rounded),
          selectedIcon: Icon(Icons.person_rounded, color: Color(0xFFFF6B6B)),
          label: 'Perfil',
        ),
      ],
    );
  }
}
