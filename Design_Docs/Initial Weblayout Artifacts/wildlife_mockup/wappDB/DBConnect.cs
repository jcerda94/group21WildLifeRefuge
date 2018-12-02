using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.IO;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using DebugStuff;

namespace wappDB
{
    public class DBConnect
    {
        //private MySqlConnection sqlConnection;
        private SqlConnection sqlConnection;
        public DBConnect()
        {
            Initialize();
            if( !rebuildDB() )
            {
                MyDebug.DoAssert(false, "rebuild failed");
            }
        }
          
        private void Initialize()
        {
            // MySQL version
            // MySQL version
            // MySQL version
            //
            ////server = "localhost";
            ////database = "new_schema";
            ////uid = "root";
            ////password = "jwcLucky123!";
            //
            //server = "localhost";
            //database = "world";
            //uid = "root";
            //password = "Mysql6170abc";
            //
            //
            //string connectionString;
            //connectionString = "SERVER=" + server + ";" + "DATABASE=" + database + ";" + "UID=" + uid + ";" + "PASSWORD=" + password + ";";
            //
            //connection = new MySqlConnection(connectionString);


            // to set this up for microsoft's SQL
            // Solution Explorer:  right-click on project > Add > Item > C# > data > Service-based Database
            // project>properties   > security >  set "This is a full trust application"

            MyDebug.DPrint(Global.sprintf("Started"));

            sqlConnection = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\dprin\TMA\__Jacobs\wapp\wappDB\myDB.mdf;Integrated Security=True");
            //sqlConnection.Open();
        }

        private static bool isConnected = false; 
        private bool OpenConnection()
        {
            if(isConnected) { return true; }
            try
            {
                MyDebug.DPrint(Global.sprintf("Open DB"));
                sqlConnection.Open();
                isConnected = true;
                return true;
            }
            catch (MySqlException ex)
            {
                MyDebug.DPrint(Global.sprintf("Exp: {0}", ex.Message));
                MyDebug.DPrint(Global.sprintf("Exp: {0}", ex.StackTrace));
                return false;
            }
        }
        private static bool isClosed = false;

        private bool CloseConnection()
        {
 
            if (isClosed)
            {
                return true;
            }
            try
            {
                sqlConnection.Close();
                isConnected = false;
                isClosed = true;
                return true;
            }
            catch (MySqlException ex)
            {
                MyDebug.DPrint(Global.sprintf("Exp: {0}", ex.Message));
                MyDebug.DPrint(Global.sprintf("Exp: {0}", ex.StackTrace));
                return false;
            }
        }

        public class User
        {
            public int ID;
            public string FName;
            public string LName;
            public string Company; 
            public string Phone; 
            public new string ToString()
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("{0,3}: {1,10} {2,-14},  {3}  cell: {4}", ID, FName, LName.TrimEnd(' '), Company, Phone); 
                return sb.ToString();
            }
        };

        #if __MYSQL__
        public SqlDataReader executSQL(string sql)
        {
            MySqlCommand cmd = new MySqlCommand(query, sqlConnection);
            MySqlDataReader dataReader = cmd.ExecuteReader();
        }
        #else
        public SqlDataReader executSQL(string sql)
        {
            SqlCommand cmd = new SqlCommand(sql, sqlConnection);
            SqlDataReader dataReader = cmd.ExecuteReader();
            return dataReader;
        }
        #endif

        public List<User> GetUsers()
        {
            MyDebug.DPrint(Global.sprintf("ShowUsers"));

            string query = "";
            query += @" select x.id,      ";
            query += @"        x.fname,   ";
            query += @"        x.lname,   ";
            query += @"        x.company, ";
            query += @"        x.phone    ";
            query += @" from _User as x   ";
            query += @" ORDER BY x.lname ;";

            List<User> list = new List<User>();
            if (this.OpenConnection() == true)
            {
                var dataReader = executSQL(query);
                while (dataReader.Read())
                {
                    User user = new User();
                    user.ID      =    (int)dataReader["ID"];
                    user.FName   = (string)dataReader["FName"] + "";
                    user.LName   = (string)dataReader["LName"] + "";
                    user.Company = (string)dataReader["Company"] + "";
                    user.Phone   = (string)dataReader["Phone"];
                    list.Add(user);
                }
                dataReader.Close();
                this.CloseConnection();
            }
            return list;
        }

        private static bool doRebuildOnce=true;
        public bool rebuildDB()
        {
            if(!doRebuildOnce) return true;
            doRebuildOnce=false;

            if (!sqlNonQuery(@"DROP TABLE IF EXISTS _User "))              { return false; }

            string sql = "";
            sql += @" CREATE TABLE _User (     ";
            sql += @" ID      int         NOT NULL, ";
            sql += @" FName   varchar(64) NOT NULL, ";
            sql += @" LName   varchar(64) NOT NULL, ";
            sql += @" Company varchar(64),";
            sql += @" Phone   char(12), ";
            sql += @" PRIMARY KEY (ID)  ";
            sql += @" );";
            if (!sqlNonQuery(sql)) { return false; } sql = "";
                
            int id = 1;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Johnny',  'Frankenstein', 'AAA Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Dwight',  'Schrute'     , 'ESPN Inc.',   '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Walter',  'Disney'      , 'Disney Inc.', '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Princess','Lea'         , 'Disney Inc.', '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Steven',  'Jones'       , 'ABC Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Jessica', 'Jane'        , 'CBS Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'Sara',    'Daniels'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'Daniels'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            if (!sqlNonQuery(String.Format("INSERT INTO _User  values({0}, 'user-{0}',    'last-name'     , 'FYI Inc.',    '949-823-1234');", id++))) return false;
            

            Debug.WriteLine(String.Format("RebuildDB sucess."));
            return true;
        }
        public bool sqlNonQuery(string sql)
        {
            try
            {
                MyDebug.DPrint(Global.sprintf("sql: {0}", sql));

                if (this.OpenConnection() == true)
                {
                    #if __MYSQL__
                    MySqlCommand cmd = new MySqlCommand(sql,sqlConnection);
                    #else
                    SqlCommand cmd = new SqlCommand(sql, sqlConnection);
                    #endif 
                    cmd.CommandText = sql;
                    cmd.Connection = sqlConnection;
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                dumpException(e);
                return false;
            }
            return true;
        }
        public void dumpException(Exception e)
        {
            MyDebug.DPrint(Global.sprintf("Exception: {0}", e.HResult));
            MyDebug.DPrint(Global.sprintf("Exception: {0}", e.Message));
            MyDebug.DPrint(Global.sprintf("Exception: {0}", e.StackTrace));
        }

    }
}
