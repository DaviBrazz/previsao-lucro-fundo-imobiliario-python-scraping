from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder='../static')  # Defina a pasta estática corretamente
    CORS(app)

    from . import routes  # Importa as rotas após a criação do app
    app.register_blueprint(routes.bp)

    return app
