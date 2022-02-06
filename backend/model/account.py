
from backend.config.dbconfig import pg_config
import psycopg2
import psycopg2.extras


class AccountDAO:
    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='%s'" % (pg_config['dbname'], pg_config['user'],
                                                                              pg_config['password'],
                                                                              pg_config['dbport'], pg_config['dbhost'])
        self.conn = psycopg2.connect(connection_url)

    def getAllAccounts(self):
        cursor = self.conn.cursor()
        query = "SELECT account_id, username, password FROM account;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getAccountById(self, account_id):
        cursor = self.conn.cursor()
        query = "SELECT account_id, username, password from account WHERE account_id = %s;"
        cursor.execute(query, (account_id,))
        result = cursor.fetchone()
        return result

    def getAccountByUsername(self, username):
        cursor = self.conn.cursor()
        query = "SELECT account_id, username, password from account WHERE username = %s;"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        return result

    def insertAccount(self, username, password):
        cursor = self.conn.cursor()
        query = "INSERT INTO account (username, password) VALUES (%s,%s) " \
                "ON CONFLICT DO NOTHING RETURNING account_id;"
        try:
            cursor.execute(query, (username, password,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return None
        else:
            try:
                account_id = cursor.fetchone()[0]
                self.conn.commit()
                return account_id
            except:
                return None

    def updateAccount(self, account_id, username, password):
        cursor = self.conn.cursor()
        query = "UPDATE account SET username = %s, password = %s WHERE account_id=%s;"
        try:
            cursor.execute(query, (username, password, account_id,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return False
        else:
            self.conn.commit()
            return True

    def updateAccountUserName(self, account_id, username):
        cursor = self.conn.cursor()
        query = "UPDATE account SET username = %s WHERE account_id=%s;"
        try:
            cursor.execute(query, (username, account_id,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return False
        else:
            self.conn.commit()
            return True

    def updateAccountPassword(self, account_id, password):
        cursor = self.conn.cursor()
        query = "UPDATE account SET password = %s WHERE account_id=%s;"
        try:
            cursor.execute(query, (password, account_id,))
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return False
        else:
            self.conn.commit()
            return True

    def deleteAccount(self, account_id):
        cursor = self.conn.cursor()
        query = "DELETE FROM account WHERE account_id=%s;"
        cursor.execute(query, (account_id,))
        affected_rows = cursor.rowcount
        self.conn.commit()
        return affected_rows != 0
