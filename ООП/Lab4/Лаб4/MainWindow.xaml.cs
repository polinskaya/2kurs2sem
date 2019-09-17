using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
using Microsoft.Win32;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.IO;
using System.Globalization;
namespace Лаб4
{

    public partial class MainWindow : Window
    {

        static int count = 1;
        static string buffer = "";
        bool b = false;

        public MainWindow()
        {
            InitializeComponent();

            CommandBinding cb = new CommandBinding();
            cb.Command = ApplicationCommands.New;
            cb.Executed += _New;
            New.CommandBindings.Add(cb);
            cb = new CommandBinding();
            cb.Command = ApplicationCommands.Save;
            cb.Executed += _Save;
            Save.CommandBindings.Add(cb);
            cb = new CommandBinding();
            cb.Command = ApplicationCommands.Open;
            cb.Executed += _Open;
            Open.CommandBindings.Add(cb);
            cb = new CommandBinding();
            cb.Command = ApplicationCommands.Copy;
            cb.Executed += _Copy;
            Copy.CommandBindings.Add(cb);
            cb = new CommandBinding();
            cb.Command = ApplicationCommands.Paste;
            cb.Executed += _Paste;
            Paste.CommandBindings.Add(cb);
            this.Title = "" + count;
            this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/Dictionary_eng.xaml") };

        }
        public void _New(object sender, ExecutedRoutedEventArgs e)
        {
            count++;
            MainWindow mw = new MainWindow();
            mw.Show();
            mw.Title = "text" + count;
            Run r = new Run();
            r.Text = "text" + count;
            FlowDocument fd = new FlowDocument();
            Paragraph p = new Paragraph();
            p.Inlines.Add(r);
            fd.Blocks.Add(p);
            mw.richTextBox.Document = fd;
        }
        public void _Save(object sender, ExecutedRoutedEventArgs e)
        {
            SaveFileDialog sfd = new SaveFileDialog();
            sfd.Filter = "Text (*.txt)| *.txt";
            if (sfd.ShowDialog() == true)
            {
                TextRange tr = new TextRange(richTextBox.Document.ContentStart, richTextBox.Document.ContentEnd);
                using (FileStream fs = new FileStream(sfd.FileName, FileMode.OpenOrCreate))
                {
                    tr.Save(fs, DataFormats.Text);
                    fs.Close();
                }

            }
        }
        public void _Open(object sender, ExecutedRoutedEventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Text (*.txt)| *.txt";
            if (ofd.ShowDialog() == true)
            {
                TextRange tr = new TextRange(richTextBox.Document.ContentStart, richTextBox.Document.ContentEnd);
                using (FileStream fs = new FileStream(ofd.FileName, FileMode.OpenOrCreate))
                {
                    tr.Load(fs, DataFormats.Text);
                }
            }
        }
        public void _Copy(object sender, ExecutedRoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            buffer = ts.Text;
        }

        public void _Paste(object sender, ExecutedRoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.Text = buffer;
        }

        private void Color_Blue(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Blue);
        }

        private void Color_White(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.White);
        }

        private void Color_Red(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Red);
        }

        private void Color_Yellow(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Yellow);
        }

        private void Color_Green(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Green);
        }

        private void Color_Orange(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Orange);
        }

        private void Color_Gray(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Gray);
        }

        private void Color_Violet(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Violet);
        }

        private void Color_Brown(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Brown);
        }

        private void Color_Black(object sender, RoutedEventArgs e)
        {

            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.Black);
        }

        private void Font_Calibri(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.FontFamilyProperty, new FontFamily("Calibri"));
        }

        private void Font_TimesNewRoman(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.FontFamilyProperty, new FontFamily("Times New Roman"));
        }

        private void Font_Georgia(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.FontFamilyProperty, new FontFamily("Georgia"));

        }

        private void Font_Helvetica(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            ts.ApplyPropertyValue(TextElement.FontFamilyProperty, new FontFamily("Helvetica"));

        }      

        private void B_Click(object sender, RoutedEventArgs e)
        {
            b = true;
            TextSelection ts = richTextBox.Selection;
            if (B.IsChecked == true)
                ts.ApplyPropertyValue(TextElement.FontWeightProperty, FontWeights.Bold);
            else ts.ApplyPropertyValue(TextElement.FontWeightProperty, FontWeights.Normal);
        }

        private void I_Click(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            if (I.IsChecked == true)
                ts.ApplyPropertyValue(TextElement.FontStyleProperty, FontStyles.Italic);
            else ts.ApplyPropertyValue(TextElement.FontStyleProperty, FontStyles.Normal);
        }

        private void U_Click(object sender, RoutedEventArgs e)
        {
            TextSelection ts = richTextBox.Selection;
            if (U.IsChecked == true)
                ts.ApplyPropertyValue(Run.TextDecorationsProperty, TextDecorations.Underline);
            else ts.ApplyPropertyValue(Run.TextDecorationsProperty, null);
        }
  
        private void richTextBox_MouseDown(object sender, MouseButtonEventArgs e)
        {
            RichTextBox rtb = (RichTextBox)sender;
            DragDrop.DoDragDrop(rtb, rtb.Selection.Text, DragDropEffects.Move);
        }

        private void CopyC_Click(object sender, RoutedEventArgs e)
        {
            _Copy(sender, (ExecutedRoutedEventArgs)e);
        }

        private void CloseC_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void DeleteC_Click(object sender, RoutedEventArgs e)
        {
            richTextBox.Document = new FlowDocument();
        }

        private void richTextBox_TextChanged_1(object sender, TextChangedEventArgs e)
        {
            if (b)
            {
                TextRange tr = new TextRange(richTextBox.Document.ContentStart, richTextBox.Document.ContentEnd);
                count_of_symbols.Content = tr.Text.Length;
                string[] words = tr.Text.Split(new char[] { ' ', ',', '.', '!', ':', '?', ';' }, StringSplitOptions.RemoveEmptyEntries);
                count_of_words.Content = words.Length - 1;
            }
        }

        private void EN_Click(object sender, RoutedEventArgs e)
        {
            this.Resources.Clear();
            if (EN.IsChecked == true)
            {
                this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/Dictionary_eng.xaml") };
            }
            else
            {
                this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/Dictionary_rus.xaml") };
            }
        }
        bool yes_no_undo = false;
        bool yes_no_rendo = false;

        private void Redo_Click(object sender, RoutedEventArgs e)
        {
            if (yes_no_rendo == false)
            {
                Redo.Background = Brushes.Coral;

                yes_no_rendo = true;
            }
            else
            {
               Redo.Background = Brushes.LightBlue;

                yes_no_rendo = false;
            }
            richTextBox.Redo();
        }

        private void Undo_Click(object sender, RoutedEventArgs e)
        {
            if (yes_no_undo == false)
            {
                undo.Background = Brushes.Coral;

                yes_no_undo = true;
            }
            else
            {
                undo.Background = Brushes.LightBlue;

                yes_no_undo = false;
            }
            richTextBox.Undo();
        }

        private void Window_Activated(object sender, EventArgs e)
        {

        }
    }
}

