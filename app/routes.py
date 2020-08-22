from app import app

@app.route('/')
@app.route('/index')
def index():
'''
<html>
    <head>
        <title>htuomi</title>
    </head>
    <body>
        <h1>senate-vote project</h1>
        <a href='https://github.com/hanna-tuomi/senate-votes'>Git Repo</a>
    </body>
</html>'''