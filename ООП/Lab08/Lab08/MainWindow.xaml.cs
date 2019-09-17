using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;

namespace Lab08
{
    public partial class MainWindow : Window
    {
        public static string str;
        public static string connectionString = ConfigurationManager.ConnectionStrings["Connection"].ConnectionString;
        SqlConnection connection;       // для создания канала связи между программой и источником данных 
        SqlCommand command;
        SqlDataAdapter adapter1;        // для заполнения DataSet (образ бд) и обновления БД 
        SqlDataAdapter adapter2;
        DataTable dataComp;             // таблица бд
        DataTable dataProc;
        bool fl = false;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                connection = new SqlConnection(connectionString);
                connection.Open();

                string sqlExpression = "SELECT * FROM Computer";
                dataComp = new DataTable();
                command = new SqlCommand(sqlExpression, connection);
                adapter1 = new SqlDataAdapter(command);
                adapter1.Fill(dataComp);
                dataGridComp.ItemsSource = dataComp.DefaultView;

                string sqlExpression2 = "SELECT * FROM Processor";
                dataProc = new DataTable();
                command = new SqlCommand(sqlExpression2, connection);
                adapter2 = new SqlDataAdapter(command);
                adapter2.Fill(dataProc);
                dataGridProc.ItemsSource = dataProc.DefaultView;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            finally {
                connection.Close();
            }
        }

        private void UpdateDB()
        {
            SqlCommandBuilder comandbuilder = new SqlCommandBuilder(adapter1);  // автоматич генер-т команды, кот позволяют согласовать изменения, 
            SqlCommandBuilder comandbuilder2 = new SqlCommandBuilder(adapter2); // вносимые в объект dataset, со связанной бд
            adapter1.Update(dataComp);
            adapter2.Update(dataProc);
        }
        
        private void GetProcessors()
        {
            string sqlExpression = "insertANDselectProc";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand(sqlExpression, connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                var reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    str = $"{reader.GetName(1)}\t{reader.GetName(2)}\t{reader.GetName(3)}\t\n";

                    while (reader.Read())
                    {
                        object type = reader.GetValue(1);
                        object processor = reader.GetValue(2);
                        object size = reader.GetValue(3);
                        str += $"{type}\t{processor}\t\t{size}\t\n";
                    }
                }
                MessageBox.Show(str);
                reader.Close();
                Window_Loaded(new object(), new RoutedEventArgs());
            }
            fl = true;
        }

        private void BtnUpdate_Click(object sender, RoutedEventArgs e)
        {
            UpdateDB();
        }

        private void BtnDel_Click(object sender, RoutedEventArgs e)
        {
            if (dataGridComp.SelectedItems != null)
            {
                for (int i = 0; i < dataGridComp.SelectedItems.Count; i++)
                {
                    DataRowView datarowView = dataGridComp.SelectedItems[i] as DataRowView;
                    if (datarowView != null)
                    {
                        DataRow dataRow = (DataRow)datarowView.Row;
                        dataRow.Delete();
                    }
                }
            }
            if (dataGridProc.SelectedItems != null)
            {
                for (int i = 0; i < dataGridProc.SelectedItems.Count; i++)
                {
                    DataRowView datarowView = dataGridProc.SelectedItems[i] as DataRowView;
                    if (datarowView != null)
                    {
                        DataRow dataRow = (DataRow)datarowView.Row;
                        dataRow.Delete();
                    }
                }
            }
            UpdateDB();
        }
        
        private void StoredProc_Click(object sender, RoutedEventArgs e)
        {
            if (fl)
                MessageBox.Show("Хранимая процедура была выполнена!");
            else
                GetProcessors();
        }

        private void Script_Click(object sender, RoutedEventArgs e)
        {
            SqlTransaction tx = null;
            try
            {
                if (script != "")
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();
                        SqlCommand command = new SqlCommand(script, connection);
                        tx = connection.BeginTransaction();
                        command.Transaction = tx;
                        SqlDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            str = $"{reader.GetName(1)}\t{reader.GetName(2)}\t{reader.GetName(3)}\t\n";

                            while (reader.Read())
                            {
                                object type = reader.GetValue(1);
                                object processor = reader.GetValue(2);
                                object size = reader.GetValue(3);
                                str += $"{type}\t{processor}\t\t{size}\t\n";
                            }
                        }
                        MessageBox.Show(str);
                        reader.Close();

                        tx.Commit();
                    }
                }
                else
                {
                    MessageBox.Show("enter script!");
                }
                Window_Loaded(new object(), new RoutedEventArgs());
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message);
                tx.Rollback();
            }
        }
        
        string script = "";
        private void TxtScript_TextChanged(object sender, TextChangedEventArgs e)
        {
            script = Script.Text;
        }
        
    }
}
