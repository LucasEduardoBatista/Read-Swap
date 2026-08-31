import 'package:flutter/material.dart';
import 'package:flutter_application_read_and_swap/cadastrolivro.dart';
import 'package:flutter_application_read_and_swap/dados.dart';
import 'package:flutter_application_read_and_swap/perfil.dart';
import 'package:flutter_application_read_and_swap/api.dart';
import 'image_data.dart';
import 'app_navbar.dart';

class Biblioteca extends StatefulWidget {
  const Biblioteca({super.key});

  @override
  State<Biblioteca> createState() => _BibliotecaState();
}

class _BibliotecaState extends State<Biblioteca> {

  bool carregando = true;

  @override
  void initState() {
    super.initState();
    Api.listarLivros().then((_) { if (mounted) setState(() => carregando = false); })
      .catchError((_) { if (mounted) setState(() => carregando = false); });
  }

  Future<void> _atualizarLivros() async {
    setState(() => carregando = true);
    try {
      await Api.listarLivros();
    } finally {
      if (mounted) setState(() => carregando = false);
    }
  }

  TextEditingController buscaController = TextEditingController();

  String busca = "";

  @override
  Widget build(BuildContext context) {

    List<Livro> livrosFiltrados =
        DadosApp.livros.where((livro) {

      return livro.nome
              .toLowerCase()
              .contains(busca) ||

          livro.autor
              .toLowerCase()
              .contains(busca) ||

          livro.genero
              .toLowerCase()
              .contains(busca);

    }).toList();

    return Scaffold(
      backgroundColor:
          const Color.fromARGB(
            255,
            255,
            232,
            212,
          ),

      appBar: AppBar(
        backgroundColor:
            Colors.transparent,
        elevation: 0,

        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Color(0xFFFF6B6B),
          ),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) =>
                    Perfil(),
              ),
            );
          },
        ),

        title: const Text(
          "Minha Biblioteca",
          style: TextStyle(
            color: Color(0xFFFF6B6B),
            fontWeight:
                FontWeight.bold,
          ),
        ),

        centerTitle: true,
      ),

      body: Column(
        children: [

          Padding(
            padding:
                const EdgeInsets.all(15),
            child: TextField(
              controller:
                  buscaController,
              onChanged: (value) {
                setState(() {
                  busca =
                      value.toLowerCase();
                });
              },
              decoration:
                  InputDecoration(
                hintText:
                    "Buscar livro, autor ou gênero...",
                prefixIcon:
                    const Icon(
                  Icons.search,
                ),
                filled: true,
                fillColor:
                    Colors.white,
                border:
                    OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(
                        20,
                      ),
                ),
              ),
            ),
          ),

          Expanded(
            child: carregando
                ? const Center(child: CircularProgressIndicator())
                : livrosFiltrados
                        .isEmpty
                    ? const Center(
                        child: Text(
                          "Nenhum livro encontrado",
                          style:
                              TextStyle(
                            fontSize:
                                20,
                            fontWeight:
                                FontWeight
                                    .bold,
                          ),
                        ),
                      )
                    : ListView.builder(
                        padding:
                            const EdgeInsets
                                .all(
                                15),
                        itemCount:
                            livrosFiltrados
                                .length,
                        itemBuilder:
                            (
                              context,
                              index,
                            ) {

                          Livro livro =
                              livrosFiltrados[
                                  index];

                          return Container(
                            margin:
                                const EdgeInsets
                                    .only(
                              bottom:
                                  15,
                            ),

                            padding:
                                const EdgeInsets
                                    .all(
                              15,
                            ),

                            decoration:
                                BoxDecoration(
                              color:
                                  Colors
                                      .white,
                              borderRadius:
                                  BorderRadius.circular(
                                20,
                              ),
                            ),

                            child:
                                Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment
                                      .start,
                              children: [

                                Row(
                                  children: [

                                    Container(
                                      width:
                                          70,
                                      height:
                                          100,

                                      decoration:
                                          BoxDecoration(
                                        color:
                                            Colors.grey.shade300,
                                        borderRadius:
                                            BorderRadius.circular(
                                          10,
                                        ),
                                      ),

                                      clipBehavior: Clip.antiAlias,
                                      child: imageProviderFromData(livro.foto) != null
                                          ? Image(image: imageProviderFromData(livro.foto)!, fit: BoxFit.cover)
                                          : const Icon(Icons.menu_book, size: 40),
                                    ),

                                    const SizedBox(
                                      width:
                                          15,
                                    ),

                                    Expanded(
                                      child:
                                          Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [

                                          Text(
                                            livro
                                                .nome,
                                            style:
                                                const TextStyle(
                                              fontSize:
                                                  20,
                                              fontWeight:
                                                  FontWeight.bold,
                                            ),
                                          ),

                                          const SizedBox(
                                            height:
                                                5,
                                          ),

                                          Text(
                                            livro
                                                .autor,
                                            style:
                                                const TextStyle(
                                              color:
                                                  Colors.grey,
                                            ),
                                          ),

                                          const SizedBox(
                                            height:
                                                5,
                                          ),

                                          Text(
                                            "Editora: ${livro.editora}",
                                          ),

                                          Text(
                                            "Lançado em ${livro.ano}",
                                          ),

                                          Text(
                                            "Conservação: ${livro.conservacao}",
                                          ),

                                          Text(
                                            "Gênero: ${livro.genero}",
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),

                                if (livro
                                    .observacoes
                                    .isNotEmpty)

                                  Padding(
                                    padding:
                                        const EdgeInsets.only(
                                      top:
                                          10,
                                    ),

                                    child:
                                        Text(
                                      "Obs: ${livro.observacoes}",
                                    ),
                                  ),

                                const SizedBox(
                                  height:
                                      15,
                                ),

                                Row(
                                  children: [

                                    Expanded(
                                      child:
                                          ElevatedButton.icon(
                                        icon:
                                            const Icon(
                                          Icons
                                              .edit,
                                        ),

                                        label:
                                            const Text(
                                          "Editar",
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

                                        onPressed:
                                            () {

                                          int indiceReal =
                                              DadosApp.livros.indexOf(
                                            livro,
                                          );

                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder:
                                                  (
                                                    _,
                                                  ) =>
                                                      CadastrolivroEditar(
                                                indice:
                                                    indiceReal,
                                              ),
                                            ),
                                          ).then(
                                            (
                                              _,
                                            ) {
                                              setState(
                                                () {},
                                              );
                                            },
                                          );
                                        },
                                      ),
                                    ),

                                    const SizedBox(
                                      width:
                                          10,
                                    ),

                                    Expanded(
                                      child:
                                          ElevatedButton.icon(
                                        icon:
                                            const Icon(
                                          Icons
                                              .delete,
                                        ),

                                        label:
                                            const Text(
                                          "Remover",
                                        ),

                                        style:
                                            ElevatedButton.styleFrom(
                                          backgroundColor:
                                              Colors.grey.shade300,
                                          foregroundColor:
                                              Colors.black,
                                        ),

                                        onPressed: () async {

                                        bool? confirmar =
                                            await showDialog<bool>(
                                          context: context,
                                          builder: (context) {
                                            return AlertDialog(
                                              title: const Text(
                                                "Remover Livro",
                                              ),
                                              content: const Text(
                                                "Você tem certeza que deseja remover este livro?",
                                              ),
                                              actions: [

                                                TextButton(
                                                  onPressed: () {
                                                    Navigator.pop(
                                                      context,
                                                      false,
                                                    );
                                                  },
                                                  child: const Text(
                                                    "Cancelar",
                                                  ),
                                                ),

                                                ElevatedButton(
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor: Colors.red,
                                                  ),
                                                  onPressed: () {
                                                    Navigator.pop(
                                                      context,
                                                      true,
                                                    );
                                                  },
                                                  child: const Text(
                                                    "Remover",
                                                  ),
                                                ),
                                              ],
                                            );
                                          },
                                        );

                                        if (confirmar == true) {

                                          if (livro.id != null) {
                                            try {
                                              await Api.excluirLivro(livro.id!);
                                              if (mounted) setState(() {});
                                            } catch (e) {
                                              if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
                                              return;
                                            }
                                          }

                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                "Livro removido com sucesso!",
                                              ),
                                            ),
                                          );
                                        }
                                      },
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFFF6B6B),
        foregroundColor: Colors.white,
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const Cadastrolivro()),
        ).then((_) => _atualizarLivros()),
        icon: const Icon(Icons.add),
        label: const Text('Adicionar livro'),
      ),
      bottomNavigationBar: const AppNavbar(selectedIndex: 2),
    );
  }
}
