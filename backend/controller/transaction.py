from flask import jsonify

from backend.model.transaction import TransactionDAO


class BaseTransaction:

    def build_map_dict(self, row):
        result = {'transaction_id': row[0], 'amount': row[1], 'date': row[2]}
        return result

    def build_map_dict_monthly_stats(self, row):
        result = {'year': row[0], 'month': row[1], 'month_number': row[2], 'month_income': row[3],
                  'month_year': row[1] + " " + row[0]}
        return result

    def build_map_dict_annual_stats(self, row):
        result = {'year': row[0], 'year_income': row[1]}
        return result

    def build_attr_dict(self, transaction_id, amount, date):
        result = {'transaction_id': transaction_id, 'amount': amount, 'date': date}
        return result

    def getAllTransactions(self):
        dao = TransactionDAO()
        transaction_list = dao.getAllTransactions()
        result_list = []
        for row in transaction_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getTransactionsInRange(self, json):
        start_date = json["start_date"]
        end_date = json["end_date"]
        dao = TransactionDAO()
        transaction_list = dao.getTransactionsInRange(start_date, end_date)
        result_list = []
        for row in transaction_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getTransactionById(self, transaction_id):
        dao = TransactionDAO()
        transaction_tuple = dao.getTransactionById(transaction_id)
        if not transaction_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(transaction_tuple)
            return jsonify(result), 200

    def insertTransaction(self, amount, date):
        dao = TransactionDAO()
        transaction_id = dao.insertTransaction(amount, date)
        if transaction_id is None:
            return None
        result = self.build_attr_dict(transaction_id, amount, date)
        return jsonify(result), 201

    def insertTransactionWithJson(self, json):
        amount = json['amount']
        date = json['date']

        dao = TransactionDAO()
        transaction_id = dao.insertTransaction(amount, date)
        if transaction_id is None:
            return None
        result = self.build_attr_dict(transaction_id, amount, date)
        return jsonify(result), 201

    def updateDatabase(self, tuple_list):
        dao = TransactionDAO()
        transaction_id = dao.updateDatabase(tuple_list)
        if transaction_id is None:
            return None
        result = transaction_id
        return jsonify(result), 201

    def updateTransaction(self, transaction_id, json):
        amount = json['amount']
        date = json['date']

        dao = TransactionDAO()
        if amount != '':
            dao.updateTransactionAmount(transaction_id, amount)
        if date != '':
            dao.updateTransactionDate(transaction_id, date)
        result = self.build_attr_dict(transaction_id, amount, date)
        return jsonify(result), 200

    def deleteTransaction(self, transaction_id):
        dao = TransactionDAO()
        result = dao.deleteTransaction(transaction_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getMonthlyStats(self):
        dao = TransactionDAO()
        transaction_list = dao.getMonthlyStats()
        result_list = []
        for row in transaction_list:
            obj = self.build_map_dict_monthly_stats(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getAnnualStats(self):
        dao = TransactionDAO()
        transaction_list = dao.getAnnualStats()
        result_list = []
        for row in transaction_list:
            obj = self.build_map_dict_annual_stats(row)
            result_list.append(obj)
        return jsonify(result_list), 200
