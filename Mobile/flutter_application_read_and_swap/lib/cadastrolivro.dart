import 'package:flutter/material.dart';
import 'biblioteca.dart';
import 'dados.dart';

class Cadastrolivro extends StatefulWidget {
  final int? indice;

  const Cadastrolivro({
    super.key,
    this.indice,
  });

  @override
  State<Cadastrolivro> createState() => _CadastrolivroState();
}

class _CadastrolivroState extends State<Cadastrolivro> {
  TextEditingController nomeController = TextEditingController();
  TextEditingController anoController = TextEditingController();
  TextEditingController autorController = TextEditingController();
  TextEditingController conservacaoController =
      TextEditingController();
  TextEditingController editoraController =
      TextEditingController();
  TextEditingController observacoesController =
      TextEditingController();

  String generoSelecionado = "Fantasia";

  bool editando = false;

  @override
  void initState() {
    super.initState();

    if (widget.indice != null) {
      editando = true;

      Livro livro = DadosApp.livros[widget.indice!];

      nomeController.text = livro.nome;
      anoController.text = livro.ano;
      autorController.text = livro.autor;
      conservacaoController.text =
          livro.conservacao;
      editoraController.text = livro.editora;
      observacoesController.text =
          livro.observacoes;
      generoSelecionado = livro.genero;
    }
  }

  Widget campo(
    String titulo,
    String dica,
    IconData icone,
    TextEditingController controller, {
    int linhas = 1,
    TextInputType teclado =
        TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.only(
        bottom: 18,
      ),
      child: TextField(
        controller: controller,
        keyboardType: teclado,
        maxLines: linhas,
        decoration: InputDecoration(
          labelText: titulo,
          hintText: dica,
          prefixIcon: Icon(
            icone,
            color: const Color(0xFFFF6B6B),
          ),
          filled: true,
          fillColor:
              const Color.fromARGB(
                255,
                250,
                250,
                250,
              ),
          border: OutlineInputBorder(
            borderRadius:
                BorderRadius.circular(18),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
                    const Biblioteca(),
              ),
            );
          },
        ),

        title: Text(
          editando
              ? "Editar Livro"
              : "Cadastrar Livro",
          style: const TextStyle(
            color: Color(0xFFFF6B6B),
            fontWeight:
                FontWeight.bold,
          ),
        ),

        centerTitle: true,
      ),

      body: SingleChildScrollView(
        padding:
            const EdgeInsets.all(18),
        child: Container(
          padding:
              const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius:
                BorderRadius.circular(
                  25,
                ),
          ),
          child: Column(
            children: [

              Container(
                width: double.infinity,
                height: 180,
                decoration: BoxDecoration(
                  color:
                      Colors.grey.shade200,
                  borderRadius:
                      BorderRadius.circular(
                        20,
                      ),
                  border: Border.all(
                    color:
                        const Color(
                          0xFFFF6B6B,
                        ),
                    width: 2,
                  ),
                ),
                child: const Column(
                  mainAxisAlignment:
                      MainAxisAlignment
                          .center,
                  children: [
                    Icon(
                      Icons
                          .add_photo_alternate,
                      size: 70,
                      color: Color(
                        0xFFFF6B6B,
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      "Clique para adicionar uma foto",
                      style: TextStyle(
                        fontWeight:
                            FontWeight
                                .bold,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(
                height: 25,
              ),

              campo(
                "Nome do livro",
                "Digite o nome do livro",
                Icons.menu_book,
                nomeController,
              ),

              campo(
                "Ano de lançamento",
                "Digite o ano",
                Icons.calendar_month,
                anoController,
                teclado:
                    TextInputType
                        .number,
              ),

              campo(
                "Autor",
                "Digite o nome do autor",
                Icons.person,
                autorController,
              ),

              campo(
                "Estado de conservação",
                "Novo, Bom, Regular...",
                Icons.auto_awesome,
                conservacaoController,
              ),

              campo(
                "Editora",
                "Digite a editora",
                Icons.business,
                editoraController,
              ),

              campo(
                "Observações",
                "Ex: está com algumas páginas dobradas",
                Icons.notes,
                observacoesController,
                linhas: 4,
              ),

              DropdownButtonFormField(
                value:
                    generoSelecionado,
                decoration:
                    InputDecoration(
                  labelText:
                      "Gênero do livro",
                  border:
                      OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(
                          18,
                        ),
                  ),
                ),
                items: [
                  "Fantasia",
                  "Romance",
                  "Jovem Adulto",
                  "Ficção Científica",
                  "Terror",
                  "Suspense",
                  "Literatura Clássica",
                  "Mistério",
                ].map((genero) {
                  return DropdownMenuItem(
                    value: genero,
                    child:
                        Text(genero),
                  );
                }).toList(),
                onChanged: (valor) {
                  setState(() {
                    generoSelecionado =
                        valor!;
                  });
                },
              ),

              const SizedBox(
                height: 30,
              ),

              SizedBox(
                width:
                    double.infinity,
                height: 60,
                child:
                    ElevatedButton.icon(
                  icon: Icon(
                    editando
                        ? Icons.save
                        : Icons.library_add,
                  ),
                  label: Text(
                    editando
                        ? "Salvar Alterações"
                        : "Publicar Livro",
                    style:
                        const TextStyle(
                      fontSize: 18,
                      fontWeight:
                          FontWeight
                              .bold,
                    ),
                  ),
                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(
                          0xFFFF6B6B,
                        ),
                    foregroundColor:
                        Colors.white,
                    shape:
                        RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(
                            15,
                          ),
                    ),
                  ),
                  onPressed: () {
                  if (nomeController.text.isEmpty ||
                      anoController.text.isEmpty ||
                      autorController.text.isEmpty ||
                      conservacaoController.text.isEmpty ||
                      editoraController.text.isEmpty ||
                      observacoesController.text.isEmpty) {

                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          "Preencha TODOS os campos",
                        ),
                      ),
                    );

                    return;
                  }

                  Livro livro = Livro(
                    nome: nomeController.text,
                    autor: autorController.text,
                    editora: editoraController.text,
                    ano: anoController.text,
                    conservacao: conservacaoController.text,
                    observacoes: observacoesController.text,
                    genero: generoSelecionado,
                  );

                  if (editando) {

                    DadosApp.livros[widget.indice!] = livro;

                  } else {

                    DadosApp.livros.add(livro);

                  }

                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const Biblioteca(),
                    ),
                  );
                },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class CadastrolivroEditar
    extends Cadastrolivro {
  const CadastrolivroEditar({
    super.key,
    required int indice,
  }) : super(indice: indice);
}