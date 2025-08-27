from flask import Blueprint, render_template, jsonify, request
from .utils import gerar_informes

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/dados', methods=['POST'])
def dados():
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    try:
        resultado = gerar_informes(payload)
        return jsonify(resultado), 200
    except KeyError as e:
        return jsonify({'erro': f'Campo obrigatório ausente: {str(e)}'}), 400
    except ValueError as e:
        msg = str(e)
        status = 404 if 'não encontrado' in msg.lower() else 400
        return jsonify({'erro': msg}), status
    except Exception:
        return jsonify({'erro': 'Erro interno ao gerar informes.'}), 500
