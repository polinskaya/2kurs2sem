using System.Windows;
using System.Windows.Controls;

namespace lab3
{
    /// <summary>
    /// Логика взаимодействия для UserControl2.xaml
    /// </summary>
    public partial class UserControl2 : UserControl
    {
        public UserControl2()
        {
            InitializeComponent();
        }

        private static void OnSetTextChanged(DependencyObject d,
           DependencyPropertyChangedEventArgs e)
        {
            UserControl2 UserControl2Control = d as UserControl2;
            UserControl2Control.OnSetTextChanged(e);
        }

        public static readonly DependencyProperty SetTextProperty =
         DependencyProperty.Register("SetText", typeof(string), typeof(UserControl2), new
            PropertyMetadata("Dependency Property", new PropertyChangedCallback(OnSetTextChanged), new CoerceValueCallback(CoerceText)), new ValidateValueCallback(CoerceTextValidate));

        public string SetText
        {
            get { return (string)GetValue(SetTextProperty); }
            set { SetValue(SetTextProperty, value); }
        }

    
        //заменяем все единицы на 2
        private static object CoerceText(DependencyObject d, object value)
        {
            string str = (string)SetTextProperty.DefaultMetadata.DefaultValue;
            if (value is string)
            {
                str = (string)value;
                str = str.Replace('1', '2');
            }

            return str;
        }

        //если в тексте есть собакa,то плохо
        private static bool CoerceTextValidate(object value)
        {
            if(value is string str)
            {
                return !str.Contains("@");
            }

            return false;
        }

        private void OnSetTextChanged(DependencyPropertyChangedEventArgs e)
        {
            tbTest.Content = e.NewValue.ToString();
        }
    }
}
