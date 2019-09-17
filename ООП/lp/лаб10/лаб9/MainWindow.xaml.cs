using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Threading;
using Newtonsoft.Json;


namespace лаб9
{
    public partial class MainWindow : Window
    {
        private string jsonfilepath = Directory.GetCurrentDirectory() + @"\json_file_store.json";



        private List<string> lastFilesList;
        private RichTextBox getCurrentRichTextBox
        {
            get
            {
                try { return (RichTextBox)((TabItem)tabControl.SelectedItem).Content; }
                catch { return null; }
            }
        }

        List<TabItem> list_TabItems;

        public MainWindow()
        {

            InitializeComponent();
            //lastFilesList = new List<string>();

            using (StreamReader sr = new StreamReader(jsonfilepath))
            {
                lastFilesList = JsonConvert.DeserializeObject<List<string>>(sr.ReadToEnd());
            }
            if (lastFilesList == null)
                lastFilesList = new List<string>();

            combobox_last_file.ItemsSource = lastFilesList;


            list_TabItems = new List<TabItem>();
            comboBox_fontstyle.SelectedItem = comboBox_fontstyle.Items[0];
            this.Icon = new BitmapImage(new Uri(@"D:\1.jpg"));
            

        }
     
        private void menuitem_newfile_Click(object sender, RoutedEventArgs e)
        {
            ///создать элемент контексного меню для таба
            Style MultiTriggerstyle = this.FindResource("MultiTriggerStyle") as Style;

            RichTextBox rtf = new RichTextBox();

           
            rtf.SelectionChanged += new RoutedEventHandler(CurrentRTB_SelectionChanged);
            rtf.TextChanged += new TextChangedEventHandler(textchanged);

            rtf.Style = MultiTriggerstyle;

            TabItem ti = new TabItem();
            ti.Content = rtf;
            ti.Header = "Window " + getNewNumberToTabItemHeader();
            CommandBinding combind = new CommandBinding();
            combind.Command = ApplicationCommands.Close;
            combind.Executed += CloseTabItem_Executed;

            ti.ContextMenu = GetContextMenuToTabItem();
            ti.MouseRightButtonDown += new MouseButtonEventHandler(tabitemmouserightdown);

            list_TabItems.Add(ti);
            tabControl.Items.Add(ti);
            tabControl.SelectedItem = ti;

        }

        private void textchanged(object sender, TextChangedEventArgs e)
        {
            textblock_charvalue.Text = (new TextRange(getCurrentRichTextBox.Document.ContentStart,
                getCurrentRichTextBox.Document.ContentEnd).Text.Length - 2).ToString();
        }

        private void CloseTabItem_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            tabControl.Focus();
            list_TabItems.Remove((TabItem)tabControl.SelectedItem);
            tabControl.Items.RemoveAt(tabControl.SelectedIndex);
        }


        private void CurrentRTB_SelectionChanged(object sender, RoutedEventArgs e)
        {
            object currentValue = getCurrentRichTextBox.Selection.GetPropertyValue(TextElement.FontWeightProperty);
            togglebutton_boldfont.IsChecked = (currentValue == DependencyProperty.UnsetValue) ?
                false
                : currentValue != null && currentValue.Equals(FontWeights.Bold);

            currentValue = getCurrentRichTextBox.Selection.GetPropertyValue(TextElement.FontStyleProperty);
            togglebutton_italicfont.IsChecked = (currentValue == DependencyProperty.UnsetValue) ?
                false
                : currentValue != null && currentValue.Equals(FontStyles.Italic);

            currentValue = getCurrentRichTextBox.Selection.GetPropertyValue(Inline.TextDecorationsProperty);
            togglebutton_underlinefont.IsChecked = (currentValue == DependencyProperty.UnsetValue) ?
                false
                : currentValue != null && currentValue.Equals(TextDecorations.Underline);


        }

    
        private void menuitem_open_Click(object sender, ExecutedRoutedEventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "RichText Files (*.rtf)|*.rtf";
            ofd.InitialDirectory = Directory.GetCurrentDirectory();

            if (ofd.ShowDialog() == true)
            {
                if (list_TabItems.Count == 0)
                    menuitem_newfile_Click(null, null);

                setRTBtext(ofd.FileName);
                getCurrentRichTextBox.ToolTip = ofd.FileName;
            }
        }


        private void tabControl_Drop(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] filepath = (string[])e.Data.GetData(DataFormats.FileDrop);

