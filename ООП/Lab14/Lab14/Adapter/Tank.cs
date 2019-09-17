using System.Windows.Controls;
using System.Windows.Media;
using Lab14.Composite;
using Lab14.Decorator;

namespace Lab14.Adapter
{
    public class Tank : Weapon, IWarmachine, IComponent
    {
        public string Title { get; set; }
        public void Attack(TextBlock box)
        {
            box.Text += $"{Name} attack.\n";
        }

        public Tank(string name) : base(name)
        {
            Title = name;
        }

        public override Brush GetColor()
        {
            return Brushes.Black;
        }

        public void Draw(TextBlock box)
        {
            box.Text += $"{Title} added.\n";
        }

        public IComponent Find(string title)
        {
            return title.Equals(Title) ? this : null;
        }
    }
}
