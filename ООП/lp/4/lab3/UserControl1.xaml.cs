using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace lab3
{
    /// <summary>
    /// Логика взаимодействия для UserControl1.xaml
    /// </summary>
    public partial class UserControl1 : UserControl
    {

        // определение событие
        public static readonly RoutedEvent ClickEvent;

        static UserControl1()
        {
            // регистрация маршрутизированного события
            UserControl1.ClickEvent = EventManager.RegisterRoutedEvent("OnPathUpdeted",
                RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(UserControl1));
            //................................
        }
        // обертка над событием
        public event RoutedEventHandler OnPathUpdeted
        {
            add
            {
                // добавление обработчика
                base.AddHandler(ClickEvent, value);
            }
            remove
            {
                // удаление обработчика
                base.RemoveHandler(ClickEvent, value);
            }
        }

        public string FileName
        {
            get { return FBCTextBox.Text; }
            set { FBCTextBox.Text = value; }
        }

        public UserControl1()
        {
            InitializeComponent();
        }

        void RiseClickEvent()
        {
            RoutedEventArgs newEventArgs = new RoutedEventArgs(ClickEvent);
            RaiseEvent(newEventArgs);
        }

        private void FBCTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            e.Handled = true;
            RoutedEventArgs newEventArgs = new RoutedEventArgs(ClickEvent);
            RaiseEvent(newEventArgs);
        }

        private void FBCButton_Click(object sender, RoutedEventArgs e)
        {
            Microsoft.Win32.OpenFileDialog openFileDlg = new Microsoft.Win32.OpenFileDialog();
            if (openFileDlg.ShowDialog() == true)
                this.FileName = openFileDlg.FileName;
            RiseClickEvent();
        }

        private void Control_MouseDown(object sender, MouseButtonEventArgs e)
        {
           // FBCTextBox.Text = FBCTextBox.Text + "sender: " + sender.ToString() + "\n";
           // FBCTextBox.Text = FBCTextBox.Text + "source: " + e.Source.ToString() + "\n\n";
        }
    }
}
