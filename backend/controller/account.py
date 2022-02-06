from flask import jsonify

from backend.model.account import AccountDAO


class BaseAccount:

    def build_map_dict(self, row):
        result = {'account_id': row[0], 'username': row[1], 'password': row[2]}
        return result

    def build_attr_dict(self, account_id, username):
        result = {'account_id': account_id, 'username': username}
        return result

    def getAllAccounts(self):
        dao = AccountDAO()
        account_list = dao.getAllAccounts()
        result_list = []
        for row in account_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getAccountById(self, account_id):
        dao = AccountDAO()
        account_tuple = dao.getAccountById(account_id)
        if not account_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(account_tuple)
            return jsonify(result), 200

    def getAccountByUsername(self, username):
        dao = AccountDAO()
        account_tuple = dao.getAccountByUsername(username)
        if not account_tuple:
            return None
        else:
            result = self.build_map_dict(account_tuple)
            return jsonify(result), 200

    def insertAccount(self, username, password):
        dao = AccountDAO()
        account_id = dao.insertAccount(username, password)
        if account_id is None:
            return None
        result = self.build_attr_dict(account_id, username)
        return jsonify(result), 201

    def updateAccount(self, account_id, json):
        username = json['username']
        password = json['password']
        dao = AccountDAO()
        if username != '':
            dao.updateAccountUserName(account_id, username)
        if password != '':
            dao.updateAccountPassword(account_id, password)
        result = self.build_attr_dict(account_id, username)
        return jsonify(result), 200

    def deleteAccount(self, account_id):
        dao = AccountDAO()
        result = dao.deleteAccount(account_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404
