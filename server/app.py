from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__, static_folder="../static/dist", template_folder="../static")  # NOQA
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/crypto-high-score'  # NOQA
db = SQLAlchemy(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/high_score')
def high_score():
    from models import Score
    return jsonify({
        'scores': [
            [score.address, score.score] for score in
            Score.query
                 .order_by(Score.score.desc())
                 .limit(10)
                 .all()
        ]
    })


@app.route('/high_score/<address>/<int:score>')
def update_high_score(address, score):
    from models import Score
    score_obj = Score.query.filter(Score.address == address).first()
    if not score_obj:
        score_obj = Score(address, score)

        db.session.merge(score_obj)
        db.session.commit()
        return 'success'

    if score_obj and score_obj.score and score > score_obj.score:
        score_obj.score = score
        db.session.merge(score_obj)
        db.session.commit()
    return 'success'


if __name__ == '__main__':
    app.run()
