using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Documents;
using System.IO;
using Microsoft.Win32;
using Path = System.IO.Path;
namespace lab3
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        static int count = 1;
        static string buffer = "";
        bool b = false;
        public MainWindow()
        {
            InitializeComponent();
            this.Cursor = new Cursor("D:\\Water.ani");
           
            richTextBox.FontSize = 12;
            richTextBox.FontFamily = new FontFamily("Calibri");
            FontFamilyComb.Text = "Calibri";

            Sli.ValueChanged += Sli_ValueChanged;
            richTextBox.TextChanged += Control_Changed;

            CommandBinding commandCut = new CommandBinding();
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

            //RoutedUiCommands
            InputGestureCollection inputs = new InputGestureCollection();
            inputs.Add(new KeyGesture(Key.D1, ModifierKeys.Control, "Ctrl + 1"));
            var command1 = new RoutedUICommand("Redo1", "Redo1", typeof(MainWindow), inputs);

            this.CommandBindings.Add(new CommandBinding(command1, DoRedo));

            InputGestureCollection inputs1 = new InputGestureCollection();
            inputs1.Add(new KeyGesture(Key.D2, ModifierKeys.Control, "Ctrl + 2"));
            var command2 = new RoutedUICommand("Undo1", "Undo1", typeof(MainWindow), inputs1);
            this.CommandBindings.Add(new CommandBinding(command2, DoUndo));

            UndoButton.Command = command2;
            RedoButton.Command = command1;

            this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/DictionaryEN.xaml") };

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
        private void Click_Copy(object sender, RoutedEventArgs e)
        {
            richTextBox.Copy();
        }

        private void Click_Insert(object sender, RoutedEventArgs e)
        {
            richTextBox.Paste();
        }

        private void Click_Cut(object sender, RoutedEventArgs e)
        {
            richTextBox.Cut();
        }

        private void ColorCheng(object sender, RoutedEventArgs e)
        {
            System.Windows.Forms.ColorDialog MyDialog = new System.Windows.Forms.ColorDialog();
            if (MyDialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                ColorButton.Background = new SolidColorBrush(System.Windows.Media.Color.FromArgb(MyDialog.Color.A, MyDialog.Color.R, MyDialog.Color.G, MyDialog.Color.B));
                richTextBox.Selection.ApplyPropertyValue(TextElement.ForegroundProperty, new SolidColorBrush(System.Windows.Media.Color.FromArgb(MyDialog.Color.A, MyDialog.Color.R, MyDialog.Color.G, MyDialog.Color.B)));
                richTextBox.Focus();
            }
        }
        private void txtTarget_Drop(object sender, DragEventArgs e)
        {
            ((RichTextBox)sender).AppendText((string)e.Data.GetData(DataFormats.Text));
        }
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var s = richTextBox.Selection.GetPropertyValue(TextElement.FontWeightProperty);

            if (s.ToString() == "Normal")
                richTextBox.Selection.ApplyPropertyValue(TextElement.FontWeightProperty, FontWeights.Bold);
            else
                richTextBox.Selection.ApplyPropertyValue(TextElement.FontWeightProperty, FontWeights.Normal);

            richTextBox.Focus();
        }
        void Sli_ValueChanged(object sender, EventArgs e)
        {
            richTextBox.Selection.ApplyPropertyValue(FontSizeProperty, Sli.Value);
            richTextBox.Focus();
        }
        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            var s = richTextBox.Selection.GetPropertyValue(TextElement.FontStyleProperty);

            if (s.ToString() == FontStyles.Normal.ToString())
                richTextBox.Selection.ApplyPropertyValue(TextElement.FontStyleProperty, FontStyles.Italic);
            else
                richTextBox.Selection.ApplyPropertyValue(TextElement.FontStyleProperty, FontStyles.Normal);

            richTextBox.Focus();
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            var s = richTextBox.Selection.GetPropertyValue(TextBlock.TextProperty);
            System.Windows.MessageBox.Show(s.ToString());
            if (s.ToString() == TextDecorations.OverLine.ToString())
                richTextBox.Selection.ApplyPropertyValue(TextBlock.TextDecorationsProperty, TextDecorations.Underline);
            else
                richTextBox.Selection.ApplyPropertyValue(TextBlock.TextDecorationsProperty, TextDecorations.OverLine);

            richTextBox.Focus();
        }

        private void Load_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "RichText Files (*.rtf)|*.rtf|All files (*.*)|*.*";

            if (ofd.ShowDialog() == true)
            {
                TextRange doc = new TextRange(richTextBox.Document.ContentStart, richTextBox.Document.ContentEnd);
                using (FileStream fs = new FileStream(ofd.FileName, FileMode.Open))
                {
                    if (Path.GetExtension(ofd.FileName).ToLower() == ".rtf")
                        doc.Load(fs, DataFormats.Rtf);
                    else if (Path.GetExtension((ofd.FileName).ToLower()) == ".txt")
                        doc.Load(fs, DataFormats.Text);
                    else
                        doc.Load(fs, DataFormats.Xaml);

                }
            }
        }
        void Control_Changed(object sender, EventArgs e)
        {
            TextRange txt = new TextRange(richTextBox.Document.ContentStart, richTextBox.Document.ContentEnd);
            Control.Text = "Количество введённых символов: " + (txt.Text.Length - 2).ToString();
        }
        private void newFile(object sender, RoutedEventArgs e)
        {
            richTextBox.Document.Blocks.Clear();
        }

        bool yes_no_undo = false;
        bool yes_no_rendo = false;

        private void Redo_Click(object sender, RoutedEventArgs e)
        {
            DoRedo(sender, EventArgs.Empty as ExecutedRoutedEventArgs);
        }

        private void DoRedo(object sender, ExecutedRoutedEventArgs e)
        {
            if (yes_no_rendo == false)
            {
                RedoButton.Background = Brushes.Coral;

                yes_no_rendo = true;
            }
            else
            {
                RedoButton.Background = Brushes.LightBlue;

                yes_no_rendo = false;
            }
            richTextBox.Redo();
        }

        private void Undo_Click(object sender, RoutedEventArgs e)
        {
            DoUndo(sender, EventArgs.Empty as ExecutedRoutedEventArgs);
        }

        private void DoUndo(object sender, ExecutedRoutedEventArgs e)
        {
            if (yes_no_undo == false)
            {
                UndoButton.Background = Brushes.Yellow;
                yes_no_undo = true;
            }
            else
            {
                yes_no_undo = false;
                UndoButton.Background = Brushes.Green;
            }
            richTextBox.Undo();
        }

        private void EN_Click(object sender, RoutedEventArgs e)
        {
            this.Resources.Clear();
            if (EN.IsChecked == true)
            {
                this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/DictionaryEN.xaml") };
            }
            else
            {
                this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/DictionaryRu.xaml") };
            }
        }
        private void Style_Click(object sender, RoutedEventArgs e)
        {
            this.Resources.Clear();
            if (Style.IsChecked == true)
            {
                this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/1.xaml") };
            }
            else
            {
                this.Resources = new ResourceDictionary() { Source = new Uri("pack://application:,,,/2.xaml") };
            }
        }

        //логика ивента 
        private void UserControl1_OnPathUpdeted(object sender, RoutedEventArgs e)
        {
            Console.WriteLine("sdfgf");
        }
    }
}
