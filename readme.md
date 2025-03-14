# Backend - ToDo App

## Descrição

Este é o backend da aplicação ToDo, desenvolvido com Node.js, utilizando Docker para facilitar a configuração e execução do ambiente de desenvolvimento. O backend expõe uma API REST para gerenciar tarefas de uma lista ToDo.

## Ferramentas Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework para criação de APIs RESTful.
- **TypeScript**: Superset do JavaScript, com tipagem estática.
- **Docker**: Para facilitar o ambiente de desenvolvimento e testes.
- **Firestore**: Banco de dados NoSQL para armazenar as tarefas.
- **tsyringe**: Biblioteca para injeção de dependências.
- **Jest**: Framework para testes unitários.
- **ESLint**: Ferramenta de linting para garantir consistência no código.

## Arquitetura

A arquitetura do projeto segue o padrão **Clean Architecture**, com a seguinte estrutura:

- **src**:
  - **application**: Camada de serviço (lógica de negócios).
  - **domain**: Entidades e interfaces do domínio.
  - **infra**: Implementações de integração com o Firestore e outros serviços externos.
  - **presentation**: Controladores e rotas da API.
  - **shared**: Exceções e utilitários.

## Como Rodar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/clinicorp-challenge.git
   cd clinicorp-challenge
   ```

2. Você precisa ter uma conta google Firestore e um projeto com o nome clinicorp-challenge, então você precisa
   gerar uma nova chave no formato json e deixa-la na raíz do projeto, e então coloque o nome do arquivo json no FIRESTORE_PROJECT_KEY do seu .env

3. Execute o projeto com **Docker Compose**:

   ```bash
   docker-compose up
   ```

4. A API estará disponível em `http://localhost:3000`.

## Como Rodar os Testes Unitários

1. Para rodar os testes unitários, execute o comando:
   ```bash
   npm run test
   ```

O Jest irá rodar os testes e gerar o relatório no terminal.

## Endpoints

- **POST /api/v1/todo**: Criação de uma nova tarefa.
- **GET /api/v1/todo**: Listagem das tarefas.

---

**Autor**: Wanderley Trindade (Junior Trindade)

```

```
