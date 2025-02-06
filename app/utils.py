import requests
from bs4 import BeautifulSoup

def obter_dados_fii(codigo_fii):
    url = f'https://statusinvest.com.br/fundos-imobiliarios/{codigo_fii}'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

    resposta = requests.get(url, headers=headers)

    if resposta.status_code == 200:
        pagina = BeautifulSoup(resposta.text, 'html.parser')

        tag_preco = pagina.find('strong', {'class': 'value'})
        preco = tag_preco.text.strip() if tag_preco else 'Preço não encontrado'

        tag_dividendo = pagina.find('strong', {'class': 'value d-inline-block fs-5 fw-900'})
        dividendo = tag_dividendo.text.strip() if tag_dividendo else 'Dividendo não encontrado'

        return {'preco': preco, 'dividendo': dividendo}
    else:
        return None
