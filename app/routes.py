from flask import Blueprint, render_template, jsonify
from .utils import obter_dados_fii

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/dados-fii/<codigo_fii>')
def dados_fii(codigo_fii):
    dados = obter_dados_fii(codigo_fii)
    if dados:
        return jsonify(dados)
    else:
        return jsonify({'erro': 'Não foi possível acessar os dados.'}), 500