                foreach (var s in filepath)
                {
                    if (!Directory.Exists(s))
                    {
                        try
                        {
                            menuitem_newfile_Click(sender, e);

                            setRTBtext(s);
                            (getCurrentRichTextBox.Parent as TabItem).ToolTip = s;

                        }
                        catch
                        {
                            CloseTabItem_Executed(sender, null);
                        }

                    }
                }
            }
        }

        private void ColorCheng(object sender, RoutedEventArgs e)
        {
            System.Windows.Forms.ColorDialog MyDialog = new System.Windows.Forms.ColorDialog();
            if (MyDialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                ColorButton.Background = new SolidColorBrush(System.Windows.Media.Color.FromArgb(MyDialog.Color.A, MyDialog.Color.R, MyDialog.Color.G, MyDialog.Color.B));
                getCurrentRichTextBox.Selection.ApplyPropertyValue(TextElement.ForegroundProperty, new SolidColorBrush(System.Windows.Media.Color.FromArgb(MyDialog.Color.A, MyDialog.Color.R, MyDialog.Color.G, MyDialog.Color.B)));
                getCurrentRichTextBox.Focus();
            }
        }

        private void setRTBtext(string filename)
        {
            if (lastFilesList.Count > 5)
                lastFilesList.RemoveAt(0);
            lastFilesList.Add(filename);

            JsonSerializer serializer = new JsonSerializer();

            using (StreamWriter sw = new StreamWriter(jsonfilepath))
            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, lastFilesList);
            }

            combobox_last_file.ItemsSource = lastFilesList;
            combobox_last_file.Items.Refresh();

            getCurrentRichTextBox.Focus();

            using (FileStream fs = new FileStream(filename, FileMode.Open))
            {
                RichTextBox rtf = getCurrentRichTextBox;

                TextRange doc = new TextRange(rtf.Document.ContentStart, rtf.Document.ContentEnd);

                doc.Load(fs, DataFormats.Rtf);
            }
        }

        private void save(object sender, ExecutedRoutedEventArgs e)
        {

            SaveFileDialog ofd = new SaveFileDialog();

            ofd.CreatePrompt = false;
            ofd.OverwritePrompt = false;

            ofd.Filter = "Rich Text Format (*.rtf)|*.rtf";
            ofd.InitialDirectory = Directory.GetCurrentDirectory();

            if (ofd.ShowDialog() == true)
            {
                RichTextBox rtf = getCurrentRichTextBox;
                TextRange doc = new TextRange(rtf.Document.ContentStart, rtf.Document.ContentEnd);

                using (FileStream fs = new FileStream(ofd.FileName, FileMode.Create))
                {
                    doc.Save(fs, DataFormats.Rtf);
                }
            }
        }

        private void cansave(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = list_TabItems.Count != 0;
        }

        protected virtual ContextMenu GetContextMenuToTabItem()
        {
            ContextMenu cm = new ContextMenu();


            CommandBinding bind_close =
                new CommandBinding(ApplicationCommands.Close);
            bind_close.Executed += CloseTabItem_Executed;

            MenuItem mi_Close = new MenuItem();
            mi_Close.Header = "Close";
            mi_Close.Command = ApplicationCommands.Close;
            mi_Close.CommandBindings.Add(bind_close);

            MenuItem mi_Copy = new MenuItem();
            mi_Copy.Header = "Copy";
            mi_Copy.Command = ApplicationCommands.Save;

            cm.Items.Add(mi_Close);
            cm.Items.Add(mi_Copy);

            return cm;
        }
        private void tabitemmouserightdown(object sender, MouseButtonEventArgs e)
        {
            TabItem ti = sender as TabItem;
            ti.Focus();
        }
        private int getNewNumberToTabItemHeader()
        {
            int i = -1;
            var plnumbers = list_TabItems.Select(s => { string ss = s.Header as string; return int.Parse(ss.Split(' ')[1]); }).ToList<int>();
            while (i < plnumbers.Count)
                if (!plnumbers.Contains(++i))
                    break;
            return i;
        }

        private void slider_fontsize_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (e.NewValue == 0)
                return;
            getCurrentRichTextBox?.Selection.ApplyPropertyValue(TextElement.FontSizeProperty, e.NewValue);
        }

        private void comboBox_fontstyle_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            getCurrentRichTextBox?.Selection.ApplyPropertyValue(TextElement.FontFamilyProperty, e.AddedItems[0]);
        }

        private void eng_Checked(object sender, RoutedEventArgs e)
        {
            rus.IsChecked = false;
            this.Resources.MergedDictionaries.Remove(new ResourceDictionary() { Source = new Uri("pack://application:,,,/res/lang_ru.xaml") });
            this.Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = new Uri("pack://application:,,,/res/lang.xaml") });
        }

        private void rus_Checked(object sender, RoutedEventArgs e)
        {
            eng.IsChecked = false;
            this.Resources.MergedDictionaries.Remove(new ResourceDictionary() { Source = new Uri("pack://application:,,,/res/lang.xaml") });
            this.Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = new Uri("pack://application:,,,/res/lang_ru.xaml") });
        }
    
        private void darkstyle_Checked(object sender, RoutedEventArgs e)
        {
            lightstyle.IsChecked = false;
            this.Resources.MergedDictionaries.Remove(new ResourceDictionary() { Source = new Uri("pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Light.xaml") });
            this.Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = new Uri("pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Dark.xaml") });

        }

        private void lightstyle_Checked(object sender, RoutedEventArgs e)
        {
            darkstyle.IsChecked = false;
            this.Resources.MergedDictionaries.Remove(new ResourceDictionary() { Source = new Uri("pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Dark.xaml") });
            this.Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = new Uri("pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Light.xaml") });

        }

        private void combobox_last_file_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            menuitem_newfile_Click(sender, e);

            setRTBtext((string)e.AddedItems[0]);
            (getCurrentRichTextBox.Parent as TabItem).ToolTip = (string)e.AddedItems[0];

            getCurrentRichTextBox.Focus();
        }
    }
}





