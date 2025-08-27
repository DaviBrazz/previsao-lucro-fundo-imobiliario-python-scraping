import math
import requests
from bs4 import BeautifulSoup

def obter_dados_fii(codigo_fii: str):
    url = f'https://statusinvest.com.br/fundos-imobiliarios/{codigo_fii}'
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/91.0.4472.124 Safari/537.36'
        )
    }
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        return None

    pagina = BeautifulSoup(resp.text, 'html.parser')

    tag_preco = pagina.find('strong', {'class': 'value'})
    preco = tag_preco.text.strip() if tag_preco else 'Preço não encontrado'

    tag_dividendo = pagina.find('strong', {'class': 'value d-inline-block fs-5 fw-900'})
    dividendo = tag_dividendo.text.strip() if tag_dividendo else 'Dividendo não encontrado'

    return {'preco': preco, 'dividendo': dividendo}


def _to_float(v) -> float:
    if v is None or v == '':
        return 0.0
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace('R$', '').replace(' ', '').replace('.', '').replace(',', '.')
    try:
        return float(s)
    except ValueError:
        return 0.0


def gerar_informes(payload: dict) -> dict:
    codigo = (payload.get('codigo_fii') or '').strip().upper()
    if not codigo:
        raise KeyError('codigo_fii')

    dados = obter_dados_fii(codigo)
    if (not dados or
        dados.get('preco') == 'Preço não encontrado' or
        dados.get('dividendo') == 'Dividendo não encontrado'):
        raise ValueError('Fundo imobiliário não encontrado')

    preco = _to_float(dados['preco'])
    dividendo = _to_float(dados['dividendo'])

    quantidade_cotas = int(payload.get('quantidade_cotas') or 0)
    retorno_mensal = _to_float(payload.get('retorno_mensal') or 0)
    valor_investido = _to_float(payload.get('valor_investido') or 0)

    if quantidade_cotas > 0:
        valor_investido = preco * quantidade_cotas
        retorno_mensal = dividendo * quantidade_cotas
    elif retorno_mensal > 0:
        quantidade_cotas = math.ceil(retorno_mensal / dividendo) if dividendo > 0 else 0
        valor_investido = preco * quantidade_cotas
    elif valor_investido > 0:
        quantidade_cotas = math.ceil(valor_investido / preco) if preco > 0 else 0
        retorno_mensal = dividendo * quantidade_cotas
    else:
        quantidade_cotas = 0
        valor_investido = 0.0
        retorno_mensal = 0.0

    return {
        'codigo_fii': codigo,
        'valor_atual_fundo': round(preco, 2),
        'ultimo_dividendo': round(dividendo, 2),
        'valor_investido': round(valor_investido, 2),
        'quantidade_cotas': int(quantidade_cotas),
        'retorno_mensal': round(retorno_mensal, 2),
    }
