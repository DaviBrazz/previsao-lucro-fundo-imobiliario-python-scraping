# Usando imagem oficial do Python 3.12
FROM python:3.12-slim

# Definindo diretório de trabalho
WORKDIR /app

# Copiando arquivos de configuração do Poetry
COPY pyproject.toml poetry.lock README.md /app/

# Instalando Poetry
RUN pip install --upgrade pip \
    && pip install poetry

COPY . /app

# Instalando dependências sem criar venv separado
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copiando todo o código da aplicação
# Expondo a porta que o Flask vai rodar
EXPOSE 5050

# Comando para rodar a aplicação
CMD ["poetry", "run", "start"]
