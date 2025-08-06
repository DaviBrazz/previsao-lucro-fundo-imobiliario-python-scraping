import os
from flask import Flask
from flask_cors import CORS


def create_app():
    base_dir = os.path.abspath(os.path.dirname(__file__))

    app = Flask(
        __name__,
        static_folder=os.path.join(base_dir, 'static'),
        template_folder=os.path.join(base_dir, 'templates')
    )

    CORS(app)

    from . import routes
    app.register_blueprint(routes.bp)

    return app
