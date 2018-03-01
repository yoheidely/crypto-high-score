from app import db


class Score(db.Model):
    __tablename__ = 'scores'

    address = db.Column(db.String, primary_key=True)
    score = db.Column(db.Integer)

    def __init__(self, address, score):
        self.address = address
        self.score = score
