# Previsão de Lucro - Fundos Imobiliários (Python + Flask)

Aplicação Flask que faz scraping de dados de fundos imobiliários e calcula previsões de retorno.

---

## Tecnologias

- Python 3.12
- Flask
- BeautifulSoup4
- Requests
- Poetry (para gerenciamento de dependências)
- Docker (opcional para deploy)

---

## Pré-requisitos

- Python 3.12 instalado
- Poetry instalado
- Docker (opcional, se quiser rodar em container)

---


## Execução do Projeto

### 1. Clone o repositório

```bash
# clonando o repositório
git clone git@github.com:DaviBrazz/previsao-lucro-fundo-imobiliario-python-scraping.git

```
## Rodando localmente

### 1. Entrar na pasta do projeto
```bash
# entrando no diretório do projeto
cd previsao-lucro-fundo-imobiliario-python-scraping

```
### 2. Instale as Dependências
```bash
# instalando dependências
poetry install


```
### 3. Execute o Projeto
```bash
# executando o projeto
poetry run start


```
## Rodando com Docker

### 1. Buildar a imagem

```bash
# construindo a imagem
docker build -t previsao-fii .

```
### 2. Rodar o Container
```bash
# rodando o container
docker run -p 5050:5050 previsao-fii

```
## Rodando com Docker Compose

### 1. Suba a aplicação

```bash
# subindo a aplicação
docker-compose up --build

```
# Autor
[Davi Moreira Braz de Lima](https://www.linkedin.com/in/davi-braz-8bb09a357/)  
davibraz.profissional@gmail.com  

