import email
import email.policy
import imaplib
from datetime import datetime
import re
import os
import email.utils
from decimal import Decimal
from pytz import timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from backend.controller.account import BaseAccount
from backend.controller.transaction import BaseTransaction

app = Flask(__name__)

load_dotenv(dotenv_path=".env")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_EXPIRATION_DELTA"] = os.getenv("JWT_EXPIRATION_DELTA")

jwt = JWTManager(app)

EMAIL = os.getenv('EMAIL')
PASSWORD = os.getenv('EMAIL_PASSWORD')
SERVER = os.getenv('EMAIL_SERVER')

CORS(app)


@app.route('/codfish/register', methods=['POST'])
@jwt_required()
def handleRegister():
    username = request.json['username']
    password = request.json['password']
    password_hash = generate_password_hash(password)
    entry = BaseAccount().insertAccount(username, password_hash)
    return entry


@app.route('/codfish/login', methods=['POST'])
def handleLogin():
    username = request.json['username']
    password = request.json['password']
    user = BaseAccount().getAccountByUsername(username)
    if user:
        password_hash = user[0].json['password']
        if check_password_hash(password_hash, password):
            return jsonify(
                access_token=create_access_token(identity=user[0].json['account_id'],
                                                 additional_claims={"username": username}))
    return jsonify({"msg": "Incorrect username or password"}), 401


@app.route('/codfish/range', methods=['POST'])
# @jwt_required()
def handleTransactionsInRange():
    # identity = get_jwt_identity()
    # if identity != 2 and identity != 3:
    #     return jsonify({"msg": "Access denied."}), 401
    result = BaseTransaction().getTransactionsInRange(request.json)
    return result


@app.route('/codfish/month', methods=['GET'])
# @jwt_required()
def handleMonthlyStats():
    # identity = get_jwt_identity()
    # if identity != 2 and identity != 3:
    #     return jsonify({"msg": "Access denied."}), 401
    return BaseTransaction().getMonthlyStats()


@app.route('/codfish/year', methods=['GET'])
# @jwt_required()
def handleAnnualStats():
    # identity = get_jwt_identity()
    # if identity != 2 and identity != 3:
    #     return jsonify({"msg": "Access denied."}), 401
    return BaseTransaction().getAnnualStats()


@app.route('/codfish/update', methods=['GET'])
@jwt_required()
def updateDatabase():
    identity = get_jwt_identity()
    if identity != 2 and identity != 3:
        return jsonify({"msg": "Access denied."}), 401
    mail = imaplib.IMAP4_SSL(SERVER, port='993')
    mail.login(EMAIL, PASSWORD)

    # select the email folder

    mail.select('"'+os.getenv("EMAIL_SELECTED_FOLDER")+'"', readonly=False)

    status, data = mail.search(None,
                               '(UNSEEN FROM ' + os.getenv("EMAIL_FROM") + ')')

    # the list returned is a list of bytes separated
    # by white spaces on this format: [b'1 2 3', b'4 5 6']
    # so, to separate it first we create an empty list
    mail_ids = []
    # then we go through the list splitting its blocks
    # of bytes and appending to the mail_ids list
    values_list = []
    for block in data:
        # the split function called without parameter
        # transforms the text or bytes into a list using
        # as separator the white spaces:
        # b'1 2 3'.split() => [b'1', b'2', b'3']
        mail_ids += block.split()

    # now for every id we'll fetch the email
    # to extract its content
    for i in mail_ids:
        # the fetch function fetch the email given its id
        # and format that you want the message to be
        status, data = mail.fetch(i, '(RFC822)')
        mail.store(i, '+FLAGS', '\Seen')

        # the content data at the '(RFC822)' format comes on
        # a list with a tuple with header, content, and the closing
        # byte b')'

        for response_part in data:
            # so if its a tuple...
            if isinstance(response_part, tuple):
                # get the content at its second element
                # skipping the header at the first and the closing
                # at the third
                message = email.message_from_bytes(response_part[1])

                # extract content
                # mail_from = message['from']
                # mail_subject = message['subject']
                mail_date = message['Date']

                # body can be in plain text or multipart
                # if its not plain text we need to separate the message
                # from its annexes to get the text
                if message.is_multipart():
                    mail_content = ''

                    # on multipart we have the text message and
                    # another things like annex, and html version
                    # of the message, in that case we loop through
                    # the email payload
                    for part in message.get_payload():
                        # if the content type is text/plain
                        # we extract it
                        if part.get_content_type() == 'text/plain':
                            mail_content += part.get_payload()
                else:
                    # if the message isn't multipart, just extract it
                    mail_content = message.get_payload(decode=True)

                found = re.search(r"\$\d+.\d+", str(mail_content))
                amount = Decimal(found.group().strip('$'))
                date = email.utils.parsedate_to_datetime(mail_date)
                values_list.append((amount, date))
    if not values_list:
        return jsonify({"msg": "Already synced!"}), 200
    BaseTransaction().updateDatabase(values_list)
    mail.logout()
    return jsonify({"msg": "Database updated!"}), 200


if __name__ == '__main__':
    app.run()
