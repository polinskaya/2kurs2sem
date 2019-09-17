using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;



namespace WpfApp4
{
    /// <summary>
    /// Логика взаимодействия для UserControl2.xaml
    /// </summary>
    public partial class UserControl2 : UserControl
    {

        public UserControl2()
        {
            DataContext = new SomeClass();
            InitializeComponent();
        }

        public static readonly DependencyProperty SetTextProperty =
            DependencyProperty.Register("SetText", typeof(string), typeof(UserControl2), new
                PropertyMetadata("", new PropertyChangedCallback(OnSetTextChanged)));


        //2 - validatevaluecallback

        public string SetText
        {
            get { return (string)GetValue(SetTextProperty); }
            set { SetValue(SetTextProperty, value); }
        }

        private static void OnSetTextChanged(DependencyObject d,
           DependencyPropertyChangedEventArgs e)
        {
            UserControl2 UserControl2Control = d as UserControl2;
            UserControl2Control.OnSetTextChanged(e);
        }

        private void OnSetTextChanged(DependencyPropertyChangedEventArgs e)
        {
            txtbx1.Text = e.NewValue.ToString();
            MessageBox.Show(e.NewValue.ToString());
        }


        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Grid.SetRow(btn2, 2); // вторая строка
            Grid.SetColumn(btn2, 2); // второй столбец
        }

        //direct event
        private void Btn2_MouseEnter(object sender, MouseEventArgs e)
        {
            MessageBox.Show("it's a event --- " + sender.ToString());
        }

        //bubblin event
        private void Button_MouseDown(object sender, MouseButtonEventArgs e)
        {
            MessageBox.Show("it's a bubbling event");
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {

        }

        private void txtbx1_TextChanged(object sender, TextChangedEventArgs e)
        {

        }

        private void txtbx1_TextChanged_1(object sender, TextChangedEventArgs e)
        {

        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {

        }

    }

    public class SomeClass : DependencyObject
    {
        public string Name
        {
            get { return (string)GetValue(NameProperty); }
            set { SetValue(NameProperty, value); }
        }
        public static DependencyProperty NameProperty =
            DependencyProperty.Register("Name", typeof(string), typeof(UserControl2), new FrameworkPropertyMetadata(
                string.Empty,
                FrameworkPropertyMetadataOptions.None,
                new PropertyChangedCallback(OnValueChanged),
                new CoerceValueCallback(isNameValid2)
            ), new ValidateValueCallback(isNameValid));

        private static void OnMinReadingChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {

        }

        private static bool isNameValid(object value)
        {
            bool ret = true;
            string val = (string)value;

            if (!string.IsNullOrEmpty(val) && Regex.IsMatch(val, "[/!@#?/}[}{]"))
                ret = false;
            else
                ret = true;

            return ret;
        }

        public SomeClass()
        {
        }

        private static void OnValueChanged(DependencyObject obj, DependencyPropertyChangedEventArgs args)
        {
            //string o = (string)obj;
            NameProperty.DefaultMetadata.CoerceValueCallback = isNameValid2;
        }

        private static object isNameValid2(DependencyObject d, object value)
        {
            string val = (string)value;

            if (!string.IsNullOrEmpty(val) &&
                Regex.IsMatch(val, "[/!@#?/}[}{]"))
            {
                Regex rgx = new Regex("[/!@#?/}[}{]");
                return rgx.Replace(val, "");
            }
            return val;
        }

    }

    internal class HZ:DependencyObject
    {

        public string InnerText
        {
            get { return (string)GetValue(InnerTextProperty); }
            set { SetValue(InnerTextProperty, value); }
        }

        // Using a DependencyProperty as the backing store for InnerText.  This enables animation, styling, binding, etc...
        public static readonly DependencyProperty InnerTextProperty = DependencyProperty.Register("InnerText", typeof(string), typeof(UserControl2), new PropertyMetadata("DefaultInnerText"));
    }

    


}
