

import os
from app import create_app

def main():
    app = create_app()
    port = int(os.environ.get("PORT", 5050))
    app.run(debug=True, host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
