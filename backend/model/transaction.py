from backend.config.dbconfig import pg_config
import psycopg2
import psycopg2.extras


class TransactionDAO:
    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='%s'" % (pg_config['dbname'], pg_config['user'],
                                                                              pg_config['password'],
                                                                              pg_config['dbport'], pg_config['dbhost'])
        self.conn = psycopg2.connect(connection_url)

    def getAllTransactions(self):
        cursor = self.conn.cursor()
        query = "SELECT transaction_id, amount, date FROM transaction;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getTransactionsInRange(self, start_date, end_date):
        cursor = self.conn.cursor()
        query = "SELECT transaction_id, amount, date FROM transaction WHERE date BETWEEN %s AND %s;"
        cursor.execute(query, (start_date, end_date,))
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getTransactionById(self, transaction_id):
        cursor = self.conn.cursor()
        query = "SELECT transaction_id, amount, date from transaction WHERE transaction_id = %s;"
        cursor.execute(query, (transaction_id,))
        result = cursor.fetchone()
        return result

    def insertTransaction(self, amount, date):
        cursor = self.conn.cursor()
        query = "INSERT INTO transaction (amount, date) VALUES (%s,%s) " \
                "ON CONFLICT DO NOTHING RETURNING transaction_id;"
        try:
            cursor.execute(query, (amount, date,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return None
        else:
            try:
                transaction_id = cursor.fetchone()[0]
                self.conn.commit()
                return transaction_id
            except psycopg2.IntegrityError:
                return None

    def updateTransaction(self, transaction_id, amount, date):
        cursor = self.conn.cursor()
        query = "UPDATE transaction SET amount = %s, date = %s WHERE transaction_id=%s;"
        try:
            cursor.execute(query, (amount, date, transaction_id,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return False
        else:
            self.conn.commit()
            return True

    def updateTransactionAmount(self, transaction_id, amount):
        cursor = self.conn.cursor()
        query = "UPDATE transaction SET amount = %s WHERE transaction_id=%s;"
        try:
            cursor.execute(query, (amount, transaction_id,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return False
        else:
            self.conn.commit()
            return True

    def updateTransactionDate(self, transaction_id, amount):
        cursor = self.conn.cursor()
        query = "UPDATE transaction SET date = %s WHERE transaction_id=%s;"
        try:
            cursor.execute(query, (amount, transaction_id,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return False
        else:
            self.conn.commit()
            return True

    def deleteTransaction(self, transaction_id):
        cursor = self.conn.cursor()
        query = "DELETE FROM transaction WHERE transaction_id=%s;"
        cursor.execute(query, (transaction_id,))
        affected_rows = cursor.rowcount
        self.conn.commit()
        return affected_rows != 0

    def getMonthlyStats(self):
        cursor = self.conn.cursor()
        query = """SELECT to_char(date_trunc('month', date), 'YYYY') AS year,
       to_char(date_trunc('month', date), 'Mon') AS month,
       to_char(date_trunc('month', date), 'MM') AS month_number,
       sum(amount) AS monthly_income
       FROM transaction 
       GROUP BY date_trunc('month', date);"""
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getAnnualStats(self):
        cursor = self.conn.cursor()
        query = """SELECT to_char(date_trunc('month', date), 'YYYY') AS year,
               sum(amount) AS annual_income
               FROM transaction 
               GROUP BY date_trunc('year', date);"""
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def updateDatabase(self, list):
        cursor = self.conn.cursor()
        query = "INSERT INTO transaction(amount,date) VALUES (%s,%s);"
        try:
            cursor.executemany(query, list)
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return None
        else:
            try:
                transaction_id = cursor.fetchone()[0]
                self.conn.commit()
                return transaction_id
            except psycopg2.IntegrityError:
                return None
