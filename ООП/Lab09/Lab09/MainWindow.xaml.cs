using Lab09.Model;
using System;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace Lab09
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        ActorContext db;
        static TextBox role;
        static TextBox name;
        public MainWindow()
        {
            InitializeComponent();
            
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            db = new ActorContext();
            db.users.Load();
            dgUsers.ItemsSource = db.users.Local.ToBindingList();
            db = new ActorContext();
            db.actors.Load();
            dgActors.ItemsSource = db.actors.Local.ToBindingList();
        }

        private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            db.Dispose();
        }

        string script = "";
        private void TxtScript_TextChanged(object sender, TextChangedEventArgs e)
        {
            script = Script.Text;
        }

        private void Script_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (script.Length == 0)
                    throw new Exception("Enter the query!");
                else
                {
                    if (script.Contains("Actors"))
                    {
                        string str = "ID\tRole\n";
                        var query = db.Database.SqlQuery<Actor>(script);
                        for (int i = 0; i < query.Count(); i++)
                        {
                            str += query.ElementAt(i).Id + "\t" +
                                query.ElementAt(i).Role + "\t\n";
                        }
                        MessageBox.Show(str);
                    }
                    else if (script.Contains("Users"))
                    {
                        string str = "ID\tName\n";
                        var query = db.Database.SqlQuery<User>(script);
                        for (int i = 0; i < query.Count(); i++)
                        {
                            str += query.ElementAt(i).Id + "\t" +
                                query.ElementAt(i).Name + "\t\n";
                        }
                        MessageBox.Show(str);
                    }
                    else
                        throw new Exception("Invalid query");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            finally
            {
                Script.Text = "";
            }
        }

        private void btn_add_Click(object sender, RoutedEventArgs e)
        {
            using (ActorContext db = new ActorContext())
            {
                User user1 = null;
                if (txt_Name.Text.Length != 0)
                {
                    user1 = new User { Name = txt_Name.Text };
                    db.users.Add(user1);
                }
                if (txt_Role.Text.Length != 0)
                {
                    Actor actor1 = new Actor { Role = txt_Role.Text, User = user1 };
                    db.actors.Add(actor1);
                }
                db.SaveChanges();
                Window_Loaded(new object(), new RoutedEventArgs());
                txt_Role.Text = "";
                txt_Name.Text = "";
            }
        }

        public static async Task FindObject() {
            using (ActorContext db = new ActorContext())
            {
                string str = "";
                if (role.Text.Length != 0)
                {
                    try
                    {
                        var actor = db.actors.Where(ac => ac.Role == role.Text).Single();
                        int id = actor.Id;
                        var a = await db.actors.FindAsync(id);
                        str = a.Id + " " + a.Role + " " + a.User.Name;
                        MessageBox.Show(str);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Not found");
                    }

                }
                if (name.Text.Length != 0)
                {
                    try
                    {
                        var user = db.users.Where(us => us.Name == name.Text).Single();
                        int id = user.Id;
                        var a = await db.users.FindAsync(id);
                        str = a.Id + " " + a.Name;
                        MessageBox.Show(str);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Not found");
                    }
                }
                db.SaveChanges();
                role.Text = "";
                name.Text = "";
            }
        }

        private void btn_find_Click(object sender, RoutedEventArgs e)
        {
            role = txt_Role;
            name = txt_Name;
            FindObject().GetAwaiter();
        }

        private void btn_update_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (dgActors.SelectedItems.Count > 0)
                {
                    for (int i = 0; i < dgActors.SelectedItems.Count; i++)
                    {
                        Actor actor = dgActors.SelectedItems[i] as Actor;
                        int id = actor.Id;
                        if (actor != null)
                        {
                            Actor a = db.actors.Find(id);
                            a.Role = txt_Role.Text;
                            db.Entry(a).State = EntityState.Modified;
                        }
                    }
                }
                if (dgUsers.SelectedItems.Count > 0)
                {
                    for (int i = 0; i < dgUsers.SelectedItems.Count; i++)
                    {
                        User user = dgUsers.SelectedItems[i] as User;
                        int id = user.Id;
                        if (user != null)
                        {
                            User u = db.users.Find(id);
                            u.Name = txt_Name.Text;
                            db.Entry(u).State = EntityState.Modified;
                        }
                    }
                }
                db.SaveChanges();
                Window_Loaded(new object(), new RoutedEventArgs());
                txt_Role.Text = "";
                txt_Name.Text = "";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void btn_del_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (dgActors.SelectedItems.Count > 0)
                {
                    for (int i = 0; i < dgActors.SelectedItems.Count; i++)
                    {
                        Actor actor = dgActors.SelectedItems[i] as Actor;
                        int id = actor.Id;
                        if (actor != null)
                        {
                            Actor a = db.actors.Find(id);
                            db.actors.Remove(a);
                        }
                    }
                }

                if (dgUsers.SelectedItems.Count > 0)
                {
                    for (int i = 0; i < dgUsers.SelectedItems.Count; i++)
                    {
                        User user = dgUsers.SelectedItems[i] as User;
                        int id = user.Id;
                        if (user != null)
                        {
                            User u = db.users.Find(id);
                            db.users.Remove(u);
                        }
                    }
                }
                db.SaveChanges();
                Window_Loaded(new object(), new RoutedEventArgs());
                txt_Role.Text = "";
                txt_Name.Text = "";
            }
            catch(Exception ex) {
                MessageBox.Show(ex.Message);
            }
        }

        private void btn_transact_Click(object sender, RoutedEventArgs e)
        {
            using(ActorContext db = new ActorContext())
            {
                using(var transaction = db.Database.BeginTransaction())
                {
                    try {
                        User user = db.users.FirstOrDefault(p => p.Name == "Polina");
                        MessageBox.Show(user.Name);
                        string str = "ID\tName\n";
                        var query = db.Database.SqlQuery<User>("select * from Users;");
                        for (int i = 0; i < query.Count(); i++)
                        {
                            str += query.ElementAt(i).Id + "\t" +
                                query.ElementAt(i).Name + "\t\n";
                        }
                        MessageBox.Show(str);
                        db.SaveChanges();
                        Script.Text = "commit";
                        transaction.Commit();
                    }
                    catch (Exception ex) {
                        MessageBox.Show("rollback");
                        transaction.Rollback();
                    }
                }
            }
        }
    }
}
