from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import app, db
from models import Score

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

from models import Score  # NOQA


if __name__ == '__main__':
    manager.run()
